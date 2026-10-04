'use client';

import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionPreferences } from '@/components/motion-preferences';
import styles from './studio-tools.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Illustrative telemetry data for the interface preview.
const ERROR_BARS = [
  { h: 22, err: false }, { h: 35, err: false }, { h: 18, err: false }, { h: 48, err: true },
  { h: 26, err: false }, { h: 38, err: false }, { h: 62, err: true },  { h: 20, err: false },
  { h: 34, err: false }, { h: 28, err: false }, { h: 78, err: true, high: true }, { h: 42, err: false },
  { h: 18, err: false }, { h: 30, err: false }, { h: 24, err: false }, { h: 66, err: true },
  { h: 45, err: false }, { h: 32, err: false }, { h: 94, err: true, high: true }, { h: 38, err: false },
  { h: 22, err: false }, { h: 28, err: false }, { h: 16, err: false }, { h: 36, err: false },
  { h: 98, err: true, high: true }, { h: 54, err: false }, { h: 30, err: false }, { h: 22, err: false },
  { h: 42, err: false }, { h: 32, err: false }, { h: 82, err: true, high: true }, { h: 36, err: false },
  { h: 24, err: false }, { h: 32, err: false }, { h: 64, err: true },  { h: 48, err: false },
  { h: 18, err: false }, { h: 34, err: false }, { h: 88, err: true, high: true }, { h: 44, err: false },
  { h: 28, err: false }, { h: 24, err: false }, { h: 56, err: true },  { h: 32, err: false },
  { h: 16, err: false }, { h: 26, err: false }, { h: 40, err: false }, { h: 22, err: false },
  { h: 30, err: false }, { h: 46, err: false }, { h: 72, err: true },  { h: 28, err: false }
];

