# The B's Club Review & Contact Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a branded, mobile-first `/review/` page that makes an honest Google review the primary action, exposes every approved review, social, order, direction, and contact destination, generates a permanent tracked QR, and updates the whole website to the confirmed telephone and 11:00–20:00 hours.

**Architecture:** Keep source, tests, and build tooling inside `review/`, generate deployable files into `review/dist/`, and map that directory to the public `/review/` route in the existing GitHub Pages workflow. `review/src/links.mjs` is the single source of truth; the build renders real anchor URLs so the page still works without JavaScript and generates SVG/PNG QR assets from the same permanent URL.

**Tech Stack:** Semantic HTML5, CSS, vanilla JavaScript ES modules, Node.js built-in test runner, `qrcode@1.5.4` as a build-only dependency, GA4 Consent Mode with measurement ID `G-JS838K2PY5`, existing GitHub Pages Actions.

## Global Constraints

- Approved spec: `docs/superpowers/specs/2026-08-28-review-contact-hub-design.md`.
- Public URL: `https://www.thebsclub.ch/review/`.
- Permanent QR URL: `https://www.thebsclub.ch/review/?utm_source=in_store&utm_medium=qr&utm_campaign=review_hub`.
- Direct Google Review URL: `https://g.page/r/CY7fuiiFPSvJEAE/review`.
- Public telephone and WhatsApp: `+41 76 774 20 27` / `+41767742027`.
- Public hours: every day, `11:00–20:00`; opening time remains `11:00`.
- Google Review is the only visually primary external CTA.
- Use the current official mountain logo, current palette, and current typography only.
- Show only the three owner-approved excerpts already published on the homepage.
- Ask for an honest review; no incentive, sentiment gate, requested rating, requested phrase, or review template.
- Every external HTTP link uses `target="_blank"` and `rel="noopener noreferrer"`.
- Telephone and email links use native schemes and do not force a new tab.
- Primary CTA stays within the first viewport at 360×800 and 390×844.
- No horizontal scrolling at 320 px; minimum interactive target is 48 px.
- Advertising storage remains denied; no Meta/TikTok pixels, fingerprinting, third-party review widget, or review-content collection.
- Preserve the official logo, custom cursor, homepage order form, bilingual articles, and all unrelated user files.
- Do not deploy or distribute the final QR until local owner review is approved.

---

## File Map

- `review/package.json` and `review/package-lock.json` — isolated build/test scripts and pinned QR dependency.
- `review/src/links.mjs` — all external destinations, business details, approved testimonials, and permanent URL.
- `review/src/index.template.html` — semantic source page with build placeholders and consent bootstrap.
- `review/src/review.css` — isolated The B's Club tokens, layout, responsive rules, focus, and reduced motion.
- `review/src/review.mjs` — share/copy fallback, consent controller, and aggregate action tracking.
- `review/scripts/build.mjs` — render configured values, copy assets, generate both QR formats, and fail on unresolved placeholders.
- `review/dist/` — generated production route copied to `_site/review/`.
- `review/tests/config.test.mjs` — exact URL/business/testimonial contract.
- `review/tests/content.test.mjs` — hierarchy, policy copy, metadata, structured data, safe anchors, and social proof.
- `review/tests/style.test.mjs` — responsive, accessibility, and visual-hierarchy CSS contract.
- `review/tests/app.test.mjs` — share fallback, consent, and tracking behaviour.
- `review/tests/qr.test.mjs` — QR build outputs and permanent-URL equality.
- `tests/business-details.test.mjs` — site-wide phone/hour regression contract.
- `tests/deploy-pages.test.mjs` — production build and `/review/` artifact contract.
- `index.html`, `en/articles/autumn-interlaken/index.html`, `de/artikel/herbst-interlaken/index.html`, `README.md` — confirmed phone/hour updates.
- `.github/workflows/deploy-pages.yml` — install/build the review bundle and copy only `review/dist/`.
- `sitemap.xml` — discoverable canonical `/review/` route.

---

### Task 1: Update the Site-Wide Business Contract

**Files:**
- Create: `tests/business-details.test.mjs`
- Modify: `tests/site-content.test.mjs`
- Modify: `tests/focused-launch.test.mjs`
- Modify: `tests/order-contact.test.mjs`
- Modify: `tests/autumn-article-content.test.mjs`
- Modify: `index.html`
- Modify: `en/articles/autumn-interlaken/index.html`
- Modify: `de/artikel/herbst-interlaken/index.html`
- Modify: `README.md`

