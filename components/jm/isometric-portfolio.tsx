'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { projects } from '@/lib/projects';
import { getProjectMedia, representativeImageNotice } from '@/lib/project-media';
import { useMotionPreferences } from '@/components/motion-preferences';
import styles from './isometric-portfolio.module.css';

const archive = ['antenna', 'robot-arm', 'drone', 'power', 'rf-direction-finder', 'rescue', 'wind-tunnel', 'ar-hud']
  .map(id => projects.find(project => project.id === id)!)
  .filter(Boolean);

/** A keyboard- and touch-accessible perspective archive using the real project catalogue. */
export default function IsometricPortfolio() {
  const [active, setActive] = useState(0);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);
  const { reduced, paused } = useMotionPreferences();
  const staticMotion = reduced || paused;
  const current = archive[active];
  const select = (index: number) => setActive(Math.max(0, Math.min(archive.length - 1, index)));

  return <section id="projects" className={styles.section} aria-labelledby="archive-title">
    <div className={styles.header}>
      <div><p className="jm-kicker">[ PROJECT ARCHIVE / 4TECH ]</p><h2 id="archive-title">Built to explore.</h2></div>
      <span className={styles.count}>{String(active + 1).padStart(2, '0')} / {String(archive.length).padStart(2, '0')}</span>
    </div>
    <div className={styles.stage} aria-label="Engineering project gallery"
      onPointerDown={event => { drag.current = { x: event.clientX, y: event.clientY }; moved.current = false; }}
      onPointerMove={event => { if (drag.current && Math.abs(event.clientX - drag.current.x) > 12) moved.current = true; }}
      onPointerCancel={() => { drag.current = null; }}
      onPointerUp={event => {
        const start = drag.current;
        drag.current = null;
        if (!start) return;
        const dx = event.clientX - start.x;
        if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(event.clientY - start.y)) select(active + (dx < 0 ? 1 : -1));
      }}
      onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          select(active + (event.key === 'ArrowRight' ? 1 : -1));
        }
      }}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.track} style={{ transform: `translateX(calc(50% - 90px - ${active * 180}px))`, transitionDuration: staticMotion ? '0s' : undefined }}>
        {archive.map((project, index) => {
          const media = getProjectMedia(project.id)!;
          const selected = index === active;
          return <div className={styles.item} key={project.id}>
            <motion.button type="button" className={styles.card} aria-label={`Select ${project.name}`} aria-pressed={selected}
              onFocus={() => select(index)}
              onClick={() => { if (!moved.current) select(index); }}
              animate={{ rotateY: staticMotion ? 0 : selected ? -18 : -28, rotateX: staticMotion ? 0 : 12, y: selected ? -16 : 0, scale: selected ? 1.05 : .94 }}
              transition={{ duration: staticMotion ? 0 : .65, ease: [.16, 1, .3, 1] }}>
              <img src={media.src} alt={media.alt} width="300" height="410" loading="lazy" draggable={false} style={{ objectPosition: media.position }} />
              <span className={styles.sheen} aria-hidden="true" />
              <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
            </motion.button>
            <span className={styles.guide} aria-hidden="true" />
            <span className={styles.cardTitle}>{project.name}</span>
          </div>;
        })}
      </div>
    </div>
    <div className={styles.footer}>
      <div className={styles.controls} aria-label="Project gallery controls">
        <button type="button" disabled={active === 0} onClick={() => select(active - 1)} aria-label="Previous project">←</button>
        <div className={styles.ruler}>{archive.map((project, index) => <button key={project.id} type="button" aria-label={`Show project ${index + 1}: ${project.name}`} aria-pressed={active === index} onClick={() => select(index)}><span /></button>)}</div>
        <button type="button" disabled={active === archive.length - 1} onClick={() => select(active + 1)} aria-label="Next project">→</button>
      </div>
      <div className={styles.detail}>
        <div aria-live="polite"><p className="jm-kicker">{current.category}</p><h3>{current.name}</h3><p>{current.short}</p></div>
        <div className={styles.actions}><Link href={`/projects/${current.id}`} className="jm-action-primary">View project →</Link><a href={`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(`${current.name} engineering`)}`} target="_blank" rel="noopener noreferrer">Explore visual references</a></div>
      </div>
      <p className={styles.notice}>{representativeImageNotice} Photograph credits are available in each project.</p>
    </div>
  </section>;
}
