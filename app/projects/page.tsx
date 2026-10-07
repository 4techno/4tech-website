import type { Metadata } from 'next';
import Link from 'next/link';
import { siteUrl } from '@/config';
import { projects } from '@/lib/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectFilter } from '@/components/projects/ProjectFilter';
import TextReveal from '@/components/text-reveal';
import SelectedProjects from '@/components/jm/selected-projects';
import styles from '@/components/projects/secondary.module.css';

const description = 'Explore the 4TECH Engineering portfolio: robotics, embedded systems, RF technology, automation and experimental R&D. Browse by engineering difficulty and development stage.';
export const metadata: Metadata = {
  title: 'Engineering Works & Portfolio',
  description,
  alternates: { canonical: siteUrl('/projects') },
  openGraph: {
    title: 'Engineering Works & Portfolio | 4TECH Engineering',
    description,
    url: siteUrl('/projects'),
    type: 'website'
  }
};

export default function ProjectsPage() {
  const entries = projects.map(project => ({
    id: project.id,
    difficulty: project.difficulty,
    text: [project.name, project.category, project.difficulty, project.stage, project.short, ...project.tech].join(' ')
  }));

  return (
    <main id="main" className={`${styles.page} jm-home`}>
      <section className={`container-shell ${styles.intro}`}>
        <Link href="/" className={styles.back}>← Back to 4TECH Engineering Home</Link>
        <p className={styles.eyebrow}>{'{ 4TECH ENGINEERING // COMPLETE PORTFOLIO }_'}</p>
        <h1 className={styles.display}>
          <TextReveal text="Systems thinking." /><br />
          <span className={styles.muted}><TextReveal text="Real-world ambition." delay={.12} /></span>
        </h1>
        <p className={styles.lede}>
          Completed engineering projects and validated prototypes spanning RF measurement, robotic motion, embedded electronics, power transfer, and experimental research.
        </p>
        <div className={styles.disciplineLine}>
          <span>Robotics</span>
          <span>Embedded systems</span>
          <span>RF technology</span>
          <span>Resonant power</span>
          <span>Automation &amp; AI</span>
          <span>Experimental engineering</span>
        </div>
        <div className={styles.stageNote}>
          <strong>Inside the engineering.</strong>
          <p>
            Explore the problem, system design, technologies and contribution behind each project. The detailed case studies are showcased below, followed by the complete searchable engineering catalog.
          </p>
        </div>
      </section>

      {/* Flagship Detailed Works / Selected Case Studies */}
      <SelectedProjects isDedicatedPage />

      {/* Full Project Archive with Search & Category Filters */}
      <section id="all-archive" className="container-shell" aria-label="Engineering project portfolio" style={{ paddingTop: '2rem' }}>
        <div className={styles.stageNote}>
          <strong>Full project directory.</strong>
          <p>All {projects.length} engineering systems grouped by complexity and domain. Filter by research level or search by component.</p>
        </div>
        <ProjectFilter entries={entries}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </ProjectFilter>
      </section>

      <section className={`container-shell ${styles.invite}`}>
        <div>
          <h2>Bring a problem<br />worth <span className={styles.accent}>solving.</span></h2>
          <p>Define the objective, the constraints and the evidence a successful prototype should deliver.</p>
        </div>
        <Link href="/account" className="button-primary">Discuss a project</Link>
      </section>
    </main>
  );
}
