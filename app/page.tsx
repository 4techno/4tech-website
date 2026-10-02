import type { Metadata } from 'next';
import EditorialHome from '@/components/editorial/editorial-home';

export const metadata: Metadata = {
 title: '4TECH — Technology That Shapes Tomorrow.',
 description: 'Independent engineering practice in Tamil Nadu, India. Embedded systems, robotics, RF instrumentation, prototype development and practical learning.',
 alternates: { canonical: '/' },
};

export default function Home() { return <EditorialHome/>; }
