'use client';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
const TiltPanels = dynamic(() => import('./tilt-panels'), { ssr: false });
export default function ExpertiseExperience({ children }: { children: ReactNode }) {
  return <div id="service-deck" className="service-deck">{children}<TiltPanels containerId="service-deck" /></div>;
}
