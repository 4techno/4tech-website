import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { teamMembers } from '@/lib/team';
import MemberPortrait from '@/components/team/member-portrait';
import styles from '@/components/team/team.module.css';
export const dynamicParams = false;
export function generateStaticParams() { return teamMembers.map(member => ({ slug: member.id })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const member = teamMembers.find(person => person.id === slug); if (!member) notFound();
  return { title: `${member.name} | ${member.role}`, description: member.introduction, alternates: { canonical: member.id === 'mohammed-vashir' ? '/founder' : '/co-founder' } };
}
export default async function MemberPage({ params }: Props) {
  const { slug } = await params; const member = teamMembers.find(person => person.id === slug); if (!member) notFound();
  return <main id="main" className={`${styles.page} ed-shell`}><Link href="/team" className={styles.back}>← Meet the team</Link><header className={styles.hero}><div><p className={styles.role}>{member.role} / 4TECH</p><h1>{member.name}</h1><p>{member.headline}</p><div className={styles.links}><Link href={member.portfolio}>Explore my portfolio</Link><Link href={member.resume}>View résumé</Link></div></div><MemberPortrait name={member.name} src={member.image} position={member.position} priority /></header><section className={styles.split}><h2>The person<br />behind the work.</h2><div><p>{member.biography}</p><p>{member.introduction}</p><dl className={styles.facts}><dt>Education</dt><dd>{member.education}<br />{member.institution}</dd></dl></div></section><section className={styles.split}><h2>Where I contribute.</h2><div><ul className={styles.disciplines}>{member.disciplines.map(value => <li key={value}>{value}</li>)}</ul><div className={styles.links}><Link href={member.portfolio}>View projects, skills and experience</Link><Link href="/account">Discuss a project →</Link></div></div></section></main>;
}
