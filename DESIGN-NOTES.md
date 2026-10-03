# 4TECH design and integration notes

The current source uses the Ember direction: near-black surfaces, warm orange accents, large editorial type, soft glow and technical illustration. The homepage leads through the studio message, engineering focus, an expanding philosophy image, selected projects, capabilities, a delivery roadmap, the team and a customer enquiry draft. This describes the working tree; the existing Cloudflare URL needs a new static upload and live check before it represents this redesign.

## Reference and adaptation

- The supplied `portfolio_full_project.zip` informed the separate `/portfolio` chapter structure. Its Vite application was adapted into Next.js rather than nested as another app. The personal portfolio retains its own lazy-loaded 3D presentation; the homepage now uses the Ember components in `components/jm/` and `components/editorial/`.
- The uploaded `ChapterMethod.jsx` imports a missing `MethodScene.jsx`; this app supplies its own scene components. The uploaded contact form used a process-memory Express endpoint that cannot serve the static Cloudflare export. The current homepage form saves an editable, tab-scoped draft and opens `/account`; only the verified customer's explicit submission writes a Firebase enquiry.
- The uploaded résumé's unsupported claims about production-grade systems and measured performance were not imported. `lib/profile.ts`, `lib/team.ts` and `lib/projects.ts` own the displayed biographies and project descriptions.

## Portraits and project evidence

Mohammed Vashir's and Sabeel Ahamed's approved public portraits are in `public/assets/team/` as JPG and responsive WebP files. `lib/team.ts` selects them for the team and profile pages; `config.js` also names Mohammed's public portrait. Hover, focus or tap reveals colour. These static files are available to every visitor after deployment. The `/owner` personal and business photo libraries use private Firebase Storage when activated. An owner-library upload does not replace or publish a portrait.

All 15 catalogue records currently show the owner-reported stage **Completed**. The four featured case studies have explicit evidence states and missing checks. Project diagrams remain labeled as illustrations; they are not test photographs, verified CAD outputs or measured plots. Completion does not imply quantified performance, manufacturing release, flight readiness or safety certification. Keep those distinctions in copy and captions.

## Motion and access

- `components/jm/` contains the homepage hero, scroll expansion, selected work, experience timeline and contact presentation. GSAP motion is scoped to those client components; the rest of the site also has a shared pause/reduced-motion preference.
- The separate personal portfolio loads its heavier 3D scene in the browser. Public text, navigation and project descriptions remain available through server-rendered content.
- The global command palette and idea assistant help visitors navigate or prepare a brief. A planning suggestion still requires review before an enquiry is submitted.
- Check keyboard focus, reduced motion, a phone-width viewport and the browser without WebGL when changing these interactions. Do not infer an accessibility or performance certification from the implementation alone.

## Editing map

| File | Purpose |
| --- | --- |
| `components/editorial/editorial-home.tsx`, `components/jm/`, `app/jm-*.css`, `app/ember-secondary.css` | Homepage structure and Ember presentation |
| `app/portfolio/page.tsx`, `components/portfolio/` | Mohammed's personal portfolio and chapter presentation |
| `lib/team.ts`, `components/team/`, `public/assets/team/` | Public founder and co-founder profiles and portraits |
| `lib/projects.ts`, `components/projects/` | Project statuses, evidence, catalogue and case studies |
| `lib/planner-brief.ts`, `components/jm/contact-section.tsx`, `components/account/AccountPortal.tsx` | Draft handoff and explicit customer submission |
| `config.js` | Public contact destinations, canonical origin helper and selected founder portrait |

Keep descriptions factual, retain evidence and illustration labels, and check desktop and phone layouts after content changes. A source change reaches the public site only after the static Cloudflare export is uploaded and verified.
