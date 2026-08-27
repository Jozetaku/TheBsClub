import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as article from '../articles/autumn-interlaken/article.mjs';
import { travelPacks } from '../articles/autumn-interlaken/travel-packs.mjs';

const englishHtml = readFileSync(new URL('../en/articles/autumn-interlaken/index.html', import.meta.url), 'utf8');
const germanHtml = readFileSync(new URL('../de/artikel/herbst-interlaken/index.html', import.meta.url), 'utf8');

const eventLocationsByMarker = (html) => {
  const locations = new Map();
  for (const match of html.matchAll(/<(?:a|button)\b[^>]*data-article-event="[^"]+"[^>]*>/g)) {
    const tag = match[0];
    const marker = tag.match(/data-article-event="([^"]+)"/)?.[1];
    const location = tag.match(/data-cta-location="([^"]+)"/)?.[1] ?? null;
    const values = locations.get(marker) ?? [];
    values.push(location);
    locations.set(marker, values);
  }
  return Object.fromEntries(locations);
};

class FakeClassList {
  constructor(owner) {
    this.owner = owner;
    this.values = new Set();
  }

  add(...names) {
    names.forEach((name) => this.values.add(name));
  }

  remove(...names) {
    names.forEach((name) => this.values.delete(name));
  }

  contains(name) {
    return this.values.has(name);
  }
}

class FakeElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.attributes = new Map();
    this.children = [];
    this.parentNode = null;
    this.listeners = new Map();
    this.classList = new FakeClassList(this);
    this._textContent = '';
  }

  set textContent(value) {
    this._textContent = String(value);
    this.children = [];
  }

  get textContent() {
    return this._textContent + this.children.map((child) => child.textContent).join('');
  }

  append(...nodes) {
    this._textContent = '';
    for (const node of nodes) {
      node.parentNode = this;
      this.children.push(node);
    }
  }

  replaceChildren(...nodes) {
    this._textContent = '';
    this.children = [];
    this.append(...nodes);
  }

  setAttribute(name, value = '') {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  hasAttribute(name) {
    return this.attributes.has(name);
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  click() {
    const event = {
      currentTarget: this,
      target: this,
      defaultPrevented: false,
      preventDefault() { this.defaultPrevented = true; }
    };
    let current = this;
    while (current) {
      event.currentTarget = current;
      current.listeners.get('click')?.(event);
      current = current.parentNode;
    }
    return event;
  }

  focus() {
    this.focused = true;
  }

  scrollIntoView(options) {
    this.scrollOptions = options;
  }

  matches(selector) {
    if (selector.startsWith('.')) return this.classList.contains(selector.slice(1));
    const attribute = selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);
    if (attribute) return this.hasAttribute(attribute[1]) &&
      (attribute[2] === undefined || this.getAttribute(attribute[1]) === attribute[2]);
    return false;
  }

  closest(selector) {
    let current = this;
    while (current) {
      if (current.matches?.(selector)) return current;
      current = current.parentNode;
    }
    return null;
  }

  querySelectorAll(selector) {
    return this.children.flatMap((child) => [
      ...(child.matches(selector) ? [child] : []),
      ...child.querySelectorAll(selector)
    ]);
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }
}

class FakeDocument extends FakeElement {
  constructor() {
    super('#document');
    const listeners = new Map();
    this.defaultView = {
      dataLayer: [],
      innerHeight: 500,
      innerWidth: 767,
      matchMedia: () => ({ matches: false }),
      scrollY: 0,
      addEventListener(type, listener) {
        const handlers = listeners.get(type) ?? [];
        handlers.push(listener);
        listeners.set(type, handlers);
      },
      dispatch(type) {
        for (const listener of listeners.get(type) ?? []) listener();
      }
    };
    this.body = { dataset: {} };
    this.documentElement = { lang: 'en', scrollHeight: 2000 };
  }

  createElement(tagName) {
    return new FakeElement(tagName);
  }

  getElementById(id) {
    return this.querySelectorAll('[id]').find((element) => element.getAttribute('id') === id) ?? null;
  }
}

const element = (tagName, attributes = {}, text = '') => {
  const node = new FakeElement(tagName);
  Object.entries(attributes).forEach(([name, value]) => {
    if (name === 'class') value.split(' ').forEach((className) => node.classList.add(className));
    else node.setAttribute(name, value);
  });
  node.textContent = text;
  return node;
};

