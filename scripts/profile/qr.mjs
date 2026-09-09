/* Branded QR codes for the company profile.

   Error correction H, because the mark sits in the middle and covers
   roughly a fifth of the code. Each one is decoded back out of the
   rendered artwork before it is written, so an unscannable code cannot
   reach a card or a slide. */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import jsQR from 'jsqr'
import { chromium } from 'playwright-core'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'public/qr')
mkdirSync(OUT, { recursive: true })

const MARK = readFileSync(path.join(ROOT, 'public/wethink-logo.png')).toString('base64')

const TARGETS = [
  { id: 'company-profile', url: 'https://www.wethink.ae/company-profile', cap: 'Company Profile' },
  { id: 'company-profile-pdf', url: 'https://www.wethink.ae/WeThink-Company-Profile.pdf', cap: 'Profile · PDF' },
]

const INK = '#2E1065'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })

for (const t of TARGETS) {
  const svg = await QRCode.toString(t.url, {
    type: 'svg', margin: 0, errorCorrectionLevel: 'H',
    color: { dark: INK, light: '#00000000' },
  })
  writeFileSync(path.join(OUT, `${t.id}.svg`), svg)

  const html = `<!doctype html><meta charset="utf-8"><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{width:900px;height:1100px;display:flex;align-items:center;justify-content:center;
      background:#fff;font-family:system-ui,sans-serif}
    .card{width:820px;padding:60px 60px 52px;border-radius:48px;background:#fff;
      box-shadow:0 0 0 3px rgba(46,16,101,.10);text-align:center}
    .code{position:relative;width:640px;height:640px;margin:0 auto}
    .code svg{width:100%;height:100%;display:block}
    .mid{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
      width:132px;height:132px;background:#fff;border-radius:26px;padding:16px;
      box-shadow:0 0 0 6px #fff}
    .mid img{width:100%;height:100%;object-fit:contain;display:block}
    .cap{margin-top:44px;font-size:40px;font-weight:800;color:${INK};letter-spacing:-.5px}
    .url{margin-top:14px;font-size:26px;color:#6B6480}
    .bar{margin-top:34px;height:10px;border-radius:10px;
      background:linear-gradient(90deg,#00B4BD,#4474E3 52%,#7840CF)}
  </style>
  <div class="card">
    <div class="code">${svg}<span class="mid"><img src="data:image/png;base64,${MARK}"></span></div>
    <div class="cap">${t.cap}</div>
    <div class="url">${t.url.replace('https://', '')}</div>
    <div class="bar"></div>
  </div>`

  const page = await browser.newPage({ viewport: { width: 900, height: 1100 }, deviceScaleFactor: 2 })
  await page.setContent(html, { waitUntil: 'load' })
  await page.waitForTimeout(250)

  // decode it back before trusting it
  const shot = await page.locator('.code').screenshot()
  const px = await page.evaluate(async (b64) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode()
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height
    const x = c.getContext('2d'); x.drawImage(img, 0, 0)
    const d = x.getImageData(0, 0, c.width, c.height)
    return { data: Array.from(d.data), w: c.width, h: c.height }
  }, shot.toString('base64'))
  const res = jsQR(Uint8ClampedArray.from(px.data), px.w, px.h)
  console.log(`${t.id.padEnd(20)} ${res ? '→ ' + res.data : '→ DID NOT DECODE'}`)
  if (!res || res.data !== t.url) { await browser.close(); process.exit(1) }

  await page.locator('.card').screenshot({ path: path.join(OUT, `${t.id}.png`) })
  // JPEG too: some phone galleries and older mail clients still prefer it.
  // Quality 96 on a white ground keeps the modules crisp; a QR is exactly the
  // kind of hard-edged art JPEG smears if you push the compression.
  await page.locator('.card').screenshot({
    path: path.join(OUT, `${t.id}.jpg`), type: 'jpeg', quality: 96,
  })
  await page.close()
}

await browser.close()
console.log('\nwritten to public/qr/')
