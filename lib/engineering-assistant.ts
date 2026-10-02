import { buildLocalEngineeringReply, validateEngineeringInput, validEngineeringReply, type EngineeringMessage, type EngineeringReply } from "./engineering-contract";
export type { EngineeringMessage, EngineeringReply, EngineeringCalculation, EngineeringBomItem, EngineeringSource } from "./engineering-contract";

export class EngineeringAssistantError extends Error {
  constructor(public code: "sign-in" | "limit" | "unavailable" | "invalid" | "timeout", message: string) { super(message); this.name = "EngineeringAssistantError"; }
}
export function engineeringEndpoint(value = process.env.NEXT_PUBLIC_ENGINEERING_API_URL?.trim() || ""): string {
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash && url.pathname === "/chat" ? url.toString() : ""; } catch { return ""; }
}
export function isEngineeringAiConfigured(): boolean { return !!engineeringEndpoint(); }

export async function askEngineeringAssistant({ message, history = [], signal }: { message: string; history?: EngineeringMessage[]; signal?: AbortSignal }): Promise<EngineeringReply> {
  signal?.throwIfAborted();
  let input;
  try { input = validateEngineeringInput({ message, history }); } catch { throw new EngineeringAssistantError("invalid", "Use a message up to 3,000 characters and a shorter conversation."); }
  const endpoint = engineeringEndpoint();
  if (!endpoint) return buildLocalEngineeringReply(input.message);
  const controller = new AbortController();
  const cancel = () => controller.abort(signal?.reason);
  signal?.addEventListener("abort", cancel, { once: true });
  const timer = setTimeout(() => controller.abort(new EngineeringAssistantError("timeout", "The engineering assistant timed out. Please try again.")), 25000);
  const checkCancelled = () => controller.signal.throwIfAborted();
  try {
    const { getFirebaseClient } = await import("./firebase");
    checkCancelled();
    const auth = getFirebaseClient().auth;
    await auth.authStateReady();
    checkCancelled();
    const user = auth.currentUser;
    if (!user?.emailVerified) throw new EngineeringAssistantError("sign-in", "Sign in with a verified customer account to use the connected engineering assistant. The local worksheet remains available in Idea Studio.");
    const token = await user.getIdToken();
    checkCancelled();
    if (auth.currentUser?.uid !== user.uid) throw new EngineeringAssistantError("sign-in", "Your account changed. Please retry after signing in.");
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(input), signal: controller.signal, credentials: "omit", cache: "no-store", redirect: "error" });
    if (!response.ok) throw new EngineeringAssistantError(response.status === 401 ? "sign-in" : response.status === 429 ? "limit" : "unavailable", response.status === 429 ? "Today's shared assistant allowance has been reached. Continue with the local Idea Studio worksheet." : response.status === 401 ? "Please sign in again with a verified account." : "The connected assistant is unavailable. Your message was not saved by the website; you can use the local Idea Studio worksheet.");
    const reader = response.body?.getReader();
    if (!reader) throw new EngineeringAssistantError("unavailable", "The assistant returned an empty reply.");
    let bytes = 0, raw = "";
    const decoder = new TextDecoder();
    try {
      while (true) { const next = await reader.read(); if (next.done) break; bytes += next.value.byteLength; if (bytes > 40000) { await reader.cancel(); throw new EngineeringAssistantError("invalid", "The reply exceeded the supported size."); } raw += decoder.decode(next.value, { stream: true }); }
    } finally { reader.releaseLock(); }
    checkCancelled();
    if (auth.currentUser?.uid !== user.uid) throw new EngineeringAssistantError("sign-in", "Your account changed. Please retry after signing in.");
    const result: unknown = JSON.parse(raw + decoder.decode());
    if (!validEngineeringReply(result) || result.source !== "ai") throw new EngineeringAssistantError("invalid", "The assistant returned an unsupported response. Please refine the question and retry.");
    return result;
  } catch (error) {
    if (controller.signal.aborted) throw controller.signal.reason;
    if (error instanceof EngineeringAssistantError) throw error;
    throw new EngineeringAssistantError("unavailable", "The assistant could not be reached. Please retry or use the local Idea Studio worksheet.");
  } finally { clearTimeout(timer); signal?.removeEventListener("abort", cancel); }
}
