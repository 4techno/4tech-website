export function parseArguments(args) {
  const result = { apply: false, revoke: false };
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--apply" || arg === "--revoke") { result[arg.slice(2)] = true; continue; }
    if (!["--project", "--uid", "--email"].includes(arg) || !args[index + 1] || args[index + 1].startsWith("--")) throw new Error("Use --project PROJECT_ID --uid FIREBASE_UID --email VERIFIED_EMAIL [--revoke] [--apply]. Without --apply, nothing is changed.");
    const key = arg.slice(2);
    if (key in result) throw new Error(`Duplicate argument: ${arg}`);
    result[key] = args[++index];
  }
  if (!/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(result.project ?? "")) throw new Error("An explicit valid Firebase project ID is required.");
  if (!result.uid || result.uid.length > 128 || /[\s/]/.test(result.uid)) throw new Error("An explicit Firebase user UID is required.");
  if (!/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(result.email ?? "")) throw new Error("An explicit verified email address is required.");
  return result;
}
export function proposedClaims(user, options) {
  if (user.uid !== options.uid || user.email?.toLowerCase() !== options.email.toLowerCase()) throw new Error("Firebase account does not match both the supplied UID and email. Nothing changed.");
  if (!user.emailVerified) throw new Error("The account email must be verified first. Nothing changed.");
  if (user.disabled && !options.revoke) throw new Error("A disabled account cannot receive owner access.");
  const next = { ...user.customClaims };
  if (options.revoke) delete next.owner;
  else next.owner = true;
  if (Buffer.byteLength(JSON.stringify(next), "utf8") > 1000) throw new Error("The merged custom claims exceed Firebase's limit. Nothing changed.");
  return next;
}
