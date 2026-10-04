'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './skills-education.module.css';

interface Skill {
  name: string;
  percent: number;
  type: 'ps' | 'ai' | 'id' | 'coreldraw' | 'lr' | 'canva' | 'figma-xd';
}

const SKILLS: Skill[] = [
  { name: 'Photoshop', percent: 90, type: 'ps' },
  { name: 'Illustrator', percent: 85, type: 'ai' },
  { name: 'InDesign', percent: 80, type: 'id' },
  { name: 'CorelDRAW', percent: 75, type: 'coreldraw' },
  { name: 'Lightroom', percent: 70, type: 'lr' },
  { name: 'Canva', percent: 85, type: 'canva' },
  { name: 'UI/UX – Figma, Adobe XD', percent: 75, type: 'figma-xd' },
];

const LANGUAGES = [
  { name: 'Malayalam', percent: 95 },
  { name: 'English', percent: 85 },
  { name: 'Tamil', percent: 75 },
  { name: 'Kannada', percent: 70 },
];

function SkillIcon({ type }: { type: Skill['type'] }) {
  switch (type) {
    case 'ps':
      return (
        <span className={styles.skillIconBox} style={{ color: '#55b7fc' }} aria-hidden="true">
          Ps
        </span>
      );
    case 'ai':
      return (
        <span className={styles.skillIconBox} style={{ color: '#ff9a00' }} aria-hidden="true">
          Ai
        </span>
      );
    case 'id':
      return (
        <span className={styles.skillIconBox} style={{ color: '#ff3366' }} aria-hidden="true">
          Id
        </span>
      );
    case 'coreldraw':
      return (
        <span className={styles.skillIconBox} aria-hidden="true" title="CorelDRAW">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8 2 5 5.5 5 9.5c0 4.5 4.5 9 6.5 11.5.3.4.7.4 1 0 2-2.5 6.5-7 6.5-11.5C19 5.5 16 2 12 2z" />
            <path d="M12 2c-2.5 3-4 6-4 9 0 2.5 1.5 4.5 4 4.5s4-2 4-4.5c0-3-1.5-6-4-9z" />
            <path d="M10 21h4" />
          </svg>
        </span>
      );
    case 'lr':
      return (
        <span className={styles.skillIconBox} style={{ color: '#31a8ff' }} aria-hidden="true">
          Lr
        </span>
      );
    case 'canva':
      return (
        <span className={styles.skillIconBox} aria-hidden="true" title="Canva">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" fill="#00c4cc" opacity="0.2" />
            <circle cx="12" cy="12" r="9" stroke="#00c4cc" strokeWidth="1.5" fill="none" />
            <path d="M14.5 9.5c-1-1-3-1-4 0s-1 3 0 4.5 3 2 4.5.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        </span>
      );
    case 'figma-xd':
      return (
        <div className={styles.skillIconBoxMulti} aria-hidden="true">
          <span className={styles.skillIconBox} style={{ width: 28, height: 28 }} title="Figma">
            <svg width="14" height="14" viewBox="0 0 38 57" fill="none">
              <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
              <path d="M0 47.5a9.5 9.5 0 0 1 9.5-9.5H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
              <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
              <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
              <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
            </svg>
          </span>
          <span className={styles.skillIconBox} style={{ width: 28, height: 28, fontSize: 11, color: '#ff61f6' }} title="Adobe XD">
            Xd
          </span>
        </div>
      );
  }
}

export default function SkillsEducation() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setInView(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="skills-education" className={styles.section} aria-labelledby="skills-heading">
      <div className={styles.shell}>
        {/* Top-Right "Dive In +" Pill Button */}
        <div className={styles.topBar}>
          <Link href="#camera-3d" className={styles.diveInBtn} aria-label="Dive in to 3D studio">
            <span>Dive In</span>
            <span aria-hidden="true">+</span>
          </Link>
        </div>

        <div className={styles.grid}>
          {/* Left Column: Proficiency / My Skills */}
          <article className={styles.card} aria-labelledby="skills-heading">
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.kicker}>PROFICIENCY</span>
                <h2 id="skills-heading" className={styles.cardTitle}>
                  My Skills
                </h2>
              </div>
              <span className={styles.pillBadge}>7 Core Disciplines</span>
            </div>

            <div className={styles.skillsList}>
              {SKILLS.map(skill => (
                <div key={skill.name} className={styles.skillItem}>
                  <div className={styles.skillMeta}>
                    <div className={styles.skillInfo}>
                      <SkillIcon type={skill.type} />
                      <span className={styles.skillName}>{skill.name}</span>
                    </div>
                    <span className={styles.skillPercent}>{skill.percent}%</span>
                  </div>
                  <div className={styles.progressTrack} role="progressbar" aria-valuenow={skill.percent} aria-valuemin={0} aria-valuemax={100} aria-label={`${skill.name} proficiency`}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: inView ? `${skill.percent}%` : '0%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Right Column: Stacked Cards (Education & Languages) */}
          <div className={styles.rightStack}>
            {/* Top Card: Education */}
            <article className={styles.card} aria-labelledby="education-heading">
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.kicker}>ACADEMIC BACKGROUND</span>
                  <h2 id="education-heading" className={styles.cardTitle}>
                    Education
                  </h2>
                </div>
              </div>

              <div className={styles.eduCards}>
                <div className={styles.eduSubCard}>
                  <div className={styles.eduSubHeader}>
                    <h3 className={styles.eduTitle}>Diploma in Graphic Design</h3>
                    <span className={styles.eduBadge}>2023</span>
                  </div>
                  <p className={styles.eduDesc}>
                    Comprehensive training in visual design, typography, layout, and Adobe Creative Suite.
                  </p>
                </div>

                <div className={styles.eduSubCard}>
                  <div className={styles.eduSubHeader}>
                    <h3 className={styles.eduTitle}>ST. PIUS X College Rajapuram</h3>
                    <span className={styles.eduBadge}>Graduation</span>
                  </div>
                  <p className={styles.eduDesc}>
                    Higher education foundation fostering disciplined teamwork and creative communications.
                  </p>
                </div>
              </div>
            </article>

            {/* Bottom Card: Languages */}
            <article className={styles.card} aria-labelledby="languages-heading">
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.kicker}>COMMUNICATION</span>
                  <h2 id="languages-heading" className={styles.cardTitle}>
                    Languages
                  </h2>
                </div>
              </div>

              <div className={styles.langList}>
                {LANGUAGES.map(lang => (
                  <div key={lang.name} className={styles.langItem}>
                    <div className={styles.langMeta}>
                      <span className={styles.langName}>{lang.name}</span>
                      <span className={styles.langPercent}>{lang.percent}%</span>
                    </div>
                    <div className={styles.progressTrack} role="progressbar" aria-valuenow={lang.percent} aria-valuemin={0} aria-valuemax={100} aria-label={`${lang.name} proficiency`}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: inView ? `${lang.percent}%` : '0%',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
