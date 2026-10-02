"use client";
import { useEffect, useState } from "react";
import { getPrivateFileBlob, portalError, respondToQuotation, uploadPortalFile } from "@/lib/portal-client";
import { portalCapabilities } from "@/lib/portal-config";
import { formatMoney, formatPortalDate, timestampMillis, type PortalFile, type PortalQuote, type PortalUpdate } from "@/lib/portal-model";
import { usePortalRows } from "./use-portal-data";
import "./portal.css";

export const fileMapper = (id: string, data: Record<string, unknown>): PortalFile => ({ id, name: String(data.name ?? "File"), storagePath: String(data.storagePath ?? ""), contentType: String(data.contentType ?? ""), size: Number(data.size ?? 0), createdAt: timestampMillis(data.createdAt) });
const quoteMapper = (id: string, data: Record<string, unknown>): PortalQuote => ({ ...data, id, createdAt: timestampMillis(data.createdAt), respondedAt: timestampMillis(data.respondedAt), validUntil: timestampMillis(data.validUntil) ?? 0 } as PortalQuote);
const updateMapper = (id: string, data: Record<string, unknown>): PortalUpdate => ({ ...data, id, createdAt: timestampMillis(data.createdAt) } as PortalUpdate);

export function FileDownload({ file }: { file: PortalFile }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  async function download() {
    setBusy(true); setError("");
    try {
      const blob = await getPrivateFileBlob(file), url = URL.createObjectURL(blob), anchor = document.createElement("a");
      anchor.href = url; anchor.download = file.name; document.body.append(anchor); anchor.click(); anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch (cause) { setError(portalError(cause)); }
    finally { setBusy(false); }
  }
  return <div><button className="portal-button" onClick={() => void download()} disabled={busy || !portalCapabilities.uploads}>{busy ? "Preparing…" : "↓"} {file.name} <span className="portal-muted">{(file.size / 1024).toFixed(0)} KB</span></button>{error && <p role="status" className="portal-status">{error}</p>}</div>;
}

export function PrivatePhoto({ file }: { file: PortalFile }) {
  const [url, setUrl] = useState(""), [error, setError] = useState("");
  useEffect(() => {
    let active = true, objectUrl = "";
    setUrl(""); setError("");
    getPrivateFileBlob(file).then(blob => { if (active) { objectUrl = URL.createObjectURL(blob); setUrl(objectUrl); } }).catch(cause => { if (active) setError(portalError(cause)); });
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [file.id, file.storagePath]);
  // Blob images are authenticated, temporary browser URLs, never public download URLs.
  return url ? <img src={url} alt={file.name} width={400} height={300}/> : <p className="portal-empty">{error || "Loading private image…"}</p>;
}

export function UploadControl({ destination, imagesOnly = false }: { destination: { uid: string; requestId: string } | { category: "personal" | "business" }; imagesOnly?: boolean }) {
  const [busy, setBusy] = useState(false), [progress, setProgress] = useState(0), [status, setStatus] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true); setProgress(0); setStatus("Uploading securely…");
    try { await uploadPortalFile(file, destination, setProgress); setStatus(imagesOnly ? "Photo added to your private library." : "File attached to this project."); }
    catch (cause) { setStatus(portalError(cause)); }
    finally { setBusy(false); }
  }
  return <div className="portal-stack">
    {portalCapabilities.uploads ? <label className="portal-field">{imagesOnly ? "Upload photo" : "Attach project file"}<input type="file" accept={imagesOnly ? "image/jpeg,image/png,image/webp,image/avif" : "application/pdf,image/jpeg,image/png,image/webp,image/avif"} disabled={busy} onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; void upload(file); }}/><span className="portal-muted">{imagesOnly ? "JPG, PNG, WebP or AVIF · up to 8 MB" : "PDF or image · up to 10 MB"}</span></label> : <p className="portal-muted">Uploads will be available once private file storage is activated. Your enquiries and project updates remain available.</p>}
    {busy && <progress className="portal-progress" aria-label="Upload progress" max={100} value={progress}/>}
    {status && <p className="portal-status" role="status">{status}</p>}
  </div>;
}

