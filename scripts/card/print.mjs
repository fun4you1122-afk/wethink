/* ────────────────────────────────────────────────────────────
   The WeThink business card, for handing out at the festival.

   85 x 55 mm, the international standard, plus 3 mm bleed. Two pages:
   front, then back. A company card rather than a personal one, since it
   goes to attendees in quantity.

   Everything is drawn: the type, the glyphs, the pattern and the QR are
   vector, so it prints as sharply as the press can manage.

     node scripts/card/print.mjs
   ──────────────────────────────────────────────────────────── */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import jsQR from 'jsqr'
import { chromium } from 'playwright-core'
import { globeGlyph, mailGlyph, whatsappGlyph, instagramGlyph } from '../posters/ornament.mjs'
import { techBackdrop, orbitBackdrop } from './backdrop.mjs'
import { serviceTitles } from './services.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'public/card-print')
mkdirSync(OUT, { recursive: true })

const CARD = { w: 85, h: 55 }      // mm, trim
const BLEED = 3
const SAFE = 4                     // mm, nothing important inside this of the trim

const WT = {
  ink: '#141A3C',        // body and headings on the pale ground
  soft: '#5A5F7D',       // secondary lines
  cyan: '#0EA5C4',
  blue: '#3B6BE0',
  violet: '#7C3AED',
  rule: 'rgba(20,26,60,.14)',
}
const QR_URL = 'https://www.wethink.ae/company-profile'
const SERVICES = serviceTitles()
const GAP = 2.0   // mm, the single vertical rhythm on the back

const font = (f) => readFileSync(path.join(ROOT, 'public/fonts', f)).toString('base64')
const MARK = readFileSync(path.join(ROOT, 'public/wethink-logo.png')).toString('base64')

const qr = await QRCode.toString(QR_URL, {
  type: 'svg', margin: 0,
  // M, not H: nothing is overlaid on this code, and H would pack in far
  // more modules for the same 19mm, making each one smaller to read
  errorCorrectionLevel: 'M',
  // dark modules on a light ground: inverted codes are not universally
  // read, and on press the dark ink spreads and closes the gap further
  color: { dark: '#0B1235', light: '#00000000' },
})

const W = CARD.w + BLEED * 2
const H = CARD.h + BLEED * 2

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'P';src:url(data:font/ttf;base64,${font('Poppins-SemiBold.ttf')}) format('truetype');font-weight:600;font-display:block}
@font-face{font-family:'P';src:url(data:font/ttf;base64,${font('Poppins-Bold.ttf')}) format('truetype');font-weight:700;font-display:block}
@font-face{font-family:'O';src:url(data:font/ttf;base64,${font('OpenSans-Regular.ttf')}) format('truetype');font-weight:400;font-display:block}
@font-face{font-family:'O';src:url(data:font/ttf;base64,${font('OpenSans-SemiBold.ttf')}) format('truetype');font-weight:600;font-display:block}
@font-face{font-family:'O';src:url(data:font/ttf;base64,${font('OpenSans-Bold.ttf')}) format('truetype');font-weight:700;font-display:block}

@page{size:${W}mm ${H}mm;margin:0}
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{width:${W}mm;font-family:'O',sans-serif}
.side{position:relative;width:${W}mm;height:${H}mm;overflow:hidden;
  page-break-after:always;break-after:page}
.side:last-child{page-break-after:auto;break-after:auto}

.bg{position:absolute;inset:0}
.bg svg{width:100%;height:100%;display:block}

/* ── front: the mark at the centre of its own pattern ── */
.front{display:flex;flex-direction:column;align-items:center;justify-content:center;color:${WT.ink}}
.fc{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center}
/* a hairline under the wordmark, not the signature's sweep */
.hair{margin-top:3.1mm;width:26mm;height:.28mm;border-radius:.28mm;
  background:linear-gradient(90deg,transparent,${WT.cyan} 22%,${WT.violet} 78%,transparent)}
