# Review Hub Compact Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the deployed review hub shorter and better balanced by fixing the hero line break, reducing testimonials to two, adding compact social shortcuts, removing the decorative B marker, and replacing the generated QR with the approved owner-supplied PNG.

**Architecture:** Preserve the existing semantic template/build pipeline. Keep links and testimonials centralized in `review/src/links.mjs`, bundle all social marks inline to avoid third-party requests, and treat the approved PNG as a checked source asset copied verbatim into `dist/` by the build.

**Tech Stack:** Semantic HTML5, CSS, vanilla JavaScript ES modules, Node built-in test runner, `pngjs` and `jsqr` as build-test dependencies, Playwright browser QA, existing GitHub Pages workflow.

## Global Constraints

- Approved spec: `docs/superpowers/specs/2026-08-28-review-hub-compact-layout-design.md`.
- Hero must render exactly `How was` / `your visit?` as two intentional lines.
- Social shortcut order is Instagram, Facebook, Tripadvisor, WhatsApp; each target is at least 48×48 CSS pixels.
- Testimonials are exactly Ankita S. (Google review) and Traveller (Tripadvisor).
- Remove only the decorative trust-block B; preserve the official header logo unchanged.
- Approved QR source is `C:/Users/v-bes/Downloads/The B Review QR.png` and decodes to `https://www.thebsclub.ch/review/`.
- Displayed and downloadable QR PNG must be byte-identical to the approved source.
- QR computed height must equal width within one pixel, with no 1,200-pixel mobile blank area.
- Google Review remains the only primary external CTA.
- Preserve phone `+41 76 774 20 27`, daily hours `11:00–20:00`, consent, aggregate analytics, external-link safety, focus visibility, and reduced motion.
- Preserve all unrelated untracked user image files.

---

### Task 1: Compact the Content and Add Social Shortcuts

**Files:**
- Modify: `review/tests/config.test.mjs`
- Modify: `review/tests/content.test.mjs`
- Modify: `review/src/links.mjs`
- Modify: `review/src/index.template.html`
- Regenerate: `review/dist/index.html`

**Interfaces:**
- Consumes: existing `REVIEW_LINKS` keys and `TESTIMONIALS` renderer.
- Produces: two testimonial records, `.headline-line` markup, and `.social-shortcuts` with four safe external anchors.

- [ ] **Step 1: Write failing configuration and semantic tests**

Update the testimonial expectation:

```js
test('contains only the two compact owner-approved testimonials', () => {
  assert.equal(TESTIMONIALS.length, 2);
  assert.deepEqual(TESTIMONIALS.map(({ author, platform }) => [author, platform]), [
    ['Ankita S.', 'Google review'],
    ['Traveller', 'Tripadvisor']
  ]);
});
```

Add semantic assertions:

```js
test('uses the approved two-line hero and compact social shortcut order', () => {
  assert.match(html, /<span class="headline-line">How was<\/span>\s*<em class="headline-line">your visit\?<\/em>/);
  const shortcuts = [...html.matchAll(/class="social-shortcut" data-action="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(shortcuts, ['instagram', 'facebook', 'tripadvisor', 'whatsapp']);
});

test('removes the decorative trust marker and third testimonial', () => {
  assert.doesNotMatch(html, /trust-marker|Jennylynn B\./);
  assert.equal((html.match(/class="testimonial-card/g) ?? []).length, 2);
});
```

- [ ] **Step 2: Run focused tests and verify RED**

Run from `review/`:

```powershell
node --test tests/config.test.mjs tests/content.test.mjs
```

Expected: failures report three testimonials, old headline markup, missing shortcut row, and the existing trust marker.

- [ ] **Step 3: Implement the minimal semantic changes**

Remove the Jennylynn record from `TESTIMONIALS`. Replace the hero heading with:

```html
<h1 id="welcome-title"><span class="headline-line">How was</span><em class="headline-line">your visit?</em></h1>
```

Immediately after the primary Google Review anchor, add:

