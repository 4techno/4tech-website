"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirebaseClient } from "@/lib/firebase";
import { markNotificationRead, portalError, saveNotificationPreferences } from "@/lib/portal-client";
import { portalCapabilities } from "@/lib/portal-config";
import { formatPortalDate, timestampMillis, type PortalNotification } from "@/lib/portal-model";
import { usePortalRows } from "./use-portal-data";
import "./portal.css";
const mapper = (id: string, data: Record<string, unknown>): PortalNotification => ({ ...data, id, createdAt: timestampMillis(data.createdAt) } as PortalNotification);
export default function NotificationCenter({ uid, verified }: { uid: string; verified: boolean }) {
  const { rows, loading, error } = usePortalRows(`users/${uid}/notifications`, true, mapper);
  const [emailEnabled, setEmailEnabled] = useState(false), [status, setStatus] = useState(""), [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true, unsubscribe = () => {};
    setEmailEnabled(false);
    try {
      unsubscribe = onSnapshot(doc(getFirebaseClient().db, "users", uid, "preferences", "notifications"), snapshot => {
        if (active) setEmailEnabled(snapshot.data()?.emailEnabled === true);
      }, () => { if (active) { setEmailEnabled(false); setStatus("Notification preferences are not available yet."); } });
    } catch { setStatus("Notification preferences are not available yet."); }
    return () => { active = false; unsubscribe(); };
  }, [uid]);
  async function changePreference() {
    setBusy(true); setStatus("");
    try { await saveNotificationPreferences(!emailEnabled); setStatus("Notification preference saved."); }
    catch (cause) { setStatus(portalError(cause)); }
    finally { setBusy(false); }
  }
  return <details className="portal-space portal-panel mb-6"><summary className="cursor-pointer text-sm">Notifications <span className="portal-tag ml-2">{rows.filter(item => !item.read).length} unread</span></summary><div className="portal-detail"><div className="portal-row"><div><h3>Email updates</h3><p className="portal-muted">{portalCapabilities.emailNotifications ? "Receive an email when 4tech posts a project update or quotation." : "Updates appear here. Email notifications will become available after the email service is activated."}</p></div><button className="portal-button" aria-pressed={emailEnabled} disabled={busy || !verified || (!portalCapabilities.emailNotifications && !emailEnabled)} onClick={() => void changePreference()}>{emailEnabled ? "Turn off email updates" : "Enable email updates"}</button></div>{status && <p role="status" className="portal-status">{status}</p>}{error && <p className="portal-status">{error}</p>}{loading ? <p className="portal-muted">Loading notifications…</p> : rows.length === 0 ? <p className="portal-muted mt-4">You’re up to date. New project updates and quotations will appear here.</p> : rows.map(item => <article className="portal-notification" data-unread={!item.read} key={item.id}><div className="portal-row"><h4 className="text-sm">{item.title}</h4><span className="portal-muted">{formatPortalDate(item.createdAt)}</span></div><p className="portal-muted mt-2">{item.body}</p><div className="portal-row mt-3"><a className="portal-button" href={`#request-${item.requestId}`}>Open project</a>{!item.read && <button className="portal-button" onClick={() => void markNotificationRead(item.id).catch(cause => setStatus(portalError(cause)))}>Mark as read</button>}</div></article>)}</div></details>;
}