**Interfaces:**
- Consumes: owner-confirmed public phone `+41 76 774 20 27` and daily `11:00–20:00` hours.
- Produces: one repository-wide business contract that all later review-page content must match.

- [ ] **Step 1: Write the failing site-wide business-detail test**

Create `tests/business-details.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const files = [
  '../index.html',
  '../en/articles/autumn-interlaken/index.html',
  '../de/artikel/herbst-interlaken/index.html',
  '../README.md'
];
const contents = files.map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));

test('publishes the confirmed public telephone everywhere', () => {
  for (const content of contents) {
    assert.doesNotMatch(content, /(?:\+41 76 226 27 22|\+41762262722)/);
  }
  assert.match(contents[0], /tel:\+41767742027/);
  assert.match(contents[0], /\+41 76 774 20 27/);
  assert.match(contents[1], /tel:\+41767742027/);
  assert.match(contents[2], /tel:\+41767742027/);
});

test('publishes daily 11:00–20:00 hours everywhere', () => {
  for (const content of contents) {
    assert.doesNotMatch(content, /11:00[–-]19:00|to 19:00|until 19:00|"closes":\s*"19:00"/);
  }
  assert.match(contents[0], /11:00[–-]20:00/);
  assert.match(contents[0], /"closes":\s*"20:00"/);
  assert.match(contents[1], /11:00[–-]20:00/);
  assert.match(contents[2], /11:00[–-]20:00/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run from repository root:

`node --test tests/business-details.test.mjs`

Expected: 2 failures reporting the old phone and `19:00` values.

- [ ] **Step 3: Update existing assertions before production content**

Make these exact contract changes:

```js
assert.match(html, /11:00[–-]20:00/);
assert.match(html, /"closes": "20:00"/);
assert.match(html, /tel:\+41767742027/);
assert.match(html, /\+41 76 774 20 27/);
assert.match(html, /type="time" name="orderTime" min="11:00" max="20:00" required/);
```

Replace the corresponding `19:00`, `+41762262722`, and `+41 76 226 27 22` expectations in the four existing test files listed above. Do not alter unrelated launch/menu assertions.

- [ ] **Step 4: Run the focused tests and verify they remain RED for production content**

Run:

```powershell
node --test tests/business-details.test.mjs tests/site-content.test.mjs tests/focused-launch.test.mjs tests/order-contact.test.mjs tests/autumn-article-content.test.mjs
```

Expected: failures point to unchanged production HTML/README, not test syntax.

- [ ] **Step 5: Apply the confirmed details to customer-facing content**

In `index.html` replace every relevant value, including metadata, JSON-LD, launch strip, hero, trust row, maker-hours label, evening panel, order-time maximum, visit block, and telephone anchor:

```html
<meta name="description" content="Thai food, Bubble Tea, coffee and matcha at The B's Club, an Asian café in central Interlaken. Dine in or takeaway daily, 11:00–20:00.">
```

```json
"telephone": "+41767742027",
"opens": "11:00",
"closes": "20:00"
```

```html
<input type="time" name="orderTime" min="11:00" max="20:00" required>
<a href="tel:+41767742027">+41 76 774 20 27</a>
```

Use `11:00–20:00`, `to 20:00`, or `until 20:00` according to the existing sentence grammar. In both article pages update only the visit-block phone and hours. In `README.md` set:

```markdown
- Opening hours: Every day: `11:00–20:00`
- Phone: `+41 76 774 20 27`
```

- [ ] **Step 6: Verify GREEN and commit Task 1**

Run:

```powershell
node --test tests/business-details.test.mjs tests/site-content.test.mjs tests/focused-launch.test.mjs tests/order-contact.test.mjs tests/autumn-article-content.test.mjs
rg -n "11:00.–.19:00|to 19:00|until 19:00|closes.*19:00|41762262722|76 226 27 22" index.html en de README.md tests
```

Expected: all focused tests pass; `rg` returns no matches outside historical documents under `docs/`.

Commit only Task 1 files:

```powershell
git add -- tests/business-details.test.mjs tests/site-content.test.mjs tests/focused-launch.test.mjs tests/order-contact.test.mjs tests/autumn-article-content.test.mjs index.html en/articles/autumn-interlaken/index.html de/artikel/herbst-interlaken/index.html README.md
git commit -m "fix: align public phone and opening hours"
```

---

### Task 2: Establish the Review Hub Configuration and Semantic Build

**Files:**
- Create: `review/package.json`
- Create: `review/src/links.mjs`
- Create: `review/src/index.template.html`
- Create: `review/scripts/build.mjs`
- Create: `review/tests/config.test.mjs`
- Create: `review/tests/content.test.mjs`
- Generate: `review/package-lock.json`
- Generate: `review/dist/index.html`
- Copy during build: `review/dist/assets/logo-official.png`

**Interfaces:**
- Consumes: approved spec and root `images/logo-official.png`.
- Produces: `REVIEW_LINKS`, `BUSINESS`, `TESTIMONIALS`, `renderTemplate(template, values)`, and noscript-safe generated HTML.

- [ ] **Step 1: Create isolated package scripts**

Create `review/package.json`:

```json
{
  "name": "the-bs-club-review-hub",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node scripts/build.mjs",
    "test": "node --test tests/*.test.mjs",
    "preview": "npx --yes serve dist -l 53901"
  },
  "devDependencies": {
    "qrcode": "1.5.4"
  }
}
```

Run `npm install --package-lock-only` from `review/` and commit the resulting lock file later in this task.

- [ ] **Step 2: Write the failing configuration tests**

Create `review/tests/config.test.mjs`:

```js
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
```

- [ ] **Step 3: Run configuration tests and verify RED**

Run from `review/`:

`node --test tests/config.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/links.mjs`.

- [ ] **Step 4: Implement the single configuration module**

Create `review/src/links.mjs`:

```js
export const REVIEW_LINKS = Object.freeze({
  googleReview: 'https://g.page/r/CY7fuiiFPSvJEAE/review',
  googleListing: 'https://www.google.com/maps/search/?api=1&query=The+B%27s+Club+Interlaken&query_place_id=ChIJya5KW-ylj0cRjt-6KIU9K8k',
  directions: 'https://maps.google.com/?q=Jungfraustrasse+46,+3800+Interlaken',
  instagram: 'https://www.instagram.com/thebsclub25/',
  facebook: 'https://www.facebook.com/profile.php?id=100071619350267',
  tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g188081-d25277432-Reviews-Bublee_Tea_Interlaken-Interlaken_Bernese_Oberland_Canton_of_Bern.html',
  uberEats: 'https://www.ubereats.com/ch/store/bublee-interlaken/Ik4zv95aWhWzt0lYSbjaMQ',
  menu: 'https://www.thebsclub.ch/#food',
  orderContact: 'https://www.thebsclub.ch/#order',
  website: 'https://www.thebsclub.ch/',
  whatsapp: 'https://wa.me/41767742027',
  phone: 'tel:+41767742027',
  email: 'mailto:bublee.interlaken@gmail.com',
  permanentShareUrl: 'https://www.thebsclub.ch/review/?utm_source=in_store&utm_medium=qr&utm_campaign=review_hub'
});

