import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');

const loadCampaign = ({ now, end = '2026-08-31T21:59:59Z' }) => {
  const campaign = { hidden: true, dataset: { campaignEnd: end } };
  class FakeDate extends Date {
    static now() { return now; }
  }
  const window = {
    addEventListener() {},
    matchMedia: () => ({ matches: true }),
    scrollY: 0
  };
  const document = {
    addEventListener() {},
    querySelector(selector) {
      return selector === '#summer-offer' ? campaign : null;
    },
    querySelectorAll() { return []; },
    body: { classList: { toggle() {}, add() {}, remove() {} } }
  };
  vm.runInNewContext(script, { window, document, Date: FakeDate });
  return campaign;
};

test('shows the campaign before its Interlaken end time', () => {
  const campaign = loadCampaign({ now: Date.parse('2026-08-31T21:59:58Z') });
  assert.equal(campaign.hidden, false);
});

test('keeps the campaign hidden after its end time', () => {
  const campaign = loadCampaign({ now: Date.parse('2026-08-31T22:00:00Z') });
  assert.equal(campaign.hidden, true);
});

test('keeps the campaign hidden when its end date is malformed', () => {
  const campaign = loadCampaign({ now: Date.parse('2026-07-18T12:00:00Z'), end: 'not-a-date' });
  assert.equal(campaign.hidden, true);
});
