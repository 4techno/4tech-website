"use client";
import { useEffect, useRef, useState } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { collection, collectionGroup, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { getFirebaseClient } from "@/lib/firebase";
import { portalError } from "@/lib/portal-client";
import { OwnerAccessGuard, type OwnerAccessState } from "@/lib/owner-access";

export function useOwnerAccess(uid?: string) {
  const [state, setState] = useState<OwnerAccessState>({ identity: "", ownerUid: null, checking: true, locked: false, expiresAt: 0, error: "" });
  const guardRef = useRef<OwnerAccessGuard | null>(null);
  const locked = useRef(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const guard = new OwnerAccessGuard(next => { locked.current = next.locked; setState(next); }, locked.current);
    guardRef.current = guard;
    let unsubscribe = () => {};
    try {
      const { auth } = getFirebaseClient();
      // Each mounted check/manual retry gets one fresh token so a newly granted
      // owner role does not remain hidden behind Firebase's cached token.
      unsubscribe = onIdTokenChanged(auth, user => { void guard.verify(user, uid, () => auth.currentUser, true); }, () => guard.lock());
    } catch {
      setState({ identity: uid ?? "", ownerUid: null, checking: false, locked: locked.current, expiresAt: 0, error: "Owner services are unavailable. Please try again later." });
    }
    return () => {
      guard.dispose();
      if (guardRef.current === guard) guardRef.current = null;
      unsubscribe();
    };
  }, [uid, retry]);

  useEffect(() => {
    if (!state.ownerUid || !state.expiresAt) return;
    const timer = setTimeout(() => {
      setState(previous => ({ ...previous, ownerUid: null, checking: true, expiresAt: 0 }));
      setRetry(value => value + 1);
    }, Math.max(0, state.expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [state.ownerUid, state.expiresAt]);

  return {
    owner: Boolean(uid && state.ownerUid === uid && !state.checking && !locked.current && state.expiresAt > Date.now()),
    checking: !locked.current && (state.identity !== (uid ?? "") || state.checking),
    error: state.error,
    locked: state.locked,
    retryVerification: () => setRetry(value => value + 1),
    lockOwnerAccess: () => {
      locked.current = true;
      guardRef.current?.lock();
      setState(previous => ({ ...previous, ownerUid: null, checking: false, locked: true, expiresAt: 0 }));
    },
  };
}

export function usePortalRows<T>(path: string, enabled: boolean, mapper: (id: string, data: Record<string, unknown>) => T, group = false) {
  const identity = `${group ? "group" : "collection"}:${path}:${enabled}`;
  const [result, setResult] = useState<{ identity: string; rows: T[]; loading: boolean; error: string }>({ identity: "", rows: [], loading: true, error: "" });
  useEffect(() => {
    let active = true;
    setResult({ identity, rows: [], loading: enabled, error: "" });
    if (!enabled) return;
    let unsubscribe = () => {};
    try {
      const { db } = getFirebaseClient();
      const source = group ? collectionGroup(db, path) : collection(db, path);
      unsubscribe = onSnapshot(query(source, orderBy("createdAt", "desc"), limit(100)), snapshot => {
        if (active) setResult({ identity, rows: snapshot.docs.map(record => mapper(record.id, { ...record.data(), _path: record.ref.path })), loading: false, error: "" });
      }, cause => { if (active) setResult({ identity, rows: [], loading: false, error: portalError(cause) }); });
    } catch (cause) { setResult({ identity, rows: [], loading: false, error: portalError(cause) }); }
    return () => { active = false; unsubscribe(); };
  }, [path, enabled, mapper, group, identity]);
  // A path/account change must clear previous records in this render, before effects.
  return result.identity === identity ? result : { rows: [], loading: enabled, error: "" };
}
