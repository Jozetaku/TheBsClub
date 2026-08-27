import { PACK_STATUSES, TRIP_TYPES, travelPacks } from './travel-packs.mjs';

const MENU_URL = '/#favourites';
const APPROVED_PRODUCTS = new Map([
  ['Brown Sugar Milk Tea', { type: 'drink', packagingType: 'sealed-cold-cup' }],
  ['Yummy Strawberry', { type: 'drink', packagingType: 'sealed-cold-cup' }],
  ['Iced Matcha Latte', { type: 'drink', packagingType: 'sealed-cold-cup' }],
  ['Mango Tea', { type: 'drink', packagingType: 'sealed-cold-cup' }],
  ['Spicy Basil Chicken', { type: 'meal', packagingType: 'takeaway-bowl' }],
  ['Spicy Basil Tofu', { type: 'meal', packagingType: 'takeaway-bowl' }],
  ['Green Curry Chicken', { type: 'meal', packagingType: 'takeaway-bowl' }],
  ['Green Curry Tofu', { type: 'meal', packagingType: 'takeaway-bowl' }],
  ['Red Curry Chicken', { type: 'meal', packagingType: 'takeaway-bowl' }],
  ['Red Curry Tofu', { type: 'meal', packagingType: 'takeaway-bowl' }],
  ['Crispy Chicken Katsu Curry', { type: 'meal', packagingType: 'takeaway-bowl' }]
]);
const PACKAGING_TYPES = new Set(['sealed-cold-cup', 'customer-flask', 'takeaway-bowl']);
const ITEM_TYPES = new Set(['drink', 'meal']);
const ITEM_ROLES = new Set(['featured', 'optional']);
const ARTICLE_CLICK_EVENTS = new Map([
  ['travel-packs', 'travel_packs_click'],
  ['pack-select', 'pack_select'],
  ['menu', 'menu_click'],
  ['language-switch', 'language_switch'],
  ['outbound-place', 'outbound_place_click'],
  ['timetable', 'timetable_click']
]);
const initializedAnalytics = new WeakSet();

const fallbackCopy = {
  city: {
    en: { title: 'City stroll pack', description: 'Check today\'s current menu for a city-friendly option.' },
    de: { title: 'Paket für den Stadtbummel', description: 'Schau auf die aktuelle Karte für eine passende Option in der Stadt.' }
  },
  viewpoint: {
    en: { title: 'Viewpoint pack', description: 'Check today\'s current menu before heading to a viewpoint.' },
    de: { title: 'Paket für den Aussichtspunkt', description: 'Schau vor dem Weg zum Aussichtspunkt auf die aktuelle Karte.' }
  },
  travel: {
    en: { title: 'Travel pack', description: 'Check today\'s current menu for a travel-friendly option.' },
    de: { title: 'Reisepaket', description: 'Schau auf die aktuelle Karte für eine reisetaugliche Option.' }
  }
};

const notices = {
  en: "Ask for today's travel-friendly option before you order.",
  de: 'Frag vor deiner Bestellung nach der heutigen reisetauglichen Option.'
};

const statusLabels = {
  en: { active: 'Available', limited: 'Limited availability', unavailable: 'Unavailable' },
  de: { active: 'Verfügbar', limited: 'Begrenzte Auswahl', unavailable: 'Nicht verfügbar' }
};

function selectLocale(locale) {
  return locale === 'de' ? 'de' : 'en';
}

function hasCopy(record, locale) {
  return typeof record.locales?.[locale]?.title === 'string' && record.locales[locale].title &&
    typeof record.locales[locale].description === 'string' && record.locales[locale].description &&
    typeof record.carryNote?.[locale] === 'string' && record.carryNote[locale];
}

function isProductItem(item) {
  const approvedProduct = item && APPROVED_PRODUCTS.get(item.name);
  return item && typeof item.name === 'string' && approvedProduct && ITEM_TYPES.has(item.type) &&
    ITEM_ROLES.has(item.role) && PACKAGING_TYPES.has(item.packagingType) &&
    item.type === approvedProduct.type && item.packagingType === approvedProduct.packagingType;
}

function isCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isValidRecord(record) {
  return record && typeof record === 'object' && typeof record.packId === 'string' &&
    record.season === 'autumn' && TRIP_TYPES.includes(record.tripType) &&
    PACK_STATUSES.includes(record.status) && isCalendarDate(record.updatedAt) && hasCopy(record, 'en') &&
    hasCopy(record, 'de') && Array.isArray(record.productItems) && record.productItems.every(isProductItem) &&
    Array.isArray(record.dietaryTags) && record.dietaryTags.length === 0 && typeof record.image === 'string' &&
    record.menuUrl === MENU_URL && PACKAGING_TYPES.has(record.packagingType);
}

