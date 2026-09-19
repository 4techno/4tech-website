import type { Metadata } from 'next';
import Link from 'next/link';
import JourneyNav from '@/components/journey-nav';
import SocialLinks from '@/components/social-links';
import { siteConfig } from '@/config';
import { education, certifications, resumeProjects, skillGroups } from '@/lib/profile';

export const metadata: Metadata = { title: 'Mohammed Vashir | Résumé', description: 'Mohammed Vashir — Electrical and Electronics Engineering student. Skills and project experience in embedded systems, robotics and automation. Download the résumé PDF.', alternates: { canonical: '/resume' } };

export default function ResumePage() {
  return <main id="main" className="container-shell resume-page"><JourneyNav current="resume"/><div className="resume-toolbar"><p className="section-kicker">{`{ RÉSUMÉ / MOHAMMED VASHIR }_`}</p><a className="button-primary" href="/assets/Mohammed_Vashir_Resume.pdf" download>Download PDF ↓</a></div>
    <article className="resume-sheet"><header><h1>Mohammed Vashir</h1><p className="resume-position">Embedded Systems · Robotics · Automation</p><p className="resume-contact">Kalpakkam, Tamil Nadu 603102 · <a href="tel:+919360108408">+91 9360108408</a><br/><a href={`mailto:${siteConfig.contacts.email}`}>{siteConfig.contacts.email}</a></p><SocialLinks className="resume-social-icons" label="Mohammed Vashir profiles"/></header>
      <section><h2>Profile</h2><p>B.Tech Electrical and Electronics Engineering student focused on embedded systems, robotics and automation. Project work spans ESP32-based RF acquisition, multi-sensor IoT systems, robotic-arm CAD and computational kinematics. Developing 4tech as an engineering and prototype-development initiative.</p></section>
      <section><h2>Education</h2><h3>{education.degree}</h3><p>{education.institution}, Vandalur</p><p className="resume-small">{education.stage}</p></section>
      <section><h2>Technical skills</h2><dl className="resume-skills">{skillGroups.map(group=><div key={group.name}><dt>{group.name}</dt><dd>{group.skills.join(' · ')}</dd></div>)}</dl></section>
      <section><h2>Selected projects &amp; research</h2>{resumeProjects.map(project=><div className="resume-project" key={project.id}><h3><Link href={`/projects/${project.id}`}>{project.name} ↗</Link></h3><p className="resume-small">{project.stage}</p><p>{project.text}</p></div>)}<Link href="/projects" className="resume-more">Read technical details and validation status →</Link></section>
      <section><h2>Initiative &amp; startup engagement</h2><p><strong>4tech</strong> — Developing an engineering and prototype-development initiative, focused on integrated systems, robotics, RF measurement and practical technical collaboration.</p><p className="mt-3">Represented Edutainal Maveric World at Crescent’s 5th Mega Demo Day in 2026, explaining the startup’s work to students and investors.</p></section>
      <section><h2>Certifications</h2>{certifications.map(cert=><p className="mb-2" key={cert.title}><strong>{cert.title}</strong> · {cert.provider}<br/><span className="resume-small">{cert.date}</span></p>)}</section>
    </article><div className="mt-8 flex flex-wrap items-center justify-between gap-6"><Link className="button-secondary" href="/portfolio">← Back to my portfolio</Link><a className="text-sm text-zinc-400 underline underline-offset-4" href="/assets/Mohammed_Vashir_Resume.pdf" target="_blank" rel="noopener noreferrer">Open the PDF résumé ↗</a></div>
  </main>;
}
