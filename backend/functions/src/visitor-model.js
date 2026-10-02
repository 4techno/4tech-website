import { createHash } from "node:crypto";
export const VISITOR_LIMITS = { perSession: 50, cooldownMs: 30000, dailyEvents: 5000, retentionMs: 30 * 86400000 };
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
function context(data) {
  const device = data.device ?? "Unknown", viewport = data.viewport ?? "Unknown";
  if (!["Desktop", "Mobile", "Tablet", "Unknown"].includes(device) || !["Compact", "Medium", "Wide", "Unknown"].includes(viewport)) throw new Error("Invalid coarse context.");
  return { device, viewport };
}
const safeText = (value, max) => typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max) : "";
export function validateVisitorEvent(data, auth, now = Date.now()) {
  if (!data || Object.keys(data).some(key => !["sessionId", "path", "identify", "consentVersion", "device", "viewport"].includes(key)) || data.consentVersion !== 2 || typeof data.identify !== "boolean") throw new Error("Invalid consent record.");
  if (typeof data.sessionId !== "string" || !uuid.test(data.sessionId)) throw new Error("Invalid session.");
  if (typeof data.path !== "string" || !/^(\/|\/(portfolio|resume|projects|team|founder|co-founder|ideas)|\/(projects|team|portfolio|resume)\/[a-z0-9-]{1,90})$/.test(data.path)) throw new Error("This page is not measured.");
  const identified = data.identify && auth?.token?.email_verified === true && typeof auth.uid === "string";
  const uid = identified ? auth.uid : null;
  // Only a name attested by the auth token; payload-supplied names are rejected.
  const name = identified ? safeText(auth.token.name, 80) : "";
  const day = new Date(now).toISOString().slice(0, 10);
  const id = createHash("sha256").update(`${day}:${uid || "anonymous"}:${data.sessionId}`).digest("hex");
  return { id, day, path: data.path, identified, uid, displayName: name, email: identified ? safeText(auth.token.email, 254) : "", ...context(data), consentVersion: 2, now, expiresAt: now + VISITOR_LIMITS.retentionMs };
}
/** A browser-observed event backed by a recent signed Firebase token, not an exhaustive IAM audit. */
export function validateSignInEvent(data, auth, now = Date.now()) {
  if (!data || Object.keys(data).some(key => !["attemptId", "identify", "consentVersion", "device", "viewport"].includes(key)) || data.consentVersion !== 2 || data.identify !== true || !uuid.test(data.attemptId || "")) throw new Error("Identity sharing is required.");
  if (!auth?.uid || auth.token?.email_verified !== true || !safeText(auth.token.email, 254)) throw new Error("A verified identity is required.");
  const authTime = auth.token.auth_time * 1000, provider = auth.token.firebase?.sign_in_provider;
  if (!Number.isSafeInteger(authTime) || authTime > now || now - authTime > 300000 || !["google.com", "password"].includes(provider)) throw new Error("A recent supported sign-in is required.");
  // Client attempt IDs cannot manufacture more events from the same signed auth_time.
  const id = createHash("sha256").update(`${auth.uid}:${authTime}`).digest("hex");
  return { id, day: new Date(now).toISOString().slice(0, 10), uid: auth.uid, displayName: safeText(auth.token.name, 80), email: safeText(auth.token.email, 254), provider, authTime, now, expiresAt: now + VISITOR_LIMITS.retentionMs, source: "client-observed", ...context(data) };
}
export function planVisitorWrite(event, previous, daily) {
  if ((daily?.views || 0) >= VISITOR_LIMITS.dailyEvents) return { accepted: false, reason: "capacity" };
  if (previous && (previous.views >= VISITOR_LIMITS.perSession || event.now - previous.lastSeen < VISITOR_LIMITS.cooldownMs || previous.lastPath === event.path)) return { accepted: false, reason: "duplicate" };
  return { accepted: true, first: !previous, views: (previous?.views || 0) + 1, identified: event.identified, firstSeen: previous?.firstSeen || event.now };
}
