'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useMotionPreferences } from '../motion-preferences';

export type EngineMode = 'systems' | 'robotics' | 'signal';
const Scene = dynamic(() => import('./engine-scene'), { ssr: false, loading: () => <EngineFallback /> });

export function EngineFallback() {
  return <div className="engine-fallback" aria-hidden="true"><div/><div/><div/><b>4</b></div>;
}

export default function EngineExperience() {
  const host = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<EngineMode>('systems');
  const [visible, setVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { paused, setPaused, reduced } = useMotionPreferences();
  useEffect(() => {
    setMounted(true);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' });
    if (host.current) observer.observe(host.current);
    const check = () => setTabVisible(document.visibilityState === 'visible');
    check(); document.addEventListener('visibilitychange', check);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', check); };
  }, []);
  return <div className="engine-experience" ref={host}>
    <div className="engine-canvas" aria-hidden="true">
      {mounted && !reduced ? <Scene mode={mode} paused={paused || !visible || !tabVisible}/> : <EngineFallback/>}
    </div>
    <div className="engine-controls">
      <div className="engine-mode-buttons" role="group" aria-label="Explore the engineering visual">
        {(['systems', 'robotics', 'signal'] as const).map(item => <button type="button" key={item} aria-pressed={mode === item} onClick={() => setMode(item)}>{item === 'signal' ? 'RF & signal' : item}</button>)}
      </div>
      {!reduced && <button type="button" className="engine-pause" aria-label={paused ? 'Resume animations' : 'Pause animations'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Play' : 'Pause'} <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button>}
    </div>
    <p className="engine-caption" aria-live="polite">{mode === 'systems' ? 'Connected parts. A complete system.' : mode === 'robotics' ? 'Motion, sensing and control.' : 'Invisible signals. Measurable behaviour.'}</p>
  </div>;
}
