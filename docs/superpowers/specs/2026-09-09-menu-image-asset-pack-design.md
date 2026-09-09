# Menu Image Asset Pack Design

## Goal

Create a reusable, food-only image pack for every approved The B's Club menu item so the same verified serving can be reused across Obsidian, Swinch, the website and future social content without regenerating the food.

## Approved scope

Create packs for these three approved dishes:

1. Crispy Chicken Katsu Curry
2. Thai Green Curry Chicken
3. Spicy Basil Chicken

Do not generate or alter the food, garnish, crockery, lighting or café scene. Use the already owner-approved square masters as immutable sources.

## Canonical sources

| Menu | Approved source |
|---|---|
| Crispy Chicken Katsu Curry | `C:/Users/v-bes/Documents/The B's Club/outputs/menu-master/katsu-curry/katsu-curry-master-v1.png` |
| Thai Green Curry Chicken | `C:/Users/v-bes/Documents/The B's Club/outputs/menu-master/green-curry-chicken/green-curry-chicken-candidate-v3-bowl-minus-10.png` |
| Spicy Basil Chicken | `C:/Users/v-bes/Documents/The B's Club/outputs/menu-master/spicy-basil-chicken/spicy-basil-chicken-candidate-v2-less-beans-smaller-bowl.png` |

All three sources are 1254×1254 PNG files.

## Output contract

Each dish receives a `Final` directory inside the active Obsidian vault:

`02-BUSINESSES/The B's Club/Menu/Assets/<menu-slug>/Final/`

The pack contains:

| Role | Filename suffix | Dimensions | Format | Use |
|---|---|---:|---|---|
| Immutable master copy | `-master.png` | 1254×1254 | PNG | Long-term source of truth |
| Marketplace square | `-square-1200.jpg` | 1200×1200 | JPEG quality 92 | Swinch and other marketplaces |
| Website landscape | `-landscape-1200x900.jpg` | 1200×900 | JPEG quality 92 | Website cards and general web use |
| Social portrait | `-portrait-1080x1350.jpg` | 1080×1350 | JPEG quality 92 | Instagram and future vertical posts |

Use lowercase kebab-case dish names in filenames. No visible text, logo, border or watermark may be added to any image.

## Framing rules

- The 1200×1200 derivative scales the complete source without cropping.
- The 1200×900 derivative uses a centred 4:3 crop, adjusted vertically only when required to keep every serving vessel fully visible.
- The 1080×1350 derivative uses a centred 4:5 crop, adjusted horizontally only when required to keep every serving vessel fully visible.
- Never stretch or distort the source.
- If a requested crop cannot retain the full serving, use a neutral extension derived from the existing scene rather than cutting food or crockery.

## Obsidian presentation

- Embed the square 1200×1200 image near the top of each product note as its featured image.
- Add a reusable-image table to each product note linking all four final files.
- Add square thumbnail embeds for all dishes to `Menu Hub.md` so the menu database is visually browsable.
- Keep historical candidates in their existing folders for provenance and rollback.

## Validation

- Verify exact pixel dimensions and file formats for every derivative.
- Verify that each master copy has the same SHA-256 hash as its approved source.
- Inspect every derivative and confirm that food and all serving vessels remain fully visible and undistorted.
- Verify every image embed and file link resolves from the active Obsidian vault.
- Confirm that no image contains added text, logos, borders or watermarks.
