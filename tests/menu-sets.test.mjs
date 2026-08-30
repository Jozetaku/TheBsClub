import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const menu = require('../menu-data.js');

test('publishes the approved sandwich set prices and quantities', () => {
  assert.deepEqual(
    menu.sandwichSets.map(({ id, price, sandwiches, drinks }) => ({ id, price, sandwiches, drinks })),
    [
      { id: 'sandwich-regular', price: 16.90, sandwiches: 1, drinks: 1 },
      { id: 'sandwich-double', price: 24.90, sandwiches: 2, drinks: 1 },
      { id: 'sandwich-sharing', price: 31.90, sandwiches: 2, drinks: 2 },
    ],
  );
});

test('publishes all seven Food + Boba combos at one all-inclusive price each', () => {
  assert.deepEqual(
    Object.fromEntries(menu.foodCombos.map(({ id, price }) => [id, price])),
    {
      'katsu-chicken': 23.90,
      'red-curry-chicken': 24.90,
      'green-curry-chicken': 24.90,
      'thai-basil-chicken': 24.90,
      'thai-basil-tofu': 21.90,
      'red-curry-tofu': 23.90,
      'green-curry-tofu': 23.90,
    },
  );
  assert.ok(menu.foodCombos.every((item) => item.drinks === 1));
  assert.ok(menu.foodCombos.every((item) => item.surcharge === 0));
  assert.equal(menu.getMenuItem('tofu-katsu'), null);
});

test('publishes exact bilingual set names and stable image paths', () => {
  assert.equal(menu.getMenuItem('sandwich-regular').name.de, 'Regular Sandwich-Set');
  assert.equal(menu.getMenuItem('sandwich-regular').name.en, 'Regular Sandwich Set');
  assert.equal(
    menu.getMenuItem('green-curry-tofu').name.de,
    'Thai Green Curry Tofu + Boba-Getränk nach Wahl',
  );
  assert.equal(
    menu.getMenuItem('green-curry-tofu').image,
    '/images/campaign/v5/food-boba-green-curry-tofu.jpg',
  );
  assert.equal(menu.getIncludedDrinkCount('sandwich-sharing'), 2);
  assert.equal(menu.getIncludedDrinkCount('missing-set'), 0);
});

test('ships every catalog image plus the corrected Green Curry card', () => {
  for (const item of [...menu.sandwichSets, ...menu.foodCombos]) {
    assert.ok(existsSync(new URL(`..${item.image}`, import.meta.url)), item.image);
  }
  assert.ok(existsSync(new URL('../images/campaign/v5/green-curry-chicken.jpg', import.meta.url)));
});

test('publishes every approved set on both language homepages', () => {
  const de = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const en = readFileSync(new URL('../en/index.html', import.meta.url), 'utf8');

  for (const html of [de, en]) {
    assert.match(html, /id="food-boba-combos"/);
    assert.match(html, /id="sandwich-sets"/);
    for (const item of [...menu.foodCombos, ...menu.sandwichSets]) {
      assert.match(html, new RegExp(`data-set-id="${item.id}"[\\s\\S]*?CHF ${item.price.toFixed(2)}`));
    }
    assert.doesNotMatch(html, /Premium Boba|Premium-Getränk|\+\s*CHF\s*1\.00/i);
    assert.doesNotMatch(html, /Tofu Katsu/i);
  }
});
