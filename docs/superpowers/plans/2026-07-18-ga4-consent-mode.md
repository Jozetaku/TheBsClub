# GA4 Consent Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect `thebsclub.ch` to GA4 Measurement ID `G-JS838K2PY5` using advanced Consent Mode v2, a compact consent bar, and verified `directions_click` events.

**Architecture:** An inline bootstrap in `index.html` establishes denied consent before loading `gtag.js`. A small controller inside the existing `script.js` owns visitor preference state and banner behavior, while the existing directions handler remains the only custom event producer. Static markup and CSS follow the current single-page site structure without adding dependencies.

**Tech Stack:** Static HTML5, CSS, browser JavaScript, direct `gtag.js`, Node.js built-in test runner, `node:vm` test harness.

## Global Constraints

- GA4 Measurement ID is exactly `G-JS838K2PY5`.
- Web stream URL is exactly `https://thebsclub.ch`.
- Default `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` are all `denied` before `gtag.js` loads.
- Accepting grants only `analytics_storage`; all advertising consent remains denied.
- Rejecting keeps all consent categories denied.
- The custom event contains only `event: 'directions_click'` and `cta_location`.
- No new runtime dependency or consent management vendor is introduced.
- The consent bar must not cover the mobile Directions, Menu, or Uber Eats actions at 390 x 844.

---

## File map

- `index.html`: Google tag bootstrap, consent bar markup, footer Privacy settings button, and cache-busted site script reference.
- `script.js`: consent preference controller plus existing `directions_click` behavior.
- `styles.css`: consent bar and footer settings styles, including mobile bottom-bar clearance.
- `tests/consent-mode.test.mjs`: bootstrap order, consent state, persistence, and reopen behavior.
- `tests/site-content.test.mjs`: static copy and required consent controls.
- `tests/directions-tracking.test.mjs`: regression coverage for exactly one GA4 event call per directions click.

### Task 1: Bootstrap GA4 with denied Consent Mode defaults

**Files:**
- Create: `tests/consent-mode.test.mjs`
- Modify: `index.html` inside `<head>` before the deferred `script.js` include

**Interfaces:**
- Consumes: GA4 Measurement ID `G-JS838K2PY5`.
- Produces: `window.dataLayer`, `window.gtag(...args)`, and denied Consent Mode v2 defaults available before the external Google tag loads.

- [x] **Step 1: Write the failing bootstrap tests**

Create `tests/consent-mode.test.mjs` with these assertions:

```js
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
```

- [x] **Step 2: Run the bootstrap tests and verify RED**

Run:

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\consent-mode.test.mjs
```

Expected: FAIL because the consent bootstrap and Google tag loader do not exist.

- [x] **Step 3: Add the minimal bootstrap and loader**

Insert before the existing deferred `script.js` include in `index.html`:

```html
  <script data-google-consent-bootstrap>
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500
    });
    window.gtag('js', new Date());
    window.gtag('config', 'G-JS838K2PY5');
  </script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-JS838K2PY5"></script>
```

- [x] **Step 4: Run the bootstrap tests and verify GREEN**

Run the Task 1 command again.

Expected: 3 tests pass, 0 fail.

- [x] **Step 5: Commit the bootstrap**

```powershell
git add index.html tests/consent-mode.test.mjs
git commit -m "Bootstrap GA4 consent mode"
```

### Task 2: Add consent controls and preference behavior

**Files:**
- Modify: `index.html` before the menu dialog markup and inside `.footer-bottom`
- Modify: `script.js` before the existing directions tracking block
- Modify: `tests/consent-mode.test.mjs`
- Modify: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: `window.gtag`, `window.localStorage`, `#analytics-consent`, `[data-consent-choice]`, and `#privacy-settings`.
- Produces: stored key `thebsclub_analytics_consent` with value `granted` or `denied`; consent update calls; visible or hidden consent bar state.

- [x] **Step 1: Add failing static control tests**

Append to `tests/site-content.test.mjs`:

```js
test('offers analytics consent and persistent privacy settings', () => {
  assert.match(html, /id="analytics-consent"/);
  assert.match(html, /data-consent-choice="granted"[^>]*>Accept Analytics</);
  assert.match(html, /data-consent-choice="denied"[^>]*>Reject</);
  assert.match(html, /id="privacy-settings"[^>]*>Privacy settings</);
});
```

- [x] **Step 2: Add failing consent-controller tests**

