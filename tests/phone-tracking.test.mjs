import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const deHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const enHtml = readFileSync(new URL('../en/index.html', import.meta.url), 'utf8');

test('uses the current phone number ending in 27 on both homepages', () => {
  for (const html of [deHtml, enHtml]) {
    assert.match(html, /href="tel:\+41767742027"/);
    assert.doesNotMatch(html, /href="tel:[^"]*22"/);
  }
});

test('tracks telephone links as Google Ads click-to-call conversions', () => {
  assert.match(script, /querySelectorAll\('a\[href\^="tel:"\]'\)/);
  assert.match(script, /gtag\('event', 'phone_click'/);
  assert.match(script, /send_to:\s*googleAdsConversions\.phone/);
  assert.match(script, /phone:\s*'AW-18339850662\/Fs5nCOKbze4cEKbTj6lE'/);
});
