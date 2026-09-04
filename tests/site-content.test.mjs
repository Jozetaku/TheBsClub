import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const de = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const en = readFileSync(new URL('../en/index.html', import.meta.url), 'utf8');
const html = en;
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const pagesWorkflow = readFileSync(new URL('../.github/workflows/deploy-pages.yml', import.meta.url), 'utf8');

test('uses the confirmed website, hours, phone and launch date everywhere', () => {
  assert.match(de, /<link rel="canonical" href="https:\/\/www\.thebsclub\.ch\/">/);
  assert.match(en, /<link rel="canonical" href="https:\/\/www\.thebsclub\.ch\/en\/">/);
  for (const page of [de, en]) {
    assert.match(page, /"url": "https:\/\/www\.thebsclub\.ch\/"/);
    assert.doesNotMatch(page, /https:\/\/thebsclub\.ch/);
    assert.doesNotMatch(page, /11:00[–-](?:19:00|21:00)|"closes": "(?:19:00|21:00)"/);
    assert.match(page, /11:00[–-]20:00/);
    assert.match(page, /"closes": "20:00"/);
    assert.match(page, /tel:\+41767742027/);
    assert.match(page, /\+41 76 774 20 27/);
  }
  assert.match(en, /From 15 August/);
  assert.match(en, /Available from 15 August 2026 · Speisekarte/);
});

test('keeps repository launch notes aligned with confirmed details', () => {
  assert.match(readme, /Asian Café/);
  assert.match(readme, /15 August 2026/);
  assert.match(readme, /Every day: `11:00[–-]20:00`/);
  assert.match(readme, /\+41 76 774 20 27/);
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

test('links the English autumn guide from navigation and the footer', () => {
  const primaryNav = html.match(/<nav class="primary-nav"[\s\S]*?<\/nav>/)?.[0] ?? '';
  const footer = html.match(/<footer class="footer">[\s\S]*?<\/footer>/)?.[0] ?? '';

  assert.match(primaryNav, /<a href="\/en\/articles\/autumn-interlaken\/">Autumn guide<\/a>/);
  assert.match(footer, /<a href="\/en\/articles\/autumn-interlaken\/">Plan an autumn day in Interlaken<\/a>/);
});

test('documents autumn guide pack, transport, and date maintenance', () => {
  assert.match(readme, /availability and content only in `articles\/autumn-interlaken\/travel-packs\.mjs`/i);
  assert.match(readme, /`active`, `limited`, and `unavailable`/);
  assert.match(readme, /fallback/i);
  assert.match(readme, /verify menu names with staff/i);
  assert.match(readme, /Harder Kulm and BLS dates annually in late July\/early August/i);
  assert.match(readme, /publication day/i);
  assert.match(readme, /Harder.*live operations/i);
  assert.match(readme, /BLS.*current operating status/i);
  assert.match(readme, /BLS.*annual timetable/i);
  assert.match(readme, /`dateModified`, reader-facing checked date, and tests together/i);
  assert.match(readme, /\/en\/articles\/autumn-interlaken/);
  assert.match(readme, /\/de\/artikel\/herbst-interlaken/);
});

test('records the healthy first-party place-source maintenance policy', () => {
  assert.match(readme, /27 August 2026/);
  assert.doesNotMatch(readme, /retained as the official source/i);
  assert.match(readme, /reader-facing destination links/i);
  assert.match(readme, /healthy first-party/i);
});

test('publishes localized autumn guides, article assets, and sitemap in the Pages artifact', () => {
  assert.match(pagesWorkflow, /cp\s+-R\s+en\s+de\s+articles\s+_site\//);
  assert.match(pagesWorkflow, /cp\s+sitemap\.xml\s+robots\.txt\s+_site\//);
});

test('runs the complete Node test suite before preparing or uploading the Pages artifact', () => {
  const testStep = pagesWorkflow.indexOf('node --test tests/*.test.mjs');
  const prepareStep = pagesWorkflow.indexOf('name: Prepare site');
  const uploadStep = pagesWorkflow.indexOf('actions/upload-pages-artifact@v4');

  assert.ok(testStep >= 0, 'Pages workflow must run the Node suite');
  assert.ok(testStep < prepareStep, 'tests must finish before the site artifact is prepared');
  assert.ok(testStep < uploadStep, 'tests must finish before the Pages artifact is uploaded');
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
  assert.match(html, /<link rel="stylesheet" href="\/styles\.css\?v=20260830-1">/);
  assert.match(html, /<script src="\/script\.js\?v=20260904-1" defer><\/script>/);
  assert.match(html, /<script src="\/cursor\.js\?v=20260815-2" defer><\/script>/);
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
