'use client';

import { useState } from 'react';
import styles from './team.module.css';

export default function MemberPortrait({
  name,
  src,
  position = '50% 25%',
  priority = false,
}: {
  name: string;
  src: string;
  position?: string;
  priority?: boolean;
}) {
  const [colour, setColour] = useState(false);
  const imageBase = src.replace(/\.jpe?g$/i, '');

  return (
    <figure className={styles.portraitFigure}>
      <button
        className={`${styles.portrait} ${colour ? styles.portraitActive : ''}`}
        type="button"
        aria-label={`Toggle ${name}'s portrait colour`}
        aria-pressed={colour}
        onClick={() => setColour((v) => !v)}
      >
        <picture>
          <source
            type="image/webp"
            srcSet={`${imageBase}-384.webp 384w, ${imageBase}-768.webp 768w`}
            sizes="(max-width: 767px) 300px, 400px"
          />
          <img
            src={src}
            alt={name}
            width={768}
            height={1024}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
            style={{ objectPosition: position }}
          />
        </picture>
      </button>
      <figcaption>Hover, focus or tap to reveal colour</figcaption>
    </figure>
  );
}
