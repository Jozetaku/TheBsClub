import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const de = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const en = readFileSync(new URL('../en/index.html', import.meta.url), 'utf8');

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
