'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import DustParticles from './dust-particles';
import TextPressure from './text-pressure';
import MagneticButton from './magnetic-button';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const heroLineRef = useRef<HTMLParagraphElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let entrance: gsap.core.Timeline | null = null;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      entrance = tl;

      const letters = sectionRef.current?.querySelectorAll('[data-pressure-letter]');
      if (letters?.length) {
        tl.fromTo(
          letters,
          { fontVariationSettings: "'wght' 120, 'wdth' 38", opacity: 0.72, scaleY: 1.28 },
          { fontVariationSettings: "'wght' 150, 'wdth' 55", opacity: 1, scaleY: 1, duration: 1.4, stagger: 0.07, ease: 'expo.out' },
          0.06
        );
      }

      // 1. Center radial glow
      if (glowRef.current) {
        tl.fromTo(
          glowRef.current,
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 2, ease: 'expo.out' },
          0
        );
      }

      // 2. Overlapping center red tagline
      if (heroLineRef.current) {
        tl.fromTo(
          heroLineRef.current,
          { y: 30, scale: 0.9, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.8)' },
          0.7
        );
      }

      // 3. Top-left status badge
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, x: -15 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out' },
          0.8
        );
      }

      // 4. Bottom-left summary paragraph
      if (summaryRef.current) {
        tl.fromTo(
          summaryRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
          1.0
        );
      }

      // 5. Bottom-right CTAs
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.85, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.7)' },
          1.2
        );
      }

      // 6. Dust particles
      if (dustRef.current) {
        const dusts = dustRef.current.querySelectorAll('.dust');
        if (dusts.length) {
          tl.fromTo(
            dusts,
            { opacity: 0 },
            { opacity: 1, duration: 2, stagger: 0.06, ease: 'power2.out' },
            1.0
          );
        }
      }

      // 7. Scroll indicator
      if (scrollRef.current) {
        tl.fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: 'power2.out' },
          1.4
        );
      }
    }, sectionRef);

    const play = () => entrance?.play();
    window.addEventListener('4tech:intro-complete', play, { once: true });
    if (document.documentElement.dataset.techIntroComplete === 'true' || !document.querySelector('.tech-intro')) {
      play();
    }
    const fallback = window.setTimeout(play, 3200);

    return () => {
      window.clearTimeout(fallback);
      window.removeEventListener('4tech:intro-complete', play);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="jm-hero relative h-screen h-[100svh] min-h-[100svh] overflow-hidden select-none touch-pan-y bg-[#111111]"
    >
      {/* Background Radial Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[4]"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 45%, transparent 30%, #111111 100%)',
        }}
        aria-hidden="true"
      />

      {/* Center Radial Ember Glow */}
      <div
        ref={glowRef}
        className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] pointer-events-none z-[6]"
        style={{
          background:
            'radial-gradient(circle, rgba(160, 42, 34, 0.22) 0%, rgba(160, 42, 34, 0.06) 40%, transparent 70%)',
          filter: 'blur(35px)',
        }}
        aria-hidden="true"
      />

      {/* Atmospheric Fiery Drift Smoke */}
      <div className="jm-hero-smoke pointer-events-none z-[7]" aria-hidden="true" />

      {/* Floating Ambient Dust Particles */}
      <div ref={dustRef} className="absolute inset-0 pointer-events-none z-[8]">
        <DustParticles />
      </div>

      {/* Top Left Status Pill */}
      <div
        ref={badgeRef}
        className="jm-hero-status absolute top-20 sm:top-24 md:top-28 left-4 sm:left-8 md:left-14 lg:left-20 z-[40] flex items-center gap-2.5"
      >
        <span className="w-2 h-2 shrink-0 rounded-full bg-[#E52320] animate-pulse shadow-[0_0_10px_#E52320]" />
        <span className="text-[10px] sm:text-[11px] text-[#A0A0A5] tracking-[0.25em] uppercase font-semibold font-mono">
          SHIPPING IDEAS INTO REALITY.
        </span>
      </div>

      {/* Center 4TECH Title with Overlapping Crossline Tagline */}
      <div
        className="jm-hero-title absolute top-[38%] sm:top-[40%] md:top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[15] pointer-events-none select-none w-full flex flex-col items-center justify-center px-4"
      >
        <div className="w-full max-w-[1080px] relative flex items-center justify-center transform-gpu drop-shadow-[0_0_50px_rgba(160,42,34,0.35)]">
          <TextPressure text="4TECH" />

          {/* Red Crossline Tagline Overlapping Center of 4TECH */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <p
              ref={heroLineRef}
              className="hero-line text-[clamp(0.58rem,1.3vw,0.88rem)] font-extrabold tracking-[0.24em] sm:tracking-[0.32em] uppercase text-[#E52320] drop-shadow-[0_0_16px_rgba(229,35,32,0.85)] px-3 py-1 text-center whitespace-nowrap"
              style={{ fontFamily: "var(--font-body), 'Inter', sans-serif" }}
            >
              CRAFTING HARDWARE THAT SHAPES TOMORROW.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Left Summary Paragraph */}
      <div
        ref={summaryRef}
        className="jm-hero-summary absolute bottom-[18%] sm:bottom-[12%] md:bottom-[10%] left-4 sm:left-8 md:left-14 lg:left-20 z-[40] max-w-[340px] sm:max-w-[380px] md:max-w-[420px]"
      >
        <p className="text-[12px] sm:text-[13px] md:text-sm font-medium text-white/90 leading-tight tracking-wide mb-1.5">
          Independent Engineering Practice &amp; Creative Studio
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
            className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm tracking-wide bg-[#A02A22] text-white hover:bg-[#B8342B] active:scale-95 border border-transparent shadow-[0_0_30px_rgba(160,42,34,0.55)] group transition-all duration-300"
          >
            <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-[11px] shrink-0 font-bold">↗</span>
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
