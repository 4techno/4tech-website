# 4tech design direction

The September 2026 refresh turns the existing portfolio into a more focused engineering brand: deep black, warm white, precise grid lines and restrained red light. The implementation is original to 4tech and uses the existing Next.js, Framer Motion and React Three Fiber stack. No paid template or third-party illustration was copied.

## Reference map

- [Next.js](https://nextjs.org/): centered editorial hero, large typography, fine framing lines, crosshair details and generous spacing. The 4tech identity, copy, visuals and composition remain its own.
- [React Bits](https://reactbits.dev/): progressive text reveals, responsive atmospheric backgrounds and restrained pointer interaction.
- [Origin Kit — Pixel Arc](https://www.originkit.dev/components/pixel-arc): the relationship between a pixel grid and soft light. The contact section uses a separately written CSS pixel field and a pointer highlight, without another WebGL renderer or a continuous animation loop.
- [Framer](https://www.framer.com/): deliberate section pacing, clean controls and typographic hierarchy.
- [BEUI motion components](https://beui.dev/components/motion): tab feedback and compact interaction details. The engineering-process tabs use accessible ARIA semantics and arrow/Home/End keyboard controls.
- [MotionSites](https://motionsites.ai/) and [Scene AI](https://sceneai.art/): visual references for atmospheric, dark technical landing pages. Their generated assets and paid templates are not included.
- [Motion documentation](https://motion.dev/docs/react-scroll-animations): scroll progress and viewport-triggered animation APIs.

## Motion system

`components/motion-preferences.tsx` provides one motion preference to the interactive islands while server-rendered children remain Server Components. The initial render is deterministic; browser motion preferences are applied after mounting. The hero control pauses the galaxy, reveals and pointer lighting. Reduced-motion users receive the static galaxy fallback and readable text.

`components/text-reveal.tsx` reveals words with a short masked rise. `components/reveal.tsx` provides one-time section and project-card entrances. Both preserve readable initial HTML and complete an in-flight reveal when the animation is disabled.

`components/engineering-method.tsx` explains Discover, Architect, Prototype and Validate. The user chooses the stage; tabs never autoplay. Short trace drawings and a content transition reinforce the selection. The first stage remains present in the initial HTML.

`components/signal-field.tsx` updates a CSS highlight only in response to mouse movement. It batches updates to the next animation frame, cancels work on cleanup and preserves ordinary touch scrolling. It respects pause and reduced-motion preferences.

The WebGL galaxy is dynamically imported with `ssr: false` inside its client wrapper. The existing deterministic spring/repulsion simulation is retained, with slightly brighter star sprites and a new composition. Offscreen and background-tab rendering pause. Lower particle counts and pixel density apply to compact/coarse-pointer devices.

## Editing the appearance

- `app/premium.css`: spacing, grid framing, typography, surfaces, responsive layouts and light effects; loaded after the shared base stylesheet.
- `app/page.tsx`: server-rendered business, service, process, founder and contact composition.
- `config.js`: founder image and social/contact destinations.
- `components/service-art.tsx`: original stationary engineering diagrams.
- `lib/projects.ts`: existing catalogue and its explicit development stages.

Integrated Systems and the other service panels intentionally never rotate or tilt. The six-discipline index stays readable and stationary. Full project details remain on `/projects`, with the personal Website → Portfolio → Résumé journey preserved. Do not add fabricated metrics, customer logos, endorsements or completed-project claims for visual effect.
