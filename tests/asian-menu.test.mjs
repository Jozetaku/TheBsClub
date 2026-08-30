import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync(new URL('../en/index.html', import.meta.url), 'utf8');
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

test('maps every approved meal photograph to its matching semantic card', () => {
  const expectedImages = [
    ['spicy-basil', 'v6/spicy-basil-white-ceramic.jpg', 'Spicy Basil chicken in a white ceramic bowl with jasmine rice in a separate white bowl'],
    ['green-curry', 'v5/green-curry-chicken.jpg', 'Green Curry chicken with vegetables and jasmine rice in white ceramic bowls'],
    ['red-curry', 'v6/red-curry-white-ceramic.jpg', 'Red Curry chicken in a white ceramic bowl with jasmine rice in a separate white bowl'],
    ['katsu-curry', 'v6/katsu-curry-white-ceramic.jpg', 'Crispy Chicken Katsu Curry with seven round chicken bites and jasmine rice in white ceramic bowls'],
  ];

  for (const [dish, assetPath, alt] of expectedImages) {
    assert.ok(existsSync(new URL(`../images/campaign/${assetPath}`, import.meta.url)));
    assert.match(
      html,
      new RegExp(`data-dish="${dish}"[\\s\\S]*?<figure class="dish-photo-stage">[\\s\\S]*?src="/images/campaign/${assetPath}"[\\s\\S]*?alt="${alt}"`),
    );
  }

  assert.equal((html.match(/class="dish-photo"/g) ?? []).length, 4);
  assert.doesNotMatch(html, /dish-illustration/);

  const foodSection = html.match(/<section class="section asian-menu"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.doesNotMatch(foodSection, /kraft|paper|cardboard|Boba drink|coffee/i);
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
