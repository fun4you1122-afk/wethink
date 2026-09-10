# WeThink business card — print file

`wethink-card-a.pdf` — **page 1 front, page 2 back.**

## Specification

| | |
|---|---|
| Trim | **85 × 55 mm** (international standard) |
| Document | 91 × 61 mm — trim plus **3 mm bleed** on every edge |
| Pages | 2, front then back |
| Colour | RGB — convert to your own CMYK profile |
| Fonts | embedded TrueType subsets, no Type3, nothing to supply |
| Safe margin | 4 mm — no text or mark sits closer to the trim |

## Stock and finish

**350–400 gsm, soft-touch or matt laminate. Not gloss.**

This is not a preference. The card is a deep purple across both sides, and a
gloss laminate on a dark ground behaves like a mirror: every fingerprint
shows, and the first person to hand one over leaves a thumbprint on it.
Soft-touch suits it best and feels the part. A spot UV on the logo mark
would catch the light against the matt if the budget allows.

Please send a proof before the run. The purple is the design, and dark
solids are where presses differ most.

## What is on it

- **Front:** the mark, WETHINK, and Think · Plan · Grow.
- **Back:** the five service lines, a QR to the company profile, WhatsApp,
  email, website and Instagram, then the location and the slogan.

The QR opens `wethink.ae/company-profile`, is generated at error correction
M and prints **19 mm** across, dark on a white plate so it reads against the
purple. It is decoded back out of the rendered artwork on every build.

The service lines are read from `lib/services.ts` at build time, so the card
cannot drift from the website.

## Rebuilding

    CARD_OPTION=A node scripts/card/options-pdf.mjs   # this file
    node scripts/card/options-pdf.mjs                 # all three options

The build refuses to write a file if anything strays inside the safe margin
or if the QR does not decode back to its own URL.
