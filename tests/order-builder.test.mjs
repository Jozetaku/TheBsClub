import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const menu = require('../menu-data.js');
const order = require('../order-builder.js');

test('formats a German Sharing Set with two drinks and no surcharge', () => {
  const lines = order.formatSetOrderLines(menu, {
    setId: 'sandwich-sharing',
    quantity: 1,
    drinks: [
      { flavour: 'Matcha Latte', sweetness: '50%', ice: 'Normal' },
      { flavour: 'Mango Tea', sweetness: '25%', ice: 'Wenig' },
    ],
  }, 'de');

  assert.match(lines.join('\n'), /Sharing Sandwich-Set/);
  assert.match(lines.join('\n'), /CHF 31\.90/);
  assert.match(lines.join('\n'), /Menge: 1/);
  assert.match(lines.join('\n'), /Matcha Latte/);
  assert.match(lines.join('\n'), /Mango Tea/);
  assert.doesNotMatch(lines.join('\n'), /Premium|Aufpreis|Surcharge|\+ CHF/i);
});

test('formats an English one-drink Food + Boba set', () => {
  const lines = order.formatSetOrderLines(menu, {
    setId: 'green-curry-tofu',
    quantity: 2,
    drinks: [{ flavour: 'Brown Sugar Milk Tea', sweetness: '100%', ice: 'Less' }],
  }, 'en');

  assert.match(lines.join('\n'), /Thai Green Curry Tofu \+ Any Boba Drink/);
  assert.match(lines.join('\n'), /Quantity: 2/);
  assert.match(lines.join('\n'), /Set price: CHF 23\.90/);
  assert.match(lines.join('\n'), /Drink 1: Brown Sugar Milk Tea · Sweetness: 100% · Ice: Less/);
});

test('rejects unknown sets, invalid quantities and an incorrect drink count', () => {
  assert.equal(order.validateSetSelection(menu, {
    setId: 'unknown', quantity: 1, drinks: [{ flavour: 'Mango Tea' }],
  }, 'en').valid, false);

  assert.equal(order.validateSetSelection(menu, {
    setId: 'sandwich-regular', quantity: 0, drinks: [{ flavour: 'Mango Tea' }],
  }, 'en').valid, false);

  const missingSecondDrink = order.validateSetSelection(menu, {
    setId: 'sandwich-sharing', quantity: 1, drinks: [{ flavour: 'Mango Tea' }],
  }, 'de');
  assert.equal(missingSecondDrink.valid, false);
  assert.ok(missingSecondDrink.errors.length > 0);
});

test('requires a flavour for every included drink and throws before formatting invalid data', () => {
  const selection = {
    setId: 'sandwich-double',
    quantity: 1,
    drinks: [{ flavour: '   ', sweetness: '50%', ice: 'Normal' }],
  };

  assert.equal(order.validateSetSelection(menu, selection, 'de').valid, false);
  assert.throws(() => order.formatSetOrderLines(menu, selection, 'de'), TypeError);
});
