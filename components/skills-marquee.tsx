const skills = [
  { name: 'Advanced engineering', code: 'ENGINEER', icon: 'M5 7h14v10H5zM9 3v4m6-4v4M9 17v4m6-4v4M1 10h4m-4 4h4m14-4h4m-4 4h4M9 10h6v4H9z' },
  { name: 'Robotics', code: 'MOVE', icon: 'M4 20h16M7 20v-5l6-4-3-5m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0m5 5 6-5 3 3-3 3M7 15h5v5' },
  { name: 'Embedded systems', code: 'CONNECT', icon: 'M8 8h8v8H8zM10 1v7m4-7v7m-4 8v7m4-7v7M1 10h7m-7 4h7m8-4h7m-7 4h7' },
  { name: 'RF technology', code: 'TRANSMIT', icon: 'M12 12v9m-4 0h8M12 8h.01M8 4a6 6 0 0 0 0 9m8-9a6 6 0 0 1 0 9M5 1a10 10 0 0 0 0 16M19 1a10 10 0 0 1 0 16' },
  { name: 'Automation & AI', code: 'INTERPRET', icon: 'M5 5h5v5H5zM14 14h5v5h-5zM10 7h7v7M7 10v7h7M17 3v4m4 10h-2M3 17h4' },
  { name: 'Research & development', code: 'DISCOVER', icon: 'M9 3h6m-5 0v6l-6 10a1.3 1.3 0 0 0 1.2 2h13.6a1.3 1.3 0 0 0 1.2-2L14 9V3M7 15h10M10 18h.01M14 12h.01' },
];

/** A static capabilities index keeps every discipline readable at every screen size. */
export default function SkillsMarquee() {
  return <section className="skills-band" aria-labelledby="capabilities-label">
    <div className="container-shell skills-inner">
      <div className="skills-heading"><h2 id="capabilities-label">An integrated engineering practice</h2><span aria-hidden="true">6 DISCIPLINES / ONE APPROACH</span></div>
      <ul className="capabilities-grid">{skills.map((skill, index) => <li key={skill.name}>
        <div className="capability-symbol"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={skill.icon}/></svg><span aria-hidden="true">0{index + 1}</span></div>
        <span className="capability-name">{skill.name}</span><span className="capability-code" aria-hidden="true">{skill.code}</span>
      </li>)}</ul>
    </div>
  </section>;
}
