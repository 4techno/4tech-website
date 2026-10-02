import { createHash, randomUUID } from "node:crypto";

// Resend retains idempotency keys for 24 hours. Stop automated retries earlier:
// an ambiguous response must never become a new send after that window expires.
export const RETRY_WINDOW_MS = 23 * 60 * 60 * 1000;
export const LEASE_MS = 90_000;
export const FRESH_EVENT_MS = 60 * 60 * 1000;
const terminal = new Set(["sent", "skipped", "failed", "uncertain"]);
const emailPattern = /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/;

export class DeliveryError extends Error {
  constructor(code, retryable = false) {
    super(code); this.name = "DeliveryError"; this.code = code; this.retryable = retryable;
  }
}
export function deliveryKey(projectId, uid, notificationId) {
  return createHash("sha256").update(`${projectId}/users/${uid}/notifications/${notificationId}`).digest("hex");
}
export function validateMailConfig(config) {
  const url = new URL(config.siteUrl);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new DeliveryError("invalid-site-origin");
  if (!emailPattern.test(config.from)) throw new DeliveryError("invalid-sender");
  if (!config.apiKey || /\s/.test(config.apiKey)) throw new DeliveryError("missing-provider-secret");
  return url.origin;
}
export function recipientAllowed(user, preference) {
  return user && user.disabled !== true && user.emailVerified === true && emailPattern.test(user.email ?? "") && preference?.emailEnabled === true;
}
export function makeMail(user, origin, from, requestId) {
  // Deliberately omit customer/project content. Emails only link back to the
  // authenticated workspace; document data cannot inject recipients or links.
  return {
    from,
    to: [user.email],
    subject: "A new update in your 4tech workspace",
    text: `A project update or quotation is ready in your 4tech workspace.\n\nSign in to view it:\n${origin}/account#request-${encodeURIComponent(requestId)}\n\nYou receive these emails because you enabled email updates. You can turn them off in Notifications in your account.`,
  };
}

// The store atomically serializes claims by notification key. All recipients are
// resolved from Firebase Auth, never from an editable profile or notification.
export async function deliverNotification(event, services, config) {
  if (config.enabled !== true) return "disabled";
  const origin = validateMailConfig(config);
  const key = deliveryKey(event.projectId, event.uid, event.id);
  const now = services.now();
  const prior = await services.store.get(key);
  if (prior && terminal.has(prior.status)) return prior.status;
  if (!prior && (!Number.isFinite(event.createdAt) || event.createdAt < now - FRESH_EVENT_MS || event.createdAt > now + 60_000)) return "stale-event";
  if (typeof event.requestId !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(event.requestId)) return "invalid-event";

  const [user, preference] = await Promise.all([services.getUser(event.uid), services.getPreference(event.uid)]);
  if (!recipientAllowed(user, preference)) {
    await services.store.skip(key, now, "not-opted-in-or-unverified");
    return "skipped";
  }
  const candidate = makeMail(user, origin, config.from, event.requestId);
  const token = randomUUID();
  const claim = await services.store.claim(key, { now, token, candidate, window: RETRY_WINDOW_MS, lease: LEASE_MS });
  if (claim.status === "busy") throw new DeliveryError("delivery-busy", true);
  if (claim.status !== "claimed") return claim.status;
  // A retry reuses the exact original payload. If the Auth email changed, do not
  // send to the old address and do not reuse the same key for a new recipient.
  if (claim.payload.to[0] !== user.email) {
    await services.store.finish(key, token, { status: "skipped", reason: "recipient-changed", completedAt: services.now() });
    return "skipped";
  }
  try {
    // Recheck consent immediately before the external operation.
    const [freshUser, freshPreference] = await Promise.all([services.getUser(event.uid), services.getPreference(event.uid)]);
    if (!recipientAllowed(freshUser, freshPreference) || freshUser.email !== claim.payload.to[0]) {
      await services.store.finish(key, token, { status: "skipped", reason: "consent-or-account-changed", completedAt: services.now() });
      return "skipped";
    }
    const providerId = await services.send(claim.payload, key, config.apiKey);
    await services.store.finish(key, token, { status: "sent", providerId, completedAt: services.now() });
    return "sent";
  } catch (error) {
    const retryable = !(error instanceof DeliveryError) || error.retryable;
    // Do not log provider response bodies, email addresses, tokens, or content.
    await services.store.finish(key, token, {
      status: retryable ? "pending" : "failed", leaseUntil: 0,
      reason: error instanceof DeliveryError ? error.code : "delivery-interrupted",
    });
    if (retryable) throw new DeliveryError("retry-delivery", true);
    return "failed";
  }
}

export async function sendWithResend(payload, key, apiKey, fetcher = fetch) {
  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": key },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new DeliveryError(`provider-${response.status}`, response.status === 429 || response.status === 409 || response.status >= 500);
  const result = await response.json();
  if (typeof result.id !== "string" || result.id.length > 200) throw new DeliveryError("provider-invalid-response", true);
  return result.id;
}
