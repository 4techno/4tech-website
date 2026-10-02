import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const root = resolve(process.argv[2] || '.next-pages');
const failures = [];
let checked = 0;
const prohibited = [
  /Founder Master Passkey/i,
  /VALID_MASTER_KEYS/,
  /getInitialSeedTraffic/,
  /NEXT_PUBLIC_GEMINI_API_KEY/,
  /AMEENA_PASSKEYS/,
  /amee74373@/i,
  /BEGIN (?:RSA |EC )?PRIVATE KEY/,
  /"type"\s*:\s*"service_account"/,
];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) { walk(path); continue; }
    if (/^\.env(?:\.|$)|service.account|credentials/i.test(entry.name)) failures.push(relative(root, path));
    if (!/\.(html|js|json|txt|css)$/.test(entry.name) || statSync(path).size > 15_000_000) continue;
    checked++;
    const text = readFileSync(path, 'utf8');
    if (prohibited.some(pattern => pattern.test(text))) failures.push(relative(root, path));
  }
}
walk(root);
if (failures.length) throw new Error(`Public export audit failed in ${[...new Set(failures)].join(', ')}. Private values are not printed.`);
console.log(`Public export audit passed: ${checked} text assets checked for retired authorization, seeded data and private content.`);
