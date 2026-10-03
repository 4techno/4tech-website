# 4TECH — website and engineering portfolio

A Next.js 16 App Router site for 4TECH, Mohammed Vashir and co-founder Sabeel Ahamed. The Ember redesign leads from the studio homepage to selected work, services, the team and a customer enquiry. `/portfolio` and `/resume` cover Mohammed's work; `/portfolio/sabeel-ahamed` and `/resume/sabeel-ahamed` cover Sabeel's. `/projects` contains **15 curated engineering projects**, each with its own case-study route. `/account` provides Google/email sign-in and private Firebase enquiries.

**Existing Cloudflare Pages address: https://4tech-9cy.pages.dev/**. This working-tree redesign must be built, uploaded and checked before describing it as the live release. A local build or source commit does not update the Direct Upload project. See [DEPLOYMENT.md](DEPLOYMENT.md) for the release procedure. [VERIFICATION.md](VERIFICATION.md) records checks on earlier releases and does not certify these uncommitted changes.

## Run locally

Use Node.js 22 or newer, with npm. From the folder containing this `package.json`:

```text
npm ci
npm run dev
```

Open **http://localhost:3000**. Use this hostname consistently for local Google sign-in, and confirm `localhost` is listed in Firebase Authentication's authorized domains. For a production-mode local check:

```text
npm run typecheck
npm test
npm run build
npm start
```

