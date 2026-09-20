# Deploy the 4tech Next.js application

This is the deployment guide for the **`4tech-next`** source project. Cloudflare Pages is the current hosting target: **https://4tech-9cy.pages.dev/**. Vercel remains an optional alternative. No custom domain purchase or DNS change is required.

## Publish to the existing Cloudflare Pages project

1. Run `npm ci`, `npm test` and `npm run build:pages` from the project root.
2. The Pages build exports the website into **`.next-pages/`**. It uses `https://4tech-9cy.pages.dev` as the canonical address unless `NEXT_PUBLIC_SITE_URL` explicitly overrides it. Images are exported as ordinary assets; Firebase sign-in and enquiries continue in the browser.
3. Zip the **contents** of `.next-pages/`. The ZIP must contain `index.html`, `_headers` and `_next/` at its root, without an enclosing folder. Do not upload the source, `.next/`, credentials, dependencies or owner documentation.
4. Open Cloudflare **Workers & Pages → 4tech → Create deployment**, select **Production**, upload the ZIP and select **Save and deploy**.
5. Wait for success, then open https://4tech-9cy.pages.dev/ and check `/portfolio`, `/resume`, `/projects`, an individual project and `/account`. The existing Pages address remains the same.

The generated `404.html` provides real not-found responses. Do not add a blanket single-page-app rewrite. `_headers` supplies security and static-asset cache headers, and serves the extensionless Open Graph asset as PNG. Never copy a restrictive legacy CSP without testing Next.js hydration and Firebase authentication.

This project is a Direct Upload project. A GitHub source repository is a separate backup/version-control destination; pushing commits alone does not redeploy it. Repeat this export/upload workflow for future releases. [Cloudflare Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports).

## Prepare the source

Use Node.js 22 or newer. From the project root, which contains `package.json`, run:

```text
npm ci
npm run typecheck
npm test
npm run build
```

Review any failures before publishing. `npm start` serves the production build locally after a successful build; open **http://localhost:3000** and use that authorized hostname for local Google sign-in. Keep `package-lock.json` in the source repository so Vercel installs the same dependency versions. Do not upload `node_modules/`, `.next/`, `.env.local`, private credentials or service-account files.

The default build uses standard Next.js rendering and image handling, with 15 statically generated public project routes. `npm run build:pages` selects the static-export configuration instead; `.next/` is not a Cloudflare Pages upload archive.

## Import into Vercel

Vercel's Hobby plan is restricted to personal, noncommercial use. Because 4tech advertises paid services, choose a plan eligible for that business use; do not assume the free Hobby plan covers it. Domain registration, if chosen later, is separate. [Vercel commercial-use policy](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage).

1. Put the source in a repository you control and sign in to Vercel.
2. Select **Add New → Project** and import the repository. If this project is nested in a larger repository, set its Root Directory to `4tech-next`. If the project contents are already at the repository root, leave Root Directory at the root.
3. Use an available branded project name. Vercel assigns an address; a specific `4tech.vercel.app` name is not promised or reserved by this guide.
4. Confirm the settings below, configure the public site URL, and deploy only when ready.

| Setting | Value |
| --- | --- |
| Framework Preset | **Next.js** |
| Root Directory | Folder containing this project's `package.json` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | Leave the Next.js default, override off; Next.js builds into `.next` |
| Node.js | A Vercel-supported version compatible with the source requirement of Node.js 22+ |