export const BUSINESS = Object.freeze({
  name: "The B's Club",
  address: 'Jungfraustrasse 46, 3800 Interlaken, Switzerland',
  hours: 'Open daily · 11:00–20:00',
  phoneDisplay: '+41 76 774 20 27'
});

export const TESTIMONIALS = Object.freeze([
  { author: 'Ankita S.', platform: 'Google review', quote: 'The bubble tea was amazing—refreshing, perfectly sweet, and the pearls had the ideal chewy texture.' },
  { author: 'Traveller', platform: 'Tripadvisor', quote: 'I stayed in Interlaken for four days and tried their teas every day—authentic taste and reasonably priced.' },
  { author: 'Jennylynn B.', platform: 'Google review', quote: "The best bubble tea I've ever had. Very nice and friendly service. Highly recommend!" }
]);
```

- [ ] **Step 5: Verify configuration GREEN**

Run: `node --test tests/config.test.mjs`

Expected: 3 tests pass, 0 fail.

- [ ] **Step 6: Write failing semantic-content tests**

Create `review/tests/content.test.mjs` to read `dist/index.html` and assert:

```js
test('keeps Google Review as the only primary external action', () => {
  assert.equal((html.match(/class="review-primary"/g) ?? []).length, 1);
  assert.match(html, /data-action="google_review"[^>]*href="https:\/\/g\.page\/r\/CY7fuiiFPSvJEAE\/review"/);
  assert.match(html, /Share your honest experience\./);
});

