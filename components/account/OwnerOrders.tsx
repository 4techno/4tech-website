"use client";
import { usePortalRows } from "./use-portal-data";
import { portalCapabilities } from "@/lib/portal-config";
import { summarizeOrders } from "@/lib/visitor-model";
import { formatMoney, formatPortalDate, timestampMillis } from "@/lib/portal-model";
type Order = { id: string; path: string; uid: string; requestId: string; title: string; scope: string; currency: string; amountPaise: number; status: string; respondedAt: number | null };
const quoteMapper = (id: string, data: Record<string, unknown>): Order => {
  const path = String(data._path || ""), segments = path.split("/");
  return { id, path, uid: segments[1], requestId: segments[3], title: String(data.title || "Quotation"), scope: String(data.scope || ""), currency: String(data.currency), amountPaise: Number(data.amountPaise), status: String(data.status), respondedAt: timestampMillis(data.respondedAt) };
};
export default function OwnerOrders({ openProject }: { openProject: (uid: string, requestId: string) => void }) {
  const { rows, loading, error } = usePortalRows("quotes", portalCapabilities.workspace, quoteMapper, true);
  if (!portalCapabilities.workspace) return <section className="portal-panel portal-stack"><h2>Accepted orders</h2><p className="portal-muted">Connect the customer workspace to see accepted quotations here. Enquiries become orders when a customer accepts a quotation.</p></section>;
  if (error) return <p role="status" className="portal-status">{error}</p>;
  if (loading) return <p role="status" className="portal-muted">Loading quotations…</p>;
  const summary = summarizeOrders(rows);
  return <section className="portal-panel portal-stack"><h2>Accepted orders</h2><div className="portal-metrics"><div><span>Accepted quotations</span><strong>{summary.accepted.length}</strong></div><div><span>Accepted quoted value</span><strong>{formatMoney(summary.quotedValuePaise)}</strong></div><div><span>Awaiting a response</span><strong>{summary.pending}</strong></div></div><p className="portal-muted">Based on the 100 most recently created quotations. Accepted quoted value is not payment received; payment collection and reconciliation are handled separately.</p>{summary.accepted.length === 0 ? <p className="portal-empty">No accepted quotations in this selection. New enquiries appear under Projects & enquiries.</p> : <div className="portal-stack">{summary.accepted.map(order => <article key={order.path} className="portal-detail"><div className="portal-row"><h3>{order.title}</h3><span className="portal-tag">Accepted</span></div><p className="portal-muted whitespace-pre-wrap">{order.scope}</p><div className="portal-row"><strong>{formatMoney(order.amountPaise)}</strong><span className="portal-muted">Accepted {formatPortalDate(order.respondedAt)}</span></div><button className="portal-button" onClick={() => openProject(order.uid, order.requestId)}>Open customer project</button></article>)}</div>}</section>;
}
