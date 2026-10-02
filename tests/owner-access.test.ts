import test from "node:test";
import assert from "node:assert/strict";
import { FOUNDER_EMAIL, hasVerifiedOwnerClaim, OwnerAccessGuard, type OwnerAccessState, type OwnerIdentity, type OwnerToken, type OwnerUser } from "../lib/owner-access";

const now = Date.parse("2026-10-02T06:00:00Z");
const token = (claims: Record<string, unknown> = { owner: true, email_verified: true, email: FOUNDER_EMAIL }): OwnerToken => ({ claims, expirationTime: new Date(now + 60_000).toISOString() });
const user = (read: () => Promise<OwnerToken> = async () => token(), uid = "owner-uid"): OwnerUser => ({ uid, emailVerified: true, email: FOUNDER_EMAIL, getIdTokenResult: read });
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function setup() {
  const states: OwnerAccessState[] = [];
  const guard = new OwnerAccessGuard(state => states.push(state), false, () => now);
  return { guard, states, latest: () => states.at(-1)! };
}

test("owner access requires verified identity and a boolean owner claim in an unexpired token", () => {
  const identity = user();
  assert.equal(hasVerifiedOwnerClaim(identity, token(), now), true);
  for (const value of [undefined, false, "true", 1]) {
    assert.equal(hasVerifiedOwnerClaim(identity, token({ owner: value, email_verified: true }), now), false);
  }
  assert.equal(hasVerifiedOwnerClaim({ ...identity, emailVerified: false }, token(), now), false);
  assert.equal(hasVerifiedOwnerClaim(identity, token({ owner: true, email_verified: false }), now), false);
  assert.equal(hasVerifiedOwnerClaim(identity, { ...token(), expirationTime: new Date(now).toISOString() }, now), false);
  assert.equal(hasVerifiedOwnerClaim(identity, { ...token(), expirationTime: "invalid" }, now), false);
});

test("a matching email without the owner claim never grants access", async () => {
  const { guard, latest } = setup();
  const identity = { ...user(async () => token({ email_verified: true })), email: FOUNDER_EMAIL };
  await guard.verify(identity, identity.uid, () => identity);
  assert.equal(latest().ownerUid, null);
  assert.equal(latest().checking, false);
});

test("unverified, absent or mismatched identities never request an owner token", async () => {
  for (const scenario of ["unverified", "missing user", "missing expected uid", "different uid"]) {
    const { guard, latest } = setup();
    let reads = 0;
    const identity = user(async () => { reads += 1; return token(); });
    if (scenario === "unverified") identity.emailVerified = false;
    await guard.verify(scenario === "missing user" ? null : identity, scenario === "missing expected uid" ? undefined : scenario === "different uid" ? "another-uid" : identity.uid, () => identity);
    assert.equal(reads, 0, scenario);
    assert.equal(latest().ownerUid, null, scenario);
    assert.equal(latest().checking, false, scenario);
  }
});

test("verification lost while a token request is pending denies its result", async () => {
  const { guard, latest } = setup();
  const pending = deferred<OwnerToken>();
  const identity = user(() => pending.promise);
  let current: OwnerIdentity = identity;
  const verify = guard.verify(identity, identity.uid, () => current);
  current = { ...identity, emailVerified: false };
  pending.resolve(token());
  await verify;
  assert.equal(latest().ownerUid, null);
});

test("a token result cannot grant access after the active account changes", async () => {
  const { guard, latest } = setup();
  const pending = deferred<OwnerToken>();
  const identity = user(() => pending.promise);
  let current: OwnerIdentity | null = identity;
  const verify = guard.verify(identity, identity.uid, () => current);
  assert.equal(latest().checking, true);
  current = { uid: "customer-uid", emailVerified: true };
  pending.resolve(token());
  await verify;
  assert.equal(latest().ownerUid, null);
});

test("token refresh immediately clears prior access and a revoked role remains denied", async () => {
  const { guard, latest } = setup();
  const identity = user();
  await guard.verify(identity, identity.uid, () => identity);
  assert.equal(latest().ownerUid, identity.uid);
  const pending = deferred<OwnerToken>();
  const refresh = guard.verify(user(() => pending.promise), identity.uid, () => identity);
  assert.equal(latest().ownerUid, null);
  assert.equal(latest().checking, true);
  pending.resolve(token({ email_verified: true }));
  await refresh;
  assert.equal(latest().ownerUid, null);
});

test("an older successful token request cannot overwrite a newer denial", async () => {
  const { guard, latest } = setup();
  const first = deferred<OwnerToken>();
  const identity = user(() => first.promise);
  const oldCheck = guard.verify(identity, identity.uid, () => identity);
  await guard.verify(user(async () => token({ owner: false, email_verified: true })), identity.uid, () => identity);
  first.resolve(token());
  await oldCheck;
  assert.equal(latest().ownerUid, null);
  assert.equal(latest().checking, false);
});

test("token failure closes an existing owner session without falling back to identity fields", async () => {
  const { guard, latest } = setup();
  const identity = user();
  await guard.verify(identity, identity.uid, () => identity);
  await guard.verify(user(async () => { throw new Error("offline"); }), identity.uid, () => identity);
  assert.equal(latest().ownerUid, null);
  assert.match(latest().error, /could not be verified/);
});

test("locking cancels pending approval and token refresh cannot reopen the workspace", async () => {
  const { guard, latest } = setup();
  const pending = deferred<OwnerToken>();
  const identity = user(() => pending.promise);
  const verify = guard.verify(identity, identity.uid, () => identity);
  guard.lock();
  assert.equal(latest().locked, true);
  pending.resolve(token());
  await verify;
  await guard.verify(user(), identity.uid, () => identity);
  assert.equal(latest().ownerUid, null);
  assert.equal(latest().locked, true);
});

test("a confirmed sign-out followed by a new verified login can reopen a locked workspace", async () => {
  const { guard, latest } = setup();
  const identity = user();
  guard.lock();
  await guard.verify(null, undefined, () => null);
  assert.equal(latest().locked, false);
  assert.equal(latest().ownerUid, null);
  await guard.verify(identity, identity.uid, () => identity);
  assert.equal(latest().ownerUid, identity.uid);
});

test("sign-out and disposal discard in-flight token results", async () => {
  for (const action of ["sign-out", "dispose"]) {
    const { guard, states, latest } = setup();
    const pending = deferred<OwnerToken>();
    const identity = user(() => pending.promise);
    const verify = guard.verify(identity, identity.uid, () => identity);
    if (action === "sign-out") await guard.verify(null, undefined, () => null);
    else guard.dispose();
    const count = states.length;
    pending.resolve(token());
    await verify;
    assert.equal(states.length, count);
    assert.equal(latest().ownerUid, null);
  }
});


test("a different verified email with an owner claim still cannot enter the founder workspace", () => {
  const identity=user();
  assert.equal(hasVerifiedOwnerClaim({...identity,email:"customer@example.test"},token(),now),false);
  assert.equal(hasVerifiedOwnerClaim(identity,token({owner:true,email_verified:true,email:"customer@example.test"}),now),false);
  assert.equal(hasVerifiedOwnerClaim({...identity,email:null},token(),now),false);
});
