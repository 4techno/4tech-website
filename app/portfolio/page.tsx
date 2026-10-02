import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config';
import { skillGroups, education, certifications } from '@/lib/profile';
import { featuredProjects } from '@/lib/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import JourneyNav from '@/components/journey-nav';
import Reveal from '@/components/reveal';
import SocialLinks from '@/components/social-links';
import MemberPortrait from '@/components/team/member-portrait';
import teamStyles from '@/components/team/team.module.css';
import { teamMembers } from '@/lib/team';
import ChapterNavigation from '@/components/portfolio/chapter-navigation';
import styles from '@/components/portfolio/portfolio.module.css';

export const metadata: Metadata = {
  title: 'Mohammed Vashir | Portfolio',
  description: 'The engineering portfolio of Mohammed Vashir: embedded systems, robotic mechanisms, RF instrumentation and computational research. Explore project work, technical skills and the résumé.',
  alternates: { canonical: '/portfolio' },
};

const method = [
  { title: 'Understand the problem.', label: 'Discover', text: 'Start with the use case, operating conditions and practical constraints. Decide what can be measured before deciding what to build.', outputs: ['Requirements', 'Feasibility', 'Test criteria'] },
  { title: 'Connect the disciplines.', label: 'Architect', text: 'Work through the relationship between electronics, software and mechanics. Use schematics, CAD and mathematical models to make the interfaces clear.', outputs: ['System diagram', 'Component choices', 'CAD & modelling'] },
  { title: 'Make the idea tangible.', label: 'Prototype', text: 'Develop individual subsystems, bring up firmware and integrate in focused iterations. Record what works and what needs another pass.', outputs: ['Subsystem bring-up', 'Firmware', 'Integration notes'] },
  { title: 'Let the evidence lead.', label: 'Validate', text: 'Compare observations with the original question. Report limitations alongside results and use the findings to guide the next iteration.', outputs: ['Measurements', 'Technical documentation', 'Next steps'] },
];

