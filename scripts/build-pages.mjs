import { spawnSync } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';
import { retiredProjectIds } from '../config.js';

const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, CLOUDFLARE_PAGES_EXPORT: '1', NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://4tech-9cy.pages.dev' },
});
if (result.status !== 0) process.exit(result.status ?? 1);
writeFileSync('.next-pages/_headers', `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin-allow-popups

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/account
  X-Robots-Tag: noindex, nofollow

/opengraph-image
  Content-Type: image/png
`);
writeFileSync('.next-pages/_redirects', retiredProjectIds.flatMap(id => [`/projects/${id} /projects 301`, `/projects/${id}.html /projects 301`]).join('\n') + `\n/projects.html /projects 301
/account.html /account 301
/privacy.html /privacy 301
/resume.html /resume 301
/portfolio.html /portfolio 301
`);
if (!existsSync('.next-pages/index.html') || !existsSync('.next-pages/portfolio.html') || !existsSync('.next-pages/404.html')) throw new Error('Expected static pages are missing.');
console.log('Cloudflare Pages export ready in .next-pages/. Upload only its contents.');
