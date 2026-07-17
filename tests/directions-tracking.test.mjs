import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';

const analyticsUrl = new URL('../analytics.js', import.meta.url);

const loadTracking = ({ gtag } = {}) => {
  assert.ok(existsSync(analyticsUrl), 'analytics.js should exist');
  const listeners = new Map();
  const window = { dataLayer: [] };
  if (gtag) window.gtag = gtag;
  const document = {
    addEventListener(type, handler) {
      listeners.set(type, handler);
    }
  };
  vm.runInNewContext(readFileSync(analyticsUrl, 'utf8'), { window, document });
  return { click: listeners.get('click'), window };
};

const clickTarget = (link) => ({ closest: () => link });
const normalize = (value) => JSON.parse(JSON.stringify(value));

test('pushes directions_click with the CTA location', () => {
  const { click, window } = loadTracking();
  click({ target: clickTarget({ dataset: { ctaLocation: 'hero' } }) });
  assert.deepEqual(normalize(window.dataLayer), [
    { event: 'directions_click', cta_location: 'hero' }
  ]);
});

test('uses unknown when a tracked link has no location', () => {
  const { click, window } = loadTracking();
  click({ target: clickTarget({ dataset: {} }) });
  assert.equal(window.dataLayer[0].cta_location, 'unknown');
});

test('ignores clicks outside directions links', () => {
  const { click, window } = loadTracking();
  click({ target: clickTarget(null) });
  assert.deepEqual(window.dataLayer, []);
});

test('forwards the event to gtag when available', () => {
  const calls = [];
  const { click } = loadTracking({ gtag: (...args) => calls.push(args) });
  click({ target: clickTarget({ dataset: { ctaLocation: 'mobile' } }) });
  assert.deepEqual(normalize(calls), [
    ['event', 'directions_click', { cta_location: 'mobile' }]
  ]);
});

