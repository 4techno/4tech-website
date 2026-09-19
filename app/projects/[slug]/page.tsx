import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteUrl } from '@/config';
import { getProjectBySlug, projects } from '@/lib/projects';
import { ProjectVisual } from '@/components/projects/ProjectVisual';

type ProjectPageProps = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return {
    title: project.name,
    description: project.short,
    alternates: { canonical: siteUrl(`/projects/${project.id}`) },
    openGraph: { title: `${project.name} — 4tech`, description: project.short, type: 'article', url: siteUrl(`/projects/${project.id}`) },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const index = projects.findIndex((entry) => entry.id === project.id);
  const next = projects[(index + 1) % projects.length];
  return (
    <main id="main" className="bg-zinc-950 pb-24 text-zinc-100">
      <article className="container-shell pt-40 sm:pt-48">
        <Link href="/projects" className="mb-12 inline-block text-sm text-zinc-500 transition-colors hover:text-zinc-100">← The project collection</Link>
        <header className="max-w-5xl">
          <p className="section-kicker">{String(index + 1).padStart(2, '0')} / {project.category}</p>
          <h1 className="mt-6 text-4xl font-medium leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-7xl">{project.name}</h1>
          <p className="text-muted mt-7 max-w-2xl text-lg leading-8">{project.short}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4"><span className="difficulty-badge" data-level={project.difficulty}>{project.difficulty}</span><span className="font-mono text-xs text-zinc-400">{project.stage}</span></div>
        </header>
        <ProjectVisual art={project.art} className="mt-12 h-64 rounded-2xl border border-white/10 sm:h-96" />
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-5">
            <section className="panel p-7 sm:p-10"><p className="section-kicker">01 / Context</p><h2 className="mt-4 text-2xl font-medium tracking-tight">The problem</h2><p className="text-muted mt-5 leading-8">{project.problem}</p></section>
            <section className="panel p-7 sm:p-10"><p className="section-kicker">02 / Engineering</p><h2 className="mt-4 text-2xl font-medium tracking-tight">The approach</h2><p className="mt-5 leading-8 text-zinc-300">{project.solution}</p><p className="text-muted mt-5 leading-8">{project.body}</p></section>
          </div>
          <div className="space-y-5">
            <section className="panel p-7 sm:p-10"><p className="section-kicker">03 / Toolkit</p><h2 className="mt-4 text-2xl font-medium tracking-tight">Technologies</h2><ul className="mt-6 flex flex-wrap gap-2">{project.tech.map((technology) => <li key={technology} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 font-mono text-xs text-zinc-300">{technology}</li>)}</ul></section>
            <section className="panel p-7 sm:p-10"><p className="section-kicker">04 / Purpose</p><h2 className="mt-4 text-2xl font-medium tracking-tight">Intended contribution</h2><p className="text-muted mt-5 leading-8">{project.impact}</p></section>
          </div>
        </div>
        <section className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/[0.035] p-7 sm:p-10" aria-labelledby="validation-heading"><p className="section-kicker">Development record</p><h2 id="validation-heading" className="mt-4 text-2xl font-medium tracking-tight">What has been established</h2><p className="mt-5 max-w-4xl leading-8 text-zinc-300">{project.validation}</p></section>
        <div className="flex flex-col gap-6 border-b border-white/10 py-12 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xl font-medium">Have a related challenge?</p><p className="text-muted mt-2 text-sm">Start with your goal. We will work through the possibilities.</p></div><Link href={`/account?project=${project.id}`} className="button-primary shrink-0">Enquire about a similar project <span aria-hidden="true">↗</span></Link></div>
        <nav className="flex flex-col gap-6 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between" aria-label="More projects"><Link href="/projects" className="text-zinc-400 transition-colors hover:text-white">← All projects</Link><Link href={`/projects/${next.id}`} className="text-zinc-300 transition-colors hover:text-red-400">Next: {next.name} <span aria-hidden="true">→</span></Link></nav>
      </article>
    </main>
  );
}
