'use client';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useMotionPreferences } from './motion-preferences';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 32 });
  const { reduced, paused } = useMotionPreferences();
  return <motion.div className="reading-progress" aria-hidden="true" style={{ scaleX: reduced || paused ? scrollYProgress : progress }} />;
}
