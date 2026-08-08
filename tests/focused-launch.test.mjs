import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

test('positions the homepage as an Asian Café in Interlaken', () => {
  assert.match(html, /<title>The B's Club \| Asian Café Interlaken<\/title>/);
  assert.match(html, /<h1>\s*<span class="hero-title-category">Asian Cafe<\/span>\s*<span class="hero-title-place">Interlaken<\/span>\s*<\/h1>/);
  assert.doesNotMatch(html, /<span>in Interlaken<\/span>/);
  assert.match(html, /<strong>Thai food\.<\/strong>\s*<em>Bubble tea\.<\/em> One colourful stop\./);
  assert.match(html, /Dine In · Thai Takeaway · Drinks Grab &amp; Go/);
});

test('publishes exactly the four approved café meals with Chicken first', () => {
  const dishes = [...html.matchAll(/data-dish="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(dishes, ['spicy-basil', 'green-curry', 'red-curry', 'katsu-curry']);

  for (const dish of ['spicy-basil', 'green-curry', 'red-curry']) {
    const card = html.match(new RegExp(`<article[^>]*data-dish="${dish}"[\\s\\S]*?<\\/article>`))?.[0] ?? '';
    assert.match(card, /data-primary="chicken"/);
    assert.ok(card.indexOf('Chicken') < card.indexOf('Tofu option'));
  }

  assert.equal((html.match(/Café Meal · Dine In or Takeaway/g) ?? []).length, 4);
});

test('uses the approved honest preparation statement and no forbidden food claims', () => {
  assert.match(html, /Our Thai recipes are prepared by Thai chefs\. All four meals are heated and served at The B’s Club\./);
  assert.doesNotMatch(html, /made fresh|prepared to order|freshly cooked to order|made fresh in-house/i);
  assert.doesNotMatch(html, /Vegetarian|Vegan|plant-based|Quick Bowl|Set Menu/i);
});

test('describes the four-meal section as three Thai dishes and one Japanese dish', () => {
  const foodSection = html.match(/<section class="section asian-menu"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(foodSection, /<h2>Asian café meals<br><em>in Interlaken\.<\/em><\/h2>/);
  assert.match(foodSection, /Three Thai favourites and Japanese Chicken Katsu Curry with jasmine rice/);
  assert.doesNotMatch(foodSection, /<h2>Thai food/);
  assert.match(html, /<strong>Thai food\.<\/strong>/);
  assert.match(html, /"servesCuisine": \["Asian", "Thai", "Japanese", "Bubble Tea", "Coffee"\]/);
});

test('presents the four confirmed drinks with equal bestseller importance', () => {
  const showcase = html.match(/<div[^>]*class="[^"]*bestseller-showcase[^"]*"[\s\S]*?<\/div>\s*<div class="drink-category-grid">/)?.[0] ?? '';
  const drinks = [...showcase.matchAll(/data-drink="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(drinks, [
    'Brown Sugar Milk Tea',
    'Yummy Strawberry',
    'Matcha Latte',
    'Mango Tea'
  ]);
  assert.equal((showcase.match(/class="bestseller-card/g) ?? []).length, 4);
  assert.doesNotMatch(showcase, /bestseller-lead/);
  assert.equal((showcase.match(/<span class="bestseller-rank">Bestseller<\/span>/g) ?? []).length, 4);
  assert.match(showcase, /class="bestseller-card"[^>]*data-drink="Brown Sugar Milk Tea"[\s\S]*data-menu="bubble"/);
  assert.match(showcase, /data-drink="Matcha Latte"[\s\S]*data-menu="matcha"/);
  assert.doesNotMatch(showcase, /Biscoff Milk Tea/);
  assert.doesNotMatch(html, /Start with Brown Sugar/);
});

test('uses editorial category numbers instead of mismatched drink emoji', () => {
  const categories = html.match(/<div class="drink-category-grid">[\s\S]*?<aside class="meal-completion"/)?.[0] ?? '';
  assert.equal((categories.match(/class="drink-category-index"/g) ?? []).length, 3);
  assert.match(categories, /class="drink-category-index" aria-hidden="true">01<\/span>[\s\S]*<h3>Bubble Tea<\/h3>/);
  assert.match(categories, /class="drink-category-index" aria-hidden="true">02<\/span>[\s\S]*<h3>Matcha<\/h3>/);
  assert.match(categories, /class="drink-category-index" aria-hidden="true">03<\/span>[\s\S]*<h3>Coffee<\/h3>/);
  assert.doesNotMatch(categories, /🧋|🍵|☕/u);
  assert.match(css, /\.drink-category-index\s*\{[^}]*display:\s*inline-flex[^}]*color:\s*var\(--coral\)/);
});

test('uses the approved elegant product theatre without branding the cups', () => {
  assert.doesNotMatch(html, /drink-cup-logo|brand-logo-overlay/);
  assert.equal((html.match(/images\/logo-official\.png/g) ?? []).length, 2);
  assert.match(css, /\.drinks\s*\{[^}]*background:\s*#f3ecdf[^}]*background-image:\s*none/);
  assert.match(css, /\.bestseller-showcase\s*\{[^}]*grid-template-columns:\s*repeat\(4,/);
  assert.match(css, /\.bestseller-product\s*\{[^}]*object-fit:\s*contain/);
});

test('pairs a tall iced coffee with the existing cappuccino in the story collage', () => {
  const story = html.match(/<section class="section story"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(story, /class="story-photo-one" src="images\/story-iced-coffee-tall-v2\.webp"[^>]*alt="Tall glass of iced coffee/);
  assert.match(story, /class="story-photo-two" src="images\/signature-latte\.jpg"[^>]*alt="Cappuccino/);
  assert.doesNotMatch(story, /yummy-strawberry-campaign/);
});

test('keeps water and cola as secondary meal-completion items', () => {
  const completion = html.match(/<aside[^>]*class="meal-completion"[\s\S]*?<\/aside>/)?.[0] ?? '';
  assert.match(completion, /Complete your meal/);
  assert.match(completion, /Water/);
  assert.match(completion, /Cola/);
  assert.doesNotMatch(completion, /<h2|<h1/);
});

test('keeps the confirmed daily hours visible', () => {
  assert.match(html, /Daily 11:00–19:00/);
  assert.match(html, /"closes": "19:00"/);
});
