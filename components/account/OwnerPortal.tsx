"use client";
import Link from "next/link";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirebaseClient } from "@/lib/firebase";
import { useEffect, useState, type FormEvent } from "react";
import { AuthPanel } from "./AccountPortal";
import { useCustomerAccount } from "./use-customer-account";
import { useOwnerAccess, usePortalRows } from "./use-portal-data";
import ProjectWorkspace, { fileMapper, PrivatePhoto, UploadControl } from "./ProjectWorkspace";
import { portalError, publishProjectUpdate, readCustomerProfile, removeOwnerPhoto, sendQuotation } from "@/lib/portal-client";
import { formatPortalDate, projectStatuses, timestampMillis, type MediaCategory, type PortalFile, type ProjectStatus, type QuoteInput } from "@/lib/portal-model";
import OwnerOrders from "./OwnerOrders";
import FounderAnalyticsDashboard from "./FounderAnalyticsDashboard";
import "./portal.css";

type OwnerRequest = { id: string; uid: string; title: string; category: string; timeline: string; details: string; status: ProjectStatus; createdAt: number | null };
const requestMapper = (id: string, data: Record<string, unknown>): OwnerRequest => ({ ...data, id, uid: String(data._path).split("/")[1], createdAt: timestampMillis(data.createdAt) } as OwnerRequest);

function ProjectEditor({ request }: { request: OwnerRequest }) {
  const [status, setStatus] = useState<ProjectStatus>(request.status), [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false), [notice, setNotice] = useState("");
  const [profile, setProfile] = useState<{ displayName: string; email: string } | null>(null);
  const [quote, setQuote] = useState<QuoteInput>({ title: `${request.title} — quotation`.slice(0, 120), scope: "", amount: "", terms: "", validUntil: "" });
  useEffect(() => { let active = true; void readCustomerProfile(request.uid).then(data => { if (active && data) setProfile({ displayName: String(data.displayName ?? ""), email: String(data.email ?? "") }); }).catch(() => {}); return () => { active = false; }; }, [request.uid]);
  async function update(event: FormEvent) {
    event.preventDefault(); setBusy(true); setNotice("");
    try { await publishProjectUpdate(request.uid, request.id, status, message); setMessage(""); setNotice("Project update published to the customer’s workspace."); }
    catch (cause) { setNotice(portalError(cause)); } finally { setBusy(false); }
  }
  async function quotation(event: FormEvent) {
    event.preventDefault(); setBusy(true); setNotice("");
    try { await sendQuotation(request.uid, request.id, quote); setQuote({ title: "", scope: "", amount: "", terms: "", validUntil: "" }); setNotice("Quotation sent to the customer’s workspace."); }
    catch (cause) { setNotice(portalError(cause)); } finally { setBusy(false); }
  }
  return <section className="portal-panel portal-stack"><div className="portal-row"><span className="portal-tag" data-accent="true">{request.status}</span><span className="portal-muted">{formatPortalDate(request.createdAt)}</span></div><h2 className="!text-2xl">{request.title}</h2>{profile && <p className="portal-muted">{profile.displayName}{profile.email && <> · <a className="underline underline-offset-4" href={`mailto:${profile.email}`}>{profile.email}</a></>}</p>}<p className="portal-muted">{request.category}{request.timeline && ` · ${request.timeline}`}</p><p className="portal-muted whitespace-pre-wrap">{request.details}</p>
    <form onSubmit={update} className="portal-stack portal-detail"><h3>Post a project update</h3><label className="portal-field">Stage<select value={status} onChange={event => setStatus(event.target.value as ProjectStatus)}>{projectStatuses.map(value => <option key={value}>{value}</option>)}</select></label><label className="portal-field">Update for the customer<textarea minLength={3} maxLength={4000} required value={message} onChange={event => setMessage(event.target.value)} placeholder="What changed, what happens next, and what you need from the customer."/></label><button className="portal-button portal-button-primary" disabled={busy}>Publish update</button></form>
    <details className="portal-detail"><summary>Create a quotation</summary><form onSubmit={quotation} className="portal-stack"><label className="portal-field">Quotation title<input required minLength={3} maxLength={120} value={quote.title} onChange={event => setQuote({ ...quote, title: event.target.value })}/></label><label className="portal-field">Scope & deliverables<textarea required minLength={10} maxLength={6000} value={quote.scope} onChange={event => setQuote({ ...quote, scope: event.target.value })}/></label><div className="grid gap-4 sm:grid-cols-2"><label className="portal-field">Total amount (INR)<input required inputMode="decimal" placeholder="15000.00" value={quote.amount} onChange={event => setQuote({ ...quote, amount: event.target.value })}/></label><label className="portal-field">Valid until<input type="date" required value={quote.validUntil} onChange={event => setQuote({ ...quote, validUntil: event.target.value })}/></label></div><label className="portal-field">Payment, tax & delivery terms<textarea required minLength={10} maxLength={4000} value={quote.terms} onChange={event => setQuote({ ...quote, terms: event.target.value })} placeholder="State whether tax is included, milestones, payment schedule and delivery assumptions."/></label><p className="portal-muted">Sending this quotation makes it visible to this customer. They can accept or decline it here. Payment collection is handled separately.</p><button className="portal-button portal-button-primary" disabled={busy}>Send quotation</button></form></details>
    <p role="status" className="portal-status">{notice}</p><ProjectWorkspace uid={request.uid} requestId={request.id} owner/>
  </section>;
}

