# Marhaba Thailand 2026 — printed programme panels

Five panels for the Reem Mall info stands, carrying four designs, generated from
`app/embassy/programme/schedule.ts` so the wall and the page behind the QR
code cannot disagree.

| File | Goes on | Panels | Sheets | QR opens |
|---|---|---|---|---|
| `master.pdf` | The two entrance panels | 2 | 4 | `/embassy/programme` |
| `main.pdf` | Main Stage | 1 | 2 | `/embassy/programme?track=main` |
| `second.pdf` | Secondary Stage | 1 | 2 | `/embassy/programme?track=second` |
| `workshop.pdf` | Workshop area | 1 | 2 | `/embassy/programme?track=workshop` |
| | | **5** | **10** | |

Each panel is double sided and carries the same artwork on both faces, and the
glass unscrews so a poster can be laid in behind it. That means ten separate
single sided sheets, not five printed back to back.

Each panel carries two QR codes: the large one is the Embassy's, opening the
live programme for that stage, and a small one in the WeThink block opening
`wethink.ae/?from=marhaba`, tagged so scans off these panels can be told apart
from other traffic.

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
- **Quantities:** four copies of `master.pdf`, two each of `main.pdf`,
  `second.pdf` and `workshop.pdf`. Ten sheets, all single sided. The panels
  are not printed duplex: each face has its own glass and its own sheet.
- Trim to exactly 450 × 1150 mm so the sheet drops into the frame. The 3 mm
  bleed is there to give the trimmer something to cut into.

## Rebuilding

    node scripts/posters/build.mjs             # PDFs
    node scripts/posters/build.mjs --preview   # markup only, no PDFs
    node scripts/posters/preview.mjs main      # small proof of one panel
    node scripts/posters/verify-qr.mjs         # decode every QR

Re-run after any change to the schedule.
