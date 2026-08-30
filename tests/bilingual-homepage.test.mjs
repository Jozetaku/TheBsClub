import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const de = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const en = readFileSync(new URL('../en/index.html', import.meta.url), 'utf8');
const sitemap = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
const articleEn = readFileSync(new URL('../en/articles/autumn-interlaken/index.html', import.meta.url), 'utf8');
const articleDe = readFileSync(new URL('../de/artikel/herbst-interlaken/index.html', import.meta.url), 'utf8');
const robotsUrl = new URL('../robots.txt', import.meta.url);
const robots = existsSync(robotsUrl) ? readFileSync(robotsUrl, 'utf8') : '';

test('serves complete canonical German and English homepages', () => {
  assert.match(de, /<html lang="de-CH">/);
  assert.match(de, /<body[^>]*data-page-language="de"/);
  assert.match(de, /<link rel="canonical" href="https:\/\/www\.thebsclub\.ch\/">/);
  assert.match(en, /<html lang="en">/);
  assert.match(en, /<body[^>]*data-page-language="en"/);
  assert.match(en, /<link rel="canonical" href="https:\/\/www\.thebsclub\.ch\/en\/">/);
});

test('declares reciprocal language alternatives', () => {
  for (const html of [de, en]) {
    assert.match(html, /hreflang="de-CH" href="https:\/\/www\.thebsclub\.ch\/"/);
    assert.match(html, /hreflang="en" href="https:\/\/www\.thebsclub\.ch\/en\/"/);
    assert.match(html, /hreflang="x-default" href="https:\/\/www\.thebsclub\.ch\/"/);
  }
});

test('provides a visible page-level language switch', () => {
  assert.match(de, /class="language-switch"[\s\S]*href="\/"[^>]*aria-current="page"[\s\S]*href="\/en\/"/);
  assert.match(en, /class="language-switch"[\s\S]*href="\/"[\s\S]*href="\/en\/"[^>]*aria-current="page"/);
});

test('keeps complete core content on both language routes', () => {
  for (const html of [de, en]) {
    for (const id of ['food', 'drinks', 'music', 'order', 'our-story', 'reviews', 'visit']) {
      assert.match(html, new RegExp(`id="${id}"`), `missing #${id}`);
    }
    assert.match(html, /id="order-form"/);
    assert.match(html, /id="analytics-consent"/);
    assert.match(html, /id="menu-dialog"/);
  }
});

test('localises structured data and sitemap alternates', () => {
  assert.match(de, /"inLanguage": "de-CH"/);
  assert.match(en, /"inLanguage": "en"/);
  assert.match(sitemap, /<loc>https:\/\/www\.thebsclub\.ch\/en\/<\/loc>/);
  assert.match(sitemap, /hreflang="de-CH" href="https:\/\/www\.thebsclub\.ch\/"/);
  assert.match(sitemap, /hreflang="en" href="https:\/\/www\.thebsclub\.ch\/en\/"/);
});

test('uses final trailing-slash article URLs across canonical and hreflang signals', () => {
  assert.match(articleEn, /rel="canonical" href="https:\/\/www\.thebsclub\.ch\/en\/articles\/autumn-interlaken\/"/);
  assert.match(articleDe, /rel="canonical" href="https:\/\/www\.thebsclub\.ch\/de\/artikel\/herbst-interlaken\/"/);
  for (const html of [articleEn, articleDe]) {
    assert.match(html, /hreflang="en" href="https:\/\/www\.thebsclub\.ch\/en\/articles\/autumn-interlaken\/"/);
    assert.match(html, /hreflang="de-CH" href="https:\/\/www\.thebsclub\.ch\/de\/artikel\/herbst-interlaken\/"/);
    assert.match(html, /hreflang="x-default" href="https:\/\/www\.thebsclub\.ch\/en\/articles\/autumn-interlaken\/"/);
  }
  assert.match(sitemap, /<loc>https:\/\/www\.thebsclub\.ch\/en\/articles\/autumn-interlaken\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/www\.thebsclub\.ch\/de\/artikel\/herbst-interlaken\/<\/loc>/);
});

test('links each homepage to its matching localized autumn guide', () => {
  assert.equal((de.match(/href="\/de\/artikel\/herbst-interlaken\/"/g) ?? []).length, 2);
  assert.equal((en.match(/href="\/en\/articles\/autumn-interlaken\/"/g) ?? []).length, 2);
  assert.doesNotMatch(de, /href="\/en\/articles\/autumn-interlaken/);
  assert.doesNotMatch(en, /href="\/de\/artikel\/herbst-interlaken/);
});

test('publishes a crawlable robots file that advertises the sitemap', () => {
  assert.equal(existsSync(robotsUrl), true);
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Sitemap: https:\/\/www\.thebsclub\.ch\/sitemap\.xml$/m);
});
