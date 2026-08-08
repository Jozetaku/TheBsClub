# Location and Matcha Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the Interlaken hero/location copy and make the Matcha Latte card and cursor consistent with the approved drink system.

**Architecture:** Keep the existing single-page HTML/CSS/JavaScript structure. Treat copy, card stage styling, and cursor styling as independent presentational units covered by the existing Node test suite.

**Tech Stack:** Semantic HTML, responsive CSS, vanilla JavaScript, Node `node:test`.

## Global Constraints

- Do not commit before owner review.
- Keep opening hours at `11:00–19:00`.
- Do not add Mini Makers or ladders.
- Do not put a logo on any drink cup.
- Keep all existing full-menu links.

---

### Task 1: Lock the approved content and visual contract

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify: `tests/responsive-design.test.mjs`
- Modify: `tests/boba-cursor.test.mjs`

**Interfaces:**
- Consumes: homepage markup in `index.html` and style rules in `styles.css`.
- Produces: failing assertions for the new hero lockup, parking copy, Matcha stage treatment, and cursor markup.

- [ ] **Step 1: Write failing tests** that require `Asian Café` and `Interlaken` without the old `in Interlaken` span, require `Next to Interlaken’s main public car park`, require a Matcha-specific stage treatment, and require Matcha cursor layers without Brown Sugar or B-mark elements.
- [ ] **Step 2: Run the focused tests** with `node --test tests\site-content.test.mjs tests\responsive-design.test.mjs tests\boba-cursor.test.mjs` and confirm they fail because the approved changes are absent.

### Task 2: Implement location and Matcha presentation

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: the existing hero, quick-promise, Visit, bestseller card, and `.boba-cursor` structures.
- Produces: the approved copy, `.matcha-cursor-*` layers, Matcha spotlight treatment, and responsive hero lockup.

- [ ] **Step 1: Update semantic copy and markup** for the hero lockup, parking message, and Matcha cursor layers.
- [ ] **Step 2: Add minimal CSS** for the two-line hero lockup, Matcha card spotlight/shadow, and Matcha-over-milk cursor.
- [ ] **Step 3: Run the focused tests** and confirm all pass.

### Task 3: Verify the complete homepage

**Files:**
- Verify: `index.html`
- Verify: `styles.css`
- Verify: `cursor.js`

**Interfaces:**
- Consumes: the completed homepage and current local preview server.
- Produces: a reviewable desktop/mobile build with no regressions.

- [ ] **Step 1: Run the complete suite** with `node --test tests\*.test.mjs` and expect zero failures.
- [ ] **Step 2: Run `git diff --check`** and expect no whitespace errors.
- [ ] **Step 3: Inspect desktop and mobile** for visual balance, horizontal overflow, the 19:00 hours, and browser console warnings.
- [ ] **Step 4: Leave changes uncommitted** and provide the review URL to the owner.

### Task 4: Simplify the Hero wordmark without changing SEO metadata

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify: `tests/focused-launch.test.mjs`
- Modify: `tests/responsive-design.test.mjs`
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.hero-title-category`, `.hero-title-place`, and the existing title/meta tags.
- Produces: a visible `Asian Cafe` / `Interlaken` lockup with no accent and no slash while title and metadata continue to identify `Asian Café Interlaken`.

- [ ] **Step 1: Write failing assertions** for visible `Asian Cafe`, absence of the slash pseudo-element, and retention of the SEO title.
- [ ] **Step 2: Run** `node --test tests\site-content.test.mjs tests\focused-launch.test.mjs tests\responsive-design.test.mjs` and confirm the old accented/slashed Hero fails.
- [ ] **Step 3: Change the Hero text** from `Asian Café` to `Asian Cafe` and remove the `.hero-title-place::before` slash rule.
- [ ] **Step 4: Run the focused and complete test suites** and expect zero failures.
- [ ] **Step 5: Inspect desktop and mobile** for wrapping and horizontal overflow, then leave the changes uncommitted for owner review.

### Task 5: Replace the story collage beverages

**Files:**
- Create: `images/story-iced-coffee-tall-v2.png`
- Create: `images/story-iced-coffee-tall-v2.webp`
- Modify: `index.html`
- Modify: `tests/focused-launch.test.mjs`

**Interfaces:**
- Consumes: `.story-photo-one`, `.story-photo-two`, and the existing `images/signature-latte.jpg` Cappuccino photograph.
- Produces: a large tall-glass Iced Coffee portrait, an optimized WebP delivery asset, and a smaller overlapping Cappuccino photograph.

- [ ] **Step 1: Add a failing story-collage test** requiring the Iced Coffee asset first, the existing Cappuccino second, and no Strawberry image in the story section.
- [ ] **Step 2: Generate the Iced Coffee portrait** by preserving the current warm alpine café scene and replacing only the drink with a tall unbranded clear glass.
- [ ] **Step 3: Copy the generated asset into the website worktree** as `images/story-iced-coffee-tall-v2.png`, export the optimized `images/story-iced-coffee-tall-v2.webp`, and update semantic alt text.
- [ ] **Step 4: Reuse `images/signature-latte.jpg` as the overlapping Cappuccino image** and run the focused test.
- [ ] **Step 5: Inspect both responsive crops** and leave all work uncommitted for owner review.
