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
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);
  const { reduced, paused } = useMotionPreferences();
  const staticMotion = reduced || paused;
  const current = archive[active] || archive[0];

  const select = useCallback((index: number) => {
    setActive(Math.max(0, Math.min(archive.length - 1, index)));
  }, []);

  // Pinned Horizontal Scroll with GSAP ScrollTrigger:
  // Pins the section while scrolling vertically, sliding cards horizontally sideways from 01 to 08,
  // and only then allows the page to continue scrolling down.
  useEffect(() => {
    if (staticMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${archive.length * 360}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.35,
        onUpdate: (self) => {
          const idx = Math.min(archive.length - 1, Math.floor(self.progress * archive.length));
          setActive(idx);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [staticMotion]);

  // Fallback direct Mouse Roller / Wheel sliding support
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let wheelCooldown = false;
    let accumulatedDelta = 0;

    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 3) return;

      const goingNext = delta > 0;
      const goingPrev = delta < 0;

      if ((goingNext && active < archive.length - 1) || (goingPrev && active > 0)) {
        accumulatedDelta += delta;

        if (!wheelCooldown && Math.abs(accumulatedDelta) >= 14) {
          wheelCooldown = true;
          if (accumulatedDelta > 0) {
            select(active + 1);
          } else {
            select(active - 1);
          }
          accumulatedDelta = 0;
          setTimeout(() => {
            wheelCooldown = false;
          }, 180);
        }
      }
    };

    stage.addEventListener('wheel', onWheel, { passive: true });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [active, select]);

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
        aria-label="Engineering project gallery - scroll with mouse roller or drag"
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
            transform: `translateX(calc(50vw - 97px - ${active * 195}px))`,
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
                    rotateY: staticMotion ? 0 : selected ? -20 : -26,
                    rotateX: staticMotion ? 0 : 12,
                    skewY: staticMotion ? 0 : -8,
                    y: selected ? -14 : 0,
                    scale: selected ? 1.06 : 0.94,
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
