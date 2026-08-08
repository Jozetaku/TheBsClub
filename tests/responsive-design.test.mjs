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
  assert.match(css, /\.dish-photo-stage\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*3[^}]*overflow:\s*hidden/);
  assert.match(css, /\.dish-photo\s*\{[^}]*width:\s*100%[^}]*height:\s*100%[^}]*object-fit:\s*cover/);
  assert.match(css, /\.drink-category-grid\s*\{[^}]*display:\s*grid/);
  assert.match(css, /@media\s*\(max-width:\s*820px\)/);
  assert.match(css, /@media\s*\(max-width:\s*560px\)/);
});

test('keeps the official logo readable in header and footer', () => {
  assert.match(css, /\.official-logo\s*\{[^}]*overflow:\s*hidden/);
  assert.match(css, /\.footer-logo/);
});

test('gives the focused launch content a responsive visual hierarchy', () => {
  assert.match(css, /\.hero-service-line\s*\{/);
  assert.match(css, /\.hero \.hero-actions\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*max-content max-content/);
  assert.match(css, /\.hero \.hero-actions\s*>\s*\.button\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/);
  assert.match(css, /\.preparation-note\s*\{[^}]*display:\s*flex/);
  assert.match(css, /\.bestseller-showcase\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(4,/);
  assert.doesNotMatch(css, /\.bestseller-lead\s*\{/);
  assert.match(css, /\.meal-completion\s*\{[^}]*display:\s*flex/);
  assert.match(css, /\.drinks \.section-heading h2 em\s*\{[^}]*color:\s*var\(--coral\)/);
  assert.match(css, /@media\s*\(max-width:\s*1080px\)[\s\S]*\.bestseller-showcase\s*\{[^}]*repeat\(2,/);
  assert.match(css, /@media\s*\(max-width:\s*820px\)[\s\S]*\.bestseller-showcase/);
  assert.match(css, /@media\s*\(max-width:\s*560px\)[\s\S]*\.hero \.hero-actions\s*\{[^}]*grid-template-columns:\s*1fr/);
  assert.match(css, /@media\s*\(max-width:\s*560px\)[\s\S]*\.bestseller-showcase/);
});

test('keeps the Hero lockup slash-free', () => {
  assert.doesNotMatch(css, /\.hero-copy h1 \.hero-title-place::before\s*\{/);
  assert.doesNotMatch(css, /content:\s*["']\/["']/);
});

test('normalizes every bestseller cup to one optical stage', () => {
  const expectedOpticalAdjustments = [
    ['Brown Sugar Milk Tea', '1.01', '-2px'],
    ['Yummy Strawberry', '1.01', '21px'],
    ['Matcha Latte', '1.055', '-1px'],
    ['Mango Tea', '1', '-4px'],
  ];

  for (const [drink, scale, y] of expectedOpticalAdjustments) {
    assert.match(
      css,
      new RegExp(`\\.bestseller-card\\[data-drink="${drink}"\\]\\s*\\{[^}]*--cup-scale:\\s*${scale};[^}]*--cup-y:\\s*${y}`),
    );
  }

  assert.match(
    css,
    /\.bestseller-product\s*\{[^}]*transform:\s*translateY\(var\(--cup-y,\s*0px\)\)\s*scale\(var\(--cup-scale,\s*1\)\)/,
  );
  assert.doesNotMatch(css, /\.bestseller-card:hover \.bestseller-product/);
});

test('gives the Matcha Latte stage the shared warm spotlight and grounded shadow', () => {
  assert.match(css, /\.bestseller-card\[data-drink="Matcha Latte"\]\s+\.bestseller-visual::before\s*\{[^}]*radial-gradient/);
  assert.match(css, /\.bestseller-card\[data-drink="Matcha Latte"\]\s+\.bestseller-visual::after\s*\{[^}]*filter:\s*blur/);
  assert.match(css, /\.bestseller-card\[data-drink="Matcha Latte"\]\s+\.bestseller-product\s*\{[^}]*filter:/);
});

test('lifts the overlapping Cappuccino frame 25px above the story collage base', () => {
  assert.match(css, /\.story-photo-two\s*\{[^}]*bottom:\s*25px/);
});

test('keeps Thai London Therapy legible against the sand partner background', () => {
  assert.match(css, /\.partner-inner h2 em\s*\{[^}]*color:\s*var\(--ink-deep\)/);
});
