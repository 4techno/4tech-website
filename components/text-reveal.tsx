'use client';

import { useEffect, useRef } from 'react';
import { stagger, useAnimate, useInView } from 'framer-motion';
import { useMotionPreferences } from './motion-preferences';

/** Words remain readable in the server HTML; motion progressively enhances them. */
export default function TextReveal({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { once: true, margin: '0px 0px -20px 0px' });
  const played = useRef(false);
  const { paused, reduced } = useMotionPreferences();
  useEffect(() => {
    if (!inView || reduced || paused || played.current) return;
    played.current = true;
    const controls = animate('.word-ink', { y: ['104%', '0%'], opacity: [.2, 1], filter: ['blur(5px)', 'blur(0px)'] }, { duration: .9, delay: stagger(.085, { startDelay: delay }), ease: [.16, 1, .3, 1] });
    return () => controls.complete();
  }, [inView, reduced, paused, animate, delay]);
  return <span ref={scope} className={`text-reveal ${className}`}>{text.split(' ').map((word, index) => <span key={`${word}-${index}`}><span className="word-mask"><span className="word-ink">{word}</span></span>{index < text.split(' ').length - 1 ? ' ' : ''}</span>)}</span>;
}
