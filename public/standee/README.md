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

---

# Merged, first attempt: strip replaced (superseded)

`marhaba-stand-with-footer.pdf` is the stand artwork with the new strip laid
over the old one, as a single page.

- **119.7 × 164.0 cm.** That is the artwork's own size, not the 120 × 180 the
  stand was described as. Reaching 180 cm needs taller artwork or a base
  below the print; stretching this file would only spread the same pixels.
- The strip is laid on with pypdf rather than by re-rendering the page, so
  the stand's photograph passes through **byte for byte**: one DCTDecode
  image in, one out, no second JPEG generation on a file already compressed
  twice.
- The strip stays vector inside the composite: three embedded TrueType
  subsets, no Type3. It will out-resolve the artwork it sits on.
- The QR prints about **9.1 cm** across, far more than a phone needs.

## Rebuilding

    BLEED=0 NAME=strip-for-stand OUTDIR=public/standee \
      node scripts/standee/footer.mjs 1054.68 160.87
    PYLIBS=<path to pypdf> node scripts/standee/stand.mjs

The footprint is measured in `stand.mjs`: the old strip's box plus 40 px at
the top, because the previous logo's white halo rose 33 px above the plate
and peeked out from behind the new one.

## Still outstanding on the stand artwork

- The sign reads **"Marhba Thailand"**. It is missing an "a".
- The artwork is 72 dpi at this size, against 100–150 for large format.
  Only a higher-resolution re-export fixes that.


---

# Final: the stand's own footer, filled in

`marhaba-stand-final.pdf`.

Replacing the strip was the wrong instinct. The one in the artwork is a
photographed 3D plate with a moulded edge, a shaped cut-out around the
logo and a shadow; a flat vector rectangle cannot match that and looked
worse beside it. What the plate lacked was information, not design: its
icons carried no labels and two of its cells were empty.

So this leaves the plate untouched and lays type and a code into the cells
that were already there:

| Cell centre (px) | Content |
|---|---|
| 1590 | info@wethink.ae |
| 1937 | +971 50 312 5078 |
| 2263 | wethink.ae |
| 2568 | QR to the company profile PDF |
| 2955 | Let's build together |

Cell centres come from the plate's own divider rules, measured off the
artwork at x 1421, 1759, 2116, 2411, 2725 and 3185. The page is one point
per pixel, so those numbers are both.

The added type and the QR are vector and merge onto the original page
without re-rendering it, so the photograph passes through byte for byte:
one DCTDecode image in, one out. The QR prints about 7.5 cm across.

    PYLIBS=<path to pypdf> node scripts/standee/fill.mjs
