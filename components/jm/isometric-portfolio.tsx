'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/lib/projects';
import { getProjectMedia, representativeImageNotice } from '@/lib/project-media';
import { useMotionPreferences } from '@/components/motion-preferences';
import styles from './isometric-portfolio.module.css';

gsap.registerPlugin(ScrollTrigger);

const archive = ['antenna', 'drone', 'robot-arm', 'power', 'sewersense', 'rescue', 'wind-tunnel', 'ar-hud']
  .map(id => projects.find(project => project.id === id)!)
  .filter(Boolean);

/**
 * 3D Isometric Viewfinder Portfolio Component
 * - Pinned horizontal scrolling: page locks and scrolls sideways through all projects before continuing down
 * - Top center indicator
 * - Top right count (01 / 08)
 * - Parallel 3D perspective slanted cards
 * - Active card glowing coral/red outline
 */
export default function IsometricPortfolio() {
  const [active, setActive] = useState(0); // Starts at Card 01
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<ScrollTrigger | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);
  const { reduced, paused } = useMotionPreferences();
  const staticMotion = reduced || paused;
  const current = archive[active] || archive[0];

  const select = useCallback((index: number) => {
    const next = Math.max(0, Math.min(archive.length - 1, index));
    const pin = pinRef.current;
    // User selection and scrolling share one position, so the next wheel event
    // cannot undo a card selected with a keyboard, button or swipe.
    if (pin) {
      window.scrollTo({
        top: pin.start + ((next + 0.5) / archive.length) * (pin.end - pin.start),
        behavior: 'instant',
      });
      ScrollTrigger.update();
    }
    setActive(next);
  }, []);

  // Pinned Horizontal Scroll with GSAP ScrollTrigger:
  // Pins the section while scrolling vertically, sliding cards horizontally sideways from 01 to 08,
  // and only then allows the page to continue scrolling down.
  useEffect(() => {
    if (staticMotion || !sectionRef.current) return;

    const media = gsap.matchMedia();
    media.add('(min-width: 1024px) and (min-height: 1000px) and (pointer: fine)', () => {
      const pin = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 88px',
        end: () => `+=${archive.length * 360}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.min(archive.length - 1, Math.floor(self.progress * archive.length));
          setActive((prev) => (prev === idx ? prev : idx));
        },
      });
      pinRef.current = pin;
      return () => { pinRef.current = null; pin.kill(); };
    });

    return () => media.revert();
  }, [staticMotion]);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <section id="projects" ref={sectionRef} className={styles.section} aria-labelledby="archive-title">
      {/* Top Center White Bar Indicator matching reference photo */}
      <div className={styles.topIndicator} aria-hidden="true" />

      {/* Header with Title and Count */}
      <div className={styles.header}>
        <div>
          <p className="jm-kicker">[ PROJECT ARCHIVE / 4TECH ]</p>
          <h2 id="archive-title">Built to explore.</h2>
        </div>
        <span className={styles.count}>
          {String(active + 1).padStart(2, '0')} / {String(archive.length).padStart(2, '0')}
        </span>
      </div>

      {/* 3D Slanted Card Stage with Mouse Roller & Touch Dragging */}
      <div
        ref={stageRef}
        className={styles.stage}
        role="group"
        aria-label="Engineering project gallery. Use arrow keys, swipe, or the previous and next buttons."
        onPointerDown={event => {
          drag.current = { x: event.clientX, y: event.clientY };
          moved.current = false;
        }}
        onPointerMove={event => {
          if (drag.current && Math.abs(event.clientX - drag.current.x) > 10) {
            moved.current = true;
          }
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onPointerUp={event => {
          const start = drag.current;
          drag.current = null;
          if (!start) return;
          const dx = event.clientX - start.x;
          if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(event.clientY - start.y)) {
            select(active + (dx < 0 ? 1 : -1));
          }
        }}
        onKeyDown={event => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            select(active + (event.key === 'ArrowRight' ? 1 : -1));
          }
        }}
        tabIndex={0}
      >
        <div className={styles.glow} aria-hidden="true" />

        {/* Slanted Card Track */}
        <div
          className={styles.track}
          style={{
            transform: `translateX(calc(50% - (var(--item-width, 195px) / 2) - (${active} * var(--item-width, 195px))))`,
            transitionDuration: staticMotion ? '0s' : undefined,
          }}
        >
          {archive.map((project, index) => {
            const media = getProjectMedia(project.id)!;
            const selected = index === active;
            return (
              <div className={styles.item} key={project.id}>
                {/* 3D Slanted Perspective Card */}
                <motion.button
                  type="button"
                  className={styles.card}
                  aria-label={`Select ${project.name}`}
                  aria-pressed={selected}
                  onFocus={() => select(index)}
                  onClick={() => {
                    if (!moved.current) select(index);
                  }}
                  animate={{
                    rotateY: staticMotion || isMobile ? 0 : selected ? -20 : -26,
                    rotateX: staticMotion || isMobile ? 0 : 12,
                    skewY: staticMotion || isMobile ? 0 : -8,
                    y: selected ? (isMobile ? -4 : -14) : 0,
                    scale: isMobile ? (selected ? 1.02 : 0.94) : (selected ? 1.06 : 0.94),
                  }}
                  transition={{ duration: staticMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
                >
                  <img
                    src={media.src}
                    alt={media.alt}
                    width="300"
                    height="410"
                    loading="lazy"
                    draggable={false}
                    style={{ objectPosition: media.position }}
                  />
                  <span className={styles.sheen} aria-hidden="true" />
                  {/* Top-left index badge (06, 07, 08) */}
                  <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
                </motion.button>

                {/* Vertical Dashed Guide Line */}
                <span className={styles.guide} aria-hidden="true" />

                {/* Project Title */}
                <span className={styles.cardTitle}>{project.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Project Technical Detail Summary */}
      <div className={styles.footer}>
        <div className={styles.controls} aria-label="Project gallery controls">
          <button type="button" disabled={active === 0} onClick={() => select(active - 1)} aria-label="Previous project">← Previous</button>
          <Link href="/projects#case-studies">Explore all works &amp; case studies →</Link>
          <button type="button" disabled={active === archive.length - 1} onClick={() => select(active + 1)} aria-label="Next project">Next →</button>
        </div>
        <div className={styles.detail}>
          <div aria-live="polite">
            <p className="jm-kicker">{current.category}</p>
            <h3>{current.name}</h3>
            <p>{current.short}</p>
          </div>
          <div className={styles.actions}>
            <Link href={`/projects/${current.id}`} className="jm-action-primary">
              View project →
            </Link>
            <a
              href={`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(`${current.name} engineering`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore visual references
            </a>
          </div>
        </div>

        <p className={styles.notice}>
          {representativeImageNotice} Photograph credits are available in each project.
        </p>
      </div>
    </section>
  );
}
