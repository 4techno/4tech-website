'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

const storageKey = '4tech:intro-seen:v3';
let seenInThisPage = false;

/**
 * Opening cinematic sequence matching the reference video (Michelangelo Creation of Adam ASCII transformation).
 * Features ASCII character matrix dissolving, finger-touch explosion at t=2.15s, and radiant transition into the main site.
 */
export default function IntroSequence() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasFinishedRef = useRef(false);

  const finish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    seenInThisPage = true;
    try {
      window.sessionStorage.setItem(storageKey, '1');
    } catch {
      /* Session storage may be unavailable in private browsing */
    }
    document.documentElement.dataset.techIntroComplete = 'true';
    setVisible(false);
    window.dispatchEvent(new Event('4tech:intro-complete'));
  }, []);

  const skip = useCallback(() => {
    timelineRef.current?.kill();
    const root = rootRef.current;
    if (root) {
      gsap.to(root, {
        opacity: 0,
        yPercent: -100,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: finish,
      });
    } else {
      finish();
    }
  }, [finish]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let alreadySeen = seenInThisPage;
    try {
      alreadySeen ||= window.sessionStorage.getItem(storageKey) === '1';
    } catch {
      /* Optional storage */
    }

    if (reduced || alreadySeen) {
      finish();
      return;
    }

    // Keyboard shortcut [ESC] to skip
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skip();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    const root = rootRef.current;
    const video = videoRef.current;
    const title = titleRef.current;
    const counter = counterRef.current;
    const bar = barRef.current;
    const flash = flashRef.current;

    if (!root) return;

    // Start video playback
    if (video) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser blocks autoplay, fallback animation continues seamlessly
        });
      }
    }

    const progress = { value: 0 };
    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.to(root, {
          yPercent: -101,
          opacity: 0.95,
          duration: 0.85,
          ease: 'expo.inOut',
          onComplete: finish,
        });
      },
    });
    timelineRef.current = timeline;

    // 1. Telemetry & title fade-in (0.0s - 0.4s)
    if (title) {
      timeline.fromTo(title, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.05);
    }

    // 2. Coordinated progress counter & bar (0.1s - 2.8s)
    timeline.to(
      progress,
      {
        value: 100,
        duration: 2.75,
        ease: 'power1.inOut',
        onUpdate: () => {
          const val = Math.min(100, Math.round(progress.value));
          if (counter) counter.textContent = `${val.toString().padStart(3, '0')}%`;
          if (bar) bar.style.width = `${val}%`;
        },
      },
      0.1
    );

    // 3. Fingertip touch & radiant ASCII explosion burst (t = 2.15s)
    if (flash) {
      timeline
        .fromTo(
          flash,
          { opacity: 0, scale: 0.25 },
          { opacity: 0.95, scale: 1.1, duration: 0.2, ease: 'power2.out' },
          2.12
        )
        .to(flash, { opacity: 0, scale: 3.2, duration: 0.55, ease: 'power2.out' }, 2.32);
    }

    // Fallback safety timeout (in case of tab backgrounding or video stall)
    const safetyTimer = setTimeout(() => {
      if (!hasFinishedRef.current) {
        skip();
      }
    }, 4200);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      clearTimeout(safetyTimer);
      timeline.kill();
      timelineRef.current = null;
    };
  }, [finish, skip]);

  if (!visible) return null;

  return (
    <div ref={rootRef} className="tech-intro" aria-label="4TECH opening sequence" role="region">
      {/* Top HUD Telemetry */}
      <div className="tech-intro__top">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 shrink-0 rounded-full bg-[#E52320] animate-pulse shadow-[0_0_10px_#E52320]" />
          <span>4TECH // SPATIAL &amp; HARDWARE SYSTEMS</span>
        </div>
        <button
          type="button"
          onClick={skip}
          className="tech-intro__skip"
          aria-label="Skip introduction animation"
        >
          <span>Skip intro</span>
          <kbd>ESC</kbd>
        </button>
      </div>

      {/* Cinematic Title */}
      <div ref={titleRef} className="tech-intro__title" aria-hidden="true">
        <span>HUMAN CURIOSITY</span>
        <strong>MEETS ENGINEERED POSSIBILITY.</strong>
      </div>

      {/* Centerpiece Video: Michelangelo Creation of Adam ASCII transformation */}
      <div className="tech-intro__media" aria-hidden="true">
        <div className="tech-intro__corner tech-intro__corner--tl" />
        <div className="tech-intro__corner tech-intro__corner--tr" />
        <div className="tech-intro__corner tech-intro__corner--bl" />
        <div className="tech-intro__corner tech-intro__corner--br" />

        <video
          ref={videoRef}
          src="/assets/intro/creation-of-adam-ascii.mp4"
          playsInline
          muted
          autoPlay
          preload="auto"
          className="tech-intro__video"
        />

        <div className="tech-intro__media-glow" />
      </div>

      {/* Radiant ASCII contact burst flash */}
      <div ref={flashRef} className="tech-intro__flash" aria-hidden="true" />

      {/* Bottom HUD Telemetry & Progress Indicator */}
      <div className="tech-intro__bottom">
        <span>ROBOTICS · EMBEDDED SYSTEMS · RF INSTRUMENTATION</span>
        <div className="tech-intro__bar-wrap" aria-hidden="true">
          <div ref={barRef} className="tech-intro__bar-fill" />
        </div>
        <span ref={counterRef} className="tech-intro__counter">
          000%
        </span>
      </div>
    </div>
  );
}
