'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMotionPreferences } from '../motion-preferences';
import { ProjectVisual } from './ProjectVisual';
import styles from './secondary.module.css';

const focuses = [
  { label: 'Robotics', art: 'kinematics', project: 'robot-arm', title: 'Geometry into motion' },
  { label: 'RF systems', art: 'polar', project: 'antenna', title: 'Making signals visible' },
  { label: 'Embedded', art: 'drone', project: 'drone', title: 'Hardware meets software' },
] as const;

/** An interactive technical illustration takes the place of a personal photograph. */
export default function EngineeringFocus() {
  const [active, setActive] = useState(0);
  const { reduced, paused } = useMotionPreferences();
  const focus = focuses[active];
  return <div className={styles.focusLab}>
    <div className={styles.labScreen} id="engineering-focus-visual">
      <motion.div key={focus.art} initial={reduced || paused ? false : { opacity: .2, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced || paused ? 0 : .45, ease: [.22, 1, .36, 1] }}>
        <ProjectVisual art={focus.art} className="h-full" />
      </motion.div>
    </div>
    <div className={styles.labTabs} role="group" aria-label="Explore engineering disciplines">{focuses.map((item, index) => <button type="button" key={item.art} aria-pressed={index === active} aria-controls="engineering-focus-visual" onClick={() => setActive(index)}>{item.label}</button>)}</div>
    <div className={styles.labCaption}><Link href={`/projects/${focus.project}`}>{focus.title}</Link><span>Explore the work</span></div>
  </div>;
}
