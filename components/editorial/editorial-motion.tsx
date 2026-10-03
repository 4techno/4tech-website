'use client';

import { useEffect } from 'react';

/** Keeps the homepage content server-rendered while isolating pointer and reveal motion. */
export default function EditorialMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const section = document.getElementById('home');
    const animations: Animation[] = [];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (!reduceMotion.matches) {
          const element = entry.target as HTMLElement;
          animations.push(element.animate(
            [{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'translateY(0)' }],
            {
              duration: 650,
              delay: Number(element.dataset.delay || 0),
              easing: 'cubic-bezier(.4,0,.2,1)',
              fill: 'backwards',
            },
          ));
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });

    document.querySelectorAll('.ed-editorial-home .ed-reveal').forEach((element) => observer.observe(element));

    const move = (event: PointerEvent) => {
      if (!section || reduceMotion.matches || event.pointerType !== 'mouse') return;
      const bounds = section.getBoundingClientRect();
      section.style.setProperty('--reach-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 12}px`);
      section.style.setProperty('--reach-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 7}px`);
    };
    const reset = () => {
      section?.style.setProperty('--reach-x', '0px');
      section?.style.setProperty('--reach-y', '0px');
    };

    section?.addEventListener('pointermove', move, { passive: true });
    section?.addEventListener('pointerleave', reset);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      section?.removeEventListener('pointermove', move);
      section?.removeEventListener('pointerleave', reset);
    };
  }, []);

  return null;
}
