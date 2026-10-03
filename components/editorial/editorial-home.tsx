import Link from 'next/link';
import { ServiceIcon } from './editorial-art';
import TeamOverview from '@/components/team/team-overview';
import AiHomeSection from '@/components/ai/ai-home-section';
import DeliveryRoadmap from './delivery-roadmap';
import StudioMetricsStrip from './studio-metrics';
import HeroSection from '@/components/jm/hero-section';
import ScrollExpandSection from '@/components/jm/scroll-expand';
import SelectedProjects from '@/components/jm/selected-projects';
import ExperienceTimeline from '@/components/jm/experience-timeline';
import ContactSection from '@/components/jm/contact-section';

const services = [
  ['Embedded systems', 'Intelligence, built in.', 'Microcontrollers, sensing and firmware shaped into testable hardware.'],
  ['Robotics & mechanisms', 'From calculation to movement.', 'Mechanical assemblies, kinematics and interfaces for coordinated motion.'],
  ['RF & instrumentation', 'Make the invisible observable.', 'Acquisition workflows and measurement concepts for radio-frequency systems.'],
  ['Connected systems', 'Signals with context.', 'Device readings, connectivity and system state brought into a clear interface.'],
  ['Research & simulation', 'Give an idea its first form.', 'Scope a technical question, explore models and define practical checks.'],
  ['Practical training', 'Build it. Understand it.', 'Guided projects in electronics, control, automation and engineering computation.'],
] as const;

export default function EditorialHome() {
  return (
    <main id="main" className="jm-home">
      <HeroSection />
      <StudioMetricsStrip />
      <ScrollExpandSection />
      <SelectedProjects />

      <section id="services" className="jm-capabilities" aria-labelledby="jm-capabilities-title">
        <span id="expertise" className="jm-anchor" aria-hidden="true" />
        <div className="jm-shell">
          <div className="jm-capabilities-header">
            <div>
              <p className="jm-kicker"><span aria-hidden="true" /> [ 03 / CAPABILITIES ]</p>
              <h2 id="jm-capabilities-title">Ideas need more<br /><em>than a spark.</em></h2>
            </div>
            <p>Hardware, software and mechanical design meet at the point where an idea becomes a system you can examine.</p>
          </div>
          <div className="jm-capabilities-grid">
            {services.map(([title, lead, body], index) => (
              <article className="jm-capability" key={title}>
                <div className="jm-capability-top">
                  <span className="jm-capability-icon"><ServiceIcon index={index} /></span>
                  <span>[ 0{index + 1} ]</span>
                </div>
                <h3>{title}</h3>
                <p className="jm-capability-lead">{lead}</p>
                <p>{body}</p>
                <Link href="/account" aria-label={`Discuss ${title} with 4TECH`}>
                  Discuss a project <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <DeliveryRoadmap />

      <div className="jm-leadership">
        <TeamOverview home />
      </div>

      <ExperienceTimeline />
      <AiHomeSection />
      <ContactSection />
    </main>
  );
}
