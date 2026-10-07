'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './fanned-capabilities.module.css';

interface CapabilityCard {
  id: string;
  tag: string;
  title: string;
  lead: string;
  glowColor: string;
  borderAccent: string;
  spec1: string;
  spec2: string;
  rotation: number;
  xOffset: number;
  yOffset: number;
  icon: React.ReactNode;
}

const CAPABILITIES: CapabilityCard[] = [
  {
    id: 'embedded',
    tag: '[ 01 / EMBEDDED ]',
    title: 'Embedded Systems',
    lead: 'Microcontrollers, sensing and firmware shaped into testable hardware.',
    glowColor: 'radial-gradient(circle at 50% 0%, rgba(211, 47, 47, 0.75) 0%, rgba(160, 42, 34, 0.45) 40%, transparent 80%)',
    borderAccent: '#C5221F',
    spec1: 'ESP32 / STM32 / RTOS',
    spec2: 'KiCad Multilayer PCB',
    rotation: -14,
    xOffset: -330,
    yOffset: 30,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
      </svg>
    ),
  },
  {
    id: 'robotics',
    tag: '[ 02 / ROBOTICS ]',
    title: 'Robotics & Kinematics',
    lead: 'Mechanical assemblies, kinematics and interfaces for coordinated motion.',
    glowColor: 'radial-gradient(circle at 50% 0%, rgba(225, 29, 72, 0.7) 0%, rgba(159, 18, 57, 0.4) 40%, transparent 80%)',
    borderAccent: '#e11d48',
    spec1: '6-DOF Actuation & Motors',
    spec2: 'Closed-Loop Joint Feedback',
    rotation: -8.5,
    xOffset: -200,
    yOffset: 12,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="m4.93 4.93 2.83 2.83" />
        <path d="m16.24 16.24 2.83 2.83" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <path d="m4.93 19.07 2.83-2.83" />
        <path d="m16.24 7.76 2.83-2.83" />
      </svg>
    ),
  },
  {
    id: 'rf',
    tag: '[ 03 / RF & EM ]',
    title: 'RF & Instrumentation',
    lead: 'Acquisition workflows and measurement concepts for radio-frequency systems.',
    glowColor: 'radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.7) 0%, rgba(13, 148, 136, 0.4) 40%, transparent 80%)',
    borderAccent: '#14b8a6',
    spec1: 'VNA & Impedance Tuning',
    spec2: 'Resonant Inductive Coupling',
    rotation: -2.5,
    xOffset: -65,
    yOffset: 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
        <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="20" y1="12" x2="22" y2="12" />
        <line x1="2" y1="12" x2="4" y2="12" />
      </svg>
    ),
  },
  {
    id: 'connected',
    tag: '[ 04 / IOT ]',
    title: 'Connected Systems',
    lead: 'Device readings, connectivity and system state brought into a clear interface.',
    glowColor: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.7) 0%, rgba(109, 40, 217, 0.4) 40%, transparent 80%)',
    borderAccent: '#8b5cf6',
    spec1: 'LoRa / BLE / MQTT Bridge',
    spec2: 'Real-Time Edge Telemetry',
    rotation: 3,
    xOffset: 70,
    yOffset: 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
        <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
        <circle cx="12" cy="12" r="2" />
        <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
        <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
      </svg>
    ),
  },
  {
    id: 'simulation',
    tag: '[ 05 / SIMULATION ]',
    title: 'Research & Simulation',
    lead: 'Scope a technical question, explore models and define practical checks.',
    glowColor: 'radial-gradient(circle at 50% 0%, rgba(244, 63, 94, 0.7) 0%, rgba(190, 24, 93, 0.4) 40%, transparent 80%)',
    borderAccent: '#f43f5e',
    spec1: 'SPICE & Finite Elements',
    spec2: 'Hardware-In-The-Loop',
    rotation: 9,
    xOffset: 205,
    yOffset: 12,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 'training',
    tag: '[ 06 / WORKSHOPS ]',
    title: 'Practical Training',
    lead: 'Guided projects in electronics, control, automation and computation.',
    glowColor: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.7) 0%, rgba(5, 150, 105, 0.4) 40%, transparent 80%)',
    borderAccent: '#10b981',
    spec1: 'Lab Hardware Modules',
    spec2: 'Hands-On Mentorship',
    rotation: 14.5,
    xOffset: 335,
    yOffset: 30,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
];

