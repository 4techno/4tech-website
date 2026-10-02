import type { Metadata } from 'next';
import Link from 'next/link';
import MemberPortrait from '@/components/team/member-portrait';
import { teamMembers, sabeelProjects, sabeelSkills } from '@/lib/team';
import styles from '@/components/team/team.module.css';

export const metadata: Metadata = {
  title: 'Sabeel Ahamed | Co-founder',
  description: teamMembers[1].introduction,
  alternates: { canonical: '/co-founder' },
};

export default function CoFounderPage() {
  const member = teamMembers[1];

  return (
    <main id="main" className={`${styles.page} ed-shell`}>
      <div className="flex items-center gap-4 text-xs text-neutral-500 mb-6">
        <Link href="/" className={styles.back}>← Back to 4TECH</Link>
        <span>/</span>
        <Link href="/team" className={styles.back}>The Team</Link>
      </div>

      <header className={styles.hero}>
        <div>
          <p className={styles.role}>Co-Founder / 4TECH</p>
          <h1>Sabeel<br />Ahamed.</h1>
          <p>{member.introduction}</p>
          <div className={styles.links}>
            <Link href="/portfolio/sabeel-ahamed">Explore member portfolio</Link>
            <Link href="/resume/sabeel-ahamed">View résumé</Link>
            <Link href="/founder">Meet Mohammed Vashir (Founder) →</Link>
          </div>
        </div>
        <MemberPortrait
          name={member.name}
          src={member.image}
          position={member.position}
          priority
        />
      </header>

      <section className={styles.split}>
        <h2>Practical hardware.<br />Clear coordination.</h2>
        <div>
          <p>{member.biography}</p>
          <dl className={styles.facts}>
            <dt>University &amp; Degree</dt>
            <dd>
              {member.education}<br />
              {member.institution}
            </dd>
            <dt>Higher Secondary</dt>
            <dd>Velankanni Matriculation Higher Secondary School</dd>
            <dt>Contact</dt>
            <dd><a href="tel:+918248823675">+91 82488 23675</a></dd>
          </dl>
        </div>
      </section>

      <section id="sabeel-projects" className={styles.split}>
        <div>
          <p className="ed-eyebrow">Technical Projects Portfolio</p>
          <h2>Circuits built<br />for real impact.</h2>
        </div>
        <div className={styles.projectList}>
          {sabeelProjects.map((project) => (
            <article className={styles.project} key={project.title}>
              <h3>{project.title}</h3>
              <p className={styles.meta}>
                {project.role} · {project.period}
              </p>
              <p>{project.summary}</p>
              <p>{project.work}</p>
              <p>{project.next}</p>
              <ul className={styles.tags}>
                {project.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.split}>
        <h2>Technical<br />Capabilities.</h2>
        <div>
          {sabeelSkills.map((group) => (
            <article className={styles.skillGroup} key={group.name}>
              <h3>{group.name}</h3>
              <ul className={styles.tags}>
                {group.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.split}>
        <h2>Leadership &amp;<br />Activities.</h2>
        <div className={styles.leadership}>
          <article>
            <h3>Joint Secretary</h3>
            <small>Crescent Energy Club · 2026–2027</small>
            <p>Supporting student engagement and collaborative activities around energy and engineering.</p>
          </article>
          <article>
            <h3>Chief Event Coordinator — 17 Frames</h3>
            <small>September 2026</small>
            <p>Coordinated student outreach, class visits and promotional material for an intra-college SDG short-film contest. Prepared agendas, certificates and judging sheets with faculty, coordinators and volunteers.</p>
          </article>
        </div>
      </section>

      <section className={styles.split}>
        <h2>Get in touch.</h2>
        <div>
          <p>For technical discussions, hardware collaboration, or project inquiries with 4TECH.</p>
          <div className={styles.links}>
            <a href="tel:+918248823675">Call Sabeel (+91 82488 23675)</a>
            <Link href="/account">Start an enquiry →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