Vercel detects Next.js and manages its build output. Do not select **Other** or set the output to `dist` or `public`. [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [build settings](https://vercel.com/docs/builds/configure-a-build).

## Set the production URL

In **Project → Settings → Environment Variables**, set:

```text
NEXT_PUBLIC_SITE_URL=https://YOUR-ACTUAL-PRODUCTION-HOSTNAME
```

Use the exact HTTPS production URL assigned to this project, or a custom domain only after it is configured. Do not paste an email address, a hostname that does not serve this application, a localhost URL or the literal example above into the production setting. The value must include `https://`.

`config.js` exports `siteConfig` and `siteUrl(path)`. The helper uses `NEXT_PUBLIC_SITE_URL` first, then Vercel's project production URL if supplied, then localhost for development. An explicit production value makes your intended canonical address clear. Redeploy after changing it because metadata and public environment variables are resolved during the build. Preview protection is a separate setting; using a production canonical does not restrict access.

This variable is public. It is not a credential, a domain purchase or a DNS configuration.

## Configure Firebase for the new address

The existing project **`tech-customer-portal`** is referenced by `lib/firebase.ts`. A new host does not automatically authorize Google sign-in or publish database rules.

1. Open that project in the Firebase console.
2. Ensure **Authentication → Sign-in method** has Google and Email/Password enabled.
3. Under **Authentication → Settings → Authorized domains**, add the actual production hostname, without `https://` or a path. Confirm `localhost` is authorized for local testing at `http://localhost:3000`. Add a preview hostname only if you intentionally want customers/test accounts to sign in there. Keep the existing Cloudflare hostname while the old site is still in use.
4. Keep `authDomain: 'tech-customer-portal.firebaseapp.com'` in the web configuration for the current popup flow. Replacing it with the Vercel hostname alone does not configure Firebase's authentication helpers.
5. Ensure the default Firestore database exists. Review the source-root `firestore.rules` and publish them in **Firestore Database → Rules** for this exact project. These rules affect every application using that database, including the existing customer portal, so retain the intended ownership and verification checks.
6. Check the configured password policy, verification/reset templates and service quotas. No private server key is required in this app or in Vercel.

Firebase web config is intentionally public. Access control is enforced by Authentication and the rules, not by keeping the config out of view. See the [owner guide](CUSTOMER-AREA-OWNER-GUIDE.md), [Google sign-in documentation](https://firebase.google.com/docs/auth/web/google-signin) and [Firebase API-key guidance](https://firebase.google.com/docs/projects/api-keys).

## Check the published application

After the hosting provider reports success:

1. Open the stable production domain while signed out. Follow **Website → Portfolio → Résumé** through `/`, `/portfolio` and `/resume`, including the PDF download. `/projects` and all 15 case studies should also be public. Check hosting protection settings if those pages unexpectedly require a Vercel login.
2. Check canonical/share URLs use the intended production origin, including `/projects/antenna` and another individual case study. An unknown project slug should return a not-found response.
3. Check a phone-sized viewport, keyboard focus, project search and the galaxy's pause/reduced-motion behavior. Confirm the catalogue groups contain 7 Research Level, 6 Advanced and 2 Intermediate entries; the personal portfolio selects antenna, robotic arm, drone and SewerSense. Confirm concept labels and SVG-illustration labels remain visible. Test each social icon's destination and tooltip using pointer and keyboard focus. YouTube should remain absent until an actual channel is configured.
4. Test Google sign-in on the actual hostname. Test email registration, verification and reset using accounts you control.
5. Submit a small verified test enquiry and confirm the server acknowledges it. Verify another customer cannot read or change it. Confirm an owner change to `status` or `updateMessage` appears only in the intended customer's history.
6. Remove test records and accounts appropriately. Deleting only the Authentication user does not delete their Firestore documents.

Enquiry notifications are not automated. The owner must check Firebase and communicate manually. These steps are release checks to perform, not a claim that live services have already passed.

## Optional custom domain later

Choose and register a domain only when you want one. For the current hosting, add it under **Cloudflare Pages → 4tech → Custom domains** and follow the displayed DNS instructions. For a future Vercel deployment, use **Project → Settings → Domains**. Preserve existing email MX/TXT records. Wait for verification and HTTPS, update `NEXT_PUBLIC_SITE_URL`, authorize the hostname in Firebase and redeploy. Recheck public pages and sign-in before sharing the new address. [Cloudflare custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), [Vercel custom-domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

## Google Search Console

Use the URL-prefix property `https://4tech-9cy.pages.dev/` in [Google Search Console](https://search.google.com/search-console). The public Google ownership tag is configured in `app/layout.tsx` using `metadata.verification.google`. Keep it in future deployments so ownership remains verified; it is a public verification value, not a private API credential.

Under **Sitemaps**, submit `https://4tech-9cy.pages.dev/sitemap.xml`. The sitemap lists the 20 public pages and excludes the customer account. Use **URL inspection** for the homepage or a substantially updated page, then **Request indexing** when appropriate. Inspect the indexing reports for Google's actual crawl and indexing status. Submission does not guarantee inclusion or a ranking.

If the production domain changes, verify the new property, update the canonical origin and submit its sitemap. Keep the current property while planning a migration. [Google's verification guide](https://support.google.com/webmasters/answer/9008080) and [URL Inspection guide](https://support.google.com/webmasters/answer/9012289).

## Future changes

Edit the source, run the checks, and publish through the Cloudflare upload workflow above or a deliberately configured Vercel deployment. `config.js` centralizes founder-image, social and contact destinations; `lib/projects.ts` owns the curated records, difficulty groups, ranking and selected-project export. Follow the engineering-content guidance in [README.md](README.md), including the distinction between proposed concepts, illustrations and demonstrated results. Account status updates made in Firebase do not need a website redeployment.

Do not delete or redirect the existing Cloudflare site as part of importing this source. Any later migration of its public link is a separate action.
