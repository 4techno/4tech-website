# 4TECH idea service

This is a separate Cloudflare Worker for the static Next.js frontend. It uses a Workers AI binding, Firebase identity verification and a Durable Object for a persistent daily allowance. It is disabled by default. A successful frontend build or Worker dry run does not activate the service.

## Connect the service

1. Use the same Cloudflare account as the 4TECH website. Check the account's available Workers AI and SQLite Durable Object quotas before deployment. No plan upgrade or spending commitment is included in this release.
2. In this directory, review `wrangler.jsonc`. Keep `FIREBASE_PROJECT_ID` set to the existing Firebase project. Set `ALLOWED_ORIGINS` to the exact public site origin, with no trailing slash. Add another origin only if you intend to permit it. Do not use a wildcard.
3. Run `npx wrangler deploy --dry-run` to validate bundling, then `npx wrangler deploy` after Cloudflare sign-in. The endpoint remains disabled initially.
4. Set the server variable `IDEA_ENABLED` to `true` in the reviewed configuration and redeploy. The Worker does not need a public model API key. The binding supplies server-side access.
5. Test using a verified Firebase test account. Confirm a signed-out request is denied, an unapproved origin is denied, valid requests return useful concepts, malformed model responses fail cleanly, and the sixth request on the same UTC day is rejected.
6. Set `NEXT_PUBLIC_IDEA_API_URL=https://YOUR-WORKER-HOST/ideas` in the frontend build environment. Use the actual URL returned by deployment. Rebuild and publish the website.
7. Keep the local worksheet available as fallback. Check quality for each supported engineering domain before announcing AI as live.

## PROBE engineering companion

The same Worker also exposes `POST /chat`. It is independently gated by `ENGINEERING_ENABLED=false` and uses the same verified Firebase token, strict production origin, per-account daily allowance and global daily allowance as `/ideas`. The browser sends the current question and at most eight recent messages; no customer records or owner data enter the prompt. The model receives public portfolio summaries and a small official documentation catalog. Those documents are reference pointers, **not live retrieval or evidence of component specifications**. Every reply is schema-checked and marked as planning assistance before rendering. Invalid output fails closed.

To activate, validate the Worker with `npx wrangler deploy --dry-run`, deploy it, set `ENGINEERING_ENABLED=true` in the reviewed Worker configuration and redeploy. Test `/chat` with a verified test user, invalid tokens, another origin, oversized requests, malformed model output and a quota exhaustion. Then set `NEXT_PUBLIC_ENGINEERING_API_URL` to the deployed HTTPS URL ending in `/chat`, rebuild and publish the frontend. Do not place provider secrets in a public environment variable. If the endpoint is blank, PROBE explicitly runs a local planning worksheet and does not claim a model or source lookup.

## Boundaries

- Five model calls per verified account per UTC day, with a global maximum of 100 per day. Failed model calls also consume an allowance. Counters are durable; restarting a Worker does not reset them.
- Model output is limited to 2,000 tokens and schema-checked before reaching the browser. Text is rendered as text, never executable HTML.
- Firebase RS256 signatures, key IDs, issuer, audience, subject, timestamps and email verification are validated. Custom tokens and anonymous users are rejected.
- Revoked/disabled Firebase accounts can retain an already-issued ID token until its expiry. This endpoint does not perform an additional Firebase Admin revocation lookup. It cannot access customer orders, files or owner permissions.
- Only the project brief goes to the model. Account tokens and names are not included. A hashed UID is used in the quota record, which is overwritten on a new active day and deleted after two inactive days.
- Application code does not store prompts or generated answers. Cloudflare still processes inference requests under its service policies; review those policies for confidential work.
- Source flags are availability switches, not authorization. The frontend cannot override token verification or limits.
- A daily call cap limits model use but is not a provider billing cap for requests, storage or platform services.

Implementation references: [Workers AI bindings](https://developers.cloudflare.com/workers-ai/configuration/bindings/), [Firebase token verification](https://firebase.google.com/docs/auth/admin/verify-id-tokens), [Durable Object storage](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/).

Run `npm test` in the website root for identity, input, quota, endpoint and local-worksheet checks.