const createPackCard = (tripType) => {
  const card = element('article', {
    'data-pack-card': '',
    'data-trip-type': tripType
  });
  const fallback = element('p', {}, `${tripType} fallback category`);
  const slot = element('div', { 'data-pack-enhancement': '' });
  const menu = element('a', { href: '/#favourites' }, 'Current menu');
  card.append(fallback, slot, menu);
  return { card, slot, menu };
};

const createPackRoot = () => {
  const root = new FakeElement('section');
  root.ownerDocument = new FakeDocument();
  root.setAttribute('id', 'travel-packs');
  const cards = Object.fromEntries(['city', 'viewpoint', 'travel'].map((tripType) => [tripType, createPackCard(tripType)]));
  const grid = element('div', { class: 'pack-grid' });
  const container = element('div', { class: 'container' });
  grid.append(...Object.values(cards).map(({ card }) => card));
  container.append(grid);
  root.append(container);
  return { root, cards };
};

const createAnalyticsDocument = ({ language = 'en', width = 767 } = {}) => {
  const document = new FakeDocument();
  document.body.dataset.articleId = 'autumn-interlaken';
  document.documentElement.lang = language;
  document.defaultView.innerWidth = width;
  return document;
};

const normalize = (value) => JSON.parse(JSON.stringify(value));

test('renders active permitted names and localized carry note into enhancement slots', () => {
  const { root, cards } = createPackRoot();

  article.renderTravelPacks(root, travelPacks, 'de');

  assert.match(cards.city.slot.textContent, /Yummy Strawberry/);
  assert.match(cards.city.slot.textContent, /Kalte Getränke sind für einfachen Transport versiegelt/);
  assert.equal(cards.city.card.getAttribute('data-enhanced'), 'true');
  assert.equal(cards.city.menu.getAttribute('href'), '/#favourites');
});

