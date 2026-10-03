'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, RefObject, useEffect, useRef, useState } from 'react';
import { askEngineeringAssistant, isEngineeringAiConfigured, type EngineeringMessage, type EngineeringReply } from '@/lib/engineering-assistant';
import { createPlannerBrief, draftFromEngineeringReply, plannerProjectTypes, savePlannerBrief } from '@/lib/planner-brief';
import { ProbeAvatar, type CompanionState } from './AiPetAssistant';
import styles from './AiPetHud.module.css';

type Entry = { id: number; question: string; reply?: EngineeringReply; error?: string };
const suggestions = [
  'Scope an ESP32 sensor system',
  'Plan a 6-DOF robotic arm',
  'Calculate LC: L=10 uH, C=100 nF',
  'Calculate FSPL: d=100 m, f=2.4 GHz',
  'Scope a quadcopter flight controller',
];

export default function AiPetHud({ initialPrompt, onClose, onStateChange, launcherRef }: {
  initialPrompt: string; onClose: () => void; onStateChange: (state: CompanionState) => void;
  launcherRef: RefObject<HTMLButtonElement | null>;
}) {
  const [draft, setDraft] = useState(initialPrompt);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [busy, setBusy] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const panel = useRef<HTMLElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const controller = useRef<AbortController | null>(null);
  const serial = useRef(0);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prior = document.activeElement as HTMLElement | null;
    input.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab' || !panel.current) return;
      const focusable = [...panel.current.querySelectorAll<HTMLElement>('button:not([disabled]),textarea:not([disabled]),a[href]')];
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      controller.current?.abort();
      (launcherRef.current || prior)?.focus?.();
    };
  }, [onClose, launcherRef]);

  useEffect(() => {
    const motionPaused = document.documentElement.dataset.motion === 'paused';
    bottom.current?.scrollIntoView({ block: 'nearest', behavior: motionPaused ? 'instant' : 'smooth' });
  }, [entries, busy]);

  async function send(event?: FormEvent, suggestion?: string) {
    event?.preventDefault();
    if (busy) return;
    const question = (suggestion || draft).trim();
    if (!question || question.length > 3000) return;
    const id = ++serial.current;
    const history: EngineeringMessage[] = entries.slice(-4).flatMap(entry => entry.reply
      ? [{ role: 'user' as const, content: entry.question }, { role: 'assistant' as const, content: entry.reply.overview }]
      : []);
    setDraft(''); setBusy(true); onStateChange('thinking');
    setEntries(current => [...current, { id, question }]);
    const abort = new AbortController(); controller.current = abort;
    try {
      const reply = await askEngineeringAssistant({ message: question, history, signal: abort.signal });
      if (abort.signal.aborted) return;
      setEntries(current => current.map(entry => entry.id === id ? { ...entry, reply } : entry));
      onStateChange('success');
    } catch (cause) {
      if (abort.signal.aborted) return;
      const message = cause instanceof Error ? cause.message : 'The engineering assistant is unavailable.';
      setEntries(current => current.map(entry => entry.id === id ? { ...entry, error: message } : entry));
      onStateChange('error');
    } finally {
      if (!abort.signal.aborted) setBusy(false);
      controller.current = null;
    }
  }

  function handleCopy(entry: Entry) {
    if (!entry.reply) return;
    const parts: string[] = [];
    parts.push(`## 4TECH Engineering Brief: ${entry.question}\n`);
    parts.push(`### System Overview\n${entry.reply.overview}\n`);
    if (entry.reply.steps.length) {
      parts.push(`### Engineering Architecture Steps\n` + entry.reply.steps.map((s, i) => `${i + 1}. ${s}`).join('\n') + '\n');
    }
    if (entry.reply.assumptions.length) {
      parts.push(`### Assumptions\n` + entry.reply.assumptions.map(a => `- ${a}`).join('\n') + '\n');
    }
    if (entry.reply.calculations.length) {
      parts.push(`### Calculations\n` + entry.reply.calculations.map(calc =>
        `- ${calc.expression}: ${calc.result} ${calc.units}\n  Working: ${calc.working}\n  Assumptions: ${calc.assumptions.join('; ')}`
      ).join('\n') + '\n');
    }
    if (entry.reply.bom.length) {
      parts.push(`### Provisional Bill of Materials\n` + entry.reply.bom.map(b => `- **${b.item}** (${b.quantity}): ${b.purpose} [Spec: ${b.selectionCriteria}]`).join('\n') + '\n');
    }
    if (entry.reply.questions.length) {
      parts.push(`### Technical Questions to Resolve\n` + entry.reply.questions.map(q => `- ${q}`).join('\n') + '\n');
    }
    if (entry.reply.sources.length) {
      parts.push(`### Official References to Check\n` + entry.reply.sources.map(source => `- ${source.title}: ${source.url}`).join('\n') + '\n');
    }
    parts.push(`### Review Before Building\n${entry.reply.disclaimer}\n`);
    parts.push(`---\n*Generated by 4TECH PROBE Companion Engine*`);

    navigator.clipboard.writeText(parts.join('\n')).then(() => {
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(current => current === entry.id ? null : current), 2200);
    }).catch(() => {});
  }

  return <section ref={panel} className={styles.hud} role="dialog" aria-modal="true" aria-labelledby="probe-title" aria-describedby="probe-description">
    <header className={styles.header}>
      <span className={styles.avatar}><ProbeAvatar compact /></span>
      <span className={styles.heading}><strong id="probe-title">PROBE / 4TECH</strong><small id="probe-description">Engineering planning and explicit-input calculations</small></span>
      <button type="button" className={styles.close} onClick={onClose} aria-label="Close engineering companion">×</button>
    </header>
    <div className={styles.transcript} aria-live="polite" aria-relevant="additions text">
      <div className={styles.intro}>
        <span className={styles.kicker}>[ ENGINEERING DESK / READY ]</span>
        <p>Describe your goal, hardware, constraints and success test. I can structure a technical plan and identify what needs checking.</p>
        <small>{isEngineeringAiConfigured() ? 'Connected AI requires a verified customer account. Verify all technical details before building.' : 'Local planning mode · no model or live source lookup. Calculations require your values and units.'}</small>
      </div>
      {!entries.length && <div className={styles.suggestions}>{suggestions.map(item => <button key={item} type="button" onClick={() => void send(undefined, item)}>{item}</button>)}</div>}
      {entries.map(entry => <article className={styles.exchange} key={entry.id}>
        <p className={styles.question}><span>YOU /</span> {entry.question}</p>
        {entry.reply && <div className={styles.answer}>
          <span className={styles.kicker}>[ PROBE / {entry.reply.source === 'ai' ? 'CONNECTED AI' : 'LOCAL WORKSHEET'} ]</span>
          <p>{entry.reply.overview}</p>
          <List title="Engineering steps" values={entry.reply.steps} ordered />
          <List title="Assumptions" values={entry.reply.assumptions} />
          {!!entry.reply.calculations.length && <div className={styles.group}><h3>Calculations</h3>{entry.reply.calculations.map((calc, index) => <div className={styles.calculation} key={index}><strong>{calc.expression}</strong><p>{calc.working}</p><p>Result: {calc.result} {calc.units}</p><List title="Calculation assumptions" values={calc.assumptions}/></div>)}</div>}
          {!!entry.reply.bom.length && <div className={styles.group}><h3>Provisional parts</h3><ul>{entry.reply.bom.map((part, index) => <li key={index}><strong>{part.item}</strong> · {part.quantity}. {part.purpose} Selection: {part.selectionCriteria}</li>)}</ul></div>}
          <List title="Questions to resolve" values={entry.reply.questions}/>
          {!!entry.reply.sources.length && <div className={styles.group}><h3>Official references to check</h3><ul>{entry.reply.sources.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul></div>}
          <button
            type="button"
            className={`${styles.copyBtn} ${copiedId === entry.id ? styles.copyBtnSuccess : ''}`}
            onClick={() => handleCopy(entry)}
            aria-label="Copy engineering brief to clipboard"
          >
            {copiedId === entry.id ? '[ COPIED TO CLIPBOARD ]' : '[ COPY BRIEF ]'}
          </button>

          <p className={styles.caveat}>{entry.reply.disclaimer}</p>
          <nav className={styles.links} aria-label="4TECH next steps">{entry.reply.links.filter(link => link.href !== '/account').map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
          <PlannerBriefForm question={entry.question} reply={entry.reply}/>
        </div>}
        {entry.error && <p className={styles.error} role="alert">{entry.error}</p>}
        {!entry.reply && !entry.error && <p className={styles.pending} role="status">Working through the engineering brief…</p>}
      </article>)}
      <div ref={bottom}/>
    </div>
    <form className={styles.composer} onSubmit={event => void send(event)}>
      <label htmlFor="probe-input">Your engineering question</label>
      <textarea id="probe-input" ref={input} value={draft} onChange={event => setDraft(event.target.value)} maxLength={3000} rows={2} placeholder="Tell me what you want to build…" onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void send(); } }} />
      <div className={styles.formFoot}><span>{draft.length}/3000 · Shift + Enter for a new line</span><button type="submit" disabled={busy || !draft.trim()}>{busy ? '[ THINKING ]' : '[ SEND ]'}</button></div>
    </form>
  </section>;
}

