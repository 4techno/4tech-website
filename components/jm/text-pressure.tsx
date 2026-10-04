'use client';

import { useEffect, useMemo, useRef } from 'react';

/** Visual variable-font response; reactive to mouse cursor on desktop and touch on mobile. */
export default function TextPressure({ text = '4TECH' }: { text?: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const characters = useMemo(() => [...text], [text]);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;

    const letters = [...title.querySelectorAll<HTMLElement>('[data-pressure-letter]')];
    let frame = 0;
    let x = -1;
    let y = -1;
    let active = false;

    const apply = () => {
      frame = 0;
      const bounds = title.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      const radius = Math.max(180, bounds.width * 0.45);

      for (const letter of letters) {
        if (!active || x < 0 || y < 0) {
          letter.style.fontVariationSettings = "'wght' 150, 'wdth' 55";
          continue;
        }
        const rect = letter.getBoundingClientRect();
        const distance = Math.hypot(rect.left + rect.width / 2 - x, rect.top + rect.height / 2 - y);
        const influence = Math.max(0, 1 - distance / radius);
        // Exponential ease for organic typographic responsiveness
        const eased = Math.pow(influence, 1.35);
        const weight = Math.round(150 + 650 * eased);
        const width = Math.round(55 + 70 * eased);
        letter.style.fontVariationSettings = `'wght' ${weight}, 'wdth' ${width}`;
      }
    };

    const updateCoords = (clientX: number, clientY: number) => {
      x = clientX;
      y = clientY;
      active = true;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const reset = () => {
      active = false;
      x = -1;
      y = -1;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    // Pointer events (Desktop mouse, stylus, and touch on pointer-supporting browsers)
    const onPointerMove = (event: PointerEvent) => {
      updateCoords(event.clientX, event.clientY);
    };

    const onPointerDown = (event: PointerEvent) => {
      updateCoords(event.clientX, event.clientY);
    };

    // Mobile touch events for instant touch reactivity
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        updateCoords(event.touches[0].clientX, event.touches[0].clientY);
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        updateCoords(event.touches[0].clientX, event.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      setTimeout(reset, 250);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('pointerleave', reset);

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', reset, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointerleave', reset);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', reset);
    };
  }, [text]);

  return (
    <h1 ref={titleRef} className="text-pressure-title jm-pressure-title" aria-label={text}>
      {characters.map((character, index) => (
        <span
          key={`${character}-${index}`}
          data-pressure-letter
          aria-hidden="true"
          style={{
            fontVariationSettings: "'wght' 150, 'wdth' 55",
            transition: 'font-variation-settings 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {character}
        </span>
      ))}
    </h1>
  );
}