function PhotoLibrary({ uid, category }: { uid: string; category: MediaCategory }) {
  const { rows, loading, error } = usePortalRows(`ownerMedia/${uid}/${category}`, true, fileMapper);
  const [status, setStatus] = useState(""), [deleting, setDeleting] = useState(""), [confirm, setConfirm] = useState("");
  async function remove(file: PortalFile) {
    setDeleting(file.id); setStatus("");
    try { await removeOwnerPhoto(category, file); setConfirm(""); setStatus("Photo removed from this private library."); }
    catch (cause) { setStatus(portalError(cause)); } finally { setDeleting(""); }
  }
  return <section className="portal-panel portal-stack"><div className="portal-row"><h2>{category === "personal" ? "Your personal photos" : "Business photo library"}</h2><span className="portal-tag">Private · Owner only</span></div><p className="portal-muted">{category === "personal" ? "Keep your portraits and personal photos in a separate private library." : "Organize engineering builds, studio photos and business images separately from personal photos."} Uploading a photo does not publish it on the website.</p><UploadControl imagesOnly destination={{ category }}/>{status && <p className="portal-status" role="status">{status}</p>}{error ? <p className="portal-status">{error}</p> : loading ? <p className="portal-muted">Loading your library…</p> : rows.length === 0 ? <p className="portal-empty">Your library is ready for its first photo.</p> : <div className="portal-media">{rows.map(file => <article className="portal-photo" key={file.id}><PrivatePhoto file={file}/><p>{file.name}</p>{confirm === file.id ? <div className="portal-stack"><p>Delete this photo permanently?</p><button className="portal-button" disabled={!!deleting} onClick={() => void remove(file)}>{deleting ? "Deleting…" : "Confirm delete"}</button><button className="portal-button" disabled={!!deleting} onClick={() => setConfirm("")}>Cancel</button></div> : <button className="portal-button" disabled={!!deleting} onClick={() => setConfirm(file.id)}>Remove photo</button>}</article>)}</div>}</section>;
}

