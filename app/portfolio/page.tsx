import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config';
import { skillGroups, education, certifications } from '@/lib/profile';
import { featuredProjects } from '@/lib/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import JourneyNav from '@/components/journey-nav';
import Reveal from '@/components/reveal';

export const metadata: Metadata = { title: 'Mohammed Vashir | Portfolio', description: 'Explore Mohammed Vashir’s skills, education and projects in embedded systems, robotics, automation and engineering computation.', alternates: { canonical: '/portfolio' } };

export default function PortfolioPage() {
  return <main id="main" className="personal-portfolio container-shell">
    <JourneyNav current="portfolio"/>
    <section className="profile-hero">
      <Reveal><p className="section-kicker">{`{ THE PERSON BEHIND 4TECH }_`}</p><h1>Mohammed<br/><span>Vashir.</span></h1><p className="profile-role">Engineering student.<br/>Curious builder. Founder of 4tech.</p><p className="profile-intro">I connect code, circuits and mechanisms to explore practical engineering ideas. My interests span embedded systems, robotic motion and computational research.</p><div className="flex flex-wrap gap-3"><Link className="button-primary" href="/resume">View my résumé ↗</Link><a href="#skills" className="button-secondary">Explore my skills ↓</a></div></Reveal>
      <Reveal className="profile-portrait"><Image src={siteConfig.founder.image} alt={siteConfig.founder.imageAlt} fill priority sizes="(max-width: 700px) 88vw, 38vw" style={{objectFit:'cover',objectPosition:siteConfig.founder.imagePosition}}/><div className="portrait-gradient"/><div className="portrait-caption"><span>Engineering through exploration.</span><span>KALPAKKAM, INDIA</span></div></Reveal>
    </section>
    <section id="skills" className="profile-section"><Reveal><p className="section-kicker">{`{ 01 / MY TOOLKIT }_`}</p><h2>Skills put<br/><span className="text-zinc-500">into practice.</span></h2><p className="profile-section-lede">Tools and methods I use across my projects and studies.</p></Reveal>
      <div className="skill-grid">{skillGroups.map((group,i)=><Reveal key={group.name} delay={i*.06}><article className="panel skill-card"><span className="font-mono text-[10px] text-accent">0{i+1}</span><h3>{group.name}</h3><p>{group.description}</p><ul>{group.skills.map(skill=><li key={skill}>{skill}</li>)}</ul><Link href={`/projects/${group.project}`}>See it in a project ↗</Link></article></Reveal>)}</div>
    </section>
    <section className="profile-section"><Reveal><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="section-kicker">{`{ 02 / SELECTED WORK }_`}</p><h2>Selected systems.<br/><span className="text-zinc-500">Engineering in practice.</span></h2></div><Link className="button-secondary" href="/projects">Engineering portfolio ↗</Link></div></Reveal><div className="mt-10 grid gap-5 md:grid-cols-2">{featuredProjects.map((project,index)=><ProjectCard key={project.id} project={project} index={index}/>)}</div></section>
    <section className="profile-section profile-education"><Reveal><p className="section-kicker">{`{ 03 / LEARNING, ALWAYS }_`}</p><h2>Building a<br/><span className="text-zinc-500">foundation.</span></h2></Reveal><div><div className="education-card"><span className="font-mono text-[10px] text-accent">{education.stage}</span><h3>{education.degree}</h3><p>{education.institution}</p><span>{education.location}</span></div>{certifications.map(cert=><article className="certification-row" key={cert.title}><h3>{cert.title}</h3><p>{cert.provider}<br/><span>{cert.date}</span></p></article>)}</div></section>
    <section className="profile-invite"><Reveal><p className="section-kicker">{`{ YOUR NEXT COLLABORATOR? }_`}</p><h2>Let’s make<br/>something <span className="text-accent">meaningful.</span></h2><div className="mt-8 flex flex-wrap gap-3"><a href={`mailto:${siteConfig.contacts.email}`} className="button-primary">Get in touch ↗</a><Link href="/resume" className="button-secondary">My résumé ↗</Link><Link href="/" className="button-secondary">Discover 4tech ↗</Link></div></Reveal></section>
  </main>;
}
