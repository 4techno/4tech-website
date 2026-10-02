'use client';

import { useEffect, useState } from 'react';
import styles from './portfolio.module.css';

const chapters = [{ id: 'profile', label: 'Profile' }, { id: 'works', label: 'Work' }, { id: 'skills', label: 'Disciplines' }, { id: 'method', label: 'Approach' }, { id: 'dialogue', label: 'Contact' }];

export default function ChapterNavigation() {
  const [active, setActive] = useState('profile');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const entering = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (entering[0]) setActive(entering[0].target.id);
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    chapters.forEach(chapter => { const section = document.getElementById(chapter.id); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, []);
  return <nav className={styles.chapterNav} aria-label="Portfolio chapters"><div className="container-shell">{chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={active === chapter.id ? 'location' : undefined} onClick={() => setActive(chapter.id)}><span aria-hidden="true">0{index + 1}</span>{chapter.label}</a>)}</div></nav>;
}
