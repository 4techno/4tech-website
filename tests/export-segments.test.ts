import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { normalizeExportSegments } from '../scripts/normalize-export-segments.mjs';

test('Windows nested route payloads receive the dotted URLs requested by Next navigation', () => {
  const root = mkdtempSync(join(tmpdir(), 'fourtech-export-'));
  try {
    const nested = join(root, 'projects', 'antenna', '__next.projects', '$d$slug');
    mkdirSync(nested, { recursive: true });
    writeFileSync(join(nested, '__PAGE__.txt'), 'flight-payload');
    writeFileSync(join(root, 'index.html'), '<main>Readable</main>');
    assert.equal(normalizeExportSegments(root), 1);
    assert.equal(readFileSync(join(root, 'projects', 'antenna', '__next.projects.$d$slug.__PAGE__.txt'), 'utf8'), 'flight-payload');
    assert.equal(readFileSync(join(root, 'index.html'), 'utf8'), '<main>Readable</main>');
    assert.equal(normalizeExportSegments(root), 1);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
