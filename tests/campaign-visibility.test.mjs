import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');

const loadCampaign = ({ now, end = '2026-08-31T21:59:59Z' }) => {
  const campaign = { hidden: true, dataset: { campaignEnd: end } };
  let currentNow = now;
  let nextTimerId = 1;
  const timers = [];
  const listeners = new Map();
  class FakeDate extends Date {
    static now() { return currentNow; }
  }
  const window = {
    addEventListener() {},
    setTimeout(callback, delay) {
      const timer = { id: nextTimerId++, callback, delay, active: true };
      timers.push(timer);
      return timer.id;
    },
    clearTimeout(id) {
      const timer = timers.find((candidate) => candidate.id === id);
      if (timer) timer.active = false;
    },
    matchMedia: () => ({ matches: true }),
    scrollY: 0
  };
  const document = {
    addEventListener(type, callback) {
      const typeListeners = listeners.get(type) ?? [];
      typeListeners.push(callback);
      listeners.set(type, typeListeners);
    },
    querySelector(selector) {
      return selector === '#summer-offer' ? campaign : null;
    },
    querySelectorAll() { return []; },
    body: { classList: { toggle() {}, add() {}, remove() {} } }
  };
  vm.runInNewContext(script, { window, document, Date: FakeDate });
  return {
    campaign,
    activeTimers: () => timers.filter((timer) => timer.active),
    dispatch(type) {
      for (const callback of listeners.get(type) ?? []) callback();
    },
    fire(timer) {
      timer.active = false;
      timer.callback();
    },
    setNow(value) { currentNow = value; }
  };
};

test('shows the campaign before its Interlaken end time', () => {
  const { campaign } = loadCampaign({ now: Date.parse('2026-08-31T21:59:58Z') });
  assert.equal(campaign.hidden, false);
});

test('keeps the campaign visible through the exact end instant', () => {
  const runtime = loadCampaign({ now: Date.parse('2026-08-31T21:59:59Z') });
  assert.equal(runtime.campaign.hidden, false);
  assert.equal(runtime.activeTimers()[0]?.delay, 1);
});

test('hides an open campaign as soon as its deadline has passed', () => {
  const end = Date.parse('2026-08-31T21:59:59Z');
  const runtime = loadCampaign({ now: end - 1_000 });
  const deadlineTimer = runtime.activeTimers()[0];

  assert.equal(deadlineTimer?.delay, 1_001);
  runtime.setNow(end + 1);
  runtime.fire(deadlineTimer);

  assert.equal(runtime.campaign.hidden, true);
  assert.equal(runtime.activeTimers().length, 0);
});

test('chunks waits that exceed the browser safe timeout limit', () => {
  const now = Date.parse('2026-07-18T12:00:00Z');
  const runtime = loadCampaign({ now });
  const firstTimer = runtime.activeTimers()[0];

  assert.equal(firstTimer?.delay, 2_147_483_647);
  runtime.setNow(now + firstTimer.delay);
  runtime.fire(firstTimer);

  assert.equal(runtime.campaign.hidden, false);
  assert.equal(runtime.activeTimers().length, 1);
  assert.ok(runtime.activeTimers()[0].delay <= 2_147_483_647);
});

test('visibility changes recheck expiry without leaving duplicate timers', () => {
  const end = Date.parse('2026-08-31T21:59:59Z');
  const runtime = loadCampaign({ now: end - 10_000 });

  assert.equal(runtime.activeTimers().length, 1);
  runtime.dispatch('visibilitychange');
  assert.equal(runtime.campaign.hidden, false);
  assert.equal(runtime.activeTimers().length, 1);

  runtime.setNow(end + 1);
  runtime.dispatch('visibilitychange');
  assert.equal(runtime.campaign.hidden, true);
  assert.equal(runtime.activeTimers().length, 0);
});

test('keeps the campaign hidden after its end time', () => {
  const { campaign } = loadCampaign({ now: Date.parse('2026-08-31T22:00:00Z') });
  assert.equal(campaign.hidden, true);
});

test('keeps the campaign hidden when its end date is malformed', () => {
  const { campaign } = loadCampaign({ now: Date.parse('2026-07-18T12:00:00Z'), end: 'not-a-date' });
  assert.equal(campaign.hidden, true);
});
