# The B's Club Focused Launch Website Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver an uncommitted, review-ready homepage that clearly launches four Thai café meals and the five confirmed most-loved drinks while preserving The B's Club's Mini Makers identity.

**Architecture:** Keep the existing static HTML/CSS/JavaScript site and progressively enhance its content rather than introducing a framework or new dependency. Treat `index.html` as the business-content contract, `styles.css` as the responsive visual system, and the Node test files as exact launch-scope safeguards. Existing menu-dialog, consent, tracking, logo, cursor, and Mini Makers behavior remain intact.

**Tech Stack:** Semantic HTML5, CSS custom properties and responsive media queries, vanilla JavaScript, Node.js built-in test runner, Python Playwright for rendered browser QA.

## Global Constraints

- Do not commit until the owner has reviewed the rendered website.
- Publish exactly four new dishes: Spicy Basil, Green Curry, Red Curry, and Crispy Chicken Katsu Curry.
- Chicken is the primary presentation for Spicy Basil, Green Curry, and Red Curry; `Tofu option` is text-only.
- Do not publish Vegetarian, Vegan, plant-based, Quick Bowl, or Set Menu claims.
- Use the exact preparation statement: `Thai recipes prepared by Thai chefs, heated and served at The B’s Club.`
- Most-loved drink order is Brown Sugar Milk Tea, Yummy Strawberry, Matcha Latte, Mango Tea, Biscoff Milk Tea.
- Water and Cola remain secondary meal-completion items.
- Hours are daily 11:00–21:00.
- Preserve the official mountain logo, Mini Makers, ladder, oversized bowl/drink, Bubble Tea cursor, menu dialogs, analytics consent, and directions tracking.
- Do not generate replacement campaign imagery; use the current reversible illustration treatment until mapped final assets arrive.

---

### Task 1: Launch Content Contract

**Files:**
- Create: `tests/focused-launch.test.mjs`
- Read: `index.html`

**Interfaces:**
- Consumes: static homepage HTML.
- Produces: exact assertions that protect the approved launch scope and copy.

- [ ] **Step 1: Write failing tests for positioning, four dishes, preparation wording, drink order, secondary soft drinks, and forbidden claims**
- [ ] **Step 2: Run `node --test tests/focused-launch.test.mjs` and confirm failures are caused by the current hero/copy and missing ranked drink treatment**
- [ ] **Step 3: Keep the tests unchanged while Tasks 2–3 implement the approved contract**

### Task 2: Homepage Content and SEO

**Files:**
- Modify: `index.html`
- Test: `tests/focused-launch.test.mjs`
- Test: `tests/asian-menu.test.mjs`
- Test: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: approved spec and content-contract tests.
- Produces: semantic hero, four-card food launch, exact preparation note, ranked drinks block, meal-completion note, Visit/evening copy, metadata, and structured data.

- [ ] **Step 1: Update title, description, structured data, hero H1/supporting copy, service line, and CTAs to the approved Asian Café positioning**
- [ ] **Step 2: Make all four food cards use `Café Meal · Dine In or Takeaway`, Chicken-first presentation, and the approved prices**
- [ ] **Step 3: Add the exact honest-preparation note adjacent to the food grid and remove broad made-fresh/to-order food claims**
- [ ] **Step 4: Add a semantic ordered Most-Loved block with Brown Sugar first and keep the full existing menu-dialog entry points**
- [ ] **Step 5: Add a compact water-and-cola meal-completion treatment and strengthen lunch/dinner/central-Interlaken Visit copy**
- [ ] **Step 6: Run `node --test tests/focused-launch.test.mjs tests/asian-menu.test.mjs tests/site-content.test.mjs` and confirm all content tests pass**

### Task 3: Distinctive Responsive Presentation

**Files:**
- Modify: `styles.css`
- Test: `tests/responsive-design.test.mjs`
- Test: `tests/mini-makers.test.mjs`

**Interfaces:**
- Consumes: semantic classes added in Task 2.
- Produces: responsive layouts and visual hierarchy consistent with the green/yellow/coral/cream brand system.

- [ ] **Step 1: Style the food launch as the primary content immediately below the hero without changing current placeholder illustration assets**
- [ ] **Step 2: Style the preparation note as a visible trust marker and the ranked drinks as one large Brown Sugar feature plus four supporting favourites**
- [ ] **Step 3: Keep Mini Makers and ladder visually dominant in the hero, with reduced-motion and mobile fallbacks intact**
- [ ] **Step 4: Add compact responsive rules for 820px and 560px breakpoints and protect against horizontal overflow**
- [ ] **Step 5: Run `node --test tests/responsive-design.test.mjs tests/mini-makers.test.mjs` and confirm both suites pass**

### Task 4: Regression and Rendered Browser Review

**Files:**
- Verify: `index.html`
- Verify: `styles.css`
- Verify: `script.js`
- Verify: `cursor.js`
- Verify: `tests/*.test.mjs`

**Interfaces:**
- Consumes: the complete uncommitted build.
- Produces: screenshots and a browser QA report for owner review.

- [ ] **Step 1: Run `node --test tests/*.test.mjs` and record the exact pass/fail total**
- [ ] **Step 2: Start a local static server and open the rendered homepage in Chromium**
- [ ] **Step 3: Inspect desktop and mobile screenshots, horizontal overflow, browser console, menu dialogs, navigation, consent controls, directions links, Mini Makers, and custom cursor**
- [ ] **Step 4: Fix any rendered defect through a failing regression test first, then repeat the full suite and browser checks**
- [ ] **Step 5: Show the rendered page to the owner and keep all changes uncommitted until explicit approval**