```html
<nav class="social-shortcuts" aria-label="Follow and contact The B's Club">
  <a class="social-shortcut" data-action="instagram" href="{{instagram}}" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a>
  <a class="social-shortcut" data-action="facebook" href="{{facebook}}" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 8h4V3h-4c-4 0-6 2.4-6 6v3H4v5h4v7h5v-7h4l1-5h-5V9c0-.7.3-1 1-1Z"/></svg></a>
  <a class="social-shortcut" data-action="tripadvisor" href="{{tripadvisor}}" target="_blank" rel="noopener noreferrer" aria-label="Tripadvisor"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="7" cy="13" r="4"/><circle cx="17" cy="13" r="4"/><circle cx="7" cy="13" r="1.5"/><circle cx="17" cy="13" r="1.5"/><path d="M10.5 13h3M5 8c4-2 10-2 14 0M12 17l-2 3h4l-2-3Z"/></svg></a>
  <a class="social-shortcut" data-action="whatsapp" href="{{whatsapp}}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"/><path d="M9 8.5c.5 3 2 4.5 5 5"/></svg></a>
</nav>
```

Remove `<div class="trust-marker" aria-hidden="true">B</div>` from the trust block.

- [ ] **Step 4: Build and verify GREEN**

```powershell
npm run build
node --test tests/config.test.mjs tests/content.test.mjs
```

Expected: all focused tests pass.

- [ ] **Step 5: Commit Task 1**

```powershell
git add -- review/src/links.mjs review/src/index.template.html review/tests/config.test.mjs review/tests/content.test.mjs review/dist/index.html
git commit -m "feat: compact review proof and social links"
```

---

### Task 2: Replace Generated QR with the Approved Owner Asset

**Files:**
- Create: `review/src/assets/the-b-review-qr.png`
- Modify: `review/package.json`
- Regenerate: `review/package-lock.json`
- Modify: `review/scripts/build.mjs`
- Modify: `review/tests/qr.test.mjs`
- Modify: `review/src/index.template.html`
- Generate: `review/dist/assets/the-bs-club-review-qr.png`
- Remove: `review/dist/assets/the-bs-club-review-qr.svg`

**Interfaces:**
- Consumes: approved PNG whose SHA-256 is recorded by the failing test and URL decoded by `jsqr`.
- Produces: one byte-identical source/build PNG and one PNG download link.

- [ ] **Step 1: Copy the approved binary source and record its hash**

Copy `C:/Users/v-bes/Downloads/The B Review QR.png` to `review/src/assets/the-b-review-qr.png` without image processing. Run:

```powershell
Get-FileHash "C:/Users/v-bes/Downloads/The B Review QR.png" -Algorithm SHA256
Get-FileHash review/src/assets/the-b-review-qr.png -Algorithm SHA256
```

Expected: both hashes are identical.

- [ ] **Step 2: Write the failing QR contract**

Replace `review/tests/qr.test.mjs` with:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';

const source = readFileSync(new URL('../src/assets/the-b-review-qr.png', import.meta.url));
const built = readFileSync(new URL('../dist/assets/the-bs-club-review-qr.png', import.meta.url));
const hash = (buffer) => createHash('sha256').update(buffer).digest('hex');

test('copies the approved owner QR without changing a byte', () => {
  assert.equal(hash(built), hash(source));
});

