# The B's Club bilingual sandwich menu design

Date: 2026-08-30

## Goal

Add clearly photographed Ham, Egg & Cheese sandwich sets and Food + Boba combos to The B's Club website, replace the existing unnatural Green Curry image, and make the complete public website available in German and English. German becomes the primary language at `https://www.thebsclub.ch/`; English is available at `/en/` through a persistent `DE | EN` language switch.

The work must preserve the current site's visual identity and its existing food, drinks, music, ordering, story, review, partner, visit, privacy, analytics, and autumn-guide functionality.

## Audience and primary journey

The primary audience is local German-speaking customers and visitors in Interlaken. International visitors remain fully supported in English.

The primary journey is:

1. Arrive on the German or English homepage.
2. Recognise the new sandwich and Food + Boba offers and compare the sets visually.
3. Read ingredients and allergen information if needed.
4. Continue to Uber Eats or prepare a direct order through the existing order/contact form.

## Language architecture

- `/` is the canonical German homepage.
- `/en/` is the canonical English homepage.
- Each language page contains complete, native copy rather than mixed-language text.
- A visible `DE | EN` switch appears in desktop and mobile navigation.
- The switch links to the equivalent page and preserves a relevant section anchor where practical.
- `lang`, canonical links, `hreflang`, titles, descriptions, Open Graph copy, structured data, image alternative text, navigation labels, dialog labels, form labels, validation messages, privacy controls, and mobile actions are localised.
- The existing German and English autumn guides remain at their current routes and are linked from the matching language homepage.
- The implementation should keep German and English sandwich/product facts in one small structured JavaScript data source where interaction requires shared values, while visible HTML remains crawlable and usable without JavaScript.

## Sandwich section

Insert a dedicated `Sandwich-Sets` section after the new Food + Boba combos and before the bestselling drinks. It should look like a natural extension of the existing editorial product-card system rather than a separate microsite.

The section heading in German is `Frisch gemacht. Perfekt kombiniert.` and introduces the sandwich as freshly prepared with a Boba drink of the customer's choice. The English equivalent is `Freshly made. Perfectly paired.`

The first line of product copy must clearly state that any available Boba flavour can be chosen.

### Product cards

1. **Regular Set / Regular Set**
   - 1 sandwich + 1 Boba drink
   - German: `1 Sandwich + 1 Boba-Getränk`
   - Price: `CHF 16.90`
   - Primary source image: Photo 2

2. **Double Set / Double Set**
   - 2 sandwiches + 1 Boba drink
   - German: `2 Sandwiches + 1 Boba-Getränk`
   - Price: `CHF 24.90`
   - Primary source image: Photo 3, edited to remove only the coffee cup

3. **Sharing Set / Sharing Set**
   - 2 sandwiches + 2 Boba drinks
   - German: `2 Sandwiches + 2 Boba-Getränke`
   - Price: `CHF 31.90`
   - A new composite/product image derived from the supplied sandwich and Boba photographs, showing the quantities unambiguously

Coffee remains elsewhere on the website and menu. It is removed only from the Double Set product image.

### Product name and descriptions

German product name: `Schinken-Ei-Käse-Sandwich + Boba-Getränk nach Wahl`

English product name: `Ham, Egg & Cheese Sandwich + Any Boba Drink`

German summary: `Frisches Schinken-Ei-Käse-Sandwich mit einem Boba-Getränk deiner Wahl. Eine leckere und sättigende Kombination mit frischem Gemüse und einem erfrischenden Bubble-Getränk.`

English summary: `Fresh Ham, Egg & Cheese Sandwich served with any Boba drink of your choice. A filling and tasty combo with fresh vegetables and a refreshing bubble drink.`

The full description explains that the sandwich contains ham, egg, cheese, tomato, cucumber, lettuce, and creamy mayonnaise. Customers may pair it with any available milk tea, fruit tea, matcha, or other Boba drink.

## Details and disclosures

Each language page includes an accessible expandable details area below the three cards. It contains:

- Full description
- Ingredients
- Allergens
- Serving recommendation

German ingredients: `Sandwich: Brot, Schinken, Ei, Käse, Tomate, Gurke, Blattsalat, Mayonnaise. Getränk: Boba-Getränk nach Wahl; Zutaten je nach Sorte unterschiedlich.`

