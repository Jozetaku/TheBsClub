# The B's Club Social & Review Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-contained, mobile-first static microsite for `social.thebsclub.ch` that sends in-store QR visitors to an honest Google review flow first and to the restaurant's verified social, map, menu, ordering, telephone, and website destinations second.

**Architecture:** Keep the microsite completely inside `social-site/`, with source files in `social-site/src/`, a single link configuration module, a deterministic build script, generated static output in `social-site/dist/`, and focused Node tests in `social-site/tests/`. The build renders real anchor URLs into the final HTML so every destination still works without JavaScript, generates both QR formats from the same permanent URL, and copies only self-contained production assets. No main-site page, deployment workflow, DNS record, or custom-domain setting changes in this plan.

**Tech Stack:** Semantic HTML5, modern CSS, vanilla JavaScript ES modules, Node.js built-in test runner, `qrcode` as a build-only dependency, GA4 Consent Mode using the existing measurement ID `G-JS838K2PY5`.

## Global Constraints

- Public canonical URL: `https://social.thebsclub.ch/`.
- Permanent QR URL: `https://social.thebsclub.ch/?utm_source=in_store&utm_medium=qr&utm_campaign=social_hub`.
- Google Review is the only primary external CTA.
- Initial Google Review destination is the verified Google Maps fallback until the owner provides the official “Ask for reviews” URL.
- Do not offer incentives, filter guests by sentiment, or imply that only positive reviews are wanted.
- Use only verified Facebook, Instagram, Tripadvisor, Google Maps, menu, Uber Eats, website, and telephone destinations from the approved spec.
- Display `Jungfraustrasse 46, 3800 Interlaken` and `Open daily · 11:00–19:00`.
- Use the official mountain logo; do not use cup logos, Mini Makers, or ladders.
- All external links open safely with `target="_blank"` and `rel="noopener noreferrer"`; telephone links remain same-context.
- The page must work at 320 px without horizontal scrolling and keep the primary CTA within the first viewport at common mobile sizes.
- Advertising storage remains denied; no fingerprinting, cross-site pixels, or review-content collection.
- Do not edit `.github/workflows/deploy-pages.yml`, the root `index.html`, root `styles.css`, root scripts, DNS, or GitHub Pages settings.
- Stop after local preview and owner review. Do not deploy or print the production QR in this plan.

---

## File map

- `social-site/package.json` — local scripts and the build-only QR dependency.
- `social-site/src/links.mjs` — the single source of truth for all destinations and the permanent share URL.
- `social-site/src/index.template.html` — semantic page shell with build placeholders and progressive-enhancement hooks.
- `social-site/src/styles.css` — the microsite's isolated token system, layout, accessibility, and responsive styling.
- `social-site/src/app.js` — share/copy fallback, consent handling, and aggregate click tracking.
- `social-site/src/assets/logo-official.png` — self-contained copy of the approved mountain logo.
- `social-site/scripts/build.mjs` — renders configured anchors, copies production assets, and generates SVG/PNG QR files.
- `social-site/dist/` — generated static site to preview and eventually deploy independently.
- `social-site/tests/config.test.mjs` — verified destinations and swappable Google review behaviour.
- `social-site/tests/content.test.mjs` — hierarchy, copy, metadata, structured data, accessibility, and safe-link regression checks.
- `social-site/tests/qr-build.test.mjs` — proves SVG and PNG are generated from the same permanent URL.
- `social-site/tests/app.test.mjs` — share fallback, consent, and aggregate action-event behaviour.
- `social-site/tests/responsive.test.mjs` — static CSS assertions for breakpoints, focus, reduced motion, and minimum targets.
- `social-site/README.md` — local build, preview, Google review-link replacement, and future deployment notes.

---

### Task 1: Establish the verified configuration and static build boundary

**Files:**
- Create: `social-site/package.json`
- Create: `social-site/src/links.mjs`
- Create: `social-site/src/index.template.html`
- Create: `social-site/src/assets/logo-official.png`
- Create: `social-site/scripts/build.mjs`
- Create: `social-site/tests/config.test.mjs`
- Create: `social-site/tests/content.test.mjs`

