"use client";
import { getFirebaseClient } from "./firebase";
import { portalCapabilities } from "./portal-config";
import { coarseVisitorDevice, publicAnalyticsPath, mayRecordVisitorEvent, mayRecordSignIn, VISITOR_CONSENT_KEY } from "./visitor-model";
let appCheckReady: Promise<void> | undefined;

async function initializeCollection() {
  const { auth } = getFirebaseClient();
  appCheckReady ??= import("firebase/app-check").then(({ initializeAppCheck, ReCaptchaEnterpriseProvider }) => {
    initializeAppCheck(auth.app, { provider: new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY!), isTokenAutoRefreshEnabled: true });
  }).catch(error => { appCheckReady = undefined; throw error; });
  await appCheckReady;
  return import("firebase/functions");
}

export async function recordConsentedVisit(sessionId: string, path: string, identify: boolean) {
  if (!portalCapabilities.visitorAnalytics || !publicAnalyticsPath(path)) return;
  const { auth } = getFirebaseClient();
  const expectedUid = auth.currentUser?.uid;
  const { getFunctions, httpsCallable } = await initializeCollection();
  // Recheck after every async initialization boundary. A withdrawn choice or an
  // account change during loading must not send the pending event.
  if (expectedUid !== auth.currentUser?.uid || !mayRecordVisitorEvent(localStorage.getItem(VISITOR_CONSENT_KEY), path, identify, auth.currentUser?.emailVerified === true)) return;
  const environment = coarseVisitorDevice(navigator.userAgent, window.innerWidth, navigator.maxTouchPoints);
  await httpsCallable(getFunctions(auth.app, process.env.NEXT_PUBLIC_PORTAL_FUNCTION_REGION || "asia-south1"), "recordVisitorActivity", { timeout: 10000 })({ sessionId, path, identify, consentVersion: 2, ...environment });
}

/** Call only after an explicit successful sign-in, never an auth observer or token refresh. */
export async function recordConsentedSignIn(uid: string) {
  if (!portalCapabilities.visitorAnalytics) return;
  const { auth } = getFirebaseClient();
  if (auth.currentUser?.uid !== uid || !mayRecordSignIn(localStorage.getItem(VISITOR_CONSENT_KEY), auth.currentUser.emailVerified)) return;
  const attemptId = crypto.randomUUID();
  const { getFunctions, httpsCallable } = await initializeCollection();
  if (auth.currentUser?.uid !== uid || !mayRecordSignIn(localStorage.getItem(VISITOR_CONSENT_KEY), auth.currentUser.emailVerified)) return;
  await httpsCallable(getFunctions(auth.app, process.env.NEXT_PUBLIC_PORTAL_FUNCTION_REGION || "asia-south1"), "recordCustomerSignIn", { timeout: 10000 })({ attemptId, identify: true, consentVersion: 2, ...coarseVisitorDevice(navigator.userAgent, window.innerWidth, navigator.maxTouchPoints) });
}
