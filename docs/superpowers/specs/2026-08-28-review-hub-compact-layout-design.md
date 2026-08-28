# Review Hub Compact Layout Refinement

## Goal

Refine the deployed `/review/` page from owner screenshots so its key content is more balanced, compact, and useful on mobile without changing the approved brand palette, official header logo, review-first hierarchy, business details, links, consent model, or analytics policy.

## Approved Changes

### Hero headline

Render the headline as two intentional lines at every supported viewport:

```text
How was
your visit?
```

Keep “your visit?” in coral italics and prevent the browser from creating a third or unbalanced line. The Google Review CTA remains the only primary external action.

### Compact social shortcuts

Place one compact icon row immediately below the Google Review CTA and before the small thank-you note. Include exactly four shortcuts in this order:

1. Instagram
2. Facebook
3. Tripadvisor
4. WhatsApp

Each shortcut uses a bundled, monochrome recognizable mark with a visible platform name available to assistive technology. The visual icon stays small, while the complete interactive target is at least 48 by 48 CSS pixels. No third-party icon request or tracking widget is allowed.

### Testimonial proof

Show exactly two existing owner-approved excerpts:

- Ankita S. — Google review
- Traveller — Tripadvisor

Remove the Jennylynn B. card from the review-hub configuration and output. Reduce testimonial padding, quote size, and section spacing so the social-proof band is substantially shorter on mobile while preserving readability and attribution.

### Business trust block

Remove the decorative circular `B` marker completely. Reflow the remaining eyebrow, heading, address, hours, and website link into a clean aligned composition. Do not change the official logo in the page header.

### Owner-supplied QR

Use the exact owner-supplied PNG from `C:/Users/v-bes/Downloads/The B Review QR.png`. The source image decodes to:

`https://www.thebsclub.ch/review/`

Copy it into the review-hub source and build output without editing its black-and-white modules or central B’s logo. Display the PNG at its intrinsic square ratio with `height: auto`, a compact mobile maximum width, reduced card padding, and reduced gap before the sharing copy. The large blank area caused by the HTML height hint overriding CSS must not recur.

Remove or replace download controls that would expose a different generated QR design. The displayed and downloadable PNG must be the same approved file.

## Responsive and Accessibility Contract

- No horizontal overflow at 320 CSS pixels.
- The complete Google Review CTA remains visible in the first viewport at 360×800 and 390×844.
- The hero remains exactly two lines at 320, 360, 390, 768, 1366, and 1440 pixel widths.
- Social shortcuts expose accessible names and have minimum 48-pixel targets.
- The supplied QR renders as a square; its computed height must equal its computed width within one pixel.
- Reduced-motion and focus-visible behaviour remain unchanged.
- External HTTP anchors retain `target="_blank"` and `rel="noopener noreferrer"`.

## Verification

Use test-driven changes to cover the two-line headline, exact two-testimonial configuration, absence of the trust marker, social shortcut order and targets, supplied QR equality/decoded URL, and compact square QR layout. Rebuild the hub, run all review and root suites, inspect mobile and desktop screenshots, then deploy through the existing GitHub Pages workflow only after verification passes.
