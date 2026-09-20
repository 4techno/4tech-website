'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import GalaxyFallback from './galaxy/galaxy-fallback';
import { useMotionPreferences } from './motion-preferences';

// ssr:false belongs inside a Client Component, never in the server page/layout.
const GalaxyScene = dynamic(() => import('./galaxy/galaxy-scene'), { ssr: false, loading: () => <GalaxyFallback /> });

export default function GalaxyExperience() {
  const host = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { paused, setPaused, reduced } = useMotionPreferences();
  const [visible, setVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    const tab = () => setTabVisible(document.visibilityState === 'visible');
    tab(); setLoaded(true);
    document.addEventListener('visibilitychange', tab);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '80px' });
    if (host.current) observer.observe(host.current);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', tab); };
  }, []);
  return <>
    <div className="galaxy-host" ref={host} aria-hidden="true">
      <div className="galaxy-placeholder" />
      {(!loaded || reduced) && <GalaxyFallback />}
      {loaded && !reduced && <GalaxyScene paused={paused || !visible || !tabVisible} />}
    </div>
    {!reduced && <button className="motion-toggle" aria-pressed={paused} onClick={() => setPaused(!paused)}><span aria-hidden>{paused ? '▷' : 'Ⅱ'}</span>{paused ? 'Resume motion' : 'Pause motion'}</button>}
  </>;
}
