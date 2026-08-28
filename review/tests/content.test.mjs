import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const sitemap = readFileSync(new URL('../../sitemap.xml', import.meta.url), 'utf8');

test('keeps Google Review as the only primary external action', () => {
  assert.equal((html.match(/class="review-primary"/g) ?? []).length, 1);
  assert.match(html, /data-action="google_review"[^>]*href="https:\/\/g\.page\/r\/CY7fuiiFPSvJEAE\/review"/);
  assert.match(html, /Share your honest experience\./);
});

test('publishes approved social proof without review manipulation', () => {
  for (const author of ['Ankita S.', 'Traveller']) {
    assert.match(html, new RegExp(author.replace('.', '\\.')));
  }
  assert.doesNotMatch(html, /discount|reward|free gift|five-star review|copy this review|review like/i);
});

test('uses the approved two-line hero and compact social shortcut order', () => {
  assert.match(html, /<span class="headline-line">How was<\/span>\s*<em class="headline-line">your visit\?<\/em>/);
  const shortcuts = [...html.matchAll(/class="social-shortcut" data-action="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(shortcuts, ['instagram', 'facebook', 'tripadvisor', 'whatsapp']);
});

test('removes the decorative trust marker and third testimonial', () => {
  assert.doesNotMatch(html, /trust-marker|Jennylynn B\./);
  assert.equal((html.match(/class="testimonial-card/g) ?? []).length, 2);
});

test('renders metadata, structured data and every approved action', () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.thebsclub\.ch\/review\/">/);
  assert.match(html, /"@type":\s*"CafeOrCoffeeShop"/);
  for (const action of ['google_review', 'google_listing', 'tripadvisor', 'instagram', 'facebook', 'menu', 'uber_eats', 'order_contact', 'whatsapp', 'phone', 'email', 'directions', 'website']) {
    assert.match(html, new RegExp(`data-action="${action}"`));
  }
});

test('publishes the canonical review route in the sitemap', () => {
  assert.match(sitemap, /<loc>https:\/\/www\.thebsclub\.ch\/review\/<\/loc>/);
});

test('opens every HTTP action with safe external-link attributes', () => {
  const anchors = [...html.matchAll(/<a\b[^>]*href="https?:\/\/[^\"]+"[^>]*>/g)].map((match) => match[0]);
  assert.ok(anchors.length >= 10);
  for (const anchor of anchors) {
    assert.match(anchor, /target="_blank"/);
    assert.match(anchor, /rel="noopener noreferrer"/);
  }
});
