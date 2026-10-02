# 4TECH PROBE and founder workspace release

Public site: https://4tech-9cy.pages.dev/

## Live now

- PROBE, the corner engineering companion, offers an on-device planning worksheet with structured assumptions, calculation steps, provisional parts and validation checks. Its replies explicitly say when a live model or source lookup is unavailable.
- The ASCII Motion Lab was removed from the website and navigation at the owner's request.
- The public portfolio, founder and co-founder profiles, idea worksheet, project pages and resumes are deployed. The live release audit found no broken internal links.

## Prepared but not activated

- `/owner` contains the founder analytics, consented sign-in audit, enquiries, quotations and progress controls. It remains locked until the exact verified founder account receives a server-issued `owner` Firebase custom claim and the matching Firestore rules and indexes are deployed. A matching email alone never grants access.
- After the verified owner claim is active, signing in through `/account` automatically opens `/owner`.
- Visitor analytics requires separate consent, App Check, server functions and database retention policies. It reports tab sessions, not unique people, and does not identify anonymous visitors.
- The protected Cloudflare Worker `/chat` endpoint can supply model-backed engineering responses after deployment and verified-account tests. Until then PROBE stays in local worksheet mode.
- Private uploads, email notifications and scheduled weekly summaries remain disabled because their external services and billing decisions have not been completed.

## Validation

- `npm run typecheck` passed.
- `npm test` passed 55 tests after the ASCII feature was removed.
- `npm --prefix backend/functions test` passed 39 tests.
- Firestore and Storage emulators passed 203 assertions.
- `npm run build:pages` generated the static Cloudflare export, and `node ../work/check-next-release.mjs https://4tech-9cy.pages.dev` returned no issues after deployment.

See [backend/README.md](backend/README.md) and [backend/idea-assistant/README.md](backend/idea-assistant/README.md) for the separate backend activation steps. No public frontend flag or local passkey is an owner credential.
