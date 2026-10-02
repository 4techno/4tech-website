import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { defineBoolean, defineString } from "firebase-functions/params";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { validateVisitorEvent, validateSignInEvent, planVisitorWrite, VISITOR_LIMITS } from "./visitor-model.js";

const enabled = defineBoolean("PORTAL_ANALYTICS_ENABLED", { default: false });
const region = defineString("PORTAL_FUNCTION_REGION", { default: "asia-south1" });

export const recordVisitorActivity = onCall({
  region, enforceAppCheck: true, maxInstances: 2, minInstances: 0,
  concurrency: 10, timeoutSeconds: 15, memory: "256MiB",
}, async request => {
  if (!enabled.value()) throw new HttpsError("unavailable", "Visitor analytics is not enabled.");
  let event;
  try { event = validateVisitorEvent(request.data, request.auth); }
  catch { throw new HttpsError("invalid-argument", "Invalid visitor event."); }
  const db = getFirestore(), visitRef = db.doc(`visitorSessions/${event.id}`), dayRef = db.doc(`visitorDays/${event.day}`);
  return db.runTransaction(async transaction => {
    const [visit, day] = await Promise.all([transaction.get(visitRef), transaction.get(dayRef)]);
    const previous = visit.data();
    const plan = planVisitorWrite(event, previous ? { views: previous.views, lastSeen: previous.lastSeen.toMillis(), lastPath: previous.lastPath, firstSeen: previous.createdAt.toMillis() } : null, day.data());
    if (!plan.accepted) return { recorded: false };
    transaction.set(visitRef, {
      createdAt: Timestamp.fromMillis(plan.firstSeen), lastSeen: Timestamp.fromMillis(event.now),
      expiresAt: Timestamp.fromMillis(event.expiresAt), day: event.day, views: plan.views,
      lastPath: event.path, identified: event.identified, uid: event.uid,
      displayName: event.displayName, email: event.email, device: event.device, viewport: event.viewport, consentVersion: 2,
    });
    transaction.set(dayRef, {
      createdAt: Timestamp.fromDate(new Date(`${event.day}T00:00:00.000Z`)), day: event.day,
      views: FieldValue.increment(1), visits: FieldValue.increment(plan.first ? 1 : 0),
      identifiedVisits: FieldValue.increment(plan.first && event.identified ? 1 : 0),
      routeViews: { [event.path]: FieldValue.increment(1) },
      expiresAt: Timestamp.fromMillis(event.expiresAt),
    }, { merge: true });
    return { recorded: true };
  });
});

export const recordCustomerSignIn = onCall({
  region, enforceAppCheck: true, maxInstances: 2, minInstances: 0,
  concurrency: 10, timeoutSeconds: 15, memory: "256MiB",
}, async request => {
  if (!enabled.value()) throw new HttpsError("unavailable", "Visitor analytics is not enabled.");
  let event;
  try { event = validateSignInEvent(request.data, request.auth); }
  catch { throw new HttpsError("invalid-argument", "A recent verified sign-in and identity-sharing choice are required."); }
  const db = getFirestore(), eventRef = db.doc(`authEvents/${event.id}`), dayRef = db.doc(`visitorDays/${event.day}`);
  return db.runTransaction(async transaction => {
    const [existing, day] = await Promise.all([transaction.get(eventRef), transaction.get(dayRef)]);
    if (existing.exists || (day.data()?.logins || 0) >= VISITOR_LIMITS.dailyEvents) return { recorded: false };
    const { now, expiresAt, authTime, ...record } = event;
    transaction.create(eventRef, { ...record, createdAt: Timestamp.fromMillis(now), authTime: Timestamp.fromMillis(authTime), expiresAt: Timestamp.fromMillis(expiresAt) });
    transaction.set(dayRef, { day: event.day, createdAt: Timestamp.fromDate(new Date(`${event.day}T00:00:00.000Z`)), logins: FieldValue.increment(1), expiresAt: Timestamp.fromMillis(expiresAt) }, { merge: true });
    return { recorded: true };
  });
});