/** The uploaded portfolio's chapter structure, adapted to the existing server-rendered site. */
export default function PortfolioPage() {
  return <main id="main" className={styles.page}>
    <div className="container-shell"><JourneyNav current="portfolio" /></div>
    <section id="profile" className={`${styles.hero} container-shell`} aria-labelledby="portfolio-name">
      <div className={styles.heroCopy}>
        <p className={styles.kicker}><span>01</span> / Founder of 4TECH</p>
        <h1 id="portfolio-name">Mohammed<br /><span>Vashir.</span></h1>
        <p className={styles.heroRole}>Engineering student.<br />Builder by instinct.</p>
        <p className={styles.heroDescription}>I connect code, circuits and mechanisms to explore what engineering can make possible.</p>
        <div className={styles.heroActions}><a href="#works" className="button-primary">Explore my work </a><Link href="/resume" className={styles.textLink}>View résumé </Link></div>
      </div>
      <div className={teamStyles.portraitSlot}><MemberPortrait name="Mohammed Vashir" src={teamMembers[0].image} position={teamMembers[0].position} priority /></div>
    </section>
    <ChapterNavigation />
    <div className="container-shell">
      <section className={styles.biography} aria-label="Profile and education">
        <Reveal><p className={styles.manifesto}>A curiosity for how things work.<br /><span>A drive to build what comes next.</span></p></Reveal>
        <div className={styles.bioColumns}>
          <p>I’m a B.Tech Electrical and Electronics Engineering student at B.S. Abdur Rahman Crescent Institute of Science and Technology. My work spans embedded systems, robotic mechanisms and computational research. Through 4tech, I’m developing a practice around practical engineering and thoughtful experimentation.</p>
          <dl><div><dt>Role</dt><dd>Founder & project developer, 4TECH</dd></div><div><dt>Currently</dt><dd>{education.stage}</dd></div><div><dt>Focus</dt><dd>Embedded systems, robotics & RF</dd></div></dl>
        </div>
      </section>
      <section id="works" className={styles.chapter} aria-labelledby="works-title">
        <Reveal><p className={styles.kicker}><span>02</span> / Selected work</p><h2 id="works-title">Engineering,<br /><span>put into practice.</span></h2><p className={styles.sectionDescription}>A selection of my completed projects. Read the technical approach, system architecture and engineering contribution behind the work.</p></Reveal>
        <div className={styles.workGrid}>{featuredProjects.map((project, index) => <Reveal key={project.id} delay={(index % 2) * .08}><ProjectCard project={project} index={index} /></Reveal>)}</div>
        <div className={styles.collectionFoot}><p>Explore RF systems, autonomous platforms and experimental engineering.</p><Link href="/projects" className={styles.textLink}>Full project collection </Link></div>
      </section>
      <section id="skills" className={styles.chapter} aria-labelledby="skills-title">
        <Reveal><p className={styles.kicker}><span>03</span> / Technical disciplines</p><h2 id="skills-title">Across disciplines.<br /><span>Into practice.</span></h2><p className={styles.sectionDescription}>The tools I use to connect a physical problem with a working design.</p></Reveal>
        <div className={styles.skills}>{skillGroups.map((group, index) => <Reveal key={group.name}><article className={styles.skillRow}><span className={styles.skillIndex} aria-hidden="true">0{index + 1}</span><div><h3>{group.name}</h3><p>{group.description}</p><Link href={`/projects/${group.project}`} className={styles.skillProject}>Explore related work</Link></div><ul aria-label={`${group.name} skills`}>{group.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></article></Reveal>)}</div>
        <div className={styles.education}><div><p className={styles.kicker}>Education</p><h3>Learning is part<br />of the practice.</h3><p>{education.degree.replace('—', 'in')}<br />{education.institution}<br />{education.location}</p></div><div className={styles.certifications}><p className={styles.kicker}>Training & certifications</p>{certifications.map(cert => <article key={cert.title}><h4>{cert.title}</h4><p>{cert.provider}</p><small>{cert.date}</small></article>)}</div></div>
      </section>
      <section id="method" className={`${styles.chapter} ${styles.method}`} aria-labelledby="method-title">
        <div className={styles.methodHeading}><Reveal><p className={styles.kicker}><span>04</span> / The approach</p><h2 id="method-title">Question.<br />Connect.<br /><span>Create.</span></h2><p className={styles.sectionDescription}>A considered process, from the first question to the next useful observation.</p></Reveal></div>
        <div className={styles.methodSteps}>{method.map((step, index) => <details key={step.label} open={index === 0}><summary><span className={styles.methodIndex}>0{index + 1}</span><span>{step.label}</span><span className={styles.methodToggle} aria-hidden="true" /></summary><div className={styles.methodDetail}><h3>{step.title}</h3><p>{step.text}</p><ul>{step.outputs.map(output => <li key={output}>{output}</li>)}</ul></div></details>)}</div>
      </section>
      <section id="dialogue" className={styles.contact} aria-labelledby="contact-title">
        <Reveal><p className={styles.kicker}><span>05</span> / Start a dialogue</p><h2 id="contact-title">What could we<br /><span>build together?</span></h2><p>A technical challenge, a prototype or a new collaboration. I’d like to hear what you have in mind.</p></Reveal>
        <div className={styles.contactBottom}><div className={styles.contactActions}><Link href="/account" className="button-primary">Discuss a project </Link><a href={`mailto:${siteConfig.contacts.email}`} className={styles.textLink}>Send an email </a></div><SocialLinks label="Mohammed Vashir social profiles" /></div>
        <div className={styles.resumeBand}><div><span>Keep the conversation going.</span><p>A concise overview of my education, skills and selected work.</p></div><a href="/assets/Mohammed_Vashir_Resume.pdf" download className={styles.textLink}>Download résumé <span aria-hidden="true">↓</span></a></div>
        <div className={styles.resumeBand} style={{ marginTop: '20px' }}><div><span>Explore Co-Founder portfolio</span><p>Discover Sabeel Ahamed’s embedded hardware, wireless power transfer, and technical leadership.</p></div><Link href="/portfolio/sabeel-ahamed" className={styles.textLink}>Meet Sabeel Ahamed <span aria-hidden="true">→</span></Link></div>
      </section>
    </div>
  </main>;
}
