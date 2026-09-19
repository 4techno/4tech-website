'use client';
import { Children, useEffect, useState, type ReactNode } from 'react';

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
    <div className="project-controls">
      <div className="project-level-filters" role="group" aria-label="Filter by difficulty">
        {(['All', ...groups.map(group => group.level)] as const).map(item => <button type="button" key={item} aria-pressed={level === item} disabled={!enabled} onClick={() => setLevel(item)} aria-controls="project-results">{item === 'All' ? 'All engineering' : item}</button>)}
      </div>
      <div className="project-search-row"><div><label htmlFor="project-search" className="section-kicker">Search the portfolio</label><input id="project-search" type="search" value={query} onChange={event => setQuery(event.target.value)} disabled={!enabled} placeholder="Project, domain or technology…" aria-controls="project-results" /></div><p role="status" aria-live="polite" aria-atomic="true">{count} of {entries.length} projects</p></div>
    </div>
    <noscript><p className="mb-8 text-sm text-zinc-400">Browse every project below. Search and filters become available with JavaScript.</p></noscript>
    <div id="project-results">{groups.map((group, groupIndex) => {
      const indexes = entries.flatMap((entry, index) => entry.difficulty === group.level && visible[index] ? [index] : []);
      return <section key={group.level} id={group.id} className="project-level-section" hidden={!indexes.length} aria-labelledby={`${group.id}-heading`}>
        <div className="project-level-heading"><div><p className="section-kicker">{`{ 0${groupIndex + 1} / ${group.level.toUpperCase()} }_`}</p><h2 id={`${group.id}-heading`}>{group.title}</h2></div><p>{group.description}</p></div>
        <div className="engineering-grid">{indexes.map(index => <div key={entries[index].id}>{cards[index]}</div>)}</div>
      </section>;
    })}</div>
    {count === 0 && <div className="panel px-6 py-16 text-center"><h2 className="text-xl text-zinc-200">No matching projects.</h2><p className="mt-3 text-sm text-zinc-400">Try RF, robotics, sensors or another difficulty level.</p><button type="button" className="button-secondary mt-7" onClick={() => { setQuery(''); setLevel('All'); }}>Reset filters</button></div>}
  </div>;
}
