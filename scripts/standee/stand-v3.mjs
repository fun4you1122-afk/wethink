/* ────────────────────────────────────────────────────────────
   The corrected stand, with a real QR in place of the decorative one.

   The artwork is embedded with img2pdf, which wraps the original JPEG
   without re-encoding it. Rendering the page through a browser instead
   would put a second lossy generation on a file that has none to spare.
   The QR is drawn as vector on top, so it is the one sharp thing on the
   sheet whatever size it prints at.

     PYLIBS=<path> node scripts/standee/stand-v2.mjs
   ──────────────────────────────────────────────────────────── */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import QRCode from 'qrcode'
import { chromium } from 'playwright-core'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'public/standee')
mkdirSync(OUT, { recursive: true })

const ART = process.env.ART ?? '/root/.claude/uploads/439b44da-b9ba-5210-9045-911a288ff5d9/5e90a303-image.jpg'
const ART_PX = { w: 1024, h: 1536 }
const TRIM = { w: 1200, h: 1800 }          // mm, the stand at 120 x 180 cm
const BLEED = 3

/* the decorative code, measured off the artwork */
const PLACEHOLDER = { x0: 883, y0: 1313, x1: 989, y1: 1427 }
const S = TRIM.w / ART_PX.w                // mm per artwork pixel

const QR_URL = 'https://www.wethink.ae/WeThink-Company-Profile.pdf'
const INK = '#16204A'

const MARK = readFileSync(path.join(ROOT, 'public/wethink-logo.png')).toString('base64')
const mm = (v) => `${v.toFixed(3)}mm`

const box = {
  x: PLACEHOLDER.x0 * S,
  y: PLACEHOLDER.y0 * S,
  w: (PLACEHOLDER.x1 - PLACEHOLDER.x0) * S,
  h: (PLACEHOLDER.y1 - PLACEHOLDER.y0) * S,
}
const side = Math.min(box.w, box.h) * 0.94

const qr = await QRCode.toString(QR_URL, {
  type: 'svg', margin: 0, errorCorrectionLevel: 'H',
  color: { dark: INK, light: '#00000000' },
})

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@page{size:${mm(TRIM.w + BLEED * 2)} ${mm(TRIM.h + BLEED * 2)};margin:0}
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{width:${mm(TRIM.w + BLEED * 2)};height:${mm(TRIM.h + BLEED * 2)};background:transparent;position:relative}
/* white backing to erase the decorative code beneath */
.patch{position:absolute;left:${mm(BLEED + box.x)};top:${mm(BLEED + box.y)};
  width:${mm(box.w)};height:${mm(box.h)};background:#fff;border-radius:${mm(box.w * 0.06)}}
.qr{position:absolute;left:${mm(BLEED + box.x + (box.w - side) / 2)};
  top:${mm(BLEED + box.y + (box.h - side) / 2)};width:${mm(side)};height:${mm(side)}}
.qr svg{width:100%;height:100%;display:block}
.mid{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:${mm(side * 0.21)};height:${mm(side * 0.21)};background:#fff;
  border-radius:${mm(side * 0.035)};padding:${mm(side * 0.018)}}
.mid img{width:100%;height:100%;object-fit:contain;display:block}
</style></head><body>
<div class="patch"></div>
<div class="qr">${qr}<span class="mid"><img src="data:image/png;base64,${MARK}" alt=""></span></div>
</body></html>`

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage()
await page.setContent(html, { waitUntil: 'load' })
await page.pdf({
  path: path.join(OUT, 'v3-overlay.pdf'),
  width: mm(TRIM.w + BLEED * 2), height: mm(TRIM.h + BLEED * 2),
  printBackground: true, preferCSSPageSize: true,
})
await browser.close()
writeFileSync(path.join(OUT, 'v3-overlay.html'), html)

console.log(execFileSync('python3', ['-c', `
import sys, os
sys.path.insert(0, os.environ['PYLIBS'])
import img2pdf, pypdfium2 as pdfium
from pypdf import PdfReader, PdfWriter, Transformation

trim_w, trim_h, bleed = ${TRIM.w}, ${TRIM.h}, ${BLEED}
pt = lambda v: v / 25.4 * 72

# the JPEG goes in untouched; img2pdf wraps it rather than re-encoding
layout = img2pdf.get_layout_fun((pt(trim_w), pt(trim_h)))
base_bytes = img2pdf.convert(${JSON.stringify(ART)}, layout_fun=layout)
open('public/standee/v3-base.pdf','wb').write(base_bytes)

base = PdfReader('public/standee/v3-base.pdf')
ov   = PdfReader('public/standee/v3-overlay.pdf')

w = PdfWriter()
page = w.add_blank_page(width=pt(trim_w + bleed*2), height=pt(trim_h + bleed*2))
page.merge_transformed_page(base.pages[0], Transformation().translate(pt(bleed), pt(bleed)))
page.merge_page(ov.pages[0])

out = 'public/standee/marhaba-stand-print.pdf'
with open(out,'wb') as f: w.write(f)

r = PdfReader(out); p = r.pages[0]
MM = lambda v: float(v)*25.4/72
objs = [ref.get_object() for ref in p['/Resources']['/XObject'].get_object().values()]
imgs = [(int(o['/Width']), int(o['/Height']), o.get('/Filter')) for o in objs if o.get('/Subtype')=='/Image']
print('page %.1f x %.1f cm (trim %.0f x %.0f cm + %dmm bleed)' % (
    MM(p.mediabox.width)/10, MM(p.mediabox.height)/10, trim_w/10, trim_h/10, bleed))
print('images:', imgs)
print('size:', os.path.getsize(out)//1024, 'KB')
`], { encoding: 'utf8' }))
