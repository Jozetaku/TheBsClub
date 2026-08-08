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

test('maps every approved meal photograph to its matching semantic card', () => {
  const expectedImages = [
    ['spicy-basil', 'spicy-basil.png', 'Spicy Basil chicken with jasmine rice in a kraft takeaway bowl'],
    ['green-curry', 'green-curry.png', 'Green Curry chicken with vegetables and jasmine rice in a kraft takeaway bowl'],
    ['red-curry', 'red-curry.png', 'Red Curry chicken with jasmine rice in a kraft takeaway bowl'],
    ['katsu-curry', 'katsu-curry.png', 'Crispy Chicken Katsu Curry with jasmine rice in a kraft takeaway bowl'],
  ];

  for (const [dish, filename, alt] of expectedImages) {
    assert.ok(existsSync(new URL(`../images/campaign/v3/${filename}`, import.meta.url)));
    assert.match(
      html,
      new RegExp(`data-dish="${dish}"[\\s\\S]*?<figure class="dish-photo-stage">[\\s\\S]*?src="images/campaign/v3/${filename}"[\\s\\S]*?alt="${alt}"`),
    );
  }

  assert.equal((html.match(/class="dish-photo"/g) ?? []).length, 4);
  assert.doesNotMatch(html, /dish-illustration/);
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
