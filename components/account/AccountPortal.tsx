"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import SocialLinks from "@/components/social-links";
import { projects } from "@/lib/projects";
import {
  requestCategories, useCustomerAccount, type CustomerRequest, type RequestInput,
} from "./use-customer-account";

type AccountController = ReturnType<typeof useCustomerAccount>;

function ContactFallback() {
  return <div><p className="mb-4 text-sm leading-6 text-neutral-400">Prefer a direct conversation? Connect with 4tech.</p><SocialLinks label="Contact 4tech directly"/></div>;
}

function AuthPanel({ account }: { account: AccountController }) {
  const [register, setRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const disabled = !account.ready || account.unavailable || account.authBusy;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    try { await account.signInEmail({ email, password, name, register }); }
    finally { setPassword(""); }
  }
  return <section id="auth-panel" className="panel p-6 sm:p-9" aria-labelledby="auth-title">
    <div className="mb-7 flex items-start justify-between gap-4">
      <div><p className="section-kicker mb-3">Your customer space</p><h2 id="auth-title" className="text-2xl font-medium tracking-tight sm:text-3xl">{register ? "Let’s get acquainted." : "Good to see you."}</h2></div>
      <span className="mt-1 rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-400">4tech ID</span>
    </div>
    <button id="google-signin" type="button" className="button-secondary w-full justify-center disabled:cursor-not-allowed disabled:opacity-40" disabled={disabled || !account.googleEnabled} onClick={() => void account.signInGoogle()}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M21.8 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.6ZM12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.6c-.9.6-2 1-3.4 1-2.6 0-4.7-1.7-5.5-4.1H3.1v2.7A10 10 0 0 0 12 22ZM6.5 13.9A6 6 0 0 1 6.2 12c0-.7.1-1.3.3-1.9V7.4H3.1A10 10 0 0 0 2 12c0 1.7.4 3.3 1.1 4.6l3.4-2.7ZM12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.9 5.4l3.4 2.7C7.3 7.7 9.4 6 12 6Z"/></svg>
      Continue with Google
    </button>
    <div className="my-6 flex items-center gap-4 text-xs text-neutral-500"><span className="h-px flex-1 bg-white/10"/>or use your email<span className="h-px flex-1 bg-white/10"/></div>
    <form id="email-auth-form" onSubmit={submit} aria-busy={account.authBusy}>
      <fieldset className="space-y-4" disabled={disabled || !account.emailEnabled}>
        {register && <div data-name-field><label className="field-label" htmlFor="account-name">Your name</label><input id="account-name" name="name" className="field-input" autoComplete="name" required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="How should we address you?"/></div>}
        <div><label className="field-label" htmlFor="account-email">Email address</label><input ref={emailRef} id="account-email" name="email" className="field-input" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com"/></div>
        <div><label className="field-label" htmlFor="account-password">Password</label><input id="account-password" name="password" className="field-input" type="password" autoComplete={register ? "new-password" : "current-password"} required minLength={register ? 12 : 1} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={register ? "At least 12 characters" : "Your password"} aria-describedby={register ? "password-help" : undefined}/>{register && <p id="password-help" className="mt-2 text-xs leading-5 text-neutral-400">Use at least 12 characters. You’ll verify your email before submitting a request.</p>}</div>
        <button type="submit" className="button-primary mt-2 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40">{account.authBusy ? "Please wait…" : register ? "Create account" : "Sign in"}<span aria-hidden="true">↗</span></button>
      </fieldset>
    </form>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 text-sm">
      <button id="auth-mode" type="button" className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-white disabled:opacity-40" disabled={disabled || !account.emailEnabled} onClick={() => { setRegister(!register); setPassword(""); account.clearAuthStatus(); }}>{register ? "Already registered? Sign in" : "New here? Create an account"}</button>
      {!register && <button id="reset-password" type="button" className="text-neutral-400 underline decoration-white/20 underline-offset-4 hover:text-white disabled:opacity-40" disabled={disabled || !account.emailEnabled || account.resetCoolingDown} onClick={() => { if (emailRef.current?.reportValidity()) void account.resetPassword(email); }}>{account.resetCoolingDown ? "Reset requested" : "Forgot password?"}</button>}
    </div>
    <p id="auth-status" role="status" aria-live="polite" className="mt-5 min-h-6 text-sm leading-6 text-neutral-300">{account.authStatus || (!account.ready && !account.unavailable ? "Connecting to secure sign-in…" : "")}</p>
    <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-5 text-neutral-500">Your account is for enquiries and project updates. Public projects remain open to everyone. <Link className="text-neutral-300 underline underline-offset-4" href="/privacy">How we handle your information</Link></p>
  </section>;
}