test('publishes approved social proof without review manipulation', () => {
  for (const author of ['Ankita S.', 'Traveller', 'Jennylynn B.']) assert.match(html, new RegExp(author.replace('.', '\\.')));
  assert.doesNotMatch(html, /discount|reward|free gift|five-star review|copy this review|review like/i);
});

test('renders metadata, structured data and every approved action', () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.thebsclub\.ch\/review\/">/);
  assert.match(html, /"@type":\s*"CafeOrCoffeeShop"/);
  for (const action of ['google_review', 'google_listing', 'tripadvisor', 'instagram', 'facebook', 'menu', 'uber_eats', 'order_contact', 'whatsapp', 'phone', 'email', 'directions', 'website']) {
    assert.match(html, new RegExp(`data-action="${action}"`));
  }
});
```

Import `test`, `assert`, and `readFileSync` at the top, and define `html` from `../dist/index.html`.

- [ ] **Step 7: Run content tests and verify RED**

Run: `node --test tests/content.test.mjs`

Expected: FAIL with `ENOENT` for `dist/index.html`.

- [ ] **Step 8: Build the complete semantic template and deterministic renderer**

Create `review/src/index.template.html` with complete head metadata, canonical, Open Graph fields, consent defaults, `CafeOrCoffeeShop` JSON-LD, skip link, compact official-logo header, `<main>`, the approved headline/copy, exactly one `.review-primary`, three testimonial figures, read/follow grid, order/contact grid, business trust block, QR/share block, consent banner, and footer.

Every HTTP anchor must use this safe pattern:

```html
<a href="{{googleReview}}" class="review-primary" data-action="google_review" target="_blank" rel="noopener noreferrer">
  <span aria-hidden="true">★★★★★</span>
  <strong>Review us on Google</strong>
</a>
```

Native schemes use standard anchors:

```html
<a href="{{phone}}" data-action="phone">Call {{phoneDisplay}}</a>
<a href="{{email}}" data-action="email">Email us</a>
```

Create `review/scripts/build.mjs` with exports and exact failure behaviour:

```js
export const renderTemplate = (template, values) => template.replace(/\{\{([A-Za-z0-9]+)\}\}/g, (match, key) => {
  if (!(key in values)) throw new Error(`Missing template value: ${key}`);
  return String(values[key]);
});

export const assertNoPlaceholders = (html) => {
  const unresolved = html.match(/\{\{[^}]+\}\}/g);
  if (unresolved) throw new Error(`Unresolved template placeholders: ${unresolved.join(', ')}`);
};
```

The executable build must empty and recreate `dist/`, render all configured links/business/testimonial values, copy `src/review.css`, `src/review.mjs`, and root `../images/logo-official.png`, then write `dist/index.html`. QR generation is added in Task 4.

- [ ] **Step 9: Install, build, verify GREEN, and commit Task 2**

Run from `review/`:

```powershell
npm install
npm run build
node --test tests/config.test.mjs tests/content.test.mjs
Select-String -Path dist/index.html -Pattern '\{\{[^}]+\}\}'
```

Expected: all tests pass; placeholder search returns no matches.

Commit:

```powershell
git add -- review/package.json review/package-lock.json review/src/links.mjs review/src/index.template.html review/scripts/build.mjs review/tests/config.test.mjs review/tests/content.test.mjs review/dist/index.html review/dist/assets/logo-official.png
git commit -m "feat: establish review hub content"
```

---

### Task 3: Implement the Approved Review-First Visual System

**Files:**
- Create: `review/src/review.css`
- Create: `review/tests/style.test.mjs`
- Regenerate: `review/dist/review.css`
- Regenerate: `review/dist/index.html`

**Interfaces:**
- Consumes: semantic classes from Task 2.
- Produces: branded review-first hierarchy, 320 px safety, 48 px targets, first-viewport CTA, focus visibility, and reduced-motion behaviour.

- [ ] **Step 1: Write failing static style tests**

Create `review/tests/style.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../dist/review.css', import.meta.url), 'utf8');

test('uses the approved brand tokens and dominant gold review action', () => {
  for (const colour of ['#123f35', '#fff8e9', '#efcf62', '#ef725d', '#35564f']) assert.match(css.toLowerCase(), new RegExp(colour));
  assert.match(css, /\.review-primary\s*{[^}]*min-height:\s*72px[^}]*background:\s*var\(--gold\)/s);
});

