import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { REVIEW_LINKS } from '../src/links.mjs';

test('generates non-empty SVG and PNG from the permanent tracked URL', () => {
  const svg = readFileSync(new URL('../dist/assets/the-bs-club-review-qr.svg', import.meta.url), 'utf8');
  const png = statSync(new URL('../dist/assets/the-bs-club-review-qr.png', import.meta.url));
  const encodedUrl = REVIEW_LINKS.permanentShareUrl
    .replaceAll('&', '&amp;')
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  assert.match(svg, new RegExp(`data-encoded-url="${encodedUrl}"`));
  assert.ok(png.size > 5000);
});
