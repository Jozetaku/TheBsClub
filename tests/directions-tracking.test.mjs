import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';

const analyticsUrl = new URL('../script.js', import.meta.url);

const loadTracking = ({
  articleId,
  dataLayer = [],
  gtag,
  language = 'en',
  locations = ['hero'],
  width = 1280
} = {}) => {
  assert.ok(existsSync(analyticsUrl), 'script.js should exist');
  const listeners = new Map();
  const directionsLinks = locations.map((location) => ({
    dataset: location ? { ctaLocation: location } : {},
    addEventListener(type, handler) {
      if (type === 'click') this.click = handler;
    }
  }));
  const window = {
    dataLayer,
    innerWidth: width,
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
    body: {
      classList: { toggle() {}, add() {}, remove() {} },
      dataset: articleId ? { articleId } : {}
    },
    documentElement: { lang: language }
  };
  vm.runInNewContext(readFileSync(analyticsUrl, 'utf8'), { window, document });
  return { clicks: directionsLinks.map((link) => link.click), window };
};

const normalize = (value) => JSON.parse(JSON.stringify(value));

const directionsEvents = (dataLayer) => dataLayer
  .map((message) => {
    if (message?.event === 'directions_click') return message;
    const [command, event, payload] = Array.from(message);
    return command === 'event' && event === 'directions_click'
      ? { event, ...payload }
      : null;
  })
  .filter(Boolean);

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

test('queues exactly one directions event through the shared gtag data layer', () => {
  const dataLayer = [];
  const bootstrapGtag = function gtag() {
    dataLayer.push(arguments);
  };
  const { clicks } = loadTracking({ dataLayer, gtag: bootstrapGtag, locations: ['mobile'] });
  clicks[0]();
  assert.deepEqual(normalize(directionsEvents(dataLayer)), [
    { event: 'directions_click', cta_location: 'mobile' }
  ]);
});

test('sends the Google Ads directions conversion once', () => {
  const calls = [];
  const { clicks } = loadTracking({
    gtag: (...args) => calls.push(args),
    locations: ['hero']
  });
  clicks[0]();
  const conversions = calls.filter(([command, event]) => command === 'event' && event === 'conversion');
  assert.deepEqual(normalize(conversions), [
    ['event', 'conversion', { send_to: 'AW-18339850662/hxWiCLTTpO4cEKbTj6lE' }]
  ]);
});

test('pushes one directions event with article context on article pages', () => {
  const dataLayer = [];
  const bootstrapGtag = function gtag() {
    dataLayer.push(arguments);
  };
  const { clicks } = loadTracking({
    articleId: 'autumn-interlaken',
    dataLayer,
    gtag: bootstrapGtag,
    language: 'en',
    width: 767
  });

  clicks[0]();

  assert.deepEqual(normalize(directionsEvents(dataLayer)), [
    {
      event: 'directions_click',
      cta_location: 'hero',
      article_id: 'autumn-interlaken',
      language: 'en',
      device_category: 'mobile'
    }
  ]);
});

test('categorizes exact 768 and 1024 directions boundaries', () => {
  for (const [width, deviceCategory] of [
    [767, 'mobile'],
    [768, 'tablet'],
    [1023, 'tablet'],
    [1024, 'desktop']
  ]) {
    const { clicks, window } = loadTracking({
      articleId: 'autumn-interlaken',
      language: 'en',
      width
    });
    clicks[0]();

    assert.equal(directionsEvents(window.dataLayer)[0].device_category, deviceCategory, `${width}px`);
  }
});