function QuoteCard({ quote, uid, requestId, owner }: { quote: PortalQuote; uid: string; requestId: string; owner: boolean }) {
  const [busy, setBusy] = useState(false), [status, setStatus] = useState(""), [confirm, setConfirm] = useState<"Accepted" | "Declined" | null>(null);
  const expired = quote.validUntil <= Date.now();
  async function respond() {
    if (!confirm) return;
    setBusy(true); setStatus("");
    try { await respondToQuotation(uid, requestId, quote.id, confirm); setConfirm(null); setStatus("Your response has been recorded."); }
    catch (cause) { setStatus(portalError(cause)); }
    finally { setBusy(false); }
  }
  return <article className="portal-quote"><div className="portal-row"><h4>{quote.title}</h4><span className="portal-tag" data-accent="true">{quote.status === "Sent" && expired ? "Expired" : quote.status}</span></div><div className="portal-quote-amount">{formatMoney(quote.amountPaise)}</div><p className="portal-muted">{quote.scope}</p><details className="portal-detail"><summary>Terms & validity</summary><p className="portal-muted">{quote.terms}</p><p className="portal-muted">Valid until {formatPortalDate(quote.validUntil)} · Created {formatPortalDate(quote.createdAt)}</p></details>
    {!owner && quote.status === "Sent" && !expired && <div className="mt-4 portal-stack">{confirm ? <div><p className="portal-muted">{confirm === "Accepted" ? "Confirm that you accept this scope, amount and the terms above. No payment is collected by this action." : "Confirm that you want to decline this quotation."}</p><div className="portal-row mt-3"><button className="portal-button portal-button-primary" disabled={busy} onClick={() => void respond()}>{busy ? "Saving…" : `Confirm ${confirm === "Accepted" ? "acceptance" : "decline"}`}</button><button className="portal-button" disabled={busy} onClick={() => setConfirm(null)}>Cancel</button></div></div> : <div className="portal-row"><button className="portal-button portal-button-primary" onClick={() => setConfirm("Accepted")}>Review & accept</button><button className="portal-button" onClick={() => setConfirm("Declined")}>Decline</button></div>}</div>}
    {quote.respondedAt && <p className="portal-muted mt-3">Response recorded {formatPortalDate(quote.respondedAt)}</p>}{status && <p role="status" className="portal-status">{status}</p>}
  </article>;
}

export default function ProjectWorkspace({ uid, requestId, owner = false }: { uid: string; requestId: string; owner?: boolean }) {
  const base = `users/${uid}/requests/${requestId}`;
  const quotes = usePortalRows(`${base}/quotes`, true, quoteMapper), updates = usePortalRows(`${base}/updates`, true, updateMapper), files = usePortalRows(`${base}/files`, portalCapabilities.uploads, fileMapper);
  return <div className="portal-space">
    <details className="portal-detail" open={owner}><summary>Quotations {quotes.rows.length > 0 && `(${quotes.rows.length})`}</summary><div className="portal-stack">{quotes.error ? <p className="portal-status">{quotes.error}</p> : quotes.loading ? <p className="portal-muted">Loading quotations…</p> : quotes.rows.length === 0 ? <p className="portal-muted">Quotations will appear here when your scope is ready.</p> : quotes.rows.map(quote => <QuoteCard key={quote.id} quote={quote} uid={uid} requestId={requestId} owner={owner}/>)}</div></details>
    <details className="portal-detail"><summary>Project timeline</summary>{updates.error ? <p className="portal-status">{updates.error}</p> : updates.loading ? <p className="portal-muted">Loading updates…</p> : updates.rows.length === 0 ? <p className="portal-muted">Your project milestones and updates will appear here.</p> : <ol className="portal-timeline">{updates.rows.map(update => <li key={update.id}><div className="portal-row"><span className="portal-tag">{update.status}</span><span className="portal-muted">{formatPortalDate(update.createdAt)}</span></div><p className="portal-muted mt-2 whitespace-pre-wrap">{update.message}</p></li>)}</ol>}</details>
    <details className="portal-detail"><summary>Project files</summary><UploadControl destination={{ uid, requestId }}/>{files.error && <p className="portal-status">{files.error}</p>}<div className="portal-stack mt-4">{files.rows.map(file => <FileDownload key={file.id} file={file}/>)}</div></details>
  </div>;
}
