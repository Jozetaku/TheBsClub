import { PACK_STATUSES, TRIP_TYPES } from './travel-packs.mjs';

const MENU_URL = '/#favourites';
const PACKAGING_TYPES = new Set(['sealed-cold-cup', 'customer-flask', 'takeaway-bowl']);
const ITEM_TYPES = new Set(['drink', 'meal']);
const ITEM_ROLES = new Set(['featured', 'optional']);

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

function selectLocale(locale) {
  return locale === 'de' ? 'de' : 'en';
}

function hasCopy(record, locale) {
  return typeof record.locales?.[locale]?.title === 'string' && record.locales[locale].title &&
    typeof record.locales[locale].description === 'string' && record.locales[locale].description &&
    typeof record.carryNote?.[locale] === 'string' && record.carryNote[locale];
}

function isProductItem(item) {
  return item && typeof item.name === 'string' && item.name && ITEM_TYPES.has(item.type) &&
    ITEM_ROLES.has(item.role) && PACKAGING_TYPES.has(item.packagingType);
}

function isValidRecord(record) {
  return record && typeof record === 'object' && typeof record.packId === 'string' &&
    record.season === 'autumn' && TRIP_TYPES.includes(record.tripType) &&
    PACK_STATUSES.includes(record.status) && /^\d{4}-\d{2}-\d{2}$/.test(record.updatedAt) &&
    !Number.isNaN(Date.parse(`${record.updatedAt}T00:00:00Z`)) && hasCopy(record, 'en') &&
    hasCopy(record, 'de') && Array.isArray(record.productItems) && record.productItems.every(isProductItem) &&
    Array.isArray(record.dietaryTags) && typeof record.image === 'string' &&
    typeof record.menuUrl === 'string' && record.menuUrl && PACKAGING_TYPES.has(record.packagingType);
}

export function normalizePack(record, locale) {
  if (!isValidRecord(record)) return null;

  const selectedLocale = selectLocale(locale);
  return {
    packId: record.packId,
    tripType: record.tripType,
    status: record.status,
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
