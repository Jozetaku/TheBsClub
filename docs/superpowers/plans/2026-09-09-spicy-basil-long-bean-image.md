# Spicy Basil Chicken Long-Bean Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce and publish a Spicy Basil Chicken image that replaces sugar snap peas with smaller long-bean segments, then synchronize the website, Obsidian and Swinch at the website price of CHF 18.50.

**Architecture:** Treat the current website image as an immutable source and use one precise built-in image edit to create a versioned square marketplace master. Derive the 4:3 website asset mechanically, update the static site and Obsidian record, then create matching Swinch Product and Menu Item records only after owner approval.

**Tech Stack:** Built-in image generation/editing, PowerShell with System.Drawing, static HTML, Node.js tests, Markdown/Obsidian, Swinch Merchant browser UI.

## Global Constraints

- Remove every sugar snap pea / snow-pea-like green vegetable from the dish.
- Replace them with cut long-bean segments approximately 20% smaller than the removed pieces.
- Preserve chicken, Thai basil, sliced red chilli, jasmine rice, white ceramic bowls, wooden board, café background, lighting, camera angle and colour treatment.
- Do not add cucumber, bell pepper, broccoli, onion, new garnish, text, logos, utensils, hands, borders or watermarks.
- Save the square master and website derivative non-destructively before publication.
- Every Swinch price must match the current website price; Spicy Basil Chicken is CHF 18.50.
- Keep Uber Eats paused.

---

### Task 1: Create and validate the square marketplace master

**Files:**
- Read: `images/campaign/v6/spicy-basil-white-ceramic.jpg`
- Create: `C:/Users/v-bes/Documents/The B's Club/outputs/menu-master/spicy-basil-chicken/spicy-basil-chicken-candidate-v1-long-beans.png`
- Create: `C:/Users/v-bes/Documents/Obsidien/Founder/06-Business-OS/01-Businesses/The B's Club/Menu/Assets/spicy-basil-chicken/spicy-basil-chicken-candidate-v1-long-beans.png`

**Interfaces:**
- Consumes: the existing vertical website photograph.
- Produces: one centred square candidate for owner review and downstream derivatives.

- [ ] **Step 1: Inspect the source at original detail**

Confirm the source shows chicken, Thai basil, red chilli, sugar-snap-pea-like pieces, jasmine rice and two white bowls on a wooden board.

- [ ] **Step 2: Run the precise built-in image edit**

Use this exact prompt:

```text
Use case: precise-object-edit
Asset type: square marketplace food photograph for Swinch
Primary request: Remove every sugar snap pea or snow-pea-like green piece from the Spicy Basil Chicken and replace each with naturally cooked Thai long-bean segments approximately 20% smaller than the removed pieces.
Input image: Image 1 is the edit target.
Composition: Reframe as a centred square marketplace image with the complete curry bowl and separate rice bowl fully visible.
Constraints: Preserve the chicken, Thai basil, sliced red chilli, jasmine rice, white ceramic bowls, wooden serving board, café background, camera angle, lighting and colour treatment. Keep the replacement quantity visually balanced and realistic.
Avoid: sugar snap peas, snow peas, cucumber, bell pepper, broccoli, onion, new garnish, duplicated food, distorted ceramics, text, logos, utensils, hands, borders or watermarks.
```

- [ ] **Step 3: Save both project copies**

Copy the chosen output to the workspace and Obsidian v1 paths without overwriting the source.

- [ ] **Step 4: Verify identity and visual requirements**

Run `Get-FileHash -Algorithm SHA256` against both saved copies and confirm identical hashes. Inspect the square output at original detail and confirm that only long-bean segments remain, the two bowls are complete and the meal is centred.

### Task 2: Prepare and integrate the website derivative

**Files:**
- Modify: `images/campaign/v6/spicy-basil-white-ceramic.jpg`
- Modify if needed: `index.html`
- Modify if needed: `en/index.html`
- Create: `C:/Users/v-bes/Documents/Obsidien/Founder/06-Business-OS/01-Businesses/The B's Club/Menu/Assets/spicy-basil-chicken/spicy-basil-chicken-website-1200x900-v1.jpg`

**Interfaces:**
- Consumes: the owner-approved square master from Task 1.
- Produces: a 1200×900 website JPEG with synchronized intrinsic dimensions.

- [ ] **Step 1: Create a deterministic 4:3 crop**

Use System.Drawing with high-quality bicubic interpolation to crop around both bowls, resize to 1200×900 and save at JPEG quality 92 to the existing website asset path.

- [ ] **Step 2: Synchronize bilingual HTML dimensions**

Ensure both homepages reference `/images/campaign/v6/spicy-basil-white-ceramic.jpg` with:

```html
width="1200" height="900"
```

- [ ] **Step 3: Save the website derivative in Obsidian**

Copy the 1200×900 JPEG to the versioned Obsidian path and verify its SHA-256 hash matches the website file.

- [ ] **Step 4: Run website verification**

Run:

```powershell
node --test tests/asian-menu.test.mjs tests/menu-sets.test.mjs
node --test tests/*.test.mjs
git diff --check
```

Expected: all focused and full tests pass with zero failures and no whitespace errors.

- [ ] **Step 5: Commit only the Spicy Basil website changes**

Run:

```powershell
git add -- index.html en/index.html images/campaign/v6/spicy-basil-white-ceramic.jpg
git commit -m "fix: use long beans in spicy basil image"
```

Expected: the commit excludes all unrelated modified and untracked files.

### Task 3: Create the durable product record and synchronize Swinch

**Files:**
- Create: `C:/Users/v-bes/Documents/Obsidien/Founder/06-Business-OS/01-Businesses/The B's Club/Menu/Products/spicy-basil-chicken.md`

**Interfaces:**
- Consumes: the approved master, website derivative and current website price.
- Produces: an auditable product record plus matching Swinch Product and Menu Item.

- [ ] **Step 1: Create the Obsidian product record**

Record the canonical English/German name and description, source and derivative paths, website price CHF 18.50, Swinch price CHF 18.50, quantity 10, image status, platform status and change history. Mark ingredients and allergens as requiring owner verification.

- [ ] **Step 2: Prepare the Swinch Product form**

Use `Spicy Basil Chicken`, website description, price `18.50`, quantity `10`, Active enabled, Displayed enabled, Recommended disabled and the approved square master.

- [ ] **Step 3: Request action-time confirmation**

Before creating external records, state that the next actions will create the live Swinch Product and Menu Item at CHF 18.50 with the approved image. Continue only after user confirmation.

- [ ] **Step 4: Create and verify the Swinch records**

Create the Product and the `Spicy Basil Chicken` Menu Item at CHF 18.50. Verify Products increases by one and Menu Items increases by one, with the correct price and visible status.

- [ ] **Step 5: Publish and verify the website**

After a separate action-time confirmation, push the tested website commit to `main`. Verify GitHub Pages succeeds and the live image SHA-256 matches the approved website derivative.

- [ ] **Step 6: Finalize Obsidian status**

Update the product record from prepared to published only after both the live website and Swinch records are visibly verified.