**Interfaces:**
- Consumes: approved URLs and business information from `docs/superpowers/specs/2026-08-12-social-review-hub-design.md`; official logo from `images/logo-official.png`.
- Produces: named export `SOCIAL_LINKS`, named export `BUSINESS`, named export `renderTemplate(template, values)`, generated `social-site/dist/index.html`, and a copied `social-site/dist/assets/logo-official.png`.

- [ ] **Step 1: Create the package scripts and build dependency**

Create `social-site/package.json`:

```json
{
  "name": "the-bs-club-social-hub",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node scripts/build.mjs",
    "test": "node --test tests/*.test.mjs",
    "preview": "npx --yes serve dist -l 53901"
  },
  "devDependencies": {
    "qrcode": "^1.5.4"
  }
}
```

- [ ] **Step 2: Write the failing configuration tests**

Create `social-site/tests/config.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { BUSINESS, SOCIAL_LINKS } from '../src/links.mjs';

const verifiedMaps = 'https://maps.google.com/?q=Jungfraustrasse+46,+3800+Interlaken';
const permanentUrl = 'https://social.thebsclub.ch/?utm_source=in_store&utm_medium=qr&utm_campaign=social_hub';

test('publishes every required destination from one configuration', () => {
  assert.deepEqual(Object.keys(SOCIAL_LINKS).sort(), [
    'facebook', 'googleMaps', 'googleReview', 'instagram', 'menu',
    'permanentShareUrl', 'phone', 'tripadvisor', 'uberEats', 'website'
  ]);
  assert.equal(SOCIAL_LINKS.googleReview, verifiedMaps);
  assert.equal(SOCIAL_LINKS.googleMaps, verifiedMaps);
  assert.equal(SOCIAL_LINKS.permanentShareUrl, permanentUrl);
});

test('keeps confirmed business details aligned with the main website', () => {
  assert.equal(BUSINESS.name, "The B's Club");
  assert.equal(BUSINESS.address, 'Jungfraustrasse 46, 3800 Interlaken');
  assert.equal(BUSINESS.hours, 'Open daily · 11:00–19:00');
  assert.equal(BUSINESS.phoneDisplay, '+41 76 226 27 22');
});

test('allows the Google review destination to change without changing the QR URL', () => {
  const officialReviewUrl = 'https://g.page/r/example/review';
  const changed = { ...SOCIAL_LINKS, googleReview: officialReviewUrl };
  assert.equal(changed.googleReview, officialReviewUrl);
  assert.equal(changed.permanentShareUrl, permanentUrl);
});
```

- [ ] **Step 3: Run the configuration test and verify RED**

Run from `social-site/`:

`node --test tests/config.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/links.mjs`.

- [ ] **Step 4: Implement the single configuration module**

Create `social-site/src/links.mjs`:

```js
export const SOCIAL_LINKS = Object.freeze({
  googleReview: 'https://maps.google.com/?q=Jungfraustrasse+46,+3800+Interlaken',
  googleMaps: 'https://maps.google.com/?q=Jungfraustrasse+46,+3800+Interlaken',
  instagram: 'https://www.instagram.com/thebsclub25/',
  facebook: 'https://www.facebook.com/profile.php?id=100071619350267',
  tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g188081-d25277432-Reviews-Bublee_Tea_Interlaken-Interlaken_Bernese_Oberland_Canton_of_Bern.html',
  menu: 'https://www.thebsclub.ch/#food',
  uberEats: 'https://www.ubereats.com/ch/store/bublee-interlaken/Ik4zv95aWhWzt0lYSbjaMQ',
  website: 'https://www.thebsclub.ch/',
  phone: 'tel:+41762262722',
  permanentShareUrl: 'https://social.thebsclub.ch/?utm_source=in_store&utm_medium=qr&utm_campaign=social_hub'
});

export const BUSINESS = Object.freeze({
  name: "The B's Club",
  address: 'Jungfraustrasse 46, 3800 Interlaken',
  hours: 'Open daily · 11:00–19:00',
  phoneDisplay: '+41 76 226 27 22'
});
```

