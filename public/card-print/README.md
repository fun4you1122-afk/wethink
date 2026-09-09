# WeThink business card

`wethink-card.pdf` — two pages, front then back.

- **85 × 55 mm trim**, the international standard, plus **3 mm bleed**
  (the PDF measures 91 × 61 mm).
- **4 mm safe margin.** Nothing important sits closer to the trim than that,
  and the build fails if anything does.
- Everything is vector: type, glyphs, the sweep and the QR. Fonts are
  embedded as TrueType subsets, no Type3.
- The QR opens `wethink.ae/company-profile`, at error correction H, printed
  **23 mm** across. Dark modules on a white ground rather than the reverse:
  inverted codes are not universally read, and dark ink spreads on press.
  Decoded out of the rendered artwork on every build.
- Colour is RGB. Let the printer convert to their own CMYK profile; the
  gradient on the back is the one thing worth a proof.

## Suggested stock

350–400 gsm, matt laminate. Matt keeps the deep gradient on the back from
showing fingerprints, which gloss will. A spot UV on the mark is an option
if the budget allows.

## Rebuilding

    node scripts/card/print.mjs
