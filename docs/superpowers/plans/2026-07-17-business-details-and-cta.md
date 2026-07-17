# Business Details and CTA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize The B's Club's confirmed contact details and make directions the measurable primary conversion action.

**Architecture:** Keep the site dependency-free. Store content and CTA markup in `index.html`, attach directions analytics through the existing cache-versioned `script.js`, and validate both with Node's built-in test runner so no package installation is required.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Node.js `node:test`.

## Global Constraints

- Official website is `https://thebsclub.ch/` only.
- Opening hours are every day, `11:00–19:00`.
- Phone is `076 226 27 22` and `+41 76 226 27 22` internationally.
- `Get Directions` is primary; `View Menu` and `Order on Uber Eats` are secondary.
- Directions clicks emit `directions_click` and never block navigation.
- No unrelated copy, price, promotion, or visual redesign changes.

---

### Task 1: Business information and CTA hierarchy

**Files:**
- Create: `tests/site-content.test.mjs`
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: confirmed business facts and the existing menu-dialog anchor `#favourites`.
- Produces: direction links marked with `data-cta="directions"` and `data-cta-location`, plus the Uber Eats store URL `https://www.ubereats.com/ch/store/bublee-interlaken/Ik4zv95aWhWzt0lYSbjaMQ`.

- [ ] **Step 1: Write the failing content test**

Create `tests/site-content.test.mjs` with Node assertions that read `index.html` and verify: no `10:00` or old `7742027` digits remain; the canonical, Open Graph, and JSON-LD URLs use `https://thebsclub.ch/`; `11:00–19:00` and `tel:+41762262722` exist; `Get Directions` is the first hero and mobile action; `View Menu` and the exact Uber Eats listing exist; and at least five map links have `data-cta="directions"`.

- [ ] **Step 2: Run the content test and verify RED**

Run: `node --test tests/site-content.test.mjs`

Expected: FAIL because `10:00`, the old visible telephone, the `www` URL, and menu-first hero/mobile CTA are still present.

- [ ] **Step 3: Implement the minimum HTML and CSS changes**

In `index.html`:

- add `<link rel="canonical" href="https://thebsclub.ch/">`;
- change meta, Open Graph, and JSON-LD URLs to `https://thebsclub.ch/`;
- set every daily hour to `11:00–19:00` and JSON-LD `opens` to `11:00`;
- set visible phone to `+41 76 226 27 22` and both telephone links to `tel:+41762262722`;
- mark header, hero, visit, map-card, and mobile map anchors with `data-cta="directions"` and unique `data-cta-location` values;
- make hero actions `Get Directions`, `View Menu`, and `Order on Uber Eats` in that order;
- make visit actions use the same hierarchy;
- make mobile actions `Directions`, `Menu`, and `Uber Eats`, with directions first;
- load `<script src="analytics.js" defer></script>` before `script.js`.

In `styles.css`, allow hero and visit action rows to wrap, and change the mobile bar to `grid-template-columns: 1.3fr .8fr 1fr`; style the first mobile action as the filled primary button instead of the last.

- [ ] **Step 4: Run the content test and verify GREEN**

Run: `node --test tests/site-content.test.mjs`

Expected: all content tests PASS.

- [ ] **Step 5: Commit the content change**

Run:

```bash
git add tests/site-content.test.mjs index.html styles.css
git commit -m "Sync business details and CTA hierarchy"
```

### Task 2: Directions click analytics

**Files:**
- Create: `analytics.js`
- Create: `tests/directions-tracking.test.mjs`

**Interfaces:**
- Consumes: anchors with `data-cta="directions"` and optional `data-cta-location`.
- Produces: `window.dataLayer` entry `{ event: 'directions_click', cta_location: string }`; calls `window.gtag('event', 'directions_click', { cta_location })` when available.

- [ ] **Step 1: Write the failing behavioral test**

Create `tests/directions-tracking.test.mjs`. Use `node:vm` to execute `script.js` with fake direction-link elements, capture their direct click handlers, and assert the exact `dataLayer` entry. Add cases for a missing location (`unknown`), multiple direction links, and an available `gtag` function.

- [ ] **Step 2: Run the analytics test and verify RED**

Run: `node --test tests/directions-tracking.test.mjs`

Expected: FAIL because `script.js` does not yet attach tracking handlers to direction links.

- [ ] **Step 3: Implement delegated tracking**

In `script.js`, select every `[data-cta="directions"]` link, attach a direct click handler, read `link.dataset.ctaLocation || 'unknown'`, initialize `window.dataLayer`, push `{ event: 'directions_click', cta_location: location }`, and call `window.gtag('event', 'directions_click', { cta_location: location })` only when `typeof window.gtag === 'function'`. Load the script with a release version query so browsers receive the new code.

- [ ] **Step 4: Run all tests and verify GREEN**

Run: `node --test tests/*.test.mjs`

Expected: all content and analytics tests PASS with no warnings.

- [ ] **Step 5: Commit analytics**

Run:

```bash
git add script.js index.html tests/directions-tracking.test.mjs
git commit -m "Track directions CTA clicks"
```

### Task 3: Mobile and release validation

**Files:**
- Modify only if validation exposes a defect: `index.html`, `styles.css`, `analytics.js`, or their matching tests.

**Interfaces:**
- Consumes: the completed static site.
- Produces: verified desktop/mobile behavior and a draft pull request.

- [ ] **Step 1: Run static verification**

Run: `node --test tests/*.test.mjs`, `git diff --check`, and `git status -sb`.

Expected: tests PASS, no whitespace errors, and only intended branch commits are present.

- [ ] **Step 2: Serve the site locally**

Run: `python -m http.server 8000` from the repository root and open `http://127.0.0.1:8000/`.

- [ ] **Step 3: Validate mobile behavior**

At a mobile viewport near 390×844, confirm the sticky bar shows Directions first and visually primary, Menu opens the existing dialog, Uber Eats has a valid external destination, the directions link opens Maps, and the bar does not cover actionable page content. Confirm no console errors.

- [ ] **Step 4: Validate tracking**

Click a direction CTA in local preview and confirm `window.dataLayer.at(-1)` equals an object with `event: 'directions_click'` and the expected `cta_location`.

- [ ] **Step 5: Push and open a draft PR**

Push `agent/sync-business-details`, target `main`, and open a draft PR titled `Sync The B's Club business details and CTAs` summarizing the corrected facts, CTA hierarchy, tracking, and validation.