Append a real `script.js` harness to `tests/consent-mode.test.mjs`:

```js
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
    gtag: (...args) => calls.push(args),
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
```

- [x] **Step 3: Run the new tests and verify RED**

Run:

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\consent-mode.test.mjs tests\site-content.test.mjs
```

Expected: FAIL because the consent markup and controller do not exist.

- [x] **Step 4: Add consent markup**

Add this button inside `.footer-bottom`:

```html
<button class="footer-privacy" id="privacy-settings" type="button">Privacy settings</button>
```

Add this markup before `.dialog-backdrop`:

```html
<section class="consent-banner" id="analytics-consent" aria-label="Analytics privacy choices" hidden>
  <div>
    <strong>Help us improve your visit</strong>
    <p>We use privacy-conscious analytics to understand visits and direction requests. Advertising cookies stay off.</p>
  </div>
  <div class="consent-actions">
    <button class="button button-small" type="button" data-consent-choice="granted">Accept Analytics</button>
    <button class="consent-reject" type="button" data-consent-choice="denied">Reject</button>
  </div>
</section>
```

- [x] **Step 5: Add the minimal controller**

Insert before the directions tracking block in `script.js`:

```js
  const consentKey = 'thebsclub_analytics_consent';
  const consentBanner = document.querySelector('#analytics-consent');
  const consentButtons = document.querySelectorAll('[data-consent-choice]');
  const privacySettings = document.querySelector('#privacy-settings');

  const readConsent = () => {
    try {
      const value = window.localStorage?.getItem(consentKey);
      return value === 'granted' || value === 'denied' ? value : null;
    } catch {
      return null;
    }
  };

  const applyConsent = (choice, persist = true) => {
    const analyticsStorage = choice === 'granted' ? 'granted' : 'denied';
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: analyticsStorage,
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
    if (persist) {
      try {
        window.localStorage?.setItem(consentKey, analyticsStorage);
      } catch {
        // Keep the in-page choice even when storage is unavailable.
      }
    }
    if (consentBanner) consentBanner.hidden = true;
  };

  const storedConsent = readConsent();
  if (storedConsent) {
    applyConsent(storedConsent, false);
  } else if (consentBanner) {
    consentBanner.hidden = false;
  }

  consentButtons.forEach((button) => {
    button.addEventListener('click', () => applyConsent(button.dataset.consentChoice));
  });

  privacySettings?.addEventListener('click', () => {
    if (consentBanner) consentBanner.hidden = false;
    consentButtons[0]?.focus();
  });
