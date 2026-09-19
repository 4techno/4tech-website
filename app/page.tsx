import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import GalaxyExperience from '@/components/galaxy-experience';
import ExpertiseExperience from '@/components/expertise-experience';
import SkillsMarquee from '@/components/skills-marquee';
import Reveal from '@/components/reveal';
import ServiceArt from '@/components/service-art';
import SocialLinks from '@/components/social-links';
import { siteConfig } from '@/config';

export const metadata: Metadata = { alternates: { canonical: '/' } };
const services = [
  { title: 'Integrated systems', text: 'Connect embedded control, sensing and mechanical design.', label: 'HARDWARE. SOFTWARE. ONE SYSTEM.', discipline: 'SYSTEMS' },
  { title: 'Prototype engineering', text: 'Define requirements, explore feasibility and develop testable prototypes.', label: 'FROM REQUIREMENTS TO VALIDATION.', discipline: 'PROTOTYPING' },
  { title: 'Research & development', text: 'Investigate RF systems, robotic motion and experimental methods.', label: 'ASK. MODEL. MEASURE. REFINE.', discipline: 'RESEARCH' },
];

/** Server Component. All meaningful copy, headings, links and image markup render on the server. */
export default function Home() {
  return <main id="main">
    <section className="hero" aria-labelledby="hero-heading">
      <GalaxyExperience />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-content container-shell">
        <Reveal><p className="hero-kicker"><span className="status-dot"/>Independent engineering &amp; research <span className="hero-location">— Kalpakkam, India</span></p></Reveal>
        <Reveal delay={.08}><h1 id="hero-heading">Ideas into<br/><span>reality.</span><i aria-hidden>✳</i></h1></Reveal>
        <Reveal delay={.16}><p className="hero-description">A spark is only the beginning.<br/>Embedded intelligence. Robotic motion. RF systems.<br/>Engineering possibilities, together.</p>
          <div className="hero-actions"><Link className="button-primary" href="/projects">Explore the work <span aria-hidden>↗</span></Link><a className="button-secondary" href="#contact">Start a conversation <span aria-hidden>↗</span></a></div>
        </Reveal>
      </div>
      <div className="hero-bottom container-shell"><span className="font-mono">{`{ SCROLL TO DISCOVER }_`}</span><a href="#expertise" aria-label="Scroll to expertise">↓</a><span className="hidden sm:block">ENGINEERING × CURIOSITY</span></div>
    </section>
    <SkillsMarquee />
    <section id="expertise" className="expertise-section container-shell">
      <Reveal><div className="section-heading"><p className="section-kicker">{`{ 01 / WHAT WE DO }_`}</p><div className="heading-split"><h2>Built with purpose.<br/><span className="text-zinc-500">Designed as a system.</span></h2><p>From first principles<br/>to integrated prototypes.<br/>With a clear path to validation.</p></div></div></Reveal>
      <ExpertiseExperience>{services.map((service, i) => <article key={service.title} className={`service-card service-card-${i}`} data-service-panel>
        <div className="service-top"><span>0{i+1} / {service.discipline}</span><span className="service-status" aria-hidden="true"/></div><ServiceArt variant={i}/><h3>{service.title}</h3><p>{service.text}</p><div className="service-bottom">{service.label}</div>
      </article>)}</ExpertiseExperience>
      <Reveal><div className="expertise-tail"><span className="font-mono">EXPLORE <b>→</b> DESIGN <b>→</b> BUILD <b>→</b> TEST <b>→</b> UNDERSTAND</span><Link href="/projects">Explore the project collection <span aria-hidden>↗</span></Link></div></Reveal>
    </section>
    <section id="about" className="founder-section container-shell">
      <Reveal className="founder-image-wrap"><div className="founder-image-frame"><Image src={siteConfig.founder.image} alt={siteConfig.founder.imageAlt} fill sizes="(max-width: 768px) 90vw, 42vw" style={{ objectFit: 'cover', objectPosition: siteConfig.founder.imagePosition }}/><div className="portrait-gradient"/><span className="portrait-corner" aria-hidden>+</span><div className="portrait-caption"><span>Mohammed Vashir</span><span>FOUNDER / 4TECH</span></div></div><span className="portrait-index">FIG. 01 — THE PERSON BEHIND THE PROJECTS</span></Reveal>
      <Reveal className="founder-copy"><p className="section-kicker">{`{ 02 / THE FOUNDER }_`}</p><h2>Engineer by study.<br/><span className="text-zinc-500">Builder by instinct.</span></h2><p className="founder-bio">I’m Mohammed Vashir, a B.Tech Electrical and Electronics Engineering student at B.S. Abdur Rahman Crescent Institute of Science and Technology. My work spans embedded systems, robotic mechanisms, and computational research.</p><div className="founder-details"><div><span>BASED IN</span><p>Kalpakkam, Tamil Nadu</p></div><div><span>WORKING WITH</span><p>Students &amp; startups</p></div></div><div className="founder-links"><Link className="button-primary" href="/portfolio">Explore my portfolio <span aria-hidden>↗</span></Link><Link href="/resume">Read my résumé ↗</Link></div></Reveal>
    </section>
    <section id="contact" className="contact-section">
      <div className="contact-orbit" aria-hidden="true"/><div className="container-shell contact-inner"><Reveal><p className="section-kicker">{`{ 03 / LET’S BUILD SOMETHING }_`}</p><h2>Every great project<br/>starts with <span>&apos;what if?&apos;</span></h2></Reveal><Reveal><div className="contact-bottom"><div><p>Tell us what you’re thinking.<br/>Let’s find out what’s possible.</p><SocialLinks className="contact-socials" label="Contact 4tech"/><p className="contact-location">{siteConfig.contacts.location}</p></div><div className="contact-actions"><Link href="/account" className="button-primary">Discuss your project <span aria-hidden>↗</span></Link><Link href="/portfolio" className="button-secondary">Meet the founder <span aria-hidden>↗</span></Link><span>Send a private enquiry. Follow your updates.</span></div></div></Reveal></div>
    </section>
  </main>;
}
