import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { defineBoolean, defineSecret, defineString } from "firebase-functions/params";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { warn } from "firebase-functions/logger";
import { DeliveryError, sendWithResend } from "./delivery.js";
import { firestoreLedger } from "./firestore-ledger.js";
import { deliverFounderSummary, summarizeWeeklyRows, SUMMARY_ROW_LIMIT } from "./founder-summary.js";

const enabled = defineBoolean("PORTAL_WEEKLY_SUMMARY_ENABLED", { default: false });
const analyticsEnabled = defineBoolean("PORTAL_ANALYTICS_ENABLED", { default: false });
const founderUid = defineString("PORTAL_FOUNDER_UID", { default: "" });
const founderEmail = defineString("PORTAL_FOUNDER_EMAIL", { default: "mohammedvashir75@gmail.com" });
const sender = defineString("PORTAL_EMAIL_FROM", { default: "" });
const site = defineString("PORTAL_SITE_URL", { default: "https://4tech-9cy.pages.dev" });
const region = defineString("PORTAL_FUNCTION_REGION", { default: "asia-south1" });
const resendKey = defineSecret("RESEND_API_KEY");

export async function readWeeklySummary(db, week, includeAnalytics) {
  const weekly = name => db.collectionGroup(name)
    .where("createdAt", ">=", Timestamp.fromMillis(week.start))
    .where("createdAt", "<", Timestamp.fromMillis(week.end))
    .orderBy("createdAt", "desc").limit(SUMMARY_ROW_LIMIT + 1).get();
  const dayRefs = Array.from({ length: 7 }, (_, index) => db.doc(`visitorDays/${new Date(week.start + index * 86_400_000).toISOString().slice(0, 10)}`));
  const [requests, quotes, dayDocs] = await Promise.all([weekly("requests"), weekly("quotes"), includeAnalytics ? db.getAll(...dayRefs) : Promise.resolve([])]);
  const rows = snapshot => snapshot.docs.map(document => ({ createdAt: document.get("createdAt")?.toMillis?.(), status: document.get("status") }));
  return summarizeWeeklyRows(week, rows(requests), rows(quotes), dayDocs.filter(document => document.exists).map(document => document.data()), includeAnalytics);
}

// Deploying this export creates a Scheduler job even while disabled. Deployment
// is an explicit billing-approved operator action, never part of the Pages build.
export const emailWeeklyFounderSummary = onSchedule({
  schedule: "0 9 * * 1", timeZone: "Asia/Kolkata", region,
  secrets: [resendKey], minInstances: 0, maxInstances: 1, concurrency: 1,
  timeoutSeconds: 120, memory: "256MiB", retryCount: 5,
  maxRetrySeconds: 21_600, minBackoffSeconds: 120, maxBackoffSeconds: 3_600, maxDoublings: 4,
}, async event => {
  if (!enabled.value()) return;
  const db = getFirestore();
  try {
    const outcome = await deliverFounderSummary({ projectId: process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT ?? "", scheduleTime: event.scheduleTime }, {
      now: Date.now, store: firestoreLedger(db), send: sendWithResend,
      async getUser(uid) {
        try { return await getAuth().getUser(uid); }
        catch (error) { if (error.code === "auth/user-not-found") return null; throw error; }
      },
      async getPreference(uid) { return (await db.doc(`users/${uid}/preferences/notifications`).get()).data(); },
      getSummary: week => readWeeklySummary(db, week, analyticsEnabled.value()),
    }, { enabled: true, founderUid: founderUid.value(), founderEmail: founderEmail.value(), from: sender.value(), siteUrl: site.value(), apiKey: resendKey.value() });
    if (!["sent", "disabled", "skipped"].includes(outcome)) warn("Founder weekly summary requires operator review", { outcome });
  } catch (error) {
    // Log codes only; never provider bodies, tokens, recipient data or customer data.
    if (error instanceof DeliveryError && !error.retryable) {
      warn("Founder weekly summary stopped", { code: error.code });
      return;
    }
    throw new DeliveryError("founder-summary-retry", true);
  }
});