test('renders limited names and the localized ask-today notice', () => {
  const { root, cards } = createPackRoot();
  const limited = travelPacks.map((pack) => ({ ...pack, status: pack.tripType === 'city' ? 'limited' : pack.status }));

  article.renderTravelPacks(root, limited, 'en');

  assert.match(cards.city.slot.textContent, /Yummy Strawberry/);
  assert.match(cards.city.slot.textContent, /Ask for today's travel-friendly option before you order/);
});

test('localizes active and limited pack status labels for readers', () => {
  const active = createPackRoot();
  article.renderTravelPacks(active.root, travelPacks, 'de');
  assert.equal(
    active.cards.city.slot.querySelector('[data-status="active"]').textContent,
    'Verfügbar'
  );

  const limited = createPackRoot();
  article.renderTravelPacks(
    limited.root,
    travelPacks.map((pack) => ({ ...pack, status: pack.tripType === 'city' ? 'limited' : pack.status })),
    'de'
  );
  assert.equal(
    limited.cards.city.slot.querySelector('[data-status="limited"]').textContent,
    'Begrenzte Auswahl'
  );
});

test('leaves fallback categories and menu calls to action intact for unavailable invalid or missing data', () => {
  for (const records of [[], [{ tripType: 'city', status: 'broken' }], travelPacks.map((pack) => ({ ...pack, status: 'unavailable' }))]) {
    const { root, cards } = createPackRoot();

    article.renderTravelPacks(root, records, 'en');

    for (const { card, slot, menu } of Object.values(cards)) {
      assert.match(card.textContent, /fallback category/);
      assert.equal(slot.textContent, '');
      assert.equal(menu.getAttribute('href'), '/#favourites');
      assert.equal(card.hasAttribute('data-enhanced'), false);
    }
  }
});

test('enhances valid pack cards independently when another record is unavailable', () => {
  const { root, cards } = createPackRoot();
  const mixed = travelPacks.map((pack) => (
    pack.tripType === 'viewpoint' ? { ...pack, status: 'unavailable', productItems: [] } : pack
  ));

  assert.equal(article.renderTravelPacks(root, mixed, 'en'), true);

  assert.match(cards.city.slot.textContent, /Yummy Strawberry/);
  assert.equal(cards.city.card.getAttribute('data-enhanced'), 'true');
  assert.equal(cards.viewpoint.slot.textContent, '');
  assert.equal(cards.viewpoint.card.hasAttribute('data-enhanced'), false);
  assert.match(cards.viewpoint.card.textContent, /viewpoint fallback category/);
  assert.match(cards.travel.slot.textContent, /Mango Tea/);
  assert.equal(cards.travel.card.getAttribute('data-enhanced'), 'true');
});

test('falls back only the active card whose product list is empty', () => {
  const { root, cards } = createPackRoot();
  const emptyActive = travelPacks.map((pack) => (
    pack.tripType === 'city' ? { ...pack, productItems: [] } : pack
  ));

  assert.equal(article.renderTravelPacks(root, emptyActive, 'de'), true);

  assert.equal(cards.city.slot.textContent, '');
  assert.equal(cards.city.card.hasAttribute('data-enhanced'), false);
  assert.equal(cards.viewpoint.card.getAttribute('data-enhanced'), 'true');
  assert.equal(cards.travel.card.getAttribute('data-enhanced'), 'true');
});

test('a hotspot click marks only its target and marker current without replacing native navigation', () => {
  const document = new FakeDocument();
  const hotspotA = element('a', { class: 'map-hotspot', href: '#place-aare', 'data-place': 'aare' });
  const hotspotB = element('a', { class: 'map-hotspot', href: '#place-hohematte', 'data-place': 'hohematte' });
  const targetA = element('section', { id: 'place-aare', 'data-place': 'aare' });
  const targetB = element('section', { id: 'place-hohematte', 'data-place': 'hohematte' });
  document.append(hotspotA, hotspotB, targetA, targetB);

  article.initializeArticleInteractions(document);
  const event = hotspotA.click();

  assert.equal(event.defaultPrevented, false);
  assert.equal(hotspotA.getAttribute('aria-current'), 'location');
  assert.equal(hotspotB.hasAttribute('aria-current'), false);
  assert.equal(hotspotA.classList.contains('is-active'), true);
  assert.equal(hotspotB.classList.contains('is-active'), false);
  assert.equal(targetA.classList.contains('is-active'), true);
  assert.equal(targetB.classList.contains('is-active'), false);
  assert.equal(targetA.focused, true);
  assert.deepEqual(targetA.scrollOptions, { behavior: 'smooth', block: 'start' });
});

test('a pack selector identifies its trip type without hiding other static cards', () => {
  const document = new FakeDocument();
  const { root, cards } = createPackRoot();
  document.append(root);

  article.initializeArticleInteractions(document);
  const citySelector = cards.city.slot.querySelector('[data-pack-selector]');
  const viewpointSelector = cards.viewpoint.slot.querySelector('[data-pack-selector]');

  assert.equal(citySelector.tagName, 'BUTTON');
  assert.equal(cards.city.card.hasAttribute('data-pack-selector'), false);
  viewpointSelector.click();

  assert.equal(root.getAttribute('data-selected-pack'), 'viewpoint');
  assert.equal(viewpointSelector.getAttribute('aria-pressed'), 'true');
  assert.equal(citySelector.getAttribute('aria-pressed'), 'false');
  assert.match(viewpointSelector.textContent, /✓/);
  assert.equal(cards.city.card.hasAttribute('hidden'), false);
  assert.equal(cards.viewpoint.card.hasAttribute('hidden'), false);
  assert.equal(cards.travel.card.hasAttribute('hidden'), false);
});

test('initialization without the autumn article DOM exits without throwing', () => {
  assert.doesNotThrow(() => article.initializeArticleInteractions(new FakeDocument()));
});

test('initialization enhances the complete travel-pack fallback when the article root exists', () => {
  const document = new FakeDocument();
  const { root, cards } = createPackRoot();
  root.setAttribute('id', 'travel-packs');
  root.ownerDocument = document;
  document.append(root);

  article.initializeArticleInteractions(document);

  assert.match(cards.travel.slot.textContent, /Mango Tea/);
  assert.equal(cards.travel.card.getAttribute('data-enhanced'), 'true');
});

test('reduced motion uses an instant scroll for an explicit map activation', () => {
  const document = new FakeDocument();
  document.defaultView.matchMedia = () => ({ matches: true });
  const hotspot = element('a', { class: 'map-hotspot', href: '#place-aare', 'data-place': 'aare' });
  const target = element('section', { id: 'place-aare', 'data-place': 'aare' });
  document.append(hotspot, target);

  article.activateMapTarget('place-aare', document, true);

  assert.deepEqual(target.scrollOptions, { behavior: 'auto', block: 'start' });
});

test('emits article_view once with article context', () => {
  const document = createAnalyticsDocument();

  article.initializeArticleInteractions(document);
  article.initializeArticleInteractions(document);

  assert.deepEqual(normalize(document.defaultView.dataLayer), [{
    event: 'article_view',
    article_id: 'autumn-interlaken',
    language: 'en',
    cta_location: 'article',
    device_category: 'mobile'
  }]);
});

test('categorizes exact 768 and 1024 article analytics boundaries', () => {
  for (const [width, deviceCategory] of [
    [767, 'mobile'],
    [768, 'tablet'],
    [1023, 'tablet'],
    [1024, 'desktop']
  ]) {
    const document = createAnalyticsDocument({ width });
    article.initializeArticleInteractions(document);

    assert.equal(document.defaultView.dataLayer[0].device_category, deviceCategory, `${width}px`);
  }
});

test('emits scroll_depth once at each 50 and 90 percent threshold', () => {
  const document = createAnalyticsDocument({ width: 800 });
  article.initializeArticleInteractions(document);
  document.defaultView.dataLayer.length = 0;

  document.defaultView.scrollY = 500;
  document.defaultView.dispatch('scroll');
  document.defaultView.dispatch('scroll');
  document.defaultView.scrollY = 1300;
  document.defaultView.dispatch('scroll');
  document.defaultView.dispatch('scroll');

  assert.deepEqual(normalize(document.defaultView.dataLayer), [
    {
      event: 'scroll_depth',
      article_id: 'autumn-interlaken',
      language: 'en',
      cta_location: '50_percent',
      device_category: 'tablet'
    },
    {
      event: 'scroll_depth',
      article_id: 'autumn-interlaken',
      language: 'en',
      cta_location: '90_percent',
      device_category: 'tablet'
    }
  ]);
});

test('delegates article CTA event names with context and leaves directions to the shared owner', () => {
  const document = createAnalyticsDocument({ language: 'de', width: 1200 });
  const targets = [
    ['travel-packs', 'travel_packs_click'],
    ['menu', 'menu_click'],
    ['language-switch', 'language_switch'],
    ['outbound-place', 'outbound_place_click'],
    ['timetable', 'timetable_click'],
    ['directions', null]
  ].map(([marker, eventName]) => ({
    target: element('a', { 'data-article-event': marker }),
    eventName
  }));
  document.append(...targets.map(({ target }) => target));
  article.initializeArticleInteractions(document);
  document.defaultView.dataLayer.length = 0;

  targets.forEach(({ target }) => target.click());

  assert.deepEqual(normalize(document.defaultView.dataLayer), targets
    .filter(({ eventName }) => eventName)
    .map(({ target, eventName }) => ({
      event: eventName,
      article_id: 'autumn-interlaken',
      language: 'de',
      cta_location: target.getAttribute('data-article-event'),
      device_category: 'desktop'
    })));
});

test('pack_select uses stable trip-type enums for every selector in each locale', () => {
  for (const language of ['en', 'de']) {
    const document = createAnalyticsDocument({ language });
    const { root } = createPackRoot();
    root.ownerDocument = document;
    document.append(root);
    article.initializeArticleInteractions(document);
    document.defaultView.dataLayer.length = 0;

    for (const tripType of ['city', 'viewpoint', 'travel']) {
      root.querySelector(`[data-pack-selector="${tripType}"]`).click();
    }

    assert.deepEqual(normalize(document.defaultView.dataLayer), ['city', 'viewpoint', 'travel'].map((packName) => ({
      event: 'pack_select',
      article_id: 'autumn-interlaken',
      language,
      cta_location: 'travel-packs',
      device_category: 'mobile',
      pack_name: packName
    })));
  }
});

test('both locale pages mark language, place and timetable article events', () => {
  for (const html of [englishHtml, germanHtml]) {
    assert.match(html, /<script src="\/script\.js\?v=20260827-1" defer><\/script>/);
    assert.match(html, /data-article-event="language-switch"/);
    assert.match(html, /data-article-event="outbound-place"/);
    assert.match(html, /data-article-event="timetable"/);
  }
});

test('repeated article event surfaces provide matching specific CTA locations in both locales', () => {
  const expected = {
    directions: ['header', 'hero', 'visit', 'mobile'],
    'language-switch': ['article-tools'],
    'travel-packs': ['hero', 'mobile'],
    'outbound-place': [
      'destination', 'destination', 'destination', 'destination',
      'sources', 'sources', 'sources'
    ],
    menu: [
      'destination', 'destination', 'destination', 'destination', 'destination', 'destination',
      'travel-pack-card', 'travel-pack-card', 'travel-pack-card', 'directions', 'mobile'
    ],
    timetable: ['destination', 'destination', 'sources', 'sources']
  };

  assert.deepEqual(eventLocationsByMarker(englishHtml), expected);
  assert.deepEqual(eventLocationsByMarker(germanHtml), expected);
});
