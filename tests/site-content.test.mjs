import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

test('uses the confirmed website, hours, phone and launch date everywhere', () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/thebsclub\.ch\/">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/thebsclub\.ch\/">/);
  assert.match(html, /"url": "https:\/\/thebsclub\.ch\/"/);
  assert.doesNotMatch(html, /https:\/\/www\.thebsclub\.ch/);
  assert.doesNotMatch(html, /11:00[–-]21:00|"closes": "21:00"/);
  assert.match(html, /11:00[–-]19:00/);
  assert.match(html, /"closes": "19:00"/);
  assert.match(html, /From 15 August/);
  assert.match(html, /Available from 15 August 2026 · Speisekarte/);
  assert.match(html, /tel:\+41762262722/);
  assert.match(html, /\+41 76 226 27 22/);
});

test('keeps repository launch notes aligned with confirmed details', () => {
  assert.match(readme, /Asian Café/);
  assert.match(readme, /15 August 2026/);
  assert.match(readme, /Every day: `11:00[–-]19:00`/);
  assert.match(readme, /\+41 76 226 27 22/);
});

test('positions the site as an Asian Café in Interlaken without the awkward hero preposition', () => {
  assert.match(html, /<title>The B's Club \| Asian Café Interlaken<\/title>/);
  assert.match(html, /<h1>\s*<span class="hero-title-category">Asian Cafe<\/span>\s*<span class="hero-title-place">Interlaken<\/span>\s*<\/h1>/);
  assert.doesNotMatch(html, /<h1>[\s\S]*?<span>in Interlaken<\/span>[\s\S]*?<\/h1>/);
  assert.match(html, /Thai food\./);
  assert.match(html, /Bubble tea\./);
});

test('makes the main public car park a clear location advantage', () => {
  const parkingMessage = /Next to Interlaken(?:’|&rsquo;|'|&#8217;)s main public car park/;
  assert.ok((html.match(new RegExp(parkingMessage.source, 'g')) ?? []).length >= 2);
});

test('puts the Asian food menu first while retaining directions and ordering paths', () => {
  const heroActions = html.match(/<div class="hero-actions">([\s\S]*?)<\/div>/)?.[1] ?? '';
  const mobileActions = html.match(/<div class="mobile-actions"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '';
  assert.match(heroActions, /^\s*<a[^>]*href="#food"[^>]*>Explore food \+ drinks/);
  assert.match(heroActions, /data-cta="directions"/);
  assert.match(heroActions, /https:\/\/www\.ubereats\.com\/ch\/store\/bublee-interlaken\/Ik4zv95aWhWzt0lYSbjaMQ/);
  assert.match(mobileActions, /^\s*<a[^>]*data-cta="directions"[^>]*>Directions/);
  assert.match(mobileActions, /data-menu="bubble"/);
  assert.match(mobileActions, />Uber Eats/);
});

test('keeps every bestseller and category connected to the existing full-menu dialog', () => {
  for (const menu of ['bubble', 'matcha', 'coffee']) {
    assert.match(html, new RegExp(`data-dialog-menu="${menu}"`));
  }
  assert.match(html, /class="mobile-actions"[\s\S]*data-menu="bubble"/);
  assert.ok((html.match(/class="[^"]*menu-open[^"]*"[^>]*data-menu="bubble"/g) ?? []).length >= 5);
  assert.ok((html.match(/class="[^"]*menu-open[^"]*"[^>]*data-menu="matcha"/g) ?? []).length >= 2);
  assert.match(html, /class="[^"]*menu-open[^"]*"[^>]*data-menu="coffee"/);
});

test('marks every directions surface for delegated tracking', () => {
  assert.match(html, /<link rel="stylesheet" href="styles\.css\?v=20260815-15">/);
  assert.match(html, /<script src="script\.js\?v=20260815-1" defer><\/script>/);
  assert.match(html, /<script src="cursor\.js\?v=20260815-2" defer><\/script>/);
  assert.doesNotMatch(html, /(?:analytics|tracking|cta)\.js/);
  const trackedDirections = html.match(/data-cta="directions"/g) ?? [];
  assert.ok(trackedDirections.length >= 5, `expected at least 5 tracked directions links, found ${trackedDirections.length}`);
  for (const location of ['header', 'hero', 'visit', 'map_card', 'mobile']) {
    assert.match(html, new RegExp(`data-cta-location="${location}"`));
  }
});

test('offers analytics consent and persistent privacy settings', () => {
  assert.match(html, /id="analytics-consent"/);
  assert.match(html, /data-consent-choice="granted"[^>]*>Accept Analytics</);
  assert.match(html, /data-consent-choice="denied"[^>]*>Reject</);
  assert.match(html, /id="privacy-settings"[^>]*>Privacy settings</);
});

test('keeps the consent bar above mobile quick actions', () => {
  assert.match(css, /\.consent-banner\s*\{[\s\S]*position:\s*fixed/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*\.consent-banner\s*\{[\s\S]*bottom:\s*calc\(78px\s*\+\s*env\(safe-area-inset-bottom\)\)/);
});