export function normalizePack(record, locale) {
  if (!isValidRecord(record)) return null;

  const selectedLocale = selectLocale(locale);
  return {
    packId: record.packId,
    tripType: record.tripType,
    status: record.status,
    statusLabel: statusLabels[selectedLocale][record.status],
    title: record.locales[selectedLocale].title,
    description: record.locales[selectedLocale].description,
    carryNote: record.carryNote[selectedLocale],
    productItems: record.status === 'unavailable' ? [] : record.productItems.map((item) => ({ ...item })),
    dietaryTags: [...record.dietaryTags],
    image: record.image,
    menuUrl: record.menuUrl,
    packagingType: record.packagingType,
    notice: record.status === 'limited' ? notices[selectedLocale] : ''
  };
}

function createFallback(tripType, locale) {
  const selectedLocale = selectLocale(locale);
  const copy = fallbackCopy[tripType][selectedLocale];
  return {
    packId: `autumn-${tripType}-fallback`,
    tripType,
    status: 'unavailable',
    statusLabel: statusLabels[selectedLocale].unavailable,
    title: copy.title,
    description: copy.description,
    carryNote: '',
    productItems: [],
    dietaryTags: [],
    image: `/articles/autumn-interlaken/pack-${tripType}.svg`,
    menuUrl: MENU_URL,
    packagingType: 'sealed-cold-cup',
    notice: ''
  };
}

export function getPackViewModels(records, locale) {
  const normalizedByType = new Map();
  for (const record of Array.isArray(records) ? records : []) {
    const model = normalizePack(record, locale);
    if (model && !normalizedByType.has(model.tripType)) normalizedByType.set(model.tripType, model);
  }
  return TRIP_TYPES.map((tripType) => normalizedByType.get(tripType) ?? createFallback(tripType, locale));
}

function addClass(element, className) {
  element.classList?.add(className);
}

function createPackEnhancement(document, model) {
  const content = document.createElement('div');
  content.setAttribute('data-pack-enhancement-content', '');

  const status = document.createElement('p');
  addClass(status, 'pack-status');
  status.setAttribute('data-status', model.status);
  status.textContent = model.statusLabel;
  content.append(status);

  const names = document.createElement('p');
  addClass(names, 'pack-items');
  names.textContent = model.productItems.map((item) => item.name).join(' · ');
  content.append(names);

  const carryNote = document.createElement('p');
  addClass(carryNote, 'pack-carry-note');
  carryNote.textContent = model.carryNote;
  content.append(carryNote);

  const selector = document.createElement('button');
  selector.setAttribute('type', 'button');
  selector.setAttribute('data-pack-selector', model.tripType);
  selector.setAttribute('data-pack-label', model.title);
  selector.setAttribute('data-article-event', 'pack-select');
  selector.setAttribute('data-cta-location', 'travel-packs');
  selector.setAttribute('aria-pressed', 'false');
  addClass(selector, 'pack-status');
  selector.textContent = model.title;
  content.append(selector);

  if (model.notice) {
    const notice = document.createElement('p');
    addClass(notice, 'pack-notice');
    notice.textContent = model.notice;
    content.append(notice);
  }

  return content;
}

export function renderTravelPacks(root, records, locale) {
  if (!root?.querySelectorAll) return false;

  const document = root.ownerDocument ?? root;
  if (!document.createElement) return false;

  const models = getPackViewModels(records, locale);
  if (!models.every((model) => model.status === 'active' || model.status === 'limited')) return false;

  const cards = [...root.querySelectorAll('[data-pack-card]')];
  const prepared = models.map((model) => {
    const card = cards.find((candidate) => candidate.getAttribute('data-trip-type') === model.tripType);
    const slot = card?.querySelector?.('[data-pack-enhancement]');
    return card && slot ? { card, slot, content: createPackEnhancement(document, model) } : null;
  });
  if (prepared.some((entry) => entry === null)) return false;

  for (const { card, slot, content } of prepared) {
    slot.replaceChildren(content);
    card.setAttribute('data-enhanced', 'true');
  }
  return true;
}

