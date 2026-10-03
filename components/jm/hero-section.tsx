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
  const heroLineRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // 1. Center radial glow
      if (glowRef.current) {
        tl.fromTo(
          glowRef.current,
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 2, ease: 'expo.out' },
          0
        );
      }

      // 2. Hero tagline
      if (heroLineRef.current) {
        tl.fromTo(
          heroLineRef.current,
          { y: 40, scale: 0.85, opacity: 0 },
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
          1.1
        );
      }

      // 5. Bottom-right CTAs
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.85, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.7)' },
          1.3
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
          1.5
        );
      }
    }, sectionRef);

    return () => ctx.revert();
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
            'radial-gradient(circle, rgba(252, 107, 47, 0.22) 0%, rgba(252, 107, 47, 0.06) 40%, transparent 70%)',
          filter: 'blur(35px)',
        }}
        aria-hidden="true"
      />

      {/* Floating Ambient Dust Particles */}
      <div ref={dustRef} className="absolute inset-0 pointer-events-none z-[8]">
        <DustParticles />
      </div>

      {/* Top Left Status Pill */}
      <div
        ref={badgeRef}
        className="jm-hero-status absolute top-20 sm:top-24 md:top-28 left-4 sm:left-8 md:left-14 lg:left-20 z-[40] flex items-center gap-2.5"
      >
        <span className="w-2 h-2 shrink-0 rounded-full bg-ember animate-pulse shadow-[0_0_8px_#FC6B2F]" />
        <span className="text-[10px] sm:text-[11px] text-[#B5B5B5] tracking-[0.2em] uppercase font-semibold font-mono">
          Engineering ideas into reality
        </span>
      </div>

      {/* Center Text Pressure Title */}
      <div
        className="jm-hero-title absolute top-[32%] sm:top-[34%] md:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[15] pointer-events-none select-none w-full flex flex-col items-center justify-center px-4"
      >
        <div className="w-full max-w-[850px] relative flex items-center justify-center transform-gpu drop-shadow-[0_0_40px_rgba(252,107,47,0.35)]">
          <TextPressure text="4TECH" />
        </div>

        {/* Hero Tagline */}
        <div className="mt-4 sm:mt-6 text-center z-[20] px-4">
          <p
            ref={heroLineRef}
            className="hero-line text-[clamp(0.68rem,1.4vw,0.95rem)] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-ember drop-shadow-[0_0_20px_rgba(252,107,47,0.7)]"
            style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
          >
            Embedded systems. Robotics. RF technology.
          </p>
        </div>
      </div>

      {/* Bottom Left Summary Paragraph */}
      <div
        ref={summaryRef}
        className="jm-hero-summary absolute bottom-[22%] sm:bottom-[16%] md:top-[74%] md:bottom-auto left-4 sm:left-8 md:left-14 lg:left-20 z-[40] max-w-[320px] md:max-w-[400px]"
      >
        <p
          className="text-xs sm:text-sm text-[#B5B5B5] leading-[1.7] font-normal tracking-wide"
          style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
        >
          Independent engineering practice connecting embedded control, robotics, RF instrumentation and research prototypes.
        </p>
      </div>

      {/* Bottom Right Magnetic CTAs */}
      <div
        ref={ctaRef}
        className="jm-hero-actions absolute bottom-6 sm:bottom-[10%] md:bottom-[12%] left-4 right-4 sm:left-auto sm:right-8 md:right-14 lg:right-20 z-[40] flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end gap-3 sm:gap-3.5"
      >
        <MagneticButton>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 rounded-full font-medium text-xs sm:text-sm tracking-wide bg-ember text-white hover:bg-ember-bright border border-transparent shadow-[0_0_25px_rgba(160,42,34,0.4)] group transition-all duration-300"
          >
            <span>Explore Work →</span>
          </Link>
        </MagneticButton>

        <MagneticButton>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 rounded-full font-medium text-xs sm:text-sm tracking-wide bg-transparent text-white border border-white/20 hover:border-ember/50 hover:text-ember transition-all duration-300"
          >
            <span>Start a conversation →</span>
          </Link>
        </MagneticButton>
      </div>

      {/* Bottom Center Scroll Indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[45] hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[9px] text-[#B5B5B5]/70 tracking-[0.35em] uppercase font-mono">
          Scroll
        </span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-white/25 to-transparent relative overflow-hidden">
          <div
            className="absolute w-full h-3 bg-ember"
            style={{ animation: 'reveal-up 2s ease-in-out infinite' }}
          />
        </div>
      </div>

      {/* Bottom Fade Gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-[50]"
        style={{ background: 'linear-gradient(to top, #111111 0%, transparent 100%)' }}
      />
    </section>
  );
}
