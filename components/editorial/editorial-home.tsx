import TeamOverview from '@/components/team/team-overview';
import AiHomeSection from '@/components/ai/ai-home-section';
import DeliveryRoadmap from './delivery-roadmap';
import HeroSection from '@/components/jm/hero-section';
import ScrollExpandSection from '@/components/jm/scroll-expand';
import IsometricPortfolio from '@/components/jm/isometric-portfolio';
import SelectedProjects from '@/components/jm/selected-projects';
import ExperienceTimeline from '@/components/jm/experience-timeline';
import ContactSection from '@/components/jm/contact-section';
import LoadingScreen from '@/components/jm/loading-screen';

export default function EditorialHome() {
  return (
    <main id="main" className="jm-home">
      <LoadingScreen />
      <HeroSection />
      <ScrollExpandSection />
      <IsometricPortfolio />
      <SelectedProjects />

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
