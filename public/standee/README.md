# WeThink signature strip — standalone piece

For mounting raised on the Marhaba Thailand stand, so it reads as a
separate plate rather than part of the stand artwork.

- **Trim** 1200 × 170 mm (120 × 17 cm). The PDF is 1206 × 176 mm, which is
  the trim plus 3 mm bleed on every edge.
- **Cut** to the rounded rectangle: 26 mm corner radius at this size.
- Everything is drawn: type, glyphs, the gradient sweep and the QR are all
  vector, so the piece stays sharp at any size it is cut at.
- Fonts are embedded as TrueType subsets. No Type3.
- The QR opens `wethink.ae/WeThink-Company-Profile.pdf` and is generated at
  error correction H, since the mark in the middle covers about a fifth of
  it. It is decoded back out of the rendered artwork on every build.
- Colour is RGB. Let the printer convert to their own CMYK profile.

## Resizing

    node scripts/standee/footer.mjs 1100 156     # width and height in mm

Every measurement scales off the width, so a different size needs no
redesign. The build refuses to write a file whose content overruns the
sweep, or whose QR will not decode.

## The one raster element

The logo mark is a 640 × 640 PNG, the largest we hold. At 116 mm tall that
prints at about 140 dpi, which is within normal large-format practice for a
piece viewed from a metre. If a vector version of the mark exists (AI, EPS
or SVG), drop it in and the strip becomes entirely vector.
