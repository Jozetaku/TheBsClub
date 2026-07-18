import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const htmlUrl = new URL('../index.html', import.meta.url);
const html = readFileSync(htmlUrl, 'utf8');

const bootstrapMatch = html.match(
  /<script data-google-consent-bootstrap>([\s\S]*?)<\/script>/
);

test('loads the Google tag for the approved GA4 measurement ID', () => {
  assert.match(
    html,
    /https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-JS838K2PY5/
  );
});

test('sets every consent category to denied before configuring GA4', () => {
  assert.ok(bootstrapMatch, 'consent bootstrap should exist');
  const window = { dataLayer: [] };
  vm.runInNewContext(bootstrapMatch[1], { window, Date });
  const calls = JSON.parse(JSON.stringify(
    window.dataLayer.map((args) => Array.from(args))
  ));

  assert.deepEqual(calls[0], [
    'consent',
    'default',
    {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500
    }
  ]);
  assert.deepEqual(calls.at(-1), ['config', 'G-JS838K2PY5']);
});

test('declares consent defaults before loading gtag.js', () => {
  const bootstrapIndex = html.indexOf('data-google-consent-bootstrap');
  const loaderIndex = html.indexOf('googletagmanager.com/gtag/js?id=G-JS838K2PY5');
  assert.ok(bootstrapIndex >= 0 && bootstrapIndex < loaderIndex);
});

const scriptUrl = new URL('../script.js', import.meta.url);
const siteScript = readFileSync(scriptUrl, 'utf8');

const loadConsentController = ({ storedValue = null } = {}) => {
  const calls = [];
  const storage = new Map();
  if (storedValue) storage.set('thebsclub_analytics_consent', storedValue);

  const banner = { hidden: true };
  const privacySettings = {
    addEventListener(type, handler) {
      if (type === 'click') this.click = handler;
    }
  };
  const consentButtons = ['granted', 'denied'].map((choice) => ({
    dataset: { consentChoice: choice },
    focus() {
      this.focused = true;
    },
    addEventListener(type, handler) {
      if (type === 'click') this.click = handler;
    }
  }));

  const window = {
    gtag: (...args) => calls.push(JSON.parse(JSON.stringify(args))),
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value)
    },
    addEventListener() {},
    matchMedia: () => ({ matches: true }),
    scrollY: 0
  };
  const document = {
    addEventListener() {},
    querySelector(selector) {
      if (selector === '#analytics-consent') return banner;
      if (selector === '#privacy-settings') return privacySettings;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === '[data-consent-choice]') return consentButtons;
      return [];
    },
    body: { classList: { toggle() {}, add() {}, remove() {} } }
  };

  vm.runInNewContext(siteScript, { window, document });
  return { banner, calls, consentButtons, privacySettings, storage };
};

test('shows the consent bar when no choice is stored', () => {
  const { banner } = loadConsentController();
  assert.equal(banner.hidden, false);
});

test('restores granted analytics while keeping advertising denied', () => {
  const { calls, banner } = loadConsentController({ storedValue: 'granted' });
  assert.deepEqual(calls[0], [
    'consent',
    'update',
    {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    }
  ]);
  assert.equal(banner.hidden, true);
});

test('stores a rejection and keeps every category denied', () => {
  const { banner, calls, consentButtons, storage } = loadConsentController();
  consentButtons[1].click();
  assert.equal(storage.get('thebsclub_analytics_consent'), 'denied');
  assert.equal(banner.hidden, true);
  assert.deepEqual(calls.at(-1)[2], {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
});

test('reopens privacy settings and focuses the accept action', () => {
  const { banner, consentButtons, privacySettings } = loadConsentController({ storedValue: 'denied' });
  privacySettings.click();
  assert.equal(banner.hidden, false);
  assert.equal(consentButtons[0].focused, true);
});
