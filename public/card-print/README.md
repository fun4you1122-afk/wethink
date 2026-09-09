# WeThink business card

`wethink-card.pdf` — two pages, front then back.

- **85 × 55 mm trim**, the international standard, plus **3 mm bleed**
  (the PDF measures 91 × 61 mm).
- **4 mm safe margin.** Nothing important sits closer to the trim than that,
  and the build fails if anything does.
- Everything is vector: type, glyphs, the sweep, the backdrop and the QR.
  Fonts are embedded as TrueType subsets, no Type3.
- The backdrop is drawn, not placed: a constellation of linked nodes, a
  fading dot field, arc hatching and a few shards over a dark ground with a
  soft diagonal split. Its randomness is seeded, so a rebuild produces the
  identical card rather than a new arrangement.
- The back carries the five service lines, read at build time from
  `lib/services.ts`, so the card cannot disagree with the website.
- The QR opens `wethink.ae/company-profile`, at error correction M and printed
  **19 mm** across. M rather than H because nothing is overlaid on it: H would
  pack in far more modules at the same size, making each one harder to read. Dark modules on a white ground rather than the reverse:
  inverted codes are not universally read, and dark ink spreads on press.
  Decoded out of the rendered artwork on every build.
- Colour is RGB. Let the printer convert to their own CMYK profile; the
  gradient on the back is the one thing worth a proof.

## Suggested stock

350–400 gsm, **matt** laminate. Both sides are dark, and gloss on a dark
card shows every fingerprint. Soft-touch is better still if the budget
allows. A spot UV on the mark would catch the light against the matt.

Ask the printer for a proof: dark grounds with fine cyan linework are where
presses differ most, and the constellation lines are 0.14 mm.

## Rebuilding

    node scripts/card/print.mjs
