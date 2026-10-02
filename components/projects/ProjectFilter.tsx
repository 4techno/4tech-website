'use client';
import { Children, useEffect, useState, type ReactNode } from 'react';
import Reveal from '../reveal';
import styles from './secondary.module.css';

type Level = 'Research Level' | 'Advanced' | 'Intermediate';
type SearchEntry = { id: string; text: string; difficulty: Level };
const groups: { level: Level; id: string; title: string; description: string }[] = [
  { level: 'Research Level', id: 'research', title: 'Research & Expert-Level Projects', description: 'Measurement systems, RF analysis and experimental methods. Engineering questions that demand evidence.' },
  { level: 'Advanced', id: 'advanced', title: 'Advanced Projects', description: 'Robotics, perception and complex electronics. Hardware and software designed as one system.' },
  { level: 'Intermediate', id: 'intermediate', title: 'Intermediate Projects', description: 'Integrated sensing, instrumentation and mechanical systems with a clear path from architecture to validation.' },
];

// Complete server-rendered cards remain available before this search enhancement loads.
export function ProjectFilter({ entries, children }: { entries: readonly SearchEntry[]; children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<Level | 'All'>('All');
  const [enabled, setEnabled] = useState(false);
  useEffect(() => setEnabled(true), []);
  const cards = Children.toArray(children);
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visible = entries.map(entry => (level === 'All' || entry.difficulty === level) && words.every(word => entry.text.toLowerCase().includes(word)));
  const count = visible.filter(Boolean).length;
  return <div>
    <div className={styles.controls}>
      <div className={styles.filterTabs} role="group" aria-label="Filter by difficulty">
        {(['All', ...groups.map(group => group.level)] as const).map(item => <button type="button" key={item} aria-pressed={level === item} disabled={!enabled} onClick={() => setLevel(item)} aria-controls="project-results">{item === 'All' ? 'All engineering' : item}</button>)}
      </div>
      <div className={styles.searchRow}><div className={styles.searchField}><label htmlFor="project-search">Search by project, domain or technology</label><input id="project-search" type="search" value={query} onChange={event => setQuery(event.target.value)} disabled={!enabled} placeholder="Try RF, robotics or ESP32…" aria-controls="project-results" /></div><div className={styles.resultCount}><p role="status" aria-live="polite" aria-atomic="true">{count} of {entries.length} projects</p>{(query || level !== 'All') && <button type="button" onClick={() => { setQuery(''); setLevel('All'); }}>Clear filters</button>}</div></div>
    </div>
    <noscript><p className="mb-8 text-sm text-zinc-400">Browse every project below. Search and filters become available with JavaScript.</p></noscript>
    <div id="project-results">{groups.map(group => {
      const indexes = entries.flatMap((entry, index) => entry.difficulty === group.level && visible[index] ? [index] : []);
      return <section key={group.level} id={group.id} className={styles.levelSection} hidden={!indexes.length} aria-labelledby={`${group.id}-heading`}>
        <div className={styles.levelHeading}><h2 id={`${group.id}-heading`}>{group.title}</h2><p>{group.description}</p></div>
        <div className={styles.projectGrid}>{indexes.map((index, order) => <Reveal key={entries[index].id} delay={(order % 2) * .07}>{cards[index]}</Reveal>)}</div>
      </section>;
    })}</div>
    {count === 0 && <div className={styles.empty}><h2>No matching projects.</h2><p>Try RF, robotics, sensors or another difficulty level.</p><button type="button" className="button-secondary" onClick={() => { setQuery(''); setLevel('All'); }}>Reset filters</button></div>}
  </div>;
}
