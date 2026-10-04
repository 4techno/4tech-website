'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AstraSprings } from '@/lib/astra-architecture';
import styles from './studio-tools.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HISTOGRAM_BARS = [
  { h: 24, err: false }, { h: 32, err: false }, { h: 18, err: false }, { h: 42, err: true },
  { h: 28, err: false }, { h: 38, err: false }, { h: 58, err: true },  { h: 22, err: false },
  { h: 36, err: false }, { h: 26, err: false }, { h: 76, err: true, high: true }, { h: 40, err: false },
  { h: 16, err: false }, { h: 30, err: false }, { h: 24, err: false }, { h: 66, err: true },
  { h: 44, err: false }, { h: 32, err: false }, { h: 92, err: true, high: true }, { h: 36, err: false },
  { h: 20, err: false }, { h: 26, err: false }, { h: 16, err: false }, { h: 34, err: false },
  { h: 96, err: true, high: true }, { h: 52, err: false }, { h: 28, err: false }, { h: 22, err: false },
  { h: 40, err: false }, { h: 30, err: false }, { h: 80, err: true, high: true }, { h: 38, err: false },
  { h: 24, err: false }, { h: 30, err: false }, { h: 62, err: true },  { h: 46, err: false },
  { h: 18, err: false }, { h: 34, err: false }, { h: 88, err: true, high: true }, { h: 42, err: false },
  { h: 28, err: false }, { h: 22, err: false }, { h: 54, err: true },  { h: 32, err: false },
  { h: 16, err: false }, { h: 24, err: false }, { h: 38, err: false }, { h: 20, err: false },
  { h: 30, err: false }, { h: 45, err: false }, { h: 68, err: true },  { h: 26, err: false }
];

