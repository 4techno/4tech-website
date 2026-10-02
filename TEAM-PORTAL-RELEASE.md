# Team and engineering portfolio release

## Public pages

- `/founder`: Mohammed Vashir's profile, with links to his portfolio and résumé.
- `/co-founder`: Sabeel Ahamed's profile.
- `/portfolio/sabeel-ahamed`: résumé-supported project experience, skills and leadership.
- `/resume/sabeel-ahamed`: printable résumé.
- `/team`: both members, with circular portraits. Hover, keyboard focus or tap reveals the original colours.
- `/projects`: 15 completed Mohammed projects, grouped by difficulty. Animated project illustrations are removed. Explanations cover the problem, approach, technologies, contribution and technical scope. Completion is based on the owner's explicit update; no unprovided performance figures or certifications have been added.
- `/ideas`: local project-planning worksheets now; a separate authenticated AI endpoint can be connected.

Portraits are the exact two owner-selected files. Their paths and crop positions are centralized in `lib/team.ts`. Their colour change is CSS only; the originals have not been retouched.

## Owner workspace

`/owner` requires a verified Firebase account with the server-issued boolean owner claim. It separates enquiries, accepted quotations, visitor records and two private photo libraries. An accepted quotation is an order indicator, not a payment record. Counts use the latest 100 quotations and are labelled accordingly.

No fabricated visitor identities or seeded counts are included. Anonymous visits remain anonymous. Optional named analytics requires both a verified account and explicit visitor consent. Collection is disabled until its backend and App Check are enabled. See `backend/README.md`.

## Activation and publishing

- The frontend is ready to export using `npm run build:pages`.
- Publish only `.next-pages/` to the existing Cloudflare Pages project.
- Online AI, consented visitor analytics, file uploads and owner claims need their documented service setup. Their presence in the source does not mean they are live.
- Keep Google ownership metadata and the existing public site origin. No change to DNS is necessary for the existing Pages address.
- AI setup: `backend/idea-assistant/README.md`.

## Verification

The release passes the production static export, TypeScript checking, 22 application tests, 24 Functions tests and 193 local database/storage security assertions. The AI Worker also passes a bundling dry run. These local checks do not prove production service activation.

## Mobile refinement

Phone-only styles improve the homepage proportions, menu, project filters, form readability, footer links and touch targets. Desktop composition remains unchanged. Decorative diagonal arrows are removed from all page components. Checked at 360px and 390px phone widths and at 1365px desktop width; no horizontal page overflow appeared on the checked home, team, project and idea pages. TypeScript and the 36-route production export pass.
