# German Article Heading Wrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the three approved German Autumn Interlaken headings balanced two-line desktop wraps while preserving natural mobile wrapping and leaving the English article unchanged.

**Architecture:** Add two German-only semantic line-group spans to each affected `h2`. A shared CSS class renders each group as a block above `820px` and returns it to inline flow at `820px` and below; a Node content test locks the exact German grouping, English exclusion, and responsive CSS contract.

**Tech Stack:** Static HTML5, shared CSS, Node.js built-in test runner, GitHub Pages, in-app browser QA.

## Global Constraints

- Preserve the complete visible German heading wording and every existing `h2` `id`.
- Use exactly two `de-heading-line` spans in each of the three approved German headings.
- Desktop groups are exactly `Sechs Stationen` / `ab The B`, `Höhematte: Platz lassen` / `auf der Wiese`, and `Harder Kulm: zuerst` / `die Rückfahrt klären`.
- Use `display: block` above `820px` and `display: inline` at `820px` and below.
- Keep a literal normal space between the two spans in each heading.
- Do not add `de-heading-line` to the English article.
- Do not change heading font size, container width, grid proportions, article copy, SEO metadata, logo, cursor, navigation, map, numbering, or spacing system.
- Do not stage or modify unrelated untracked image files.

---

## File Map

- `tests/autumn-article-content.test.mjs`: protects exact localized heading markup and the desktop/mobile display contract.
- `de/artikel/herbst-interlaken/index.html`: contains the only three headings whose markup changes.
- `articles/autumn-interlaken/article.css`: owns the shared default and `max-width: 820px` responsive behavior.
- `en/articles/autumn-interlaken/index.html`: verification-only control; must remain unchanged.

### Task 1: Lock and implement the responsive German heading groups

**Files:**
- Modify: `tests/autumn-article-content.test.mjs`
- Modify: `de/artikel/herbst-interlaken/index.html:149,172,240`
- Modify: `articles/autumn-interlaken/article.css:166,714-785`
- Verify unchanged: `en/articles/autumn-interlaken/index.html`

**Interfaces:**
- Consumes: the existing `readArticle(locale)` and `occurrences(source, pattern)` test helpers.
- Produces: six `.de-heading-line` elements in German HTML and two CSS rules for `.de-heading-line`.

- [ ] **Step 1: Add the failing regression test**

Immediately after `article CSS fulfils the responsive editorial and accessibility contract`, add:

```js
test('German editorial headings use approved responsive line groups', () => {
  const en = readArticle('en');
  const de = readArticle('de');
  const css = readFileSync(artworkPath('article.css'), 'utf8');
  const expectedHeadings = [
    '<h2 id="map-title"><span class="de-heading-line">Sechs Stationen</span> <span class="de-heading-line">ab The B</span></h2>',
    '<h2 id="hohematte-title"><span class="de-heading-line">Höhematte: Platz lassen</span> <span class="de-heading-line">auf der Wiese</span></h2>',
    '<h2 id="harder-title"><span class="de-heading-line">Harder Kulm: zuerst</span> <span class="de-heading-line">die Rückfahrt klären</span></h2>'
  ];

  for (const heading of expectedHeadings) {
    assert.ok(de.includes(heading), `expected exact German heading markup: ${heading}`);
  }

  assert.equal(occurrences(de, /class="de-heading-line"/g), 6);
  assert.equal(occurrences(en, /class="de-heading-line"/g), 0);
  assert.equal(occurrences(css, /\.de-heading-line\s*{/g), 2);
  assert.match(css, /\.de-heading-line\s*{[^}]*display:\s*block;/s);
  assert.match(
    css,
    /@media\s*\(max-width:\s*820px\)[\s\S]*?\.de-heading-line\s*{[^}]*display:\s*inline;/s
  );
});
```

- [ ] **Step 2: Run the focused test and confirm the intended failure**

Run:

```powershell
node --test tests/autumn-article-content.test.mjs
```

Expected: FAIL in `German editorial headings use approved responsive line groups` because the first exact span-wrapped heading is absent. All pre-existing tests in that file should still pass.

- [ ] **Step 3: Add the exact German-only heading markup**

Replace the three German `h2` lines with:

```html
<h2 id="map-title"><span class="de-heading-line">Sechs Stationen</span> <span class="de-heading-line">ab The B</span></h2>
```

```html
<h2 id="hohematte-title"><span class="de-heading-line">Höhematte: Platz lassen</span> <span class="de-heading-line">auf der Wiese</span></h2>
```

```html
<h2 id="harder-title"><span class="de-heading-line">Harder Kulm: zuerst</span> <span class="de-heading-line">die Rückfahrt klären</span></h2>
```

Do not edit the corresponding English headings.

