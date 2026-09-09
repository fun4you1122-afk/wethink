/* ────────────────────────────────────────────────────────────
   The stand and the WeThink strip as one printed piece.

   The strip is laid over the old one with pypdf rather than by
   re-rendering the whole artwork, so the stand's photograph passes
   through untouched: no second JPEG generation, no further loss on a
   file that is already at 72 dpi and already compressed twice.

     PYLIBS=<path to pypdf> node scripts/standee/stand.mjs
   ──────────────────────────────────────────────────────────── */

import { execFileSync } from 'node:child_process'

const SRC = '/root/.claude/uploads/439b44da-b9ba-5210-9045-911a288ff5d9/985a19af-EDT_180a_compressed.pdf'

/* Where the old strip sits, measured off the artwork. The page is 1 point
   per pixel, so these are both. PDF y counts from the bottom. */
/* The old strip's footprint, plus 40px at the top: the previous logo carried
   a white halo that rose 33px above the plate, and without the extra the
   halo peeked out over the new one. */
const BOX = { x: 232, yTop: 4136, w: 2990, h: 456 }

console.log(execFileSync('python3', ['-c', `
import sys, os
sys.path.insert(0, os.environ['PYLIBS'])
from pypdf import PdfReader, PdfWriter, Transformation

src   = PdfReader(${JSON.stringify(SRC)})
strip = PdfReader('public/standee/strip-for-stand.pdf')

page = src.pages[0]
ph   = float(page.mediabox.height)
sp   = strip.pages[0]

box = dict(x=${BOX.x}, y_top=${BOX.yTop}, w=${BOX.w}, h=${BOX.h})
sw, sh = float(sp.mediabox.width), float(sp.mediabox.height)

# scale the strip onto the footprint, then move it into place
t = (Transformation()
     .scale(box['w'] / sw, box['h'] / sh)
     .translate(box['x'], ph - box['y_top'] - box['h']))
page.merge_transformed_page(sp, t)

w = PdfWriter()
w.add_page(page)
out = 'public/standee/marhaba-stand-with-footer.pdf'
with open(out, 'wb') as f:
    w.write(f)

r = PdfReader(out)
p = r.pages[0]
mm = lambda pt: float(pt) * 25.4 / 72
print(f"page: {mm(p.mediabox.width):.1f} x {mm(p.mediabox.height):.1f} mm "
      f"({mm(p.mediabox.width)/10:.1f} x {mm(p.mediabox.height)/10:.1f} cm)")
objs = [ref.get_object() for ref in p['/Resources']['/XObject'].get_object().values()]
imgs = [(int(o['/Width']), int(o['/Height'])) for o in objs if o.get('/Subtype') == '/Image']
print('images carried through:', imgs)
print('size:', os.path.getsize(out) // 1024, 'KB')
`], { encoding: 'utf8', env: { ...process.env } }))
