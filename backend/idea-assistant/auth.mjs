const KEY_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
let cache = { expires: 0, keys: [] };
let pending;
const decoder = new TextDecoder();
const encoder = new TextEncoder();
function bytes(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error("Invalid token");
  return Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/")), character => character.charCodeAt(0));
}
export async function googleSigningKeys() {
  if (cache.expires > Date.now()) return cache.keys;
  pending ??= (async () => {
    const response = await fetch(KEY_URL, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error("Identity service unavailable");
    const data = await response.json();
    if (!Array.isArray(data.keys) || !data.keys.length) throw new Error("Invalid signing keys");
    const age = Number(response.headers.get("cache-control")?.match(/max-age=(\d+)/)?.[1] || 300);
    cache = { keys: data.keys, expires: Date.now() + Math.max(60, Math.min(age, 3600)) * 1000 };
    return cache.keys;
  })().finally(() => { pending = undefined; });
  return pending;
}
export async function verifyFirebaseToken(token, project, keys = googleSigningKeys, now = Math.floor(Date.now() / 1000)) {
  if (!project || typeof token !== "string" || token.length > 12000) throw new Error("Invalid token");
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid token");
  const header = JSON.parse(decoder.decode(bytes(parts[0]))), claims = JSON.parse(decoder.decode(bytes(parts[1])));
  if (header.alg !== "RS256" || typeof header.kid !== "string" || header.kid.length > 128 || header.crit) throw new Error("Invalid token");
  if (claims.aud !== project || claims.iss !== "https://securetoken.google.com/" + project || typeof claims.sub !== "string" || !claims.sub.length || claims.sub.length > 128) throw new Error("Invalid identity");
  if (![claims.exp, claims.iat, claims.auth_time].every(Number.isFinite) || claims.exp <= now || claims.iat > now + 30 || claims.auth_time > now + 30 || claims.exp <= claims.iat || claims.auth_time > claims.iat + 30) throw new Error("Expired or invalid token");
  if (claims.email_verified !== true || claims.firebase?.sign_in_provider === "anonymous") throw new Error("Verified account required");
  const key = (await keys()).find(item => item.kid === header.kid && item.kty === "RSA" && (!item.alg || item.alg === "RS256"));
  if (!key) throw new Error("Unknown signing key");
  const imported = await crypto.subtle.importKey("jwk", key, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  if (!await crypto.subtle.verify("RSASSA-PKCS1-v1_5", imported, bytes(parts[2]), encoder.encode(parts[0] + "." + parts[1]))) throw new Error("Invalid signature");
  return { uid: claims.sub };
}
