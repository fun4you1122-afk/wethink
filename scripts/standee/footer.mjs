/* ────────────────────────────────────────────────────────────
   The WeThink signature strip, as a standalone printed piece.

   It mounts raised on the Marhaba stand, so it is its own die-cut
   shape rather than part of the stand artwork. Everything is drawn:
   type, glyphs, the sweep and the QR are all vector, so the strip
   stays sharp whatever size it is cut at. That matters here, because
   the stand art it sits on is a 72 dpi raster.

     node scripts/standee/footer.mjs [widthMm] [heightMm]

   ──────────────────────────────────────────────────────────── */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import jsQR from 'jsqr'
import { chromium } from 'playwright-core'
import { globeGlyph, mailGlyph, phoneGlyph } from '../posters/ornament.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'public/standee')
mkdirSync(OUT, { recursive: true })

const W = Number(process.argv[2] ?? 1200)   // mm, the stand is 120 cm wide
const H = Number(process.argv[3] ?? 170)    // mm
const BLEED = 3

const WT = { ink: '#0B1235', cyan: '#03CFF2', blue: '#108FFC', violet: '#983CFC', grey: '#7A7F92' }
const QR_URL = 'https://www.wethink.ae/WeThink-Company-Profile.pdf'

const font = (f) => readFileSync(path.join(ROOT, 'public/fonts', f)).toString('base64')
const MARK = readFileSync(path.join(ROOT, 'public/wethink-logo.png')).toString('base64')

/* everything scales off the width, so a different size needs no redesign */
const k = W / 1200
const u = (mm) => `${(mm * k).toFixed(2)}mm`

const qr = await QRCode.toString(QR_URL, {
  type: 'svg', margin: 0, errorCorrectionLevel: 'H',
  color: { dark: WT.ink, light: '#00000000' },
})

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'P';src:url(data:font/ttf;base64,${font('Poppins-SemiBold.ttf')}) format('truetype');font-weight:600;font-display:block}
@font-face{font-family:'P';src:url(data:font/ttf;base64,${font('Poppins-Bold.ttf')}) format('truetype');font-weight:700;font-display:block}
@font-face{font-family:'O';src:url(data:font/ttf;base64,${font('OpenSans-Regular.ttf')}) format('truetype');font-weight:400;font-display:block}
@font-face{font-family:'O';src:url(data:font/ttf;base64,${font('OpenSans-SemiBold.ttf')}) format('truetype');font-weight:600;font-display:block}
@font-face{font-family:'O';src:url(data:font/ttf;base64,${font('OpenSans-Bold.ttf')}) format('truetype');font-weight:700;font-display:block}

@page{size:${W + BLEED * 2}mm ${H + BLEED * 2}mm;margin:0}
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{width:${W + BLEED * 2}mm;height:${H + BLEED * 2}mm;font-family:'O',sans-serif}

/* the bleed carries the plate colour past the trim so the die cut cannot
   expose a white sliver at the edge */
