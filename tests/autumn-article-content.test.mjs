import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const readArticle = (locale) => readFileSync(
  new URL(`../${locale}/articles/autumn-interlaken/index.html`, import.meta.url),
  'utf8'
);

const occurrences = (source, pattern) => source.match(pattern)?.length ?? 0;

test('English autumn guide is a complete semantic article', () => {
  const en = readArticle('en');

  assert.match(en, /<body\s+data-article-id="autumn-interlaken">/);
  assert.equal(occurrences(en, /<h1\b/g), 1);
  assert.match(en, /<h1>Interlaken in Autumn: A Golden Day Between Two Lakes<\/h1>/);

  for (const id of [
    'place-hohematte',
    'place-japanese-garden',
    'place-aare',
    'place-unterseen',
    'place-harder-kulm',
    'place-lake-brienz'
  ]) {
    assert.match(en, new RegExp(`id="${id}"`));
  }

  for (const route of ['Easy Town Walk', 'Two-Lakes Viewpoint', 'Lake Brienz Day']) {
    assert.match(en, new RegExp(`>${route}<`));
  }

  const heroActions = en.match(/<div class="hero-actions">([\s\S]*?)<\/div>/)?.[1] ?? '';
  assert.ok(heroActions.indexOf('data-cta="directions"') >= 0);
  assert.ok(heroActions.indexOf('data-cta="directions"') < heroActions.indexOf('href="#travel-packs"'));

  const faq = en.match(/<section[^>]*id="faq"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.equal(occurrences(faq, /<h3\b/g), 6);
  assert.equal(occurrences(en, /\bfall\b/gi), 1);
});

test('English guide remains useful without JavaScript', () => {
  const en = readArticle('en');
  const withoutNoscript = en.replace(/<noscript\b[\s\S]*?<\/noscript>/gi, '');
  const packs = withoutNoscript.match(/<section[^>]*id="travel-packs"[\s\S]*?<\/section>/)?.[0] ?? '';

  assert.equal(occurrences(packs, /data-pack-card/g), 3);
  assert.match(packs, /City stroll pack/);
  assert.match(packs, /Viewpoint pack/);
  assert.match(packs, /Travel pack/);
  assert.match(packs, /href="\/#favourites"[^>]*>[^<]*(?:current menu|Current menu)/);
  assert.match(en, /href="\/#favourites"/);
});

test('English guide preserves the approved factual boundaries', () => {
  const en = readArticle('en');

  assert.match(en, /active paraglider landing area/i);
  assert.match(en, /wet leaves/i);
  assert.match(en, /3 April–29 November 2026/);
  assert.match(en, /3 April–6 December 2026/);
  assert.equal(occurrences(en, /after 11 October/gi), 1);
  assert.match(en, /sealed for easy carrying/i);
  assert.match(en, /bring a suitable reusable flask/i);
  assert.match(en, /consume promptly|keep appropriately chilled/i);
  assert.doesNotMatch(en, /leak[- ]?proof|guaranteed foliage|all-day hiking food/i);

  for (const duration of [
    '15–30 minutes',
    '15–25 minutes',
    '20–30-minute',
    '20–40 minutes',
    '1–2 hours',
    '2–3 hours'
  ]) {
    assert.match(en, new RegExp(duration));
  }
});

test('English guide follows the required editorial and shared-shell order', () => {
  const en = readArticle('en');
  const orderedMarkers = [
    '<header class="site-header"',
    'Home / Autumn Guide',
    'Autumn Field Guide',
    'Before You Go',
    'class="article-map"',
    'id="place-hohematte"',
    'id="place-japanese-garden"',
    'id="place-aare"',
    'id="place-unterseen"',
    'id="place-harder-kulm"',
    'id="place-lake-brienz"',
    'Choose Your Pace',
    '2026 seasonal transport',
    'id="travel-packs"',
    'id="faq"',
    'id="directions"',
    'Sources and last checked',
    '<footer class="footer"',
    'id="analytics-consent"',
    '<script src="/script.js" defer></script>',
    '<script type="module" src="/articles/autumn-interlaken/article.mjs"></script>'
  ];

  let cursor = -1;
  for (const marker of orderedMarkers) {
    const next = en.indexOf(marker);
    assert.ok(next > cursor, `expected ${marker} after the previous required section`);
    cursor = next;
  }

  assert.match(en, /Jungfraustrasse 46, 3800 Interlaken/);
  assert.match(en, /11:00–19:00/);
  assert.match(en, /tel:\+41762262722/);
  assert.match(en, /\+41 76 226 27 22/);
  assert.match(en, /href="\/de\/artikel\/herbst-interlaken\/"[^>]*>DE<\/a>/);
});

test.skip('German autumn guide mirrors the approved bilingual content contract', () => {
  const de = readArticle('de');
  assert.equal(occurrences(de, /<h1\b/g), 1);
  assert.equal(occurrences(de, /data-pack-card/g), 3);
});
