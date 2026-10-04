'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
  const shouldReduceMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInside, setIsInside] = useState(false);

  // Magnetic cursor follower spring setup
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const springX = useSpring(mouseX, { stiffness: 450, damping: 28, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 28, mass: 0.5 });
  const badgeScale = useSpring(0, { stiffness: 350, damping: 25 });
  const badgeOpacity = useSpring(0, { stiffness: 350, damping: 25 });

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

  // GSAP ScrollTrigger Pinned Scroll:
  // Pins the tools section and sequences the 3 slides down into stack positions as the user scrolls.
  // After all three slides have moved down (progress >= 1.0), the pin unlocks and page scrolls down.
  useEffect(() => {
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
          const p = self.progress;
          setScrollProgress(p);
          const idx = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
          setActiveIndex(idx);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  // Direct click-to-slide navigation
  const scrollToSlide = (index: number) => {
    if (typeof window === 'undefined') return;
    const trigger = ScrollTrigger.getById('tools-pin');
    if (trigger) {
      const targetScroll = trigger.start + (index / 2) * (trigger.end - trigger.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      setActiveIndex(index);
    }
  };

  // Card click navigation
  const handleCardClick = () => {
    router.push('/account');
  };

  // Compute slide transforms based on scrollProgress (0 to 1)
  // Let p go from 0 to 2
  const p = shouldReduceMotion ? activeIndex : scrollProgress * 2;

  // Slide 0 (Observe)
  const slide0Style: React.CSSProperties = shouldReduceMotion
    ? {
        transform: activeIndex === 0 ? 'translateY(0) scale(1)' : 'translateY(-30px) scale(0.95)',
        opacity: activeIndex === 0 ? 1 : 0,
        pointerEvents: activeIndex === 0 ? 'auto' : 'none',
        zIndex: activeIndex === 0 ? 30 : 10,
      }
    : {
        transform:
          p <= 1
            ? `translateY(${p * -35}px) scale(${1 - p * 0.05})`
            : `translateY(${-35 - (p - 1) * 25}px) scale(${0.95 - (p - 1) * 0.04})`,
        opacity: p <= 1 ? 1 - p * 0.15 : Math.max(0.2, 0.85 - (p - 1) * 0.4),
        zIndex: 10,
      };

  // Slide 1 (Devtools)
  // At p = 0, peeks at bottom (~540px offset, showing header like reference photo)
  // As p -> 1, moves down into focus at translateY(0)
  // As p -> 2, settles into background deck at translateY(-25px)
  const slide1Y =
    p <= 1
      ? (1 - p) * 520
      : -(p - 1) * 30;

  const slide1Scale =
    p <= 1
      ? 0.96 + p * 0.04
      : 1.0 - (p - 1) * 0.04;

  const slide1Opacity =
    p <= 1
      ? 1
      : 1 - (p - 1) * 0.15;

  const slide1Style: React.CSSProperties = shouldReduceMotion
    ? {
        transform: activeIndex === 1 ? 'translateY(0) scale(1)' : 'translateY(520px) scale(0.96)',
        opacity: activeIndex === 1 ? 1 : 0,
        pointerEvents: activeIndex === 1 ? 'auto' : 'none',
        zIndex: activeIndex === 1 ? 30 : 20,
      }
    : {
        transform: `translateY(${slide1Y}px) scale(${slide1Scale})`,
        opacity: slide1Opacity,
        zIndex: 20,
      };

  // Slide 2 (Deploy, mau!)
  // At p = 0, sits below Slide 1
  // At p = 1, peeks at bottom (~520px offset, showing header like reference photo)
  // As p -> 2, moves down into focus at translateY(0)
  const slide2Y =
    p <= 1
      ? 520 + (1 - p) * 200
      : (2 - p) * 520;

  const slide2Scale =
    p <= 1
      ? 0.92 + p * 0.04
      : 0.96 + (p - 1) * 0.04;

  const slide2Style: React.CSSProperties = shouldReduceMotion
    ? {
        transform: activeIndex === 2 ? 'translateY(0) scale(1)' : 'translateY(720px) scale(0.92)',
        opacity: activeIndex === 2 ? 1 : 0,
        pointerEvents: activeIndex === 2 ? 'auto' : 'none',
        zIndex: activeIndex === 2 ? 30 : 10,
      }
    : {
        transform: `translateY(${slide2Y}px) scale(${slide2Scale})`,
        opacity: 1,
        zIndex: 30,
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
            className={`${styles.sheet} ${styles.observeSheet}`}
            style={slide0Style}
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
            className={`${styles.sheet} ${styles.devtoolsSheet}`}
            style={slide1Style}
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
            className={`${styles.sheet} ${styles.deploySheet}`}
            style={slide2Style}
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
