import type { Metadata } from 'next';
import Link from 'next/link';
import JourneyNav from '@/components/journey-nav';
import SocialLinks from '@/components/social-links';
import TextReveal from '@/components/text-reveal';
import { siteConfig } from '@/config';
import { education, certifications, resumeProjects, skillGroups } from '@/lib/profile';
import styles from '@/components/projects/secondary.module.css';

export const metadata: Metadata = { title: 'Mohammed Vashir | Résumé', description: 'Mohammed Vashir, Electrical and Electronics Engineering student. Skills and project experience in embedded systems, robotics and automation. Download the résumé PDF.', alternates: { canonical: '/resume' } };

export default function ResumePage() {
  return <main id="main" className={`${styles.page} container-shell`}>
    <JourneyNav current="resume" />
    <div className={styles.resumeTop}><div><p className={styles.eyebrow}>Experience & capabilities</p><h1><TextReveal text="The résumé." /></h1><p>Engineering through study, design and experimentation.</p></div><a className="button-primary" href="/assets/Mohammed_Vashir_Resume.pdf" download>Download PDF ↓</a></div>
    <div className={styles.resumeLayout}>
      <aside className={styles.resumeAside}><strong>Mohammed Vashir</strong><p>Embedded systems<br />Robotics & automation</p><p>Tamil Nadu, India<br /><a href="tel:+919360108408">+91 9360108408</a><br /><a href={`mailto:${siteConfig.contacts.email}`}>Email me</a></p><SocialLinks className="resume-social-icons" label="Mohammed Vashir profiles" /><nav aria-label="Résumé sections"><a href="#profile">Profile</a><a href="#education">Education</a><a href="#technical-skills">Technical skills</a><a href="#selected-work">Selected work</a><a href="#initiative">Initiative</a><a href="#certifications">Certifications</a></nav></aside>
      <article className={styles.resumeDocument} aria-label="Mohammed Vashir résumé">
        <header className={styles.printIdentity}><h2>Mohammed Vashir</h2><p>Embedded systems · Robotics · Automation</p><p>Tamil Nadu, India · +91 9360108408 · {siteConfig.contacts.email}</p></header>
        <section id="profile" className={styles.resumeSection}><h2>Profile</h2><p>B.Tech Electrical and Electronics Engineering student focused on embedded systems, robotics and automation. Project work spans ESP32-based RF acquisition, multi-sensor IoT systems, robotic-arm CAD and computational kinematics. Developing 4tech as an engineering and prototype-development initiative.</p></section>
        <section id="education" className={styles.resumeSection}><h2>Education</h2><h3>{education.degree}</h3><p>{education.institution}, Vandalur</p><p className={styles.small}>{education.stage}</p></section>
        <section id="technical-skills" className={styles.resumeSection}><h2>Technical skills</h2><dl className={styles.resumeSkills}>{skillGroups.map(group => <div key={group.name}><dt>{group.name}</dt><dd>{group.skills.join(' · ')}</dd></div>)}</dl></section>
        <section id="selected-work" className={styles.resumeSection}><h2>Selected projects & research</h2>{resumeProjects.map(project => <div className={styles.resumeProject} key={project.id}><h3><Link href={`/projects/${project.id}`}>{project.name}</Link></h3><p className={styles.small}>{project.stage}</p><p>{project.text}</p></div>)}<Link href="/projects" className={styles.textLink}>Read technical details and validation status →</Link></section>
        <section id="initiative" className={styles.resumeSection}><h2>Initiative & startup engagement</h2><p><strong>4tech</strong> is an engineering and prototype-development initiative focused on integrated systems, robotics, RF measurement and practical technical collaboration.</p><p className="mt-4">Represented Edutainal Maveric World at Crescent’s 5th Mega Demo Day in 2026, explaining the startup’s work to students and investors.</p></section>
        <section id="certifications" className={styles.resumeSection}><h2>Certifications</h2>{certifications.map(cert => <div className={styles.resumeProject} key={cert.title}><h3>{cert.title}</h3><p>{cert.provider}</p><p className={styles.small}>{cert.date}</p></div>)}</section>
      </article>
    </div>
    <div className={styles.resumeFoot}><Link className={styles.textLink} href="/portfolio">← Back to my portfolio</Link><a className={styles.textLink} href="/assets/Mohammed_Vashir_Resume.pdf" target="_blank" rel="noopener noreferrer">Open the PDF résumé</a></div>
  </main>;
}
