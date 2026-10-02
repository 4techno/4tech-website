const terminal = new Set(["sent", "skipped", "failed", "uncertain"]);

// Keep this ledger: deleting it permits old notifications to be sent again.
// Clients are denied access by firestore.rules. No automatic expiry is used.
export function firestoreLedger(db) {
  const reference = key => db.collection("mailDeliveries").doc(key);
  return {
    async get(key) { const value = await reference(key).get(); return value.exists ? value.data() : null; },
    async skip(key, now, reason) {
      const ref = reference(key);
      await db.runTransaction(async tx => {
        const snapshot = await tx.get(ref), old = snapshot.data();
        if (!old || (!terminal.has(old.status) && old.leaseUntil <= now)) tx.set(ref, { status: "skipped", reason, completedAt: now }, { merge: true });
      });
    },
    async claim(key, { now, token, candidate, window, lease }) {
      const ref = reference(key);
      return db.runTransaction(async tx => {
        const snapshot = await tx.get(ref), old = snapshot.data();
        if (old && terminal.has(old.status)) return { status: old.status };
        if (old && now >= old.firstAttemptAt + window) {
          tx.set(ref, { status: "uncertain", reason: "idempotency-window-ended", completedAt: now, leaseUntil: 0 }, { merge: true });
          return { status: "uncertain" };
        }
        if (old && old.leaseUntil > now) return { status: "busy" };
        const payload = old?.payload ?? candidate;
        tx.set(ref, {
          status: "pending", payload, token, firstAttemptAt: old?.firstAttemptAt ?? now,
          leaseUntil: now + lease, attempts: (old?.attempts ?? 0) + 1,
        }, { merge: true });
        return { status: "claimed", payload };
      });
    },
    async finish(key, token, result) {
      const ref = reference(key);
      await db.runTransaction(async tx => {
        const snapshot = await tx.get(ref);
        if (snapshot.data()?.token === token && !terminal.has(snapshot.data()?.status)) tx.set(ref, { ...result, leaseUntil: 0 }, { merge: true });
      });
    },
  };
}