function OwnerWorkspace({ uid }: { uid: string }) {
  const [tab, setTab] = useState<"analytics" | "projects" | "orders" | MediaCategory>("analytics"), [selection, setSelection] = useState(""), [filter, setFilter] = useState("");
  const [stage, setStage] = useState<ProjectStatus | "All">("All");
  const { rows, loading, error } = usePortalRows("requests", true, requestMapper, true);
  const [opened, setOpened] = useState<{ key: string; request: OwnerRequest | null; error: string }>({ key: "", request: null, error: "" });
  useEffect(() => {
    if (!selection) return;
    let active = true;
    setOpened({ key: selection, request: null, error: "" });
    const [customerUid, requestId] = selection.split("/");
    let unsubscribe = () => {};
    try {
      unsubscribe = onSnapshot(doc(getFirebaseClient().db, "users", customerUid, "requests", requestId), snapshot => {
        if (active) setOpened({ key: selection, request: snapshot.exists() ? requestMapper(snapshot.id, { ...snapshot.data(), _path: snapshot.ref.path }) : null, error: snapshot.exists() ? "" : "This customer project is no longer available." });
      }, cause => { if (active) setOpened({ key: selection, request: null, error: portalError(cause) }); });
    } catch (cause) { setOpened({ key: selection, request: null, error: portalError(cause) }); }
    return () => { active = false; unsubscribe(); };
  }, [selection]);
  const selected = (opened.key === selection ? opened.request : null) || rows.find(item => `${item.uid}/${item.id}` === selection);
  const search = filter.trim().toLowerCase();
  const shown = rows.filter(item => (stage === "All" || item.status === stage) && `${item.title} ${item.category} ${item.status}`.toLowerCase().includes(search));
  return (
    <div className="portal-space">
      <div className="portal-tabs" aria-label="Owner dashboard sections">
        <button aria-pressed={tab === "analytics"} onClick={() => setTab("analytics")}>
          Traffic &amp; sessions
        </button>
        <button aria-pressed={tab === "projects"} onClick={() => setTab("projects")}>
          Projects &amp; enquiries <span className="ml-2 opacity-60">{rows.length}</span>
        </button>
        <button aria-pressed={tab === "orders"} onClick={() => setTab("orders")}>
          Accepted orders
        </button>
        <button aria-pressed={tab === "personal"} onClick={() => setTab("personal")}>
          Personal photos
        </button>
        <button aria-pressed={tab === "business"} onClick={() => setTab("business")}>
          Business photos
        </button>
      </div>

      {tab === "analytics" ? (
        <FounderAnalyticsDashboard uid={uid} />
      ) : tab === "orders" ? (
        <OwnerOrders openProject={(customerUid, requestId) => { setSelection(customerUid + "/" + requestId); setTab("projects"); }}/>
      ) : tab !== "projects" ? (
        <PhotoLibrary key={tab} uid={uid} category={tab}/>
      ) : (
        <div className="portal-grid portal-owner-grid">
          <section className="portal-panel portal-stack">
            <h2>Customer enquiries</h2>
            <label className="portal-field">
              Search projects
              <input type="search" value={filter} onChange={event => setFilter(event.target.value)} placeholder="Title, domain or stage"/>
            </label>
            <label className="portal-field">
              Project stage
              <select value={stage} onChange={event => setStage(event.target.value as ProjectStatus | "All")}>
                <option value="All">All stages</option>
                {projectStatuses.map(value => <option key={value} value={value}>{value}{!loading && !error ? ` (${rows.filter(item => item.status === value).length})` : ""}</option>)}
              </select>
            </label>
            {(search || stage !== "All") && <button className="portal-button self-start" onClick={() => { setFilter(""); setStage("All"); }}>Clear filters</button>}
            {error ? <p className="portal-status">{error}</p> : loading ? <p className="portal-muted">Connecting to your workspace…</p> : shown.length === 0 ? <p className="portal-empty">{search || stage !== "All" ? "No projects match these filters." : "Customer enquiries will appear here."}</p> : <div className="portal-request-list">{shown.map(item => <button key={`${item.uid}/${item.id}`} aria-current={selection === `${item.uid}/${item.id}`} onClick={() => setSelection(`${item.uid}/${item.id}`)}><strong>{item.title}</strong><div className="portal-row"><span className="portal-tag">{item.status}</span><span className="portal-muted">{formatPortalDate(item.createdAt)}</span></div></button>)}</div>}
            <p className="portal-muted" role="status">{!loading && !error ? `${shown.length} matching ${shown.length === 1 ? "enquiry" : "enquiries"} from the ${rows.length} most recent records. ` : ""}This view loads up to 100 enquiries.</p>
          </section>
          {selected ? <ProjectEditor key={`${selected.uid}/${selected.id}`} request={selected}/> : <section className="portal-panel"><p className="portal-empty">{selection ? (opened.key === selection && opened.error) || "Loading the selected customer project…" : "Select a project to review its brief, post progress updates, attach files and prepare a quotation."}</p></section>}
        </div>
      )}
    </div>
  );
}