export default function FannedCapabilities() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeMobileIdx, setActiveMobileIdx] = useState<number>(1);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 899px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const hoveredIdx = hoveredId !== null ? CAPABILITIES.findIndex(c => c.id === hoveredId) : -1;

  const nextMobile = () => {
    setActiveMobileIdx(prev => (prev + 1) % CAPABILITIES.length);
  };
  const prevMobile = () => {
    setActiveMobileIdx(prev => (prev - 1 + CAPABILITIES.length) % CAPABILITIES.length);
  };

  return (
    <section id="services" className={styles.section} aria-label="4TECH Engineering Capabilities">
      <span id="capabilities" className="jm-anchor" aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.shell}>
        {/* =========================================================================
            TOP: FANNED 3D CARDS DECK (EXACTLY LIKE NESTJS.COM ON DESKTOP & MOBILE)
            ========================================================================= */}
        <div className={styles.deckWrapper}>
          <div className={styles.cardsTrack}>
            {CAPABILITIES.map((card, index) => {
              const isHovered = hoveredIdx === index;
              const isCenterMobile = activeMobileIdx === index;

              // Desktop positioning: parting the sea when a card is hovered
              let desktopX = card.xOffset;
              let desktopY = card.yOffset;
              let desktopRotate = card.rotation;
              let desktopScale = 1;
              let desktopZ = index + 1;

              if (hoveredIdx !== -1) {
                if (index === hoveredIdx) {
                  desktopX = card.xOffset;
                  desktopY = -38;
                  desktopRotate = 0;
                  desktopScale = 1.09;
                  desktopZ = 50;
                } else if (index < hoveredIdx) {
                  desktopX = card.xOffset - 145;
                  desktopRotate = card.rotation - 3;
                  desktopScale = 0.98;
                } else {
                  desktopX = card.xOffset + 145;
                  desktopRotate = card.rotation + 3;
                  desktopScale = 0.98;
                }
              }

              // Mobile positioning: curved radial arc matching user reference image
              const m = index - activeMobileIdx;
              const mobileX = m * 140;
              const mobileY = Math.abs(m) * 20;
              const mobileRotate = m * 8.5;
              const mobileScale = m === 0 ? 1.04 : 0.92;
              const mobileZ = 30 - Math.abs(m);
              const mobileOpacity = Math.abs(m) > 2 ? 0.25 : 1;

              return (
                <motion.div
                  key={card.id}
                  className={styles.card}
                  data-active={isMobile ? isCenterMobile : isHovered}
                  style={{
                    zIndex: isMobile ? mobileZ : desktopZ,
                  }}
                  animate={
                    shouldReduceMotion
                      ? {}
                      : isMobile
                      ? {
                          x: mobileX,
                          y: mobileY,
                          rotate: mobileRotate,
                          scale: mobileScale,
                          opacity: mobileOpacity,
                          boxShadow:
                            isCenterMobile
                              ? `0 22px 50px rgba(0, 0, 0, 0.75), 0 0 25px ${card.borderAccent}55`
                              : '0 12px 30px rgba(0, 0, 0, 0.5)',
                        }
                      : {
                          x: desktopX,
                          y: desktopY,
                          rotate: desktopRotate,
                          scale: desktopScale,
                          opacity: 1,
                          boxShadow:
                            isHovered
                              ? `0 28px 65px rgba(0, 0, 0, 0.85), 0 0 32px ${card.borderAccent}66`
                              : '0 16px 40px rgba(0, 0, 0, 0.55)',
                        }
                  }
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                  onClick={() => {
                    if (isMobile) setActiveMobileIdx(index);
                  }}
                  onMouseEnter={() => !isMobile && setHoveredId(card.id)}
                  onMouseLeave={() => !isMobile && setHoveredId(null)}
                  tabIndex={0}
                  onFocus={() => setHoveredId(card.id)}
                  onBlur={() => setHoveredId(null)}
                  role="article"
                  aria-label={`${card.title}: ${card.lead}`}
                >
                  {/* Top Glowing Mesh Gradient */}
                  <div
                    className={styles.cardGlow}
                    style={{ background: card.glowColor }}
                    aria-hidden="true"
                  />

                  {/* Card Header */}
                  <div className={styles.cardTop}>
                    <span className={styles.cardTag}>{card.tag}</span>
                    <span className={styles.cardIcon} style={{ color: card.borderAccent }}>
                      {card.icon}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardLead}>{card.lead}</p>
                  </div>

                  {/* Card Bottom Specs (NestJS style: ▶ 20 lessons /  2 hours) */}
                  <div className={styles.cardSpecs}>
                    <div className={styles.specRow}>
                      <span aria-hidden="true">▶</span>
                      <span>{card.spec1}</span>
                    </div>
                    <div className={styles.specRow}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      <span>{card.spec2}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile arc navigation indicators */}
          <div className={styles.mobileNavRow}>
              <button
                type="button"
                onClick={prevMobile}
                className={styles.mobileNavBtn}
                aria-label="Previous capability"
              >
                ←
              </button>
              <div className={styles.mobileDots}>
                {CAPABILITIES.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveMobileIdx(i)}
                    className={`${styles.mobileDot} ${i === activeMobileIdx ? styles.mobileDotActive : ''}`}
                    aria-label={`Select ${c.title}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={nextMobile}
                className={styles.mobileNavBtn}
                aria-label="Next capability"
              >
                →
              </button>
            </div>
        </div>

        {/* =========================================================================
            BOTTOM: HEADLINE & ACTIONS (NEST.JS STYLE: { COURSES } _ / TITLE)
            ========================================================================= */}
        <div className={styles.contentSection}>
          <p className={styles.monoKicker}>
            {'{ '}
            <span>CAPABILITIES</span>
            {' } '}
            <span className={styles.cursor}>_</span>
          </p>

          <h2 className={styles.headline}>
            Ideas need more<br />
            <em>than a spark.</em>
          </h2>

          <p className={styles.description}>
            Hardware, software and mechanical design meet at the point where an idea becomes a testable, reliable system you can physically validate and scale.
          </p>

          <div className={styles.actions}>
            <Link href="/account" className={styles.primaryCta}>
              Discuss a project <span aria-hidden="true">→</span>
            </Link>
            <Link href="/projects" className={styles.secondaryCta}>
              Explore engineering works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
