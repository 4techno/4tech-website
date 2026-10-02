import Link from 'next/link';
import type { Project } from '@/lib/projects';
import styles from './secondary.module.css';

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <article className={styles.card} data-project-card={project.id}>
    <div className={styles.cardBody}>
      <div className={styles.cardMeta}><span className={styles.badge} data-level={project.difficulty}>{project.difficulty}</span><span className={styles.stage}>{project.stage}</span></div>
      <p className={styles.domain}>{String(index + 1).padStart(2, '0')} / {project.category}</p>
      <h3><Link href={`/projects/${project.id}`} prefetch={false}>{project.name}</Link></h3>
      <p className={styles.summary}>{project.short}</p>
      <p className={styles.stage}>Developed by Mohammed Vashir</p>
      <ul className={styles.tags} aria-label="Technologies">{project.tech.slice(0, 5).map(technology => <li key={technology}>{technology}</li>)}</ul>
      <Link href={`/projects/${project.id}`} prefetch={false} aria-label={`View Project: ${project.name}`} className={styles.viewLink}><span>View Project</span></Link>
    </div>
  </article>;
}