.mark{height:21mm;width:auto;display:block}
.name{margin-top:3.8mm;font-family:'P';font-weight:700;font-size:7.2mm;color:${WT.ink};
  line-height:1;letter-spacing:1.15mm;text-transform:uppercase;padding-left:1.15mm}
.tag{margin-top:2.8mm;font-family:'P';font-weight:600;font-size:2.4mm;color:${WT.soft};
  letter-spacing:.86mm;text-transform:uppercase;padding-left:.86mm}
.tag i{font-style:normal;font-size:3mm;line-height:0;vertical-align:-.2mm;margin:0 .3mm}

/* ── back: one rhythm down the card ──
   The blocks are laid on a single column with one gap value between them,
   and the rows inside each block share one gap too, so nothing is spaced
   by eye. GAP is the only number to change. */
.back{color:${WT.ink};padding:${BLEED + SAFE}mm ${BLEED + SAFE}mm}
.back .inner{position:relative;display:flex;flex-direction:column;height:100%;
  justify-content:center;gap:${GAP}mm}
.top{display:flex;gap:4mm;align-items:flex-start}
.svc{flex:1;min-width:0}
.eyebrow{font-family:'P';font-weight:600;font-size:1.95mm;letter-spacing:.5mm;
  text-transform:uppercase;color:${WT.violet}}
.svc ul{list-style:none;margin:${GAP}mm 0 0;padding:0;display:flex;flex-direction:column;gap:${GAP}mm}
.svc li{display:flex;gap:1.6mm;align-items:baseline;font-size:2.3mm;line-height:1.08;color:${WT.ink}}
.svc .n{flex:0 0 auto;font-family:'P';font-weight:600;font-size:1.85mm;color:${WT.cyan}}
.qrbox{flex:0 0 auto;text-align:center}
.qrbox .code{position:relative;width:19mm;height:19mm}
.qrbox .code svg{width:100%;height:100%;display:block}
.qrbox .cap{margin-top:${GAP}mm;font-family:'P';font-weight:600;font-size:1.7mm;
  letter-spacing:.36mm;text-transform:uppercase;color:${WT.soft};white-space:nowrap}
.rule{height:.16mm;background:${WT.rule}}
.rows{display:grid;grid-template-columns:1fr 1fr;gap:${GAP}mm 3.6mm}
.row{display:flex;align-items:center;gap:1.7mm;min-width:0}
.row .gl{flex:0 0 auto;width:2.7mm;height:2.7mm;display:block}
.row .t{font-size:2.4mm;font-weight:600;white-space:nowrap;color:${WT.ink}}
.foot{font-family:'P';font-weight:600;font-size:2.1mm;letter-spacing:.46mm;
  text-transform:uppercase;color:${WT.soft}}
</style></head><body>

<div class="side front">
  <div class="bg">${orbitBackdrop({ w: W, h: H, seed: 3, light: true })}</div>
  <div class="fc">
    <img class="mark" src="data:image/png;base64,${MARK}" alt="">
    <div class="name">WeThink</div>
    <div class="hair"></div>
    <div class="tag">Think <i style="color:${WT.cyan}">•</i> Plan <i style="color:${WT.violet}">•</i> Grow</div>
  </div>
</div>

