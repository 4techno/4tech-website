'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionPreferences } from '@/components/motion-preferences';
import { OPEN_COPILOT_EVENT } from './ai-copilot-events';
import styles from './AiPetAssistant.module.css';

export type CompanionState = 'idle' | 'thinking' | 'success' | 'sleep' | 'error';
const EngineeringHud = dynamic(() => import('./AiPetHud'), { ssr: false });

/** Original vector companion illustration, animated independently of React rendering. */
export function ProbeAvatar({ compact = false }: { compact?: boolean }) {
  return (
    <svg className={`${styles.probe} ${compact ? styles.compactProbe : ''}`} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <g className={styles.probeBody}>
        <path d="M50 8v11M44 8h12" stroke="currentColor" strokeWidth="1.5" />
        <circle className={styles.sensor} cx="50" cy="7" r="2.5" />
        <path d="m20 43-7 7v17l8 5M80 43l7 7v17l-8 5" fill="#161616" stroke="#888" strokeWidth="1.3" />
        <path d="M24 28 39 21h22l15 7 6 37-12 17H30L18 65z" fill="#111" stroke="#b7b7b7" strokeWidth="1.4" />
        <path d="m26 31 12-5h24l12 5M30 76h40" stroke="#484848" />
        <rect x="25" y="37" width="50" height="29" rx="11" fill="#030303" stroke="#393939" />
        <g className={styles.eyes}>
          <rect className={styles.sensor} x="34" y="47" width="9" height="7" rx="3.5" />
          <rect className={styles.sensor} x="57" y="47" width="9" height="7" rx="3.5" />
        </g>
        <path d="M45 60h10" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
        <path d="m33 83-3 5m37-5 3 5M42 84v5m16-5v5" stroke="#666" strokeWidth="1.6" />
        <path className={styles.thruster} d="M37 90h26M42 94h16" stroke="#888" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function AiPetAssistant() {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState('');
  const [state, setState] = useState<CompanionState>('idle');
  const [pageVisible, setPageVisible] = useState(true);
  const { reduced, paused } = useMotionPreferences();
  const motionPaused = !pageVisible || reduced || paused;
  const launcher = useRef<HTMLButtonElement>(null);
  const springNode = useRef<HTMLSpanElement>(null);
  const sleepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wake = useCallback(() => {
    if (sleepTimer.current) clearTimeout(sleepTimer.current);
    setState(current => current === 'sleep' ? 'idle' : current);
    sleepTimer.current = setTimeout(() => setState(current => current === 'idle' ? 'sleep' : current), 45_000);
  }, []);
  const changeState = useCallback((next: CompanionState) => {
    if (successTimer.current) clearTimeout(successTimer.current);
    setState(next);
    if (next === 'success') successTimer.current = setTimeout(() => { setState('idle'); wake(); }, 2800);
  }, [wake]);
  const close = useCallback(() => {
    setOpen(false); setPrefill(''); changeState('idle'); wake();
  }, [changeState, wake]);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const value = (event as CustomEvent<{ prompt?: unknown }>).detail?.prompt;
      setPrefill(typeof value === 'string' ? value.slice(0, 6000) : '');
      setOpen(true); wake();
    };
    const visibility = () => setPageVisible(!document.hidden);
    visibility(); wake();
    window.addEventListener(OPEN_COPILOT_EVENT, onOpen);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.removeEventListener(OPEN_COPILOT_EVENT, onOpen);
      document.removeEventListener('visibilitychange', visibility);
      if (sleepTimer.current) clearTimeout(sleepTimer.current);
      if (successTimer.current) clearTimeout(successTimer.current);
    };
  }, [wake]);

  useEffect(() => {
    const node = springNode.current;
    if (!node || open || motionPaused || state === 'sleep') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)');
    let frame = 0, x = 0, y = 0, vx = 0, vy = 0, targetX = 0, targetY = 0, lastTime = 0;
    let lastScroll = window.scrollY;
    const paint = (time: number) => {
      if (media.matches || document.hidden) { frame = 0; node.style.transform = ''; return; }
      const dt = Math.min((time - (lastTime || time - 16.7)) / 16.7, 2);
      lastTime = time;
      vx = (vx + (targetX - x) * 0.09 * dt) * Math.pow(0.77, dt);
      vy = (vy + (targetY - y) * 0.09 * dt) * Math.pow(0.77, dt);
      x += vx * dt; y += vy * dt;
      node.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${(x * 0.35).toFixed(2)}deg)`;
      if (Math.abs(vx) + Math.abs(vy) + Math.abs(targetX - x) + Math.abs(targetY - y) > 0.025) frame = requestAnimationFrame(paint);
      else { frame = 0; lastTime = 0; }
    };
    const animate = () => { if (!frame && !media.matches) frame = requestAnimationFrame(paint); };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || media.matches) return;
      const rect = node.getBoundingClientRect();
      targetX = Math.max(-4, Math.min(4, (event.clientX - rect.left - rect.width / 2) / 90));
      targetY = Math.max(-4, Math.min(4, (event.clientY - rect.top - rect.height / 2) / 100));
      animate();
    };
    const scroll = () => {
      const delta = window.scrollY - lastScroll; lastScroll = window.scrollY;
      targetY = 0; vy = Math.max(-1.5, Math.min(1.5, delta / 70)); animate();
    };
    const reset = () => { targetX = 0; targetY = 0; animate(); };
    const preference = () => { cancelAnimationFrame(frame); frame = 0; node.style.transform = ''; };
    window.addEventListener('pointermove', pointer, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('pointerleave', reset);
    media.addEventListener('change', preference);
    return () => {
      cancelAnimationFrame(frame); node.style.transform = '';
      window.removeEventListener('pointermove', pointer);
      window.removeEventListener('scroll', scroll);
      document.removeEventListener('pointerleave', reset);
      media.removeEventListener('change', preference);
    };
  }, [open, motionPaused, state]);

  return (
    <div className={styles.root} data-state={state} data-paused={motionPaused || undefined}>
      <button ref={launcher} type="button" className={styles.launcher} hidden={open} onPointerEnter={wake} onFocus={wake}
        onClick={() => { wake(); setOpen(true); }} aria-label="Open 4TECH engineering companion" aria-haspopup="dialog" aria-expanded={open}>
        <span className={styles.launcherLabel}><strong>4TECH / PROBE</strong><span>{state === 'sleep' ? 'Tap to wake' : 'Engineering companion'}</span></span>
        <span ref={springNode} className={styles.probeMount}><ProbeAvatar /></span>
      </button>
      {open && <EngineeringHud initialPrompt={prefill} onClose={close} onStateChange={changeState} launcherRef={launcher} />}
    </div>
  );
}
