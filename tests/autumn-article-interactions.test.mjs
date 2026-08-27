import test from 'node:test';
import assert from 'node:assert/strict';
import * as article from '../articles/autumn-interlaken/article.mjs';
import { travelPacks } from '../articles/autumn-interlaken/travel-packs.mjs';

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
      defaultPrevented: false,
      preventDefault() { this.defaultPrevented = true; }
    };
    this.listeners.get('click')?.(event);
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
    this.defaultView = { matchMedia: () => ({ matches: false }) };
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
