import type { Metadata } from 'next';
import { siteUrl } from '@/config';
import ProjectsPage from '@/app/projects/page';

export const metadata: Metadata = {
  title: 'All Engineering Works — 4TECH Engineering',
  description: 'Explore the full portfolio of 4TECH Engineering works: robotics, embedded systems, RF instrumentation, power electronics, and autonomous systems.',
  alternates: { canonical: siteUrl('/works') },
  openGraph: {
    title: 'All Engineering Works | 4TECH Engineering',
    description: 'Explore the full portfolio of 4TECH Engineering works.',
    url: siteUrl('/works'),
    type: 'website',
  },
};

export default function WorksPage() {
  return <ProjectsPage />;
}
