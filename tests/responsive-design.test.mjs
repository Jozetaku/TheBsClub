import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

test('defines the approved Bold Asian Club palette', () => {
  assert.match(css, /--ink:\s*#173f34/);
  assert.match(css, /--sun:\s*#f5c84b/);
  assert.match(css, /--coral:\s*#ec6b58/);
  assert.match(css, /--cream:\s*#fff8e9/);
});

test('lays out food and drinks responsively', () => {
  assert.match(css, /\.asian-menu-grid\s*\{[^}]*display:\s*grid/);
  assert.match(css, /\.drink-category-grid\s*\{[^}]*display:\s*grid/);
  assert.match(css, /@media\s*\(max-width:\s*820px\)/);
  assert.match(css, /@media\s*\(max-width:\s*560px\)/);
});

test('keeps the official logo readable in header and footer', () => {
  assert.match(css, /\.official-logo\s*\{[^}]*overflow:\s*hidden/);
  assert.match(css, /\.footer-logo/);
});
