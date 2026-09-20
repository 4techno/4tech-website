'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { useAnimate, useInView } from 'framer-motion';
import { useMotionPreferences } from './motion-preferences';

/** Content stays visible in server HTML and without JavaScript. Motion is progressive enhancement. */
export default function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [scope, animate] = useAnimate();
  const viewed = useInView(scope, { once: true, margin: '0px 0px -40px 0px' });
  const { reduced, paused } = useMotionPreferences();
  const played = useRef(false);
  useEffect(() => {
    if (!viewed || reduced || paused || played.current) return;
    played.current = true;
    const control = animate(scope.current, { opacity: [0, 1], y: [24, 0], filter: ['blur(6px)', 'blur(0px)'] }, { duration: .8, delay, ease: [.22, 1, .36, 1] });
    return () => { control.complete(); };
  }, [viewed, reduced, paused, animate, scope, delay]);
  return <div ref={scope} className={className}>{children}</div>;
}
