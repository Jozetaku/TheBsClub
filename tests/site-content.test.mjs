import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('uses the confirmed website, hours, and phone everywhere', () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/thebsclub\.ch\/">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/thebsclub\.ch\/">/);
  assert.match(html, /"url": "https:\/\/thebsclub\.ch\/"/);
  assert.doesNotMatch(html, /https:\/\/www\.thebsclub\.ch/);
  assert.doesNotMatch(html, /10:00/);
  assert.doesNotMatch(html, /7742027|774 20 27/);
  assert.match(html, /11:00–19:00/);
  assert.match(html, /tel:\+41762262722/);
  assert.match(html, /\+41 76 226 27 22/);
});

test('puts directions first and retains menu and Uber Eats paths', () => {
  const heroActions = html.match(/<div class="hero-actions">([\s\S]*?)<\/div>/)?.[1] ?? '';
  const mobileActions = html.match(/<div class="mobile-actions"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '';
  assert.match(heroActions, /^\s*<a[^>]*data-cta="directions"[^>]*>Get Directions/);
  assert.match(heroActions, />View Menu\b/);
  assert.match(heroActions, /https:\/\/www\.ubereats\.com\/ch\/store\/bublee-interlaken\/Ik4zv95aWhWzt0lYSbjaMQ/);
  assert.match(mobileActions, /^\s*<a[^>]*data-cta="directions"[^>]*>Directions/);
  assert.match(mobileActions, />Menu</);
  assert.match(mobileActions, />Uber Eats/);
});

test('marks every directions surface for delegated tracking', () => {
  const trackedDirections = html.match(/data-cta="directions"/g) ?? [];
  assert.ok(trackedDirections.length >= 5, `expected at least 5 tracked directions links, found ${trackedDirections.length}`);
  for (const location of ['header', 'hero', 'visit', 'map_card', 'mobile']) {
    assert.match(html, new RegExp(`data-cta-location="${location}"`));
  }
});
