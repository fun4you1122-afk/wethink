# Marhaba stand — print file

`marhaba-stand-print.pdf` — **120 × 180 cm trim, plus 3 mm bleed.**

## What is in it

- The artwork, prepared for large format (see below), embedded with img2pdf
  so the JPEG is wrapped rather than re-encoded a second time.
- A real QR replacing the decorative one, drawn as **vector**: it opens
  `wethink.ae/WeThink-Company-Profile.pdf`, is generated at error correction
  H because the mark sits in its centre, and prints about **11.7 cm** across.
  Decoded back out of the rendered PDF to confirm.

## What was done to the artwork, and what it cannot do

The source is a 1024 × 1536 preview export: **21.7 dpi** at this size. Detail
that was never captured cannot be recovered, and nothing here pretends
otherwise. What the chain does is stop the file getting *worse* on the way to
the printer:

    denoise (at source size) → Lanczos ×5 → gentle bilateral → unsharp

Denoising happens **before** enlargement, so the JPEG's ringing and block
noise are removed rather than magnified fivefold into the print. Sharpening
happens after, where it lands on real edges. The result is 5120 × 7680 px,
which is **108 dpi** at 120 cm.

That is inside normal large-format practice, and it is a genuinely better
starting point than letting the printer's RIP interpolate the 1024 px file
blind, because a RIP will not denoise first. It is not the same as artwork
that was 7000 px to begin with.

Settings were chosen by rendering the sign and a foliage crop through each
candidate and comparing: heavier bilateral filtering cleaned the type but
plasticised the thatch, so it was backed off.

## Rebuilding

    python3 scripts/standee/upscale.py <source.jpg> <out.jpg> 5
    ART=<out.jpg> PYLIBS=<path> node scripts/standee/stand-v3.mjs

If a higher-resolution export of the artwork ever appears, skip the upscale
and point `ART` straight at it. The QR is placed as a fraction of the
artwork, so it follows to any pixel size.
