'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useAnimate, useInView } from 'framer-motion';
import { useMotionPreferences } from '@/components/motion-preferences';
import styles from './portfolio.module.css';

/** Scroll motion is an enhancement; content remains visible in server HTML and without JavaScript. */
export default function PortfolioReveal({
  children,
  className = '',
  delay = 0,
  variant = 'default',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: 'default' | 'heading' | 'row';
}) {
  const [scope, animate] = useAnimate();
  const viewed = useInView(scope, { once: true, margin: '0px 0px -80px 0px' });
  const { reduced, paused } = useMotionPreferences();
  const played = useRef(false);

  useEffect(() => {
    if (!viewed || reduced || paused || played.current) return;
    played.current = true;
    const isHeading = variant === 'heading';
    const control = animate(scope.current, {
      opacity: [isHeading ? 0.22 : 0.45, 1],
      y: [isHeading ? 60 : variant === 'row' ? 30 : 42, 0],
      clipPath: ['inset(0 0 17% 0)', 'inset(0 0 0% 0)'],
      filter: ['blur(7px)', 'blur(0px)'],
    }, { duration: isHeading ? 1.05 : 0.82, delay, ease: [0.16, 1, 0.3, 1] });
    return () => { control.complete(); };
  }, [viewed, reduced, paused, variant, animate, scope, delay]);

  return <div ref={scope} className={`${styles.portfolioReveal} ${className}`}>{children}</div>;
}
