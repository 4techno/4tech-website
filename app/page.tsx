import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import GalaxyExperience from '@/components/galaxy-experience';
import ExpertiseExperience from '@/components/expertise-experience';
import SkillsMarquee from '@/components/skills-marquee';
import Reveal from '@/components/reveal';
import TextReveal from '@/components/text-reveal';
import EngineeringMethod from '@/components/engineering-method';
import ServiceArt from '@/components/service-art';
import SignalField from '@/components/signal-field';
import SocialLinks from '@/components/social-links';
import { siteConfig } from '@/config';

export const metadata: Metadata = { alternates: { canonical: '/' } };
const services = [
  { title: 'Integrated systems', text: 'Connect embedded control, sensing and mechanical design into a considered whole.', label: 'HARDWARE. SOFTWARE. ONE SYSTEM.', discipline: 'SYSTEMS', tags: ['Embedded', 'Robotics', 'Automation'] },
  { title: 'Prototype engineering', text: 'Move from a promising idea to a testable prototype, with clear requirements at every step.', label: 'FROM REQUIREMENTS TO VALIDATION.', discipline: 'PROTOTYPING', tags: ['Electronics', 'Mechanical design', 'Integration'] },
  { title: 'Research & development', text: 'Explore RF systems, robotic motion and experimental methods through purposeful investigation.', label: 'ASK. MODEL. MEASURE. REFINE.', discipline: 'RESEARCH', tags: ['RF technology', 'Simulation', 'Experimental R&D'] },
];

