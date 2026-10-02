import test from "node:test";
import assert from "node:assert/strict";
import { deliverFounderSummary, founderSummaryKey, previousUtcWeek, summarizeWeeklyRows, SUMMARY_ROW_LIMIT } from "../src/founder-summary.js";
import { DeliveryError, RETRY_WINDOW_MS } from "../src/delivery.js";
import { firestoreLedger } from "../src/firestore-ledger.js";

// The real transactional ledger runs against an isolated serialized in-memory
// adapter. Nothing in this test contacts Firebase or an email provider.
function fixture() {
  const records = new Map(), sends = [];
  let queue = Promise.resolve(), now = Date.parse("2026-10-05T03:30:00Z");
  const reference = key => ({ key, async get() { const data = records.get(key); return { exists: !!data, data: () => data && structuredClone(data) }; } });
  const db = {
    collection: () => ({ doc: reference }),
    runTransaction(work) {
      const run = queue.then(() => work({ get: ref => ref.get(), set(ref, data, options) { records.set(ref.key, structuredClone(options?.merge ? { ...records.get(ref.key), ...data } : data)); } }));
      queue = run.catch(() => {}); return run;
    },
  };
  const state = {
    user: { uid: "founder-one", email: "founder@example.test", emailVerified: true, disabled: false, customClaims: { owner: true } },
    preference: { emailEnabled: true },
    metrics: { newEnquiries: 3, quotesIssued: 2, cohortAcceptedQuotes: 1, analyticsEnabled: true, recordedViews: 12, recordedDailySessions: 7 },
  };
  const services = {
    now: () => now, store: firestoreLedger(db), getUser: async () => state.user, getPreference: async () => state.preference,
    getSummary: async () => state.metrics,
    send: async (payload, key) => { sends.push(structuredClone({ payload, key })); return "email-one"; },
  };
  const config = { enabled: true, founderUid: state.user.uid, founderEmail: state.user.email, siteUrl: "https://example.test", from: "updates@example.test", apiKey: "test-only-secret" };
  const event = { projectId: "demo-fourtech", scheduleTime: "2026-10-05T03:30:00Z" };
  return { state, services, config, event, records, sends, advance: value => { now += value; } };
}

test("weekly summaries remain inert until explicitly enabled and configured", async () => {
  assert.equal(await deliverFounderSummary({}, {}, { enabled: false }), "disabled");
  assert.equal(await deliverFounderSummary({}, {}, { enabled: true }), "unconfigured");
});

test("India Monday delivery reports the previous complete UTC Monday-to-Sunday week", () => {
  const week = previousUtcWeek("2026-10-05T03:30:00Z");
  assert.equal(week.startDay, "2026-09-28"); assert.equal(week.endDay, "2026-10-04");
  assert.equal(week.end - week.start, 7 * 86_400_000);
  assert.equal(previousUtcWeek("2026-01-05T03:30:00Z").startDay, "2025-12-29");
  for (const invalid of [undefined, "2026-10-05", "bad-date", "2026-13-05T03:30:00Z"]) assert.throws(() => previousUtcWeek(invalid), { code: "invalid-schedule-time" });
});

test("weekly totals validate the date window and distinguish daily sessions from people", () => {
  const week = previousUtcWeek("2026-10-05T03:30:00Z");
  const summary = summarizeWeeklyRows(week, [{ createdAt: week.start }], [{ createdAt: week.end - 1, status: "Accepted" }, { createdAt: week.start, status: "Sent" }], [{ day: "2026-09-28", views: 5, visits: 2 }, { day: "2026-09-29", views: 8, visits: 3 }], true);
  assert.deepEqual(summary, { newEnquiries: 1, quotesIssued: 2, cohortAcceptedQuotes: 1, analyticsEnabled: true, recordedViews: 13, recordedDailySessions: 5 });
  assert.throws(() => summarizeWeeklyRows(week, [{ createdAt: week.end }], [], [], false), { code: "invalid-summary-window" });
  assert.throws(() => summarizeWeeklyRows(week, [], [], [{ day: "2026-10-05", views: 1, visits: 1 }], true), { code: "invalid-summary-window" });
  assert.throws(() => summarizeWeeklyRows(week, [], [], [{ day: "2026-09-28", views: -1, visits: 1 }], true), { code: "invalid-summary-data" });
  assert.throws(() => summarizeWeeklyRows(week, [], [], [{ day: "2026-09-28", views: 1, visits: 1 }, { day: "2026-09-28", views: 1, visits: 1 }], true), { code: "invalid-summary-window" });
});

test("oversized weekly datasets fail closed instead of reporting truncated totals", () => {
  const week = previousUtcWeek("2026-10-05T03:30:00Z"), rows = Array.from({ length: SUMMARY_ROW_LIMIT + 1 }, () => ({ createdAt: week.start }));
  assert.throws(() => summarizeWeeklyRows(week, rows, [], [], false), { code: "summary-capacity-exceeded" });
  assert.throws(() => summarizeWeeklyRows(week, [], rows, [], false), { code: "summary-capacity-exceeded" });
});

test("only the exact configured verified owner who opted in receives a summary", async () => {
  const mutations = [f => { f.state.user = null; }, f => { f.state.user.uid = "another-owner"; }, f => { f.state.user.email = "other@example.test"; }, f => { f.state.user.emailVerified = false; }, f => { f.state.user.disabled = true; }, f => { f.state.user.customClaims = {}; }, f => { f.state.user.customClaims.owner = "true"; }, f => { f.state.preference.emailEnabled = false; }];
  for (const mutate of mutations) {
    const f = fixture(); mutate(f);
    assert.equal(await deliverFounderSummary(f.event, f.services, f.config), "skipped"); assert.equal(f.sends.length, 0);
  }
});

