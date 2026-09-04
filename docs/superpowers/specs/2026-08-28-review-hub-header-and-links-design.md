# Review Hub Header and Link Cards Refinement

## Goal

Refine the Review Hub so its header feels continuous with the main home page, its primary review flow has more breathing room, and its utility links look intentional rather than like oversized placeholder tiles.

## Approved direction

Use the existing The B's Club colour, typography, border and motion tokens. The refinement is compact and editorial: the yellow Google Review action remains dominant, while secondary links become quieter and shorter.

## Header

- Remove the standalone circular logo currently shown at the top of the Review Hub.
- Replace the Review Hub-specific header treatment with a slim navigation treatment derived from the home page.
- Do not introduce another decorative B mark.
- Keep a clear route back to the main website and preserve accessible navigation labels.

## Hero

- Keep `How was` and `your visit?` on two deliberate lines on mobile.
- At the desktop breakpoint, render `How was your visit?` on one line.
- Preserve the coral italic emphasis on `your visit?`.
- Add 10px more vertical separation between the Google Review button and the social shortcut row. Existing tap-target dimensions remain at least 48px.

## Keep in touch cards

- Replace typographic placeholder glyphs with inline SVG icons.
- Instagram and Facebook use recognizable platform icons consistent with the shortcut icons above.
- View menu uses a clear cutlery icon.
- Uber Eats uses a delivery bag icon, avoiding an inaccurate imitation of a protected wordmark.
- On desktop, show four compact horizontal cards in one row. Each card places its icon left, copy in the middle and a small directional cue right.
- On mobile, retain a two-column layout when space allows and collapse to one column only at the narrowest supported widths.
- Reduce card height substantially from the current 172px desktop tiles while retaining comfortable 48px-plus interactive targets.
- Keep the Instagram coral and Facebook gold surfaces; keep Menu and Uber Eats on the neutral paper surface.

## Accessibility and responsive behaviour

- Every icon is decorative when the adjacent visible label provides the accessible name.
- Maintain visible keyboard focus, safe external-link attributes and reduced-motion behaviour.
- Prevent heading or card overflow at 320px, 360px, 390px, tablet and desktop widths.

## Verification

- Add contract tests before implementation for the desktop single-line headline, mobile two-line headline, 10px spacing increase, absence of the Review Hub logo and SVG-based utility icons.
- Build and run the Review Hub test suite and the root regression suite.
- Capture and inspect mobile and desktop layouts.
- Verify the deployed production page and its external-link interactions.
