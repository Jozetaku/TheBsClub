import test from 'node:test';
import assert from 'node:assert/strict';
import { travelPacks } from '../articles/autumn-interlaken/travel-packs.mjs';
import { getPackViewModels, normalizePack } from '../articles/autumn-interlaken/article.mjs';

const allowedProducts = new Set([
  'Brown Sugar Milk Tea', 'Yummy Strawberry', 'Iced Matcha Latte', 'Mango Tea',
  'Spicy Basil Chicken', 'Spicy Basil Tofu', 'Green Curry Chicken',
  'Green Curry Tofu', 'Red Curry Chicken', 'Red Curry Tofu',
  'Crispy Chicken Katsu Curry'
]);

test('defines exactly one record for every approved trip type', () => {
  assert.deepEqual(travelPacks.map(({ tripType }) => tripType).sort(), ['city', 'travel', 'viewpoint']);
});

test('keeps every named product inside the approved current-menu allow-list', () => {
  for (const pack of travelPacks) {
    for (const item of pack.productItems) assert.ok(allowedProducts.has(item.name), item.name);
  }
});

test('provides EN and DE copy, a valid date, status, image and packaging type', () => {
  for (const pack of travelPacks) {
    assert.match(pack.updatedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(Number.isNaN(Date.parse(`${pack.updatedAt}T00:00:00Z`)), false);
    assert.ok(['active', 'limited', 'unavailable'].includes(pack.status));
    assert.ok(['sealed-cold-cup', 'customer-flask', 'takeaway-bowl'].includes(pack.packagingType));
    assert.match(pack.image, /^\/articles\/autumn-interlaken\/pack-(city|viewpoint|travel)\.svg$/);
    assert.ok(pack.carryNote.en);
    assert.ok(pack.carryNote.de);
    for (const locale of ['en', 'de']) {
      assert.ok(pack.locales[locale].title);
      assert.ok(pack.locales[locale].description);
    }
  }
});

test('falls back safely for missing, invalid, limited and unavailable data', () => {
  const models = getPackViewModels([], 'en');
  assert.equal(models.length, 3);
  assert.ok(models.every((model) => model.productItems.length === 0 && model.menuUrl));
  assert.equal(normalizePack({ tripType: 'city', status: 'broken' }, 'en'), null);

  const limited = normalizePack({ ...travelPacks[0], status: 'limited' }, 'en');
  assert.match(limited.notice, /Ask for today's travel-friendly option/);

  const unavailable = normalizePack({ ...travelPacks[0], status: 'unavailable' }, 'en');
  assert.deepEqual(unavailable.productItems, []);
});

test('rejects unapproved product data, dietary claims, hostile menu URLs and impossible dates', () => {
  const base = travelPacks[0];
  assert.equal(normalizePack({
    ...base,
    productItems: [{ ...base.productItems[0], name: 'Unapproved Product' }]
  }, 'en'), null);
  assert.equal(normalizePack({ ...base, dietaryTags: ['vegan'] }, 'en'), null);
  assert.equal(normalizePack({ ...base, menuUrl: 'https://example.test/menu' }, 'en'), null);
  assert.equal(normalizePack({ ...base, updatedAt: '2026-02-31' }, 'en'), null);
});

test('uses sealed-for-easy-carrying English copy with a localized German equivalent', () => {
  for (const pack of travelPacks) {
    assert.match(pack.carryNote.en, /sealed for easy carrying/);
    assert.match(pack.carryNote.de, /versiegelt/);
  }
});
