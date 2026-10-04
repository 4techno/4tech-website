/** Never display private Firestore rows from cache or after an account switch. */
export function canDisplayPrivateSnapshot(
  subscribedUid: string | null | undefined,
  currentUid: string | null | undefined,
  fromCache: boolean,
): boolean {
  return Boolean(subscribedUid && subscribedUid === currentUid && !fromCache);
}
