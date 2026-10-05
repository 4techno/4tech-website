import IntroSequence from '@/components/jm/intro-sequence';
import TeamOverview from '@/components/team/team-overview';
import AiHomeSection from '@/components/ai/ai-home-section';
import DeliveryRoadmap from './delivery-roadmap';
import HeroSection from '@/components/jm/hero-section';
import ScrollExpandSection from '@/components/jm/scroll-expand';
import IsometricPortfolio from '@/components/jm/isometric-portfolio';
import FannedCapabilities from './fanned-capabilities';
import StudioToolsSuite from './studio-tools';
import ExperienceTimeline from '@/components/jm/experience-timeline';
import ContactSection from '@/components/jm/contact-section';

export default function EditorialHome() {
  return (
    <>
      <IntroSequence />
      <main id="main" className="jm-home">
      <HeroSection />
      <ScrollExpandSection />
      <IsometricPortfolio />
      <FannedCapabilities />
      <StudioToolsSuite />

      <DeliveryRoadmap />

      <div className="jm-leadership">
        <TeamOverview home />
      </div>

      <ExperienceTimeline />
      <AiHomeSection />
      <ContactSection />
    </main>
    </>
  );
}