export default function OwnerPortal() {
  const account = useCustomerAccount();
  const { owner, checking, error, locked, retryVerification, lockOwnerAccess } = useOwnerAccess(account.customer?.uid);
  const [lockStatus, setLockStatus] = useState("");
  const [locking, setLocking] = useState(false);

  const handleLock = async () => {
    if (locking) return;
    lockOwnerAccess();
    setLocking(true);
    setLockStatus("Dashboard locked. Signing out…");
    const signedOut = await account.signOut();
    setLockStatus(signedOut ? "Dashboard locked and this browser signed out." : "Dashboard remains locked. Sign-out did not finish; retry before leaving this device.");
    setLocking(false);
  };

  if (!account.ready && !account.unavailable && checking) {
    return <p className="portal-muted" role="status">Connecting to workspace…</p>;
  }

  if (checking) {
    return <p className="portal-muted" role="status">Verifying founder clearance…</p>;
  }

  if (!owner || !account.customer?.verified) {
    return (
      <section className="portal-panel portal-stack max-w-xl mx-auto my-6 p-6 sm:p-8 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="portal-row border-b border-white/10 pb-4">
          <div>
            <h2 className="!text-2xl font-bold tracking-tight text-white">Owner Access Restricted</h2>
            <p className="portal-muted text-xs mt-1">4TECH founder workspace</p>
          </div>
          <span className="portal-tag border border-white/20 text-neutral-300">Restricted</span>
        </div>

        <p className="portal-muted text-sm leading-relaxed">
          Sign in with a verified account that has been assigned owner access. Customer accounts cannot open this workspace.
        </p>
        {lockStatus && <p className="portal-status" role="status">{lockStatus}</p>}
        {error && <div className="portal-stack"><p className="portal-status" role="alert">{error}</p>{!locked && <button className="portal-button" onClick={retryVerification}>Retry verification</button>}</div>}

        {account.customer ? (
          <div className="portal-stack p-4 rounded-xl bg-white/[0.02] border border-white/10">
            <p className="text-sm text-neutral-300">
              Signed in as: <strong className="text-white">{account.customer.email}</strong>
            </p>
            <p className="text-xs text-neutral-400">
              {locked ? "This workspace is locked. Sign out before signing in again." : account.customer.verified ? "Owner access has not been verified for this account." : "Verify your email in your customer account before requesting owner access."}
            </p>
            <div className="portal-row mt-2">
              <Link href="/account" className="portal-button text-xs">Customer Account</Link>
              <button className="portal-button text-xs" disabled={locking || account.authBusy} onClick={() => void handleLock()}>
                {locking ? "Signing out…" : "Sign out & switch account"}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
            <p className="text-xs text-neutral-400 mb-3">
              Sign in to verify your workspace access.
            </p>
            <AuthPanel account={account} />
          </div>
        )}
      </section>
    );
  }

  const displayName = account.customer.displayName || account.customer.email || "Owner";
  const uid = account.customer.uid;

  return (
    <>
      <div className="portal-row border-b border-white/10 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-white">4TECH Founder Dashboard</h2>
            <span className="portal-tag" data-accent="true">Verified owner</span>
          </div>
          <p className="portal-muted text-xs mt-1">
            Authorized for <strong className="text-white">{displayName}</strong> · Private workspace
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="portal-button border border-white/20 hover:border-white/50 text-xs"
            onClick={() => void handleLock()}
            disabled={locking}
            title="Lock founder dashboard session"
          >
            Lock dashboard
          </button>
        </div>
      </div>
      <OwnerWorkspace key={uid} uid={uid} />
    </>
  );
}
