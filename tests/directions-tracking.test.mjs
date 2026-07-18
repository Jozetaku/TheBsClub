import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';

const analyticsUrl = new URL('../script.js', import.meta.url);

const loadTracking = ({ gtag, locations = ['hero'] } = {}) => {
  assert.ok(existsSync(analyticsUrl), 'script.js should exist');
  const listeners = new Map();
  const directionsLinks = locations.map((location) => ({
    dataset: location ? { ctaLocation: location } : {},
    addEventListener(type, handler) {
      if (type === 'click') this.click = handler;
    }
  }));
  const window = {
    dataLayer: [],
    addEventListener() {},
    matchMedia: () => ({ matches: true }),
    scrollY: 0
  };
  if (gtag) window.gtag = gtag;
  const document = {
    addEventListener(type, handler) {
      const handlers = listeners.get(type) || [];
      handlers.push(handler);
      listeners.set(type, handlers);
    },
    querySelector: () => null,
    querySelectorAll: (selector) => selector === '[data-cta="directions"]' ? directionsLinks : [],
    body: { classList: { toggle() {}, add() {}, remove() {} } }
  };
  vm.runInNewContext(readFileSync(analyticsUrl, 'utf8'), { window, document });
  return { clicks: directionsLinks.map((link) => link.click), window };
};

const normalize = (value) => JSON.parse(JSON.stringify(value));

test('pushes directions_click with the CTA location', () => {
  const { clicks, window } = loadTracking();
  clicks[0]();
  assert.deepEqual(normalize(window.dataLayer), [
    { event: 'directions_click', cta_location: 'hero' }
  ]);
});

test('uses unknown when a tracked link has no location', () => {
  const { clicks, window } = loadTracking({ locations: [null] });
  clicks[0]();
  assert.equal(window.dataLayer[0].cta_location, 'unknown');
});

test('attaches tracking to every directions link', () => {
  const { clicks, window } = loadTracking({ locations: ['header', 'mobile'] });
  assert.equal(clicks.length, 2);
  assert.ok(clicks.every((click) => typeof click === 'function'));
  clicks[1]();
  assert.equal(window.dataLayer[0].cta_location, 'mobile');
});

test('forwards exactly one directions event to gtag', () => {
  const calls = [];
  const { clicks } = loadTracking({ gtag: (...args) => calls.push(args), locations: ['mobile'] });
  clicks[0]();
  const directionsEvents = calls.filter(([command, event]) => command === 'event' && event === 'directions_click');
  assert.deepEqual(normalize(directionsEvents), [
    ['event', 'directions_click', { cta_location: 'mobile' }]
  ]);
});
