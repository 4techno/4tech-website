import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDateKey, getAuthEvents, getDailyTraffic, getTrafficSummary, getVisitorSessions, mapAuthEvent, mapVisitorDay, mapVisitorSession, trafficChartPoints, trafficWindow, type VisitorDay, type VisitorSession } from '../lib/owner-analytics';

const now = Date.parse('2026-10-02T12:00:00Z');
const day = (date: string, views: number, visits: number, expiresAt = now + 86400000): VisitorDay => ({ id: date, day: date, views, visits, identifiedVisits: 1, logins: 0, routeViews: {}, expiresAt });
const session = (id: string, date: string, expiresAt = now + 86400000): VisitorSession => ({ id, day: date, displayName: '', identified: false, lastPath: '/', email: '', device: 'Unknown', viewport: 'Unknown', views: 1, lastSeen: Date.parse(`${date}T10:00:00Z`), createdAt: Date.parse(`${date}T09:00:00Z`), expiresAt });

test('UTC reporting windows cross months and years without local timezone drift', () => {
  assert.equal(formatDateKey(Date.parse('2026-10-02T00:10:00+05:30')), '2026-10-01');
  assert.equal(formatDateKey(NaN), '');
  assert.deepEqual(trafficWindow(7, Date.parse('2027-01-02T00:00:00Z')), { start: '2026-12-27', end: '2027-01-02' });
});

test('empty production analytics stays empty and never invents visitors', () => {
  const points = getDailyTraffic([], 14, now);
  assert.equal(points.length, 14);
  assert.deepEqual(getTrafficSummary(points), { totalViews: 0, totalVisits: 0, identifiedVisits: 0, totalLogins: 0, topRoute: null, peakDay: null });
  assert.deepEqual(getVisitorSessions([], 14, now), []);
});

test('every KPI uses the selected period including the inclusive first day', () => {
  const records = [day('2026-10-02', 8, 4), day('2026-09-26', 4, 2), day('2026-09-25', 20, 10), day('2026-09-10', 50, 25)];
  assert.deepEqual(getTrafficSummary(getDailyTraffic(records, 7, now)), { totalViews: 12, totalVisits: 6, identifiedVisits: 2, totalLogins: 0, topRoute: null, peakDay: { date: '2026-10-02', visits: 4 } });
  assert.equal(getTrafficSummary(getDailyTraffic(records, 14, now)).totalViews, 32);
  assert.equal(getTrafficSummary(getDailyTraffic(records, 30, now)).totalViews, 82);
});

test('expired, future, invalid and mismatched daily documents are excluded', () => {
  const records = [day('2026-10-02', 10, 2, now), day('2026-10-03', 10, 2), day('2026-09-31', 10, 2), { ...day('2026-10-01', 10, 2), id: 'wrong' }];
  assert.equal(getTrafficSummary(getDailyTraffic(records, 7, now)).totalViews, 0);
});

test('duplicate day snapshots are not counted twice', () => {
  assert.equal(getTrafficSummary(getDailyTraffic([day('2026-10-01', 3, 1), day('2026-10-01', 4, 2, now + 172800000)], 7, now)).totalViews, 4);
});

test('session feed excludes expired or out-of-range identities and deduplicates by record', () => {
  const records = [session('a', '2026-10-01'), { ...session('a', '2026-10-01'), lastSeen: Date.parse('2026-10-01T11:00:00Z'), views: 3 }, session('b', '2026-09-25'), session('c', '2026-10-02', now), { ...session('d', '2026-10-02'), lastSeen: now + 1000 }];
  const selected = getVisitorSessions(records, 7, now);
  assert.equal(selected.length, 1);
  assert.equal(selected[0].views, 3);
});

test('anonymous records never render supplied names and private paths are suppressed', () => {
  const record = mapVisitorSession('x', { identified: false, displayName: 'Should not appear', lastPath: '/owner', views: NaN });
  assert.equal(record.displayName, '');
  assert.equal(record.lastPath, 'Unavailable');
  assert.equal(record.views, 0);
  assert.equal(mapVisitorDay('2026-10-02', { views: -1, visits: Infinity }).views, 0);
});

test('chart uses one finite scale for sessions and page views including zero traffic', () => {
  const chart = trafficChartPoints(getDailyTraffic([day('2026-10-02', 10, 5)], 7, now));
  const latest = chart.points.at(-1)!;
  assert.equal(chart.max, 10);
  assert.equal(latest.viewY, chart.top);
  assert.equal(latest.visitY, (chart.top + chart.bottom) / 2);
  assert.ok(trafficChartPoints(getDailyTraffic([], 7, now)).points.every(point => Number.isFinite(point.viewY)));
});

test('route and sign-in totals are derived only from the selected days', () => {
  const records: VisitorDay[] = [{ ...day('2026-10-02', 9, 3), logins: 2, routeViews: { '/projects': 7, '/': 2 } }, { ...day('2026-09-20', 40, 20), logins: 10, routeViews: { '/': 40 } }];
  const summary = getTrafficSummary(getDailyTraffic(records, 7, now));
  assert.equal(summary.totalLogins, 2);
  assert.deepEqual(summary.topRoute, { path: '/projects', views: 7 });
});

test('private routes, anonymous email, and expired sign-in records are removed', () => {
  const route = mapVisitorDay('2026-10-02', { routeViews: { '/projects': 3, '/owner': 5 } });
  assert.deepEqual(route.routeViews, { '/projects': 3 });
  assert.equal(mapVisitorSession('x', { email: 'private@example.com', identified: false }).email, '');
  const event = mapAuthEvent('one', { email: 'customer@example.com', provider: 'google.com', createdAt: { toMillis: () => now - 1000 }, expiresAt: { toMillis: () => now + 1000 } });
  assert.equal(getAuthEvents([event], now).length, 1);
  assert.equal(getAuthEvents([event], now + 2000).length, 0);
});
