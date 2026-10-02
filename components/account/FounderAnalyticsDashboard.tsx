"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import { getFirebaseClient } from "@/lib/firebase";
import { portalCapabilities } from "@/lib/portal-config";
import { portalError } from "@/lib/portal-client";
import {
  getAuthEvents, getDailyTraffic, getTrafficSummary, getVisitorSessions, mapAuthEvent, mapVisitorDay, mapVisitorSession,
  trafficChartPoints, trafficWindow, type AuthEvent, type TrafficRange, type VisitorDay, type VisitorSession,
} from "@/lib/owner-analytics";
import styles from "./founder-dashboard.module.css";

type AnalyticsState = {
  identity: string; days: VisitorDay[]; sessions: VisitorSession[]; authEvents: AuthEvent[];
  daysReady: boolean; sessionsReady: boolean; authReady: boolean; error: string;
};
const emptyState = (identity: string): AnalyticsState => ({ identity, days: [], sessions: [], authEvents: [], daysReady: false, sessionsReady: false, authReady: false, error: "" });
const formatTime = (value: number) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(value);

/** The parent owner gate mounts this only after a verified owner claim. Rules enforce reads. */
export default function FounderAnalyticsDashboard({ uid }: { uid: string }) {
  return <AnalyticsWorkspace key={uid} uid={uid}/>;
}
function AnalyticsWorkspace({ uid }: { uid: string }) {
  const [range, setRange] = useState<TrafficRange>(14);
  const [tab, setTab] = useState<"graph" | "sessions" | "logins">("graph");
  const [filter, setFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [retry, setRetry] = useState(0);
  const { start, end } = trafficWindow(range, now);
  const identity = `${uid}:${start}:${end}:${retry}`;
  const [result, setResult] = useState<AnalyticsState>(() => emptyState(""));
  const graphId = useId();

  // Expired records disappear even if no new server event arrives; UTC windows roll over.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    const update = () => { if (document.visibilityState === "visible") setNow(Date.now()); };
    document.addEventListener("visibilitychange", update);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", update); };
  }, []);

  useEffect(() => {
    let active = true, failed = false;
    const stops: Array<() => void> = [];
    setResult(emptyState(identity));
    if (!portalCapabilities.visitorAnalytics || !uid) return;
    const fail = (cause: unknown) => {
      failed = true;
      if (active) setResult({ ...emptyState(identity), error: portalError(cause) });
    };
    try {
      const { auth, db } = getFirebaseClient();
      if (auth.currentUser?.uid !== uid) return;
      const lowerBound = Timestamp.fromDate(new Date(`${start}T00:00:00Z`));
      const daysQuery = query(collection(db, "visitorDays"), where("createdAt", ">=", lowerBound), orderBy("createdAt", "desc"), limit(30));
      const sessionsQuery = query(collection(db, "visitorSessions"), where("lastSeen", ">=", lowerBound), orderBy("lastSeen", "desc"), limit(100));
      const authQuery = query(collection(db, "authEvents"), where("createdAt", ">=", lowerBound), orderBy("createdAt", "desc"), limit(100));
      stops.push(onSnapshot(daysQuery, { includeMetadataChanges: true }, snapshot => {
        if (!active || failed || auth.currentUser?.uid !== uid) return;
        // Cached private records are not displayed before a current server authorization.
        const ready = !snapshot.metadata.fromCache;
        setResult(previous => ({ ...previous, identity, daysReady: ready, days: ready ? snapshot.docs.map(row => mapVisitorDay(row.id, row.data())) : [] }));
      }, fail));
      stops.push(onSnapshot(sessionsQuery, { includeMetadataChanges: true }, snapshot => {
        if (!active || failed || auth.currentUser?.uid !== uid) return;
        const ready = !snapshot.metadata.fromCache;
        setResult(previous => ({ ...previous, identity, sessionsReady: ready, sessions: ready ? snapshot.docs.map(row => mapVisitorSession(row.id, row.data())) : [] }));
      }, fail));
      stops.push(onSnapshot(authQuery, { includeMetadataChanges: true }, snapshot => {
        if (!active || failed || auth.currentUser?.uid !== uid) return;
        const ready = !snapshot.metadata.fromCache;
        setResult(previous => ({ ...previous, identity, authReady: ready, authEvents: ready ? snapshot.docs.map(row => mapAuthEvent(row.id, row.data())) : [] }));
      }, fail));
    } catch (cause) { fail(cause); }
    return () => { active = false; stops.forEach(stop => stop()); };
  }, [uid, start, identity]);

  const data = result.identity === identity ? result : emptyState(identity);
  const ready = data.daysReady && data.sessionsReady && data.authReady && !data.error;
  const points = useMemo(() => getDailyTraffic(ready ? data.days : [], range, now), [data.days, ready, range, now]);
  const summary = getTrafficSummary(points);
  const sessions = getVisitorSessions(ready ? data.sessions : [], range, now);
  const authEvents = getAuthEvents(ready ? data.authEvents : [], now);
  const shown = sessions.filter(session => `${session.displayName} ${session.email} ${session.lastPath} ${session.device} ${session.identified ? "identified" : "anonymous"}`.toLowerCase().includes(filter.trim().toLowerCase()));
  const shownAuth = authEvents.filter(event => `${event.displayName} ${event.email} ${event.provider} ${event.device}`.toLowerCase().includes(filter.trim().toLowerCase()));
  const chart = trafficChartPoints(points);
  const selected = points.find(point => point.date === selectedDate) ?? points[points.length - 1];
  const line = chart.points.map((point, index) => {
    if (!index) return `M${point.x},${point.viewY}`;
    const before = chart.points[index - 1];
    const midpoint = (before.x + point.x) / 2;
    return `C${midpoint},${before.viewY} ${midpoint},${point.viewY} ${point.x},${point.viewY}`;
  }).join(" ");
  const area = `${line} L${chart.points.at(-1)?.x},${chart.bottom} L${chart.points[0]?.x},${chart.bottom} Z`;

  if (!portalCapabilities.visitorAnalytics) return <section className={`${styles.container} ${styles.notice}`} aria-labelledby={`${graphId}-disabled`}>
    <span className={styles.tag}>[ VISITOR OVERVIEW ]</span><h2 id={`${graphId}-disabled`} className={styles.title}>Analytics awaiting connection</h2>
    <p>Recorded traffic will appear after the protected collection service and visitor privacy controls are enabled. No sample visitors or estimated totals are displayed.</p>
    <p>Anonymous visitors remain anonymous. Account names are shown only when verified visitors choose to share them.</p>
  </section>;

  return <section className={styles.container} aria-labelledby={`${graphId}-heading`}>
    <div className={styles.header}><div><span className={styles.tag}>[ FOUNDER WORKSPACE / ANALYTICS ]</span><h2 id={`${graphId}-heading`} className={styles.title}>Traffic &amp; visitor sessions</h2><p className={styles.subtitle}>Consented activity from the protected collection service. All date ranges use UTC calendar days.</p></div>
      <div className={styles.rangeSelector} aria-label="Reporting period">{([7, 14, 30] as const).map(days => <button key={days} type="button" aria-pressed={range === days} className={range === days ? styles.rangeBtnActive : styles.rangeBtn} onClick={() => { setRange(days); setSelectedDate(""); }}>{days} days</button>)}<button type="button" className={styles.refreshBtn} onClick={() => { setNow(Date.now()); setRetry(value => value + 1); }}>Reconnect</button></div>
    </div>
    {data.error ? <div className={styles.notice} role="alert"><h3>Analytics could not be loaded</h3><p>{data.error}</p><p>Previous records have been cleared. Reconnect to try again.</p></div> : !ready ? <p className={styles.notice} role="status">Connecting to protected analytics… An internet connection and current owner access are required.</p> : <>
      <div className={styles.metricsGrid}>
        {[["Page views", summary.totalViews.toLocaleString(), "Consented public page views"], ["Unique tab sessions", summary.totalVisits.toLocaleString(), `${range} UTC calendar days`], ["Customer sign-ins", summary.totalLogins.toLocaleString(), "Consented, recent verified sign-ins"], ["Top route", summary.topRoute?.path ?? "—", summary.topRoute ? `${summary.topRoute.views} recorded views` : "No recorded route"], ["Peak day", summary.peakDay?.visits.toLocaleString() ?? "—", summary.peakDay?.date ?? "No recorded traffic"], ["Enquiry conversion", "N/A", "Reliable enquiry-to-session attribution is unavailable"]].map(([label, value, note]) => <div className={styles.metricCard} key={label}><span className={styles.metricLabel}>{label}</span><strong className={styles.metricValue}>{value}</strong><span className={styles.metricSub}>{note}</span></div>)}
      </div>
      <p className={styles.subtitle}>A session represents a browser tab within one UTC day, not a unique person. Events are recorded only after consent. The sign-in stream is a customer-opted, browser-observed record, not a complete authentication audit.</p>
      <div className={styles.dashboardTabs} aria-label="Analytics views"><button type="button" aria-pressed={tab === "graph"} className={tab === "graph" ? styles.tabActive : styles.tab} onClick={() => setTab("graph")}>Traffic graph</button><button type="button" aria-pressed={tab === "sessions"} className={tab === "sessions" ? styles.tabActive : styles.tab} onClick={() => setTab("sessions")}>Visitor sessions ({sessions.length})</button><button type="button" aria-pressed={tab === "logins"} className={tab === "logins" ? styles.tabActive : styles.tab} onClick={() => setTab("logins")}>Customer sign-ins ({authEvents.length})</button></div>
      {tab === "graph" ? <div className={styles.graphPanel}>
        <div className={styles.graphHeader}><div><h3>Daily sessions and recorded views</h3><p className={styles.graphLegend}>Solid bars: sessions · Smooth line: page views · Shared count scale</p></div></div>
        <div className={styles.svgWrapper} role="region" aria-label="Scrollable traffic chart" tabIndex={0}>
          <svg viewBox="0 0 720 250" className={styles.svgChart} role="img" aria-labelledby={`${graphId}-chart-title ${graphId}-chart-desc`}>
            <title id={`${graphId}-chart-title`}>Recorded traffic over {range} UTC days</title><desc id={`${graphId}-chart-desc`}>Daily session bars and page-view line on the same count scale. Exact values are available in the date selector and daily data table below.</desc>
            {[0, 0.5, 1].map(ratio => { const y = chart.bottom - (chart.bottom - chart.top) * ratio; return <g key={ratio}><line x1={chart.left} x2={700} y1={y} y2={y} stroke="#333" strokeDasharray="3 3"/><text x={chart.left - 8} y={y + 4} textAnchor="end" fill="#aaa" fontSize="11">{Math.round(chart.max * ratio)}</text></g>; })}
            <defs><linearGradient id={`${graphId}-gradient`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".16"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient></defs>
            <path d={area} fill={`url(#${graphId}-gradient)`}/><path d={line} fill="none" stroke="#eee" strokeWidth="1.7"/>
            {chart.points.map((point, index) => <g key={point.date} onPointerEnter={() => setSelectedDate(point.date)} onClick={() => setSelectedDate(point.date)} className={styles.barGroup}>
              <rect x={point.x - chart.step / 2} y={chart.top} width={chart.step} height={chart.bottom - chart.top} fill="transparent"/>
              <rect x={point.x - Math.min(18, chart.step * 0.55) / 2} y={point.visitY} width={Math.min(18, chart.step * 0.55)} height={chart.bottom - point.visitY} fill={selected.date === point.date ? "#fff" : "#bcbcbc"}/>
              <circle cx={point.x} cy={point.viewY} r="3" fill="#fff"/>
              {(index % (range === 30 ? 5 : range === 14 ? 2 : 1) === 0 || index === points.length - 1) && <text x={point.x} y={242} fill="#aaa" textAnchor="middle" fontSize="10">{point.label}</text>}
            </g>)}
          </svg>
        </div>
        <div className={styles.inspector}><label htmlFor={`${graphId}-date`}>Inspect a day<select id={`${graphId}-date`} value={selected.date} onChange={event => setSelectedDate(event.target.value)}>{points.map(point => <option key={point.date} value={point.date}>{point.date}</option>)}</select></label><output className={styles.tooltipBox} aria-live="polite">{selected.date}: {selected.visits} sessions · {selected.views} views · {selected.identifiedVisits} identified sessions</output></div>
        {!summary.totalViews && <p className={styles.emptyNotice}>No consented activity has been recorded in this period.</p>}
        <details className={styles.dailyDetails}><summary>View daily data as a table</summary><div className={styles.tableScroll} role="region" aria-label="Daily traffic data" tabIndex={0}><table className={styles.dataTable}><caption className={styles.srOnly}>Daily consented traffic counts in UTC</caption><thead><tr><th scope="col">Date (UTC)</th><th scope="col">Sessions</th><th scope="col">Views</th><th scope="col">Identified sessions</th></tr></thead><tbody>{points.map(point => <tr key={point.date}><th scope="row">{point.date}</th><td>{point.visits}</td><td>{point.views}</td><td>{point.identifiedVisits}</td></tr>)}</tbody></table></div></details>
      </div> : tab === "sessions" ? <div className={styles.tablePanel}>
        <div className={styles.tableToolbar}><label className={styles.searchLabel} htmlFor={`${graphId}-search`}>Find a visitor or public page<input id={`${graphId}-search`} type="search" value={filter} onChange={event => setFilter(event.target.value)} className={styles.searchInput} placeholder="Name or page path"/></label><span className={styles.tableCount}>{shown.length} matching session records</span></div>
        <div className={styles.tableScroll} role="region" aria-label="Recent visitor sessions" tabIndex={0}><table className={styles.dataTable}><caption className={styles.srOnly}>Up to 100 recent consented sessions in this reporting period</caption><thead><tr><th scope="col">Visitor</th><th scope="col">Last public page</th><th scope="col">Device</th><th scope="col">Views / duration</th><th scope="col">Last seen (IST)</th></tr></thead><tbody>{shown.map(session => <tr key={session.id}><td>{session.identified ? <>{session.displayName || "Verified visitor"}<br/><small>{session.email}</small></> : "Anonymous visitor"}</td><td><code>{session.lastPath}</code></td><td>{session.device} · {session.viewport}</td><td>{session.views} · {session.createdAt && session.lastSeen ? `${Math.max(0, Math.round((session.lastSeen - session.createdAt) / 60000))} min` : "—"}</td><td className={styles.monoCell}>{session.lastSeen !== null ? formatTime(session.lastSeen) : "Unavailable"}</td></tr>)}</tbody></table></div>
        {!shown.length && <p className={styles.emptyNotice}>{filter ? "No sessions match your search." : "No consented sessions have been recorded in this period."}</p>}
        <p className={styles.subtitle}>The feed contains up to 100 recently active sessions. Duration means time between first and last recorded event, not time spent on site. Device and viewport are coarse categories; no fingerprint or exact screen resolution is stored. Records expire after 30 days.</p>
      </div> : <div className={styles.tablePanel}>
        <div className={styles.tableToolbar}><label className={styles.searchLabel} htmlFor={`${graphId}-login-search`}>Search customer sign-ins<input id={`${graphId}-login-search`} type="search" value={filter} onChange={event => setFilter(event.target.value)} className={styles.searchInput} placeholder="Name, email, provider or device"/></label><span className={styles.tableCount}>{shownAuth.length} matching sign-ins</span></div>
        <div className={styles.tableScroll} role="region" aria-label="Consented customer sign-ins" tabIndex={0}><table className={styles.dataTable}><caption className={styles.srOnly}>Up to 100 recent verified, consented browser sign-ins</caption><thead><tr><th scope="col">Customer</th><th scope="col">Email</th><th scope="col">Method</th><th scope="col">Device</th><th scope="col">Time (IST)</th></tr></thead><tbody>{shownAuth.map(event => <tr key={event.id}><td>{event.displayName || "Verified customer"}</td><td><button className={styles.copyButton} type="button" title="Copy customer email" aria-label={`Copy email for ${event.displayName || "customer"}`} onClick={() => void navigator.clipboard.writeText(event.email)}>{event.email} <span aria-hidden="true">[COPY]</span></button></td><td>{event.provider}</td><td>{event.device}</td><td className={styles.monoCell}>{event.createdAt ? formatTime(event.createdAt) : "Unavailable"}</td></tr>)}</tbody></table></div>
        {!shownAuth.length && <p className={styles.emptyNotice}>{filter ? "No sign-ins match your search." : "No consented sign-ins have been recorded in this period."}</p>}
        <p className={styles.subtitle}>Only verified customers who opt in appear here. Sign-ins outside this browser flow or without consent are excluded. Records expire after 30 days.</p>
      </div>}
    </>}
  </section>;
}
