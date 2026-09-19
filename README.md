# 4tech — Next.js portfolio

A Next.js 16 App Router rebuild for Mohammed Vashir and 4tech. The home page introduces the business and founder. The personal portfolio at `/portfolio` highlights Mohammed Vashir’s skills, education and selected work; `/resume` provides a readable résumé and PDF download. The page journey is **Website → Portfolio → Résumé**. The separate engineering collection at `/projects` contains **15 curated projects** across RF, robotics, embedded systems and experimental R&D. `/account` provides Google/email sign-in and private Firebase enquiries.

**Public website: https://4tech-9cy.pages.dev/**. The updated Next.js static export is published on Cloudflare Pages. No Vercel deployment or custom-domain purchase was performed. See [DEPLOYMENT.md](DEPLOYMENT.md) for repeatable Cloudflare publishing and optional Vercel deployment.

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

## Architecture

| Area | Responsibility |
| --- | --- |
| `app/page.tsx` | Business introduction, services, founder and contact sections. The project catalogue remains on its own route. |
| `app/layout.tsx` | Shared page shell, metadata defaults and local typography. |
| `app/portfolio/page.tsx`, `app/resume/page.tsx`, `lib/profile.ts` | Personal portfolio, résumé and owner-supplied profile content. |
| `config.js` | Public `siteConfig` content and `siteUrl(path)` helper. Founder image and social/contact links are owner maintained. |
| `components/galaxy-experience.tsx` | Small client wrapper that loads the WebGL galaxy with `next/dynamic` and `ssr: false`. Handles motion preferences, pause state and visibility. |
| `components/galaxy/*` | Browser-only Three.js/React Three Fiber scene. |
| `components/expertise-experience.tsx` | Client wrapper for optional card interaction, while service content stays available in the initial HTML. |
| `app/projects/page.tsx` | Public server-rendered catalogue, metadata and all 15 project cards. |
| `components/projects/ProjectFilter.tsx` | Search and difficulty grouping around server-rendered cards. The complete collection remains available with JavaScript disabled. |
| `app/projects/[slug]/page.tsx` | Statically generated case-study routes; async route params, individual metadata, canonicals and unavailable-slug handling. |
| `lib/projects.ts` | Typed records, three difficulty levels, ordering ranks and the four selected projects, alongside technical descriptions and validation status. |
| `components/projects/` | Project cards, search/grouping and illustrative engineering visuals. |
| `components/social-links.tsx` | Accessible SVG social/contact icons using the centralized links in `config.js`. |
| `app/account/*`, `components/account/*` | Customer page, forms, authentication state and private enquiry history. |
| `lib/firebase.ts` | Browser-only initialization and public Firebase web configuration. |
| `firestore.rules` | Firebase database permissions; deploy separately, never place in `public/`. |
| `public/assets/` | Founder photo and downloadable résumé. |

Server Components provide the public text, cards, navigation and case studies. Browser-dependent animation and Firebase interaction stay in Client Components. The `ssr: false` dynamic import lives inside a `'use client'` wrapper rather than a server page; this follows [Next.js lazy-loading guidance](https://nextjs.org/docs/app/guides/lazy-loading).

The project routes enumerate all 15 IDs with `generateStaticParams`, await the Next.js 16 `params` promise and derive each canonical from `siteUrl('/projects/id')`. Unknown IDs return a not-found response. See [static route generation](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) and [metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).

## Edit content

Edit `config.js` to change `siteConfig.founder.name`, `image`, `imageAlt` or `imagePosition`. Put a replacement photo under `public/assets/` and use a URL such as `/assets/founder-photo.jpg`. The image is a public asset. Changing the source requires rebuilding and redeploying; visitors cannot replace the hosted photo through the website.

The same configuration centralizes `siteConfig.socials` and `siteConfig.contacts`. The icon row includes Instagram, LinkedIn, WhatsApp, GitHub, email and Reddit using the supplied destinations. There is no YouTube link because no channel was supplied. Updating a supported destination in the configuration updates its shared link; adding a new platform also requires its accessible icon support in `components/social-links.tsx`.

The résumé download is `public/assets/Mohammed_Vashir_Resume.pdf`; the readable résumé page uses `lib/profile.ts`. Keep both versions aligned when updating skills, education or project experience. Replace the PDF with the approved version while keeping its path, or update the links if you rename it. Editing the page does not regenerate the PDF automatically.

## Edit engineering content

`lib/projects.ts` is the single source for the curated catalogue. The earlier beginner-project entries have been removed from this collection, and the related arm/analytical/neural/hybrid work is consolidated under **Advanced Robotic Arm Systems**. Keep page content aligned with this curated export.

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
3. Keep `validation` and `status` accurate. Ten records are explicitly **Proposed R&D concept**. Wireless EV Charging retains the earlier lower-power design study while its EV-scale extension remains conceptual. Existing antenna, arm, drone and SewerSense work retain their documented limits.
4. Match `art` to the supported engineering illustration. Project visuals are **SVG illustrations, not photographs of completed hardware, CAD verification or measured output**. Keep that distinction visible when changing or adding imagery.
5. Run the local checks, then review `/projects`, the affected `/projects/{id}` page and the four selected cards on `/portfolio`.

Do not add invented testimonials, BOM prices, completion claims or performance figures. Keep passive RF concepts receive-only, frequency coverage dependent on suitable RF hardware, camera tracking non-weapon, and shielding claims limited to evidence. Difficulty labels describe the engineering scope, not proof of completion.

## Customer accounts and owner workflow

The configured Firebase project is **`tech-customer-portal`**, with `tech-customer-portal.firebaseapp.com` as the authentication domain. Google and email/password authentication must be enabled in that project's console. Add every real sign-in hostname to **Authentication → Settings → Authorized domains**, including the new Vercel or custom hostname before launch. Do not replace `authDomain` with that hostname for the current popup implementation.

Customers need a verified email address to create an enquiry. The supplied rules restrict reads to the signed-in user's `users/{uid}/requests` path and deny customer changes to workflow status. The owner uses Firebase Authentication's Users list to find a customer's UID, then opens the matching request in Firestore. Edit the string field `status` and, optionally, the string field `updateMessage` to share an update. There is no automatic owner inbox notification or customer update email in this version; review and follow-up are manual.

Read the included [customer-area owner guide](CUSTOMER-AREA-OWNER-GUIDE.md) for console procedures, privacy handling and live permission checks. The configuration is `lib/firebase.ts`, the customer/privacy routes are `/account` and `/privacy`, and public assets are under `public/`. Deployment follows [DEPLOYMENT.md](DEPLOYMENT.md).

Keep the privacy page accurate. Verify ownership before correcting or deleting customer data. Removing an Authentication account does not automatically remove its Firestore enquiries, so handle both. Firebase web identifiers and its web API key are public by design; do not put service-account JSON, admin keys, passwords or private tokens in client code, `public/`, `NEXT_PUBLIC_*` variables or the source archive.

## Before sharing a release

Check the production build, keyboard navigation, mobile layouts and reduced-motion behavior. Confirm the **Website → Portfolio → Résumé** journey, all 15 case studies, the difficulty groups, social icons and the résumé download work while signed out. Then check real Google/email sign-in, email verification, password reset, a server-confirmed enquiry, owner updates and cross-account access isolation. Automated animation or type checks do not prove that Firebase's live settings and deployed rules are correct.

The Cloudflare production site now uses this application. Run `npm run build:pages` and upload the contents of `.next-pages/` to publish later changes; a local build or GitHub push alone does not update the public site.

## Verification record

See [VERIFICATION.md](VERIFICATION.md) for checks completed on this source revision and their limits.
