# Local access-control tests

Requirements: Node.js 22+, Java 21+ on PATH. From this folder, run `npm ci` then `npm test`. Firebase downloads its emulator binaries on first run. Use available local ports 8187 and 9197.

The suite is locked to the fake project `demo-fourtech-portal-security` and local emulator addresses. It does not need production credentials or create real users. It tests both Firestore and Storage, including cross-customer isolation, verified owner claims, quotations, private photo categories, upload sizes, existing-object overwrite prevention and Firestore-backed attachment authorization.

A passing result requires unchanged source-rule hashes and both emulators. The initial verified report records 177 passing assertions (128 Firestore, 49 Storage). Each new run writes `portal-rules-test-report.json`. Emulator checks do not prove production deployment, billing activation, browser sign-in or real email delivery.