body{background:#fff}
.plate{position:absolute;left:${BLEED}mm;top:${BLEED}mm;width:${W}mm;height:${H}mm;
  background:#fff;border-radius:${u(26)};overflow:hidden}

.row{position:absolute;left:${u(34)};right:${u(34)};top:${u(16)};
  display:flex;align-items:center;height:${u(116)}}
.cell{display:flex;align-items:center;justify-content:center;gap:${u(14)};
  padding:0 ${u(20)};border-right:${u(1)} solid #D3D6E0;height:100%}
.cell:first-child{padding-left:0}
.cell:last-child{border-right:none;padding-right:0}
.grow{flex:1 1 0;min-width:0}

.mark{height:${u(116)};width:auto;display:block}
.name{font-family:'P';font-weight:700;font-size:${u(50)};color:${WT.ink};line-height:.92;
  letter-spacing:${u(7)};text-transform:uppercase;padding-left:${u(7)};margin-right:-${u(7)}}
.tag{font-family:'P';font-weight:600;font-size:${u(13)};color:${WT.ink};letter-spacing:${u(4.6)};
  text-transform:uppercase;margin-top:${u(11)};white-space:nowrap;padding-left:${u(4.6)}}
.tag i{font-style:normal;font-size:${u(17)};line-height:0;vertical-align:-${u(1)};margin:0 ${u(2)}}

.ct{display:flex;flex-direction:column;align-items:center;gap:${u(9)}}
.ring{width:${u(46)};height:${u(46)};border-radius:50%;background:#EEF1F8;
  display:flex;align-items:center;justify-content:center}
.gl{display:block;width:${u(24)};height:${u(24)}}
.lb{font-size:${u(15)};font-weight:600;color:${WT.ink};white-space:nowrap}

.qr{padding:${u(4)};border-radius:${u(11)};
  background:linear-gradient(140deg,${WT.cyan},${WT.blue} 45%,${WT.violet})}
.qr .code{position:relative;width:${u(104)};height:${u(104)};padding:${u(5)};
  background:#fff;border-radius:${u(8)}}
.qr .code svg{width:100%;height:100%;display:block}
.qr .mid{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:${u(23)};height:${u(23)};background:#fff;border-radius:${u(4)};padding:${u(2)}}
.qr .mid img{width:100%;height:100%;object-fit:contain;display:block}

.build{font-family:'P';font-weight:600;font-size:${u(16)};color:${WT.grey};
  letter-spacing:${u(2.6)};text-transform:uppercase;line-height:1.45;text-align:right;white-space:nowrap}

.sweep{position:absolute;left:${u(8)};right:${u(8)};bottom:${u(7)};height:${u(26)}}
.sweep svg{width:100%;height:100%;display:block}
</style></head><body>
<div class="plate">
  <div class="row">
    <div class="cell">
      <img class="mark" src="data:image/png;base64,${MARK}" alt="">
      <div>
        <div class="name">WeThink</div>
        <div class="tag">Think <i style="color:${WT.cyan}">•</i> Plan <i style="color:${WT.violet}">•</i> Grow</div>
      </div>
    </div>

    <div class="cell grow"><span class="ct">
      <span class="ring">${mailGlyph({ fill: WT.blue })}</span>
      <span class="lb">info@wethink.ae</span></span></div>

    <div class="cell grow"><span class="ct">
      <span class="ring">${phoneGlyph({ fill: WT.blue })}</span>
      <span class="lb">+971 50 312 5078</span></span></div>

    <div class="cell grow"><span class="ct">
      <span class="ring">${globeGlyph({ fill: WT.blue })}</span>
      <span class="lb">wethink.ae</span></span></div>

    <div class="cell">
      <div class="qr"><div class="code">${qr}
        <span class="mid"><img src="data:image/png;base64,${MARK}" alt=""></span>
      </div></div>
    </div>

    <div class="cell"><div class="build">Let&rsquo;s build<br>together</div></div>
  </div>

  <div class="sweep">
    <svg viewBox="0 0 1184 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs><linearGradient id="sw" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${WT.cyan}"/><stop offset=".34" stop-color="${WT.blue}"/>
        <stop offset=".58" stop-color="#3963FC"/><stop offset=".78" stop-color="#6949FC"/>
        <stop offset="1" stop-color="${WT.violet}"/>
      </linearGradient></defs>
      <path d="M5 2 V14 Q5 27 18 27 H1166 Q1179 27 1179 14 V2"
        fill="none" stroke="url(#sw)" stroke-width="10" stroke-linecap="round"/>
    </svg>
  </div>
</div>
</body></html>`

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const PX = (mm) => Math.round((mm / 25.4) * 96)
const page = await browser.newPage({
  viewport: { width: PX(W + BLEED * 2), height: PX(H + BLEED * 2) },
})
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(300)

// the row must not run past the plate, and the code must actually scan
const fit = await page.evaluate(() => {
  const r = document.querySelector('.row').getBoundingClientRect()
  const s = document.querySelector('.sweep').getBoundingClientRect()
  return { rowBottom: r.bottom, sweepTop: s.top }
})
console.log(
  fit.rowBottom > fit.sweepTop
    ? `!! the row overruns the sweep by ${(fit.rowBottom - fit.sweepTop).toFixed(0)}px`
    : `row clears the sweep by ${(fit.sweepTop - fit.rowBottom).toFixed(0)}px`,
)

const shot = await page.locator('.qr .code').screenshot()
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

writeFileSync(path.join(OUT, 'wethink-footer.html'), html)
await page.pdf({
  path: path.join(OUT, 'wethink-footer.pdf'),
  width: `${W + BLEED * 2}mm`, height: `${H + BLEED * 2}mm`,
  printBackground: true, preferCSSPageSize: true,
})
await page.screenshot({ path: path.join(OUT, 'wethink-footer.png') })
await browser.close()
console.log(`\n${W} x ${H} mm trim, +${BLEED}mm bleed → public/standee/`)
