/* ────────────────────────────────────────────────────────────
   Fill in the stand's own footer rather than replacing it.

   The strip in the artwork is a photographed 3D plate and it looks the
   part; what it lacks is the information. Its icons carry no labels and
   two of its cells are empty. So this lays type and a QR into the cells
   that are already there, and leaves the plate alone.

   Positions are measured off the artwork. The page is one point per
   pixel, so the numbers below are both.

     PYLIBS=<path to pypdf> node scripts/standee/fill.mjs
   ──────────────────────────────────────────────────────────── */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import QRCode from 'qrcode'
import { globeGlyph, mailGlyph, phoneGlyph } from '../posters/ornament.mjs'
import jsQR from 'jsqr'
import { chromium } from 'playwright-core'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'public/standee')
mkdirSync(OUT, { recursive: true })

const SRC = '/root/.claude/uploads/439b44da-b9ba-5210-9045-911a288ff5d9/94421fdb-EDT_180a_compressed.pdf'
const PAGE = { w: 3392, h: 4650 }

/* The plate's printed dividers sit at x 1421, 1759, 2116, 2411, 2725 and
   3185, which spaces the cells unevenly and crowds the labels. The face is
   flat white there (sampled 247-253), so the band right of the wordmark is
   covered and relaid in five even columns instead. */
const BAND = { x0: 1432, x1: 3186, y0: 4196, y1: 4506 }
const COLS = 5
const COL_W = (BAND.x1 - BAND.x0) / COLS
const centre = (i) => BAND.x0 + COL_W * (i + 0.5)

const ICON_Y = 4292          // centre of the icon discs
const LABEL_Y = 4408         // centre of the label line beneath them
const MID_Y = 4340           // vertical centre of the taller cells

const QR_URL = 'https://www.wethink.ae/WeThink-Company-Profile.pdf'

/* The artwork is one point per pixel, but a browser lays out in CSS pixels
   and prints them at 0.75 pt each. Placing things in px therefore lands them
   at three-quarter scale in the wrong place: present in the file, invisible
   where you look for them. Millimetres survive the conversion, so every
   position below is converted from the measured pixel once, here. */
const MM = (pt) => `${(pt * 25.4 / 72).toFixed(3)}mm`
const INK = '#16204A'

const font = (f) => readFileSync(path.join(ROOT, 'public/fonts', f)).toString('base64')
const MARK = readFileSync(path.join(ROOT, 'public/wethink-logo.png')).toString('base64')

const qr = await QRCode.toString(QR_URL, {
  type: 'svg', margin: 0, errorCorrectionLevel: 'H',
  color: { dark: INK, light: '#00000000' },
})

