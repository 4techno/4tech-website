# Customer and owner portal activation

The frontend is a static Next.js export. Firebase Authentication and Firestore supply persistent enquiries, project updates, quotations and notifications. Optional Cloud Storage supplies private files and the two owner photo libraries. Optional Functions/Resend supply customer email updates. These services are deployed independently of Cloudflare Pages.

## Current release boundary

The public frontend is deployed at `https://4tech-9cy.pages.dev/`. On 3 October 2026, the signed-in founder account opened `/owner` and its live enquiry inbox, and the Firebase console showed current Firestore rules plus the request and quotation index definitions. This confirms effective founder access for that session and basic enquiry reading, not an independent Admin SDK inspection of the claim or a full rules diff. Google and email sign-in are enabled. The expanded quotation workspace, visitor analytics, private photo uploads, email delivery and cloud AI are not yet active on the published frontend. A successful static build or visible dashboard tab does not activate those services.

## 1. Firestore and owner access

1. Sign into the correct Firebase project, `tech-customer-portal`, using the official Firebase CLI. Keep Google and email sign-in enabled and authorize the real website hostname.
2. For the current Spark plan, use the separate Spark configuration described below. It deploys the same security rules and the enquiry/quotation indexes without visitor TTL policies. Confirm the collection-group indexes on both `requests.createdAt` and `quotes.createdAt` finish building.
3. Sign into `/account` with the intended owner account and verify its email. Find that exact account's UID in Firebase Authentication. Public profile fields cannot grant access.
4. Use locally authorized Google Application Default Credentials with permission to manage this Firebase project's Auth users. Do not put credentials in this repository, browser code or chat. From `backend/functions`, run `npm ci`.
5. Preview the claim change: `npm run owner:access -- --project tech-customer-portal --uid OWNER_UID --email OWNER_EMAIL`. Replace the UID/email with the inspected account. Review the displayed identity. Add `--apply` only to that same command to grant the role. The script requires a verified matching email and preserves unrelated claims.
6. Sign out and in again, then open `/owner`. Check enquiries and post an update to a controlled test request. Check a separate customer cannot view it.

### Spark-only database activation