English ingredients: `Sandwich: Bread, ham, egg, cheese, tomato, cucumber, lettuce, mayonnaise. Drink: Boba drink of choice; ingredients vary by flavour.`

The allergen warning states that the sandwich contains gluten, egg, and milk; mayonnaise may contain mustard. Drink allergens vary by flavour and may include milk, soy, or other allergens. Customers with allergies or intolerances are instructed to contact the café before ordering.

The serving recommendation says the sandwich is best enjoyed fresh, the Boba drink should be shaken or stirred, and the set should be consumed soon after delivery for the best taste and texture.

## Food + Boba combo section

Add a bilingual `Food + Boba Combos` / `Essen + Boba Menüs` section immediately after the existing Asian café meals. Every combo contains one food portion with jasmine rice and one standard Boba drink of the customer's choice.

Standard Boba drinks that normally cost CHF 7.90 are included. Premium Boba drinks that normally cost CHF 8.90 add CHF 1.00. This rule must be visible before the customer starts an order.

### Chicken combos

1. `Crispy Chicken Katsu Curry + Boba-Getränk nach Wahl` / `Crispy Chicken Katsu Curry + Any Boba Drink` — **CHF 23.90**
2. `Thai Red Curry Chicken + Boba-Getränk nach Wahl` / `Thai Red Curry Chicken + Any Boba Drink` — **CHF 24.90**
3. `Thai Green Curry Chicken + Boba-Getränk nach Wahl` / `Thai Green Curry Chicken + Any Boba Drink` — **CHF 24.90**
4. `Thai Basil Chicken + Boba-Getränk nach Wahl` / `Thai Basil Chicken + Any Boba Drink` — **CHF 24.90**

### Tofu combos

1. `Thai Basil Tofu + Boba-Getränk nach Wahl` / `Thai Basil Tofu + Any Boba Drink` — **CHF 21.90**
2. `Thai Red Curry Tofu + Boba-Getränk nach Wahl` / `Thai Red Curry Tofu + Any Boba Drink` — **CHF 23.90**
3. `Thai Green Curry Tofu + Boba-Getränk nach Wahl` / `Thai Green Curry Tofu + Any Boba Drink` — **CHF 23.90**

Do not add a tofu Katsu combo because the current menu does not offer a verified Crispy Tofu Katsu product.

The Green Curry Chicken combo is the featured `Best Value` item. Chicken and tofu are presented as explicit products rather than silently swapping proteins, so the image, title, price, generated order message, and allergen disclosure cannot become mismatched.

## Food photography repair and expansion

The current Green Curry campaign image on the website is replaced because its curry surface and repeated geometric food shapes look unnatural. The replacement must keep the same visual system as the other approved food cards while making the curry, vegetables, chicken, and tofu look irregular and genuinely prepared.

Create one consistent Food + Boba image for every listed combo:

- Thai Basil Chicken
- Thai Basil Tofu
- Thai Red Curry Chicken
- Thai Red Curry Tofu
- Thai Green Curry Chicken
- Thai Green Curry Tofu
- Crispy Chicken Katsu Curry

The newly supplied Green Curry Tofu photos are direct subject and serving references. They establish the actual green curry colour, browned tofu, jasmine rice, white handled serving bowl, white plate, wooden board, white tabletop, and real café interior. The wider interior photographs establish the authentic background and lighting of The B's Club.

For dishes or protein variants without an existing photograph, derive the new scene from these approved serving references and the existing matching menu image. Do not invent a new bowl, takeaway box, plate, serving size, garnish system, or café interior.

Each combo image shows exactly one food serving, one rice serving, and one standard The B's Club Boba cup. The cup proportions, sealed lid, printed branding, tapioca/ingredients, and overall drink presentation follow the supplied and existing approved Boba photographs. The exact drink flavour is illustrative; the adjacent copy must still say that any available Boba drink can be chosen.

Use one shared commercial-photo treatment across the seven assets:

- white ceramic food and rice containers;
- the existing wooden serving board and white table;
- the real The B's Club interior softly visible in the background;
- natural café/window light, realistic shadows, and restrained colour correction;
- matching camera height, perspective, depth of field, product scale, and portrait crop;
- no floating ingredients, repeated grid patterns, duplicated garnish, deformed tableware, invented logos, decorative text, or watermarks.