test('supports mobile-first layout and accessible controls', () => {
  assert.match(css, /min-height:\s*48px/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(min-width:\s*760px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(css, /overflow-x:\s*(?:scroll|auto)/);
});
```

- [ ] **Step 2: Run style tests and verify RED**

Run after `npm run build` from `review/`:

`node --test tests/style.test.mjs`

Expected: FAIL because `dist/review.css` is absent or lacks the contract.

- [ ] **Step 3: Implement the complete mobile-first stylesheet**

Create `review/src/review.css` with these exact foundations:

```css
:root {
  --forest: #123f35;
  --cream: #fff8e9;
  --gold: #efcf62;
  --coral: #ef725d;
  --soft-ink: #35564f;
  --paper: #fffdf8;
  --line: rgba(18, 63, 53, 0.18);
  --display: "Fraunces", Georgia, serif;
  --body: "DM Sans", Arial, sans-serif;
}

* { box-sizing: border-box; }
html { color-scheme: light; scroll-behavior: smooth; }
body { margin: 0; overflow-x: clip; background: var(--cream); color: var(--forest); font-family: var(--body); }
a, button { min-height: 48px; }
:focus-visible { outline: 3px solid var(--coral); outline-offset: 4px; }
.review-shell { width: min(100% - 32px, 720px); margin-inline: auto; }
.review-primary { min-height: 72px; display: grid; place-items: center; background: var(--gold); color: var(--forest); border: 2px solid var(--forest); border-radius: 18px; box-shadow: 4px 4px 0 var(--forest); }
.link-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
@media (min-width: 760px) { .review-shell { width: min(100% - 64px, 920px); } .follow-grid { grid-template-columns: repeat(4, 1fr); } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; } }
```

Complete the selectors for header/logo, welcome typography, primary CTA stamp treatment, testimonials, follow grid, order/contact grid, trust block, QR card, consent banner, footer, hover/pressed states, and desktop centring. Keep the CTA and welcome copy above `800px` document height at 360 px width by limiting pre-CTA vertical padding to 48 px total.

- [ ] **Step 4: Build, verify GREEN, and inspect responsive screenshots**

Run:

```powershell
npm run build
node --test tests/style.test.mjs tests/content.test.mjs
```

Expected: all focused tests pass.

Preview on port 53901 and inspect 320×800, 360×800, 390×844, 768×1024, 1366×768, and 1440×1000. Confirm no horizontal overflow and primary CTA is fully visible in the first viewport at 360×800 and 390×844.

- [ ] **Step 5: Commit Task 3**

```powershell
git add -- review/src/review.css review/tests/style.test.mjs review/dist/review.css review/dist/index.html
git commit -m "feat: style review-first QR hub"
```

---

### Task 4: Add Permanent QR, Sharing, Consent, and Aggregate Tracking

**Files:**
- Create: `review/src/review.mjs`
- Create: `review/tests/app.test.mjs`
- Create: `review/tests/qr.test.mjs`
- Modify: `review/src/index.template.html`
- Modify: `review/scripts/build.mjs`
- Regenerate: `review/dist/index.html`
- Generate: `review/dist/review.mjs`
- Generate: `review/dist/assets/the-bs-club-review-qr.svg`
- Generate: `review/dist/assets/the-bs-club-review-qr.png`

**Interfaces:**
- Consumes: `REVIEW_LINKS.permanentShareUrl`, `data-action` attributes, and GA4 ID `G-JS838K2PY5`.
- Produces: `shareHub`, `createActionEvent`, consent key `thebsclub_review_analytics_consent`, and two QR assets encoding the same permanent URL.

- [ ] **Step 1: Write failing share and tracking tests**

Create `review/tests/app.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createActionEvent, shareHub } from '../src/review.mjs';

test('uses native share before clipboard fallback', async () => {
  const calls = [];
  const result = await shareHub({ navigatorObject: { share: async (payload) => calls.push(payload) }, clipboard: null, url: 'https://www.thebsclub.ch/review/' });
  assert.equal(result, 'shared');
  assert.equal(calls[0].url, 'https://www.thebsclub.ch/review/');
});

