# Autumn Interlaken Desktop Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the bilingual Autumn Interlaken article remain visually balanced on common laptop and desktop viewports without changing its approved brand identity or content.

**Architecture:** Keep the current static HTML and shared article stylesheet. Move the two-column journey layout and sticky map into one width-and-height media condition, size the map from viewport height, and use symmetric destination-number tracks. Apply a second, independent spacing pass to the existing desktop values, then verify the same CSS against both localized pages.

**Tech Stack:** Semantic HTML, CSS media queries, Node.js built-in test runner, Codex in-app browser, GitHub Pages.

## Global Constraints

- Use the two-column journey composition only at `min-width: 1200px` and `min-height: 700px`.
- Use `28px` top and `24px` bottom padding on the compact desktop map rail.
- Use an `18px` heading-to-map gap and `clamp(340px, 52vh, 500px)` map height.
- Use `clamp(76px, 8vh, 94px)` as the sticky rail offset.
- Use equal `96px` tracks and `80px` type for odd and even destination numbers in the two-column layout so the widest Fraunces pair remains inside its track.
- Use `86px` vertical padding for two-column desktop destination sections.
- Use `clamp(68px, 7vw, 104px)` top and `clamp(74px, 7.5vw, 112px)` bottom desktop hero padding.
- Use `clamp(76px, 7vw, 104px)` shared article-section padding.
- Use a `44px` Travel Packs heading gap and `26px` FAQ row padding.
- Preserve `/images/logo-official.png`, the boba cursor, map artwork, hotspots, colours, fonts, copy, SEO metadata, analytics, CTAs, and language switch.
- Preserve the existing tablet/mobile rules at `820px` and below.
- Do not stage or modify the pre-existing untracked campaign and story images.

---

### Task 1: Adaptive Journey Rail and Symmetric Destination Numbers

**Files:**
- Modify: `tests/autumn-article-content.test.mjs:142-198`
- Modify: `articles/autumn-interlaken/article.css:636-679`

**Interfaces:**
- Consumes: the existing `.journey-layout`, `.map-section`, `.article-map`, `.destination-grid`, and alternating destination markup shared by both locales.
- Produces: one responsive CSS contract for the two-column rail and equal `96px` number tracks with `80px` number type, consumed automatically by the English and German pages.

- [ ] **Step 1: Replace the old desktop rail assertions with the failing adaptive-rail contract**

In `tests/autumn-article-content.test.mjs`, replace the current `96px` even-number assertion at lines 157–161 and the `min-height: 980px` assertion at lines 177–181 with:

```js
  assert.doesNotMatch(
    css,
    /min-height:\s*980px/,
    'the old tall-monitor-only sticky threshold must be removed'
  );
  assert.match(
    css,
    /@media\s*\(min-width:\s*1200px\)\s*and\s*\(min-height:\s*700px\)[\s\S]*?\.journey-layout\s*{[^}]*grid-template-columns:[^}]*}[\s\S]*?\.map-section\s*{[^}]*position:\s*sticky;[^}]*top:\s*clamp\(76px,\s*8vh,\s*94px\);[^}]*padding:\s*28px\s+0\s+24px;[^}]*}[\s\S]*?\.article-map\s*{[^}]*height:\s*clamp\(340px,\s*52vh,\s*500px\);[^}]*aspect-ratio:\s*auto/s,
    'the two-column layout and viewport-sized sticky rail must share one safe media condition'
  );
  assert.match(
    css,
    /@media\s*\(min-width:\s*1200px\)\s*and\s*\(min-height:\s*700px\)[\s\S]*?\.destination-grid\s*{[^}]*grid-template-columns:\s*96px\s+minmax\(0,\s*1fr\);[^}]*}[\s\S]*?\.destination:nth-child\(even\) \.destination-grid\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+96px;[^}]*}[\s\S]*?\.destination-number\s*{[^}]*font-size:\s*80px/s,
    'desktop destinations must use symmetric tracks sized for every 80px numeral pair'
  );
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
node --test tests/autumn-article-content.test.mjs
```

Expected: FAIL in `article CSS fulfils the responsive editorial and accessibility contract` because the CSS still contains `min-height: 980px`, the desktop rules are split across two media conditions, and the number tracks are `62px`/`96px`.

