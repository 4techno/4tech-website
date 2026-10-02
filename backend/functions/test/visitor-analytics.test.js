import test from "node:test";
import assert from "node:assert/strict";
import { validateVisitorEvent, validateSignInEvent, planVisitorWrite, VISITOR_LIMITS } from "../src/visitor-model.js";
const now = Date.parse("2026-09-30T12:00:00Z");
const input = { sessionId: "041a736d-a382-4164-911c-77e6b3816cbe", path: "/projects/antenna", identify: false, consentVersion: 2 };
const auth = { uid: "customer-1", token: { name: "Alice Example", email_verified: true } };
test("anonymous or nonidentifying visits never retain an account name or UID", () => {
  for (const session of [null, auth]) {
    const event = validateVisitorEvent(input, session, now);
    assert.equal(event.identified, false); assert.equal(event.uid, null); assert.equal(event.displayName, "");
  }
});
test("identification requires explicit consent and a verified identity", () => {
  const event = validateVisitorEvent({ ...input, identify: true }, auth, now);
  assert.equal(event.displayName, "Alice Example"); assert.equal(event.uid, "customer-1");
  assert.equal(validateVisitorEvent({ ...input, identify: true }, { ...auth, token: { ...auth.token, email_verified: false } }, now).uid, null);
  assert.notEqual(event.id, validateVisitorEvent(input, auth, now).id);
  assert.notEqual(event.id, validateVisitorEvent({ ...input, identify: true }, { ...auth, uid: "other" }, now).id);
});
test("private routes, query strings, forged names and absent consent are rejected", () => {
  for (const path of ["/owner", "/account", "/account?name=Alice", "/projects/antenna?email=x", "https://outside.invalid/", "/projects/../owner"]) assert.throws(() => validateVisitorEvent({ ...input, path }, auth, now));
  for (const patch of [{ displayName: "Forged" }, { ip: "127.0.0.1" }, { consentVersion: 0 }, { identify: "yes" }, { sessionId: "bad" }]) assert.throws(() => validateVisitorEvent({ ...input, ...patch }, auth, now));
});
test("duplicate events, cooldown and bounded sessions protect counts", () => {
  const event = validateVisitorEvent(input, null, now);
  assert.equal(planVisitorWrite(event, null, null).first, true);
  assert.equal(planVisitorWrite(event, { views: 1, lastSeen: now - 1000, lastPath: "/" }, null).accepted, false);
  assert.equal(planVisitorWrite(event, { views: 1, lastSeen: now - 60000, lastPath: event.path }, null).accepted, false);
  assert.equal(planVisitorWrite(event, { views: 50, lastSeen: now - 60000, lastPath: "/" }, null).accepted, false);
  assert.equal(planVisitorWrite(event, null, { views: VISITOR_LIMITS.dailyEvents }).accepted, false);
  assert.equal(planVisitorWrite(event, { views: 1, lastSeen: now - 60000, lastPath: "/", firstSeen: now - 60000 }, null).views, 2);
});
test("day scope and expiry come from trusted server time", () => {
  const event = validateVisitorEvent(input, null, now);
  assert.equal(event.day, "2026-09-30"); assert.equal(event.expiresAt - now, 30 * 86400000);
  assert.notEqual(event.id, validateVisitorEvent(input, null, now + 86400000).id);
});

test("consented sign-in events use verified token identity and one event per authentication", () => {
  const authEvent = { uid: "customer-1", token: { name: "Alice Example", email: "alice@example.com", email_verified: true, auth_time: Math.floor((now - 20000) / 1000), firebase: { sign_in_provider: "google.com" } } };
  const data = { attemptId: "041a736d-a382-4164-911c-77e6b3816cbe", identify: true, consentVersion: 2, device: "Mobile", viewport: "Compact" };
  const event = validateSignInEvent(data, authEvent, now);
  assert.equal(event.email, "alice@example.com"); assert.equal(event.provider, "google.com"); assert.equal(event.device, "Mobile");
  assert.equal(event.id, validateSignInEvent({ ...data, attemptId: "d94735ce-5048-43fc-a80e-ae5a8bce97ac" }, authEvent, now).id);
  assert.equal(event.expiresAt - now, VISITOR_LIMITS.retentionMs);
  for (const invalid of [{ ...data, email: "forged@example.com" }, { ...data, identify: false }, { ...data, consentVersion: 1 }, { ...data, device: "Fingerprint" }]) assert.throws(() => validateSignInEvent(invalid, authEvent, now));
  assert.throws(() => validateSignInEvent(data, { ...authEvent, token: { ...authEvent.token, email_verified: false } }, now));
  assert.throws(() => validateSignInEvent(data, { ...authEvent, token: { ...authEvent.token, auth_time: Math.floor((now - 10 * 60000) / 1000) } }, now));
});
