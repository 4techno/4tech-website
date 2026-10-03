import Link from 'next/link';
import { ProjectArt } from '@/components/editorial/editorial-art';
import { featuredProjects } from '@/lib/projects';

const artKind: Record<string, string> = {
  antenna: 'antenna',
  'robot-arm': 'robot',
  drone: 'drone',
  sewersense: 'telemetry',
};

export default function SelectedProjects() {
  return (
    <section id="projects" className="jm-work" aria-labelledby="jm-work-title">
      <div className="jm-shell">
        <div className="jm-work-header">
          <div>
            <p className="jm-kicker"><span aria-hidden="true" /> [ 02 / SELECTED WORK ]</p>
            <h2 id="jm-work-title">Engineering, made tangible.</h2>
          </div>
          <div className="jm-work-header-aside">
            <p>Four projects that show how 4TECH approaches measurement, motion, control and connected systems.</p>
            <Link href="/projects">Explore all projects <span aria-hidden="true">→</span></Link>
          </div>
        </div>

        <div className="jm-work-list">
          {featuredProjects.map((project, index) => (
            <article key={project.id} className="jm-work-card">
              <div className="jm-work-copy">
                <div className="jm-work-meta">
                  <span>{String(index + 1).padStart(2, '0')} / {String(featuredProjects.length).padStart(2, '0')}</span>
                  <span>{project.category}</span>
                </div>
                <h3>{project.name}</h3>
                <p className="jm-work-summary">{project.short}</p>
                <p className="jm-work-validation">{project.validation}</p>
                <div className="jm-work-tags" aria-label="Technologies used">
                  {project.tech.slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="jm-work-actions">
                  <Link href={`/projects/${project.id}`} className="jm-action-primary">View case study <span aria-hidden="true">→</span></Link>
                  <span className="jm-work-difficulty">{project.difficulty}</span>
                </div>
              </div>
              <div className={`jm-work-visual jm-work-visual--${project.id}`}>
                <div className="jm-work-visual-top" aria-hidden="true">
                  <span>4TECH / ENGINEERING RECORD</span>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="jm-work-visual-art" aria-hidden="true">
                  <ProjectArt kind={artKind[project.id] ?? 'telemetry'} />
                </div>
                <div className="jm-work-visual-bottom">
                  <span>CONCEPT ILLUSTRATION</span>
                  <span>{project.stage.toUpperCase()}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
