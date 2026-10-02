'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useMotionPreferences } from '@/components/motion-preferences';
import styles from './portfolio.module.css';

export type StageMode = 'genesis' | 'silicon' | 'kinetics' | 'signals';
const modes: { id: StageMode; label: string; caption: string }[] = [
  { id: 'genesis', label: 'Genesis', caption: 'An idea becomes a system.' },
  { id: 'silicon', label: 'Silicon', caption: 'Logic, grounded in hardware.' },
  { id: 'kinetics', label: 'Kinetics', caption: 'Geometry becomes motion.' },
  { id: 'signals', label: 'Signals', caption: 'Exploring the invisible.' },
];
const Scene = dynamic(() => import('./portfolio-scene'), { ssr: false, loading: () => <StageFallback /> });

export function StageFallback() {
  return <div className={styles.stageFallback} aria-hidden="true"><i /><i /><i /><span>MV</span></div>;
}

export default function PortfolioStage() {
  const host = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<StageMode>('genesis');
  const [visible, setVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const { reduced, paused, setPaused } = useMotionPreferences();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' });
    if (host.current) observer.observe(host.current);
    const update = () => setTabVisible(document.visibilityState === 'visible');
    update(); document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  return <div className={styles.stage} ref={host}>
    <div className={styles.stageCanvas} aria-hidden="true">{reduced ? <StageFallback /> : <Scene mode={mode} paused={paused || !visible || !tabVisible} />}</div>
    <div className={styles.stageControls}><div className={styles.modeButtons} role="group" aria-label="Explore engineering forms">{modes.map(item => <button key={item.id} type="button" aria-pressed={mode === item.id} onClick={() => setMode(item.id)}>{item.label}</button>)}</div>{!reduced && <button className={styles.pauseButton} aria-label={paused ? 'Resume portfolio animations' : 'Pause portfolio animations'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Play' : 'Pause'}</button>}</div>
    <p className={styles.stageCaption} aria-live="polite">{modes.find(item => item.id === mode)?.caption}</p>
  </div>;
}
