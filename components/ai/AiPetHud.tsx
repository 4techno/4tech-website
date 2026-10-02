'use client';

import { FormEvent, RefObject, useEffect, useRef, useState } from 'react';
import { askEngineeringAssistant, isEngineeringAiConfigured, type EngineeringMessage, type EngineeringReply } from '@/lib/engineering-assistant';
import { ProbeAvatar, type CompanionState } from './AiPetAssistant';
import styles from './AiPetHud.module.css';

type Entry = { id: number; question: string; reply?: EngineeringReply; error?: string };
const suggestions = ['Scope an ESP32 sensor system', 'Plan a robotic arm', 'Review an RF measurement idea'];

export default function AiPetHud({ initialPrompt, onClose, onStateChange, launcherRef }: {
  initialPrompt: string; onClose: () => void; onStateChange: (state: CompanionState) => void;
  launcherRef: RefObject<HTMLButtonElement | null>;
}) {
  const [draft, setDraft] = useState(initialPrompt);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [busy, setBusy] = useState(false);
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

  useEffect(() => { bottom.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [entries, busy]);

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

  return <section ref={panel} className={styles.hud} role="dialog" aria-modal="true" aria-labelledby="probe-title" aria-describedby="probe-description">
    <header className={styles.header}>
      <span className={styles.avatar}><ProbeAvatar compact /></span>
      <span className={styles.heading}><strong id="probe-title">PROBE / 4TECH</strong><small id="probe-description">Engineering planning companion</small></span>
      <button type="button" className={styles.close} onClick={onClose} aria-label="Close engineering companion">×</button>
    </header>
    <div className={styles.transcript} aria-live="polite" aria-relevant="additions text">
      <div className={styles.intro}>
        <span className={styles.kicker}>[ ENGINEERING DESK / READY ]</span>
        <p>Describe your goal, hardware, constraints and success test. I can structure a technical plan and identify what needs checking.</p>
        <small>{isEngineeringAiConfigured() ? 'Connected AI requires a verified customer account.' : 'Local planning mode · no model or live source lookup'}</small>
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
          <p className={styles.caveat}>{entry.reply.disclaimer}</p>
          <nav className={styles.links} aria-label="4TECH next steps">{entry.reply.links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
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
