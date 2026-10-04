import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/geist/wght.css';
import '@fontsource-variable/geist-mono/wght.css';
import './globals.css';
import './premium.css';
import './engineering.css';
import './editorial.css';
import './editorial-secondary.css';
import './mobile.css';
import './jm-design.css';
import './jm-home.css';
import './ember-secondary.css';

import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { MotionPreferences } from '@/components/motion-preferences';
import VisitorAnalytics from '@/components/account/VisitorAnalytics';
import AiCopilotFloating from '@/components/ai/ai-copilot';
import CommandPalette from '@/components/command-palette';
import GhostCursor from '@/components/jm/ghost-cursor';
import { siteConfig, siteUrl } from '@/config';

// Server Component: fonts, navigation, document shell and SEO never depend on WebGL.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: '4TECH — Technology That Shapes Tomorrow.', template: '%s — 4TECH' },
  description: siteConfig.description,
  applicationName: '4tech',
  authors: [{ name: siteConfig.founder.name }],
  // Keep this public tag in place to retain Google Search Console ownership.
  verification: { google: 'ridPpTRjP7lcZMd-jm1K3y6zE0CEV3cEXp5twz4oK3c' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: '4TECH',
    title: '4TECH — Technology That Shapes Tomorrow.',
    description: siteConfig.description,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: '4TECH — engineering ideas into reality' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '4TECH — Technology That Shapes Tomorrow.',
    description: siteConfig.description,
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body id="top" className="min-h-screen bg-void text-cloud jm-body">
          <noscript><style>{'.tech-intro{display:none!important}'}</style></noscript>
          <MotionPreferences>
            <div className="scroll-progress" aria-hidden="true" />
            <div className="noise-overlay" aria-hidden="true" />
            <GhostCursor />
            <VisitorAnalytics />
            <a href="#main" className="ed-skip-link">
              Skip to content
            </a>
            <SiteHeader />
            {children}
            <SiteFooter />
            <AiCopilotFloating />
            <CommandPalette />
          </MotionPreferences>
      </body>
    </html>
  );
}
