'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const storageKey = '4tech:intro-seen:v4';

interface LoadingScreenProps {
  onComplete?: () => void;
}

/**
 * 1 to 100 Intro Animation matching https://jishnumondal.vercel.app/
 * Features a minimalist 1 to 100 counter, filling progress track,
 * and an upward curtain wipe transition.
 */
export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(storageKey) === '1';
    } catch {
      // storage unavailable
    }

    const finish = () => {
      try {
        window.sessionStorage.setItem(storageKey, '1');
      } catch {}
      document.documentElement.dataset.techIntroComplete = 'true';
      setVisible(false);
      window.dispatchEvent(new Event('4tech:intro-complete'));
      onComplete?.();
    };

    if (reduced || alreadySeen) {
      finish();
      return;
    }

    const ctx = gsap.context(() => {
      const progressObj = { value: 1 };

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.timeline({ onComplete: finish })
            .to(counterRef.current, { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in' })
            .to(barRef.current?.parentElement ?? null, { opacity: 0, duration: 0.25 }, '<0.05')
            .to(containerRef.current, { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, '-=0.1');
        },
      });
      timelineRef.current = tl;

      // Animate counter from 1 to 100 with smooth easing
      tl.to(progressObj, {
        value: 100,
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          const val = Math.round(progressObj.value);
          if (counterRef.current) counterRef.current.textContent = String(val);
          if (barRef.current) barRef.current.style.transform = `scaleX(${val / 100})`;
        },
      });
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      timelineRef.current?.kill();
      ctx.revert();
    };
  }, [onComplete]);

  if (!visible) return null;

  const skip = () => {
    timelineRef.current?.kill();
    try {
      window.sessionStorage.setItem(storageKey, '1');
    } catch {}
    document.documentElement.dataset.techIntroComplete = 'true';
    setVisible(false);
    window.dispatchEvent(new Event('4tech:intro-complete'));
    onComplete?.();
  };

  return (
    <div
      ref={containerRef}
      className="loading-screen fixed inset-0 z-[10000] bg-[#050505] flex flex-col justify-center items-center select-none"
    >
      {/* Background radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(160, 42, 34, 0.12) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      {/* Top right skip button */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20">
        <button
          type="button"
          onClick={skip}
          className="text-[11px] font-mono tracking-widest uppercase text-ash/60 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-white/25 cursor-pointer"
        >
          Skip [ESC]
        </button>
      </div>

      {/* Center 1 to 100 Animated Counter */}
      <span
        ref={counterRef}
        className="loading-counter text-[#F5F5F7] font-extrabold leading-none tracking-tight select-none drop-shadow-[0_0_40px_rgba(197,34,31,0.35)]"
        style={{
          fontSize: 'clamp(84px, 14vw, 160px)',
          fontFamily: "var(--font-display), 'Geist Variable', sans-serif",
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        1
      </span>

      {/* Loading Progress Track & Fill */}
      <div className="loading-bar-track bg-white/10 rounded-full overflow-hidden w-[min(280px,60vw)] h-[2px] mt-6 relative shadow-[0_0_15px_rgba(197,34,31,0.3)]">
        <div
          ref={barRef}
          className="loading-bar-fill bg-gradient-to-r from-[#8B1E18] via-[#C5221F] to-[#E53935] h-full origin-left"
          style={{ transform: 'scaleX(0.01)', transformOrigin: '0% 50%' }}
        />
      </div>
    </div>
  );
}
