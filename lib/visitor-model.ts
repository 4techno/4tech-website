export type VisitorConsent = { version: 2; analytics: boolean; identify: boolean; savedAt: number };
// Version 2 asks afresh before collecting email, sign-ins and coarse device context.
export const VISITOR_CONSENT_KEY = "4tech-visitor-consent-v2";
export const VISITOR_SESSION_KEY = "4tech-visitor-session-v1";
export const CONSENT_LIFETIME = 180 * 86400000;
export type DeviceClass = "Desktop" | "Mobile" | "Tablet" | "Unknown";
export type ViewportClass = "Compact" | "Medium" | "Wide" | "Unknown";

/** Transient hints only: never persist or transmit the user-agent or exact dimensions. */
export function coarseVisitorDevice(userAgent: string, width: number, touchPoints = 0): { device: DeviceClass; viewport: ViewportClass } {
  const viewport: ViewportClass = !Number.isFinite(width) || width <= 0 ? "Unknown" : width < 768 ? "Compact" : width < 1200 ? "Medium" : "Wide";
  const device: DeviceClass = !userAgent ? "Unknown" : /iPad|Tablet/i.test(userAgent) || (/Macintosh/i.test(userAgent) && touchPoints > 1) || (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent)) ? "Tablet" : /Mobile|iPhone|iPod/i.test(userAgent) ? "Mobile" : "Desktop";
  return { device, viewport };
}

export function mayRecordSignIn(rawConsent: string | null, verified: boolean, now = Date.now()): boolean {
  const consent = readVisitorConsent(rawConsent, now);
  return consent?.analytics === true && consent.identify && verified;
}

export function readVisitorConsent(raw: string | null, now = Date.now()): VisitorConsent | null {
  try {
    const value = JSON.parse(raw || "null");
    if (!value || value.version !== 2 || typeof value.analytics !== "boolean" || typeof value.identify !== "boolean" || typeof value.savedAt !== "number" || !Number.isFinite(value.savedAt) || value.savedAt > now || now - value.savedAt > CONSENT_LIFETIME) return null;
    return { version: 2, analytics: value.analytics, identify: value.analytics && value.identify, savedAt: value.savedAt };
  } catch { return null; }
}

// No query strings, fragments, customer workspaces, form data or arbitrary URLs.
export function publicAnalyticsPath(path: string): string | null {
  const clean = path.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  return /^(\/|\/(portfolio|resume|projects|team|founder|co-founder|ideas)|\/(projects|team|portfolio|resume)\/[a-z0-9-]{1,90})$/.test(clean) ? clean : null;
}

export function mayRecordVisitorEvent(rawConsent: string | null, path: string, identify: boolean, verified: boolean, now = Date.now()): boolean {
  const consent = readVisitorConsent(rawConsent, now);
  return !!publicAnalyticsPath(path) && consent?.analytics === true && (!identify || (consent.identify && verified));
}

export type OrderQuote = { status: string; amountPaise: number; currency: string };
export function summarizeOrders<T extends OrderQuote>(quotes: T[]) {
  const accepted = quotes.filter(quote => quote.status === "Accepted" && quote.currency === "INR" && Number.isSafeInteger(quote.amountPaise) && quote.amountPaise > 0);
  return { accepted, quotedValuePaise: accepted.reduce((total, quote) => total + quote.amountPaise, 0), pending: quotes.filter(quote => quote.status === "Sent").length };
}
