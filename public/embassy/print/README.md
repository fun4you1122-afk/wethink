# Marhaba Thailand 2026 — printed programme panels

Four panels for the Reem Mall info stands, generated from
`app/embassy/programme/schedule.ts` so the wall and the page behind the QR
code cannot disagree.

| File | Panel | QR opens |
|---|---|---|
| `main.pdf` | Main Stage | `/embassy/programme?track=main` |
| `second.pdf` | Secondary Stage | `/embassy/programme?track=second` |
| `workshop.pdf` | Workshops | `/embassy/programme?track=workshop` |
| `master.pdf` | Full Programme, all three stages | `/embassy/programme` |

`proof-*.png` are small on-screen proofs for review, not for printing.

## For the printer

- **Trim size** 450 × 1150 mm portrait. The PDFs are 456 × 1156 mm, which is
  the trim plus 3 mm bleed on every edge.
- All type is at least 16 mm clear of the trim, so the glass frame can overlap
  the edge without eating anything. Confirm the panel's visible aperture and
  this can be tightened.
- Fonts are embedded as TrueType subsets. No Type3, no live text dependencies.
- Colour is RGB. Ask the printer to convert to their own CMYK profile rather
  than converting here blind; the teal is the one colour worth a proof.
- **Stock:** 200 gsm satin or silk coated poster paper. Not gloss: the panel is
  under glass and gloss behind glass double-reflects under mall lighting.
  Keep it at or under 250 gsm so it sits flat in the frame.
- Each panel is double sided with the same artwork, so print **two copies of
  each file**: eight sheets in total.

## Rebuilding

    node scripts/posters/build.mjs             # PDFs
    node scripts/posters/build.mjs --preview   # markup only, no PDFs
    node scripts/posters/preview.mjs main      # small proof of one panel
    node scripts/posters/verify-qr.mjs         # decode every QR

Re-run after any change to the schedule.
