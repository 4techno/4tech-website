'use client';

import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from 'react';
import Link from 'next/link';
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
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slide0Ref = useRef<HTMLDivElement>(null);
  const slide1Ref = useRef<HTMLDivElement>(null);
  const slide2Ref = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIdxRef = useRef<number>(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [largeScreen, setLargeScreen] = useState(false);
  const { reduced, paused } = useMotionPreferences();
  const pinned = largeScreen && !reduced && !paused;

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px) and (min-height: 850px) and (pointer: fine)');
    const sync = () => setLargeScreen(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  // Direct GPU-accelerated DOM transforms (zero React state overhead during scroll)
  const updateSlidesDOM = useCallback((progress: number) => {
    // progress goes 0 to 1 across the pin duration
    // Let p go from 0 to 2
    const p = Math.max(0, Math.min(2, progress * 2));

    const travel = (stageRef.current?.clientHeight ?? 600) * 0.9;

    // Cards stay partly visible behind the active preview on tall desktop screens.
    if (slide0Ref.current) {
      const y0 = p <= 1 ? p * -35 : -35 - (p - 1) * 25;
      const s0 = p <= 1 ? 1 - p * 0.05 : 0.95 - (p - 1) * 0.04;
      const o0 = p <= 1 ? 1 - p * 0.15 : Math.max(0.3, 0.85 - (p - 1) * 0.4);
      slide0Ref.current.style.transform = `translate3d(0, ${y0.toFixed(2)}px, 0) scale(${s0.toFixed(4)})`;
      slide0Ref.current.style.opacity = o0.toFixed(3);
      slide0Ref.current.style.zIndex = '10';
      slide0Ref.current.style.pointerEvents = p < 0.6 ? 'auto' : 'none';
    }

    if (slide1Ref.current) {
      const y1 = p <= 1 ? (1 - p) * travel : -(p - 1) * 30;
      const s1 = p <= 1 ? 0.96 + p * 0.04 : 1.0 - (p - 1) * 0.04;
      const o1 = p <= 1 ? 1 : 1 - (p - 1) * 0.15;
      slide1Ref.current.style.transform = `translate3d(0, ${y1.toFixed(2)}px, 0) scale(${s1.toFixed(4)})`;
      slide1Ref.current.style.opacity = o1.toFixed(3);
      slide1Ref.current.style.zIndex = '20';
      slide1Ref.current.style.pointerEvents = p >= 0.5 && p < 1.5 ? 'auto' : 'none';
    }

    if (slide2Ref.current) {
      const y2 = p <= 1 ? travel + (1 - p) * travel * 0.4 : (2 - p) * travel;
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
        end: '+=2200',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onRefresh: self => updateSlidesDOM(self.progress),
        onUpdate: (self) => {
          updateSlidesDOM(self.progress);

          const idx = Math.round(self.progress * 2);
          if (idx !== activeIdxRef.current) {
            activeIdxRef.current = idx;
            setActiveIndex(idx);
          }
        },
      });
    }, sectionRef);

    return () => {
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
    >
      <div className={styles.ambientGlow} aria-hidden="true" />

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