/** Server-rendered content with isolated, progressively enhanced motion islands. */
export default function Home() {
  return <main id="main">
    <section className="hero hero-premium" aria-labelledby="hero-heading">
      <div className="hero-grid" aria-hidden="true" />
      <GalaxyExperience />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-rail hero-rail-left" aria-hidden="true"><span>INDEPENDENT THINKING</span><i>+</i></div>
      <div className="hero-rail hero-rail-right" aria-hidden="true"><span>INTEGRATED ENGINEERING</span><i>+</i></div>
      <div className="hero-content container-shell">
        <Reveal><p className="hero-kicker"><span className="status-dot"/>Independent engineering &amp; creative technology<span className="hero-location">Kalpakkam, India</span></p></Reveal>
        <h1 id="hero-heading"><TextReveal text="Ideas into"/><br/><TextReveal text="reality." className="hero-metal" delay={.16}/></h1>
        <Reveal delay={.25}><p className="hero-description">A spark is only the beginning.<br className="hero-description-break"/> Projects that work. Knowledge that stays.<br/>Engineering possibilities, together.</p>
          <div className="hero-actions"><Link className="button-primary" href="/projects">Explore the work <span aria-hidden="true">↗</span></Link><a className="button-secondary" href="#contact">Start a conversation <span aria-hidden="true">↗</span></a></div>
        </Reveal>
      </div>
      <div className="hero-bottom container-shell"><a className="discover-link" href="#expertise"><span aria-hidden="true">↓</span>Discover what we do</a><span className="galaxy-hint"><span aria-hidden="true">⌖</span> A FIELD OF POSSIBILITIES. MOVE TO EXPLORE.</span><span className="hero-coordinate">KALPAKKAM / INDIA</span></div>
    </section>
    <SkillsMarquee />
    <section id="expertise" className="expertise-section container-shell">
      <Reveal><div className="section-heading"><p className="section-kicker">{`{ 01 / WHAT WE DO }_`}</p><div className="heading-split"><h2><TextReveal text="Built with purpose."/><br/><span className="heading-muted"><TextReveal text="Designed as a system."/></span></h2><p>From first principles<br/>to integrated prototypes.<br/>With a clear path to validation.</p></div></div></Reveal>
      <ExpertiseExperience>{services.map((service, i) => <article key={service.title} className={`service-card service-card-${i}`} data-service-panel>
        <div className="service-top"><span>0{i+1} / {service.discipline}</span><span className="service-status" aria-hidden="true"/></div>
        <div className="service-art-frame"><ServiceArt variant={i}/></div><h3>{service.title}</h3><p>{service.text}</p><ul className="service-tags" aria-label="Focus areas">{service.tags.map(tag => <li key={tag}>{tag}</li>)}</ul><div className="service-bottom">{service.label}</div>
      </article>)}</ExpertiseExperience>
      <Reveal><div className="expertise-tail"><p>Complex challenges.<br/><span>Considered engineering.</span></p><Link href="/projects">Explore the project collection <span aria-hidden="true">↗</span></Link></div></Reveal>
    </section>
    <section className="method-section container-shell" aria-labelledby="method-heading">
      <Reveal><div className="section-heading"><p className="section-kicker">{`{ 02 / FROM POSSIBILITY TO PROTOTYPE }_`}</p><div className="heading-split"><h2 id="method-heading"><TextReveal text="Good engineering"/><br/><span className="heading-muted"><TextReveal text="is a process."/></span></h2><p>One connected way of working.<br/>Explore each stage of the journey.</p></div></div></Reveal>
      <EngineeringMethod />
    </section>
    <section id="about" className="founder-section container-shell">
      <Reveal className="founder-image-wrap"><div className="founder-image-frame"><Image src={siteConfig.founder.image} alt={siteConfig.founder.imageAlt} fill sizes="(max-width: 768px) 90vw, 42vw" style={{ objectFit: 'cover', objectPosition: siteConfig.founder.imagePosition }}/><div className="portrait-gradient"/><span className="portrait-corner" aria-hidden="true">+</span><div className="portrait-caption"><span>Mohammed Vashir</span><span>FOUNDER / 4TECH</span></div></div><span className="portrait-index">FIG. 01 — THE PERSON BEHIND THE PROJECTS</span></Reveal>
      <Reveal className="founder-copy"><p className="section-kicker">{`{ 03 / THE FOUNDER }_`}</p><h2><TextReveal text="Engineer by study."/><br/><span className="heading-muted"><TextReveal text="Builder by instinct."/></span></h2><p className="founder-bio">I’m Mohammed Vashir, a B.Tech Electrical and Electronics Engineering student at B.S. Abdur Rahman Crescent Institute of Science and Technology. My work spans embedded systems, robotic mechanisms, and computational research.</p><div className="founder-details"><div><span>BASED IN</span><p>Kalpakkam, Tamil Nadu</p></div><div><span>WORKING WITH</span><p>Students &amp; startups</p></div></div><div className="founder-links"><Link className="button-primary" href="/portfolio">Explore my portfolio <span aria-hidden="true">↗</span></Link><Link href="/resume">Read my résumé <span aria-hidden="true">↗</span></Link></div></Reveal>
    </section>
    <section id="contact" className="contact-section">
      <SignalField />
      <div className="contact-orbit" aria-hidden="true"/><div className="container-shell contact-inner"><Reveal><p className="section-kicker">{`{ 04 / LET’S BUILD SOMETHING }_`}</p><h2><TextReveal text="Every great project"/><br/><TextReveal text="starts with"/> <span className="contact-highlight"><TextReveal text="'what if?'"/></span></h2></Reveal><Reveal><div className="contact-bottom"><div><p>Tell us what you’re thinking.<br/>Let’s find out what’s possible.</p><SocialLinks className="contact-socials" label="Contact 4tech"/><p className="contact-location">{siteConfig.contacts.location}</p></div><div className="contact-actions"><Link href="/account" className="button-primary">Discuss your project <span aria-hidden="true">↗</span></Link><Link href="/portfolio" className="button-secondary">Meet the founder <span aria-hidden="true">↗</span></Link><span>Send a private enquiry. Follow your updates.</span></div></div></Reveal></div>
    </section>
  </main>;
}
