/* ────────────────────────────────────────────────────────────
   All three background candidates, both sides, in one PDF.

   Six pages at the real trim size, in order:

     1  A front   2  A back
     3  B front   4  B back
     5  C front   6  C back

   Every page is print-ready, so whichever is chosen can go straight to
   the printer; nothing here is a mock-up at the wrong scale.

     node scripts/card/options-pdf.mjs
   ──────────────────────────────────────────────────────────── */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import jsQR from 'jsqr'
import { chromium } from 'playwright-core'
import { globeGlyph, mailGlyph, whatsappGlyph, instagramGlyph } from '../posters/ornament.mjs'
import { serviceTitles } from './services.mjs'
import { pixelBurst, ghostMark, polyMesh } from './light-bg.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'public/card-print')
mkdirSync(OUT, { recursive: true })

const CARD = { w: 85, h: 55 }
const BLEED = 3
const SAFE = 4
const GAP = 2.0
const W = CARD.w + BLEED * 2
const H = CARD.h + BLEED * 2

const WT = {
  ink: '#141A3C', soft: '#5A5F7D', cyan: '#0EA5C4',
  blue: '#3B6BE0', violet: '#7C3AED', rule: 'rgba(20,26,60,.14)',
}
const QR_URL = 'https://www.wethink.ae/company-profile'
const SERVICES = serviceTitles()

const font = (f) => readFileSync(path.join(ROOT, 'public/fonts', f)).toString('base64')
const MARK = readFileSync(path.join(ROOT, 'public/wethink-logo.png')).toString('base64')

const qr = await QRCode.toString(QR_URL, {
  type: 'svg', margin: 0, errorCorrectionLevel: 'M',
  color: { dark: '#0B1235', light: '#00000000' },
})

/* each option supplies a front and a back ground; the layout is identical */
const OPTIONS = [
  { k: 'A', dark: true,
    front: `<div class="bg">${pixelBurst({ w: W, h: H, seed: 4, anchor: 'tr', ground: ['#33204D', '#2C1B43', '#3A2559'], light: false, density: 0.5, cell: 2.15, spill: 0.35, clear: { cx: W * 0.5, cy: H * 0.44, rx: W * 0.34, ry: H * 0.36 } })}</div>`,
    back:  `<div class="bg">${pixelBurst({ w: W, h: H, seed: 9, anchor: 'br', ground: ['#33204D', '#2C1B43', '#3A2559'], light: false, density: 0.5, cell: 2.15, spill: 0.25, clear: { cx: W * 0.46, cy: H * 0.5, rx: W * 0.44, ry: H * 0.42 } })}</div>` },
  { k: 'B', front: ghostMark({ w: W, h: H, mark: MARK }),
             back:  ghostMark({ w: W, h: H, mark: MARK }) },
  { k: 'C', front: `<div class="bg">${polyMesh({ w: W, h: H, seed: 5, band: 0.24 })}</div>`,
             back:  `<div class="bg">${polyMesh({ w: W, h: H, seed: 11, band: 0.15, strength: 0.7 })}</div>` },
]

const front = (bg, dark) => `<div class="side front${dark ? ' dark' : ''}">${bg}
  <div class="fc">
    <img class="mark" src="data:image/png;base64,${MARK}" alt="">
    <div class="name">WeThink</div>
    <div class="hair"></div>
    <div class="tag">Think <i style="color:${WT.cyan}">•</i> Plan <i style="color:${WT.violet}">•</i> Grow</div>
  </div>
</div>`

const back = (bg, dark) => `<div class="side back${dark ? ' dark' : ''}">${bg}
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
</div>`

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'P';src:url(data:font/ttf;base64,${font('Poppins-SemiBold.ttf')}) format('truetype');font-weight:600;font-display:block}
@font-face{font-family:'P';src:url(data:font/ttf;base64,${font('Poppins-Bold.ttf')}) format('truetype');font-weight:700;font-display:block}
@font-face{font-family:'O';src:url(data:font/ttf;base64,${font('OpenSans-Regular.ttf')}) format('truetype');font-weight:400;font-display:block}
@font-face{font-family:'O';src:url(data:font/ttf;base64,${font('OpenSans-SemiBold.ttf')}) format('truetype');font-weight:600;font-display:block}
@font-face{font-family:'O';src:url(data:font/ttf;base64,${font('OpenSans-Bold.ttf')}) format('truetype');font-weight:700;font-display:block}

@page{size:${W}mm ${H}mm;margin:0}
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{width:${W}mm;font-family:'O',sans-serif;color:${WT.ink}}
.side{position:relative;width:${W}mm;height:${H}mm;overflow:hidden;
  page-break-after:always;break-after:page}
