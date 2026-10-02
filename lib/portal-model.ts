export const projectStatuses = ["Submitted", "Reviewing", "Planning", "In progress", "Ready for review", "Completed", "On hold"] as const;
export const mediaCategories = ["personal", "business"] as const;
export type ProjectStatus = typeof projectStatuses[number];
export type MediaCategory = typeof mediaCategories[number];
export type QuoteStatus = "Sent" | "Accepted" | "Declined";
export type QuoteInput = { title: string; scope: string; amount: string; terms: string; validUntil: string };
export type PortalQuote = { id: string; title: string; scope: string; amountPaise: number; currency: "INR"; terms: string; status: QuoteStatus; validUntil: number; createdAt: number | null; respondedAt: number | null };
export type PortalUpdate = { id: string; message: string; status: ProjectStatus; createdAt: number | null };
export type PortalFile = { id: string; name: string; storagePath: string; contentType: string; size: number; createdAt: number | null };
export type PortalNotification = { id: string; title: string; body: string; requestId: string; read: boolean; createdAt: number | null };

export function timestampMillis(value: unknown): number | null {
  if (value && typeof value === "object" && "toMillis" in value && typeof value.toMillis === "function") {
    try {
      const result: unknown = value.toMillis();
      return typeof result === "number" && Number.isFinite(result) && Math.abs(result) <= 8.64e15 ? result : null;
    } catch { return null; }
  }
  return null;
}
export function formatPortalDate(value: number | null): string {
  return value === null ? "Awaiting confirmation" : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(value);
}
export function formatMoney(amountPaise: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amountPaise / 100);
}
export function parseAmountPaise(value: string): number {
  if (!/^\d{1,8}(\.\d{1,2})?$/.test(value.trim())) throw new Error("Enter a positive amount with at most two decimal places.");
  const amount = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(amount) || amount < 100 || amount > 1000000000) throw new Error("Quotation amount must be between ₹1 and ₹1,00,00,000.");
  return amount;
}
export function validateQuote(input: QuoteInput, now = Date.now()) {
  const title = input.title.trim(), scope = input.scope.trim(), terms = input.terms.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.validUntil)) throw new Error("Choose a valid calendar date.");
  const validUntil = new Date(`${input.validUntil}T23:59:59+05:30`).getTime();
  if (Number.isFinite(validUntil) && new Date(validUntil + 330 * 60 * 1000).toISOString().slice(0, 10) !== input.validUntil) throw new Error("Choose a valid calendar date.");
  if (title.length < 3 || title.length > 120) throw new Error("Add a quotation title between 3 and 120 characters.");
  if (scope.length < 10 || scope.length > 6000) throw new Error("Describe the quotation scope using 10 to 6,000 characters.");
  if (terms.length < 10 || terms.length > 4000) throw new Error("Add payment and delivery terms using 10 to 4,000 characters.");
  if (!Number.isFinite(validUntil) || validUntil <= now || validUntil > now + 366 * 86400000) throw new Error("Choose a validity date within the next year.");
  return { title, scope, terms, amountPaise: parseAmountPaise(input.amount), validUntil };
}
const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
export function validateUpload(file: { name: string; size: number; type: string }, imagesOnly: boolean) {
  if (file.size <= 0 || file.size > (imagesOnly ? 8 : 10) * 1024 * 1024) throw new Error(`Choose a non-empty file smaller than ${imagesOnly ? 8 : 10} MB.`);
  if (!imageTypes.has(file.type) && (imagesOnly || file.type !== "application/pdf")) throw new Error(imagesOnly ? "Use a JPG, PNG, WebP or AVIF image." : "Use a PDF, JPG, PNG, WebP or AVIF file.");
  if (!file.name || file.name.length > 180) throw new Error("Use a file name shorter than 180 characters.");
}
export function safeFileName(value: string) {
  return value.replace(/[\\/\u0000-\u001f\u007f]/g, "_").slice(0, 180);
}
