# Verification record

Checked 19 September 2026 (India time) against the production build and public Cloudflare deployment of `4tech-next`.

## Completed

- `npm run build`: passed on Next.js 16.3.5. Public pages and all 15 case-study routes were prerendered successfully.
- TypeScript: passed both standalone type checking and the production build check.
- Galaxy physics: all 8 automated tests passed, covering cursor repulsion, spring return, frame-rate independence, bounded time steps, pause behavior and pointer coordinates.
- Production dependency audit: zero reported vulnerabilities at the time of the rebuild. This is a package audit, not a comprehensive security assessment.
- Production HTTP checks: home, personal portfolio, resume, customer sign-in, privacy, project collection and all 15 case studies returned HTTP 200. No broken internal links were found in the rendered pages.
- Removed catalogue entries are absent from the new application and sitemap. Explicit legacy redirects lead visitors to the current collection; unknown routes return HTTP 404.
- The collection renders 15 project cards and 15 individual SVG illustrations in the initial HTML. Difficulty groups contain 7 Research Level, 6 Advanced and 2 Intermediate projects. Portfolio and resume links resolve to retained project IDs.
- Browser checks: difficulty filtering, combined difficulty/search filtering, empty results and reset behavior worked. Desktop and 390px-wide card layouts were visually inspected; no horizontal overflow was found in the checked mobile layout.
- Social links: six equal 42px icon buttons with explicit accessible names, keyboard-focus styles, tooltip styles and new-tab attributes. YouTube is deliberately absent because the owner has no channel.
- Resume: the updated one-page PDF was rendered and visually inspected for clipping, spacing and readability. The hosted file returns a valid PDF and contains the four selected engineering projects. A copy is included in the source package.
- Sharing/search assets: the Open Graph route returned a 1200 x 630 PNG; the sitemap includes portfolio, resume and the 15 retained projects; robots excludes the customer-account route. Existing `.html` route redirects were checked.
- The capability ticker was replaced with a static responsive six-discipline grid. Service cards and their new engineering diagrams remain stationary with no transform/rotation animation. Desktop (1280px) and mobile (390px) were inspected without horizontal overflow.
- `npm run build:pages` passed, exporting 27 generated pages/routes and 172 deployment assets. Public browser navigation through home, portfolio, résumé and customer sign-in succeeded without captured JavaScript errors.
- Static engineering illustrations were reviewed and corrected to match the concepts: a passive magnetometer boom, a single-objective digital monocular, a beam-splitter display concept and valid drone propeller paths.

## Scope and remaining launch checks

The application is published at **https://4tech-9cy.pages.dev/** through Cloudflare Pages Direct Upload. Canonicals, sitemap and sharing metadata use that origin. No Vercel deployment or custom-domain change was made. The default Next.js build remains available alongside `npm run build:pages` for static hosting.

The customer portal retains the existing Firebase web configuration and owner-scoped Firestore rules. Its sign-in form loads and enables locally. The Google-popup attempt in the in-app browser did not complete, so this rebuild does not claim a new successful end-to-end authentication/enquiry test. No new account, verification/reset email or enquiry was created during this rebuild. Recheck Google sign-in, email sign-in, verification, reset, server-confirmed submissions and cross-account isolation on the final authorized hostname before customer launch. The account-state review also added a guard against submitting a stale form after an account switch.

Reduced-motion handling, WebGL fallback and offscreen pause logic are implemented. The checks above are not a full assistive-technology audit or cross-device performance benchmark. Three.js currently logs a non-blocking Clock deprecation warning through the scene dependency; no application error was observed during the checked portfolio flows.

New R&D entries are proposed concepts, and illustrations are labeled concept visualizations. Difficulty describes technical scope; it does not certify completed work, commercial readiness or measured performance. Indicative BOM estimates from the brief were not published as verified costs.