- [ ] **Step 3: Replace the existing desktop media rules with the adaptive rail**

In `articles/autumn-interlaken/article.css`, replace the complete current `@media (min-width: 1200px)` and `@media (min-width: 1200px) and (min-height: 980px)` blocks with:

```css
@media (min-width: 1200px) and (min-height: 700px) {
  .journey-layout {
    grid-template-columns: minmax(650px, 1.18fr) minmax(430px, 0.82fr);
    gap: clamp(42px, 4vw, 72px);
  }

  .journey-layout .container {
    width: 100%;
  }

  .map-section {
    position: sticky;
    top: clamp(76px, 8vh, 94px);
    align-self: start;
    padding: 28px 0 24px;
  }

  .map-section .section-heading {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 18px;
  }

  .map-section .section-heading h2 {
    font-size: clamp(42px, 4vw, 58px);
  }

  .map-section .section-heading > p {
    max-width: 590px;
  }

  .article-map {
    height: clamp(340px, 52vh, 500px);
    aspect-ratio: auto;
  }

  .destination.article-section {
    padding-block: 86px;
  }

  .destination-grid {
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 30px;
  }

  .destination:nth-child(even) .destination-grid {
    grid-template-columns: minmax(0, 1fr) 96px;
  }

  .destination-number {
    font-size: 80px;
  }

  .destination-copy h2 {
    font-size: clamp(34px, 3.15vw, 49px);
  }
}
```

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```powershell
node --test tests/autumn-article-content.test.mjs
node --test tests/responsive-design.test.mjs
```

Expected: both commands PASS with zero failed tests.

- [ ] **Step 5: Inspect the focused diff and commit Task 1**

Run:

```powershell
git diff --check -- articles/autumn-interlaken/article.css tests/autumn-article-content.test.mjs
git diff -- articles/autumn-interlaken/article.css tests/autumn-article-content.test.mjs
git add -- articles/autumn-interlaken/article.css tests/autumn-article-content.test.mjs
git commit -m "Fix autumn article adaptive desktop rail"
```

Expected: `git diff --check` produces no output; the commit contains only the shared article CSS and its content test.

### Task 2: Desktop Page-Spacing Rhythm

**Files:**
- Modify: `tests/autumn-article-content.test.mjs:142-198`
- Modify: `articles/autumn-interlaken/article.css:38-109, 425-430, 534-536`

**Interfaces:**
- Consumes: the adaptive rail from Task 1 and the existing base spacing rules.
- Produces: a tighter desktop hero, shared section rhythm, Travel Packs heading gap, and FAQ rows without changing mobile overrides.

- [ ] **Step 1: Add the failing desktop-spacing assertions**

Immediately after the adaptive rail assertions in `tests/autumn-article-content.test.mjs`, add:

```js
  assert.match(
    css,
    /\.article-hero\s*{[^}]*padding:\s*clamp\(68px,\s*7vw,\s*104px\)\s+0\s+clamp\(74px,\s*7\.5vw,\s*112px\)/s,
    'desktop hero spacing must preserve impact without consuming a full viewport'
  );
  assert.match(
    css,
    /\.article-section\s*{[^}]*padding:\s*clamp\(76px,\s*7vw,\s*104px\)\s+0/s,
    'shared editorial sections must use the approved compact rhythm'
  );
  assert.match(css, /\.travel-packs \.section-heading\s*{[^}]*margin-bottom:\s*44px/s);
  assert.match(css, /\.faq-list article\s*{[^}]*padding:\s*26px\s+0/s);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
node --test tests/autumn-article-content.test.mjs
```

Expected: FAIL because the hero, shared sections, Travel Packs heading, and FAQ rows still use the old spacing values.

- [ ] **Step 3: Apply the approved base spacing values**

In `articles/autumn-interlaken/article.css`, make these exact replacements:

```css
.article-hero {
  position: relative;
  overflow: hidden;
  padding: clamp(68px, 7vw, 104px) 0 clamp(74px, 7.5vw, 112px);
  background: var(--cream);
  border-block: 1px solid var(--line);
}

.article-section {
  padding: clamp(76px, 7vw, 104px) 0;
}
```