test('copies when native share is unavailable and returns manual when both fail', async () => {
  let copied = '';
  assert.equal(await shareHub({ navigatorObject: {}, clipboard: { writeText: async (value) => { copied = value; } }, url: 'https://www.thebsclub.ch/review/' }), 'copied');
  assert.equal(copied, 'https://www.thebsclub.ch/review/');
  assert.equal(await shareHub({ navigatorObject: {}, clipboard: null, url: 'https://www.thebsclub.ch/review/' }), 'manual');
});

test('creates an aggregate event without personal data', () => {
  assert.deepEqual(createActionEvent('google_review', 'in_store'), {
    event: 'review_hub_action',
    action_name: 'google_review',
    qr_source: 'in_store'
  });
});
```

- [ ] **Step 2: Run app tests and verify RED**

Run: `node --test tests/app.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/review.mjs`.

- [ ] **Step 3: Implement testable sharing and event helpers**

Create `review/src/review.mjs` with:

```js
export const shareHub = async ({ navigatorObject, clipboard, url }) => {
  if (typeof navigatorObject?.share === 'function') {
    await navigatorObject.share({ title: "The B's Club", url });
    return 'shared';
  }
  if (typeof clipboard?.writeText === 'function') {
    await clipboard.writeText(url);
    return 'copied';
  }
  return 'manual';
};

export const createActionEvent = (action, source) => ({
  event: 'review_hub_action',
  action_name: action,
  qr_source: source || 'direct'
});
```

Add a browser-only initializer guarded by `typeof document !== 'undefined'`. It must bind share/copy status to an `aria-live="polite"` element, read `utm_source` without forwarding it externally, reuse the root consent pattern with storage key `thebsclub_review_analytics_consent`, keep all advertising categories denied, and send `review_hub_action` only after analytics consent.

- [ ] **Step 4: Verify app GREEN and add QR build tests**

Run: `node --test tests/app.test.mjs`

Expected: 3 tests pass.

Create `review/tests/qr.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { REVIEW_LINKS } from '../src/links.mjs';

