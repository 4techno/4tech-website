'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import AsciiWaves from '@/components/reactbits/ascii-waves';
import ReactiveBackground from '@/components/reactbits/reactive-background';
import TextPressure from './text-pressure';
import MagneticButton from './magnetic-button';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let entrance: gsap.core.Timeline | null = null;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.08 });
      entrance = tl;

      const letters = sectionRef.current?.querySelectorAll('[data-pressure-letter]');
      if (letters?.length) {
        tl.fromTo(letters,
          { fontVariationSettings: "'wght' 120, 'wdth' 38", opacity: 0.72, scaleY: 1.28 },
          { fontVariationSettings: "'wght' 150, 'wdth' 55", opacity: 1, scaleY: 1, duration: 1.4, stagger: 0.07, ease: 'expo.out' },
          0.06);
      }

      // 1. Top-left status badge
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, x: -15 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out' },
          0.5
        );
      }

      // 2. Bottom-left summary paragraph
      if (summaryRef.current) {
        tl.fromTo(
          summaryRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
          0.7
        );
      }

      // 3. Bottom-right CTAs
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.85, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.7)' },
          0.9
        );
      }

      // 4. Scroll indicator
      if (scrollRef.current) {
        tl.fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: 'power2.out' },
          1.1
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="jm-hero relative h-screen h-[100svh] min-h-[100svh] overflow-hidden select-none touch-pan-y bg-[#060608]"
    >
      {/* React Bits Pro Ascii Waves in Professional Red */}
      <AsciiWaves
        className="z-[4] opacity-80"
        color="#E52320"
        waveTension={0.45}
        waveTwist={0.16}
        speed={0.75}
        elementSize={14}
        intensity={1.1}
        hasCursorInteraction={true}
        interactionIntensity={1.25}
      />

      {/* React Bits Interactive Reactive Background */}
      <ReactiveBackground className="z-[5]" />

      <div className="jm-hero-smoke pointer-events-none z-[6]" aria-hidden="true" />

      {/* Top Left Status Pill */}
      <div
        ref={badgeRef}
        className="jm-hero-status absolute top-20 sm:top-24 md:top-28 left-4 sm:left-8 md:left-14 lg:left-20 z-[40] flex items-center gap-2.5"
      >
        <span className="w-2 h-2 shrink-0 rounded-full bg-[#A02A22] animate-pulse shadow-[0_0_10px_#A02A22]" />
        <span className="text-[10px] sm:text-[11px] text-[#A0A0A5] tracking-[0.25em] uppercase font-semibold font-mono">
          SHIPPING IDEAS INTO REALITY.
        </span>
      </div>

      {/* Center 4TECH Title */}
      <div
        className="jm-hero-title absolute top-[38%] sm:top-[40%] md:top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[15] pointer-events-none select-none w-full flex flex-col items-center justify-center px-4"
      >
        <div className="w-full max-w-[900px] relative flex items-center justify-center transform-gpu drop-shadow-[0_0_50px_rgba(160,42,34,0.35)]">
          <TextPressure text="4TECH" />
        </div>
      </div>

      {/* Bottom Left Summary Paragraph */}
      <div
        ref={summaryRef}
        className="jm-hero-summary absolute bottom-[18%] sm:bottom-[12%] md:bottom-[10%] left-4 sm:left-8 md:left-14 lg:left-20 z-[40] max-w-[320px] sm:max-w-[360px] md:max-w-[420px]"
      >
        <p className="text-[12px] sm:text-[13px] md:text-sm font-medium text-white/90 leading-tight tracking-wide mb-1.5">
          Independent Engineering Practice & Creative Studio
        </p>
        <p
          className="text-[11px] sm:text-xs md:text-[13px] text-[#A0A0A5] leading-[1.65] font-normal tracking-wide"
          style={{ fontFamily: "var(--font-body), 'Inter', sans-serif" }}
        >
          engineering fast, reliable, and motion-driven hardware systems.
        </p>
      </div>

      {/* Bottom Right Magnetic CTAs */}
      <div
        ref={ctaRef}
        className="jm-hero-actions absolute bottom-6 sm:bottom-[10%] md:bottom-[10%] right-4 sm:right-8 md:right-14 lg:right-20 z-[40] flex flex-col items-end gap-2.5 sm:gap-3.5"
      >
        <MagneticButton>
          <a
            href="#projects"
            className="inline-flex items-center gap-3 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm tracking-wide bg-[#A02A22] text-white hover:bg-[#B8342B] active:scale-95 border border-transparent shadow-[0_0_30px_rgba(160,42,34,0.55)] group transition-all duration-300"
          >
            <span>Explore Work →</span>
          </a>
        </MagneticButton>

        <MagneticButton>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full font-medium text-xs sm:text-sm tracking-wide bg-[#111116]/80 backdrop-blur-md text-white/85 border border-white/15 hover:border-white/35 hover:text-white active:scale-95 transition-all duration-300"
          >
            <span>Let&apos;s Talk →</span>
          </Link>
        </MagneticButton>
      </div>

      {/* Bottom Center Scroll Indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-[45] flex flex-col items-center gap-1.5 pointer-events-none"
      >
        <span className="text-[9px] sm:text-[10px] text-[#A0A0A5]/80 tracking-[0.4em] uppercase font-mono font-medium">
          SCROLL
        </span>
        <div className="w-[1px] h-5 sm:h-6 bg-gradient-to-b from-white/25 to-transparent relative overflow-hidden">
          <div
            className="absolute w-full h-3 bg-[#A02A22]"
            style={{ animation: 'reveal-up 2s ease-in-out infinite' }}
          />
        </div>
      </div>

      {/* Bottom Fade Gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-[50]"
        style={{ background: 'linear-gradient(to top, #111111 0%, transparent 100%)' }}
      />
    </section>
  );
}
