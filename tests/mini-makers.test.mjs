import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

test('keeps the ladder-climbing Mini Makers hero signature', () => {
  assert.match(html, /class="mini-makers"[^>]*aria-hidden="true"/);
  assert.match(html, /class="giant-bowl"/);
  assert.match(html, /class="giant-boba"/);
  assert.match(html, /class="maker-ladder"/);
  assert.ok((html.match(/class="mini-worker/g) ?? []).length >= 3);
});

test('uses subtle motion with safe fallbacks', () => {
  assert.match(css, /@keyframes\s+makerClimb/);
  assert.match(css, /@keyframes\s+makerSprinkle/);
  assert.match(css, /@keyframes\s+makerPolish/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media\s*\(max-width:\s*560px\)[\s\S]*\.mini-worker-mobile-hide/);
});
