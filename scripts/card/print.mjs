/* ────────────────────────────────────────────────────────────
   The WeThink business card, for handing out at the festival.

   85 x 55 mm, the international standard, plus 3 mm bleed. Two pages:
   front, then back. A company card rather than a personal one, since it
   goes to attendees in quantity.

   Everything is drawn: the type, the glyphs, the sweep and the QR are
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
import { techBackdrop } from './backdrop.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'public/card-print')
mkdirSync(OUT, { recursive: true })

const CARD = { w: 85, h: 55 }      // mm, trim
const BLEED = 3
const SAFE = 4                     // mm, nothing important inside this of the trim

const WT = { ink: '#0B1235', cyan: '#03CFF2', blue: '#108FFC', violet: '#983CFC', grey: '#7A7F92' }
const QR_URL = 'https://www.wethink.ae/company-profile'

const font = (f) => readFileSync(path.join(ROOT, 'public/fonts', f)).toString('base64')
const MARK = readFileSync(path.join(ROOT, 'public/wethink-logo.png')).toString('base64')

const qr = await QRCode.toString(QR_URL, {
  type: 'svg', margin: 0, errorCorrectionLevel: 'H',
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

/* ── front: the mark on the backdrop, over a smoked plate ── */
.front{display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff}
.plate{position:absolute;left:0;right:0;top:${BLEED + 6.5}mm;height:${CARD.h - 15}mm;
  background:rgba(6,10,32,.55);backdrop-filter:blur(1px);
  border-top:.18mm solid rgba(3,207,242,.28);border-bottom:.18mm solid rgba(3,207,242,.28)}
.fc{position:relative;display:flex;flex-direction:column;align-items:center}
.mark{height:21mm;width:auto;display:block}
.name{margin-top:3.4mm;font-family:'P';font-weight:700;font-size:7.2mm;color:#fff;
  line-height:1;letter-spacing:1.15mm;text-transform:uppercase;padding-left:1.15mm}
.tag{margin-top:2.1mm;font-family:'P';font-weight:600;font-size:2.4mm;color:rgba(255,255,255,.82);
  letter-spacing:.86mm;text-transform:uppercase;padding-left:.86mm}
.tag i{font-style:normal;font-size:3mm;line-height:0;vertical-align:-.2mm;margin:0 .3mm}
.sweep{position:absolute;left:${BLEED + 4}mm;right:${BLEED + 4}mm;bottom:${BLEED + 5}mm;height:4mm}
.sweep svg{width:100%;height:100%;display:block}

/* ── back: contacts and the code, on the brand gradient ── */
.back{color:#fff;padding:${BLEED + SAFE}mm ${BLEED + SAFE}mm}
.back .inner,.back .foot{position:relative}
.back .inner{display:flex;height:100%;gap:5mm;align-items:center}
.rows{flex:1;display:flex;flex-direction:column;gap:2.9mm;min-width:0}
.row{display:flex;align-items:center;gap:2.6mm}
.row .gl{flex:0 0 auto;width:3.6mm;height:3.6mm;display:block}
.row .t{font-size:3.05mm;font-weight:600;letter-spacing:.02mm;white-space:nowrap}
.qrbox{flex:0 0 auto;text-align:center}
.qrbox .code{position:relative;width:23mm;height:23mm;background:#fff;
  padding:1.5mm;border-radius:1.8mm}
.qrbox .code svg{width:100%;height:100%;display:block}
.qrbox .cap{margin-top:1.7mm;font-family:'P';font-weight:600;font-size:1.85mm;
  letter-spacing:.42mm;text-transform:uppercase;color:rgba(255,255,255,.72);white-space:nowrap}
.back .foot{position:absolute;left:${BLEED + SAFE}mm;bottom:${BLEED + 4.4}mm;
  font-family:'P';font-weight:600;font-size:2.2mm;letter-spacing:.5mm;
  text-transform:uppercase;color:rgba(255,255,255,.6)}
</style></head><body>

<div class="side front">
  <div class="bg">${techBackdrop({ w: W, h: H, seed: 7 })}</div>
  <div class="plate"></div>
  <div class="fc">
    <img class="mark" src="data:image/png;base64,${MARK}" alt="">
    <div class="name">WeThink</div>
    <div class="tag">Think <i style="color:${WT.cyan}">•</i> Plan <i style="color:${WT.violet}">•</i> Grow</div>
  </div>
  <div class="sweep">
    <svg viewBox="0 0 77 4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs><linearGradient id="s1" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${WT.cyan}"/><stop offset=".36" stop-color="${WT.blue}"/>
        <stop offset=".64" stop-color="#3963FC"/><stop offset="1" stop-color="${WT.violet}"/>
      </linearGradient></defs>
      <path d="M.8 .8 V1.8 Q.8 3.4 2.4 3.4 H74.6 Q76.2 3.4 76.2 1.8 V.8"
        fill="none" stroke="url(#s1)" stroke-width="1.1" stroke-linecap="round"/>
    </svg>
  </div>
</div>

<div class="side back">
  <div class="bg">${techBackdrop({ w: W, h: H, seed: 23, dense: 0.85 })}</div>
  <div class="inner">
    <div class="rows">
      <div class="row">${whatsappGlyph({ fill: '#5BE9A6' })}<span class="t">+971 50 312 5078</span></div>
      <div class="row">${mailGlyph({ fill: '#7FC4FF' })}<span class="t">info@wethink.ae</span></div>
      <div class="row">${globeGlyph({ fill: '#7FC4FF' })}<span class="t">wethink.ae</span></div>
      <div class="row">${instagramGlyph({ fill: '#E9A6FF' })}<span class="t">@wethink.ae</span></div>
    </div>
    <div class="qrbox">
      <div class="code">${qr}</div>
      <div class="cap">Our profile</div>
    </div>
  </div>
  <div class="foot">Abu Dhabi, UAE &nbsp;·&nbsp; Let&rsquo;s build together</div>
</div>

</body></html>`

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const PX = (mm) => Math.round((mm / 25.4) * 96)
const page = await browser.newPage({ viewport: { width: PX(W), height: PX(H) } })
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
