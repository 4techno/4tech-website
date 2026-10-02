import test from "node:test";
import assert from "node:assert/strict";
import { clearLegacyTelemetry } from "../lib/privacy-migration";

test("privacy migration removes legacy identities and bypass flags without clearing consent or auth", () => {
  const local = new Map([
    ["4tech_visitor_logs_v1", "private"], ["4tech_customer_logins_v1", "private"], ["4tech_gemini_api_key", "private"],
    ["4tech-visitor-consent-v1", "keep"], ["firebase:authUser", "keep"],
  ]);
  const session = new Map([["4tech_owner_auth_session", "authorized"], ["4tech_visitor_session_id", "old"], ["4tech-visitor-session-v1", "keep"]]);
  clearLegacyTelemetry({ removeItem: key => { local.delete(key); } }, { removeItem: key => { session.delete(key); } });
  assert.deepEqual([...local.keys()], ["4tech-visitor-consent-v1", "firebase:authUser"]);
  assert.deepEqual([...session.keys()], ["4tech-visitor-session-v1"]);
});

test("storage denial does not prevent cleanup in the other storage area", () => {
  const removed: string[] = [];
  assert.doesNotThrow(() => clearLegacyTelemetry({ removeItem: () => { throw new Error("Blocked"); } }, { removeItem: key => { removed.push(key); } }));
  assert.deepEqual(removed, ["4tech_owner_auth_session", "4tech_visitor_session_id"]);
});