test("summary includes aggregate counts without private customer content", async () => {
  const f = fixture();
  f.state.metrics.customerName = "PRIVATE CUSTOMER"; f.state.metrics.customerEmail = "private@example.test"; f.state.metrics.projectDetails = "PRIVATE PROJECT CONTENT";
  assert.equal(await deliverFounderSummary(f.event, f.services, f.config), "sent");
  const mail = f.sends[0].payload;
  assert.deepEqual(mail.to, [f.config.founderEmail]);
  assert.match(mail.text, /New enquiries: 3/); assert.match(mail.text, /Recorded daily sessions: 7/); assert.match(mail.text, /https:\/\/example\.test\/owner/);
  assert.doesNotMatch(JSON.stringify(mail), /PRIVATE CUSTOMER|private@example|PRIVATE PROJECT CONTENT/);
});

test("disabled analytics reports unavailability rather than fabricated zero traffic", async () => {
  const f = fixture(); f.state.metrics.analyticsEnabled = false;
  assert.equal(await deliverFounderSummary(f.event, f.services, f.config), "sent");
  assert.match(f.sends[0].payload.text, /Visitor analytics: not enabled/); assert.doesNotMatch(f.sends[0].payload.text, /Recorded page events/);
});

test("founder permission and consent are checked again immediately before sending", async () => {
  for (const field of ["owner", "consent"]) {
    const f = fixture(); let calls = 0;
    if (field === "owner") f.services.getUser = async () => ({ ...f.state.user, customClaims: { owner: ++calls === 1 } });
    else f.services.getPreference = async () => ({ emailEnabled: ++calls === 1 });
    assert.equal(await deliverFounderSummary(f.event, f.services, f.config), "skipped"); assert.equal(f.sends.length, 0);
  }
});

test("duplicate scheduled events share a stable key and send only once", async () => {
  const f = fixture(), week = previousUtcWeek(f.event.scheduleTime);
  assert.equal(await deliverFounderSummary(f.event, f.services, f.config), "sent");
  assert.equal(await deliverFounderSummary(f.event, f.services, f.config), "sent"); assert.equal(f.sends.length, 1);
  assert.notEqual(founderSummaryKey("project-one", "owner", week), founderSummaryKey("project-two", "owner", week));
  assert.notEqual(founderSummaryKey("project-one", "owner", week), founderSummaryKey("project-one", "other-owner", week));
});

test("concurrent scheduler deliveries use the real ledger lease", async () => {
  const f = fixture(); let unblock;
  const pending = new Promise(resolve => { unblock = resolve; });
  f.services.send = async (payload, key) => { f.sends.push({ payload, key }); await pending; return "email-one"; };
  const first = deliverFounderSummary(f.event, f.services, f.config);
  while (f.sends.length === 0) await new Promise(resolve => setImmediate(resolve));
  await assert.rejects(deliverFounderSummary(f.event, f.services, f.config), { code: "delivery-busy" });
  unblock(); assert.equal(await first, "sent"); assert.equal(f.sends.length, 1);
});

test("retries preserve the original summary and idempotency key even if source data changes", async () => {
  const f = fixture(); let attempt = 0;
  f.services.send = async (payload, key) => { f.sends.push(structuredClone({ payload, key })); if (++attempt === 1) throw new Error("lost response"); return "email-one"; };
  await assert.rejects(deliverFounderSummary(f.event, f.services, f.config), { code: "retry-delivery" });
  f.state.metrics.newEnquiries = 999; f.config.siteUrl = "https://changed.example.test";
  assert.equal(await deliverFounderSummary(f.event, f.services, f.config), "sent"); assert.deepEqual(f.sends[0], f.sends[1]);
});

test("recipient changes cannot redirect a pending weekly report", async () => {
  const f = fixture(); f.services.send = async () => { throw new Error("lost response"); };
  await assert.rejects(deliverFounderSummary(f.event, f.services, f.config));
  f.state.user.email = "new@example.test"; f.config.founderEmail = "new@example.test";
  f.services.send = async () => { assert.fail("must not redirect pending mail"); };
  assert.equal(await deliverFounderSummary(f.event, f.services, f.config), "skipped");
});

test("old new jobs are rejected and ambiguous retries stop before provider deduplication expires", async () => {
  const f = fixture();
  assert.equal(await deliverFounderSummary({ ...f.event, scheduleTime: "2026-09-28T03:30:00Z" }, f.services, f.config), "stale-event");
  f.services.send = async () => { throw new Error("lost response"); };
  await assert.rejects(deliverFounderSummary(f.event, f.services, f.config));
  f.advance(RETRY_WINDOW_MS); f.services.send = async () => { assert.fail("duplicate mail risk"); };
  assert.equal(await deliverFounderSummary(f.event, f.services, f.config), "uncertain");
});

test("permanent delivery errors are terminal and invalid report totals never send", async () => {
  const f = fixture(); let sends = 0;
  f.services.send = async () => { sends++; throw new DeliveryError("provider-422"); };
  assert.equal(await deliverFounderSummary(f.event, f.services, f.config), "failed");
  assert.equal(await deliverFounderSummary(f.event, f.services, f.config), "failed"); assert.equal(sends, 1);
  const invalid = fixture(); invalid.state.metrics.cohortAcceptedQuotes = 3;
  await assert.rejects(deliverFounderSummary(invalid.event, invalid.services, invalid.config), { code: "invalid-summary-data" }); assert.equal(invalid.sends.length, 0);
});