export default function StudioToolsSuite() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slide0Ref = useRef<HTMLDivElement>(null);
  const slide1Ref = useRef<HTMLDivElement>(null);
  const slide2Ref = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIdxRef = useRef<number>(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const { reduced, paused } = useMotionPreferences();
  const pinned = !reduced && !paused;

  // Magnetic cursor follower spring setup
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const springX = useSpring(mouseX, { stiffness: 450, damping: 28, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 28, mass: 0.4 });
  const badgeScale = useSpring(0, { stiffness: 400, damping: 26 });
  const badgeOpacity = useSpring(0, { stiffness: 400, damping: 26 });
  const touchFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInteractingRef = useRef(false);

  // Handle pointer tracking inside the section (mouse & stylus)
  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLElement>) => {
    isInteractingRef.current = true;
    mouseX.jump(e.clientX);
    mouseY.jump(e.clientY);
    badgeScale.set(1);
    badgeOpacity.set(1);
  }, [mouseX, mouseY, badgeScale, badgeOpacity]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    if (!isInteractingRef.current) {
      isInteractingRef.current = true;
      badgeScale.set(1);
      badgeOpacity.set(1);
    }
  }, [mouseX, mouseY, badgeScale, badgeOpacity]);

  const handlePointerLeave = useCallback(() => {
    isInteractingRef.current = false;
    badgeScale.set(0);
    badgeOpacity.set(0);
  }, [badgeScale, badgeOpacity]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (touchFadeTimerRef.current) clearTimeout(touchFadeTimerRef.current);
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    isInteractingRef.current = true;
    badgeScale.set(0.88);
    badgeOpacity.set(1);
  }, [mouseX, mouseY, badgeScale, badgeOpacity]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLElement>) => {
    badgeScale.set(1);
    if (e.pointerType === 'touch') {
      if (touchFadeTimerRef.current) clearTimeout(touchFadeTimerRef.current);
      touchFadeTimerRef.current = setTimeout(() => {
        isInteractingRef.current = false;
        badgeScale.set(0);
        badgeOpacity.set(0);
      }, 700);
    }
  }, [badgeScale, badgeOpacity]);

  // Touch fallback for seamless mobile touch tracking
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLElement>) => {
    if (touchFadeTimerRef.current) clearTimeout(touchFadeTimerRef.current);
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseX.jump(touch.clientX);
      mouseY.jump(touch.clientY);
      isInteractingRef.current = true;
      badgeScale.set(0.88);
      badgeOpacity.set(1);
    }
  }, [mouseX, mouseY, badgeScale, badgeOpacity]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseX.set(touch.clientX);
      mouseY.set(touch.clientY);
      if (!isInteractingRef.current) {
        isInteractingRef.current = true;
        badgeScale.set(1);
        badgeOpacity.set(1);
      }
    }
  }, [mouseX, mouseY, badgeScale, badgeOpacity]);

  const handleTouchEnd = useCallback(() => {
    if (touchFadeTimerRef.current) clearTimeout(touchFadeTimerRef.current);
    touchFadeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false;
      badgeScale.set(0);
      badgeOpacity.set(0);
    }, 700);
  }, [badgeScale, badgeOpacity]);

  // Clicking cards navigates to account
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button') || target.closest('[role="tab"]')) {
      return;
    }
    router.push('/account');
  };

  // Direct GPU-accelerated DOM transforms (zero React state overhead during scroll)
  const updateSlidesDOM = useCallback((progress: number) => {
    // progress goes 0 to 1 across the pin duration
    // Let p go from 0 to 2
    const p = Math.max(0, Math.min(2, progress * 2));
    const stageHeight = stageRef.current?.clientHeight ?? 600;
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;

    // Responsive peek offset: next card header peeks at bottom of viewport
    const headerPeek = isMobile ? 85 : 135;
    const peekY = Math.max(260, stageHeight - headerPeek);
    const stackRecede = isMobile ? 22 : 32;

    // Slide 0: Observe
    if (slide0Ref.current) {
      const y0 = p <= 1 ? -p * stackRecede : -stackRecede - (p - 1) * (stackRecede * 0.75);
      const s0 = p <= 1 ? 1 - p * 0.05 : 0.95 - (p - 1) * 0.04;
      const o0 = p <= 1 ? 1 - p * 0.15 : Math.max(0.25, 0.85 - (p - 1) * 0.4);
      slide0Ref.current.style.transform = `translate3d(0, ${y0.toFixed(2)}px, 0) scale(${s0.toFixed(4)})`;
      slide0Ref.current.style.opacity = o0.toFixed(3);
      slide0Ref.current.style.zIndex = '10';
      slide0Ref.current.style.pointerEvents = p < 0.6 ? 'auto' : 'none';
    }

    // Slide 1: Devtools
    if (slide1Ref.current) {
      const y1 = p <= 1 ? (1 - p) * peekY : -(p - 1) * stackRecede;
      const s1 = p <= 1 ? 0.96 + p * 0.04 : 1.0 - (p - 1) * 0.05;
      const o1 = p <= 1 ? 1 : 1 - (p - 1) * 0.15;
      slide1Ref.current.style.transform = `translate3d(0, ${y1.toFixed(2)}px, 0) scale(${s1.toFixed(4)})`;
      slide1Ref.current.style.opacity = o1.toFixed(3);
      slide1Ref.current.style.zIndex = '20';
      slide1Ref.current.style.pointerEvents = p >= 0.5 && p < 1.5 ? 'auto' : 'none';
    }

    // Slide 2: Fleet (Deploy, mau!)
    if (slide2Ref.current) {
      const y2 = p <= 1 ? peekY + (1 - p) * (isMobile ? 60 : 100) : (2 - p) * peekY;
      const s2 = p <= 1 ? 0.92 + p * 0.04 : 0.96 + (p - 1) * 0.04;
      slide2Ref.current.style.transform = `translate3d(0, ${y2.toFixed(2)}px, 0) scale(${s2.toFixed(4)})`;
      slide2Ref.current.style.opacity = '1';
      slide2Ref.current.style.zIndex = '30';
      slide2Ref.current.style.pointerEvents = p >= 1.4 ? 'auto' : 'none';
    }
  }, []);

  useEffect(() => {
    const clearSlideStyles = () => {
      for (const slide of [slide0Ref.current, slide1Ref.current, slide2Ref.current]) {
        if (!slide) continue;
        for (const property of ['transform', 'opacity', 'z-index', 'pointer-events']) {
          slide.style.removeProperty(property);
        }
      }
    };
    clearSlideStyles();
    if (!pinned || !sectionRef.current) return;
    updateSlidesDOM(0);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: 'tools-pin',
        trigger: sectionRef.current,
        start: 'top top',
        end: () => (window.innerWidth <= 640 ? '+=1600' : '+=2200'),
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.5,
        onRefresh: self => updateSlidesDOM(self.progress),
        onUpdate: (self) => {
          updateSlidesDOM(self.progress);

          const idx = self.progress < 0.33 ? 0 : self.progress < 0.67 ? 1 : 2;
          if (idx !== activeIdxRef.current) {
            activeIdxRef.current = idx;
            setActiveIndex(idx);
          }
        },
      });
    }, sectionRef);

    const handleResize = () => {
      const trigger = ScrollTrigger.getById('tools-pin');
      if (trigger) {
        updateSlidesDOM(trigger.progress);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
      clearSlideStyles();
    };
  }, [pinned, updateSlidesDOM]);

  const scrollToSlide = (index: number) => {
    const trigger = pinned ? ScrollTrigger.getById('tools-pin') : undefined;
    if (trigger) {
      const targetScroll = trigger.start + 1 + (index / 2) * (trigger.end - trigger.start - 2);
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
      ScrollTrigger.update();
      updateSlidesDOM(index / 2);
    }
    activeIdxRef.current = index;
    setActiveIndex(index);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % 3;
    else if (event.key === 'ArrowLeft') next = (index + 2) % 3;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 2;
    else return;
    event.preventDefault();
    scrollToSlide(next);
    tabRefs.current[next]?.focus({ preventScroll: true });
  };

  return (
    <section
      id="tools"
      ref={sectionRef}
      className={styles.section}
      data-layout={pinned ? 'pinned' : 'manual'}
      aria-labelledby="tools-preview-title"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* Floating Magnetic Cursor Follower ("Check it out") */}
      {!reduced && (
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
      )}

      <div className={styles.shell}>
        <div className={styles.previewIntro}>
          <h2 id="tools-preview-title">Engineering interface preview</h2>
          <p>Illustrative screens with sample telemetry. No live devices or services are connected.</p>
        </div>
        <div className={styles.topTabs} role="tablist" aria-label="Engineering interface previews">
          {['Observe', 'Devtools', 'Fleet'].map((label, index) => (
            <button
              key={label}
              ref={element => { tabRefs.current[index] = element; }}
              type="button"
              id={`tools-tab-${index}`}
              className={`${styles.topTab} ${activeIndex === index ? styles.topTabActive : ''}`}
              onClick={() => scrollToSlide(index)}
              onKeyDown={event => handleTabKeyDown(event, index)}
              aria-selected={activeIndex === index}
              aria-controls={`tools-panel-${index}`}
              tabIndex={activeIndex === index ? 0 : -1}
              role="tab"
            >
              <span className={styles.topTabDot} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {/* 3D Stacking Deck Viewport */}
        <div ref={stageRef} className={styles.stage}>
          {/* =========================================================================
              SLIDE 1: OBSERVE (Dark Obsidian with Live Histogram)
              ========================================================================= */}
          <div
            ref={slide0Ref}
            className={`${styles.sheet} ${styles.observeSheet}`}
            id="tools-panel-0"
            role="tabpanel"
            aria-labelledby="tools-tab-0"
            hidden={!pinned && activeIndex !== 0}
            aria-hidden={activeIndex !== 0}
            inert={activeIndex !== 0}
            tabIndex={activeIndex === 0 ? 0 : -1}
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.sheetHeader}>
              <h3 className={styles.sheetTitle}>Observe</h3>
              <p className={styles.sheetSubtitle}>
                An illustrative view of prototype telemetry, device events and diagnostic trends.
              </p>
              <Link href="/account" className={styles.accountLink}>Open your account <span aria-hidden="true">→</span></Link>
            </div>

            <div className={styles.mockWindow}>
              <div className={styles.windowBar}>
                <div className={styles.windowDots}>
                  <span />
                  <span />
                  <span />
                </div>
                <div className={styles.windowTitle}>
                  <span>4TECH &gt; SAMPLE TELEMETRY</span>
                </div>
                <div className={styles.windowTabs}>
                  <span className={styles.windowTab}>1H</span>
                  <span className={styles.windowTabActive}>24H</span>
                  <span className={styles.windowTab}>30D</span>
                </div>
              </div>

              <div className={styles.observeBody}>
                {/* Sidebar Navigation */}
                <div className={styles.observeSidebar}>
                  <span className={styles.observeSidebarTitle}>DASHBOARD</span>
                  <div className={styles.observeNavPill}>Overview</div>
                  <div className={`${styles.observeNavPill} ${styles.observeNavPillActive}`}>
                    Errors <span>18</span>
                  </div>
                  <div className={styles.observeNavPill}>Profiler</div>
                  <div className={styles.observeNavPill}>Traces</div>
                  <span className={styles.observeSidebarTitle}>HARDWARE</span>
                  <div className={styles.observeNavPill}>RF Nodes</div>
                  <div className={styles.observeNavPill}>Firmware</div>
                  <div className={styles.observeNavPill}>CAN Bus</div>
                </div>

                {/* Main Content Area */}
                <div className={styles.observeMain}>
                  <div className={styles.observeMainHeader}>
                    <div>
                      <h3 className={styles.observeErrorTitle}>
                        <span className={styles.metricDotRed} /> Errors
                      </h3>
                      <p className={styles.observeErrorSubtitle}>
                        Sample anomaly data showing a possible monitoring interface.
                      </p>
                    </div>
                    <div className={styles.observeFilters}>
                      <span className={`${styles.observeFilterBtn} ${styles.observeFilterBtnActive}`}>All Devices</span>
                      <span className={styles.observeFilterBtn}>P99 Spike</span>
                    </div>
                  </div>

                  <div className={styles.observeMetricRow}>
                    <div className={styles.metricBig}>
                      1.16% <span className={styles.metricChange}>+0.04% since last period</span>
                    </div>
                    <div className={styles.metricSubCounts}>
                      <span><span className={styles.metricDotRed} /> Intrinsic: 14</span>
                      <span><span className={styles.metricDotMuted} /> Handled: 156</span>
                    </div>
                  </div>

                  {/* Histogram Chart */}
                  <div className={styles.histogramBox}>
                    <div className={styles.histogramBars}>
                      {ERROR_BARS.map((bar, i) => (
                        <div
                          key={i}
                          className={`${styles.histogramBar} ${bar.err ? (bar.high ? styles.barErrorHigh : styles.barError) : styles.barMuted}`}
                          style={{ height: `${bar.h}%` }}
                        />
                      ))}
                    </div>
                    <div className={styles.histogramLabels}>
                      <span>12:00 AM</span>
                      <span>06:00 AM</span>
                      <span>12:00 PM</span>
                      <span>06:00 PM</span>
                      <span>SAMPLE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              SLIDE 2: DEVTOOLS (Crimson Red with Topology & Circuit Inspector)
              ========================================================================= */}
          <div
            ref={slide1Ref}
            className={`${styles.sheet} ${styles.devtoolsSheet}`}
            id="tools-panel-1"
            role="tabpanel"
            aria-labelledby="tools-tab-1"
            hidden={!pinned && activeIndex !== 1}
            aria-hidden={activeIndex !== 1}
            inert={activeIndex !== 1}
            tabIndex={activeIndex === 1 ? 0 : -1}
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.sheetHeader}>
              <h3 className={styles.sheetTitle}>Devtools</h3>
              <p className={styles.sheetSubtitle}>
                A sample topology layout for discussing RF modules, embedded systems and signal paths.
              </p>
              <Link href="/account" className={styles.accountLink}>Open your account <span aria-hidden="true">→</span></Link>
            </div>

            <div className={styles.mockWindow}>
              <div className={styles.windowBar}>
                <div className={styles.windowDots}>
                  <span />
                  <span />
                  <span />
                </div>
                <div className={styles.windowTitle}>
                  <span>4TECH &gt; SAMPLE TOPOLOGY</span>
                </div>
                <div className={styles.windowTabs}>
                  <span className={styles.windowTabActive}>PROBE_V2</span>
                  <span className={styles.windowTab}>LOGIC</span>
                </div>
              </div>

              <div className={styles.devtoolsBody}>
                {/* Module Tree Sidebar */}
                <div className={styles.sideList}>
                  <div className={`${styles.sideItem} ${styles.sideItemActive}`}>RootModule</div>
                  <div className={styles.sideItem}>RfTransceiverModule</div>
                  <div className={styles.sideItem}>KinematicsArmModule</div>
                  <div className={styles.sideItem}>TelemetryStreamModule</div>
                  <div className={styles.sideItem}>SecurityKeyModule</div>
                </div>

                {/* Center Node Topology Canvas */}
                <div className={styles.graphCanvas}>
                  <div className={styles.nodeBox}>RfAntennaProbe</div>
                  <div className={styles.nodeLine} />
                  <div className={styles.nodeBox}>DemodulatorDSP</div>
                  <div className={styles.nodeLine} />
                  <div className={styles.nodeBox}>TelemetryGateway</div>
                </div>

                {/* Right Inspector Box */}
                <div className={styles.inspectorBox}>
                  <div className={styles.inspectorRow}>
                    <span>Sampling</span>
                    <span className={styles.inspectorVal}>48 kHz</span>
                  </div>
                  <div className={styles.inspectorRow}>
                    <span>Frequency</span>
                    <span className={styles.inspectorVal}>5.8 GHz</span>
                  </div>
                  <div className={styles.inspectorRow}>
                    <span>Impedance</span>
                    <span className={styles.inspectorVal}>50 &Omega; &plusmn;0.5%</span>
                  </div>
                  <div className={styles.inspectorRow}>
                    <span>Phase Lock</span>
                    <span className={styles.inspectorVal}>SYNCHRONIZED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              SLIDE 3: FLEET (Illustrative fleet telemetry)
              ========================================================================= */}
          <div
            ref={slide2Ref}
            className={`${styles.sheet} ${styles.deploySheet}`}
            id="tools-panel-2"
            role="tabpanel"
            aria-labelledby="tools-tab-2"
            hidden={!pinned && activeIndex !== 2}
            aria-hidden={activeIndex !== 2}
            inert={activeIndex !== 2}
            tabIndex={activeIndex === 2 ? 0 : -1}
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.sheetHeader}>
              <h3 className={styles.sheetTitle}>Fleet</h3>
              <p className={styles.sheetSubtitle}>
                An illustrative fleet overview with sample utilisation and response-time charts.
              </p>
              <Link href="/account" className={styles.accountLink}>Open your account <span aria-hidden="true">→</span></Link>
            </div>

            <div className={styles.mockWindow}>
              <div className={styles.windowBar}>
                <div className={styles.windowDots}>
                  <span />
                  <span />
                  <span />
                </div>
                <div className={styles.windowTitle}>
                  <span>FLEET &gt; SAMPLE NODE CLUSTER</span>
                </div>
                <div className={styles.windowTabs}>
                  <span className={styles.windowTabActive}>SAMPLE METRICS</span>
                  <span className={styles.windowTab}>DEMO</span>
                </div>
              </div>

              <div className={styles.deployBody}>
                {/* Fleet Nav */}
                <div className={styles.deployNav}>
                  <div className={`${styles.deployNavItem} ${styles.deployNavItemActive}`}>Cluster 01 (India)</div>
                  <div className={styles.deployNavItem}>Cluster 02 (EU-West)</div>
                  <div className={styles.deployNavItem}>Drone Fleet Alpha</div>
                  <div className={styles.deployNavItem}>Titan Arm 6DOF</div>
                  <div className={styles.deployNavItem}>SewerSense Mesh</div>
                </div>

                {/* Chart 1: CPU Utilisation */}
                <div className={styles.chartCard}>
                  <div className={styles.chartTop}>
                    <span>CPU utilisation</span>
                    <span className={styles.chartPill}>1H &bull; 3H &bull; 12H</span>
                  </div>
                  <svg className={styles.chartSvg} viewBox="0 0 300 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff4d61" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ff4d61" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,100 C30,90 60,30 90,40 C120,50 150,95 180,85 C210,75 240,20 270,30 L300,50 L300,120 L0,120 Z"
                      fill="url(#cpuGrad)"
                    />
                    <path
                      d="M0,100 C30,90 60,30 90,40 C120,50 150,95 180,85 C210,75 240,20 270,30 L300,50"
                      fill="none"
                      stroke="#ff4d61"
                      strokeWidth="2.5"
                    />
                  </svg>
                  <div className={styles.chartLegend}>
                    <span><span className={styles.legendDotRed} /> Node Peak: 48.2%</span>
                    <span>Average: 24.1%</span>
                  </div>
                </div>

                {/* Chart 2: Response Time */}
                <div className={styles.chartCard}>
                  <div className={styles.chartTop}>
                    <span>Response time</span>
                    <span className={styles.chartPill}>1H &bull; 12H &bull; 1D</span>
                  </div>
                  <svg className={styles.chartSvg} viewBox="0 0 300 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="respGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,80 C40,75 80,45 120,60 C160,75 200,35 240,40 C270,45 290,25 300,30 L300,120 L0,120 Z"
                      fill="url(#respGrad)"
                    />
                    <path
                      d="M0,80 C40,75 80,45 120,60 C160,75 200,35 240,40 C270,45 290,25 300,30"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                    />
                  </svg>
                  <div className={styles.chartLegend}>
                    <span><span className={styles.legendDotCyan} /> P99 Latency: 1.2 ms</span>
                    <span>Nominal: 0.8 ms</span>
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
