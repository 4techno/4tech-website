import type { Metadata } from 'next';
import Link from 'next/link';
import MemberPortrait from '@/components/team/member-portrait';
import { teamMembers } from '@/lib/team';
import { skillGroups } from '@/lib/profile';
import styles from '@/components/team/team.module.css';

export const metadata: Metadata = {
  title: 'Mohammed Vashir | Founder',
  description: teamMembers[0].introduction,
  alternates: { canonical: '/founder' },
};

export default function FounderPage() {
  const member = teamMembers[0];

  return (
    <main id="main" className={`${styles.page} ed-shell`}>
      <div className="flex items-center gap-4 text-xs text-neutral-500 mb-6">
        <Link href="/" className={styles.back}>← Back to 4TECH</Link>
        <span>/</span>
        <Link href="/team" className={styles.back}>The Team</Link>
      </div>

      <header className={styles.hero}>
        <div>
          <p className={styles.role}>Founder / 4TECH</p>
          <h1>Mohammed<br />Vashir.</h1>
          <p>{member.introduction}</p>
          <div className={styles.links}>
            <Link href="/portfolio">Explore my portfolio</Link>
            <Link href="/resume">View résumé</Link>
            <Link href="/co-founder">Meet Sabeel Ahamed (Co-Founder) →</Link>
            <Link href="/team/yashwanth-c">Meet Yashwanth C (Co-Founder) →</Link>
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
        <h2>Engineering by study.<br />Builder by instinct.</h2>
        <div>
          <p>{member.biography}</p>
          <p>My completed project work spans automated antenna measurement, robotic-arm design and computational kinematics, ESP32 electronics and connected sensing systems.</p>
          <dl className={styles.facts}>
            <dt>Degree &amp; Institution</dt>
            <dd>
              {member.education}<br />
              {member.institution}
            </dd>
            <dt>Primary Focus</dt>
            <dd>{member.focus}</dd>
          </dl>
        </div>
      </section>

      <section className={styles.split}>
        <h2>Technical<br />Disciplines.</h2>
        <div>
          <ul className={styles.disciplines}>
            {skillGroups.map(group => <li key={group.name}><strong>{group.name}:</strong> {group.skills.join(' · ')}</li>)}
          </ul>
          <div className={styles.links}>
            <Link href="/projects">View my completed projects</Link>
            <Link href="/account">Commission an engineering project →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
