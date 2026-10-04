import assert from "node:assert/strict";
import test from "node:test";
import { canDisplayPrivateSnapshot } from "../lib/portal-snapshot";

test("private records require a current server response for the same signed-in user", () => {
  assert.equal(canDisplayPrivateSnapshot("owner-uid", "owner-uid", false), true);
  assert.equal(canDisplayPrivateSnapshot("owner-uid", "owner-uid", true), false);
  assert.equal(canDisplayPrivateSnapshot("owner-uid", "customer-uid", false), false);
  assert.equal(canDisplayPrivateSnapshot("owner-uid", null, false), false);
  assert.equal(canDisplayPrivateSnapshot(null, "owner-uid", false), false);
  assert.equal(canDisplayPrivateSnapshot("", "", false), false);
});
