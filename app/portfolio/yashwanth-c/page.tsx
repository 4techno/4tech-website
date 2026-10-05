import type { Metadata } from 'next';
import Link from 'next/link';
import { teamMembers, yashwanthResearch, yashwanthSkills } from '@/lib/team';
import MemberPortrait from '@/components/team/member-portrait';
import PortfolioReveal from '@/components/portfolio/portfolio-reveal';
import styles from '@/components/team/team.module.css';

export const metadata: Metadata = {
  title: 'Yashwanth C | Portfolio',
  description: 'Yashwanth C, co-founder of 4TECH. Circuit design, embedded hardware, robotic kinematics research and engineering project coordination.',
  alternates: { canonical: '/portfolio/yashwanth-c' },
};

export default function YashwanthPortfolio() {
  const member = teamMembers.find(person => person.id === 'yashwanth-c')!;
  return (
    <main id="main" className={`${styles.page} ed-shell member-motion-portfolio`}>
      <Link href={member.profile} className={styles.back}>Back to Yashwanth’s profile</Link>
      <header className={styles.hero}>
        <div>
          <p className={styles.role}>Co-founder / Personal portfolio</p>
          <h1>Yashwanth C.</h1>
          <p>{member.headline} Circuit design, computational robotics and the planning that connects an idea to its prototype.</p>
          <div className={styles.links}>
            <a href="#yashwanth-research">Explore my research</a>
            <Link href={member.resume}>View résumé</Link>
          </div>
        </div>
        <MemberPortrait name={member.name} src={member.image} position={member.position} priority />
      </header>
      <PortfolioReveal>
        <section className={styles.split}>
          <h2>From circuit<br />to system.</h2>
          <div>
            <p>{member.biography}</p>
            <dl className={styles.facts}>
              <dt>Education</dt>
              <dd>{member.education}<br />{member.institution}</dd>
              <dt>Engineering foundations</dt>
              <dd>Circuit analysis, electromagnetic fields, analog electronics, power electronics and control systems.</dd>
            </dl>
          </div>
        </section>
      </PortfolioReveal>
      <PortfolioReveal>
        <section id="yashwanth-research" className={styles.split}>
          <div><p className="ed-eyebrow">Selected research</p><h2>Learning the<br />language of motion.</h2></div>
          <article className={styles.project}>
            <h3>{yashwanthResearch.title}</h3>
            <p className={styles.meta}>{yashwanthResearch.role}<br />{yashwanthResearch.status}</p>
            <p>{yashwanthResearch.summary}</p>
            <p>{yashwanthResearch.approach}</p>
            <p>{yashwanthResearch.scope}</p>
            <ul className={styles.tags}>{yashwanthResearch.technologies.map(value => <li key={value}>{value}</li>)}</ul>
          </article>
        </section>
      </PortfolioReveal>
      <PortfolioReveal>
        <section className={styles.split}>
          <h2>Technical<br />capabilities.</h2>
          <div>{yashwanthSkills.map(group => <article className={styles.skillGroup} key={group.name}>
            <h3>{group.name}</h3>
            <ul className={styles.tags}>{group.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
          </article>)}</div>
        </section>
      </PortfolioReveal>
      <PortfolioReveal>
        <section className={styles.split}>
          <h2>Engineering<br />and delivery.</h2>
          <div className={styles.leadership}>
            <article><h3>Co-founder, 4TECH</h3><small>2025–present</small><p>Project scoping, feasibility analysis, prototyping workflows and operational delivery, with responsibility for resource planning and budgeting.</p></article>
            <article><h3>Engineering Intern, Lansub Technology</h3><small>Hardware validation experience</small><p>Supported hardware-software validation, system requirements and board-level testing. Work included circuit debugging, component verification and performance analysis against design requirements.</p></article>
            <article><h3>Co-Treasurer &amp; Event Coordinator</h3><small>Crescent Energy Club · 2025–present</small><p>Club allocations, event budgets and coordination of workshops and campus events, including logistics and guest-speaker arrangements.</p></article>
          </div>
        </section>
      </PortfolioReveal>
      <section className={styles.split}>
        <h2>Build with us.</h2>
        <div><p>Start a conversation about engineering research, hardware prototypes or a project that needs a clear technical scope.</p><div className={styles.links}>
          <Link href="/account">Start a project enquiry</Link>
          <Link href="/team">Meet the 4TECH team</Link>
          <Link href={member.resume}>Education &amp; résumé</Link>
        </div></div>
      </section>
    </main>
  );
}
