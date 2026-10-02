import { createHash, randomUUID } from "node:crypto";
import { DeliveryError, FRESH_EVENT_MS, LEASE_MS, RETRY_WINDOW_MS, recipientAllowed, validateMailConfig } from "./delivery.js";

const DAY_MS = 86_400_000;
const terminal = new Set(["sent", "skipped", "failed", "uncertain"]);
export const SUMMARY_ROW_LIMIT = 500;

// The source visitor aggregates use UTC days. Keep the report on those same
// boundaries; the delivery schedule can still be Monday at 09:00 in India.
export function previousUtcWeek(scheduleTime) {
  if (typeof scheduleTime !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(scheduleTime)) throw new DeliveryError("invalid-schedule-time");
  const scheduledAt = Date.parse(scheduleTime);
  if (!Number.isFinite(scheduledAt)) throw new DeliveryError("invalid-schedule-time");
  const date = new Date(scheduledAt);
  date.setUTCHours(0, 0, 0, 0);
  const end = date.getTime() - ((date.getUTCDay() + 6) % 7) * DAY_MS;
  const start = end - 7 * DAY_MS;
  return { start, end, scheduledAt, startDay: new Date(start).toISOString().slice(0, 10), endDay: new Date(end - DAY_MS).toISOString().slice(0, 10) };
}

export function founderSummaryKey(projectId, uid, week) {
  return createHash("sha256").update(`${projectId}/founder-weekly/${uid}/${week.startDay}`).digest("hex");
}

export function founderRecipientAllowed(user, preference, config) {
  return recipientAllowed(user, preference)
    && typeof config.founderUid === "string" && config.founderUid.length > 0
    && user.uid === config.founderUid && user.customClaims?.owner === true
    && typeof config.founderEmail === "string" && config.founderEmail.trim().length > 0
    && user.email.toLowerCase() === config.founderEmail.trim().toLowerCase();
}

function count(value) {
  if (!Number.isSafeInteger(value) || value < 0 || value > 1_000_000_000) throw new DeliveryError("invalid-summary-data");
  return value;
}

// Only aggregate counts enter the email. Names, addresses, request titles,
// customer messages and file links never form part of this report contract.
export function makeFounderSummaryMail(user, origin, from, week, metrics) {
  const lines = [
    `4tech founder briefing: ${week.startDay} to ${week.endDay} (UTC)`, "",
    `New enquiries: ${count(metrics.newEnquiries)}`,
    `Quotations issued: ${count(metrics.quotesIssued)}`,
    `Of those quotations, accepted at report time: ${count(metrics.cohortAcceptedQuotes)}`,
  ];
  if (metrics.cohortAcceptedQuotes > metrics.quotesIssued) throw new DeliveryError("invalid-summary-data");
  if (metrics.analyticsEnabled === true) {
    lines.push(`Recorded page events: ${count(metrics.recordedViews)}`, `Recorded daily sessions: ${count(metrics.recordedDailySessions)}`,
      "Traffic includes consented, accepted events only. Daily sessions are not unique people or deduplicated weekly visitors.");
  } else {
    lines.push("Visitor analytics: not enabled; no traffic estimate is provided.");
  }
  lines.push("", `Open your authenticated founder workspace:\n${origin}/owner`, "",
    "Counts cover the previous complete UTC week. Quotation acceptance is the current status of quotations issued during that week, not the count of all acceptances during the week.",
    "You receive this briefing because founder summaries were enabled and your account allows email updates. Turn off Email updates in your account to stop delivery.");
  return { from, to: [user.email], subject: `4tech weekly founder briefing · ${week.startDay}`, text: lines.join("\n") };
}

export async function deliverFounderSummary(event, services, config) {
  if (config.enabled !== true) return "disabled";
  if (!config.founderUid || !config.founderEmail || !event.projectId) return "unconfigured";
  const origin = validateMailConfig(config);
  const week = previousUtcWeek(event.scheduleTime);
  const now = services.now();
  const key = founderSummaryKey(event.projectId, config.founderUid, week);
  const prior = await services.store.get(key);
  if (prior && terminal.has(prior.status)) return prior.status;
  if (!prior && (week.scheduledAt < now - FRESH_EVENT_MS || week.scheduledAt > now + 60_000)) return "stale-event";
  const [user, preference] = await Promise.all([services.getUser(config.founderUid), services.getPreference(config.founderUid)]);
  if (!founderRecipientAllowed(user, preference, config)) {
    await services.store.skip(key, now, "founder-not-authorized-or-opted-in");
    return "skipped";
  }
  const candidate = prior?.payload ?? makeFounderSummaryMail(user, origin, config.from, week, await services.getSummary(week));
  const token = randomUUID();
  const claim = await services.store.claim(key, { now, token, candidate, window: RETRY_WINDOW_MS, lease: LEASE_MS });
  if (claim.status === "busy") throw new DeliveryError("delivery-busy", true);
  if (claim.status !== "claimed") return claim.status;
  if (claim.payload.to[0] !== user.email) {
    await services.store.finish(key, token, { status: "skipped", reason: "recipient-changed", completedAt: services.now() });
    return "skipped";
  }
  try {
    const [freshUser, freshPreference] = await Promise.all([services.getUser(config.founderUid), services.getPreference(config.founderUid)]);
    if (!founderRecipientAllowed(freshUser, freshPreference, config) || freshUser.email !== claim.payload.to[0]) {
      await services.store.finish(key, token, { status: "skipped", reason: "founder-access-or-consent-changed", completedAt: services.now() });
      return "skipped";
    }
    const providerId = await services.send(claim.payload, key, config.apiKey);
    await services.store.finish(key, token, { status: "sent", providerId, completedAt: services.now() });
    return "sent";
  } catch (error) {
    const retryable = !(error instanceof DeliveryError) || error.retryable;
    await services.store.finish(key, token, { status: retryable ? "pending" : "failed", reason: error instanceof DeliveryError ? error.code : "delivery-interrupted", leaseUntil: 0 });
    if (retryable) throw new DeliveryError("retry-delivery", true);
    return "failed";
  }
}

export function summarizeWeeklyRows(week, requests, quotes, days, analyticsEnabled) {
  if (requests.length > SUMMARY_ROW_LIMIT || quotes.length > SUMMARY_ROW_LIMIT) throw new DeliveryError("summary-capacity-exceeded");
  const inWindow = value => Number.isFinite(value?.createdAt) && value.createdAt >= week.start && value.createdAt < week.end;
  if (!requests.every(inWindow) || !quotes.every(inWindow)) throw new DeliveryError("invalid-summary-window");
  const result = { newEnquiries: requests.length, quotesIssued: quotes.length, cohortAcceptedQuotes: quotes.filter(row => row.status === "Accepted").length, analyticsEnabled: analyticsEnabled === true, recordedViews: 0, recordedDailySessions: 0 };
  if (!result.analyticsEnabled) return result;
  if (days.length > 7) throw new DeliveryError("invalid-summary-data");
  const seen = new Set();
  for (const day of days) {
    if (!day || typeof day.day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day.day) || day.day < week.startDay || day.day > week.endDay || seen.has(day.day)) throw new DeliveryError("invalid-summary-window");
    seen.add(day.day);
    result.recordedViews += count(day.views);
    result.recordedDailySessions += count(day.visits);
  }
  return result;
}
