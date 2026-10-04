'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionPreferences } from '@/components/motion-preferences';
import styles from './portfolio.module.css';

type Point = { x: number; y: number };

export default function FounderPortraitReveal({
  name,
  src,
  position = '50% 25%',
}: {
  name: string;
  src: string;
  position?: string;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [revealed, setRevealed] = useState(false);
  const { reduced, paused } = useMotionPreferences();
  const imageBase = src.replace(/\.jpe?g$/i, '');

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    let frame = 0;
    const target: Point = { x: 50, y: 50 };
    const current: Point = { x: 50, y: 50 };

    const paint = () => {
      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;
      button.style.setProperty('--reveal-x', `${current.x}%`);
      button.style.setProperty('--reveal-y', `${current.y}%`);
      if (Math.abs(current.x - target.x) + Math.abs(current.y - target.y) > 0.1) {
        frame = window.requestAnimationFrame(paint);
      } else {
        frame = 0;
      }
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const rect = button.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      target.x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
      target.y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
      button.dataset.hovered = 'true';
      if (reduced || paused) {
        current.x = target.x;
        current.y = target.y;
        button.style.setProperty('--reveal-x', `${current.x}%`);
        button.style.setProperty('--reveal-y', `${current.y}%`);
      } else if (!frame) {
        frame = window.requestAnimationFrame(paint);
      }
    };

    const leave = () => { button.dataset.hovered = 'false'; };
    button.addEventListener('pointermove', move, { passive: true });
    button.addEventListener('pointerleave', leave);
    return () => {
      button.removeEventListener('pointermove', move);
      button.removeEventListener('pointerleave', leave);
      window.cancelAnimationFrame(frame);
    };
  }, [reduced, paused]);

  const portraitImage = (alt: string, priority: boolean) => <picture>
    <source
      type="image/webp"
      srcSet={`${imageBase}-384.webp 384w, ${imageBase}-768.webp 768w`}
      sizes="(max-width: 767px) 290px, 390px"
    />
    <img
      src={src}
      alt={alt}
      width={768}
      height={1024}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      style={{ objectPosition: position }}
    />
  </picture>;

  return <figure className={styles.founderPortraitFigure}>
    <div className={styles.founderPortraitOrbit} aria-hidden="true" />
    <button
      ref={buttonRef}
      className={styles.founderPortraitButton}
      type="button"
      aria-label={`${revealed ? 'Return' : 'Reveal'} ${name}'s portrait ${revealed ? 'to black and white' : 'in full colour'}`}
      aria-pressed={revealed}
      data-static={reduced || paused ? 'true' : undefined}
      onClick={() => setRevealed(value => !value)}
    >
      <span className={styles.founderPortraitBase}>{portraitImage(name, true)}</span>
      <span className={styles.founderPortraitColour} aria-hidden="true">{portraitImage('', false)}</span>
      <span className={styles.founderPortraitGrain} aria-hidden="true" />
    </button>
    <figcaption className={styles.founderPortraitCaption}>
      <span>{name} / 4TECH</span>
      <span>{revealed ? 'Tap again for monochrome' : 'Move over or tap to reveal colour'}</span>
    </figcaption>
  </figure>;
}
