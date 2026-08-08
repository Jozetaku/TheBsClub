import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const logoUrl = new URL('../images/logo-official.png', import.meta.url);

test('uses the official logo in header and footer', () => {
  assert.ok(existsSync(logoUrl));
  assert.equal((html.match(/images\/logo-official\.png/g) ?? []).length, 2);
  assert.match(html, /class="official-logo"/);
});

test('publishes all four Asian food dishes as semantic cards', () => {
  for (const dish of ['Spicy Basil', 'Green Curry', 'Red Curry', 'Crispy Chicken Katsu Curry']) {
    assert.match(html, new RegExp(`<h3>${dish}<\\/h3>`));
  }
  assert.equal((html.match(/CHF 18\.50/g) ?? []).length, 3);
  assert.equal((html.match(/CHF 17\.50/g) ?? []).length, 3);
  assert.equal((html.match(/CHF 15\.50/g) ?? []).length, 1);
  assert.equal((html.match(/class="tofu-option"/g) ?? []).length, 3);
});

test('keeps dietary language factual until ingredients are verified', () => {
  assert.match(html, /Tofu option/);
  assert.doesNotMatch(html, /Vegetarian|Vegan|Vegetarisch|plant-based/i);
});

test('keeps food, drinks, story, reviews and visit directly addressable', () => {
  for (const id of ['food', 'drinks', 'our-story', 'reviews', 'visit']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /Bubble Tea/);
  assert.match(html, /Matcha/);
  assert.match(html, /Coffee/);
});
