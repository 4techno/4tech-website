# 4tech customer area — owner guide

This guide covers the **4tech-next** application. Customer accounts and enquiries use the Firebase project **`tech-customer-portal`**, configured in `lib/firebase.ts`. The customer page is `/account`; the privacy page is `/privacy`. Public assets live in `public/`, while the database rules stay at the source root.

The updated application is published at [4tech-9cy.pages.dev](https://4tech-9cy.pages.dev/). No Vercel deployment or custom-domain purchase/configuration was performed. See [DEPLOYMENT.md](DEPLOYMENT.md) for publishing instructions and [VERIFICATION.md](VERIFICATION.md) for the recorded checks and their limits.

## What customers can do

- Follow **Website → Portfolio → Résumé** and browse the 15-project engineering collection without signing in.
- Sign in with Google or create an email/password account. The registration form requires at least 12 password characters and checks the Firebase project's password policy.
- Request a password-reset email. The page deliberately does not reveal whether an email address already has an account.
- Select **Send verification email**, follow its link, then select **I've verified my email**. A verified email address is required before saving an enquiry.
- Send a title, category, optional timeline and description. Their own enquiry history shows the submission time, status and any owner update.

An enquiry is not a paid order, accepted scope or guaranteed delivery date. There is no payment system, file upload, chat or customer editing/deletion interface. Contact and deletion requests are handled by the owner. WhatsApp and email links provide separate contact options; they do not create Firestore enquiries automatically.

## Required Firebase configuration

Open the [Firebase project console](https://console.firebase.google.com/project/tech-customer-portal/overview) using an account authorized to administer this project.

1. Under **Authentication → Sign-in method**, ensure **Email/Password** and **Google** are enabled. Configure the Google provider's required project support details in the console.
2. Under **Authentication → Settings → Authorized domains**, add the actual hostname assigned to the Next.js application before using Google sign-in there. Keep `4tech-9cy.pages.dev` while the existing site is in use. For local testing, open **http://localhost:3000** and confirm `localhost` is authorized; it may not have been added automatically.
3. Review the project's password policy and email templates. Keep the policy understandable to customers and aligned with the registration form's minimum. The browser cannot send password-reset or verification messages if the relevant service quota or configuration prevents it.
4. Ensure a **Cloud Firestore default database** exists in this project. The application uses Firestore, not Realtime Database.
5. Open **Firestore Database → Rules**, compare them with the source-root `firestore.rules`, review and **Publish** the intended rules. Do not use public test-mode rules. A Next.js/Vercel deployment does not publish database rules. This database is shared with the existing portal, so rule changes affect both applications.
6. Verify that `lib/firebase.ts` names `tech-customer-portal` and its registered web app. The current popup flow uses `tech-customer-portal.firebaseapp.com` as `authDomain`; do not replace that value with a Vercel/custom hostname simply to rebrand the address.

The Firebase web configuration and its API key are intended to be public. Never add service-account JSON, private keys, admin passwords or unrelated secret tokens to client modules, `public/` or `NEXT_PUBLIC_*` variables. Firestore's rules and your Firebase account permissions control database access; hiding the config does not provide that protection. Hosting and Firebase project access should remain limited to authorized people.

The supplied rules allow an authenticated customer to read their own request path, allow a verified customer to create a validated request with initial status `Submitted`, and deny customer updates or deletions. They deny other paths. Firebase console administration uses your project permissions, so it is your responsibility to edit the correct customer's record.

## Review enquiries

**There are no automatic owner notifications.** Check Firebase regularly while accepting enquiries. Customers will not receive email or WhatsApp alerts when you edit their status; they see changes in their account while the page is connected, or on their next visit.

1. Open **Authentication → Users**. Find the customer's email address and copy their **User UID**. Firebase holds the email/name profile; enquiry documents do not duplicate those fields.
2. Open **Firestore Database → Data** and navigate to `users` → that exact UID → `requests` → the relevant request document.
3. Read `title`, `category`, `timeline`, `details`, `createdAt` and `status`. The UID parent may have no fields of its own; the records live in its `requests` subcollection. A newly registered account with no enquiry will not yet have request data here.
4. When discovering new requests by browsing `users`/`requests`, match the parent UID back to **Authentication → Users** before contacting the customer. Do not infer identity from the typed project description.

The full document path is:

```text
users/{customer Firebase UID}/requests/{request document ID}
```

There is no owner dashboard or combined customer inbox in the website itself. Do not try to obtain owner access by signing into the ordinary customer page: it deliberately shows only that account's requests.

## Publish a customer update

In the correct request document, edit the existing **string** field `status`. You can use clear labels such as `Under review`, `Awaiting your reply`, `Scope agreed`, `In progress` or `Completed`, but use a label only when it matches the actual work. These are suggested labels, not an automated workflow.

Optionally add or edit the **string** field `updateMessage`. For example, after actually reviewing an enquiry: “Please share your component list so we can confirm the project scope.” This field is displayed as **Update from 4tech**. It is a single current message; replacing it does not create a message history.

You may also add a Firestore **timestamp** field `updatedAt` for the actual time of that update. The customer interface shows it beside the update message when present. Keep the value a timestamp, not a formatted text string.

Save the document. Preserve the original brief and `createdAt` timestamp. Do not move the request to another UID, change its owner path or store passwords, payment information or sensitive documents in it. The customer page displays your changes but does not send a notification. Arrange any separate email/WhatsApp communication yourself.

## Customer privacy and account requests

The Next.js privacy page at **`/privacy`**, authored in `app/privacy/page.tsx`, explains accounts, enquiries, Firebase and contact options. Keep it accurate when adding features or changing how you use data. Contact destinations are centralized in `config.js`.

For correction or deletion requests, first verify account ownership through an appropriate private channel. Check the exact UID and request records before changing anything. **Deleting a Firebase Authentication user does not delete their Firestore enquiry documents.** Handle the account and its request data separately, and confirm the intended records are gone before telling the customer deletion is complete. Never publish customer email addresses, briefs or console screenshots in the public portfolio.

Authentication may persist in a browser. Sign out after using a shared device. Local previews use the same configured Firebase project; do not submit real personal details as test data or leave test enquiries mixed with active customer work.

## Checks before a public release

These are checks to perform, not recorded results:

1. Confirm `/`, `/portfolio`, `/resume`, `/projects` and all 15 case studies are accessible while signed out. Check that the résumé download matches the readable résumé page. `/account` is also public as a sign-in entry point; authentication is required for its private enquiry data.
2. Check Google sign-in on the actual production hostname, including the popup and sign-out flow. Check email registration, password reset and verification using accounts you control.
3. Before email verification, confirm enquiry submission is disabled. After the verification link and status refresh, confirm a small test enquiry receives server confirmation and appears in the correct UID path.
4. Sign out and use a second test account. It must not show the first account's enquiry. Use the Firebase Rules Playground or emulator to check direct cross-account reads/creates and customer status edits are denied; hiding a record in the interface alone is not sufficient.
5. Edit the test request's `status` and `updateMessage` in the console and confirm the intended customer sees the update. Confirm another account still cannot access it.
6. Check connection-loss messaging and mobile layout. Clean up your test accounts and their request records after checking.

The package's `npm test` currently covers animation physics, not these live authentication/database workflows. Firebase configuration and rule publication require their own verification. Consult [VERIFICATION.md](VERIFICATION.md) for what was actually checked. Keep this guide and `firestore.rules` in the source package, outside `public/`; deploy the Next.js application using [DEPLOYMENT.md](DEPLOYMENT.md).

## Reference documentation

- [Firebase web setup](https://firebase.google.com/docs/web/setup)
- [Google sign-in on the web](https://firebase.google.com/docs/auth/web/google-signin)
- [Email/password authentication](https://firebase.google.com/docs/auth/web/password-auth)
- [Verification, reset emails and user management](https://firebase.google.com/docs/auth/web/manage-users)
- [Firebase web API keys](https://firebase.google.com/docs/projects/api-keys)
- [Authentication in security rules](https://firebase.google.com/docs/rules/rules-and-auth)
- [Firebase Authentication limits](https://firebase.google.com/docs/auth/limits)
