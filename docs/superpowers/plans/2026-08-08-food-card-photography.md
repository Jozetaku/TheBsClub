# Food Card Photography Implementation Plan

> **For agentic workers:** Implement inline in the existing isolated website worktree. Follow test-driven development and do not commit until owner review.

**Goal:** Replace the four abstract food-card illustrations with the supplied product photographs in a consistent full-width 4:3 presentation.

**Architecture:** Each existing semantic meal card keeps its copy, prices, and dietary wording. A new fixed-ratio image stage sits above the copy; all four images use the same dimensions and `object-fit: cover`, with small per-dish `object-position` adjustments only where needed.

**Tech Stack:** Semantic HTML, CSS, PNG assets, Node.js built-in test runner.

## Global Constraints

- Map Spicy Basil, Green Curry, Red Curry, and Crispy Chicken Katsu Curry to the four supplied images exactly.
- Preserve every dish name, description, price, Chicken-first ordering, and Tofu-option wording.
- Use no people, ladders, generated lettering, or logos in food cards.
- Keep original source images unchanged.
- Do not modify the Matcha drink image in this task.
- Do not commit before owner review.

---

### Task 1: Product Image Cards

**Files:**
- Create: `images/campaign/v3/spicy-basil.png`
- Create: `images/campaign/v3/green-curry.png`
- Create: `images/campaign/v3/red-curry.png`
- Create: `images/campaign/v3/katsu-curry.png`
- Modify: `index.html`
- Modify: `styles.css`
- Test: `tests/asian-menu.test.mjs`
- Test: `tests/responsive-design.test.mjs`

- [ ] Add failing tests for the exact dish-to-image mapping, four useful alt texts, removal of placeholder illustrations, and one consistent 4:3 stage.
- [ ] Run the focused tests and confirm they fail because the food-card images are absent.
- [ ] Copy the four approved PNG sources into `images/campaign/v3/` without changing their pixels.
- [ ] Replace each placeholder illustration with its semantic image stage and lazy-loaded image.
- [ ] Convert each card to a vertical image-over-copy layout while preserving equal heights and responsive behavior.
- [ ] Bump the stylesheet cache key and update its content test.
- [ ] Run focused and full tests, inspect desktop and mobile, and leave the preview open for owner review.

### Task 2: Accurate Thai and Japanese Classification

**Files:**
- Modify: `index.html`
- Test: `tests/focused-launch.test.mjs`

- [ ] Add a failing test that requires an Asian café meal heading, identifies three Thai meals plus one Japanese Katsu, and keeps the Thai food SEO phrase in the hero.
- [ ] Replace the four-meal section heading and introduction without changing product names, prices, imagery, or layout.
- [ ] Clarify that the Thai-chef statement applies to the Thai recipes while all four meals are heated and served at The B’s Club.
- [ ] Run focused and full tests and leave the corrected preview uncommitted.