These commands are instructions, not evidence that a particular release has passed them. `npm ci` uses the checked-in lockfile. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`; there is no need to change execution policy. Stop the local server with Ctrl+C.

Copy `.env.example` to `.env.local` if you want to set the local metadata origin. Set `NEXT_PUBLIC_SITE_URL` to the actual production HTTPS URL in your hosting environment before the production build. Localhost is appropriate only for local previews. This variable is public, and it controls generated canonical/share URLs rather than buying or assigning a domain.

Customer services need an internet connection. Local previews use the Firebase project already configured in `lib/firebase.ts`, so submitting an enquiry creates real data there. Use accounts you control for testing and remove test data afterward.

## Visual direction

The Ember homepage uses a dark palette, warm orange accent, large type, restrained glow and scroll-led editorial sections. Its current sections include the hero, engineering focus, expanding philosophy visual, selected work, capabilities, delivery roadmap, team, experience, idea assistant and contact draft. GSAP and the site's motion components provide interaction; reduced-motion and keyboard behavior should be checked in a browser. The separate personal portfolio retains its cinematic chapter and browser-only 3D presentation. See [DESIGN-NOTES.md](DESIGN-NOTES.md).

Founder portraits are now deliberately public: `public/assets/team/` contains Mohammed's and Sabeel's JPGs and responsive WebP copies. They appear on the team and personal profile pages. The separate photo libraries in `/owner` are private Firebase Storage areas when activated. Uploading there does not change the public portraits or publish a photo; replacing a public image requires an approved source edit and a new static release.

## Architecture

| Area | Responsibility |
| --- | --- |
| `app/page.tsx`, `components/editorial/editorial-home.tsx`, `components/jm/` | Ember homepage composition, selected work, capabilities, motion and contact draft. The full catalogue remains on `/projects`. |
| `app/layout.tsx`, `app/jm-*.css`, `app/ember-secondary.css` | Shared page shell, metadata and current visual styling. |
| `app/portfolio/page.tsx`, `app/resume/page.tsx`, `lib/profile.ts` | Mohammed's portfolio, résumé and profile content. |
| `app/team/*`, `app/founder`, `app/co-founder`, `app/portfolio/sabeel-ahamed`, `app/resume/sabeel-ahamed`, `lib/team.ts` | Public founder/co-founder profiles and Sabeel's portfolio and résumé. |
| `config.js` | Public `siteConfig` content and `siteUrl(path)` helper; owner-maintained social/contact links and Mohammed's selected public portrait. |
| `components/portfolio/` | Cinematic personal portfolio, chapter navigation and isolated 3D presentation. |
| `components/command-palette.tsx`, `components/ai/` | Search/navigation shortcuts and idea-planning interfaces. |
| `app/projects/page.tsx` | Public server-rendered catalogue, metadata and all 15 project cards. |
| `components/projects/ProjectFilter.tsx` | Search and difficulty grouping around server-rendered cards. The complete collection remains available with JavaScript disabled. |
| `app/projects/[slug]/page.tsx` | Statically generated case-study routes; async route params, individual metadata, canonicals and unavailable-slug handling. |
| `lib/projects.ts` | Typed records, three difficulty levels, ordering ranks and the four selected projects, alongside technical descriptions and validation status. |
| `components/projects/` | Project cards, search/grouping and illustrative engineering visuals. |
| `components/social-links.tsx` | Accessible SVG social/contact icons using the centralized links in `config.js`. |
| `components/jm/contact-section.tsx`, `lib/planner-brief.ts`, `app/ideas/*` | Contact and planning briefs saved temporarily in the current browser tab for review in `/account`. |
| `app/account/*`, `app/owner/*`, `components/account/*` | Customer enquiry submission and owner workspace; additional quotations, notifications, analytics and private uploads require their own activation. |
| `lib/firebase.ts` | Browser-only initialization and public Firebase web configuration. |
| `firestore.rules`, `storage.rules`, `backend/` | Separate backend permissions, optional email delivery and owner provisioning. Activation is documented separately; a frontend deployment does not activate these services. |
| `public/assets/` | Downloadable résumé and deliberately public team portraits. Files here ship to everyone in a static release. |

Server Components provide the public text, cards, navigation and case studies. Browser-dependent animation and Firebase interaction stay in Client Components. The `ssr: false` dynamic import lives inside a `'use client'` wrapper rather than a server page; this follows [Next.js lazy-loading guidance](https://nextjs.org/docs/app/guides/lazy-loading).

The project routes enumerate all 15 IDs with `generateStaticParams`, await the Next.js 16 `params` promise and derive each canonical from `siteUrl('/projects/id')`. Unknown IDs return a not-found response. See [static route generation](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) and [metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).

## Edit content

Edit `config.js` to change public contact destinations and Mohammed's selected portrait path. Public team names, biographies, portrait paths and positions are in `lib/team.ts`; update the matching files under `public/assets/team/` if a portrait changes. Anything under `public/` is publicly downloadable after deployment. Keep private photographs in the owner libraries, never in `public/`.

The same configuration centralizes `siteConfig.socials` and `siteConfig.contacts`. The icon row includes Instagram, LinkedIn, WhatsApp, GitHub, email and Reddit using the supplied destinations. There is no YouTube link because no channel was supplied. Updating a supported destination in the configuration updates its shared link; adding a new platform also requires its accessible icon support in `components/social-links.tsx`.

The résumé download is `public/assets/Mohammed_Vashir_Resume.pdf`; the readable résumé page uses `lib/profile.ts`. Keep both versions aligned when updating skills, education or project experience. Replace the PDF with the approved version while keeping its path, or update the links if you rename it. Editing the page does not regenerate the PDF automatically.

## Edit engineering content

`lib/projects.ts` is the single source for the curated catalogue. The earlier beginner-project entries have been removed from this collection, and the related arm/analytical/neural/hybrid work is consolidated under **Advanced Robotic Arm Systems**. Keep page content aligned with this curated export.

All 15 records currently display **Completed by Mohammed Vashir**, following the owner's 30 September 2026 status update. This reports project completion, not that every performance, manufacturing, safety or field-use claim has been independently verified. The four featured case studies include an evidence record with described work, review findings and missing checks. In particular, the drone's last recorded native KiCad audit did not pass, and SewerSense has no established gas calibration or reliable safety alarm. Preserve these limits when editing the public status.

| Difficulty | Current projects |
| --- | ---: |
| Research Level | 7 |
| Advanced | 6 |
| Intermediate | 2 |

`difficultyLevels` defines that display order. Each record's `rank` controls its priority within its difficulty group; rank values may repeat across different groups. `featuredProjects` deliberately selects **Automated Antenna Radiation Pattern Measurement System**, **Advanced Robotic Arm Systems**, **ESP32 Drone Platform** and **SewerSense**, in that order. The personal portfolio uses this export for its four selected projects rather than taking the first four items in the grouped catalogue.

Only current catalogue entries receive case-study pages and sitemap entries. `retiredProjectIds` in `config.js` redirects removed entries to `/projects` in both Cloudflare and standard Next.js deployments. Unknown URLs retain a real 404 response.

When editing a record:

1. Preserve its `id` unless you also handle the existing links. Update `name`, `short`, `category`, `difficulty`, `rank` and `stage` to match the actual project.
2. Maintain `problem`, `solution`, `body`, `tech` and `impact`. The impact describes the intended contribution; it is not evidence of a measured result.
3. Keep `stage`, `status`, `validation` and any `caseStudy` evidence accurate. Wireless EV Charging describes completed lower-power work while its EV-scale application remains research scope. Completion alone does not establish EV charging performance, drone flight readiness, RF accuracy or confined-space safety.
4. Match `art` to the supported engineering illustration. The selected-work and case-study diagrams are **illustrations, not photographs of completed hardware, CAD verification or measured output**. Keep that distinction visible when changing or adding imagery.
5. Run the local checks, then review `/projects`, the affected `/projects/{id}` page and the four selected cards on `/portfolio`.

Do not add invented testimonials, BOM prices, test results or performance figures. Keep passive RF work receive-only, frequency coverage dependent on suitable RF hardware, camera tracking non-weapon, and shielding claims limited to evidence. Difficulty labels describe engineering scope, not proof of performance.

## Customer accounts and owner workflow

The configured Firebase project is **`tech-customer-portal`**, with `tech-customer-portal.firebaseapp.com` as the authentication domain. Google and email/password authentication must be enabled in that project's console. Add every real sign-in hostname to **Authentication → Settings → Authorized domains**, including the new Vercel or custom hostname before launch. Do not replace `authDomain` with that hostname for the current popup implementation.

The homepage contact form creates an **editable draft**, stores it in this browser tab and opens `/account`; it does not send an enquiry. Drafts from `/ideas` and the planning assistant use the same handoff. A draft expires after 24 hours or when the tab closes, and the visitor can remove it. In `/account`, a signed-in customer with a verified email reviews the filled fields and explicitly selects **Submit your request**. Submission requires a current server connection and a successful Firestore write; a draft or locally pending item is not a confirmed enquiry. An enquiry starts a conversation, not a paid order or delivery commitment.

The source Firestore rules restrict customers to their own records and owner workflow actions to a verified account with the administrator-provisioned `owner` custom claim. The `/owner` interface also checks the founder email, verified-email token fields and an unexpired owner claim; editable profile text cannot grant access. The workspace includes an enquiry inbox and project updates. Quotations and customer notifications need the expanded workspace and matching rules/indexes; visitor analytics, private uploads and email have further service dependencies and switches. Visible tabs alone do not prove those services are active. The [backend activation guide](backend/README.md) records that the founder opened the live inbox on 3 October 2026, but does not claim an independent Admin SDK check of the claim or full live validation of every feature. Recheck the exact account and permissions before relying on them. Frontend switches do not grant access; Firebase rules enforce permissions.

Read the included [customer-area owner guide](CUSTOMER-AREA-OWNER-GUIDE.md) for console procedures, privacy handling and live permission checks. The configuration is `lib/firebase.ts`, the customer/privacy routes are `/account` and `/privacy`, and public assets are under `public/`. Deployment follows [DEPLOYMENT.md](DEPLOYMENT.md).

Keep the privacy page accurate. Verify ownership before correcting or deleting customer data. Removing an Authentication account does not automatically remove its Firestore enquiries, so handle both. Firebase web identifiers and its web API key are public by design; do not put service-account JSON, admin keys, passwords or private tokens in client code, `public/`, `NEXT_PUBLIC_*` variables or the source archive.

## Before sharing a release

Check the production build, keyboard navigation, mobile layouts and reduced-motion behavior. Confirm the homepage, team and both founder profiles, both portfolio/résumé paths, public portraits, all 15 case studies, difficulty groups, social icons and Mohammed's résumé download while signed out. Test the homepage contact draft through `/account`; verify that creating a draft sends nothing, then check real sign-in, email verification, password reset, server-confirmed enquiry submission, owner updates and cross-account isolation with controlled accounts. Automated type and component checks do not prove live Firebase settings, rules or external services.

For Cloudflare Pages, run `npm run build:pages` after the source checks. The script exports and audits `.next-pages/`, including the static pages, headers and redirects. Zip the **contents** of that folder, upload the ZIP to the existing Pages Direct Upload project as a production deployment, then verify the public routes and account flow on the actual hostname. Do not present this working tree as published until the upload and live checks finish. Firebase rules and optional backend services are deployed separately; a static frontend upload does not activate them.

## Verification record

See [VERIFICATION.md](VERIFICATION.md) for checks completed on this source revision and their limits.