- [ ] **Step 4: Add the default desktop display rule**

Immediately after `.map-section .section-heading h2`, add:

```css
.de-heading-line {
  display: block;
}
```

- [ ] **Step 5: Restore natural flow at the existing mobile breakpoint**

Inside the existing `@media (max-width: 820px)` block, immediately after its opening line, add:

```css
  .de-heading-line {
    display: inline;
  }
```

- [ ] **Step 6: Run focused and full automated verification**

Run:

```powershell
node --test tests/autumn-article-content.test.mjs
node --test tests/*.test.mjs
git diff --check -- tests/autumn-article-content.test.mjs de/artikel/herbst-interlaken/index.html articles/autumn-interlaken/article.css
```

Expected: both Node commands exit `0` with zero failed tests; `git diff --check` prints nothing.

- [ ] **Step 7: Review scope and commit only the implementation files**

Run:

```powershell
git diff -- tests/autumn-article-content.test.mjs de/artikel/herbst-interlaken/index.html articles/autumn-interlaken/article.css en/articles/autumn-interlaken/index.html
git status --short
git add -- tests/autumn-article-content.test.mjs de/artikel/herbst-interlaken/index.html articles/autumn-interlaken/article.css
git commit -m "fix: balance German article headings"
```

Expected: the English diff is empty; only the test, German HTML, and shared CSS are staged; unrelated images remain untracked.

### Task 2: Verify the layout in a real browser

**Files:**
- Verify: `de/artikel/herbst-interlaken/index.html`
- Verify: `en/articles/autumn-interlaken/index.html`
- Verify: `articles/autumn-interlaken/article.css`

**Interfaces:**
- Consumes: the committed static site from Task 1.
- Produces: visual evidence that desktop groups are balanced and mobile remains fluid.

- [ ] **Step 1: Serve the repository locally**

Run from the repository root in a persistent terminal:

```powershell
npx --yes serve . --listen 8000
```

Expected: the server reports a local URL on port `8000`.

- [ ] **Step 2: Inspect the German article at desktop widths**

Open `http://localhost:8000/de/artikel/herbst-interlaken/` and verify at both `1440×900` and `1920×900`:

- `Sechs Stationen` is line one and `ab The B` is line two.
- `Höhematte: Platz lassen` is line one and `auf der Wiese` is line two.
- `Harder Kulm: zuerst` is line one and `die Rückfahrt klären` is line two.
- No heading has a single-word second line, clipping, overlap, or horizontal overflow.

- [ ] **Step 3: Inspect mobile behavior**

At `390×844`, verify that `.de-heading-line` computes to `display: inline`, all three headings wrap naturally within their containers, and the document has no horizontal overflow (`document.documentElement.scrollWidth <= document.documentElement.clientWidth`).

- [ ] **Step 4: Verify the English control page and stop the local server**

Open `http://localhost:8000/en/articles/autumn-interlaken/` at `1440×900` and confirm its three corresponding headings retain their original text and natural wrapping. Return to the German page, reset the viewport to `1440×900`, then stop the local server with `Ctrl+C`.

### Task 3: Deploy and verify GitHub Pages

**Files:**
- Deploy: committed `main` branch only.
- Verify: `https://www.thebsclub.ch/de/artikel/herbst-interlaken/`

**Interfaces:**
- Consumes: clean automated and browser verification from Tasks 1–2.
- Produces: the approved heading wraps on the live German article.

- [ ] **Step 1: Re-run the release gate**

Run:

```powershell
node --test tests/*.test.mjs
git diff --check
git status --short --branch
git log -2 --oneline
```

Expected: zero failed tests, no whitespace errors, the intended spec and implementation commits are the only commits ahead of `origin/main`, and only the pre-existing unrelated images remain untracked.

- [ ] **Step 2: Push the fast-forward deployment**

Run:

```powershell
git push origin main
```

Expected: a normal fast-forward push succeeds; `.github/workflows/deploy-pages.yml` starts the GitHub Pages workflow.

- [ ] **Step 3: Wait for the Pages workflow**

Run:

```powershell
gh run list --workflow deploy-pages.yml --branch main --limit 1
gh run watch --exit-status
```

Expected: the newest `Deploy static site to GitHub Pages` run completes successfully. If `gh run watch` cannot infer the run, copy the newest run ID from the first command and run `gh run watch <run-id> --exit-status`.

- [ ] **Step 4: Verify the live German and English pages**

Open the live German URL with a cache-busting query such as `https://www.thebsclub.ch/de/artikel/herbst-interlaken/?v=<implementation-commit>` and repeat the `1440×900`, `1920×900`, and `390×844` checks from Task 2. Confirm the English control page remains unchanged, then report the deployment commit and workflow result.
