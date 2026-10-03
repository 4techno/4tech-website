'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          const exitTl = gsap.timeline({
            onComplete: () => {
              onComplete?.();
            },
          });

          exitTl
            .to(hudRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' })
            .to(counterRef.current, { opacity: 0, y: -25, duration: 0.35, ease: 'power2.in' }, '<0.05')
            .to(subtitleRef.current, { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in' }, '<0.05')
            .to(barRef.current?.parentElement ?? null, { opacity: 0, duration: 0.25 }, '<0.05')
            .to(containerRef.current, { yPercent: -100, duration: 0.95, ease: 'expo.inOut' });
        },
      });

      const progressObj = { value: 0 };

      tl.to(progressObj, {
        value: 100,
        duration: 2.0,
        ease: 'power2.inOut',
        onUpdate: () => {
          const val = Math.round(progressObj.value);
          if (counterRef.current) counterRef.current.textContent = String(val);
          if (barRef.current) barRef.current.style.transform = `scaleX(${val / 100})`;
        },
      });

      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' },
        0.3
      );

      tl.fromTo(
        hudRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.4
      );
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="loading-screen fixed inset-0 z-[10000] bg-[#07070A] flex flex-col justify-center items-center gap-6 select-none"
    >
      {/* Background grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Top HUD Telemetry */}
      <div
        ref={hudRef}
        className="absolute top-8 left-8 right-8 flex items-center justify-between text-[10px] font-mono text-ash/60 tracking-widest uppercase pointer-events-none"
      >
        <span>4TECH // INITIALIZING SYSTEM</span>
        <span>ENGINEERING / 4TECH</span>
      </div>

      {/* Main Counter Display */}
      <div className="relative flex flex-col items-center">
        <span
          ref={counterRef}
          className="loading-counter text-white font-extrabold leading-none tracking-tight font-mono drop-shadow-[0_0_35px_rgba(252,107,47,0.3)]"
          style={{ fontSize: 'clamp(64px, 10vw, 140px)', fontFamily: 'var(--font-display)' }}
        >
          0
        </span>
      </div>

      <div
        ref={subtitleRef}
        className="text-[11px] sm:text-xs uppercase font-mono tracking-[0.35em] text-ember font-semibold drop-shadow-[0_0_12px_rgba(252,107,47,0.5)]"
      >
        4TECH · Technology That Shapes Tomorrow
      </div>

      {/* Progress Track */}
      <div className="loading-bar-track bg-white/10 rounded-full overflow-hidden w-[min(320px,65vw)] h-[2px] relative shadow-[0_0_15px_rgba(252,107,47,0.2)]">
        <div
          ref={barRef}
          className="loading-bar-fill bg-gradient-to-r from-ember to-ember-bright h-full origin-left"
          style={{ transform: 'scaleX(0)', transformOrigin: '0% 50%' }}
        />
      </div>

      {/* Bottom HUD Telemetry */}
      <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-[9px] font-mono text-ash/40 tracking-wider uppercase pointer-events-none">
        <span>RF DETECTORS · 6-DOF KINEMATICS · FIRMWARE</span>
        <span>RESEARCH · DESIGN · TEST</span>
      </div>
    </div>
  );
}
