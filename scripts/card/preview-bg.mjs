/* Renders the front on each candidate background, so the choice is made
   by looking rather than by description. */
import { readFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { pixelBurst, ghostMark, polyMesh } from './light-bg.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'public/card-print')
mkdirSync(OUT, { recursive: true })

const W = 91, H = 61, BLEED = 3
const font = (f) => readFileSync(path.join(ROOT, 'public/fonts', f)).toString('base64')
const MARK = readFileSync(path.join(ROOT, 'public/wethink-logo.png')).toString('base64')

const INK = '#141A3C', SOFT = '#5A5F7D', CY = '#0EA5C4', VI = '#7C3AED'

const OPTIONS = {
  a: { label: 'A · Particle burst', bg: `<div class="bg">${pixelBurst({ w: W, h: H, seed: 4, anchor: 'tr', clear: { cx: W * 0.5, cy: H * 0.44, rx: W * 0.34, ry: H * 0.36 } })}</div>` },
  b: { label: 'B · Ghost mark', bg: ghostMark({ w: W, h: H, mark: MARK }) },
  c: { label: 'C · Polygon mesh', bg: `<div class="bg">${polyMesh({ w: W, h: H, seed: 5, band: 0.24 })}</div>` },
}

const page = (bg, dark) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'P';src:url(data:font/ttf;base64,${font('Poppins-Bold.ttf')}) format('truetype');font-weight:700}
@font-face{font-family:'P';src:url(data:font/ttf;base64,${font('Poppins-SemiBold.ttf')}) format('truetype');font-weight:600}
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{width:${W}mm;height:${H}mm}
.side{position:relative;width:${W}mm;height:${H}mm;overflow:hidden;
  display:flex;flex-direction:column;align-items:center;justify-content:center;color:${INK};
  padding-bottom:7mm}
.bg{position:absolute;inset:0}.bg svg{width:100%;height:100%;display:block}
/* option A is the dark one, so its type inverts */
.side.dark{color:#fff}
.side.dark .tag,.side.dark .foot,.side.dark .qrbox .cap{color:rgba(255,255,255,.72)}
.side.dark .eyebrow{color:#9BE3F5}
.side.dark .svc .n{color:#5BD9F0}
.side.dark .rule{background:rgba(255,255,255,.18)}
.side.dark .qrbox .code{background:#fff;padding:1.2mm;border-radius:1.5mm}
.fc{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center}
.mark{height:18mm;width:auto;display:block}
.name{margin-top:3.8mm;font-family:'P';font-weight:700;font-size:7.2mm;line-height:1;
  letter-spacing:1.15mm;text-transform:uppercase;padding-left:1.15mm}
.hair{margin-top:3.1mm;width:26mm;height:.28mm;border-radius:.28mm;
  background:linear-gradient(90deg,transparent,${CY} 22%,${VI} 78%,transparent)}
.tag{margin-top:2.8mm;font-family:'P';font-weight:600;font-size:2.4mm;color:${SOFT};
  letter-spacing:.86mm;text-transform:uppercase;padding-left:.86mm}
</style></head><body>
<div class="side${dark ? ' dark' : ''}">${bg}
  <div class="fc">
    <img class="mark" src="data:image/png;base64,${MARK}" alt="">
    <div class="name">WeThink</div>
    <div class="hair"></div>
    <div class="tag">Think <span style="color:${CY}">•</span> Plan <span style="color:${VI}">•</span> Grow</div>
  </div>
</div></body></html>`

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const PX = (mm) => Math.round((mm / 25.4) * 96)
for (const [k, o] of Object.entries(OPTIONS)) {
  const p = await b.newPage({ viewport: { width: PX(W), height: PX(H) }, deviceScaleFactor: 4 })
  await p.setContent(page(o.bg, o.dark), { waitUntil: 'load' })
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(250)
  await p.screenshot({ path: path.join(OUT, `option-${k}.png`) })
  console.log(o.label, '→', `option-${k}.png`)
  await p.close()
}
await b.close()
