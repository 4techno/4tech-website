"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword, getIdToken, GoogleAuthProvider, onAuthStateChanged,
  reload, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword,
  signInWithPopup, signOut as firebaseSignOut, updateProfile, validatePassword, type User,
} from "firebase/auth";
import {
  addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseClient, type FirebaseClient } from "@/lib/firebase";

export const requestCategories = [
  "College project support", "School project support", "Startup prototyping",
  "Technical training", "Something else",
] as const;
export type RequestInput = { title: string; category: string; timeline: string; details: string };
export type Customer = { uid: string; displayName: string; email: string; verified: boolean };
export type CustomerRequest = RequestInput & {
  id: string; status: string; createdAt: number | null; pending: boolean;
  updateMessage: string; updatedAt: number | null;
};
type HistoryState = "idle" | "loading" | "cached" | "ready" | "error";
const unavailableMessage = "Customer accounts are currently unavailable. Please contact 4tech through WhatsApp or email.";

function codeOf(error: unknown): string {
  return typeof error === "object" && error !== null && "code" in error && typeof error.code === "string" ? error.code : "";
}

function errorMessage(error: unknown, action: "auth" | "request" | "verification" = "auth") {
  const code = codeOf(error);
  if (["auth/network-request-failed", "unavailable"].includes(code)) return "A connection problem interrupted this step. Check your connection and try again.";
  if (["auth/too-many-requests", "resource-exhausted"].includes(code)) return "Too many attempts were made. Please wait a while before trying again.";
  if (code === "auth/popup-blocked") return "Your browser blocked the sign-in window. Allow pop-ups for this site and try again, or use email sign-in.";
  if (["auth/popup-closed-by-user", "auth/cancelled-popup-request"].includes(code)) return "Sign-in was cancelled. You can try again when you are ready.";
  if (["auth/operation-not-allowed", "auth/unauthorized-domain", "auth/invalid-api-key", "auth/app-not-authorized", "auth/configuration-not-found"].includes(code)) return "This sign-in option is currently unavailable. Please use another option or contact 4tech.";
  if (["auth/weak-password", "auth/password-does-not-meet-requirements"].includes(code)) return "Choose a password of at least 12 characters that meets the account requirements.";
  if (action === "request") return "Your request could not be saved. Please try again, or contact 4tech through WhatsApp or email.";
  if (action === "verification") return "The verification step could not be completed. Please try again later.";
  // Do not reveal whether a supplied email belongs to an account.
  return "We could not complete sign-in. Check your details, try another sign-in option, or use password reset.";
}

function timestampMillis(value: unknown): number | null {
  if (!value || typeof value !== "object" || !("toMillis" in value) || typeof value.toMillis !== "function") return null;
  try {
    const milliseconds: unknown = value.toMillis();
    return typeof milliseconds === "number" && Number.isFinite(milliseconds) && Math.abs(milliseconds) <= 8.64e15 ? milliseconds : null;
  } catch { return null; }
}

const stringValue = (value: unknown, fallback = "") => typeof value === "string" ? value : fallback;
const customerFromUser = (user: User): Customer => ({ uid: user.uid, displayName: user.displayName ?? "", email: user.email ?? "", verified: user.emailVerified });