The corrected food-only Green Curry image and all combo images are reused by both language pages.

## Image treatment

- Preserve the food's real appearance, proportions, fillings, packaging, and brand cup design.
- Use non-destructive edits and save all final assets inside the website's image directory.
- Crop consistently for product-card ratios and optimise for responsive delivery.
- Remove the coffee cup only from the Double Set image; reconstruct the surrounding tabletop naturally.
- Build the Sharing Set image from supplied photos so exactly two sandwiches and two Boba drinks are visible.
- Do not add invented ingredients, decorative text, watermarks, or misleading portion sizes.
- Add accurate German and English alternative text.

## Ordering integration

The existing order/contact area gains separate `Food + Boba Combos` and `Sandwich-Sets` product groups. Food combos use the seven approved products and prices above. When either type of set is selected, the page reveals or enables:

- Boba flavour selection for each included drink
- Sweetness selection
- Ice level selection
- Optional notes

The generated WhatsApp/email summary uses the page language and includes the set, protein where relevant, quantity, base price, premium-drink supplement, drink choices, sweetness, ice, fulfilment method, date/time, and customer notes. The existing payment-before-preparation notice and Uber Eats delivery path remain unchanged.

The sandwich section also includes a direct `Auf Uber Eats bestellen` / `Order on Uber Eats` call to action using the existing Uber Eats destination.

## Visual and responsive behaviour

- Reuse the current deep green, cream, coral, sand, editorial serif, rounded card, and restrained-motion system.
- Use a three-card row on wide screens and one card per row on mobile for the sandwich section. Use a compact responsive filter or grouped grid for the seven Food + Boba products so chicken and tofu choices remain easy to compare without an excessively long first viewport.
- Keep prices and quantities visible without opening the details area.
- Use the image itself as the primary quantity cue, reinforced by short quantity text and compact set badges.
- Respect reduced-motion preferences and existing reveal behaviour.
- Ensure keyboard focus, touch targets, dialog/details controls, and the language switch remain accessible.

## SEO and structured data

- Add reciprocal `hreflang="de-CH"`, `hreflang="en"`, and `x-default` links.
- Localise page titles and descriptions around Asian café, Bubble Tea, sandwiches, and Interlaken without keyword stuffing.
- Preserve the existing local-business structured data and add the sandwich offer as menu/product information where it can be represented accurately.
- Keep one canonical URL per language page.
- Update sitemap entries for both homepages.
- Preserve existing analytics consent behaviour and event tracking; add stable event names for language switching, sandwich details, set selection, and Uber Eats clicks.

## Error handling and fallbacks

- The language pages remain fully readable and navigable when JavaScript is unavailable.
- If an image fails to load, descriptive alternative text and product quantity/price remain present.
- Existing order-form validation continues to block incomplete submissions and adds clear, localised messages for missing set modifiers.
- Unsupported or missing selection values are omitted from generated messages rather than replaced with invented defaults.

## Verification

Before publication:

- Run the complete existing test suite and add coverage for bilingual content, routes, language links, all sandwich and Food + Boba prices, the CHF 1.00 premium modifier, ingredients, allergens, ordering modifiers, generated messages, analytics names, and sitemap entries.
- Validate both language homepages without JavaScript.
- Check desktop and mobile layouts, keyboard navigation, reduced-motion mode, and all three product images.
- Confirm the Double Set image contains no coffee and the Sharing Set image visibly contains two sandwiches and two Boba drinks.
- Confirm all seven Food + Boba images use the approved white containers, one standard Boba cup, and the real café atmosphere.
- Confirm the existing Green Curry image has been replaced and the new chicken/tofu curry photographs contain no repeated grid-like shapes or synthetic food patterns.
- Build or serve the static site locally and verify both routes return successful responses.
- Compare the implementation against the approved requirements line by line before publishing.

## Delivery

Implementation begins from the latest source in `https://github.com/Jozetaku/TheBsClub`. After tests and visual checks pass, publish through the repository's established deployment workflow so `https://www.thebsclub.ch/` serves German by default and `/en/` serves the complete English version.
