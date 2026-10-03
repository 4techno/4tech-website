import Link from 'next/link';
import styles from './delivery-roadmap.module.css';

interface Phase {
  number: string;
  duration: string;
  title: string;
  description: string;
  deliverables: string[];
}

const PHASES: Phase[] = [
  {
    number: '01',
    duration: 'First conversation',
    title: 'Clarify the need',
    description: 'Share the problem, intended use, constraints and what a successful result would look like. We identify the open technical questions before choosing hardware.',
    deliverables: [
      'Problem and intended outcome',
      'Constraints and assumptions',
      'Questions that need investigation',
    ],
  },
  {
    number: '02',
    duration: 'Before work begins',
    title: 'Agree the scope',
    description: 'We turn the brief into a proposed approach with milestones, review points and an INR quotation. The scope defines what will be built and how it will be checked.',
    deliverables: [
      'Proposed technical approach',
      'Agreed deliverables and milestones',
      'Quotation and acceptance criteria',
    ],
  },
  {
    number: '03',
    duration: 'During the project',
    title: 'Build and review',
    description: 'Hardware, firmware, modelling or simulation work proceeds against the agreed scope. We share progress and review what the prototype actually demonstrates.',
    deliverables: [
      'Work in progress updates',
      'Prototype or study outputs',
      'Changes and decisions recorded',
    ],
  },
  {
    number: '04',
    duration: 'At handover',
    title: 'Test and hand over',
    description: 'We compare the result with the agreed criteria, document known limitations and hand over the materials specified in the quotation.',
    deliverables: [
      'Test observations and limits',
      'Agreed files and documentation',
      'Next-step recommendations',
    ],
  },
];

export default function DeliveryRoadmap() {
  return (
    <section id="roadmap" className={`ed-shell ${styles.roadmapSection}`} aria-labelledby="roadmap-heading">
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Working together</p>
          <h2 id="roadmap-heading" className={styles.heading}>
            From idea to evidence.<br />
            <em>A clear path for every brief.</em>
          </h2>
        </div>
        <p className={styles.intro}>
          This is the typical journey. Timeline, deliverables, ownership and support depend on the project and are agreed in writing before work begins.
        </p>
      </div>

      <div className={styles.phasesGrid}>
        {PHASES.map((phase) => (
          <article key={phase.number} className={styles.phaseCard}>
            <div className={styles.phaseTop}>
              <span className={styles.phaseNum}>{phase.number}</span>
              <span className={styles.phaseDuration}>{phase.duration}</span>
            </div>
            <h3 className={styles.phaseTitle}>{phase.title}</h3>
            <p className={styles.phaseDescription}>{phase.description}</p>
            <div className={styles.deliverablesBox}>
              <span className={styles.deliverablesLabel}>What this stage covers</span>
              <ul className={styles.deliverablesList}>
                {phase.deliverables.map((item, idx) => (
                  <li key={idx} className={styles.deliverableItem}>
                    <span className={styles.checkIcon} aria-hidden="true">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.footerBar}>
        <div className={styles.footerCopy}>
          <h3>Have an engineering challenge?</h3>
          <p>Start a brief. Your account keeps the enquiry and its updates together.</p>
        </div>
        <div className={styles.footerActions}>
          <Link href="/account" className={styles.primaryBtn}>
            <span>Submit a project brief</span>
          </Link>
          <Link href="/ideas" className={styles.secondaryBtn}>Explore the Idea Studio</Link>
        </div>
      </div>
    </section>
  );
}
