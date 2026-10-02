import test from "node:test";
import assert from "node:assert/strict";
import { DeliveryError, deliverNotification, deliveryKey, FRESH_EVENT_MS, LEASE_MS, RETRY_WINDOW_MS, sendWithResend, validateMailConfig } from "../src/delivery.js";
import { firestoreLedger } from "../src/firestore-ledger.js";

// Exercise the actual ledger with serializable transactions, without credentials,
// production Firebase, or real email. Rules are separately tested in emulators.
function memoryDatabase() {
  const records = new Map();
  let queue = Promise.resolve();
  const reference = key => ({ key, async get() { const value = records.get(key); return { exists: !!value, data: () => value && structuredClone(value) }; } });
  return {
    records,
    collection: () => ({ doc: reference }),
    runTransaction(work) {
      const run = queue.then(() => work({
        get: ref => ref.get(),
        set(ref, data, options) { records.set(ref.key, structuredClone(options?.merge ? { ...records.get(ref.key), ...data } : data)); },
      }));
      queue = run.catch(() => {});
      return run;
    },
  };
}
function fixture() {
  const db = memoryDatabase(), calls = [];
  let now = 1_800_000_000_000;
  const state = { user: { uid: "customer-a", email: "customer@example.test", emailVerified: true, disabled: false }, preference: { emailEnabled: true } };
  const services = {
    now: () => now, store: firestoreLedger(db),
    getUser: async () => state.user, getPreference: async () => state.preference,
    send: async (payload, key) => { calls.push({ payload, key }); return "email-one"; },
  };
  const config = { enabled: true, from: "updates@example.test", siteUrl: "https://example.test", apiKey: "test-only-secret" };
  const event = { projectId: "demo-fourtech", uid: "customer-a", id: "notice-one", requestId: "request-one", createdAt: now };
  return { db, calls, state, services, config, event, advance: value => { now += value; } };
}

test("disabled delivery performs no reads or sends", async () => {
  assert.equal(await deliverNotification({}, {}, { enabled: false }), "disabled");
});

