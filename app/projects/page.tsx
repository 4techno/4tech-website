import type { Metadata } from 'next';
import Link from 'next/link';
import { siteUrl } from '@/config';
import { projects } from '@/lib/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectFilter } from '@/components/projects/ProjectFilter';
import TextReveal from '@/components/text-reveal';
import styles from '@/components/projects/secondary.module.css';

const description = 'Explore the 4tech engineering portfolio: robotics, embedded systems, RF technology, automation and experimental R&D. Browse by engineering difficulty and development stage.';
export const metadata: Metadata = { title: 'Engineering & R&D', description, alternates: { canonical: siteUrl('/projects') }, openGraph: { title: 'Engineering & R&D | 4tech', description, url: siteUrl('/projects'), type: 'website' } };

export default function ProjectsPage() {
  const entries = projects.map(project => ({ id: project.id, difficulty: project.difficulty, text: [project.name, project.category, project.difficulty, project.stage, project.short, ...project.tech].join(' ') }));
  return <main id="main" className={styles.page}>
    <section className={`container-shell ${styles.intro}`}>
      <Link href="/portfolio" className={styles.back}>← Mohammed Vashir / Portfolio</Link>
      <p className={styles.eyebrow}>{'{ 4TECH / ENGINEERING & R&D }_'}</p>
      <h1 className={styles.display}><TextReveal text="Systems thinking." /><br /><span className={styles.muted}><TextReveal text="Real-world ambition." delay={.12} /></span></h1>
      <p className={styles.lede}>Completed engineering projects by Mohammed Vashir, spanning RF measurement, robotic motion, embedded electronics and experimental research.</p>
      <div className={styles.disciplineLine}><span>Robotics</span><span>Embedded systems</span><span>RF technology</span><span>Automation & AI</span><span>Experimental engineering</span></div>
      <div className={styles.stageNote}><strong>Inside the engineering.</strong><p>Explore the problem, system design, technologies and contribution behind each project. Projects are grouped by engineering complexity.</p></div>
    </section>
    <section className="container-shell" aria-label="Engineering project portfolio"><ProjectFilter entries={entries}>{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</ProjectFilter></section>
    <section className={`container-shell ${styles.invite}`}><div><h2>Bring a problem<br />worth <span className={styles.accent}>solving.</span></h2><p>Define the objective, the constraints and the evidence a successful prototype should deliver.</p></div><Link href="/account" className="button-primary">Discuss a project</Link></section>
  </main>;
}