function dateLabel(milliseconds: number | null) {
  if (milliseconds === null) return "Date unavailable";
  try { return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(milliseconds); }
  catch { return "Date unavailable"; }
}

function RequestCard({ request }: { request: CustomerRequest }) {
  return <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
    <div className="mb-3 flex flex-wrap items-center gap-3"><span className="rounded-full border border-[#ff3b55]/25 bg-[#ff3b55]/10 px-3 py-1 text-xs text-[#ff8697]">{request.pending ? "Awaiting confirmation" : request.status}</span><span className="text-xs text-neutral-500">{request.pending ? "Saving securely…" : dateLabel(request.createdAt)}</span></div>
    <h4 className="break-words text-lg font-medium tracking-tight">{request.title}</h4>
    <p className="mt-1 text-xs leading-5 text-neutral-400">{request.category}{request.timeline ? ` · Timeline: ${request.timeline}` : ""}</p>
    <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-300">{request.details}</p>
    {request.updateMessage.trim() && <div className="mt-5 rounded-xl border-l-2 border-[#ff3b55] bg-white/[0.03] px-4 py-3"><p className="mb-2 text-xs font-medium text-[#ff8697]">Update from 4tech{request.updatedAt !== null ? ` · ${dateLabel(request.updatedAt)}` : ""}</p><p className="whitespace-pre-wrap break-words text-sm leading-6 text-neutral-300">{request.updateMessage}</p></div>}
  </article>;
}

function RequestForm({ account, projectName }: { account: AccountController; projectName?: string }) {
  const [title, setTitle] = useState(projectName ? `Enquiry: ${projectName}`.slice(0, 120) : "");
  const [category, setCategory] = useState<string>(requestCategories[0]);
  const [timeline, setTimeline] = useState("");
  const [details, setDetails] = useState("");
  const connected = account.historyState === "ready";
  const disabled = !account.customer?.verified || account.requestBusy || account.authBusy || account.unavailable || !connected;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const input: RequestInput = { title, category, timeline, details };
    if (await account.submitRequest(input)) { setTitle(""); setCategory(requestCategories[0]); setTimeline(""); setDetails(""); }
  }
  return <section className="panel p-6 sm:p-8" aria-labelledby="request-heading">
    <p className="section-kicker mb-3">Start something</p><h3 id="request-heading" className="text-2xl font-medium tracking-tight">Tell us what you have in mind.</h3>
    <p className="mt-3 text-sm leading-6 text-neutral-400">A starting point, a question, or a project that needs a second pair of eyes.</p>
    {!connected && account.customer?.verified && <p className="mt-4 rounded-xl bg-white/5 p-3 text-sm leading-6 text-neutral-400">{account.historyState === "error" ? "Requests are temporarily unavailable. You can reach us through WhatsApp or email." : "Connecting to your account before accepting a new request…"}</p>}
    <form id="request-form" className="mt-6" onSubmit={submit} aria-busy={account.requestBusy}>
      <fieldset className="space-y-5 disabled:opacity-50" disabled={disabled}>
        <div><label className="field-label" htmlFor="request-title">Project title</label><input id="request-title" name="title" className="field-input" required minLength={3} maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A few words about your idea"/></div>
        <div><label className="field-label" htmlFor="request-category">What do you need?</label><select id="request-category" name="category" className="field-input" required value={category} onChange={(event) => setCategory(event.target.value)}>{requestCategories.map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
        <div><label className="field-label" htmlFor="request-timeline">Timeline <span className="font-normal text-neutral-500">(optional)</span></label><input id="request-timeline" name="timeline" className="field-input" maxLength={100} value={timeline} onChange={(event) => setTimeline(event.target.value)} placeholder="Flexible, or an approximate date"/></div>
        <div><label className="field-label" htmlFor="request-details">Your idea</label><textarea id="request-details" name="details" className="field-input min-h-40 resize-y" required minLength={10} maxLength={6000} rows={6} value={details} onChange={(event) => setDetails(event.target.value)} placeholder={projectName ? `Tell us what you would like to build, inspired by ${projectName}.` : "What would you like to build, understand or improve?"} aria-describedby="request-data-note"/><p id="request-data-note" className="mt-2 text-xs leading-5 text-neutral-500">Please leave out passwords, payment details and sensitive personal information.</p></div>
        <button type="submit" className="button-primary w-full justify-center disabled:cursor-not-allowed">{account.requestBusy ? "Waiting for confirmation…" : "Submit your request"}<span aria-hidden="true">↗</span></button>
      </fieldset>
    </form>
    <p className="mt-4 text-xs leading-5 text-neutral-500">An enquiry starts a conversation. It does not create a paid order or confirm a delivery date.</p>
  </section>;
}