export default function StudioToolsSuite() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const slide0Ref = useRef<HTMLDivElement>(null);
  const slide1Ref = useRef<HTMLDivElement>(null);
  const slide2Ref = useRef<HTMLDivElement>(null);
  const activeIdxRef = useRef<number>(0);
  const shouldReduceMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isInside, setIsInside] = useState(false);

  // Magnetic cursor follower spring setup (AstraSprings fluid & snappy)
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const springX = useSpring(mouseX, AstraSprings.fluid);
  const springY = useSpring(mouseY, AstraSprings.fluid);
  const badgeScale = useSpring(0, AstraSprings.snappy);
  const badgeOpacity = useSpring(0, AstraSprings.snappy);

  // Handle pointer tracking inside the section
  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLElement>) => {
    setIsInside(true);
    mouseX.jump(e.clientX);
    mouseY.jump(e.clientY);
    badgeScale.set(1);
    badgeOpacity.set(1);
  }, [mouseX, mouseY, badgeScale, badgeOpacity]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    if (!isInside) {
      setIsInside(true);
      badgeScale.set(1);
      badgeOpacity.set(1);
    }
  }, [mouseX, mouseY, isInside, badgeScale, badgeOpacity]);

  const handlePointerLeave = useCallback(() => {
    setIsInside(false);
    badgeScale.set(0);
    badgeOpacity.set(0);
  }, [badgeScale, badgeOpacity]);

  const handlePointerDown = useCallback(() => {
    badgeScale.set(0.88);
  }, [badgeScale]);

  const handlePointerUp = useCallback(() => {
    badgeScale.set(1);
  }, [badgeScale]);

  // Direct GPU-accelerated DOM style updates (zero React state re-renders during scrolling)
  const updateSlidesDOM = useCallback((pProgress: number) => {
    const p = Math.max(0, Math.min(2, pProgress * 2));

    // Slide 0: Observe
    if (slide0Ref.current) {
      const y0 = p <= 1 ? p * -35 : -35 - (p - 1) * 25;
      const s0 = p <= 1 ? 1 - p * 0.05 : 0.95 - (p - 1) * 0.04;
      const o0 = p <= 1 ? 1 - p * 0.15 : Math.max(0.2, 0.85 - (p - 1) * 0.4);
      slide0Ref.current.style.transform = `translate3d(0, ${y0.toFixed(2)}px, 0) scale(${s0.toFixed(4)})`;
      slide0Ref.current.style.opacity = o0.toFixed(3);
      slide0Ref.current.style.zIndex = '10';
    }

    // Slide 1: Devtools (peeks at p=0 with ~520px offset, slides down into place as p->1)
    if (slide1Ref.current) {
      const y1 = p <= 1 ? (1 - p) * 520 : -(p - 1) * 30;
      const s1 = p <= 1 ? 0.96 + p * 0.04 : 1.0 - (p - 1) * 0.04;
      const o1 = p <= 1 ? 1 : 1 - (p - 1) * 0.15;
      slide1Ref.current.style.transform = `translate3d(0, ${y1.toFixed(2)}px, 0) scale(${s1.toFixed(4)})`;
      slide1Ref.current.style.opacity = o1.toFixed(3);
      slide1Ref.current.style.zIndex = '20';
    }

    // Slide 2: Deploy, mau! (sits below Slide 1, peeks at p=1, slides down into place as p->2)
    if (slide2Ref.current) {
      const y2 = p <= 1 ? 520 + (1 - p) * 200 : (2 - p) * 520;
      const s2 = p <= 1 ? 0.92 + p * 0.04 : 0.96 + (p - 1) * 0.04;
      slide2Ref.current.style.transform = `translate3d(0, ${y2.toFixed(2)}px, 0) scale(${s2.toFixed(4)})`;
      slide2Ref.current.style.opacity = '1';
      slide2Ref.current.style.zIndex = '30';
    }
  }, []);

  // GSAP ScrollTrigger Pinned Scroll:
  // Pins the tools section and sequences the 3 slides down into stack positions as the user scrolls.
  // After all three slides have moved down (progress >= 1.0), the pin unlocks and page scrolls down.
  useEffect(() => {
    // Initial layout setup
    updateSlidesDOM(0);

    if (shouldReduceMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: 'tools-pin',
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=2400',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.5,
        onUpdate: (self) => {
          updateSlidesDOM(self.progress);

          // Only update React state when active slide index changes (0 -> 1 -> 2)
          const idx = self.progress < 0.33 ? 0 : self.progress < 0.66 ? 1 : 2;
          if (idx !== activeIdxRef.current) {
            activeIdxRef.current = idx;
            setActiveIndex(idx);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [shouldReduceMotion, updateSlidesDOM]);

  // Direct click-to-slide navigation
  const scrollToSlide = (index: number) => {
    if (typeof window === 'undefined') return;
    const trigger = ScrollTrigger.getById('tools-pin');
    if (trigger) {
      const targetScroll = trigger.start + (index / 2) * (trigger.end - trigger.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      activeIdxRef.current = index;
      setActiveIndex(index);
      updateSlidesDOM(index / 2);
    }
  };

  // Card click navigation
  const handleCardClick = () => {
    router.push('/account');
  };

  return (
    <section
      id="tools"
      ref={sectionRef}
      className={styles.section}
      aria-label="4TECH Engineering Platform & Tools"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* Floating Magnetic Cursor Follower ("Check it out") */}
      <motion.div
        className={styles.cursorFollower}
        style={{
          x: springX,
          y: springY,
          scale: badgeScale,
          opacity: badgeOpacity,
        }}
        aria-hidden="true"
      >
        <span className={styles.cursorBadgeText}>Check it out</span>
      </motion.div>

      <div className={styles.shell}>
        {/* Top Control Tabs */}
        <div className={styles.topTabs} role="tablist" aria-label="Tool suites">
          <button
            type="button"
            role="tab"
            aria-selected={activeIndex === 0}
            className={`${styles.topTab} ${activeIndex === 0 ? styles.topTabActive : ''}`}
            onClick={() => scrollToSlide(0)}
          >
            <span className={styles.topTabDot} />
            01 / OBSERVE
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeIndex === 1}
            className={`${styles.topTab} ${activeIndex === 1 ? styles.topTabActive : ''}`}
            onClick={() => scrollToSlide(1)}
          >
            <span className={styles.topTabDot} />
            02 / DEVTOOLS
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeIndex === 2}
            className={`${styles.topTab} ${activeIndex === 2 ? styles.topTabActive : ''}`}
            onClick={() => scrollToSlide(2)}
          >
            <span className={styles.topTabDot} />
            03 / DEPLOY, MAU!
          </button>
        </div>

        {/* 3D Stacked Slides Stage */}
        <div className={styles.stage}>
          {/* =========================================================================
              SLIDE 1 (TOP): OBSERVE & ERROR HISTOGRAM ANALYTICS (EXACT MATCH TO NESTJS)
              ========================================================================= */}
          <div
            ref={slide0Ref}
            className={`${styles.sheet} ${styles.observeSheet}`}
            onClick={handleCardClick}
            role="region"
            aria-label="Observe and Error Analytics Platform"
          >
            <Link
              href="/account"
              className={styles.staticBadgeMobile}
              onClick={(e) => e.stopPropagation()}
            >
              Check it out
            </Link>

            <div className={styles.sheetHeader}>
              <h2 className={styles.sheetTitle}>Observe</h2>
              <p className={styles.sheetSubtitle}>
                Zero-Config Auto-Instrumented Telemetry for your hardware systems and IoT applications.
              </p>
            </div>

            {/* Mock Screen: Observe Errors Dashboard */}
            <div className={styles.mockWindow}>
              <div className={styles.windowBar}>
                <div className={styles.windowDots}>
                  <span />
                  <span />
                  <span />
                </div>
                <div className={styles.windowTitle}>
                  <span>FLEET_OBSERVABILITY &gt; TELEMETRY_STREAM</span>
                </div>
                <div className={styles.windowTabs}>
                  <span className={`${styles.windowTab} ${styles.windowTabActive}`}>ERRORS</span>
                  <span className={styles.windowTab}>METRICS</span>
                </div>
              </div>

              <div className={styles.observeBody}>
                {/* Left Navigation Sidebar */}
                <div className={styles.observeSidebar}>
                  <span className={styles.observeSidebarTitle}>DASHBOARD</span>
                  <span className={styles.observeNavPill}>APPLICATIONS</span>

                  <span className={styles.observeSidebarTitle}>ACTIVITY</span>
                  <span className={styles.observeNavPill}>REQUESTS</span>
                  <span className={styles.observeNavPill}>PROFILER</span>
                  <span className={styles.observeNavPill}>JOBS</span>
                  <span className={`${styles.observeNavPill} ${styles.observeNavPillActive}`}>
                    ERRORS <span>●</span>
                  </span>
                  <span className={styles.observeNavPill}>USERS</span>
                  <span className={styles.observeNavPill}>SPANS</span>
                  <span className={styles.observeNavPill}>RELEASES</span>
                  <span className={styles.observeNavPill}>SLOS</span>
                  <span className={styles.observeNavPill}>LOGS</span>
                  <span className={styles.observeNavPill}>API KEYS</span>
                </div>

                {/* Main Errors Panel */}
                <div className={styles.observeMain}>
                  <div className={styles.observeMainHeader}>
                    <div>
                      <h3 className={styles.observeErrorTitle}>
                        <span style={{ color: '#ff3355' }}>⬡</span> Errors
                      </h3>
                      <p className={styles.observeErrorSubtitle}>
                        Analytics and insights on errors within your hardware nodes.
                      </p>
                    </div>

                    <div className={styles.observeFilters}>
                      <span className={styles.observeFilterBtn}>All nodes ▾</span>
                      <span className={`${styles.observeFilterBtn} ${styles.observeFilterBtnActive}`}>1H</span>
                      <span className={styles.observeFilterBtn}>24H</span>
                      <span className={styles.observeFilterBtn}>7D</span>
                      <span className={styles.observeFilterBtn}>30D</span>
                    </div>
                  </div>

                  <div className={styles.observeMetricRow}>
                    <div className={styles.metricBig}>
                      <span>Errors 1.15%</span>
                      <span className={styles.metricChange}>↗ +11% since last period</span>
                    </div>
                    <div className={styles.metricSubCounts}>
                      <span>
                        <span className={styles.metricDotMuted} /> Intrinsic 175
                      </span>
                      <span>
                        <span className={styles.metricDotRed} /> Unhandled 115
                      </span>
                    </div>
                  </div>

                  {/* Histogram Chart */}
                  <div className={styles.histogramBox}>
                    <div className={styles.histogramBars}>
                      {HISTOGRAM_BARS.map((bar, i) => (
                        <div
                          key={i}
                          className={`${styles.histogramBar} ${
                            bar.err ? (bar.high ? styles.barErrorHigh : styles.barError) : styles.barMuted
                          }`}
                          style={{ height: `${bar.h}%` }}
                          title={`Sample ${i + 1}: ${bar.h}% magnitude`}
                        />
                      ))}
                    </div>
                    <div className={styles.histogramLabels}>
                      <span>August 5, 2026 1:25 PM</span>
                      <span>August 5, 2026 2:25 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              SLIDE 2 (MIDDLE): DEVTOOLS & PROBE HARDWARE STUDIO (CRIMSON RED)
              ========================================================================= */}
          <div
            ref={slide1Ref}
            className={`${styles.sheet} ${styles.devtoolsSheet}`}
            onClick={handleCardClick}
            role="region"
            aria-label="Devtools and Topology Studio"
          >
            <Link
              href="/account"
              className={styles.staticBadgeMobile}
              onClick={(e) => e.stopPropagation()}
            >
              Check it out
            </Link>

            <div className={styles.sheetHeader}>
              <h2 className={styles.sheetTitle}>Devtools</h2>
              <p className={styles.sheetSubtitle}>
                Enhance your engineering workflow with powerful tools designed to streamline your hardware application development.
              </p>
            </div>

            {/* Inner Mock Window (Graph & Node View) */}
            <div className={styles.mockWindow}>
              <div className={styles.windowBar}>
                <div className={styles.windowDots}>
                  <span />
                  <span />
                  <span />
                </div>
                <span className={styles.windowTitle}>PROJECT / SYSTEM_GRAPH / FIRMWARE_MAP</span>
                <div className={styles.windowTabs}>
                  <span className={`${styles.windowTab} ${styles.windowTabActive}`}>GRAPH VIEW</span>
                  <span className={styles.windowTab}>CLASSES</span>
                  <span className={styles.windowTab}>LOGS</span>
                </div>
              </div>

              <div className={styles.devtoolsBody}>
                {/* Left Hierarchy Tree */}
                <div className={styles.sideList}>
                  <span className={styles.sideItemActive}>AppController</span>
                  <span className={styles.sideItem}>SensorFusionModule</span>
                  <span className={styles.sideItem}>KinematicsService</span>
                  <span className={styles.sideItem}>TelemetryGateway</span>
                  <span className={styles.sideItem}>MotorPWMDriver</span>
                </div>

                {/* Center Node Topology Canvas */}
                <div className={styles.graphCanvas}>
                  <div className="flex items-center gap-3">
                    <div className={styles.nodeBox}>SensorInput (IMU)</div>
                    <div className={styles.nodeLine} />
                    <div className={styles.nodeBox} style={{ borderColor: '#FC6B2F' }}>
                      PID Attitude Loop
                    </div>
                    <div className={styles.nodeLine} />
                    <div className={styles.nodeBox}>MotorMixer</div>
                  </div>
                </div>

                {/* Right Inspector Box */}
                <div className={styles.inspectorBox}>
                  <div className={styles.inspectorRow}>
                    <span>Loop rate:</span>
                    <span className={styles.inspectorVal}>1,000 Hz</span>
                  </div>
                  <div className={styles.inspectorRow}>
                    <span>Attitude jitter:</span>
                    <span className={styles.inspectorVal}>±0.02°</span>
                  </div>
                  <div className={styles.inspectorRow}>
                    <span>Tank resonance:</span>
                    <span className={styles.inspectorVal}>134.2 kHz</span>
                  </div>
                  <div className={styles.inspectorRow}>
                    <span>Q-Factor:</span>
                    <span className={styles.inspectorVal}>44.6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              SLIDE 3 (FRONT): DEPLOY, MAU! & HARDWARE FLEET (TITANIUM SLATE)
              ========================================================================= */}
          <div
            ref={slide2Ref}
            className={`${styles.sheet} ${styles.deploySheet}`}
            onClick={handleCardClick}
            role="region"
            aria-label="Deploy and Fleet Telemetry Platform"
          >
            <Link
              href="/account"
              className={styles.staticBadgeMobile}
              onClick={(e) => e.stopPropagation()}
            >
              Check it out
            </Link>

            <div className={styles.sheetHeader}>
              <h2 className={styles.sheetTitle}>Deploy, mau!</h2>
              <p className={styles.sheetSubtitle}>
                Provision and manage your physical infrastructure and telemetry on AWS without the hassle and extra DevOps work.
              </p>
            </div>

            {/* Inner Mock Window (CPU Utilisation & Response Time Charts) */}
            <div className={styles.mockWindow}>
              <div className={styles.windowBar}>
                <div className={styles.windowDots}>
                  <span />
                  <span />
                  <span />
                </div>
                <span className={styles.windowTitle}>FLEET &gt; SENSOR_MESH_NODE_CLUSTER</span>
                <div className={styles.windowTabs}>
                  <span className={`${styles.windowTab} ${styles.windowTabActive}`}>LIVE METRICS</span>
                  <span className={styles.windowTab}>PROD</span>
                </div>
              </div>

              <div className={styles.deployBody}>
                {/* Left Navigation Sidebar */}
                <div className={styles.deployNav}>
                  <span className={styles.deployNavItemActive}>PROJECT &gt; API</span>
                  <span className={styles.deployNavItemActive} style={{ marginTop: 6 }}>
                    DASHBOARD
                  </span>
                  <span className={styles.deployNavItem}>DEPLOYMENTS</span>
                  <span className={styles.deployNavItem}>LOGS</span>
                  <span className={styles.deployNavItem}>TRAFFIC</span>
                  <span className={styles.deployNavItem}>DOMAINS</span>
                  <span className={styles.deployNavItem}>API KEYS</span>
                  <span className={styles.deployNavItem}>SETTINGS</span>
                </div>

                {/* Chart 1: CPU Utilisation */}
                <div className={styles.chartCard}>
                  <div className={styles.chartTop}>
                    <span>CPU utilisation</span>
                    <div className="flex gap-1.5">
                      <span className={styles.chartPill}>1H</span>
                      <span className={styles.chartPill}>3H</span>
                      <span className={styles.chartPill} style={{ background: '#272732', color: '#fff' }}>
                        12H
                      </span>
                    </div>
                  </div>

                  <svg viewBox="0 0 340 130" className={styles.chartSvg} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="redGlowTools" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ff4d61" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#ff4d61" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="cyanLineTools" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>

                    <line x1="0" y1="20" x2="340" y2="20" stroke="rgba(255,255,255,0.06)" />
                    <line x1="0" y1="55" x2="340" y2="55" stroke="rgba(255,255,255,0.06)" />
                    <line x1="0" y1="90" x2="340" y2="90" stroke="rgba(255,255,255,0.06)" />

                    <path
                      d="M0,120 Q40,115 65,70 Q80,20 100,20 Q120,20 135,80 Q155,115 185,115 Q210,115 235,50 Q255,10 270,10 Q285,10 305,90 Q325,120 340,120 L340,130 L0,130 Z"
                      fill="url(#redGlowTools)"
                    />
                    <path
                      d="M0,120 Q40,115 65,70 Q80,20 100,20 Q120,20 135,80 Q155,115 185,115 Q210,115 235,50 Q255,10 270,10 Q285,10 305,90 Q325,120 340,120"
                      fill="none"
                      stroke="#ff4d61"
                      strokeWidth="2"
                    />
                    <path
                      d="M0,110 Q50,112 100,95 Q150,85 200,105 Q250,92 300,98 L340,102"
                      fill="none"
                      stroke="url(#cyanLineTools)"
                      strokeWidth="2.5"
                    />
                  </svg>

                  <div className={styles.chartLegend}>
                    <span>
                      <span className={styles.legendDotRed} /> Maximum CPU
                    </span>
                    <span>
                      <span className={styles.legendDotCyan} /> Average CPU
                    </span>
                  </div>
                </div>

                {/* Chart 2: Response Time */}
                <div className={styles.chartCard}>
                  <div className={styles.chartTop}>
                    <span>Response time</span>
                    <div className="flex gap-1.5">
                      <span className={styles.chartPill}>1H</span>
                      <span className={styles.chartPill} style={{ background: '#272732', color: '#fff' }}>
                        12H
                      </span>
                      <span className={styles.chartPill}>1D</span>
                    </div>
                  </div>

                  <svg viewBox="0 0 340 130" className={styles.chartSvg} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="roseGlowTools" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line x1="0" y1="20" x2="340" y2="20" stroke="rgba(255,255,255,0.06)" />
                    <line x1="0" y1="55" x2="340" y2="55" stroke="rgba(255,255,255,0.06)" />
                    <line x1="0" y1="90" x2="340" y2="90" stroke="rgba(255,255,255,0.06)" />

                    <path
                      d="M0,120 Q70,118 120,95 Q150,80 180,110 Q210,120 240,85 Q265,15 285,15 Q305,15 320,105 L340,115 L340,130 L0,130 Z"
                      fill="url(#roseGlowTools)"
                    />
                    <path
                      d="M0,120 Q70,118 120,95 Q150,80 180,110 Q210,120 240,85 Q265,15 285,15 Q305,15 320,105 L340,115"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2"
                    />
                    <path
                      d="M0,115 Q80,115 150,110 Q220,105 280,100 L340,95"
                      fill="none"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  </svg>

                  <div className={styles.chartLegend}>
                    <span>
                      <span className={styles.legendDotRed} /> p95 latency
                    </span>
                    <span>
                      <span className={styles.legendDotCyan} style={{ background: '#fff' }} /> Average
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