- [ ] **Step 5: Run the configuration test and verify GREEN**

Run: `node --test tests/config.test.mjs`

Expected: 3 tests pass, 0 fail.

- [ ] **Step 6: Write the failing generated-content test**

Create `social-site/tests/content.test.mjs` to read `dist/index.html` and assert:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

test('publishes focused metadata and structured business data', () => {
  assert.match(html, /<title>Review &amp; Follow The B's Club \| Interlaken<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/social\.thebsclub\.ch\/">/);
  assert.match(html, /Review The B's Club on Google, follow us on Instagram and Facebook/);
  assert.match(html, /"@type":\s*"CafeOrCoffeeShop"/);
  assert.match(html, /"sameAs":\s*\[/);
});

test('keeps Google Review as the only primary external action', () => {
  assert.equal((html.match(/class="review-primary"/g) ?? []).length, 1);
  assert.match(html, /class="review-primary"[^>]*data-action="google_review"[^>]*>[^<]*<span[^>]*>★★★★★<\/span>[^<]*Review us on Google/s);
  assert.doesNotMatch(html, /discount|reward|free gift|five-star review/i);
  assert.match(html, /Share your honest experience\./);
});

test('renders every configured link as a safe static anchor', () => {
  for (const action of ['google_review', 'google_maps', 'instagram', 'facebook', 'tripadvisor', 'menu', 'uber_eats', 'website']) {
    assert.match(html, new RegExp(`<a[^>]*data-action="${action}"[^>]*target="_blank"[^>]*rel="noopener noreferrer"`));
  }
  assert.match(html, /<a[^>]*data-action="phone"[^>]*href="tel:\+41762262722"/);
});

test('displays confirmed trust information and accessible landmarks', () => {
  assert.match(html, /<h1>Enjoyed your visit\?<\/h1>/);
  assert.match(html, /Jungfraustrasse 46, 3800 Interlaken/);
  assert.match(html, /Open daily · 11:00–19:00/);
  assert.match(html, /Thank you for supporting a local café\./);
  assert.match(html, /<main[^>]*id="main"/);
  assert.match(html, /<footer/);
});
```

- [ ] **Step 7: Run the content test and verify RED**

Run: `node --test tests/content.test.mjs`

Expected: FAIL with `ENOENT` for `dist/index.html`.

- [ ] **Step 8: Build the semantic HTML template**

Create `social-site/src/index.template.html` with:

- `<!doctype html>`, `lang="en"`, charset and viewport.
- Exact approved title, meta description, theme color, Open Graph tags, canonical URL, and `CafeOrCoffeeShop` JSON-LD.
- A skip link and `<main id="main">`.
- Centered official logo and `THE B'S CLUB · INTERLAKEN` label.
- `Enjoyed your visit?` heading and approved supporting copy.
- Exactly one `.review-primary` anchor using `{{googleReview}}` and `data-action="google_review"`.
- Four `.social-card` anchors using `{{googleMaps}}`, `{{instagram}}`, `{{facebook}}`, and `{{tripadvisor}}`.
- Four utility anchors using `{{menu}}`, `{{uberEats}}`, `{{website}}`, and `{{phone}}`.
- Inline accessible monochrome SVG icons with `aria-hidden="true"` for platform cards.
- QR card containing `assets/social-hub-qr.svg`, a visible `{{permanentShareUrl}}`, `Download QR`, and `Share this page` buttons.
- Trust footer with confirmed address, hours, thank-you copy, logo, copyright, and privacy-settings button.
- A noscript-safe layout where all destination anchors already contain real build-rendered URLs.
- `styles.css` and `app.js` loaded only from the microsite.

- [ ] **Step 9: Implement the deterministic build shell**

Create `social-site/scripts/build.mjs` with named exports:

```js
export const renderTemplate = (template, values) =>
  template.replace(/\{\{([a-zA-Z]+)\}\}/g, (match, key) => {
    if (!(key in values)) throw new Error(`Unknown template key: ${key}`);
    return String(values[key]);
  });
```

The executable section must:

1. Remove and recreate `dist/`.
2. Read `src/index.template.html`.
3. Render `SOCIAL_LINKS` plus `BUSINESS` values.
4. Assert no `{{...}}` placeholder remains.
5. Write `dist/index.html`.
6. Copy `src/styles.css`, `src/app.js`, and `src/assets/logo-official.png` to `dist/` paths.
7. Delegate QR generation to the function introduced in Task 3.

Copy `images/logo-official.png` byte-for-byte to `social-site/src/assets/logo-official.png`.

- [ ] **Step 10: Install the build dependency, add minimal placeholder assets, and verify GREEN**

Run from `social-site/`: `npm install`

Create temporary empty `src/styles.css` and `src/app.js` files only so the build boundary can run; Tasks 2 and 4 replace them through test-first implementation.

Run: `npm run build`

Run: `node --test tests/config.test.mjs tests/content.test.mjs`

Expected: all Task 1 tests pass and `dist/index.html` contains no template placeholders.

- [ ] **Step 11: Commit Task 1 only**

Run:

```powershell
git add -- social-site/package.json social-site/package-lock.json social-site/src/links.mjs social-site/src/index.template.html social-site/src/styles.css social-site/src/app.js social-site/src/assets/logo-official.png social-site/scripts/build.mjs social-site/tests/config.test.mjs social-site/tests/content.test.mjs social-site/dist/index.html social-site/dist/assets/logo-official.png
git commit -m "feat: establish social review hub"
```

Do not stage existing root-site modifications or unrelated untracked campaign assets.

---

### Task 2: Implement the focused visual system and responsive layout

**Files:**
- Modify: `social-site/src/styles.css`
- Create: `social-site/tests/responsive.test.mjs`
- Regenerate: `social-site/dist/styles.css`

**Interfaces:**
- Consumes: semantic class hooks from `src/index.template.html`.
- Produces: a self-contained mobile-first layout with `.review-primary`, `.social-grid`, `.social-card`, `.utility-links`, `.qr-card`, `.trust-footer`, accessible focus, and reduced-motion behaviour.

- [ ] **Step 1: Write the failing CSS behaviour tests**

Create `social-site/tests/responsive.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('uses the approved social hub palette and isolated typography', () => {
  for (const value of ['#123f35', '#fff8e9', '#efcf62', '#ef725d', '#35564f']) {
    assert.match(css.toLowerCase(), new RegExp(value));
  }
  assert.doesNotMatch(css, /fonts\.googleapis|@import\s+url/i);
});

test('makes Google Review the dominant action with accessible controls', () => {
  assert.match(css, /\.review-primary\s*\{[^}]*min-height:\s*72px[^}]*background:\s*var\(--gold\)/s);
  assert.match(css, /a:focus-visible|:focus-visible/);
  assert.match(css, /min-height:\s*48px/);
});

test('scales the social grid without horizontal overflow', () => {
  assert.match(css, /\.social-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s);
  assert.match(css, /@media\s*\(min-width:\s*760px\)[\s\S]*grid-template-columns:\s*repeat\(4,/);
  assert.match(css, /overflow-x:\s*(clip|hidden)/);
});

test('respects reduced motion', () => {
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});
```

- [ ] **Step 2: Run the responsive test and verify RED**

Run: `node --test tests/responsive.test.mjs`

Expected: FAIL because `src/styles.css` is empty.

- [ ] **Step 3: Implement the mobile-first visual system**

Replace `social-site/src/styles.css` with a scoped design that includes:

- CSS tokens `--forest: #123f35`, `--cream: #fff8e9`, `--gold: #efcf62`, `--coral: #ef725d`, `--soft-ink: #35564f`.
- System font stacks: a confident sans-serif display/body stack and Georgia for restrained accent text; no remote requests.
- Cream page background, forest text, narrow `min(100% - 32px, 720px)` content column, and generous vertical rhythm.
- Compact centered brand logo capped near 140 px optical width.
- Headline scale using `clamp()` and short measure.
- Gold `.review-primary` with a receipt-stamp double-border treatment, minimum 72 px height, strong forest text, and subtle press/hover response.
- A two-column `.social-grid` and four-column layout from 760 px.
- Monochrome inline icon styling and equal-height secondary cards.
- Quiet utility links and a framed QR card.
- Minimum 48 px targets for all buttons/links.
- Visible `:focus-visible` outline using coral.
- `overflow-x: clip`, break-safe long URL styling, and 320 px-safe spacing.
- `@media (prefers-reduced-motion: reduce)` that removes transitions and smooth scrolling.

- [ ] **Step 4: Build and verify GREEN**

Run:

```powershell
npm run build
node --test tests/responsive.test.mjs tests/content.test.mjs
```

Expected: all tests pass.

- [ ] **Step 5: Commit the visual system**

Run:

```powershell
git add -- social-site/src/styles.css social-site/tests/responsive.test.mjs social-site/dist/styles.css social-site/dist/index.html
git commit -m "feat: style mobile social review hub"
```

---

### Task 3: Generate permanent QR assets and implement sharing fallbacks

**Files:**
- Modify: `social-site/scripts/build.mjs`
- Modify: `social-site/src/app.js`
- Create: `social-site/tests/qr-build.test.mjs`
- Create: `social-site/tests/app.test.mjs`
- Generate: `social-site/dist/assets/social-hub-qr.svg`
- Generate: `social-site/dist/assets/social-hub-qr.png`

**Interfaces:**
- Consumes: `SOCIAL_LINKS.permanentShareUrl`.
- Produces: named export `generateQrAssets({ encoder, url, svgPath, pngPath })`, browser function `shareHub({ navigatorObject, clipboard, url })`, printable SVG, convenient PNG, download link, and native-share/copy feedback.

- [ ] **Step 1: Write the failing QR source-consistency test**

Create `social-site/tests/qr-build.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateQrAssets } from '../scripts/build.mjs';

test('generates SVG and PNG from the exact same permanent URL', async () => {
  const calls = [];
  const encoder = {
    toString: async (url, options) => {
      calls.push({ format: 'svg', url, options });
      return '<svg></svg>';
    },
    toFile: async (path, url, options) => calls.push({ format: 'png', path, url, options })
  };
  const url = 'https://social.thebsclub.ch/?utm_source=in_store&utm_medium=qr&utm_campaign=social_hub';
  await generateQrAssets({ encoder, url, svgPath: 'qr.svg', pngPath: 'qr.png', writeText: async () => {} });
  assert.deepEqual(calls.map(({ format, url: encoded }) => [format, encoded]), [['svg', url], ['png', url]]);
  assert.equal(calls[0].options.errorCorrectionLevel, 'H');
  assert.equal(calls[1].options.margin, 4);
});
```

- [ ] **Step 2: Run the QR test and verify RED**

Run: `node --test tests/qr-build.test.mjs`

Expected: FAIL because `generateQrAssets` is not exported.

- [ ] **Step 3: Implement deterministic QR generation**

In `social-site/scripts/build.mjs`, export:

```js
export async function generateQrAssets({ encoder, url, svgPath, pngPath, writeText }) {
  const baseOptions = { errorCorrectionLevel: 'H', margin: 4, color: { dark: '#123F35', light: '#FFF8E9' } };
  const svg = await encoder.toString(url, { ...baseOptions, type: 'svg' });
  await writeText(svgPath, svg, 'utf8');
  await encoder.toFile(pngPath, url, { ...baseOptions, type: 'png', width: 1200 });
}
```

Call it from the executable build section with the imported `qrcode` encoder, `SOCIAL_LINKS.permanentShareUrl`, and paths inside `dist/assets/`.

- [ ] **Step 4: Run the QR test and build, then verify GREEN**

Run:

```powershell
node --test tests/qr-build.test.mjs
npm run build
Get-Item dist/assets/social-hub-qr.svg,dist/assets/social-hub-qr.png
```

Expected: test passes and both non-empty QR files exist.

- [ ] **Step 5: Write failing share-fallback tests**

Create `social-site/tests/app.test.mjs` to import `shareHub` from `src/app.js` and test three paths:

```js
test('uses native share when available', async () => {
  const calls = [];
  const result = await shareHub({
    navigatorObject: { share: async (payload) => calls.push(payload) },
    clipboard: null,
    url: 'https://social.thebsclub.ch/'
  });
  assert.equal(result, 'shared');
  assert.equal(calls[0].url, 'https://social.thebsclub.ch/');
});

test('copies the permanent URL when native share is unavailable', async () => {
  let copied = '';
  const result = await shareHub({
    navigatorObject: {},
    clipboard: { writeText: async (value) => { copied = value; } },
    url: 'https://social.thebsclub.ch/'
  });
  assert.equal(result, 'copied');
  assert.equal(copied, 'https://social.thebsclub.ch/');
});

test('returns manual fallback when both APIs fail', async () => {
  const result = await shareHub({ navigatorObject: {}, clipboard: null, url: 'https://social.thebsclub.ch/' });
  assert.equal(result, 'manual');
});
```

- [ ] **Step 6: Run share tests and verify RED**

Run: `node --test tests/app.test.mjs`

Expected: FAIL because `shareHub` is not exported.

- [ ] **Step 7: Implement progressive sharing and feedback**

In `social-site/src/app.js`:

- Export `shareHub({ navigatorObject, clipboard, url })` with `shared`, `copied`, and `manual` results.
- In the browser-only initializer, read the permanent URL from the rendered `[data-permanent-url]` element.
- Bind the share button to `shareHub`.
- Set a polite `aria-live="polite"` status to `Share sheet opened`, `Link copied`, or `Copy this link: <url>`.
- Keep the QR download as a standard `download` anchor so it works without JavaScript.
- Do not mutate any destination anchor.

- [ ] **Step 8: Build and verify sharing GREEN**

Run:

```powershell
npm run build
node --test tests/qr-build.test.mjs tests/app.test.mjs tests/content.test.mjs
```

Expected: all tests pass.

- [ ] **Step 9: Commit QR and sharing**

Run:

```powershell
git add -- social-site/scripts/build.mjs social-site/src/app.js social-site/tests/qr-build.test.mjs social-site/tests/app.test.mjs social-site/dist/app.js social-site/dist/index.html social-site/dist/assets/social-hub-qr.svg social-site/dist/assets/social-hub-qr.png
git commit -m "feat: add permanent QR and sharing"
```

---

### Task 4: Add privacy-conscious analytics, documentation, and full QA

**Files:**
- Modify: `social-site/src/index.template.html`
- Modify: `social-site/src/app.js`
- Modify: `social-site/tests/app.test.mjs`
- Modify: `social-site/tests/content.test.mjs`
- Create: `social-site/README.md`
- Regenerate: `social-site/dist/index.html`
- Regenerate: `social-site/dist/app.js`

**Interfaces:**
- Consumes: `data-action` values rendered in Tasks 1 and 3 and GA4 measurement ID `G-JS838K2PY5`.
- Produces: consent key `thebsclub_social_analytics_consent`, exported `createActionEvent(action, source)`, aggregate `social_hub_action` events, privacy settings control, and owner-facing update/deployment documentation.

- [ ] **Step 1: Add failing consent and tracking tests**

Extend `social-site/tests/app.test.mjs` with tests that assert:

```js
test('creates an aggregate action event without personal data', () => {
  assert.deepEqual(createActionEvent('google_review', 'in_store'), {
    event: 'social_hub_action',
    action_name: 'google_review',
    qr_source: 'in_store'
  });
});
```

Add a small fake DOM/localStorage harness, matching the existing root test style, to prove:

- No stored choice shows the consent banner.
- Reject persists `denied` and keeps all analytics/ad categories denied.
- Accept persists `granted`, grants analytics only, and keeps every advertising category denied.
- Clicking a `[data-action="google_review"]` anchor queues exactly one `social_hub_action` event only when analytics consent is granted.

Extend `social-site/tests/content.test.mjs` to require:

- Consent defaults before the GA4 loader.
- Measurement ID `G-JS838K2PY5`.
- Accept, Reject, and Privacy settings controls.
- No Meta Pixel, TikTok Pixel, fingerprinting script, or advertising consent grant.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

`node --test tests/app.test.mjs tests/content.test.mjs`

Expected: FAIL because consent and tracking functions/markup are absent.

- [ ] **Step 3: Implement consent-first aggregate analytics**

Update `social-site/src/index.template.html` to:

- Define `window.dataLayer` and `window.gtag`.
- Set `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` to `denied` before loading GA4.
- Configure `G-JS838K2PY5` after defaults.
- Add a compact consent banner with `Accept analytics` and `Reject`.
- Add a footer `Privacy settings` button.

Update `social-site/src/app.js` to:

- Export `createActionEvent(action, source)` returning only `event`, `action_name`, and `qr_source`.
- Use storage key `thebsclub_social_analytics_consent`.
- Parse `utm_source` from the current URL and normalize absent/empty values to `direct`.
- Never forward QR query parameters to external destinations.
- Track actions only after stored or newly granted analytics consent.
- Keep `ad_storage`, `ad_user_data`, and `ad_personalization` denied for every consent update.
- Reopen the banner and focus the Accept button from Privacy settings.

- [ ] **Step 4: Run focused tests, build, and run the complete microsite suite**

Run:

```powershell
npm run build
npm test
```

Expected: all microsite tests pass with zero failures and no template placeholders remain.

- [ ] **Step 5: Write owner documentation**

Create `social-site/README.md` with exact sections:

1. `Local setup` — `npm install`, `npm test`, `npm run build`, `npm run preview`.
2. `Replace the Google review link` — change only `SOCIAL_LINKS.googleReview` in `src/links.mjs`, rebuild, test, and redeploy; do not regenerate the printed QR.
3. `Permanent QR URL` — record the exact tracked URL and explain why it must not change.
4. `Local preview` — `http://127.0.0.1:53901/?utm_source=in_store&utm_medium=qr&utm_campaign=social_hub`.
5. `Future independent deployment` — separate host/repository, `social.thebsclub.ch` custom domain, DNS CNAME, HTTPS verification, iOS/Android scan test, rollback; explicitly state that these steps require owner approval.
6. `Verified business details` — confirmed address, hours, phone, and links.

- [ ] **Step 6: Perform static and browser QA**

Run:

```powershell
npm run build
npm test
Select-String -Path dist/index.html -Pattern '\{\{[^}]+\}\}'
```

Expected: build succeeds, all tests pass, placeholder search returns no matches.

Start the preview on port 53901 and inspect:

- 320 × 800 — no horizontal scroll; primary CTA within first viewport.
- 390 × 844 — intended QR-phone layout.
- 768 × 1024 — four-card social row remains legible.
- 1440 × 1000 — centered compact composition, not an over-wide desktop page.
- Keyboard Tab order and visible focus.
- Share fallback status.
- No browser console errors or failed local assets.

Do not claim iOS/Android QR verification until the production HTTPS subdomain is live and scanned on real devices.

- [ ] **Step 7: Run the repository-wide regression suite**

From the repository worktree root run:

`node --test tests/*.test.mjs campaign-2026-08/tests/*.test.mjs`

Expected: all existing root-site tests still pass because the microsite is isolated.

- [ ] **Step 8: Commit Task 4 without unrelated files**

Run:

```powershell
git add -- social-site/src/index.template.html social-site/src/app.js social-site/tests/app.test.mjs social-site/tests/content.test.mjs social-site/README.md social-site/dist/index.html social-site/dist/app.js
git commit -m "feat: complete private social hub analytics"
```

- [ ] **Step 9: Stop for owner review**

Provide the local preview URL, test counts, QR asset paths, Google Review fallback status, and exact remaining production prerequisites. Do not push, deploy, change DNS, configure a custom domain, or print/distribute the QR.