.side:last-child{page-break-after:auto;break-after:auto}
.bg{position:absolute;inset:0}.bg svg{width:100%;height:100%;display:block}
/* option A is the dark one, so its type inverts */
.side.dark{color:#fff}
.side.dark .tag,.side.dark .foot,.side.dark .qrbox .cap{color:rgba(255,255,255,.72)}
.side.dark .eyebrow{color:#9BE3F5}
.side.dark .svc .n{color:#5BD9F0}
.side.dark .rule{background:rgba(255,255,255,.18)}
.side.dark .qrbox .code{background:#fff;padding:1.2mm;border-radius:1.5mm}

.front{display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding-bottom:7mm}
.fc{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center}
.mark{height:18mm;width:auto;display:block}
.name{margin-top:3.8mm;font-family:'P';font-weight:700;font-size:7.2mm;line-height:1;
  letter-spacing:1.15mm;text-transform:uppercase;padding-left:1.15mm}
.hair{margin-top:3.1mm;width:26mm;height:.28mm;border-radius:.28mm;
  background:linear-gradient(90deg,transparent,${WT.cyan} 22%,${WT.violet} 78%,transparent)}
.tag{margin-top:2.8mm;font-family:'P';font-weight:600;font-size:2.4mm;color:${WT.soft};
  letter-spacing:.86mm;text-transform:uppercase;padding-left:.86mm}
.tag i{font-style:normal;font-size:3mm;line-height:0;vertical-align:-.2mm;margin:0 .3mm}

.back{padding:${BLEED + SAFE}mm ${BLEED + SAFE}mm}
.back .inner{position:relative;display:flex;flex-direction:column;height:100%;
  justify-content:center;gap:${GAP}mm}
.top{display:flex;gap:4mm;align-items:flex-start}
.svc{flex:1;min-width:0}
.eyebrow{font-family:'P';font-weight:600;font-size:1.95mm;letter-spacing:.5mm;
  text-transform:uppercase;color:${WT.violet}}
.svc ul{list-style:none;margin:${GAP}mm 0 0;padding:0;display:flex;flex-direction:column;gap:${GAP}mm}
.svc li{display:flex;gap:1.6mm;align-items:baseline;font-size:2.3mm;line-height:1.08}
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
.row .t{font-size:2.4mm;font-weight:600;white-space:nowrap}
.foot{font-family:'P';font-weight:600;font-size:2.1mm;letter-spacing:.46mm;
  text-transform:uppercase;color:${WT.soft}}
</style></head><body>
${OPTIONS.map((o) => front(o.front, o.dark) + back(o.back, o.dark)).join('')}
</body></html>`

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const PX = (mm) => Math.round((mm / 25.4) * 96)
const page = await browser.newPage({ viewport: { width: PX(W), height: PX(H) }, deviceScaleFactor: 5 })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(400)

/* every side is checked, not just the first */
const safe = await page.evaluate(([bleed, safeMm]) => {
  const mm = (px) => (px / 96) * 25.4
  const bad = []
  document.querySelectorAll('.side').forEach((side, i) => {
    const card = side.getBoundingClientRect()
    side.querySelectorAll('.name,.tag,.row,.qrbox,.foot,.mark,.svc li,.eyebrow').forEach((el) => {
      const r = el.getBoundingClientRect()
      const m = Math.min(mm(r.left - card.left), mm(r.top - card.top),
                         mm(card.right - r.right), mm(card.bottom - r.bottom))
      if (m < bleed + safeMm - 0.6) bad.push(`page ${i + 1} ${el.className.split(' ')[0]} ${m.toFixed(1)}mm`)
    })
  })
  return bad
}, [BLEED, SAFE])
console.log(safe.length ? `!! inside the safe margin: ${safe.join(' | ')}`
                        : `all six sides clear the ${SAFE}mm safe margin`)

const codes = await page.locator('.qrbox .code').all()
for (const [i, c] of codes.entries()) {
  const shot = await c.screenshot()
  const px = await page.evaluate(async (b64) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode()
    const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height
    const x = cv.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, cv.width, cv.height)
    x.drawImage(img, 0, 0)
    const d = x.getImageData(0, 0, cv.width, cv.height)
    return { data: Array.from(d.data), w: cv.width, h: cv.height }
  }, shot.toString('base64'))
  const r = jsQR(Uint8ClampedArray.from(px.data), px.w, px.h)
  console.log(`  option ${OPTIONS[i].k} QR:`, r ? r.data : 'DID NOT DECODE')
  if (!r || r.data !== QR_URL) { await browser.close(); process.exit(1) }
}

writeFileSync(path.join(OUT, 'wethink-card-options.html'), html)
await page.pdf({
  path: path.join(OUT, 'wethink-card-options.pdf'),
  width: `${W}mm`, height: `${H}mm`, printBackground: true, preferCSSPageSize: true,
})
await browser.close()
console.log(`\n6 pages, ${CARD.w} x ${CARD.h} mm trim + ${BLEED}mm bleed → public/card-print/wethink-card-options.pdf`)