Authentication, verified owner claims, Firestore enquiries, quotations and in-app updates can operate within Spark quotas. The main `firebase.json` references `firestore.indexes.json`, which also enables visitor TTL policies. Do not use that full configuration for the initial Spark setup: [Firestore TTL deletes require billing](https://firebase.google.com/docs/firestore/quotas#free-quota).

From the repository root, after Firebase CLI sign-in and review of the existing database configuration:

```sh
firebase deploy --config firebase.spark.json --only firestore --project tech-customer-portal --non-interactive
```

`firebase.spark.json` references the unchanged `firestore.rules` and `backend/firestore.spark.indexes.json`. Its only field overrides are the existing collection indexes and descending collection-group indexes for `requests.createdAt` and `quotes.createdAt`. It contains no Storage, Functions or TTL configuration. The main production configuration is preserved for later activation of paid services.

Keep `--non-interactive` and do not add `--force`: the current Firebase CLI leaves unrelated remote indexes and field overrides intact when they are absent from this file. Review the deployment output. This setup does not disable previously deployed TTL policies or other services, and is not a billing downgrade procedure. If applying only rules while reviewing existing indexes separately, use `firebase deploy --config firebase.spark.json --only firestore:rules --project tech-customer-portal`.

Once the database rules, both collection-group indexes and actual owner/customer account checks pass, set `NEXT_PUBLIC_PORTAL_WORKSPACE_ENABLED=true`, rebuild and republish to expose customer quotations, timelines and in-app notifications. Keep uploads, email, analytics and the cloud AI endpoint disabled until their separate activation checks pass. No frontend capability flag grants owner permissions.

To remove the role, repeat the same identity command with `--revoke --apply`. Existing ID tokens can remain valid until expiry (typically up to one hour), even after refresh-token revocation.

## 2. Private storage, only after billing approval

Firebase Cloud Storage currently requires the Blaze billing plan, even for no-cost usage. See [Firebase's official storage notice](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024). Choose a budget and configure billing alerts before activation; alerts are not hard spending caps. Keeping this capability disabled preserves the frontend and enquiry workflow.

After the account owner approves billing:

1. Create the default bucket in Firebase Storage. Confirm its exact name matches `lib/firebase.ts`; do not assume provisioning has already occurred.
2. Deploy `storage.rules`: `firebase deploy --only storage --project tech-customer-portal`. Firebase may request the documented permission for Storage rules to consult Firestore. Confirm that cross-service authorization is configured.
3. Configure bucket CORS for the exact production origin so authenticated SDK blob downloads work. Use `storage.cors.json` as the production template; add localhost only for a deliberate local test. Apply with the official Google Cloud CLI: `gcloud storage buckets update gs://YOUR_CONFIRMED_BUCKET --cors-file=backend/storage.cors.json` from the repository root.
4. Set `NEXT_PUBLIC_PORTAL_UPLOADS_ENABLED=true`, rebuild, publish, and test using controlled accounts. Owner photos are separated under `owner-media/{uid}/personal` and `owner-media/{uid}/business`. Neither category is publicly published.
5. Verify customer attachments cannot be read by another customer or overwrite an existing object. Supported types are JPEG, PNG, WebP, AVIF and, for project attachments, PDF. Media is limited to 8 MB; attachments to 10 MB. No automatic malware scan is implemented; assess that requirement before accepting files broadly.

Private downloads use authenticated `getBlob`, not public token URLs. A filename or document field cannot grant permission. The database and storage rules enforce the role and ownership checks independently of the interface.

## 3. Optional email notifications

Deploying Cloud Functions requires a billing-enabled project. The current optional adapter uses Resend, which needs an account, a verified sender domain and a server-only API key. A `pages.dev` website address is not a sender domain you own. See [Functions setup](https://firebase.google.com/docs/functions/get-started) and [Resend domains](https://resend.com/docs/dashboard/domains/introduction).

1. Configure and verify the sender domain in Resend. Create a restricted sending key and store it using `firebase functions:secrets:set RESEND_API_KEY --project tech-customer-portal`. Enter the secret locally, never in chat or a `NEXT_PUBLIC_` variable.
2. Set the Functions parameters `PORTAL_EMAIL_ENABLED=true`, `PORTAL_EMAIL_FROM` to the verified sender address, `PORTAL_SITE_URL=https://4tech-9cy.pages.dev`, and `PORTAL_FUNCTION_REGION` to the chosen supported region. Use the deployment prompts or a local ignored Functions environment file.
3. Deploy only `emailProjectNotification` from the `portal` codebase. Review the CLI's selected function before confirming deployment. Do not deploy the whole codebase just to activate customer email: it now also contains an optional scheduled founder summary with separate setup and billing implications (section 6).
4. Enable the frontend flag `NEXT_PUBLIC_PORTAL_EMAIL_ENABLED=true` and republish. A customer must explicitly opt in through Notifications before email is sent. Verify one controlled test account end to end.

The trigger responds to new in-app notification documents, resolves recipients from verified Firebase Auth, rechecks consent immediately before sending, and omits confidential project details from email. Transactional leases and provider idempotency keys limit duplicate sends. Delivery records are private under `mailDeliveries`. Retries stop before the provider's 24-hour deduplication window; inspect `failed` or `uncertain` records manually rather than blindly resending. There is no marketing email. Optional founder summaries are separate and default to disabled.

## Verification and operations

- App tests: `npm test`; Functions tests: `npm --prefix backend/functions test`.
- Rules tests: [security-tests/README.md](security-tests/README.md). Genuine local Firestore and Storage emulators cover 203 assertions, including the fixed overwrite defect.
- Review quotas, billing alerts, Auth settings and failed deliveries periodically. Establish retention and account-deletion handling; deleting an Auth user alone does not remove their Firestore records or files.
- Back up important records before changing rules. Keep service-account keys outside the repository. Do not expose emulator ports to the public internet.
- Complete real browser sign-in, quotation response, upload/download, account-switch and email delivery checks after activation. Local tests are not evidence these external services are live.


## 4. Optional consent-based visitor overview

The owner dashboard reads server-created visitorSessions and visitorDays. It never identifies anonymous visitors. The frontend shows an unavailable state until configured; there are no sample names or seeded counters.

1. Register the web app with Firebase App Check using reCAPTCHA Enterprise and the actual production hostname. Review provider quotas. This implementation requires billing-enabled Cloud Functions and Firestore TTL deletes; do not upgrade the account without the owner's approval.
2. After billing approval, deploy Firestore rules and indexes using the full configuration: `firebase deploy --config firebase.json --only firestore --project tech-customer-portal --non-interactive`. This includes the quotes collection-group index and the visitor expiry policies omitted by the Spark configuration. Do not add `--force`; preserve unrelated remote settings. Confirm TTL policies are active. Expired records are also excluded in the dashboard because TTL deletion is asynchronous.
3. Set PORTAL_ANALYTICS_ENABLED=true and the chosen PORTAL_FUNCTION_REGION for the Functions codebase, then deploy recordVisitorActivity. It enforces App Check, an allowed public-route list, server timestamps, bounded counters and token-derived names.
4. Set NEXT_PUBLIC_PORTAL_ANALYTICS_ENABLED=true, NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY to the public site key, and NEXT_PUBLIC_PORTAL_FUNCTION_REGION to the same region. Rebuild the frontend.
5. With controlled test accounts, check: declining sends nothing; allowing anonymous counts never stores names; the separate name checkbox records a verified opted-in account; withdrawal stops future collection; customer/owner workspace paths are excluded; customers cannot read or write visitor records.
6. Grant the owner claim using the identity-matching procedure above, not a client-side email comparison. Check orders and the visitor overview with the actual owner account before launch.

Recorded sessions are tab/day/privacy-scope records, not unique humans. Repeated same-page views and events less than 30 seconds apart are skipped. Limits are 50 events per session and 5,000 accepted events per UTC day. These limits do not constitute provider billing caps. Names can be absent even for a verified account if no display name was provided. Deleting an account requires separately finding/removing its analytics records.

The expanded local emulator suite passes 203 assertions, including visitor confidentiality, forgery prevention and the owner's quotation collection-group query. Production activation remains separate.

## 5. Project idea assistant

See [idea-assistant/README.md](idea-assistant/README.md). The Cloudflare Worker is independent of Firebase Functions and can be activated separately. With no endpoint configured, the idea page explicitly provides a local worksheet rather than claiming AI generation.

## 6. Optional weekly founder briefing (prepared, not activated)

`emailWeeklyFounderSummary` is exported by the Functions entry point and runs on Monday at 09:00 Asia/Kolkata when deployed and enabled. It summarizes the previous complete Monday-to-Sunday **UTC** week so its counts agree with the visitor database's UTC daily aggregates. The email contains new enquiry count, quotations issued, the current accepted count within that quotation cohort, and consented recorded page events/daily sessions if analytics is enabled. Daily sessions are not unique people or deduplicated weekly visitors. An acceptance on an older quotation is not counted as a new acceptance for this report. It does not invent traffic when collection is disabled.

This adapter sends aggregate counts and an authenticated `/owner` link only. Customer names, messages, addresses, attachment URLs and project descriptions are excluded. The intended recipient must match **both** configured founder UID and email in Firebase Auth, have `emailVerified === true` and `customClaims.owner === true`, be enabled, and opt into email updates. Identity, owner permission and preference are rechecked immediately before sending. Other owners do not receive the report automatically.

Activation requires restored access to the actual Firebase project, an explicit billing decision, Cloud Scheduler API availability, the private Firestore rules/indexes, a verified sending domain and the server-only Resend key described above. [Firebase scheduled-function documentation](https://firebase.google.com/docs/functions/schedule-functions) explains that deployment creates the scheduling resources. Setting the boolean to false stops report delivery, but does not remove an already-deployed Scheduler job or guarantee zero infrastructure cost.

1. Keep `PORTAL_WEEKLY_SUMMARY_ENABLED=false` while setup is incomplete. No public frontend flag enables this job.
2. Confirm the founder's exact Firebase Auth UID and verified email using section 1. Set server parameters `PORTAL_FOUNDER_UID` and `PORTAL_FOUNDER_EMAIL` to those values. Do not use an editable profile document as an identity source.
3. Set `PORTAL_EMAIL_FROM`, `PORTAL_SITE_URL`, `PORTAL_FUNCTION_REGION` and the `RESEND_API_KEY` secret as in section 3. `PORTAL_WEEKLY_SUMMARY_ENABLED` is independent of `PORTAL_EMAIL_ENABLED`; both must be considered when pausing all mail. Set `PORTAL_ANALYTICS_ENABLED` only when the consented analytics service is actually operating.
4. Confirm the founder has explicitly enabled email updates in the account notifications settings. Then set `PORTAL_WEEKLY_SUMMARY_ENABLED=true` and deploy only the scheduled function after approving the associated services. Review the deployment plan so unrelated functions are not removed or enabled.
5. Validate with an explicitly authorized controlled delivery. Check the matching private `mailDeliveries` record and counts against the source date range. Review logs for code-only failures; do not copy recipients, provider payloads or secrets into logs.

The report reuses the transactional delivery ledger, a stable project/founder/week idempotency key, frozen retry payloads, bounded leases and a 23-hour application retry window. Scheduler retries are additionally bounded to 6 hours. Expired ambiguous sends become `uncertain`, not automatic resends. Keep the ledger; deleting it can allow a duplicate. A query returns at most 501 records for each enquiry/quotation collection group; more than 500 causes `summary-capacity-exceeded` instead of publishing misleading truncated totals. Increase capacity using validated server aggregates before this scale is reached. There is no externally configurable webhook endpoint or external alert delivery in this release.

Local verification: `npm --prefix backend/functions test` passes 39 tests, including the consented customer sign-in audit and weekly-summary cases covering permission/consent changes, aggregate privacy, correct week boundaries, invalid/oversized data, duplicate/concurrent jobs, recipient changes and retry safety. `npm --prefix backend/functions run check` checks all deployed source modules. These tests perform no real Firebase writes or email sends and do not prove production activation.
