import type { Metadata } from 'next';
import Link from 'next/link';
import { teamMembers, yashwanthCertifications, yashwanthResearch, yashwanthSkills } from '@/lib/team';
import PrintResume from '@/components/team/print-resume';
import styles from '@/components/team/team.module.css';

export const metadata: Metadata = {
  title: 'Yashwanth C | Résumé',
  description: 'Education, engineering experience, robotics research and technical skills of Yashwanth C, co-founder of 4TECH.',
  alternates: { canonical: '/resume/yashwanth-c' },
};

export default function YashwanthResume() {
  const member = teamMembers.find(person => person.id === 'yashwanth-c')!;
  return (
    <main id="main" className={`${styles.page} ed-shell`}>
      <article className={styles.resume}>
        <Link href={member.portfolio} className={styles.back}>Back to Yashwanth’s portfolio</Link>
        <header>
          <p className={styles.role}>Résumé</p>
          <h1>Yashwanth C</h1>
          <p>4TECH Co-founder · Electrical and Electronics Engineering Student</p>
          <div className={styles.links}><a href="/assets/Yashwanth_C_Resume.pdf" download>Download supplied résumé (PDF)</a><Link href={member.profile}>Co-founder profile</Link></div>
          <PrintResume />
        </header>
        <section><h2>Profile</h2><p>{member.introduction} Research interests include neural-network kinematics for robotics, power conversion and resonant circuits.</p></section>
        <section>
          <h2>Education</h2>
          <h3>B.Tech Electrical and Electronics Engineering</h3>
          <p>{member.institution} · July 2024–present</p>
          <p>Coursework: Circuit Analysis, Electromagnetic Fields, Analog Electronics, Power Electronics and Control Systems.</p>
          <h3>Higher Secondary Education</h3><p>Neelan Matriculation Higher Secondary School · Completed 2024</p>
        </section>
        <section><h2>Technical skills</h2>{yashwanthSkills.map(group => <div key={group.name}><h3>{group.name}</h3><p>{group.skills.join(' · ')}</p></div>)}</section>
        <section>
          <h2>Experience</h2>
          <h3>Co-founder, 4TECH</h3><p>2025–present. Project scoping, prototype development, feasibility analysis, resource management and budgeting.</p>
          <h3>Engineering Intern, Lansub Technology</h3><p>Supported hardware-software validation, system requirements and board-level testing. Conducted circuit debugging, component verification and performance analysis against design requirements.</p>
        </section>
        <section><h2>Selected research</h2><h3>{yashwanthResearch.title}</h3><p>{yashwanthResearch.role} · {yashwanthResearch.status}</p><p>{yashwanthResearch.summary}</p><p>{yashwanthResearch.approach}</p></section>
        <section><h2>Leadership</h2><h3>Co-Treasurer &amp; Event Coordinator</h3><p>Crescent Energy Club · 2025–present. Club allocations, event budgets, financial administration and campus-event coordination.</p></section>
        <section><h2>Certifications</h2>{yashwanthCertifications.map(item => <p key={item}>{item}</p>)}</section>
        <section><h2>Languages</h2><p>English · Tamil · Telugu (spoken) · German (A1 study in progress)</p></section>
      </article>
    </main>
  );
}
