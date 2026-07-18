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
