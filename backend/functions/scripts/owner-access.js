import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { parseArguments, proposedClaims } from "./owner-access-model.js";

try {
  const options = parseArguments(process.argv.slice(2));
  if (process.env.FIREBASE_AUTH_EMULATOR_HOST) throw new Error("Unset FIREBASE_AUTH_EMULATOR_HOST before using the production owner provisioning command.");
  const app = initializeApp({ credential: applicationDefault(), projectId: options.project });
  const auth = getAuth(app);
  const user = await auth.getUser(options.uid);
  proposedClaims(user, options);
  console.log(`${options.apply ? "APPLY" : "DRY RUN"}: ${options.revoke ? "remove" : "grant"} owner access`);
  console.log(`Project: ${options.project}\nUser: ${options.uid}\nVerified email: ${user.email}`);
  console.log("All other existing claims will be preserved.");
  if (options.apply) {
    // Re-read just before writing so claims from an earlier dry run are not used.
    const fresh = await auth.getUser(options.uid);
    await auth.setCustomUserClaims(options.uid, proposedClaims(fresh, options));
    if (options.revoke) await auth.revokeRefreshTokens(options.uid);
    console.log("Updated. Sign out and sign in again to refresh access. Existing ID tokens can remain valid until expiry (typically up to one hour).");
  } else console.log("No changes made. Review the identity above, then repeat the exact command with --apply.");
} catch (error) {
  // Credential/library errors can include sensitive paths or backend details.
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  console.error(code ? `Provisioning failed (${code}). Check your local administrator credentials and explicit project.` : error.message);
  process.exitCode = 1;
}
