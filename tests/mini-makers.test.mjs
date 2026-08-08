import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

test('keeps every final V2 campaign asset inside the website worktree', () => {
  for (const asset of [
    'images/campaign/v2/spicy-basil-grab-go.png',
    'images/campaign/v2/brown-sugar-milk-tea.png',
    'images/campaign/v2/yummy-strawberry.png',
    'images/campaign/v2/matcha-latte.png',
    'images/campaign/v2/mango-tea.png'
  ]) {
    assert.ok(existsSync(new URL(`../${asset}`, import.meta.url)), `missing ${asset}`);
  }
});

test('shows the final food image without people or ladders in the hero', () => {
  assert.match(html, /class="mini-makers"[^>]*data-hero-asset="spicy-basil-grab-go-v2"[^>]*role="img"[^>]*aria-label="Spicy basil chicken and jasmine rice in an open kraft paper takeaway bowl with a white interior and clear lid behind it\."/);
  assert.match(html, /class="hero-product-image"/);
  assert.doesNotMatch(html, /class="hero-makers-layer"/);
  assert.doesNotMatch(html, /class="mini-makers-crew-image"/);
  assert.doesNotMatch(html, /class="maker-ladder"/);
  assert.doesNotMatch(html, /class="mini-worker/);
});

test('keeps the swappable food art as the only hero image layer', () => {
  assert.match(html, /class="mini-makers"[^>]*data-hero-asset="spicy-basil-grab-go-v2"/);
  assert.match(html, /class="hero-product-layer"[\s\S]*class="hero-product-image"[^>]*src="images\/campaign\/v2\/spicy-basil-grab-go\.png"[^>]*alt=""[\s\S]*<\/div>/);
  assert.match(css, /\.hero-product-layer\s*\{[^}]*z-index:\s*2/);
  assert.match(css, /\.hero-product-image\s*\{[^}]*object-fit:\s*cover/);
});

test('uses subtle motion with safe fallbacks', () => {
  assert.match(css, /@keyframes\s+makerClimb/);
  assert.match(css, /@keyframes\s+makerSprinkle/);
  assert.match(css, /@keyframes\s+makerPolish/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media\s*\(max-width:\s*560px\)[\s\S]*\.mini-worker-mobile-hide/);
});
