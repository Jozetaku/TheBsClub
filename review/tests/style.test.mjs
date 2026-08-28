import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../dist/review.css', import.meta.url), 'utf8');

test('uses the approved brand tokens and dominant gold review action', () => {
  for (const colour of ['#123f35', '#fff8e9', '#efcf62', '#ef725d', '#35564f']) {
    assert.match(css.toLowerCase(), new RegExp(colour));
  }
  assert.match(css, /\.review-primary\s*\{[^}]*min-height:\s*72px[^}]*background:\s*var\(--gold\)/s);
});

test('supports mobile-first layout and accessible controls', () => {
  assert.match(css, /min-height:\s*48px/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(min-width:\s*760px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(css, /overflow-x:\s*(?:scroll|auto)/);
});

test('keeps the refined hero, social targets and QR compact', () => {
  assert.match(css, /\.headline-line\s*\{[^}]*display:\s*block/s);
  assert.match(css, /\.social-shortcut\s*\{[^}]*width:\s*48px[^}]*min-height:\s*48px/s);
  assert.match(css, /\.qr-card\s*>\s*img\s*\{[^}]*height:\s*auto/s);
  assert.doesNotMatch(css, /\.trust-marker\s*\{/);
});
