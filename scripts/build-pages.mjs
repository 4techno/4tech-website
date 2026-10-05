import { spawnSync } from 'node:child_process';
import { writeFileSync, existsSync, rmSync } from 'node:fs';
import { retiredProjectIds } from '../config.js';
import { normalizeExportSegments } from './normalize-export-segments.mjs';

const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, CLOUDFLARE_PAGES_EXPORT: '1', NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://4tech-9cy.pages.dev' },
});
if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`Normalized ${normalizeExportSegments('.next-pages')} Windows route-segment files.`);
writeFileSync('.next-pages/_headers', `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(self), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin-allow-popups

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/account
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-store

/owner
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-store

/owner.html
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-store

/ameena
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-store

/opengraph-image
  Content-Type: image/png

/sitemap.xml
  Content-Type: application/xml; charset=utf-8
  Cache-Control: public, max-age=3600

/robots.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600
`);
writeFileSync('.next-pages/_redirects', retiredProjectIds.flatMap(id => [`/projects/${id} /projects 301`, `/projects/${id}.html /projects 301`]).join('\n') + `\n/projects.html /projects 301
/founder.html /founder 301
/co-founder.html /co-founder 301
/team.html /team 301
/ideas.html /ideas 301
/account.html /account 301
/owner.html /owner 301
/privacy.html /privacy 301
/resume.html /resume 301
/portfolio.html /portfolio 301
`);
if (!existsSync('.next-pages/index.html') || !existsSync('.next-pages/portfolio.html') || !existsSync('.next-pages/404.html')) throw new Error('Expected static pages are missing.');
// Keep the original locally; this owner photo is not part of the public release.
rmSync('.next-pages/assets/mohammed-vashir.jpg', { force: true });
const audit = spawnSync(process.execPath, ['scripts/audit-public-export.mjs'], { stdio: 'inherit' });
if (audit.status !== 0) process.exit(audit.status ?? 1);
console.log('Cloudflare Pages export ready in .next-pages/. Upload only its contents.');
