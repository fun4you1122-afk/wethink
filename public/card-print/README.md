# WeThink business card

`wethink-card.pdf` — two pages, front then back.

- **85 × 55 mm trim**, the international standard, plus **3 mm bleed**
  (the PDF measures 91 × 61 mm).
- **4 mm safe margin.** Nothing important sits closer to the trim than that,
  and the build fails if anything does.
- **One rhythm on the back.** A single `GAP` value spaces the blocks and the
  rows inside them, and the build prints the measured gaps so the evenness is
  checked rather than assumed.
- Everything is vector: type, glyphs, the sweep, the backdrop and the QR.
  Fonts are embedded as TrueType subsets, no Type3.
- Both backdrops are drawn, not placed, and their randomness is seeded, so a
  rebuild produces the identical card rather than a new arrangement.
  Both are the **light** theme: the same drawing in the same ramp, inverted
  in value, with the line weights raised because a hairline that reads on
  near-black vanishes on near-white.
  - **Front:** the pattern starts at the mark and moves outward — rings
    radiating from its centre, circuit traces running to the edge and
    terminating in a node. A soft scrim sits behind the lockup so nothing
    runs through the wordmark. No sweep: that motif belongs to the email
    signature and read as a footer here.
  - **Back:** a constellation of linked nodes, a fading dot field, arc
    hatching and a few shards over a soft diagonal split.
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

350–400 gsm, **matt or soft-touch**. The card is light, so fingerprints are
far less of a worry than they were on the dark version, but matt suits the
pale ground and a spot UV on the mark would catch the light against it.

Ask the printer for a proof anyway. The pattern is drawn at 0.14–0.2 mm and
sits at low opacity on a near-white ground: too light a press and it
disappears, too heavy and it competes with the type.

## Rebuilding

    node scripts/card/print.mjs
