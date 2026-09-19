import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/geist/wght.css';
import '@fontsource-variable/geist-mono/wght.css';
import './globals.css';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { siteConfig, siteUrl } from '@/config';

// Server Component: fonts, navigation, document shell and SEO never depend on WebGL.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: '4tech — Ideas into reality.', template: '%s — 4tech' },
  description: siteConfig.description,
  applicationName: '4tech',
  authors: [{ name: siteConfig.founder.name }],
  openGraph: { type: 'website', locale: 'en_IN', siteName: '4tech', title: '4tech — Ideas into reality.', description: siteConfig.description, images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: '4tech — Engineering, robotics & RF technology' }] },
  twitter: { card: 'summary_large_image', title: '4tech — Ideas into reality.', description: siteConfig.description, images: ['/opengraph-image'] },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: '#0a0a0a', colorScheme: 'dark' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body id="top"><a href="#main" className="skip-link">Skip to content</a><SiteHeader/>{children}<SiteFooter/></body></html>;
}
