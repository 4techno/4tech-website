import Link from 'next/link';
import type { Project } from '@/lib/projects';
import { ProjectVisual } from './ProjectVisual';

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <article className="engineering-card group" data-project-card={project.id}>
    <div className="engineering-card-image">
      <ProjectVisual art={project.art} className="h-full" />
      <span className="project-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    </div>
    <div className="engineering-card-body">
      <div className="project-card-meta"><span className="difficulty-badge" data-level={project.difficulty}>{project.difficulty}</span><span className="project-stage">{project.stage}</span></div>
      <p className="project-domain">{project.category}</p>
      <h3><Link href={`/projects/${project.id}`} prefetch={false}>{project.name}</Link></h3>
      <p className="project-summary">{project.short}</p>
      <ul className="project-tech-tags" aria-label="Technologies">{project.tech.slice(0, 5).map(technology => <li key={technology}>{technology}</li>)}</ul>
      <Link href={`/projects/${project.id}`} prefetch={false} aria-label={`View Project: ${project.name}`} className="project-view-link"><span>View Project</span><span aria-hidden="true">↗</span></Link>
    </div>
  </article>;
}
