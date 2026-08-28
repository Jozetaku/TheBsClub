import test from 'node:test';
import assert from 'node:assert/strict';
import { BUSINESS, REVIEW_LINKS, TESTIMONIALS } from '../src/links.mjs';

const qrUrl = 'https://www.thebsclub.ch/review/?utm_source=in_store&utm_medium=qr&utm_campaign=review_hub';

test('defines every approved destination once', () => {
  assert.deepEqual(Object.keys(REVIEW_LINKS).sort(), [
    'directions', 'email', 'facebook', 'googleListing', 'googleReview',
    'instagram', 'menu', 'orderContact', 'permanentShareUrl', 'phone',
    'tripadvisor', 'uberEats', 'website', 'whatsapp'
  ]);
  assert.equal(REVIEW_LINKS.googleReview, 'https://g.page/r/CY7fuiiFPSvJEAE/review');
  assert.equal(REVIEW_LINKS.permanentShareUrl, qrUrl);
});

test('uses confirmed business details', () => {
  assert.deepEqual(BUSINESS, {
    name: "The B's Club",
    address: 'Jungfraustrasse 46, 3800 Interlaken, Switzerland',
    hours: 'Open daily · 11:00–20:00',
    phoneDisplay: '+41 76 774 20 27'
  });
});

test('contains only the three owner-approved testimonials', () => {
  assert.equal(TESTIMONIALS.length, 3);
  assert.deepEqual(TESTIMONIALS.map(({ author, platform }) => [author, platform]), [
    ['Ankita S.', 'Google review'],
    ['Traveller', 'Tripadvisor'],
    ['Jennylynn B.', 'Google review']
  ]);
});
