'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const storageKey = '4tech:intro-seen:v2';
let seenInThisPage = false;

/** A brief opening scene made from 4TECH's existing human/robot hand artwork. */
export default function IntroSequence() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const humanRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let alreadySeen = seenInThisPage;
    try { alreadySeen ||= window.sessionStorage.getItem(storageKey) === '1'; } catch { /* Private browsing can deny storage. */ }
    if (reduced || alreadySeen) {
      seenInThisPage = true;
      document.documentElement.dataset.techIntroComplete = 'true';
      setVisible(false);
      window.dispatchEvent(new Event('4tech:intro-complete'));
      return;
    }

    const root = rootRef.current;
    if (!root) return;
    const progress = { value: 0 };
    const finish = () => {
      seenInThisPage = true;
      try { window.sessionStorage.setItem(storageKey, '1'); } catch { /* The scene works without storage. */ }
      document.documentElement.dataset.techIntroComplete = 'true';
      setVisible(false);
      window.dispatchEvent(new Event('4tech:intro-complete'));
    };

    const timeline = gsap.timeline({ onComplete: finish });
    timelineRef.current = timeline;
    timeline
      .fromTo(titleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.42, ease: 'power3.out' }, 0)
      .fromTo(robotRef.current, { xPercent: -28 }, { xPercent: 1.6, duration: 1.35, ease: 'power3.inOut' }, 0.12)
      .fromTo(humanRef.current, { xPercent: 28 }, { xPercent: -1.6, duration: 1.35, ease: 'power3.inOut' }, 0.12)
      .to(progress, {
        value: 100,
        duration: 1.35,
        ease: 'power2.inOut',
        onUpdate: () => { if (counterRef.current) counterRef.current.textContent = `${Math.round(progress.value).toString().padStart(3, '0')}%`; },
      }, 0.12)
      .fromTo(flashRef.current, { opacity: 0, scale: 0.2 }, { opacity: 0.95, scale: 1, duration: 0.16, ease: 'power2.out' }, 1.44)
      .to(flashRef.current, { opacity: 0, scale: 2.8, duration: 0.48, ease: 'power2.out' }, 1.60)
      .to(root, { yPercent: -101, duration: 0.82, ease: 'expo.inOut' }, 1.77);

    return () => { timeline.kill(); timelineRef.current = null; };
  }, []);

  if (!visible) return null;

  const skip = () => {
    timelineRef.current?.kill();
    seenInThisPage = true;
    try { window.sessionStorage.setItem(storageKey, '1'); } catch { /* Optional storage. */ }
    document.documentElement.dataset.techIntroComplete = 'true';
    setVisible(false);
    window.dispatchEvent(new Event('4tech:intro-complete'));
  };

  return <div ref={rootRef} className="tech-intro" aria-label="4TECH opening animation">
    <div className="tech-intro__top"><span>4TECH / ENGINEERING STUDIO</span><button type="button" onClick={skip}>Skip intro</button></div>
    <div ref={titleRef} className="tech-intro__title" aria-hidden="true"><span>HUMAN CURIOSITY</span><strong>MEETS ENGINEERED POSSIBILITY.</strong></div>
    <div className="tech-intro__hands" aria-hidden="true">
      <div ref={robotRef} className="tech-intro__half tech-intro__half--robot"><img src="/assets/editorial/hero-hands.jpg" alt="" fetchPriority="high" /></div>
      <div ref={humanRef} className="tech-intro__half tech-intro__half--human"><img src="/assets/editorial/hero-hands.jpg" alt="" fetchPriority="high" /></div>
      <div ref={flashRef} className="tech-intro__flash" />
    </div>
    <div className="tech-intro__bottom"><span>ROBOTICS · EMBEDDED SYSTEMS · RF</span><span ref={counterRef}>000%</span></div>
  </div>;
}
