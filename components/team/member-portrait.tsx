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

  return (
    <figure className={styles.portraitFigure}>
      <button
        className={`${styles.portrait} ${colour ? styles.portraitActive : ''}`}
        type="button"
        aria-label={`Toggle ${name}'s portrait colour`}
        aria-pressed={colour}
        onClick={() => setColour((v) => !v)}
      >
        <img
          src={src}
          alt={name}
          width={960}
          height={1280}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={{ objectPosition: position }}
        />
      </button>
      <figcaption>Hover or tap to reveal colour</figcaption>
    </figure>
  );
}
