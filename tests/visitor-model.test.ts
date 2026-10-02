import test from "node:test";
import assert from "node:assert/strict";
import { readVisitorConsent, publicAnalyticsPath, summarizeOrders, mayRecordVisitorEvent } from "../lib/visitor-model";
test("consent defaults to off and expires", () => {
  const now = 1800000000000;
  assert.equal(readVisitorConsent(null, now), null);
  assert.equal(readVisitorConsent("broken", now), null);
  assert.equal(readVisitorConsent(JSON.stringify({ version: 2, analytics: true, identify: true, savedAt: now - 181 * 86400000 }), now), null);
  assert.deepEqual(readVisitorConsent(JSON.stringify({ version: 2, analytics: false, identify: true, savedAt: now }), now), { version: 2, analytics: false, identify: false, savedAt: now });
});
test("analytics excludes private paths and strips query strings", () => {
  assert.equal(publicAnalyticsPath("/projects/antenna?email=private#name"), "/projects/antenna");
  for (const path of ["/owner", "/account", "/privacy", "https://outside.invalid", "/projects/../owner"]) assert.equal(publicAnalyticsPath(path), null);
});
test("orders count accepted quotes without pretending they are payments", () => {
  const data = summarizeOrders([{ status: "Accepted", amountPaise: 125000, currency: "INR" }, { status: "Sent", amountPaise: 400000, currency: "INR" }, { status: "Declined", amountPaise: 500000, currency: "INR" }, { status: "Accepted", amountPaise: -1, currency: "INR" }]);
  assert.equal(data.accepted.length, 1); assert.equal(data.quotedValuePaise, 125000); assert.equal(data.pending, 1);
});

test("collection requires current consent and a separate verified identity choice", () => {
  const now = 1800000000000;
  const anonymous = JSON.stringify({ version: 2, analytics: true, identify: false, savedAt: now });
  const named = JSON.stringify({ version: 2, analytics: true, identify: true, savedAt: now });
  const declined = JSON.stringify({ version: 2, analytics: false, identify: true, savedAt: now });
  assert.equal(mayRecordVisitorEvent(null, "/", false, false, now), false);
  assert.equal(mayRecordVisitorEvent(declined, "/", false, false, now), false);
  assert.equal(mayRecordVisitorEvent(anonymous, "/projects", false, false, now), true);
  assert.equal(mayRecordVisitorEvent(anonymous, "/projects", true, true, now), false);
  assert.equal(mayRecordVisitorEvent(named, "/projects", true, false, now), false);
  assert.equal(mayRecordVisitorEvent(named, "/projects", true, true, now), true);
  assert.equal(mayRecordVisitorEvent(named, "/account", true, true, now), false);
  assert.equal(mayRecordVisitorEvent(named, "/", true, true, now + 181 * 86400000), false);
});
