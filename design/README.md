# Design canvases

Working files for Claude Design canvases. Each subdirectory holds the
`.dc.html` artboards and the `canvas.json` that lays them out; the seeded
canvas page itself is generated from them and is not tracked.

## company-profile

Three directions for the 15 slide company profile, beside the deck as it
stands today. Artboards are 1280 x 720, which is the deck's 16:9 page at
96 dpi.

| File | Artboard |
| --- | --- |
| `Current.dc.html` / `CurrentWhatWeDo.dc.html` | today's deck |
| `Main.dc.html` / `AWhatWeDo.dc.html` | A, editorial |
| `BCover.dc.html` / `BWhatWeDo.dc.html` | B, signal |
| `CCover.dc.html` / `CWhatWeDo.dc.html` | C, blocks |

Copy comes from `app/(site)/company-profile/profile-data.ts` and is
unchanged. The directions use Google Fonts so they can be judged on the
canvas; whichever is chosen gets rebuilt in `app/deck/company-profile`
with the self hosted faces, which is what the printed PDF needs.