export function useCustomerAccount() {
  const clientRef = useRef<FirebaseClient | null>(null);
  const lifecycle = useRef(0);
  const session = useRef({ uid: "", version: 0 });
  const authInFlight = useRef(false);
  const verificationInFlight = useRef(false);
  const requestInFlight = useRef(false);
  const requestVersion = useRef(0);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [verificationBusy, setVerificationBusy] = useState(false);
  const [requestBusy, setRequestBusy] = useState(false);
  const [authStatus, setAuthStatus] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [googleEnabled, setGoogleEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [resetUntil, setResetUntil] = useState(0);
  const [verificationUntil, setVerificationUntil] = useState(0);
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [historyState, setHistoryState] = useState<HistoryState>("idle");
  const [historyMessage, setHistoryMessage] = useState("");

  useEffect(() => {
    const mounted = ++lifecycle.current;
    let unsubscribe: Unsubscribe | undefined;
    try {
      const client = getFirebaseClient();
      clientRef.current = client;
      unsubscribe = onAuthStateChanged(client.auth, (user) => {
        if (lifecycle.current !== mounted) return;
        const uid = user?.uid ?? "";
        if (session.current.uid !== uid) {
          session.current = { uid, version: session.current.version + 1 };
          ++requestVersion.current;
          requestInFlight.current = false;
          verificationInFlight.current = false;
          setRequestBusy(false);
          setVerificationBusy(false);
          setVerificationUntil(0);
          setRequests([]);
          setRequestStatus("");
          setHistoryState(uid ? "loading" : "idle");
        }
        setCustomer(user ? customerFromUser(user) : null);
        setReady(true);
      }, () => {
        if (lifecycle.current !== mounted) return;
        setUnavailable(true);
        setAuthStatus(unavailableMessage);
      });
    } catch {
      setUnavailable(true);
      setAuthStatus(unavailableMessage);
    }
    return () => {
      ++lifecycle.current;
      ++requestVersion.current;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    const uid = customer?.uid;
    const client = clientRef.current;
    if (!uid || !client || unavailable) return;
    let current = true;
    setHistoryState("loading");
    setHistoryMessage("Loading your requests…");
    const timer = setTimeout(() => {
      if (current) setHistoryMessage("Still connecting to your request history. Check your connection or try refreshing the page.");
    }, 15000);
    const requestQuery = query(collection(client.db, "users", uid, "requests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(requestQuery, { includeMetadataChanges: true }, (snapshot) => {
      if (!current || session.current.uid !== uid) return;
      if (!snapshot.metadata.fromCache) clearTimeout(timer);
      setHistoryState(snapshot.metadata.fromCache ? "cached" : "ready");
      setHistoryMessage(snapshot.metadata.fromCache ? "Checking for the latest updates. Saved information may be out of date." : "");
      setRequests(snapshot.docs.map((record) => {
        const data = record.data();
        return {
          id: record.id, title: stringValue(data.title, "Project request"), category: stringValue(data.category),
          timeline: stringValue(data.timeline), details: stringValue(data.details), status: stringValue(data.status, "Submitted"),
          pending: record.metadata.hasPendingWrites, createdAt: timestampMillis(data.createdAt),
          updateMessage: stringValue(data.updateMessage), updatedAt: timestampMillis(data.updatedAt),
        };
      }));
    }, () => {
      if (!current || session.current.uid !== uid) return;
      clearTimeout(timer);
      setHistoryState("error");
      setHistoryMessage("Your request history is unavailable. Refresh the page to retry, or contact 4tech through WhatsApp or email.");
      setRequests([]);
    });
    return () => { current = false; clearTimeout(timer); unsubscribe(); };
  }, [customer?.uid, unavailable]);

  useEffect(() => {
    if (!resetUntil) return;
    const timer = setTimeout(() => setResetUntil(0), Math.max(0, resetUntil - Date.now()));
    return () => clearTimeout(timer);
  }, [resetUntil]);
  useEffect(() => {
    if (!verificationUntil) return;
    const timer = setTimeout(() => setVerificationUntil(0), Math.max(0, verificationUntil - Date.now()));
    return () => clearTimeout(timer);
  }, [verificationUntil]);

  function handleProviderError(error: unknown, provider: "email" | "google") {
    const code = codeOf(error);
    if (code === "auth/operation-not-allowed") {
      if (provider === "email") setEmailEnabled(false);
      else setGoogleEnabled(false);
    }
    if (["auth/invalid-api-key", "auth/app-not-authorized", "auth/configuration-not-found"].includes(code)) {
      setUnavailable(true);
      setAuthStatus(unavailableMessage);
    } else setAuthStatus(errorMessage(error));
  }

  async function signInGoogle() {
    const client = clientRef.current;
    if (!client || !ready || unavailable || !googleEnabled || authInFlight.current) return;
    const mounted = lifecycle.current;
    authInFlight.current = true;
    setAuthBusy(true);
    setAuthStatus("Opening secure Google sign-in…");
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(client.auth, provider);
      if (lifecycle.current === mounted) setAuthStatus("");
    } catch (error) {
      if (lifecycle.current === mounted) handleProviderError(error, "google");
    } finally {
      authInFlight.current = false;
      if (lifecycle.current === mounted) setAuthBusy(false);
    }
  }

  async function signInEmail(input: { email: string; password: string; name: string; register: boolean }) {
    const client = clientRef.current;
    if (!client || !ready || unavailable || !emailEnabled || authInFlight.current) return;
    const mounted = lifecycle.current;
    const displayName = input.name.trim();
    if (input.register && (!displayName || displayName.length > 80)) { setAuthStatus("Please enter your name using up to 80 characters."); return; }
    authInFlight.current = true;
    setAuthBusy(true);
    setAuthStatus(input.register ? "Creating your account…" : "Signing in…");
    try {
      if (input.register) {
        const policy = await validatePassword(client.auth, input.password);
        if (input.password.length < 12 || !policy.isValid) {
          setAuthStatus("Choose a password of at least 12 characters that meets the account requirements.");
          return;
        }
        const result = await createUserWithEmailAndPassword(client.auth, input.email.trim(), input.password);
        try { await updateProfile(result.user, { displayName }); } catch { /* Account remains usable with its email label. */ }
        if (lifecycle.current === mounted && client.auth.currentUser?.uid === result.user.uid) setCustomer(customerFromUser(result.user));
        // Email verification is sent only when the customer clicks its dedicated button.
      } else await signInWithEmailAndPassword(client.auth, input.email.trim(), input.password);
      if (lifecycle.current === mounted) setAuthStatus("");
    } catch (error) {
      if (lifecycle.current === mounted) handleProviderError(error, "email");
    } finally {
      authInFlight.current = false;
      if (lifecycle.current === mounted) setAuthBusy(false);
    }
  }

  async function resetPassword(email: string) {
    const client = clientRef.current;
    if (!client || !ready || unavailable || !emailEnabled || authInFlight.current || resetUntil > Date.now()) return;
    const mounted = lifecycle.current;
    authInFlight.current = true;
    setAuthBusy(true);
    setAuthStatus("Requesting password reset…");
    const neutral = "If this address can receive a password reset, you will receive an email with the next steps.";
    try {
      await sendPasswordResetEmail(client.auth, email.trim());
      if (lifecycle.current === mounted) { setAuthStatus(neutral); setResetUntil(Date.now() + 60000); }
    } catch (error) {
      if (lifecycle.current !== mounted) return;
      if (["auth/user-not-found", "auth/invalid-email", "auth/invalid-credential", "auth/user-disabled"].includes(codeOf(error))) {
        setAuthStatus(neutral); setResetUntil(Date.now() + 60000);
      } else handleProviderError(error, "email");
    } finally {
      authInFlight.current = false;
      if (lifecycle.current === mounted) setAuthBusy(false);
    }
  }

  const currentSession = useCallback((uid: string, version: number, mounted: number) => (
    lifecycle.current === mounted && session.current.uid === uid && session.current.version === version
  ), []);

  async function verifyEmail(refresh: boolean) {
    const current = clientRef.current?.auth.currentUser;
    if (!current || unavailable || authInFlight.current || verificationInFlight.current || (!refresh && (current.emailVerified || verificationUntil > Date.now()))) return;
    const mounted = lifecycle.current;
    const version = session.current.version;
    verificationInFlight.current = true;
    setVerificationBusy(true);
    try {
      if (refresh) {
        await reload(current);
        await getIdToken(current, true);
        if (currentSession(current.uid, version, mounted)) {
          setCustomer(customerFromUser(current));
          setRequestStatus(current.emailVerified ? "Email verified. You can submit a request once your account has connected." : "Your email is not verified yet. Follow the link in the verification email, then check again.");
        }
      } else {
        await sendEmailVerification(current);
        if (currentSession(current.uid, version, mounted)) {
          setVerificationUntil(Date.now() + 60000);
          setRequestStatus("Verification email sent. Check your inbox and spam folder, follow the link, then select “I’ve verified my email”.");
        }
      }
    } catch (error) {
      if (currentSession(current.uid, version, mounted)) setRequestStatus(errorMessage(error, "verification"));
    } finally {
      if (currentSession(current.uid, version, mounted)) { verificationInFlight.current = false; setVerificationBusy(false); }
    }
  }

  async function signOut() {
    const client = clientRef.current;
    if (!client || authInFlight.current) return;
    const mounted = lifecycle.current;
    authInFlight.current = true;
    setAuthBusy(true);
    try {
      await firebaseSignOut(client.auth);
      if (lifecycle.current === mounted) setAuthStatus("You are signed out.");
    } catch {
      if (lifecycle.current === mounted) setRequestStatus("Sign-out could not be completed. Please try again.");
    } finally {
      authInFlight.current = false;
      if (lifecycle.current === mounted) setAuthBusy(false);
    }
  }

  async function submitRequest(input: RequestInput): Promise<boolean> {
    const client = clientRef.current;
    const current = client?.auth.currentUser;
    if (!client || !current?.emailVerified || unavailable || historyState !== "ready" || requestInFlight.current || authInFlight.current) return false;
    // An account change in another tab must never submit the previous account's form.
    if (current.uid !== customer?.uid || session.current.uid !== current.uid) {
      setRequestStatus("Your sign-in changed. Wait for your account to reconnect, then review your request before submitting.");
      return false;
    }
    const values = { title: input.title.trim(), category: input.category.trim(), timeline: input.timeline.trim(), details: input.details.trim() };
    if (values.title.length < 3 || values.title.length > 120 || !values.category || values.category.length > 80 || values.timeline.length > 100 || values.details.length < 10 || values.details.length > 6000) {
      setRequestStatus("Add a title, category and at least 10 characters describing your request. Keep the title within 120 characters and the description within 6,000.");
      return false;
    }
    if (navigator.onLine === false) { setRequestStatus("You appear to be offline. Reconnect before submitting your request."); return false; }
    const mounted = lifecycle.current;
    const version = session.current.version;
    const operation = ++requestVersion.current;
    requestInFlight.current = true;
    setRequestBusy(true);
    setRequestStatus("Submitting your request securely…");
    const stillCurrent = () => currentSession(current.uid, version, mounted) && operation === requestVersion.current;
    const timer = setTimeout(() => {
      if (stillCurrent()) setRequestStatus("Still waiting for server confirmation. Keep this page open; your request has not yet been confirmed.");
    }, 12000);
    try {
      await addDoc(collection(client.db, "users", current.uid, "requests"), {
        ...values, status: "Submitted", createdAt: serverTimestamp(),
      });
      if (stillCurrent()) {
        setRequestStatus("Your request has been submitted. Updates will appear here when 4tech reviews it.");
        return true;
      }
      return false;
    } catch (error) {
      if (stillCurrent()) setRequestStatus(errorMessage(error, "request"));
      return false;
    } finally {
      clearTimeout(timer);
      if (stillCurrent()) { requestInFlight.current = false; setRequestBusy(false); }
    }
  }

  return {
    customer, ready, unavailable, authBusy, verificationBusy, requestBusy,
    authStatus, requestStatus, googleEnabled, emailEnabled,
    resetCoolingDown: resetUntil !== 0, verificationCoolingDown: verificationUntil !== 0,
    requests, historyState, historyMessage, signInGoogle, signInEmail, resetPassword,
    verifyEmail, signOut, submitRequest, clearAuthStatus: () => setAuthStatus(""),
  };
}
