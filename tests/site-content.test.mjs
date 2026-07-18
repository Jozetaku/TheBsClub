import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

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

test('keeps repository launch notes aligned with confirmed details', () => {
  assert.doesNotMatch(readme, /774 20 27/);
  assert.match(readme, /\+41 76 226 27 22/);
  assert.match(readme, /Every day: `11:00–19:00`/);
});

test('puts directions first and retains menu and Uber Eats paths', () => {
  const heroActions = html.match(/<div class="hero-actions">([\s\S]*?)<\/div>/)?.[1] ?? '';
  const mobileActions = html.match(/<div class="mobile-actions"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '';
  assert.match(heroActions, /^\s*<a[^>]*data-cta="directions"[^>]*>Get Directions/);
  assert.match(heroActions, />View Menu\b/);
  assert.match(heroActions, /https:\/\/www\.ubereats\.com\/ch\/store\/bublee-interlaken\/Ik4zv95aWhWzt0lYSbjaMQ/);
  assert.match(mobileActions, /^\s*<a[^>]*data-cta="directions"[^>]*>Directions/);
  assert.match(mobileActions, /<button class="menu-open" type="button" data-menu="bubble">Menu<\/button>/);
  assert.match(mobileActions, />Uber Eats/);
});

test('marks every directions surface for delegated tracking', () => {
  assert.match(html, /<script src="script\.js\?v=20260718-3" defer><\/script>/);
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

test('does not advertise unavailable brunch or breakfast products', () => {
  assert.doesNotMatch(html, /brunch|breakfast|avocado toast|all-day comfort food/i);
  assert.match(html, /<title>The B's Club — Coffee, Matcha &amp; Bubble Tea in Interlaken<\/title>/);
  assert.match(html, /"servesCuisine": \["Coffee", "Bubble Tea", "Matcha", "Waffles"\]/);
  assert.match(html, /Coffee, matcha, bubble tea and waffles\./);
  assert.match(html, /Drop in for coffee, a colourful afternoon pick-me-up or a sweet finish to your day\./);
});

test('features Yummy Strawberry with an optimized local image', () => {
  const imageUrl = new URL('../images/yummy-strawberry-campaign.webp', import.meta.url);
  assert.ok(existsSync(imageUrl), 'Yummy Strawberry campaign image should exist');
  assert.ok(statSync(imageUrl).size < 300_000, 'Yummy Strawberry image should stay below 300 KB');
  assert.match(html, /images\/yummy-strawberry-campaign\.webp/);
  assert.match(html, /<h3>Yummy Strawberry<\/h3>/);
  assert.match(html, /<strong>CHF 7\.90<\/strong>/);
});

test('publishes the approved BS12 walk-in offer', () => {
  const imageUrl = new URL('../images/summer-drinks-campaign.webp', import.meta.url);
  assert.ok(existsSync(imageUrl), 'campaign trio image should exist');
  assert.ok(statSync(imageUrl).size < 450_000, 'campaign trio image should stay below 450 KB');
  assert.match(html, /<noscript><style>#summer-offer\[hidden\] \{ display: block !important; \}<\/style><\/noscript>/);
  assert.match(html, /id="summer-offer"[^>]*hidden[^>]*data-campaign-end="2026-08-31T21:59:59Z"/);
  assert.match(html, /3 drinks\. 1 summer offer\./);
  assert.match(html, /Pick yours and save 12% in store\./);
  assert.match(html, /Show code <strong>BS12<\/strong> at checkout/);
  assert.match(html, /Brown Sugar Milk Tea[\s\S]*?<del>CHF 7\.90<\/del>[\s\S]*?<strong>CHF 6\.95<\/strong>/);
  assert.match(html, /Yummy Strawberry[\s\S]*?<del>CHF 7\.90<\/del>[\s\S]*?<strong>CHF 6\.95<\/strong>/);
  assert.match(html, /Matcha Latte[\s\S]*?<del>CHF 8\.90<\/del>[\s\S]*?<strong>CHF 7\.80<\/strong>/);
  assert.match(html, /data-cta="directions" data-cta-location="campaign"/);
  assert.match(html, /<script src="script\.js\?v=20260718-3" defer><\/script>/);
});
