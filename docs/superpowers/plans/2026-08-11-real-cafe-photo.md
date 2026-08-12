# Real Café Photo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the large generated iced-coffee image in Our Story with the owner's authentic café interior photograph while retaining the smaller Cappuccino image.

**Architecture:** Keep the existing HTML collage and responsive CSS. Add the supplied, already optimized 278 KB production JPEG, update only the large image source and alt text, and tune its object position so the authentic interior reads clearly at existing breakpoints.

**Tech Stack:** Static HTML, CSS, Node.js built-in test runner, browser visual inspection.

## Global Constraints

- Use only `Photo 1.jpg` for the new interior image.
- Keep `images/signature-latte.jpg` unchanged as `.story-photo-two`.
- Do not add another section or gallery.
- Do not commit or deploy before owner review.
- Preserve unrelated tracked and untracked files.

---

### Task 1: Replace the large Our Story image

**Files:**
- Create: `images/the-bs-club-interior.jpg`
- Modify: `index.html:208-214`
- Modify: `styles.css:169-172`
- Modify: `tests/focused-launch.test.mjs`

**Interfaces:**
- Consumes: the existing `.story-photo-one`, `.story-photo-two`, and `.story-visual` collage hooks.
- Produces: `images/the-bs-club-interior.jpg` referenced by `.story-photo-one` with truthful alt text.

- [x] **Step 1: Write the failing regression test**

```js
test('pairs the real café interior with the existing cappuccino in the story collage', () => {
  const story = html.match(/<section class="section story"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(story, /class="story-photo-one" src="images\/the-bs-club-interior\.jpg"[^>]*alt="Interior of The B's Club Asian café in central Interlaken/);
  assert.match(story, /class="story-photo-two" src="images\/signature-latte\.jpg"[^>]*alt="Cappuccino/);
  assert.doesNotMatch(story, /story-iced-coffee-tall-v2/);
});
```

- [x] **Step 2: Run the focused test and verify the expected failure**

Run: `node --test tests/focused-launch.test.mjs`

Expected: FAIL because `index.html` still references `images/story-iced-coffee-tall-v2.webp`.

- [x] **Step 3: Add the supplied photograph as a production asset**

Copy `Photo 1.jpg` without recompression to `images/the-bs-club-interior.jpg`. Preserve its 960 × 1280 portrait dimensions and 284,725-byte source quality.

- [x] **Step 4: Update the large story image and crop**

Use this semantic image element:

```html
<img class="story-photo-one" src="images/the-bs-club-interior.jpg" alt="Interior of The B's Club Asian café in central Interlaken with tables, seating and mountain views" width="960" height="1280" loading="lazy" decoding="async">
```

Add an explicit crop that preserves the counter, seating, and window:

```css
.story-photo-one { object-position: 50% 54%; }
```

- [x] **Step 5: Run the focused test and full suite**

Run: `node --test tests/focused-launch.test.mjs`

Expected: PASS.

Run: `node --test tests/*.test.mjs campaign-2026-08/tests/*.test.mjs`

Expected: all tests pass with zero failures.

- [x] **Step 6: Inspect responsive rendering**

Serve the static site locally, capture the `#our-story` section at desktop and mobile widths, and verify that the primary photo shows the real café seating/counter while the Cappuccino remains a legible overlapping secondary image.

- [ ] **Step 7: Stop for owner review**

Report the preview URL and changed files. Do not commit or deploy.