<div class="side back">
  <div class="bg">${techBackdrop({ w: W, h: H, seed: 23, dense: 0.85, light: true })}</div>
  <div class="inner">
    <div class="top">
      <div class="svc">
        <div class="eyebrow">What we do</div>
        <ul>${SERVICES.map((t, i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span>${t}</li>`).join('')}</ul>
      </div>
      <div class="qrbox">
        <div class="code">${qr}</div>
        <div class="cap">Our profile</div>
      </div>
    </div>

    <div class="rule"></div>

    <div class="rows">
      <div class="row">${whatsappGlyph({ fill: '#25A06A' })}<span class="t">+971 50 312 5078</span></div>
      <div class="row">${mailGlyph({ fill: WT.blue })}<span class="t">info@wethink.ae</span></div>
      <div class="row">${globeGlyph({ fill: WT.blue })}<span class="t">wethink.ae</span></div>
      <div class="row">${instagramGlyph({ fill: WT.violet })}<span class="t">@wethink.ae</span></div>
    </div>

    <div class="rule"></div>

    <div class="foot">Abu Dhabi, UAE &nbsp;·&nbsp; Let&rsquo;s build together</div>
  </div>
</div>

</body></html>`

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const PX = (mm) => Math.round((mm / 25.4) * 96)
// a high device scale so the QR check reads the code rather than a
// 70px thumbnail of it; the PDF is rendered from print layout regardless
const page = await browser.newPage({ viewport: { width: PX(W), height: PX(H) }, deviceScaleFactor: 5 })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(300)

/* nothing important may sit inside the safe margin */
const bleedCheck = await page.evaluate(([bleed, safe, w, h]) => {
  const mm = (px) => (px / 96) * 25.4
  const bad = []
  for (const el of document.querySelectorAll('.name,.tag,.row,.qrbox,.foot,.mark')) {
    const r = el.getBoundingClientRect()
    const card = el.closest('.side').getBoundingClientRect()
    const l = mm(r.left - card.left), t = mm(r.top - card.top)
    const rr = mm(card.right - r.right), bb = mm(card.bottom - r.bottom)
    const m = Math.min(l, t, rr, bb)
    if (m < bleed + safe - 0.6) bad.push(`${el.className.split(' ')[0]} ${m.toFixed(1)}mm`)
  }
  return bad
}, [BLEED, SAFE, W, H])
console.log(bleedCheck.length ? `!! too close to the trim: ${bleedCheck.join(', ')}`
                              : `all content clears the ${SAFE}mm safe margin`)

const rhythm = await page.evaluate(() => {
  const mm = (px) => (px / 96) * 25.4
  const blocks = [...document.querySelectorAll('.back .inner > *')]
  const gaps = []
  for (let i = 1; i < blocks.length; i++) {
    gaps.push(+mm(blocks[i].getBoundingClientRect().top -
                  blocks[i - 1].getBoundingClientRect().bottom).toFixed(2))
  }
  const items = [...document.querySelectorAll('.svc li')]
  const li = []
  for (let i = 1; i < items.length; i++) {
    li.push(+mm(items[i].getBoundingClientRect().top -
                items[i - 1].getBoundingClientRect().bottom).toFixed(2))
  }
  return { blocks: gaps, services: li }
})
console.log('block gaps (mm):', rhythm.blocks.join(', '))
console.log('service gaps (mm):', rhythm.services.join(', '))

const shot = await page.locator('.qrbox .code').screenshot()
const px = await page.evaluate(async (b64) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode()
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height
  const x = c.getContext('2d')
  x.fillStyle = '#ffffff'; x.fillRect(0, 0, c.width, c.height)
  x.drawImage(img, 0, 0)
  const d = x.getImageData(0, 0, c.width, c.height)
  return { data: Array.from(d.data), w: c.width, h: c.height }
}, shot.toString('base64'))
const decoded = jsQR(Uint8ClampedArray.from(px.data), px.w, px.h)
console.log(decoded ? `QR → ${decoded.data}` : 'QR DID NOT DECODE')
if (!decoded || decoded.data !== QR_URL) { await browser.close(); process.exit(1) }

writeFileSync(path.join(OUT, 'wethink-card.html'), html)
await page.pdf({
  path: path.join(OUT, 'wethink-card.pdf'),
  width: `${W}mm`, height: `${H}mm`, printBackground: true, preferCSSPageSize: true,
})
const sides = await page.locator('.side').all()
for (const [i, s] of sides.entries()) {
  await s.screenshot({ path: path.join(OUT, `wethink-card-${i ? 'back' : 'front'}.png`) })
}
await browser.close()
console.log(`\n${CARD.w} x ${CARD.h} mm trim, +${BLEED}mm bleed → public/card-print/`)
