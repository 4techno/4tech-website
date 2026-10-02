# 4tech design and integration notes

The September 2026 design uses charcoal, warm white, red and a restrained copper accent. It presents 4tech as an engineering practice, with a separate personal portfolio and an evidence-aware project collection. The original user-supplied portfolio ZIP is preserved outside the application.

## Reference and adaptation

- [Anime.js](https://animejs.com/) informs the relationship between interactive geometry, bold typography and small purposeful controls. Anime.js is used for signal traces and scroll-responsive geometry.
- The supplied `portfolio_full_project.zip` contributes its five-chapter narrative, cinematic 3D direction, discipline exploration and process structure. Its Vite application is adapted into Next.js `/portfolio`, rather than nested as a second app.
- Earlier Next.js, React Bits, Framer and Origin Kit references informed spacing, text reveals and subtle pointer feedback. This release uses the existing brand identity and original code-native engineering visuals.

## Errors addressed during integration

The uploaded `ChapterMethod.jsx` imports `MethodScene.jsx`, which is absent from the archive. The integrated portfolio supplies its own complete scene components. Its contact form also calls a local Express endpoint that cannot run on static Cloudflare Pages; the uploaded server stores enquiries in process memory. Enquiries now lead to the existing authenticated Firebase customer area, where persisted requests are protected by rules.

The uploaded résumé's unsupported claims about production-grade systems and measured performance were not imported. `lib/profile.ts` and `lib/projects.ts` remain the content sources, with development stages visible. The current résumé PDF remains linked. No personal portrait or unrelated Venus model is included in the public build.

## Motion and performance

- `components/engine/` isolates the homepage React Three Fiber renderer behind a client-side dynamic import. It contains an interactive engineering instrument and cursor-repulsion particles using the tested damped spring simulation.
- The instrument's 96 tick marks share an instanced draw call. Particle count and pixel density are reduced for compact or coarse-pointer devices.
- The portfolio's heavy 3D presentation is separately lazy loaded. Chapter text, headings, résumé links and project navigation remain available without WebGL.
- `components/engineering-lab.tsx` draws conceptual signal paths using scoped Anime.js animations. `components/scroll-assembly.tsx` responds to native scroll progress. Both clean up their animation scope.
- `components/motion-preferences.tsx` provides a shared pause setting and respects reduced-motion preferences. Continuous scenes stop when offscreen or the browser tab is hidden.
- No scroll hijacking, forced intro, autoplay audio, custom cursor or hover-only essential information is required to explore the site.
- Integrated Systems service content remains stationary. The hero's 3D object is intentionally interactive.

## Editing map

| File | Purpose |
| --- | --- |
| `app/page.tsx` | Business landing page, services, founder text and contact |
| `app/engineering.css` | Current brand, homepage layout and responsive styling |
| `app/portfolio/page.tsx`, `components/portfolio/` | Personal portfolio chapters and isolated presentation |
| `components/projects/secondary.module.css` | Résumé, catalogue and case-study styling |
| `lib/profile.ts`, `lib/projects.ts` | Profile and curated engineering evidence |
| `config.js` | Public destinations and founder name; public image is disabled |

Keep descriptions factual, mark illustrations and concepts, and test at desktop and phone widths when changing content. Private owner-library uploads do not become public images automatically.
