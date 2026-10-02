import test from "node:test";
import assert from "node:assert/strict";
import { parseArguments, proposedClaims } from "../scripts/owner-access-model.js";
const argumentsList = ["--project", "tech-customer-portal", "--uid", "owner-example", "--email", "owner@example.test"];
const user = { uid: "owner-example", email: "owner@example.test", emailVerified: true, disabled: false, customClaims: { existingRole: "reviewer" } };

test("owner provisioning defaults to an explicit identity dry run", () => {
  const options = parseArguments(argumentsList);
  assert.equal(options.apply, false);
  assert.equal(options.revoke, false);
  assert.equal(options.project, "tech-customer-portal");
  assert.equal(parseArguments([...argumentsList, "--apply"]).apply, true);
});
test("unknown, incomplete and duplicate identity arguments are rejected", () => {
  for (const args of [[], ["--uid", "one"], [...argumentsList, "--project", "another-project"], [...argumentsList, "--secret", "no"], [...argumentsList.slice(0, -1), "--apply"]]) assert.throws(() => parseArguments(args));
});
test("grant and revoke preserve every unrelated custom claim", () => {
  const options = parseArguments(argumentsList);
  assert.deepEqual(proposedClaims(user, options), { existingRole: "reviewer", owner: true });
  assert.deepEqual(proposedClaims({ ...user, customClaims: { ...user.customClaims, owner: true } }, { ...options, revoke: true }), user.customClaims);
  assert.deepEqual(user.customClaims, { existingRole: "reviewer" });
});
test("both UID and verified email must match the inspected Firebase account", () => {
  const options = parseArguments(argumentsList);
  for (const bad of [{ ...user, uid: "other" }, { ...user, email: "other@example.test" }, { ...user, emailVerified: false }, { ...user, disabled: true }]) assert.throws(() => proposedClaims(bad, options));
  assert.deepEqual(proposedClaims({ ...user, disabled: true }, { ...options, revoke: true }), user.customClaims);
});
test("claims cannot exceed the Firebase byte limit", () => {
  assert.throws(() => proposedClaims({ ...user, customClaims: { oversized: "x".repeat(1000) } }, parseArguments(argumentsList)));
});
