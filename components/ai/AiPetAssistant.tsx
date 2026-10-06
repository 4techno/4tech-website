'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionPreferences } from '@/components/motion-preferences';
import { OPEN_COPILOT_EVENT } from './ai-copilot-events';
import WalleAvatar from './WalleAvatar';
import styles from './AiPetAssistant.module.css';

export type CompanionState = 'idle' | 'thinking' | 'success' | 'sleep' | 'error';
const EngineeringHud = dynamic(() => import('./AiPetHud'), { ssr: false });

/** High-fidelity WALL-E companion avatar for 4TECH Engineering */
export function ProbeAvatar({ compact = false }: { compact?: boolean }) {
  return <WalleAvatar compact={compact} />;
}

export default function AiPetAssistant() {
  const [open, setOpen] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [prefill, setPrefill] = useState('');
  const [state, setState] = useState<CompanionState>('idle');
  const [pageVisible, setPageVisible] = useState(true);
  const [gaze, setGaze] = useState({ pupilX: 0, pupilY: 0, headTilt: 0, headPitch: 0 });
  const { reduced, paused } = useMotionPreferences();
  const motionPaused = !pageVisible || reduced || paused;
  const launcher = useRef<HTMLButtonElement>(null);
  const springNode = useRef<HTMLSpanElement>(null);
  const sleepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('4tech:codex-pet-hidden') === 'true') {
        setIsRemoved(true);
      }
    } catch {}
  }, []);

  const removePet = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsRemoved(true);
    setOpen(false);
    try {
      localStorage.setItem('4tech:codex-pet-hidden', 'true');
    } catch {}
  }, []);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const detail = (e as CustomEvent<{ visible?: boolean }>).detail;
      setIsRemoved(prev => {
        const next = detail?.visible !== undefined ? !detail.visible : !prev;
        try {
          if (next) localStorage.setItem('4tech:codex-pet-hidden', 'true');
          else localStorage.removeItem('4tech:codex-pet-hidden');
        } catch {}
        return next;
      });
    };
    window.addEventListener('4tech:codex-pet-toggle', handleToggle);
    return () => window.removeEventListener('4tech:codex-pet-toggle', handleToggle);
  }, []);

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
      setIsRemoved(false);
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
      if (document.hidden) return;
      const rect = launcher.current?.getBoundingClientRect() || node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const dist = Math.hypot(dx, dy);
      const pupilDist = Math.min(4.2, Math.max(0.4, dist / 45));
      const px = Number((Math.cos(angle) * pupilDist).toFixed(2));
      const py = Number((Math.sin(angle) * pupilDist).toFixed(2));
      const winW = window.innerWidth || 1200;
      const winH = window.innerHeight || 800;
      const tilt = Number(Math.max(-10, Math.min(10, (dx / winW) * 20)).toFixed(2));
      const pitch = Number(Math.max(-5, Math.min(5, (dy / winH) * 10)).toFixed(2));
      setGaze({ pupilX: px, pupilY: py, headTilt: tilt, headPitch: pitch });

      if (event.pointerType !== 'mouse' || media.matches) return;
      targetX = Math.max(-4, Math.min(4, dx / 90));
      targetY = Math.max(-4, Math.min(4, dy / 100));
      animate();
    };
    const touch = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const t = event.touches[0];
        const rect = launcher.current?.getBoundingClientRect() || node.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = t.clientX - centerX;
        const dy = t.clientY - centerY;
        const angle = Math.atan2(dy, dx);
        const dist = Math.hypot(dx, dy);
        const pupilDist = Math.min(4.2, Math.max(0.4, dist / 45));
        const px = Number((Math.cos(angle) * pupilDist).toFixed(2));
        const py = Number((Math.sin(angle) * pupilDist).toFixed(2));
        const winW = window.innerWidth || 1200;
        const winH = window.innerHeight || 800;
        const tilt = Number(Math.max(-10, Math.min(10, (dx / winW) * 20)).toFixed(2));
        const pitch = Number(Math.max(-5, Math.min(5, (dy / winH) * 10)).toFixed(2));
        setGaze({ pupilX: px, pupilY: py, headTilt: tilt, headPitch: pitch });
      }
    };
    const scroll = () => {
      const delta = window.scrollY - lastScroll; lastScroll = window.scrollY;
      targetY = 0; vy = Math.max(-1.5, Math.min(1.5, delta / 70)); animate();
    };
    const reset = () => {
      targetX = 0; targetY = 0; animate();
      setGaze({ pupilX: 0, pupilY: 0, headTilt: 0, headPitch: 0 });
    };
    const preference = () => { cancelAnimationFrame(frame); frame = 0; node.style.transform = ''; };
    window.addEventListener('pointermove', pointer, { passive: true });
    window.addEventListener('touchmove', touch, { passive: true });
    window.addEventListener('touchstart', touch, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('pointerleave', reset);
    media.addEventListener('change', preference);
    return () => {
      cancelAnimationFrame(frame); node.style.transform = '';
      window.removeEventListener('pointermove', pointer);
      window.removeEventListener('touchmove', touch);
      window.removeEventListener('touchstart', touch);
      window.removeEventListener('scroll', scroll);
      document.removeEventListener('pointerleave', reset);
      media.removeEventListener('change', preference);
    };
  }, [open, motionPaused, state]);

  if (isRemoved && !open) return null;

  return (
    <div className={styles.root} data-state={state} data-paused={motionPaused || undefined}>
      <div className={styles.launcherWrap} hidden={open}>
        <button
          ref={launcher}
          type="button"
          className={styles.launcher}
          onPointerEnter={wake}
          onFocus={wake}
          onClick={() => { wake(); setOpen(true); }}
          aria-label="Open WALL·E engineering companion"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span className={styles.launcherLabel}>
            <strong>WALL·E PET</strong>
            <span>{state === 'sleep' ? 'Tap to wake' : 'Engineering companion'}</span>
          </span>
          <span ref={springNode} className={styles.probeMount}>
            <WalleAvatar
              pupilX={gaze.pupilX}
              pupilY={gaze.pupilY}
              headTilt={gaze.headTilt}
              headPitch={gaze.headPitch}
              state={state}
            />
          </span>
        </button>
        <button
          type="button"
          className={styles.removePetBtn}
          onClick={removePet}
          title="Remove Codex Pet"
          aria-label="Remove Codex Pet from screen"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span className={styles.removeTooltip}>Remove pet</span>
        </button>
      </div>
      {open && (
        <EngineeringHud
          initialPrompt={prefill}
          onClose={close}
          onRemovePet={removePet}
          onStateChange={changeState}
          launcherRef={launcher}
        />
      )}
    </div>
  );
}