test('approved owner QR opens the canonical review hub', () => {
  const png = PNG.sync.read(source);
  const result = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  assert.equal(result?.data, 'https://www.thebsclub.ch/review/');
});
```

- [ ] **Step 3: Run the QR test and verify RED**

Run `node --test tests/qr.test.mjs` before changing the build.

Expected: FAIL because the built PNG is still the generated green/cream QR and does not match the owner PNG.

- [ ] **Step 4: Replace generator dependency and build behaviour**

Set direct development dependencies:

```json
"devDependencies": {
  "jsqr": "1.4.0",
  "pngjs": "7.0.0"
}
```

Remove the `qrcode` import and `generateQrAssets()` from `build.mjs`. After creating `dist/assets`, copy the approved PNG:

```js
await copyFile(
  join(sourceRoot, 'assets', 'the-b-review-qr.png'),
  join(distAssets, 'the-bs-club-review-qr.png')
);
```

Change template image and downloads to PNG only:

```html
<img src="assets/the-bs-club-review-qr.png" alt="QR code for The B's Club review and contact page" width="300" height="300" loading="lazy">
<a href="assets/the-bs-club-review-qr.png" download>Download QR</a>
```

- [ ] **Step 5: Install, build, verify GREEN, and commit**

```powershell
npm install
npm run build
node --test tests/qr.test.mjs tests/content.test.mjs
git add -- review/package.json review/package-lock.json review/src/assets/the-b-review-qr.png review/scripts/build.mjs review/tests/qr.test.mjs review/src/index.template.html review/dist/index.html review/dist/assets/the-bs-club-review-qr.png review/dist/assets/the-bs-club-review-qr.svg
git commit -m "fix: use approved branded review QR"
```

Expected: both QR tests pass and the generated SVG is removed.

---

### Task 3: Tighten Responsive Layout, Verify, and Deploy

**Files:**
- Modify: `review/tests/style.test.mjs`
- Modify: `review/src/review.css`
- Regenerate: `review/dist/review.css`
- Regenerate: `review/dist/index.html`

**Interfaces:**
- Consumes: `.headline-line`, `.social-shortcuts`, two `.testimonial-card` nodes, marker-free `.trust-card`, and approved PNG.
- Produces: compact responsive layout and deployed `/review/` update.

- [ ] **Step 1: Write failing style assertions**

Add:

```js
test('keeps the refined hero, social targets and QR compact', () => {
  assert.match(css, /\.headline-line\s*\{[^}]*display:\s*block/s);
  assert.match(css, /\.social-shortcut\s*\{[^}]*width:\s*48px[^}]*min-height:\s*48px/s);
  assert.match(css, /\.qr-card\s*>\s*img\s*\{[^}]*height:\s*auto/s);
  assert.doesNotMatch(css, /\.trust-marker\s*\{/);
});
```

- [ ] **Step 2: Run style test and verify RED**

Run `node --test tests/style.test.mjs`.

Expected: FAIL for missing line blocks, social shortcut targets, `height: auto`, and remaining trust-marker CSS.

- [ ] **Step 3: Implement compact CSS**

Use these foundations and remove all `.trust-marker` rules:

```css
.headline-line { display: block; white-space: nowrap; }
.welcome h1 { font-size: clamp(48px, 14vw, 76px); }
.social-shortcuts { margin: 14px auto 0; display: flex; justify-content: center; gap: 8px; }
.social-shortcut { width: 48px; min-height: 48px; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 50%; background: var(--paper); }
.social-shortcut svg { width: 21px; height: 21px; fill: none; stroke: currentColor; stroke-width: 1.8; }
.social-shortcut:nth-child(2) svg { fill: currentColor; stroke: none; }
.testimonial-track { margin-top: 22px; }
.testimonial-card { padding: 18px 18px 16px; }
.testimonial-card blockquote { margin: 10px 0 14px; font-size: 17px; }
.trust-card { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 18px; }
.trust-card > a { grid-column: 2; }
.share-section { padding-block: 44px 54px; }
.qr-card { gap: 18px; padding: 18px; }
.qr-card > img { width: min(100%, 230px); height: auto; aspect-ratio: 1; object-fit: contain; }
```

At `min-width: 560px`, use two testimonial columns and a QR two-column layout. At `min-width: 760px`, keep the hero no larger than 76px and QR gap no larger than 30px.

- [ ] **Step 4: Build and run all automated verification**

```powershell
Push-Location review
npm ci
npm run build
npm test
Pop-Location
node --test tests/*.test.mjs campaign-2026-08/tests/*.test.mjs
git diff --check
```

Expected: review and repository suites pass with zero failures and no whitespace errors.

- [ ] **Step 5: Run browser QA**

At 320×800, 360×800, 390×844, 768×1024, 1366×768, and 1440×1000 assert:

- no horizontal overflow;
- hero contains exactly two rendered line boxes;
- full primary CTA is visible in the first viewport at 360×800 and 390×844;
- exactly four social shortcuts have 48×48 or larger bounding boxes;
- exactly two testimonial cards are present;
- `.trust-marker` is absent;
- QR height and width differ by no more than one pixel;
- no console or local-resource errors.

- [ ] **Step 6: Commit, push, and verify production**

```powershell
git add -- review/src/review.css review/tests/style.test.mjs review/dist/review.css review/dist/index.html
git commit -m "fix: tighten review hub responsive layout"
git push origin main
```

Watch the matching GitHub Pages run until it succeeds. Verify production `https://www.thebsclub.ch/review/`, CSS, JavaScript, logo, and approved PNG return HTTP 200, then repeat browser QA against production.