const label = (x, text) => `
  <div class="lb" style="left:${MM(x)};top:${MM(LABEL_Y)}">${text}</div>`

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'O';src:url(data:font/ttf;base64,${font('OpenSans-SemiBold.ttf')}) format('truetype');font-weight:600;font-display:block}
@font-face{font-family:'P';src:url(data:font/ttf;base64,${font('Poppins-SemiBold.ttf')}) format('truetype');font-weight:600;font-display:block}
@page{size:${(PAGE.w / 72 * 25.4).toFixed(3)}mm ${(PAGE.h / 72 * 25.4).toFixed(3)}mm;margin:0}
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{width:${MM(PAGE.w)};height:${MM(PAGE.h)};background:transparent;position:relative}
.band{position:absolute;left:${MM(BAND.x0)};top:${MM(BAND.y0)};
  width:${MM(BAND.x1 - BAND.x0)};height:${MM(BAND.y1 - BAND.y0)};
  background:linear-gradient(180deg,#FDFDFD 0%,#F8F8F8 34%,#F8F8F8 100%)}
.rule{position:absolute;top:${MM(BAND.y0 + 30)};height:${MM(BAND.y1 - BAND.y0 - 60)};
  width:${MM(1.6)};background:#E2E4EA}
.col{position:absolute;transform:translateX(-50%);text-align:center}
.disc{width:${MM(96)};height:${MM(96)};border-radius:50%;background:#EDEFF5;
  display:flex;align-items:center;justify-content:center;margin:0 auto}
.disc .gl{display:block;width:${MM(50)};height:${MM(50)}}
.lb{position:absolute;transform:translate(-50%,-50%);white-space:nowrap;
  font-family:'O';font-weight:600;font-size:${MM(36)};color:${INK};letter-spacing:${MM(0.4)}}
.qr{position:absolute;transform:translate(-50%,-50%);
  width:${MM(236)};height:${MM(236)};padding:${MM(9)};background:#fff;border-radius:${MM(16)}}
.qr svg{width:100%;height:100%;display:block}
.qr .mid{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:${MM(54)};height:${MM(54)};background:#fff;border-radius:${MM(9)};padding:${MM(5)}}
.qr .mid img{width:100%;height:100%;object-fit:contain;display:block}
.build{position:absolute;transform:translate(-50%,-50%);text-align:center;
  font-family:'P';font-weight:600;font-size:${MM(36)};line-height:1.45;
  letter-spacing:${MM(3)};text-transform:uppercase;color:#6E7488}
</style></head><body>
<div class="band"></div>
${[1, 2, 3, 4].map((i) => `<div class="rule" style="left:${MM(BAND.x0 + COL_W * i)}"></div>`).join('')}

${[
  [mailGlyph({ fill: '#2B7FF5' }), 'info@wethink.ae'],
  [phoneGlyph({ fill: '#2B7FF5' }), '+971 50 312 5078'],
  [globeGlyph({ fill: '#3730C4' }), 'wethink.ae'],
].map(([glyph, text], i) => `
  <div class="col" style="left:${MM(centre(i))};top:${MM(ICON_Y - 48)}">
    <span class="disc">${glyph}</span>
  </div>
  <div class="lb" style="left:${MM(centre(i))};top:${MM(LABEL_Y)}">${text}</div>`).join('')}

<div class="qr" style="left:${MM(centre(3))};top:${MM(MID_Y)}">${qr}
  <span class="mid"><img src="data:image/png;base64,${MARK}" alt=""></span>
</div>
<div class="build" style="left:${MM(centre(4))};top:${MM(MID_Y)}">Let&rsquo;s build<br>together</div>
</body></html>`

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: PAGE.w, height: PAGE.h } })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(300)

const shot = await page.locator('.qr').screenshot()
const px = await page.evaluate(async (b64) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode()
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height
  const x = c.getContext('2d'); x.drawImage(img, 0, 0)
  const d = x.getImageData(0, 0, c.width, c.height)
  return { data: Array.from(d.data), w: c.width, h: c.height }
}, shot.toString('base64'))
const decoded = jsQR(Uint8ClampedArray.from(px.data), px.w, px.h)
console.log(decoded ? `QR → ${decoded.data}` : 'QR DID NOT DECODE')
if (!decoded || decoded.data !== QR_URL) { await browser.close(); process.exit(1) }

writeFileSync(path.join(OUT, 'fill-overlay.html'), html)
await page.pdf({
  path: path.join(OUT, 'fill-overlay.pdf'),
  width: `${(PAGE.w / 72 * 25.4).toFixed(3)}mm`, height: `${(PAGE.h / 72 * 25.4).toFixed(3)}mm`,
  printBackground: false, preferCSSPageSize: true,
})
await page.screenshot({ path: path.join(OUT, 'fill-overlay.png'), omitBackground: true })
await browser.close()

console.log(execFileSync('python3', ['-c', `
import sys, os
sys.path.insert(0, os.environ['PYLIBS'])
import pypdfium2 as pdfium
from pypdf import PdfReader, PdfWriter
src = PdfReader(${JSON.stringify(SRC)})
ov  = PdfReader('public/standee/fill-overlay.pdf')
page = src.pages[0]
page.merge_page(ov.pages[0])
w = PdfWriter(); w.add_page(page)
out = 'public/standee/marhaba-stand-final.pdf'
with open(out, 'wb') as f: w.write(f)
r = PdfReader(out); p = r.pages[0]
mm = lambda pt: float(pt)*25.4/72
objs = [ref.get_object() for ref in p['/Resources']['/XObject'].get_object().values()]
imgs = [(int(o['/Width']), int(o['/Height'])) for o in objs if o.get('/Subtype') == '/Image']
print('page %.1f x %.1f cm' % (mm(p.mediabox.width)/10, mm(p.mediabox.height)/10))
print('images:', imgs)
print('size:', os.path.getsize(out)//1024, 'KB')

# Check what a viewer will actually show, not what the markup said.
# Positioning in CSS pixels once put all of this at three-quarter scale and
# off the plate: present in the file, invisible on the page.
img = pdfium.PdfDocument(out)[0].render(scale=1.0).to_pil()
qr = img.crop((2411, 4230, 2725, 4520)).convert('L')
dark = sum(1 for v in qr.getdata() if v < 128) / (qr.width * qr.height)
lab = img.crop((1450, 4390, 2400, 4470)).convert('L')
ink = sum(1 for v in lab.getdata() if v < 128) / (lab.width * lab.height)
print('rendered page: QR cell %.0f%% ink, label row %.1f%% ink' % (dark*100, ink*100))
assert dark > 0.15, 'the QR is not on the rendered page'
assert ink  > 0.01, 'the contact labels are not on the rendered page'
print('overlay confirmed on the rendered page')
`], { encoding: 'utf8' }))
