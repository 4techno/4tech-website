'use client';
import { useEffect } from 'react';

/** A restrained light response; the service panels never rotate or move. */
export default function TiltPanels({ containerId }: { containerId: string }) {
  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;
    const media = matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)');
    const cleanups = Array.from(root.querySelectorAll<HTMLElement>('[data-service-panel]')).map(card => {
      const move = (event: PointerEvent) => {
        if (media.matches) return;
        const box = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', `${(event.clientX - box.left) / box.width * 100}%`);
        card.style.setProperty('--pointer-y', `${(event.clientY - box.top) / box.height * 100}%`);
      };
      const reset = () => {
        card.style.removeProperty('--pointer-x');
        card.style.removeProperty('--pointer-y');
      };
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', reset);
      media.addEventListener('change', reset);
      return () => {
        card.removeEventListener('pointermove', move);
        card.removeEventListener('pointerleave', reset);
        media.removeEventListener('change', reset);
      };
    });
    return () => cleanups.forEach(cleanup => cleanup());
  }, [containerId]);
  return null;
}
