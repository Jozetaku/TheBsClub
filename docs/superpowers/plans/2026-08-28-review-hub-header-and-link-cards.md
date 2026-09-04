# Review Hub Header and Link Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Review Hub header consistent with the home page, improve hero spacing and desktop wrapping, and replace oversized placeholder link tiles with compact icon cards.

**Architecture:** Keep the existing static HTML/CSS build and link data unchanged. Add source-independent contracts against `review/dist`, then update only the Review Hub template and stylesheet with accessible inline SVGs and responsive CSS overrides.

**Tech Stack:** Static HTML, CSS, inline SVG, Node.js test runner, Playwright visual QA.

## Global Constraints

- Social shortcuts use a 24px top margin, exactly 10px more than the current 14px.
- The hero remains two lines below 760px and becomes one line at 760px or wider.
- Remove the standalone circular Review Hub logo and do not add another decorative B mark.
- Keep a labelled route back to the main website.
- Desktop Keep in touch cards are compact horizontal rectangles in one four-column row.
- Instagram and Facebook use recognizable platform SVGs; Menu uses cutlery; Uber Eats uses a takeaway bag.
- Existing destinations, `data-action` values, copy, focus styles, external-link safety and reduced-motion behaviour remain unchanged.
- No new runtime dependencies.

---

### Task 1: Add regression contracts

**Files:**
- Modify: `review/tests/content.test.mjs`
- Modify: `review/tests/style.test.mjs`

**Interfaces:**
- Consumes: generated `review/dist/index.html` and `review/dist/review.css`.
- Produces: regression contracts for the header, SVG cards, spacing and responsive geometry.

- [ ] **Step 1: Write the failing content contracts**

Add assertions that `.hub-header` contains no `<img>`, has a safe `data-action="website"` route, every Keep in touch card contains `<svg aria-hidden="true">`, and the placeholder glyphs `◎`, `⌑` and standalone arrow spans are absent.

- [ ] **Step 2: Write the failing style contracts**

Assert `.social-shortcuts` uses `margin: 24px auto 0`; the base `.headline-line` is block; the 760px media query changes it to inline; and the desktop `.link-card` uses row alignment with `min-height` no greater than 112px.

- [ ] **Step 3: Verify RED**

Run from `review/`:

```powershell
npm run build
node --test tests/content.test.mjs tests/style.test.mjs
```

Expected: failures for the existing header image, 14px shortcut margin, block-only desktop headline, glyph icons and 172px desktop cards.

- [ ] **Step 4: Commit the failing tests**

```powershell
git add review/tests/content.test.mjs review/tests/style.test.mjs
git commit -m "test: specify review hub navigation and link cards"
```

### Task 2: Implement the approved header and cards

**Files:**
- Modify: `review/src/index.template.html`
- Modify: `review/src/review.css`

**Interfaces:**
- Consumes: existing template values `{{website}}`, `{{instagram}}`, `{{facebook}}`, `{{menu}}` and `{{uberEats}}`.
- Produces: the same destinations and analytics actions through refined accessible markup.

- [ ] **Step 1: Replace the Review Hub-specific logo header**

Use a logo-free slim header based on the main site's dark navigation treatment:

```html
<header class="hub-header">
  <div class="review-shell header-inner">
    <a class="home-wordmark" data-action="website" href="{{website}}" target="_blank" rel="noopener noreferrer">The B's Club</a>
    <p>Interlaken · Switzerland</p>
    <a class="home-link" data-action="website" href="{{website}}" target="_blank" rel="noopener noreferrer">Main website <span aria-hidden="true">↗</span></a>
  </div>
</header>
```

- [ ] **Step 2: Replace link-card glyphs with inline SVGs**

Keep each existing anchor and visible copy. Wrap the icon in `.link-card-icon`, the copy in `.link-card-copy`, and add `.link-card-arrow`. Reuse the proven Instagram and Facebook paths from the shortcut row; use line SVGs for cutlery and takeaway bag.

- [ ] **Step 3: Implement mobile-first spacing and geometry**

Set `.social-shortcuts { margin: 24px auto 0; }`. Keep `.headline-line { display: block; }`. Make cards compact, with a bounded icon wrapper and readable copy, while preserving two columns on normal mobile widths and 48px-plus targets.

- [ ] **Step 4: Implement the desktop overrides**

Inside `@media (min-width: 760px)`, use:

```css
.welcome h1 { white-space: nowrap; }
.headline-line { display: inline; }
.headline-line + .headline-line { margin-left: .16em; }
.link-card {
  min-height: 104px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
```

Keep the four-column `.follow-grid` and allow the copy wrapper to shrink without overflow.

- [ ] **Step 5: Verify GREEN**

Run from `review/`:

```powershell
npm run build
node --test tests/content.test.mjs tests/style.test.mjs
```

Expected: focused tests pass with zero failures.

- [ ] **Step 6: Commit the implementation**

```powershell
git add review/src/index.template.html review/src/review.css review/dist review/tests
git commit -m "feat: refine review hub header and link cards"
```

### Task 3: Verify and publish

**Files:**
- Verify: `review/dist/`
- Verify: root regression tests and production deployment.

**Interfaces:**
- Consumes: built Review Hub assets.
- Produces: a verified production page at `https://www.thebsclub.ch/review/`.

- [ ] **Step 1: Run a clean Review Hub build and suite**

```powershell
cd review
npm ci
npm run build
npm test
```

Expected: zero failures.

- [ ] **Step 2: Run root regressions**

```powershell
node --test tests/*.test.mjs campaign-2026-08/tests/*.test.mjs
```

Expected: zero failures.

- [ ] **Step 3: Run responsive visual QA**

Inspect 320px, 390px, 768px, 1366px and 1440px. Confirm no overflow, mobile two-line heading, desktop one-line heading, 24px shortcut separation, no header logo and compact rectangular cards.

- [ ] **Step 4: Push and verify production**

Push `main`, wait for GitHub Pages, then rerun layout and interaction QA against `https://www.thebsclub.ch/review/`. Confirm zero console errors and no failed local resources.
