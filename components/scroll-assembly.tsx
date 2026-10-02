'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { animate, createScope, onScroll } from 'animejs';
import { useMotionPreferences } from './motion-preferences';

/** Scroll progress drives the assembly; the page retains native scrolling. */
export default function ScrollAssembly({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const { paused, reduced } = useMotionPreferences();
  useEffect(() => {
    if (!root.current || paused || reduced) return;
    const scope = createScope({ root }).add(() => {
      animate('.work-schematic', {
        '--scroll-turn': ['0deg', '95deg'],
        autoplay: onScroll({ target: root.current!, enter: 'bottom bottom', leave: 'top top', sync: true }),
        ease: 'linear',
      });
    });
    return () => scope.revert();
  }, [paused, reduced]);
  return <div className="scroll-assembly" ref={root}>{children}</div>;
}
