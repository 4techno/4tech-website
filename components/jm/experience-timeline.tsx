import Link from 'next/link';

const chapters = [
  {
    number: '01',
    label: 'FOUNDATION',
    title: 'Electrical engineering as a working language',
    body: 'Mohammed Vashir studies Electrical and Electronics Engineering at B.S. Abdur Rahman Crescent Institute of Science and Technology. Circuit behaviour, control and computation inform the studio’s practical work.',
  },
  {
    number: '02',
    label: 'PRACTICE',
    title: 'Hardware and software in one conversation',
    body: '4TECH connects embedded firmware, mechanical design, instrumentation and interfaces. The goal is to make the assumptions of a prototype visible before treating a result as settled.',
  },
  {
    number: '03',
    label: 'EVIDENCE',
    title: 'Show what was built. State what remains to test.',
    body: 'Each public case study separates described engineering work from measured performance. Where a photo, dataset or validation record is unavailable, the gap stays visible.',
  },
] as const;

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="jm-trajectory" aria-labelledby="jm-trajectory-title">
      <div className="jm-shell jm-trajectory-grid">
        <div className="jm-trajectory-intro">
          <p className="jm-kicker"><span aria-hidden="true" /> [ 05 / THE PRACTICE ]</p>
          <h2 id="jm-trajectory-title">A builder’s<br /><em>perspective.</em></h2>
          <p>Engineering is most useful when the design can be explained, reproduced and questioned.</p>
          <Link href="/portfolio">Meet the people behind the work <span aria-hidden="true">→</span></Link>
        </div>
        <ol className="jm-trajectory-list">
          {chapters.map((chapter) => (
            <li key={chapter.number}>
              <div className="jm-trajectory-index">
                <span>{chapter.number}</span>
                <span>{chapter.label}</span>
              </div>
              <div>
                <h3>{chapter.title}</h3>
                <p>{chapter.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
