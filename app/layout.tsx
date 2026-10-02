import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/geist/wght.css';
import '@fontsource-variable/geist-mono/wght.css';
import './globals.css';
import './premium.css';
import './engineering.css';
import './editorial.css';
import './editorial-secondary.css';
import './mobile.css';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { MotionPreferences } from '@/components/motion-preferences';
import ScrollProgress from '@/components/scroll-progress';
import VisitorAnalytics from '@/components/account/VisitorAnalytics';
import AiCopilotFloating from '@/components/ai/ai-copilot';
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
    images: [{ url: '/assets/editorial/4tech-og.png', width: 1200, height: 630, alt: '4TECH — Human curiosity meets engineered possibility' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '4TECH — Technology That Shapes Tomorrow.',
    description: siteConfig.description,
    images: ['/assets/editorial/4tech-og.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#f5f5f0',
  colorScheme: 'light',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body id="top">
        <MotionPreferences>
          <VisitorAnalytics />
          <a href="#main" className="ed-skip-link">
            Skip to content
          </a>
          <ScrollProgress />
          <SiteHeader />
          {children}
          <SiteFooter />
          <AiCopilotFloating />
        </MotionPreferences>
      </body>
    </html>
  );
}
