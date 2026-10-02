import { timestampMillis } from "./portal-model";
import { publicAnalyticsPath } from "./visitor-model";

/** Read models for protected, server-written analytics. No browser tracking or authorization. */
export type TrafficRange = 7 | 14 | 30;
export type VisitorDay = {
  id: string; day: string; views: number; visits: number; identifiedVisits: number;
  logins: number; routeViews: Record<string, number>;
  expiresAt: number | null;
};
export type VisitorSession = {
  id: string; day: string; displayName: string; identified: boolean; lastPath: string;
  email: string; device: string; viewport: string;
  views: number; lastSeen: number | null; createdAt: number | null; expiresAt: number | null;
};
export type AuthEvent = { id: string; displayName: string; email: string; provider: string; device: string; createdAt: number | null; expiresAt: number | null; source: string };
export type DailyTrafficPoint = { date: string; label: string; views: number; visits: number; identifiedVisits: number; logins: number; routeViews: Record<string, number> };
export type TrafficSummary = {
  totalViews: number; totalVisits: number; identifiedVisits: number; totalLogins: number;
  topRoute: { path: string; views: number } | null;
  peakDay: { date: string; visits: number } | null;
};

const DAY_MS = 86_400_000;
const count = (value: unknown) => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : 0;
export function formatDateKey(timestamp: number): string {
  return Number.isFinite(timestamp) && Math.abs(timestamp) <= 8.64e15 ? new Date(timestamp).toISOString().slice(0, 10) : "";
}
function validDay(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && formatDateKey(Date.parse(`${value}T00:00:00Z`)) === value;
}
export const mapVisitorDay = (id: string, data: Record<string, unknown>): VisitorDay => ({
  id, day: typeof data.day === "string" ? data.day : id,
  views: count(data.views), visits: count(data.visits), identifiedVisits: count(data.identifiedVisits),
  logins: count(data.logins),
  routeViews: data.routeViews && typeof data.routeViews === "object" && !Array.isArray(data.routeViews)
    ? Object.fromEntries(Object.entries(data.routeViews).filter(([path, views]) => !!publicAnalyticsPath(path) && count(views) > 0).map(([path, views]) => [path, count(views)])) : {},
  expiresAt: timestampMillis(data.expiresAt),
});
export const mapVisitorSession = (id: string, data: Record<string, unknown>): VisitorSession => ({
  id, day: typeof data.day === "string" ? data.day : "",
  displayName: data.identified === true && typeof data.displayName === "string" ? data.displayName.slice(0, 80) : "",
  identified: data.identified === true,
  lastPath: typeof data.lastPath === "string" ? publicAnalyticsPath(data.lastPath) || "Unavailable" : "Unavailable",
  email: data.identified === true && typeof data.email === "string" ? data.email.slice(0, 254) : "",
  device: ["Desktop", "Mobile", "Tablet"].includes(String(data.device)) ? String(data.device) : "Unknown",
  viewport: ["Compact", "Medium", "Wide"].includes(String(data.viewport)) ? String(data.viewport) : "Unknown",
  views: count(data.views), createdAt: timestampMillis(data.createdAt),
  lastSeen: timestampMillis(data.lastSeen), expiresAt: timestampMillis(data.expiresAt),
});
export const mapAuthEvent = (id: string, data: Record<string, unknown>): AuthEvent => ({
  id,
  displayName: typeof data.displayName === "string" ? data.displayName.slice(0, 80) : "",
  email: typeof data.email === "string" ? data.email.slice(0, 254) : "",
  provider: data.provider === "google.com" ? "Google" : data.provider === "password" ? "Email" : "Unknown",
  device: ["Desktop", "Mobile", "Tablet"].includes(String(data.device)) ? String(data.device) : "Unknown",
  createdAt: timestampMillis(data.createdAt), expiresAt: timestampMillis(data.expiresAt),
  source: data.source === "client-observed" ? "Consented sign-in" : "Unknown",
});

