# Deploy Cursor Hotfix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Include `cursor.js` in the GitHub Pages artifact so the approved Matcha Latte cursor loads on the live website.

**Architecture:** Keep the cursor implementation unchanged. Fix the deployment boundary by copying the already-referenced `cursor.js` into `_site`, and add a regression test that inspects the workflow.

**Tech Stack:** GitHub Actions YAML, Node.js built-in test runner, static HTML/CSS/JavaScript.

## Global Constraints

- Do not change cursor visuals or interaction behavior.
- Keep the existing GitHub Pages workflow and add only the missing asset.
- Verify the live `cursor.js` URL returns HTTP 200 after deployment.

---

### Task 1: Include the cursor asset in GitHub Pages

**Files:**
- Modify: `.github/workflows/deploy-pages.yml:35`
- Test: `tests/deploy-pages.test.mjs`

**Interfaces:**
- Consumes: `index.html` reference to `cursor.js?v=20260815-2` and the root `cursor.js` file.
- Produces: `_site/cursor.js` in the GitHub Pages artifact.

- [ ] **Step 1: Write the failing test**

```js
test('publishes every root JavaScript asset referenced by the homepage', () => {
  assert.match(workflow, /cp index\.html styles\.css script\.js cursor\.js \.nojekyll _site\//);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/deploy-pages.test.mjs`
Expected: FAIL because the workflow omits `cursor.js`.

- [ ] **Step 3: Apply the minimal workflow fix**

```yaml
cp index.html styles.css script.js cursor.js .nojekyll _site/
```

- [ ] **Step 4: Verify locally and on the deployed site**

Run: `node --test tests/*.test.mjs`
Expected: all tests pass.

After pushing `main`, request `https://thebsclub.ch/cursor.js?v=20260815-2`.
Expected: HTTP 200.

- [ ] **Step 5: Commit and deploy**

```bash
git add .github/workflows/deploy-pages.yml tests/deploy-pages.test.mjs docs/superpowers/plans/2026-08-08-deploy-cursor-hotfix.md
git commit -m "fix: deploy custom cursor asset"
git push origin main
```
