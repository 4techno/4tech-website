import { copyFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

// Next 16.3's Windows exporter passes backslashes to the segment filename
// encoder. Browsers request dotted filenames, but Windows emits directories.
// Add the expected flat file next to that segment tree; never alter its bytes.
export function normalizeExportSegments(root) {
  let fixed = 0;
  const flatten = (directory, origin) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) flatten(path, origin);
      else if (entry.isFile() && entry.name.endsWith('.txt')) {
        const filename = relative(origin, path).split(/[\\/]/).join('.');
        copyFileSync(path, join(origin, filename));
        fixed++;
      }
    }
  };
  const walk = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name === '_next') continue;
      const path = join(directory, entry.name);
      if (entry.name.startsWith('__next.')) flatten(path, directory);
      else walk(path);
    }
  };
  walk(root);
  return fixed;
}