export function trafficWindow(days: TrafficRange, now = Date.now()) {
  const end = formatDateKey(now);
  const start = formatDateKey(Date.parse(`${end}T00:00:00Z`) - (days - 1) * DAY_MS);
  return { start, end };
}

/** Zero-filled UTC calendar days, using one authoritative document per day. */
export function getDailyTraffic(records: readonly VisitorDay[], days: TrafficRange = 14, now = Date.now()): DailyTrafficPoint[] {
  const { start, end } = trafficWindow(days, now);
  const selected = new Map<string, VisitorDay>();
  for (const record of records) {
    if (!validDay(record.day) || record.id !== record.day || record.day < start || record.day > end ||
        record.expiresAt === null || record.expiresAt <= now) continue;
    const previous = selected.get(record.day);
    if (!previous || (previous.expiresAt || 0) < record.expiresAt) selected.set(record.day, record);
  }
  const startMs = Date.parse(`${start}T00:00:00Z`);
  return Array.from({ length: days }, (_, index) => {
    const time = startMs + index * DAY_MS, date = formatDateKey(time), record = selected.get(date);
    return {
      date, label: new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric", timeZone: "UTC" }).format(time),
      views: count(record?.views), visits: count(record?.visits), identifiedVisits: count(record?.identifiedVisits),
      logins: count(record?.logins), routeViews: record?.routeViews || {},
    };
  });
}

/** Every KPI comes from the same filtered series as the chart. Sessions are not people. */
export function getTrafficSummary(points: readonly DailyTrafficPoint[]): TrafficSummary {
  const routes = new Map<string, number>();
  const summary = points.reduce<Omit<TrafficSummary, "topRoute">>((total, point) => {
    for (const [path, views] of Object.entries(point.routeViews)) routes.set(path, (routes.get(path) || 0) + count(views));
    return {
      totalViews: total.totalViews + point.views, totalVisits: total.totalVisits + point.visits,
      identifiedVisits: total.identifiedVisits + point.identifiedVisits, totalLogins: total.totalLogins + point.logins,
      peakDay: point.visits > (total.peakDay?.visits || 0) ? { date: point.date, visits: point.visits } : total.peakDay,
    };
  }, { totalViews: 0, totalVisits: 0, identifiedVisits: 0, totalLogins: 0, peakDay: null });
  const top = [...routes].sort((a, b) => b[1] - a[1])[0];
  return { ...summary, topRoute: top ? { path: top[0], views: top[1] } : null };
}

export function getAuthEvents(records: readonly AuthEvent[], now = Date.now()): AuthEvent[] {
  return records.filter(event => event.expiresAt !== null && event.expiresAt > now && event.createdAt !== null && event.createdAt <= now && !!event.email)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export function getVisitorSessions(records: readonly VisitorSession[], days: TrafficRange, now = Date.now()): VisitorSession[] {
  const { start, end } = trafficWindow(days, now);
  const selected = new Map<string, VisitorSession>();
  for (const record of records) {
    if (!record.id || !validDay(record.day) || record.day < start || record.day > end ||
        record.expiresAt === null || record.expiresAt <= now ||
        record.lastSeen === null || record.lastSeen > now || formatDateKey(record.lastSeen) !== record.day) continue;
    const previous = selected.get(record.id);
    if (!previous || (previous.lastSeen || 0) < record.lastSeen) selected.set(record.id, record);
  }
  return [...selected.values()].sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0));
}

/** Both series share one vertical scale so their visual comparison is honest. */
export function trafficChartPoints(points: readonly DailyTrafficPoint[], width = 720, height = 250) {
  const left = 48, right = 20, top = 24, bottom = height - 34;
  const max = Math.max(1, ...points.map(point => Math.max(point.views, point.visits)));
  const step = (width - left - right) / Math.max(1, points.length);
  return { max, left, right, top, bottom, step, points: points.map((point, index) => ({
    ...point, x: left + step * (index + 0.5),
    viewY: bottom - point.views / max * (bottom - top),
    visitY: bottom - point.visits / max * (bottom - top),
  })) };
}
