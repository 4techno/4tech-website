import Link from 'next/link';
import { teamMembers } from '@/lib/team';
import MemberPortrait from './member-portrait';
import styles from './team.module.css';

export default function TeamOverview({ home = false }: { home?: boolean }) {
  return (
    <section id={home ? 'about' : 'members'} className={`${styles.overview} ed-shell`} aria-labelledby="team-heading">
      <div className={styles.sectionHeading}>
        <div>
          <p className="ed-eyebrow">The leadership behind 4TECH</p>
          <h2 id="team-heading">Complementary skills.<br />Unified engineering.</h2>
        </div>
        <p>
          Meet the founders of 4TECH. Combining deep technical exploration in embedded systems, robotics, and RF with hardware verification, power electronics, and clear project execution.
        </p>
      </div>
      <div className={styles.memberGrid}>
        {teamMembers.map((member) => {
          const directPage = member.profile;
          return (
            <article className={styles.memberCard} key={member.id}>
              <MemberPortrait name={member.name} src={member.image} position={member.position} />
              <p className={styles.role}>{member.role} / 4TECH</p>
              <h3><Link href={directPage}>{member.name}</Link></h3>
              <p className={styles.focus}>{member.focus}</p>
              <p className={styles.memberIntro}>{member.introduction}</p>
              <div className={styles.links}>
                <Link href={directPage}>View profile &amp; story</Link>
                <Link href={member.portfolio}>Member portfolio</Link>
                <Link href={member.resume}>Résumé</Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