function List({ title, values, ordered = false }: { title: string; values: string[]; ordered?: boolean }) {
  if (!values.length) return null;
  return <div className={styles.group}><h3>{title}</h3>{ordered ? <ol>{values.map((item, index) => <li key={index}>{item}</li>)}</ol> : <ul>{values.map((item, index) => <li key={index}>{item}</li>)}</ul>}</div>;
}

function PlannerBriefForm({ question, reply }: { question: string; reply: EngineeringReply }) {
  const router = useRouter();
  const [fields, setFields] = useState(() => draftFromEngineeringReply(question, reply));
  const [error, setError] = useState('');
  function continueToEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    try {
      const brief = createPlannerBrief(fields);
      if (!savePlannerBrief(brief)) throw new Error('Your browser could not keep this brief for the next page. Copy your notes before continuing.');
      setError('');
      router.push('/account');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Please review this brief and try again.'); }
  }
  return <details className={styles.brief} open={reply.source === 'local'}>
    <summary>Turn this plan into a customer brief</summary>
    <form onSubmit={continueToEnquiry} className={styles.briefForm}>
      <p>Review the fields before continuing. Your draft stays in this browser tab for up to 24 hours. It is sent to 4TECH only after you submit the enquiry in your account.</p>
      <label>Project type<select value={fields.projectType} onChange={event => setFields(current => ({ ...current, projectType: event.target.value }))}>{plannerProjectTypes.map(type => <option key={type} value={type}>{type}</option>)}</select></label>
      <label>Project title<input required minLength={3} maxLength={120} value={fields.title} onChange={event => setFields(current => ({ ...current, title: event.target.value }))}/></label>
      <label>Goal<textarea required minLength={10} maxLength={3000} rows={3} value={fields.goal} onChange={event => setFields(current => ({ ...current, goal: event.target.value }))}/></label>
      <label>Equipment and constraints <span>(optional)</span><textarea maxLength={1300} rows={2} value={fields.constraints} onChange={event => setFields(current => ({ ...current, constraints: event.target.value }))} placeholder="Available parts, workspace, power limits, or requirements"/></label>
      <div className={styles.briefPair}>
        <label>Timeline <span>(optional)</span><input maxLength={100} value={fields.timeline} onChange={event => setFields(current => ({ ...current, timeline: event.target.value }))} placeholder="For example, 2–4 weeks"/></label>
        <label>Budget range <span>(optional)</span><input maxLength={100} value={fields.budgetRange} onChange={event => setFields(current => ({ ...current, budgetRange: event.target.value }))} placeholder="For example, ₹5,000–₹15,000"/></label>
      </div>
      <label>Open questions <span>(editable)</span><textarea maxLength={800} rows={3} value={fields.openQuestions} onChange={event => setFields(current => ({ ...current, openQuestions: event.target.value }))}/></label>
      <label>Planning notes <span>(unvalidated starting points)</span><textarea maxLength={400} rows={3} value={fields.planningNotes} onChange={event => setFields(current => ({ ...current, planningNotes: event.target.value }))}/></label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button type="submit">Review in customer enquiry →</button>
    </form>
  </details>;
}