```

- [x] **Step 6: Run consent and content tests and verify GREEN**

Run the Task 2 command again.

Expected: all consent-mode and site-content tests pass.

- [x] **Step 7: Commit the consent behavior**

```powershell
git add index.html script.js tests/consent-mode.test.mjs tests/site-content.test.mjs
git commit -m "Add analytics consent controls"
```

### Task 3: Style the consent bar and protect mobile CTAs

**Files:**
- Modify: `styles.css`
- Modify: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: `.consent-banner`, `.consent-actions`, `.consent-reject`, and `.footer-privacy` markup from Task 2.
- Produces: desktop and mobile layouts with the consent bar above the existing `.mobile-actions` bar.

- [x] **Step 1: Add a failing mobile-clearance test**

Add this read beside the existing `html` and `readme` constants in `tests/site-content.test.mjs`:

```js
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
```

Then append:

```js
test('keeps the consent bar above mobile quick actions', () => {
  assert.match(css, /\.consent-banner\s*\{[\s\S]*position:\s*fixed/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*\.consent-banner\s*\{[\s\S]*bottom:\s*calc\(78px\s*\+\s*env\(safe-area-inset-bottom\)\)/);
});
```

- [x] **Step 2: Run the static test and verify RED**

Run:

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\site-content.test.mjs
```

Expected: FAIL because consent styles do not exist.

- [x] **Step 3: Add desktop and mobile consent styles**

Append to `styles.css`:

```css
.consent-banner {
  position: fixed;
  z-index: 1200;
  right: 24px;
  bottom: 24px;
  left: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  max-width: 920px;
  margin: 0 auto;
  padding: 18px 20px;
  color: #fff8ea;
  background: #123f35;
  border: 1px solid rgba(255, 248, 234, 0.24);
  border-radius: 18px;
  box-shadow: 0 18px 48px rgba(10, 32, 27, 0.24);
}

.consent-banner[hidden] { display: none; }
.consent-banner p { margin: 4px 0 0; max-width: 62ch; }
.consent-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.consent-reject,
.footer-privacy {
  padding: 0;
  color: inherit;
  background: transparent;
  border: 0;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}
.footer-privacy { color: currentColor; font: inherit; }

@media (max-width: 760px) {
  .consent-banner {
    right: 12px;
    bottom: calc(78px + env(safe-area-inset-bottom));
    left: 12px;
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
    padding: 16px;
  }
  .consent-actions { justify-content: space-between; }
}
```

- [x] **Step 4: Run the static test and verify GREEN**

Run the Task 3 command again.

Expected: all site-content tests pass.

- [x] **Step 5: Commit the consent styles**

```powershell
git add styles.css tests/site-content.test.mjs
git commit -m "Style analytics consent banner"
```

### Task 4: Verify event integrity, mobile behavior, and publish readiness

**Files:**
- Modify: `tests/directions-tracking.test.mjs`
- Modify: `index.html` script query version only
- Modify: `docs/superpowers/plans/2026-07-18-ga4-consent-mode.md` checkboxes as work completes

**Interfaces:**
- Consumes: consent bootstrap, consent controller, and the existing five directions CTA locations.
- Produces: a regression-checked branch ready for GitHub review and production deployment.

- [x] **Step 1: Add a failing exact-once event assertion**

Replace the existing gtag forwarding test with:

```js
test('forwards exactly one directions event to gtag', () => {
  const calls = [];
  const { clicks } = loadTracking({ gtag: (...args) => calls.push(args), locations: ['mobile'] });
  clicks[0]();
  const directionsEvents = calls.filter(([command, event]) => command === 'event' && event === 'directions_click');
  assert.deepEqual(normalize(directionsEvents), [
    ['event', 'directions_click', { cta_location: 'mobile' }]
  ]);
});
```

- [x] **Step 2: Temporarily duplicate the gtag event call and verify RED**

In a temporary working copy, duplicate the existing `window.gtag('event', 'directions_click', ...)` call and run:

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\directions-tracking.test.mjs
```

Expected: FAIL because two matching GA4 event calls are observed. Remove the temporary duplicate immediately.

- [x] **Step 3: Run the exact-once test against the real implementation and verify GREEN**

Run the Task 4 test command again.

Expected: all directions tracking tests pass with one GA4 event call.

- [x] **Step 4: Bump the cache-busting script version**

Change the deferred site script reference in `index.html` to:

```html
<script src="script.js?v=20260718-1" defer></script>
```

Update the existing `marks every directions surface for delegated tracking` assertion in `tests/site-content.test.mjs` to:

```js
assert.match(html, /<script src="script\.js\?v=20260718-1" defer><\/script>/);
```

- [x] **Step 5: Run the full automated suite**

Run:

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\*.test.mjs
```

Expected: every test passes with 0 failures.

- [ ] **Step 6: Test locally in a desktop browser**

Serve the repository root and verify:

1. A first visit shows the consent bar.
2. Reject hides the bar and sends a consent update with every category denied.
3. Privacy settings reopens the bar.
4. Accept hides the bar and grants only `analytics_storage`.
5. Clicking each Directions CTA produces one `directions_click` with `header`, `hero`, `visit`, `map_card`, or `mobile`.
6. Google Maps navigation is not delayed or blocked.
7. The console has no new errors.

- [ ] **Step 7: Test at 390 x 844**

Verify the consent bar sits above `.mobile-actions`, both consent buttons are reachable, and Directions, Menu, and Uber Eats remain visible and clickable.

- [ ] **Step 8: Commit the final test and cache version**

```powershell
git add index.html tests/directions-tracking.test.mjs docs/superpowers/plans/2026-07-18-ga4-consent-mode.md
git commit -m "Verify GA4 consent and directions tracking"
```

- [ ] **Step 9: Publish for review**

Push `agent/add-ga4-consent`, open a pull request to `main`, run GitHub checks, and review the complete diff before merge.

- [ ] **Step 10: Merge and verify production**

After checks pass, merge the pull request, wait for GitHub Pages deployment, then verify `https://thebsclub.ch` on desktop and 390 x 844 mobile. In Google Analytics, confirm the web stream shows tag activity and that `directions_click` appears in DebugView or Realtime when consent is granted.