test("email is resolved from verified Auth, never editable event data", async () => {
  const f = fixture();
  f.event.email = "intruder@example.test";
  f.event.body = "external-link-content";
  assert.equal(await deliverNotification(f.event, f.services, f.config), "sent");
  assert.deepEqual(f.calls[0].payload.to, ["customer@example.test"]);
  assert.match(f.calls[0].payload.text, /https:\/\/example\.test\/account#request-request-one/);
  assert.doesNotMatch(JSON.stringify(f.calls[0].payload), /intruder|external-link-content/);
});

test("missing, disabled, unverified and opted-out accounts cannot receive mail", async () => {
  for (const change of [f => { f.state.user = null; }, f => { f.state.user.disabled = true; }, f => { f.state.user.emailVerified = false; }, f => { f.state.preference = {}; }, f => { f.state.user.email = "one@example.test,two@example.test"; }]) {
    const f = fixture(); change(f);
    assert.equal(await deliverNotification(f.event, f.services, f.config), "skipped");
    assert.equal(f.calls.length, 0);
  }
});

test("consent is checked again immediately before sending", async () => {
  const f = fixture(); let reads = 0;
  f.services.getPreference = async () => ({ emailEnabled: ++reads === 1 });
  assert.equal(await deliverNotification(f.event, f.services, f.config), "skipped");
  assert.equal(f.calls.length, 0);
});

test("old and malformed notifications do not send", async () => {
  const f = fixture();
  assert.equal(await deliverNotification({ ...f.event, createdAt: f.event.createdAt - FRESH_EVENT_MS - 1 }, f.services, f.config), "stale-event");
  assert.equal(await deliverNotification({ ...f.event, createdAt: f.event.createdAt + 60_001 }, f.services, f.config), "stale-event");
  assert.equal(await deliverNotification({ ...f.event, requestId: "../../external" }, f.services, f.config), "invalid-event");
  assert.equal(f.calls.length, 0);
});

test("duplicate notifications send only once and use a stable project-scoped key", async () => {
  const f = fixture();
  assert.equal(await deliverNotification(f.event, f.services, f.config), "sent");
  assert.equal(await deliverNotification(f.event, f.services, f.config), "sent");
  assert.equal(f.calls.length, 1);
  assert.notEqual(deliveryKey("demo-one", "a", "b"), deliveryKey("demo-two", "a", "b"));
});

test("concurrent events cannot send while an existing lease is active", async () => {
  const f = fixture();
  const key = deliveryKey(f.event.projectId, f.event.uid, f.event.id);
  const first = await f.services.store.claim(key, { now: f.services.now(), token: "worker-one", candidate: { to: [f.state.user.email] }, window: RETRY_WINDOW_MS, lease: LEASE_MS });
  assert.equal(first.status, "claimed");
  await assert.rejects(deliverNotification(f.event, f.services, f.config), { code: "delivery-busy", retryable: true });
  assert.equal(f.calls.length, 0);
});

test("a network failure retries the exact payload and idempotency key", async () => {
  const f = fixture(); let attempts = 0;
  f.services.send = async (payload, key) => { f.calls.push({ payload, key }); if (++attempts === 1) throw new Error("connection lost"); return "email-one"; };
  await assert.rejects(deliverNotification(f.event, f.services, f.config), { code: "retry-delivery" });
  f.config.siteUrl = "https://new.example.test";
  assert.equal(await deliverNotification(f.event, f.services, f.config), "sent");
  assert.deepEqual(f.calls[0], f.calls[1]);
});

test("an Auth address change cannot redirect an existing retry", async () => {
  const f = fixture();
  f.services.send = async () => { throw new Error("ambiguous transport result"); };
  await assert.rejects(deliverNotification(f.event, f.services, f.config));
  f.state.user.email = "different@example.test";
  f.services.send = async () => { assert.fail("must not send to changed address"); };
  assert.equal(await deliverNotification(f.event, f.services, f.config), "skipped");
});

test("ambiguous sends are never retried beyond the provider idempotency window", async () => {
  const f = fixture();
  f.services.send = async () => { throw new Error("connection lost"); };
  await assert.rejects(deliverNotification(f.event, f.services, f.config));
  f.advance(RETRY_WINDOW_MS);
  f.services.send = async () => { assert.fail("duplicate risk after retry window"); };
  assert.equal(await deliverNotification(f.event, f.services, f.config), "uncertain");
});

test("permanent provider failures are terminal", async () => {
  const f = fixture(); let sends = 0;
  f.services.send = async () => { sends++; throw new DeliveryError("provider-422"); };
  assert.equal(await deliverNotification(f.event, f.services, f.config), "failed");
  assert.equal(await deliverNotification(f.event, f.services, f.config), "failed");
  assert.equal(sends, 1);
});

test("stale workers cannot overwrite the new worker or a terminal result", async () => {
  const f = fixture(), key = "ledger-key";
  const claim = token => f.services.store.claim(key, { now: f.services.now(), token, candidate: { to: [f.state.user.email] }, window: RETRY_WINDOW_MS, lease: LEASE_MS });
  await claim("old"); f.advance(LEASE_MS + 1); await claim("new");
  await f.services.store.finish(key, "old", { status: "sent" });
  assert.equal((await f.services.store.get(key)).status, "pending");
  await f.services.store.finish(key, "new", { status: "sent" });
  await f.services.store.finish(key, "new", { status: "pending" });
  assert.equal((await f.services.store.get(key)).status, "sent");
});

test("provider call uses one recipient, bounded timeout and idempotency header", async () => {
  let observed;
  const id = await sendWithResend({ to: ["a@example.test"] }, "key-one", "test-key", async (url, options) => {
    observed = { url, options }; return { ok: true, json: async () => ({ id: "response-id" }) };
  });
  assert.equal(id, "response-id");
  assert.equal(observed.url, "https://api.resend.com/emails");
  assert.equal(observed.options.headers["Idempotency-Key"], "key-one");
  assert.ok(observed.options.signal instanceof AbortSignal);
});

test("provider response handling retries throttling but rejects invalid configuration", async () => {
  for (const status of [429, 409, 500]) await assert.rejects(sendWithResend({}, "key", "test", async () => ({ ok: false, status })), { retryable: true });
  await assert.rejects(sendWithResend({}, "key", "test", async () => ({ ok: false, status: 422 })), { retryable: false });
  await assert.rejects(sendWithResend({}, "key", "test", async () => ({ ok: true, json: async () => ({}) })), { code: "provider-invalid-response" });
  const f = fixture();
  for (const siteUrl of ["http://example.test", "https://user:secret@example.test", "https://example.test/redirect", "https://example.test?url=elsewhere"]) assert.throws(() => validateMailConfig({ ...f.config, siteUrl }));
  assert.throws(() => validateMailConfig({ ...f.config, from: "one@example.test\nBcc:two@example.test" }));
});