Within the existing `.travel-packs .section-heading` rule, set:

```css
  margin-bottom: 44px;
```

Within the existing `.faq-list article` rule, set:

```css
  padding: 26px 0;
```

Leave the existing `@media (max-width: 560px)` hero, article-section, Travel Packs, and FAQ overrides intact.

- [ ] **Step 4: Run focused and full automated verification**

Run:

```powershell
node --test tests/autumn-article-content.test.mjs
node --test tests/*.test.mjs
```

Expected: both commands PASS with zero failed tests.

- [ ] **Step 5: Inspect the diff and commit Task 2**

Run:

```powershell
git diff --check -- articles/autumn-interlaken/article.css tests/autumn-article-content.test.mjs
git diff -- articles/autumn-interlaken/article.css tests/autumn-article-content.test.mjs
git add -- articles/autumn-interlaken/article.css tests/autumn-article-content.test.mjs
git commit -m "Tighten autumn article desktop spacing"
```

Expected: `git diff --check` produces no output; the commit contains only the spacing changes and their assertions.

### Task 3: Cross-Viewport Browser Verification and Production Deployment

**Files:**
- Verify: `en/articles/autumn-interlaken/index.html`
- Verify: `de/artikel/herbst-interlaken/index.html`
- Verify: `articles/autumn-interlaken/article.css`
- Verify: `tests/autumn-article-content.test.mjs`

**Interfaces:**
- Consumes: the two tested CSS commits from Tasks 1 and 2.
- Produces: browser evidence for both locales and a verified GitHub Pages deployment of the approved layout.

- [ ] **Step 1: Start a local static server without modifying project files**

Run in a persistent terminal session:

```powershell
py -m http.server 8000
```

Expected: the server reports `Serving HTTP on ... port 8000` and remains running for browser verification.

- [ ] **Step 2: Verify the English page at all approved viewport sizes**

Open `http://localhost:8000/en/articles/autumn-interlaken/` in the Codex in-app browser and inspect 1366×768, 1440×900, 1440×1000, 1920×1080, 820×900, and 390×844.

At each size, measure and confirm:

- `document.documentElement.scrollWidth <= window.innerWidth`.
- All destination-number rectangles remain inside the viewport.
- At two-column sizes, `.map-section` computes to `position: sticky`, remains below the header, and its bottom edge stays inside the viewport.
- At 820px and 390px widths, `.journey-layout` computes to one column and `.map-section` computes to `position: static`.
- No empty left journey column, map overlap, header collision, clipped heading, or irregular Travel Packs card alignment is visible.
- `/images/logo-official.png` is visible in header and footer and the boba cursor remains visible and follows pointer movement.

- [ ] **Step 3: Verify the German page at representative desktop and mobile sizes**

Open `http://localhost:8000/de/artikel/herbst-interlaken/` and inspect 1366×768, 1440×900, and 390×844.

Confirm the same overflow, rail, number, logo, and cursor requirements as the English page. Also confirm the longer German destination headings remain inside their copy tracks without covering the numbers.

- [ ] **Step 4: Stop the static server and run final repository verification**

Stop the persistent server with `Ctrl+C`, then run:

```powershell
node --test tests/*.test.mjs
git diff --check
git status --short --branch
```

Expected: the complete Node suite passes with zero failures; `git diff --check` produces no output; status lists only the pre-existing untracked campaign/story images and shows the local `main` commits ahead of `origin/main`.

- [ ] **Step 5: Push the exact verified commits and wait for GitHub Pages**

Run:

```powershell
git push origin main
```

Expected: the push succeeds without force. Wait for the repository's GitHub Pages workflow triggered by this push and require a successful conclusion before continuing.

- [ ] **Step 6: Verify the live localized pages after deployment**

Open:

```text
https://www.thebsclub.ch/en/articles/autumn-interlaken/
https://www.thebsclub.ch/de/artikel/herbst-interlaken/
```

Repeat the 1440×900 and 390×844 checks for overflow, adaptive rail, destination numbers, official logo, and custom cursor. Confirm the live CSS contains the `min-height: 700px` adaptive media condition and no `min-height: 980px` rule.
