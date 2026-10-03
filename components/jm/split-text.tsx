'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: [number, number, number, number];
  splitType?: 'chars' | 'words';
  animationFrom?: { opacity: number; y?: number; scale?: number };
  animationTo?: { opacity: number; y?: number; scale?: number };
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export default function SplitText({
  text,
  className = '',
  delay = 35,
  duration = 0.65,
  ease = [0.22, 1, 0.36, 1],
  splitType = 'chars',
  animationFrom = { opacity: 0, y: 50, scale: 0.95 },
  animationTo = { opacity: 1, y: 0, scale: 1 },
  threshold = 0.1,
  rootMargin = '-50px',
  tag = 'h2',
}: SplitTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, {
    once: false,
    amount: threshold,
    margin: rootMargin as any,
  });

  const words = text.split(' ');
  let charCount = 0;

  const Tag = motion[tag] as any;

  return (
    <Tag
      ref={ref}
      className={`inline-block select-none ${className}`}
      style={{ wordWrap: 'break-word' }}
      aria-label={text}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline">
        {words.map((word, wIdx) => {
          const isLastWord = wIdx === words.length - 1;
          const chars = Array.from(word);

          return (
            <span key={wIdx} className="inline-block whitespace-nowrap overflow-hidden py-1">
              {chars.map((char, cIdx) => {
                const currentDelay = (charCount++ * delay) / 1000;
                return (
                  <motion.span
                    key={cIdx}
                    className="inline-block transform-gpu will-change-transform"
                    initial={animationFrom}
                    animate={isInView ? animationTo : animationFrom}
                    transition={{
                      duration,
                      delay: currentDelay,
                      ease,
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
              {!isLastWord && <span className="inline-block">&nbsp;</span>}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
