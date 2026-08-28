import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');

test('offers a multilingual order form from primary conversion surfaces', () => {
  assert.match(html, /<section class="section order-contact" id="order">/);
  assert.match(html, /<nav[^>]*id="primary-nav"[\s\S]*href="#order">Order \/ Contact<\/a>/);
  assert.match(html, /class="mobile-order" href="#order">Order<\/a>/);
  for (const language of ['en', 'de', 'th']) {
    assert.match(html, new RegExp(`name="language" value="${language}"`));
    assert.match(script, new RegExp(`\\b${language}: \\{`));
  }
});

test('collects items, service, date, time and payment acknowledgement', () => {
  assert.ok((html.match(/name="items"/g) ?? []).length >= 10);
  assert.match(html, /name="service" value="dine-in" required/);
  assert.match(html, /name="service" value="pickup" required/);
  assert.match(html, /type="date" name="orderDate" required/);
  assert.match(html, /type="time" name="orderTime" min="11:00" max="20:00" required/);
  assert.match(html, /name="paymentAccepted" required/);
  assert.match(html, /debit or credit cards only/i);
  assert.match(html, /Payment must be completed before we prepare food/i);
});

test('builds encoded WhatsApp and email handoffs without a data backend', () => {
  assert.match(script, /https:\/\/wa\.me\/41767742027\?text=/);
  assert.match(script, /mailto:bublee\.interlaken@gmail\.com\?subject=/);
  assert.match(script, /encodeURIComponent\(message\)/);
  assert.match(html, /details stay in your browser/i);
  assert.doesNotMatch(html, /action="https?:\/\//);
});

test('routes delivery customers to the existing Uber Eats listing', () => {
  const uberUrl = 'https://www.ubereats.com/ch/store/bublee-interlaken/Ik4zv95aWhWzt0lYSbjaMQ';
  assert.ok(html.split(uberUrl).length - 1 >= 4);
  assert.match(html, /Need delivery\?/);
});

test('lays the order form out responsively', () => {
  assert.match(css, /\.order-layout\s*\{[^}]*display:\s*grid/);
  assert.match(css, /\.order-item-groups\s*\{[^}]*grid-template-columns:\s*1fr 1fr/);
  assert.match(css, /@media\s*\(max-width:\s*1050px\)[\s\S]*\.order-layout\s*\{[^}]*grid-template-columns:\s*1fr/);
  assert.match(css, /@media\s*\(max-width:\s*560px\)[\s\S]*\.order-item-groups,[\s\S]*grid-template-columns:\s*1fr/);
});
