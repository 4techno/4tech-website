"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseClient } from "@/lib/firebase";
import { portalCapabilities } from "@/lib/portal-config";
import { recordConsentedVisit } from "@/lib/visitor-client";
import { publicAnalyticsPath, readVisitorConsent, VISITOR_CONSENT_KEY, VISITOR_SESSION_KEY, type VisitorConsent } from "@/lib/visitor-model";
import { clearLegacyTelemetry } from "@/lib/privacy-migration";
import styles from "./visitor-analytics.module.css";

export default function VisitorAnalytics() {
  const path = usePathname();
  const [consent, setConsent] = useState<VisitorConsent | null>(null), [ready, setReady] = useState(false), [editing, setEditing] = useState(false), [identify, setIdentify] = useState(false);
  const [identity, setIdentity] = useState<string | null>(null);

  useEffect(() => {
    try { clearLegacyTelemetry(localStorage, sessionStorage); } catch { /* Storage is optional. */ }
  }, []);
  useEffect(() => {
    if (!portalCapabilities.visitorAnalytics) return;
    const sync = () => { try { const stored = readVisitorConsent(localStorage.getItem(VISITOR_CONSENT_KEY)); setConsent(stored); setIdentify(stored?.identify ?? false); } catch { setConsent(null); } setReady(true); };
    sync(); window.addEventListener("storage", sync); window.addEventListener("focus", sync);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener("focus", sync); };
  }, []);
  useEffect(() => {
    setIdentity(null);
    if (!portalCapabilities.visitorAnalytics || !consent?.analytics || !consent.identify) return;
    return onAuthStateChanged(getFirebaseClient().auth, user => setIdentity(user?.emailVerified ? user.uid : null));
  }, [consent?.analytics, consent?.identify]);
  useEffect(() => {
    if (!ready || !consent?.analytics || !portalCapabilities.visitorAnalytics) return;
    const publicPath = publicAnalyticsPath(path);
    if (!publicPath) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      try {
        // Scope sessions to the current privacy choice/account; never merge anonymous
        // history with a newly identified account. The ID dies with this browser tab.
        const scope = `${new Date().toISOString().slice(0, 10)}:${consent.identify && identity ? identity : "anonymous"}`;
        const saved = JSON.parse(sessionStorage.getItem(VISITOR_SESSION_KEY) || "null");
        const sessionId = saved?.scope === scope && /^[a-f0-9-]{36}$/.test(saved?.id) ? saved.id : crypto.randomUUID();
        sessionStorage.setItem(VISITOR_SESSION_KEY, JSON.stringify({ scope, id: sessionId }));
        if (!cancelled) void recordConsentedVisit(sessionId, publicPath, consent.identify && !!identity).catch(() => { /* Optional analytics never blocks navigation or retries indefinitely. */ });
      } catch { /* Blocked storage means no analytics collection. */ }
    }, 800);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [path, ready, consent, identity]);
  function save(analytics: boolean) {
    const next: VisitorConsent = { version: 2, analytics, identify: analytics && identify, savedAt: Date.now() };
    try { localStorage.setItem(VISITOR_CONSENT_KEY, JSON.stringify(next)); sessionStorage.removeItem(VISITOR_SESSION_KEY); } catch { return; }
    setConsent(next); setEditing(false);
  }
  if (!portalCapabilities.visitorAnalytics || !ready || path.startsWith("/owner")) return null;
  if (consent && !editing) return <button className={styles.reopen} onClick={() => setEditing(true)} aria-label="Change visitor analytics preferences">Privacy choices</button>;
  return <aside className={styles.notice} aria-label="Optional visitor analytics"><h2>Your visit, your choice.</h2><p>Allow 4TECH to count public pages, coarse device and viewport categories, and the time between recorded visits? This feature does not store exact screen dimensions or device fingerprints. Declining will not affect your visit.</p><label><input type="checkbox" checked={identify} onChange={event => setIdentify(event.target.checked)}/> Also share my verified account name, email and successful sign-ins with the founder.</label><p className={styles.small}>Off by default. Anonymous visitors remain anonymous. Records expire after 30 days. <Link href="/privacy">Privacy details</Link></p><div><button onClick={() => save(false)}>Decline analytics</button><button onClick={() => save(true)}>Allow selected</button>{consent && <button onClick={() => setEditing(false)}>Cancel</button>}</div></aside>;
}
