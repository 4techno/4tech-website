'use client';

import { siteConfig } from '@/config';
import { useEffect, useRef } from 'react';
import { ServiceIcon } from './editorial-art';
import TeamOverview from '@/components/team/team-overview';
import { projects } from '@/lib/editorial';
import { ReferenceHands } from './reference-hands';
import AiHomeSection from '@/components/ai/ai-home-section';

const services = [
  ['Embedded systems', 'Intelligence, built in.', 'Connect microcontrollers, sensors and control firmware into thoughtful, testable hardware.'],
  ['Robotics & mechanisms', 'From calculation to movement.', 'Explore mechanical assemblies, inverse kinematics and the interfaces that bring motion to life.'],
  ['RF & instrumentation', 'Make the invisible observable.', 'Develop measurement concepts, acquisition workflows and experiments for radio-frequency systems.'],
  ['Connected systems', 'Signals with context.', 'Bring device readings, connectivity and meaningful system state together in a clear web interface.'],
  ['Research & simulation', 'Give an idea its first form.', 'Turn a technical question into a defined scope, computational simulation, and a sequence of milestones.'],
  ['Technical learning', 'Build it. Understand it.', 'Learn through guided projects in microcontrollers, electronics, automation and engineering computation.']
];

const principles = [
  ['01', 'Understand the problem.', 'Identify technical constraints, functional requirements, and the core engineering challenge before selecting components.', 'Clarity at the start'],
  ['02', 'Define scope & milestones.', 'Break complex systems into measurable feasibility stages, circuit architecture, firmware requirements, and deliverables.', 'Defined milestones'],
  ['03', 'Design & prototype.', 'Bring hardware, firmware, and mechanical geometry into physical existence through rapid prototyping and iteration.', 'Integration by design'],
  ['04', 'Test, document & improve.', 'Validate electrical and functional parameters against real criteria. Document what works, what needs refinement, and next steps.', 'Rigorous validation']
];

