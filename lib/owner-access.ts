export const FOUNDER_EMAIL = "mohammedvashir75@gmail.com";
export type OwnerIdentity = { uid: string; emailVerified: boolean; email?: string | null };
export type OwnerToken = { claims: Record<string, unknown>; expirationTime: string };
export type OwnerUser = OwnerIdentity & { getIdTokenResult: (forceRefresh?: boolean) => Promise<OwnerToken> };
export type OwnerAccessState = {
  identity: string;
  ownerUid: string | null;
  checking: boolean;
  locked: boolean;
  expiresAt: number;
  error: string;
};

export function hasVerifiedOwnerClaim(user: OwnerIdentity, token: OwnerToken, now = Date.now()): boolean {
  const expiresAt = Date.parse(token.expirationTime);
  return Boolean(user.uid) && user.emailVerified === true && token.claims.email_verified === true
    && user.email?.toLowerCase() === FOUNDER_EMAIL && token.claims.email === FOUNDER_EMAIL
    && token.claims.owner === true && Number.isFinite(expiresAt) && expiresAt > now;
}

/** UI lifecycle guard only. Firestore/Storage rules independently enforce access. */
export class OwnerAccessGuard {
  private revision = 0;
  private disposed = false;
  private identity = "";
  private locked: boolean;
  private refreshedInitialToken = false;

  constructor(private publish: (state: OwnerAccessState) => void, locked = false, private now = Date.now) {
    this.locked = locked;
  }

  private deny(checking = false, error = "") {
    if (!this.disposed) this.publish({ identity: this.identity, ownerUid: null, checking, locked: this.locked, expiresAt: 0, error });
  }

  async verify(user: OwnerUser | null, expectedUid: string | undefined, currentUser: () => OwnerIdentity | null, refreshInitialToken = false) {
    const operation = ++this.revision;
    this.identity = expectedUid ?? "";
    if (this.disposed) return;
    // A confirmed sign-out permits a subsequent fresh login to be checked.
    if (!user && !currentUser()) this.locked = false;
    if (this.locked || !user || !expectedUid || user.uid !== expectedUid || !user.emailVerified || user.email?.toLowerCase() !== FOUNDER_EMAIL) {
      this.deny();
      return;
    }
    this.deny(true);
    try {
      // A refreshed token may emit onIdTokenChanged again before this promise
      // settles. Consume the refresh first so that event cannot start a loop.
      const forceRefresh = refreshInitialToken && !this.refreshedInitialToken;
      this.refreshedInitialToken ||= forceRefresh;
      const token = await user.getIdTokenResult(forceRefresh);
      if (this.disposed || operation !== this.revision || this.locked) return;
      const current = currentUser();
      if (!current || current.uid !== expectedUid || !current.emailVerified || current.email?.toLowerCase() !== FOUNDER_EMAIL || !hasVerifiedOwnerClaim(user, token, this.now())) {
        this.deny();
        return;
      }
      this.publish({ identity: expectedUid, ownerUid: expectedUid, checking: false, locked: false, expiresAt: Date.parse(token.expirationTime), error: "" });
    } catch {
      if (!this.disposed && operation === this.revision) this.deny(false, "Owner access could not be verified. Reconnect and try again.");
    }
  }

  lock() {
    this.locked = true;
    ++this.revision;
    this.deny();
  }

  dispose() {
    this.disposed = true;
    ++this.revision;
  }
}
