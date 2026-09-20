'use client';

import { useEffect, useRef } from 'react';
import { useMotionPreferences } from './motion-preferences';

/** Original CSS pixel field: no extra canvas, animation loop or pointer interception. */
export default function SignalField() {
  const surface = useRef<HTMLDivElement>(null);
  const { reduced, paused } = useMotionPreferences();
  useEffect(() => {
    const field = surface.current;
    const host = field?.parentElement;
    if (!field || !host || reduced || paused) return;
    let frame = 0;
    let x = 0, y = 0;
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0;
      field.style.removeProperty('--signal-x');
      field.style.removeProperty('--signal-y');
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const bounds = field.getBoundingClientRect();
      x = event.clientX - bounds.left; y = event.clientY - bounds.top;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        field.style.setProperty('--signal-x', `${x}px`);
        field.style.setProperty('--signal-y', `${y}px`);
        frame = 0;
      });
    };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', reset);
    return () => { reset(); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', reset); };
  }, [paused, reduced]);
  return <div ref={surface} className="signal-field" aria-hidden="true" />;
}