export default function EditorialHome() {
  const hero = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations: Animation[] = [];
    const frames = new Set<number>();
    const observer = new IntersectionObserver((entries) => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      if (!reduce.matches) {
        animations.push(el.animate([{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 800, delay: Number(el.dataset.delay || 0), easing: 'cubic-bezier(.4,0,.2,1)', fill: 'backwards' }));
        const number = el.querySelector<HTMLElement>('[data-count]');
        if (number) {
          const target = Number(number.dataset.count), start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / 1500, 1);
            number.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
            if (t < 1) frames.add(requestAnimationFrame(tick));
          };
          frames.add(requestAnimationFrame(tick));
        }
      }
      observer.unobserve(el);
    }), { threshold: .15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.ed-reveal').forEach(el => observer.observe(el));
    const section = hero.current;
    const move = (e: PointerEvent) => {
      if (reduce.matches || e.pointerType !== 'mouse' || !section) return;
      const r = section.getBoundingClientRect();
      section.style.setProperty('--reach-x', ((e.clientX - r.left) / r.width - .5) * 12 + 'px');
      section.style.setProperty('--reach-y', ((e.clientY - r.top) / r.height - .5) * 7 + 'px');
    };
    const reset = () => {
      section?.style.setProperty('--reach-x', '0px');
      section?.style.setProperty('--reach-y', '0px');
    };
    section?.addEventListener('pointermove', move, { passive: true });
    section?.addEventListener('pointerleave', reset);

    return () => {
      observer.disconnect();
      animations.forEach(a => a.cancel());
      frames.forEach(cancelAnimationFrame);
      section?.removeEventListener('pointermove', move);
      section?.removeEventListener('pointerleave', reset);
    };
  }, []);

  return (
    <>
      <main id="main" className="ed-editorial-home">
        <section id="home" ref={hero} className="ed-hero" aria-labelledby="hero-title">
          <div className="ed-hero-wash" aria-hidden="true" />
          <div className="ed-hero-copy">
            <p className="ed-eyebrow">
              Independent engineering &amp; creative technology practice · Tamil Nadu, India
            </p>
            <h1 id="hero-title">
              Technology That<br />
              <em>Shapes Tomorrow.</em>
            </h1>
            <p>
              We develop embedded systems, robotics and RF prototypes, bringing hardware, software and practical engineering together.
            </p>
            <a href="#contact" className="ed-button ed-hero-cta">
              Get Started
            </a>
          </div>

          <div className="ed-hands-art ed-reference-art">
            <ReferenceHands />
          </div>

          <div className="ed-hero-caption ed-shell">
            <span>HUMAN CURIOSITY</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>ENGINEERED POSSIBILITY</span>
          </div>
        </section>

        <section className="ed-tools-strip ed-shell" aria-label="Engineering tools">
          <p>The tools behind the thinking.</p>
          <div className="ed-tools-row">
            <span>◈ ESP32</span>
            <span className="ed-tool-kicad">KiCad</span>
            <span>Python.</span>
            <span className="ed-tool-cad">SOLIDWORKS</span>
            <span>MATLAB</span>
            <span>C / C++</span>
          </div>
          <small>Technologies used in our project studies.</small>
        </section>

        <section id="services" className="ed-section ed-shell" aria-labelledby="services-title">
          <span id="expertise" className="ed-anchor" aria-hidden="true" />
          <div className="ed-section-header ed-reveal">
            <div>
              <p className="ed-eyebrow">What we do</p>
              <h2 id="services-title">
                Ideas need more<br />
                than a spark.
              </h2>
            </div>
            <p className="ed-section-intro">
              From the first circuit to the larger system, we bring engineering, computation and practical learning together.
            </p>
          </div>
          <div className="ed-services-grid">
            {services.map(([title, lead, body], i) => (
              <article className="ed-service-card ed-reveal" key={title} data-delay={(i % 3) * 100}>
                <div className="ed-service-top">
                  <span className="ed-service-icon">
                    <ServiceIcon index={i} />
                  </span>
                  <span className="ed-index-number">0{i + 1}</span>
                </div>
                <h3>{title}</h3>
                <p className="ed-service-lead">{lead}</p>
                <p>{body}</p>
                <a
                  href={siteConfig.contacts.whatsapp + '?text=' + encodeURIComponent('Hello 4TECH, I would like to discuss ' + title.toLowerCase() + '.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-service-link"
                  aria-label={'Discuss ' + title}
                >
                  Explore the possibilities
                </a>
              </article>
            ))}
          </div>
        </section>

        <TeamOverview home />

        <section id="work" className="ed-section ed-shell ed-work-editorial" aria-labelledby="work-title">
          <div className="ed-work-heading">
            <div>
              <p className="ed-eyebrow">Selected engineering</p>
              <h2 id="work-title">
                Systems built.<br />
                <em>Knowledge applied.</em>
              </h2>
            </div>
            <a className="ed-ghost-link" href="/projects">
              View all projects
            </a>
          </div>
          <div className="ed-case-list">
            {projects.map((project, i) => (
              <article className="ed-case-row" key={project.id}>
                <span className="ed-case-index">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="ed-eyebrow">{project.domain}</p>
                  <h3>
                    <a href={'/projects/' + project.id}>{project.name}</a>
                  </h3>
                  <p>{project.summary}</p>
                  <div className="ed-case-tags">
                    <span>{project.difficulty}</span>
                    <span>Completed</span>
                    <span>Mohammed Vashir</span>
                  </div>
                </div>
                <a className="ed-case-open" href={'/projects/' + project.id} aria-label={'View Project: ' + project.name}>
                  View project
                </a>
              </article>
            ))}
          </div>
        </section>

        <AiHomeSection />

        <section className="ed-principles-section ed-section ed-shell" aria-labelledby="principles-title">
          <div className="ed-principles-header ed-reveal">
            <p className="ed-eyebrow">Our approach</p>
            <h2 id="principles-title">
              Good work starts<br />
              with better questions.
            </h2>
            <p>Clear thinking. Connected disciplines. Honest progress.</p>
          </div>
          <div className="ed-principles-grid">
            {principles.map(([num, title, body, label], i) => (
              <article className="ed-principle ed-reveal" key={num} data-delay={i * 100}>
                <span className="ed-principle-number">{num}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <div className="ed-principle-bottom">
                  <span aria-hidden="true">✳</span>
                  {label}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="ed-contact-section ed-shell" aria-labelledby="contact-title">
          <div className="ed-contact-box ed-ink-section ed-reveal">
            <p className="ed-eyebrow">A conversation is a good beginning</p>
            <h2 id="contact-title">
              Ready to build something<br />
              <em>extraordinary?</em>
            </h2>
            <p>
              Bring the question, the sketch or the ambitious idea.<br className="ed-desktop-break" />
              Let’s work out what comes next.
            </p>
            <div className="ed-contact-actions">
              <a className="ed-button ed-button-white" href={'mailto:' + siteConfig.contacts.email + '?subject=Let%27s%20build%20with%204TECH'}>
                Get In Touch
              </a>
              <a className="ed-button ed-button-outline-white" href={siteConfig.contacts.whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
            <a href="#work" className="ed-contact-work">
              Or explore our work ↓
            </a>
            <div className="ed-contact-orbit" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
