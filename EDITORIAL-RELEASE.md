# 4TECH editorial release

The existing Next.js site now uses a warm-paper, monochrome editorial design. The production target remains `https://4tech-9cy.pages.dev`.

## Included

- DM Serif Display and Inter typography, subtle halftone texture, Lovable-generated reaching-hands artwork and restrained motion.
- Six engineering services, founder biography without a photo, three selected studies linking to the existing detailed catalogue.
- Shared responsive navigation and footer across the homepage, portfolio, projects, résumé and account pages.
- Existing project routes, résumé PDF, Firebase customer sign-in and enquiries, Google ownership metadata and sitemap retained.
- Matching share artwork and favicon.

## Release boundary

This release changes the frontend, not Firebase permissions or billing. Customer notifications and enhanced workspaces remain disabled unless `NEXT_PUBLIC_PORTAL_WORKSPACE_ENABLED=true` after their backend rules/indexes have been activated and verified. Private uploads and email delivery retain their separate disabled-by-default flags. The owner dashboard continues to require an authenticated, verified owner claim. No founder photograph is shipped.

The editorial design lives in the existing Next.js architecture. Lovable and Hostinger AI Builder are now the requested design workflows. The Lovable companion build links back to the original project library and customer area. No Higgsfield runtime or authentication is required to visit this site.

## Publish

Run `npm test`, `npm run typecheck`, and `npm run build:pages`. Upload only the contents of `.next-pages/` to the existing Cloudflare Pages project **4tech**, using the **Production** environment. Preserve the previous production deployment for rollback.

Verify the stable public address, mobile navigation, project search and case-study links, the résumé PDF, and the account sign-in screen. A successful frontend release does not prove authenticated Firebase submissions or undeployed backend features work.
