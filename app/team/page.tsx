import type { Metadata } from 'next';
import TeamOverview from '@/components/team/team-overview';
import styles from '@/components/team/team.module.css';
export const metadata: Metadata = { title: 'Founders & team', description: 'Meet Mohammed Vashir, Sabeel Ahamed and Yashwanth C, the founder and co-founders of 4TECH. Explore their portfolios, engineering work and experience.', alternates: { canonical: '/team' } };
export default function TeamPage() {
  return <main id="main" className={styles.page}><header className={`ed-shell ${styles.teamIntro}`}><p className="ed-eyebrow">4TECH / The team</p><h1>The people.<br />Behind 4TECH.</h1><p>Engineering grows through complementary skills, considered decisions and a shared commitment to the work.</p></header><div className={styles.teamPageOverview}><TeamOverview /></div></main>;
}