function CustomerPanel({ account, projectName }: { account: AccountController; projectName?: string }) {
  const customer = account.customer!;
  return <section id="customer-panel" aria-labelledby="customer-heading">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-7">
      <div><p className="section-kicker mb-3">Your customer space</p><h2 id="customer-heading" className="text-2xl font-medium tracking-tight sm:text-3xl">Welcome, <span id="customer-name" className="break-words">{customer.displayName || customer.email || "there"}</span>.</h2>{customer.displayName && <p className="mt-2 break-all text-sm text-neutral-500">{customer.email}</p>}</div>
      <button id="signout" type="button" className="button-secondary shrink-0 disabled:opacity-40" disabled={account.authBusy} onClick={() => void account.signOut()}>Sign out <span aria-hidden="true">↗</span></button>
    </div>
    {!customer.verified && <div id="verification-notice" className="mb-6 rounded-2xl border border-[#ff3b55]/25 bg-[#ff3b55]/[0.06] p-5 sm:p-6">
      <h3 className="text-lg font-medium">One step before we get started.</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">Verify your email before submitting a request. Send yourself a verification link, follow it, then return here to check.</p>
      <div className="mt-4 flex flex-wrap gap-3"><button id="send-verification" type="button" className="button-secondary text-sm disabled:opacity-40" disabled={account.verificationBusy || account.authBusy || account.verificationCoolingDown} onClick={() => void account.verifyEmail(false)}>{account.verificationCoolingDown ? "Verification email sent" : "Send verification email"}</button><button id="refresh-verification" type="button" className="button-secondary text-sm disabled:opacity-40" disabled={account.verificationBusy || account.authBusy} onClick={() => void account.verifyEmail(true)}>I’ve verified my email</button></div>
    </div>}
    <p id="request-status" role="status" aria-live="polite" className="mb-5 min-h-6 text-sm leading-6 text-neutral-300">{account.requestStatus}</p>
    <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_1fr]">
      <RequestForm key={`${customer.uid}:${projectName ?? ""}`} account={account} projectName={projectName}/>
      <section className="lg:pt-2" aria-labelledby="history-heading"><div className="mb-6 flex items-center justify-between"><h3 id="history-heading" className="text-xl font-medium tracking-tight">Your requests</h3>{account.historyState === "ready" && <span className="text-xs text-neutral-500">{account.requests.length} total</span>}</div>
        <div id="request-list" aria-live="polite" aria-busy={account.historyState === "loading"} className="space-y-4">
          {account.historyMessage && <p className="rounded-2xl border border-white/10 p-5 text-sm leading-6 text-neutral-400">{account.historyMessage}</p>}
          {account.historyState === "ready" && account.requests.length === 0 && <div className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center"><span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-500" aria-hidden="true">↗</span><h4 className="text-lg font-medium">A fresh page.</h4><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-neutral-400">You haven’t submitted any requests yet. Tell us about your first idea.</p></div>}
          {account.requests.map((request) => <RequestCard key={request.id} request={request}/>)}
        </div>
        <div className="mt-6"><ContactFallback/></div>
      </section>
    </div>
  </section>;
}

export default function AccountPortal() {
  const search = useSearchParams();
  const project = projects.find((item) => item.id === search.get("project"));
  const account = useCustomerAccount();
  if (account.customer && !account.unavailable) return <CustomerPanel account={account} projectName={project?.name}/>;
  return <div className="grid items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
    <div className="max-w-lg lg:pt-9"><p className="section-kicker mb-5">A direct line to 4tech</p><h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl">A place for your<br/><span className="text-neutral-500">next possibility.</span></h2><p className="mt-6 text-base leading-7 text-neutral-400">Share what you’re working on, keep your enquiries in one place, and follow updates as the conversation develops.</p>
      {project && <div className="mt-7 rounded-xl border-l-2 border-[#ff3b55] bg-white/[0.03] px-5 py-4"><p className="text-xs text-neutral-500">You’re enquiring about</p><p className="mt-1 text-sm text-neutral-200">{project.name}</p><p className="mt-2 text-xs leading-5 text-neutral-500">Your request title will be filled in after sign-in.</p></div>}
      <ol className="my-8 space-y-4 border-y border-white/10 py-7 text-sm text-neutral-300"><li className="flex gap-4"><span className="font-mono text-xs text-[#ff3b55]">01</span>Sign in, or create your account.</li><li className="flex gap-4"><span className="font-mono text-xs text-[#ff3b55]">02</span>Tell us about your project.</li><li className="flex gap-4"><span className="font-mono text-xs text-[#ff3b55]">03</span>Find your requests and updates here.</li></ol><ContactFallback/>
    </div>
    <AuthPanel account={account}/>
  </div>;
}
