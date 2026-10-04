'use client';

import { useEffect, useMemo, useRef } from 'react';

/** Visual variable-font response; the heading exposes one clean accessible name. */
export default function TextPressure({ text = '4TECH' }: { text?: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const characters = useMemo(() => [...text], [text]);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    if (motion.matches || !finePointer.matches) return;

    const letters = [...title.querySelectorAll<HTMLElement>('[data-pressure-letter]')];
    let frame = 0;
    let x = -1;
    let y = -1;

    const apply = () => {
      frame = 0;
      const bounds = title.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      const radius = Math.max(210, bounds.width * 0.44);
      for (const letter of letters) {
        const rect = letter.getBoundingClientRect();
        const distance = Math.hypot(rect.left + rect.width / 2 - x, rect.top + rect.height / 2 - y);
        const influence = Math.max(0, 1 - distance / radius);
        const weight = Math.round(150 + 650 * influence);
        const width = Math.round(55 + 70 * influence);
        letter.style.fontVariationSettings = `'wght' ${weight}, 'wdth' ${width}`;
      }
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      for (const letter of letters) letter.style.fontVariationSettings = "'wght' 150, 'wdth' 55";
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [text]);

  return (
    <h1 ref={titleRef} className="text-pressure-title jm-pressure-title" aria-label={text}>
      {characters.map((character, index) => (
        <span key={`${character}-${index}`} data-pressure-letter aria-hidden="true" style={{ fontVariationSettings: "'wght' 150, 'wdth' 55" }}>
          {character}
        </span>
      ))}
    </h1>
  );
}
