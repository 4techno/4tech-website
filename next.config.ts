import type { NextConfig } from 'next';
import { retiredProjectIds } from './config.js';

const exportForPages = process.env.CLOUDFLARE_PAGES_EXPORT === '1';
const config: NextConfig = {
  ...(exportForPages ? { output: 'export' as const, distDir: '.next-pages' } : {}),
  poweredByHeader: false,
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'], unoptimized: exportForPages },
  ...(!exportForPages ? { async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
    ] }];
  },
  async redirects() {
    return [
      ...retiredProjectIds.flatMap(id => [
        { source: `/projects/${id}`, destination: '/projects', permanent: true },
        { source: `/projects/${id}.html`, destination: '/projects', permanent: true },
      ]),
      { source: '/projects.html', destination: '/projects', permanent: true },
      { source: '/projects/:slug.html', destination: '/projects/:slug', permanent: true },
      { source: '/account.html', destination: '/account', permanent: true },
      { source: '/privacy.html', destination: '/privacy', permanent: true },
    ];
  } } : {}),
};
export default config;
