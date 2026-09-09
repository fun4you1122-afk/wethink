# Corrected stand, v2

`marhaba-stand-v2.pdf` — 120 × 180 cm trim plus 3 mm bleed, from the
corrected artwork (spelling fixed, 2:3 proportions that match the stand).

## What changed

The decorative QR in the footer was replaced with a real one. It opens
`wethink.ae/WeThink-Company-Profile.pdf`, is generated at error correction H
because the mark sits in its centre, and is drawn as vector, so it is the
one element on the sheet with no resolution ceiling. Decoded back out of the
rendered PDF at three sizes to confirm.

The artwork is embedded with img2pdf, which wraps the original JPEG rather
than re-encoding it. Rendering the page through a browser would have added a
second lossy generation. Verified: one DCTDecode image in the output, the
original 1024 × 1536.

## The resolution problem, in numbers

The artwork is **1024 × 1536 px**. Across 120 cm that is **21.7 dpi**.

| | |
|---|---|
| Supplied | 1024 px wide |
| Needed at 150 dpi (crisp) | 7086 px |
| Needed at 100 dpi (acceptable at 1 m) | 4724 px |
| Largest sound print from this file | about 26 × 39 cm |

This is a preview-sized export, not a print file — smaller than the previous
version, which was 3392 px. Printed at 120 × 180 cm the individual pixels
will be about 1.2 mm across and visible from several metres.

Nothing in this repository can fix that: upscaling invents detail rather than
recovering it. The artwork has to be re-exported at 7000 px or more from
whatever produced it. When it is, rerun:

    PYLIBS=<path to img2pdf, pypdf, pypdfium2> node scripts/standee/stand-v2.mjs

and update `ART_PX` to the new pixel size. The QR placement is expressed as a
fraction of the artwork, so it follows automatically.
