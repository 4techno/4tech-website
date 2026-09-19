import type { Metadata } from 'next';
import Link from 'next/link';
import { siteUrl } from '@/config';
import { projects } from '@/lib/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectFilter } from '@/components/projects/ProjectFilter';

const description = 'Explore the 4tech engineering portfolio: robotics, embedded systems, RF technology, automation and experimental R&D. Browse by engineering difficulty and development stage.';
export const metadata: Metadata = { title: 'Engineering & R&D', description, alternates: { canonical: siteUrl('/projects') }, openGraph: { title: 'Engineering & R&D — 4tech', description, url: siteUrl('/projects'), type: 'website' } };

export default function ProjectsPage() {
  const entries = projects.map(project => ({ id: project.id, difficulty: project.difficulty, text: [project.name, project.category, project.difficulty, project.stage, project.short, ...project.tech].join(' ') }));
  return <main id="main" className="engineering-portfolio">
    <section className="container-shell engineering-intro">
      <Link href="/portfolio" className="text-sm text-zinc-400 transition-colors hover:text-white">← Mohammed Vashir / Portfolio</Link>
      <p className="section-kicker mt-14">{`{ 4TECH / ENGINEERING & R&D }_`}</p>
      <div className="engineering-intro-grid"><h1>Systems thinking.<br/><span>Real-world ambition.</span></h1><p>From RF measurement to robotic motion. A focused collection of integrated systems, prototypes and research directions.</p></div>
      <div className="engineering-disciplines"><span>Robotics</span><span>Embedded systems</span><span>RF technology</span><span>Automation & AI</span><span>Experimental engineering</span></div>
      <p className="portfolio-stage-note"><span aria-hidden="true"/>Development stage is shown on every project. Proposed R&D concepts describe intended work; project details distinguish existing progress from planned capabilities.</p>
    </section>
    <section className="container-shell" aria-label="Engineering project portfolio"><ProjectFilter entries={entries}>{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index}/>)}</ProjectFilter></section>
    <section className="container-shell py-20 sm:py-28"><div className="panel flex flex-col gap-8 p-8 sm:p-12 lg:flex-row lg:items-end lg:justify-between"><div><p className="section-kicker">From challenge to system</p><h2 className="mt-5 max-w-xl text-3xl tracking-tight sm:text-4xl">Bring a problem worth solving.</h2><p className="mt-5 max-w-lg text-sm leading-7 text-zinc-400">Define the objective, the constraints and the evidence a successful prototype should deliver.</p></div><Link href="/account" className="button-primary shrink-0">Discuss a project <span aria-hidden="true">↗</span></Link></div></section>
  </main>;
}