function prefersReducedMotion(document) {
  return document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

function findTravelPacksRoot(element) {
  let current = element?.parentNode;
  while (current) {
    if (current.getAttribute?.('id') === 'travel-packs') return current;
    current = current.parentNode;
  }
  return null;
}

function getDeviceCategory(width) {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function createArticleContext(document, ctaLocation) {
  return {
    article_id: document.body.dataset.articleId,
    language: document.documentElement.lang,
    cta_location: ctaLocation,
    device_category: getDeviceCategory(document.defaultView.innerWidth)
  };
}

function emitArticleEvent(document, eventName, ctaLocation, fields = {}) {
  const window = document.defaultView;
  const payload = {
    ...createArticleContext(document, ctaLocation),
    ...fields
  };
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
  } else {
    if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
    window.dataLayer.push({ event: eventName, ...payload });
  }
}

function initializeArticleAnalytics(document) {
  if (!document.body?.dataset?.articleId || !document.defaultView || initializedAnalytics.has(document)) return;
  initializedAnalytics.add(document);

  emitArticleEvent(document, 'article_view', 'article');

  const reachedDepths = new Set();
  document.defaultView.addEventListener?.('scroll', () => {
    const documentHeight = document.documentElement?.scrollHeight || document.body?.scrollHeight || 0;
    if (!documentHeight) return;
    const percent = ((document.defaultView.scrollY + document.defaultView.innerHeight) / documentHeight) * 100;
    for (const threshold of [50, 90]) {
      if (percent >= threshold && !reachedDepths.has(threshold)) {
        reachedDepths.add(threshold);
        emitArticleEvent(document, 'scroll_depth', `${threshold}_percent`);
      }
    }
  }, { passive: true });

  document.addEventListener?.('click', (event) => {
    const target = event.target?.closest?.('[data-article-event]');
    const marker = target?.getAttribute?.('data-article-event');
    const eventName = ARTICLE_CLICK_EVENTS.get(marker);
    if (!eventName) return;
    const fields = eventName === 'pack_select'
      ? { pack_name: target.getAttribute?.('data-pack-selector') }
      : {};
    emitArticleEvent(
      document,
      eventName,
      target.getAttribute?.('data-cta-location') || marker,
      fields
    );
  });
}

export function activateMapTarget(id, document, userInitiated = false) {
  const target = document?.getElementById?.(id);
  if (!target) return false;

  const targetPlace = target.getAttribute?.('data-place');
  const hotspots = [...document.querySelectorAll?.('.map-hotspot') ?? []];
  const targets = [...document.querySelectorAll?.('[data-place]') ?? []]
    .filter((element) => element.hasAttribute?.('id'));

  for (const hotspot of hotspots) {
    hotspot.classList?.remove('is-active');
    hotspot.removeAttribute?.('aria-current');
  }
  for (const section of targets) section.classList?.remove('is-active');

  const marker = hotspots.find((hotspot) => hotspot.getAttribute?.('data-place') === targetPlace);
  marker?.classList?.add('is-active');
  marker?.setAttribute?.('aria-current', 'location');
  target.classList?.add('is-active');

  if (userInitiated) {
    target.setAttribute?.('tabindex', '-1');
    target.focus?.({ preventScroll: true });
    target.scrollIntoView?.({
      behavior: prefersReducedMotion(document) ? 'auto' : 'smooth',
      block: 'start'
    });
  }
  return true;
}

export function initializeArticleInteractions(document) {
  if (!document?.querySelectorAll) return;

  initializeArticleAnalytics(document);

  const packsRoot = document.getElementById?.('travel-packs');
  if (packsRoot) {
    try {
      renderTravelPacks(packsRoot, travelPacks, document.documentElement?.lang);
    } catch {
      // Keep the authored fallback cards intact if enhancement cannot initialize.
    }
  }

  for (const hotspot of document.querySelectorAll('.map-hotspot')) {
    hotspot.addEventListener?.('click', () => {
      const id = hotspot.getAttribute?.('href')?.slice(1);
      if (id) activateMapTarget(id, document, true);
    });
  }

  const selectors = [...document.querySelectorAll('[data-pack-selector]')];
  if (!selectors.length) return;
  for (const selector of selectors) {
    const selectPack = () => {
      const tripType = selector.getAttribute?.('data-pack-selector');
      if (!TRIP_TYPES.includes(tripType)) return;
      const packRoot = findTravelPacksRoot(selector);
      packRoot?.setAttribute?.('data-selected-pack', tripType);
      for (const button of selectors) {
        const selected = button === selector;
        button.setAttribute?.('aria-pressed', String(selected));
        const label = button.getAttribute?.('data-pack-label') ?? button.textContent;
        button.textContent = selected ? `${label} ✓` : label;
      }
    };
    selector.addEventListener?.('click', selectPack);
  }
}

if (typeof document !== 'undefined') {
  initializeArticleInteractions(document);
}