test('generates non-empty SVG and PNG from the permanent tracked URL', () => {
  const svg = readFileSync(new URL('../dist/assets/the-bs-club-review-qr.svg', import.meta.url), 'utf8');
  const png = statSync(new URL('../dist/assets/the-bs-club-review-qr.png', import.meta.url));
  assert.match(svg, new RegExp(`data-encoded-url="${REVIEW_LINKS.permanentShareUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  assert.ok(png.size > 5000);
});
```

- [ ] **Step 5: Run QR test and verify RED**

Run: `node --test tests/qr.test.mjs`

Expected: FAIL because QR assets do not exist.

- [ ] **Step 6: Generate both QR formats from one value**

Extend `review/scripts/build.mjs`:

```js
import QRCode from 'qrcode';

const qrOptions = { errorCorrectionLevel: 'H', margin: 4, width: 1200, color: { dark: '#123F35', light: '#FFF8E9' } };
const svg = await QRCode.toString(REVIEW_LINKS.permanentShareUrl, { ...qrOptions, type: 'svg' });
const taggedSvg = svg.replace('<svg ', `<svg data-encoded-url="${REVIEW_LINKS.permanentShareUrl}" `);
await writeFile(join(distAssets, 'the-bs-club-review-qr.svg'), taggedSvg);
await QRCode.toFile(join(distAssets, 'the-bs-club-review-qr.png'), REVIEW_LINKS.permanentShareUrl, qrOptions);
```

Copy `review.mjs` into `dist/`. Update the template with standard SVG/PNG download anchors, Share button, live status, visible fallback URL, consent banner, Privacy settings button, and consent-default bootstrap before the GA4 loader.

- [ ] **Step 7: Build, verify GREEN, and commit Task 4**

Run:

```powershell
npm run build
node --test tests/app.test.mjs tests/qr.test.mjs tests/content.test.mjs
Get-Item dist/assets/the-bs-club-review-qr.svg,dist/assets/the-bs-club-review-qr.png
```

Expected: all focused tests pass and both assets are non-empty.

Commit:

```powershell
git add -- review/src/review.mjs review/src/index.template.html review/scripts/build.mjs review/tests/app.test.mjs review/tests/qr.test.mjs review/dist/index.html review/dist/review.mjs review/dist/assets/the-bs-club-review-qr.svg review/dist/assets/the-bs-club-review-qr.png
git commit -m "feat: add review QR sharing and analytics"
```

---

### Task 5: Publish the Route, Document Maintenance, and Run Full QA

**Files:**
- Modify: `.github/workflows/deploy-pages.yml`
- Modify: `tests/deploy-pages.test.mjs`
- Modify: `sitemap.xml`
- Create: `review/README.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: generated `review/dist/` from Tasks 2–4.
- Produces: public `/review/` artifact, sitemap entry, reproducible maintenance instructions, and verified full-site release candidate.

- [ ] **Step 1: Write failing deployment assertions**

Extend `tests/deploy-pages.test.mjs`:

```js
test('builds and publishes the review hub at the owned review route', () => {
  assert.match(workflow, /working-directory:\s*review[\s\S]*npm ci[\s\S]*npm run build/);
  assert.match(workflow, /mkdir -p _site\/review/);
  assert.match(workflow, /cp -R review\/dist\/\. _site\/review\//);
});
```

Add a sitemap assertion to `review/tests/content.test.mjs` or a new focused root assertion:

```js
const sitemap = readFileSync(new URL('../../sitemap.xml', import.meta.url), 'utf8');
assert.match(sitemap, /<loc>https:\/\/www\.thebsclub\.ch\/review\/<\/loc>/);
```

- [ ] **Step 2: Run deployment tests and verify RED**

Run:

`node --test tests/deploy-pages.test.mjs review/tests/content.test.mjs`

Expected: failures for missing workflow build/copy steps and sitemap route.

- [ ] **Step 3: Update Pages workflow and sitemap**

Insert before the root test step:

```yaml
      - name: Install review hub dependencies
        working-directory: review
        run: npm ci

      - name: Build and test review hub
        working-directory: review
        run: |
          npm run build
          npm test
```

In `Prepare site`, add:

```yaml
          mkdir -p _site/review
          cp -R review/dist/. _site/review/
```

Add to `sitemap.xml`:

```xml
  <url>
    <loc>https://www.thebsclub.ch/review/</loc>
    <lastmod>2026-08-28</lastmod>
  </url>
```

- [ ] **Step 4: Write exact maintenance documentation**

Create `review/README.md` with these commands and facts:

```markdown
# Review & Contact Hub

## Local setup

Run `npm ci`, `npm run build`, `npm test`, and `npm run preview` inside `review/`.

## Permanent QR URL

`https://www.thebsclub.ch/review/?utm_source=in_store&utm_medium=qr&utm_campaign=review_hub`

Never point printed material directly at a third-party review URL. Update platform destinations only in `src/links.mjs`, rebuild, test, and deploy; the printed QR remains valid.

## Confirmed business details

Telephone and WhatsApp: `+41 76 774 20 27`. Open daily: `11:00–20:00`.
```

Add a root README link to `review/README.md` and document that production QR printing waits for HTTPS production verification plus iOS/Android scanning.

- [ ] **Step 5: Run complete automated verification**

From repository root:

```powershell
Push-Location review
npm ci
npm run build
npm test
Pop-Location
node --test tests/*.test.mjs campaign-2026-08/tests/*.test.mjs
git diff --check
```

Expected: every review-hub test and every existing repository test passes with zero failures; `git diff --check` produces no output.

- [ ] **Step 6: Perform browser and link QA**

Preview `review/dist/` and inspect:

- 320×800: no horizontal scroll.
- 360×800 and 390×844: headline and complete Google Review CTA visible in first viewport.
- 768×1024: follow grid expands cleanly.
- 1366×768 and 1440×1000: centred composition with disciplined whitespace.
- Keyboard Tab order and visible focus on every control.
- `prefers-reduced-motion` removes nonessential movement.
- Share returns `shared`, `copied`, or visible manual fallback.
- No console errors or missing local assets.
- Google Review opens the supplied direct review flow.
- Google listing, Tripadvisor, Instagram, Facebook, Uber Eats, menu, order/contact, WhatsApp, phone, email, directions, and website open the expected destinations.
- Consent defaults to denied and action events appear only after acceptance.

Do not claim iOS/Android QR verification until the deployed HTTPS URL is scanned on physical devices.

- [ ] **Step 7: Commit Task 5 and stop for owner review**

```powershell
git add -- .github/workflows/deploy-pages.yml tests/deploy-pages.test.mjs sitemap.xml review/README.md README.md review/dist
git commit -m "build: publish review contact hub route"
```

Provide the local preview URL, total passing-test counts, generated SVG/PNG paths, confirmed business details, and unresolved production-only checks. Do not push, deploy, print, or distribute the QR until the owner approves the rendered page.

