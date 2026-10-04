'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './studio-tools.module.css';

export default function StudioToolsSuite() {
  const [activeSheet, setActiveSheet] = useState<'deploy' | 'devtools'>('deploy');
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="tools" className={styles.section} aria-label="4TECH Engineering Platform & Tools">
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.shell}>
        <div className={styles.stage}>
          {/* =========================================================================
              SHEET 1 (BACK / CRIMSON): DEVTOOLS & PROBE STUDIO
              ========================================================================= */}
          <motion.div
            className={`${styles.sheet} ${styles.devtoolsSheet}`}
            data-focused={activeSheet === 'devtools'}
            onClick={() => setActiveSheet('devtools')}
            animate={
              shouldReduceMotion
                ? {}
                : activeSheet === 'devtools'
                ? {
                    y: -35,
                    scale: 1.02,
                    zIndex: 25,
                    rotateX: 0,
                  }
                : {
                    y: 0,
                    scale: 0.98,
                    zIndex: 5,
                    rotateX: 2.5,
                  }
            }
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            role="region"
            aria-label="4TECH PROBE Studio Devtools"
          >
            <div className={styles.sheetHeader}>
              <h2 className={styles.sheetTitle}>PROBE Devtools</h2>
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
          </motion.div>

          {/* =========================================================================
              SHEET 2 (FRONT / TITANIUM): DEPLOY, MAU! & FLEET TELEMETRY
              ========================================================================= */}
          <motion.div
            className={`${styles.sheet} ${styles.deploySheet}`}
            data-focused={activeSheet === 'deploy'}
            onClick={() => setActiveSheet('deploy')}
            animate={
              shouldReduceMotion
                ? {}
                : activeSheet === 'deploy'
                ? {
                    y: 0,
                    scale: 1,
                    zIndex: 20,
                    rotateX: 0,
                  }
                : {
                    y: 40,
                    scale: 0.97,
                    zIndex: 8,
                    rotateX: 3,
                  }
            }
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            role="region"
            aria-label="Deploy and Fleet Telemetry Platform"
          >
            {/* Circular Floating Badge (Exact match to NestJS reference photo) */}
            <Link
              href="/account"
              className={styles.circleBadge}
              onClick={(e) => e.stopPropagation()}
            >
              Check it out
            </Link>

            <div className={styles.sheetHeader}>
              <h2 className={styles.sheetTitle}>Deploy, hardware!</h2>
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
                  <span className={styles.deployNavItemActive} style={{ marginTop: 8 }}>
                    DASHBOARD
                  </span>
                  <span className={styles.deployNavItem}>DEPLOYMENTS</span>
                  <span className={styles.deployNavItem}>LOGS</span>
                  <span className={styles.deployNavItem}>TRAFFIC</span>
                  <span className={styles.deployNavItem}>DOMAINS</span>
                  <span className={styles.deployNavItem}>API KEYS</span>
                  <span className={styles.deployNavItem}>SETTINGS</span>
                </div>

                {/* Chart 1: CPU Utilisation (Dual peaks, Cyan line + Red filled glow) */}
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
                      <linearGradient id="redGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ff4d61" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#ff4d61" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="cyanLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>

                    {/* Background Grid Lines */}
                    <line x1="0" y1="20" x2="340" y2="20" stroke="rgba(255,255,255,0.06)" />
                    <line x1="0" y1="55" x2="340" y2="55" stroke="rgba(255,255,255,0.06)" />
                    <line x1="0" y1="90" x2="340" y2="90" stroke="rgba(255,255,255,0.06)" />

                    {/* Red Area Wave Fill */}
                    <path
                      d="M0,120 Q40,115 65,70 Q80,20 100,20 Q120,20 135,80 Q155,115 185,115 Q210,115 235,50 Q255,10 270,10 Q285,10 305,90 Q325,120 340,120 L340,130 L0,130 Z"
                      fill="url(#redGlow)"
                    />
                    {/* Red Wave Stroke */}
                    <path
                      d="M0,120 Q40,115 65,70 Q80,20 100,20 Q120,20 135,80 Q155,115 185,115 Q210,115 235,50 Q255,10 270,10 Q285,10 305,90 Q325,120 340,120"
                      fill="none"
                      stroke="#ff4d61"
                      strokeWidth="2"
                    />

                    {/* Cyan Base Flow Line */}
                    <path
                      d="M0,110 Q50,112 100,95 Q150,85 200,105 Q250,92 300,98 L340,102"
                      fill="none"
                      stroke="url(#cyanLine)"
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

                {/* Chart 2: Response Time (Multi-wave peak) */}
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
                      <linearGradient id="roseGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line x1="0" y1="20" x2="340" y2="20" stroke="rgba(255,255,255,0.06)" />
                    <line x1="0" y1="55" x2="340" y2="55" stroke="rgba(255,255,255,0.06)" />
                    <line x1="0" y1="90" x2="340" y2="90" stroke="rgba(255,255,255,0.06)" />

                    {/* Rose Wave */}
                    <path
                      d="M0,120 Q70,118 120,95 Q150,80 180,110 Q210,120 240,85 Q265,15 285,15 Q305,15 320,105 L340,115 L340,130 L0,130 Z"
                      fill="url(#roseGlow)"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
