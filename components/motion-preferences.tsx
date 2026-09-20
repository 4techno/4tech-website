'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';

const MotionContext = createContext({ paused: false, setPaused: (_paused: boolean) => {}, reduced: true });

/** One pause preference covers the galaxy, decorative motion and scroll reveals. */
export function MotionPreferences({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const preference = useReducedMotion();
  const reduced = !ready || preference !== false;
  useEffect(() => setReady(true), []);
  useEffect(() => {
    document.documentElement.dataset.motion = paused || reduced ? 'paused' : 'running';
    return () => { delete document.documentElement.dataset.motion; };
  }, [paused, reduced]);
  return <MotionContext.Provider value={{ paused, setPaused, reduced }}>
    <MotionConfig reducedMotion={paused ? 'always' : 'user'}>{children}</MotionConfig>
  </MotionContext.Provider>;
}

export const useMotionPreferences = () => useContext(MotionContext);
