import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteUrl } from '@/config';
import { getProjectBySlug, projects } from '@/lib/projects';
import Reveal from '@/components/reveal';
import TextReveal from '@/components/text-reveal';
import styles from '@/components/projects/secondary.module.css';

type ProjectPageProps = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(project => ({ slug: project.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return {
    title: project.name,
    description: project.short,
    alternates: { canonical: siteUrl(`/projects/${project.id}`) },
    openGraph: { title: `${project.name} | 4tech`, description: project.short, type: 'article', url: siteUrl(`/projects/${project.id}`) },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const index = projects.findIndex(entry => entry.id === project.id);
  const next = projects[(index + 1) % projects.length];
  return <main id="main" className={styles.page}>
    <article className={`container-shell ${styles.caseHero}`}>
      <Link href="/projects" className={styles.back}>← The project collection</Link>
      <header>
        <p className={styles.eyebrow}>{String(index + 1).padStart(2, '0')} / Engineering case study</p>
        <h1 className={styles.caseTitle}><TextReveal text={project.name} /></h1>
        <p className={styles.caseIntro}>{project.short}</p>
        <dl className={styles.caseMeta}>
          <div><dt>Engineering domain</dt><dd>{project.category}</dd></div>
          <div><dt>Project status</dt><dd>{project.stage}<br />Developed by Mohammed Vashir</dd></div>
          <div><dt>Difficulty</dt><dd><span className={styles.badge} data-level={project.difficulty}>{project.difficulty}</span></dd></div>
        </dl>
      </header>
      <div className={styles.caseLayout}>
        <nav className={styles.caseNav} aria-label="Project sections"><a href="#problem">01 / The problem</a><a href="#approach">02 / The approach</a><a href="#technologies">03 / Technologies</a><a href="#contribution">04 / Contribution</a><a href="#validation">05 / Development record</a></nav>
        <div className={styles.caseContent}>
          <section id="problem" className={styles.caseBlock}><Reveal><h2>The problem.</h2><p>{project.problem}</p></Reveal></section>
          <section id="approach" className={styles.caseBlock}><Reveal><h2>The engineering approach.</h2><p>{project.solution}</p><p>{project.body}</p></Reveal></section>
          <section id="technologies" className={styles.caseBlock}><Reveal><h2>The toolkit.</h2><ul className={styles.caseTech}>{project.tech.map(technology => <li key={technology}>{technology}</li>)}</ul></Reveal></section>
          <section id="contribution" className={styles.caseBlock}><Reveal><h2>Engineering contribution.</h2><p>{project.impact}</p></Reveal></section>
          <section id="validation" className={styles.validation} aria-labelledby="validation-heading"><h2 id="validation-heading">Technical scope</h2><p>{project.validation}</p></section>
        </div>
      </div>
      <section className={styles.invite}><div><h2>Have a related <span className={styles.accent}>challenge?</span></h2><p>Start with your goal. We will work through the possibilities.</p></div><Link href={`/account?project=${project.id}`} className="button-primary">Discuss a similar project</Link></section>
      <nav aria-label="More projects"><Link className={styles.nextProject} href={`/projects/${next.id}`}><div><span>Next in the collection</span><strong>{next.name}</strong></div></Link></nav>
    </article>
  </main>;
}
