# Drink Category Typography Implementation Plan

> **For agentic workers:** Implement inline in the existing isolated website worktree. Follow test-driven development and do not commit until owner review.

**Goal:** Replace the three inconsistent drink-category emoji with a restrained numbered typography system that matches the website's existing editorial design.

**Architecture:** Keep the three existing semantic article cards, copy, menu buttons, and `data-menu` behavior. Replace only the decorative emoji span with an aria-hidden category marker and style that marker through the existing stylesheet.

**Tech Stack:** Semantic HTML, CSS, Node.js built-in test runner.

## Global Constraints

- Preserve Bubble Tea, Matcha, and Coffee menu links and their existing `data-menu` values.
- Use `01`, `02`, and `03` as decorative category markers.
- Do not modify product imagery or the Matcha product background in this task.
- Do not commit before owner review.

---

### Task 1: Replace Emoji with Editorial Markers

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Test: `tests/focused-launch.test.mjs`

- [ ] Add a failing test that requires three `.drink-category-index` markers and rejects the three emoji.
- [ ] Run the focused test and confirm it fails because the new markers are absent.
- [ ] Replace the emoji spans with `01`, `02`, and `03`, preserving `aria-hidden="true"`.
- [ ] Replace the emoji CSS rule with a small uppercase/index treatment using the brand coral colour and a short horizontal rule.
- [ ] Bump the stylesheet cache key in `index.html` and its content test.
- [ ] Run focused and full test suites, inspect desktop/mobile layouts, and leave the preview open for owner review.
