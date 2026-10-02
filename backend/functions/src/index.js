import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { defineBoolean, defineSecret, defineString } from "firebase-functions/params";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { warn } from "firebase-functions/logger";
import { deliverNotification, sendWithResend } from "./delivery.js";
import { firestoreLedger } from "./firestore-ledger.js";
export { recordVisitorActivity, recordCustomerSignIn } from "./visitor-analytics.js";
export { emailWeeklyFounderSummary } from "./founder-summary-schedule.js";

initializeApp();
const enabled = defineBoolean("PORTAL_EMAIL_ENABLED", { default: false });
const sender = defineString("PORTAL_EMAIL_FROM", { default: "" });
const site = defineString("PORTAL_SITE_URL", { default: "https://4tech-9cy.pages.dev" });
const region = defineString("PORTAL_FUNCTION_REGION", { default: "asia-south1" });
const resendKey = defineSecret("RESEND_API_KEY");

export const emailProjectNotification = onDocumentCreated({
  document: "users/{uid}/notifications/{notificationId}",
  region, secrets: [resendKey], retry: true, maxInstances: 2,
  minInstances: 0, concurrency: 10, timeoutSeconds: 60, memory: "256MiB",
}, async event => {
  // Deployment/billing is an explicit operator step. Defaults never send mail.
  if (!enabled.value() || !event.data) return;
  const db = getFirestore();
  const data = event.data.data();
  const outcome = await deliverNotification({
    projectId: process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT ?? "",
    uid: event.params.uid, id: event.params.notificationId,
    requestId: data.requestId, createdAt: data.createdAt?.toMillis?.(),
  }, {
    now: Date.now, store: firestoreLedger(db), send: sendWithResend,
    async getUser(uid) {
      try { return await getAuth().getUser(uid); }
      catch (error) { if (error.code === "auth/user-not-found") return null; throw error; }
    },
    async getPreference(uid) { return (await db.doc(`users/${uid}/preferences/notifications`).get()).data(); },
  }, { enabled: true, from: sender.value(), siteUrl: site.value(), apiKey: resendKey.value() });
  if (outcome === "failed" || outcome === "uncertain") warn("Portal email requires operator review", { outcome, notificationId: event.params.notificationId });
});
