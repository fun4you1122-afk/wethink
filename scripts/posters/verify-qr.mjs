/* Decodes the QR out of each rendered panel, at the size it will print,
   so a bad code is caught here rather than at the info stand. */
import { chromium } from 'playwright-core'
import jsQR from 'jsqr'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public/embassy/print')
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
let bad = 0
for (const id of ['main', 'second', 'workshop', 'master']) {
  const p = await b.newPage({ viewport: { width: 1723, height: 4369 } })
  await p.goto('file://' + path.join(OUT, `${id}.html`))
  await p.evaluate(() => document.fonts.ready)
  for (const sel of ['.qr', '.sigqr .code']) {
  const el = p.locator(sel)
  const buf = await el.screenshot()
  const { data, width, height } = await p.evaluate(async (b64) => {
    const img = new Image()
    img.src = 'data:image/png;base64,' + b64
    await img.decode()
    const c = document.createElement('canvas')
    c.width = img.width; c.height = img.height
    const x = c.getContext('2d')
    x.drawImage(img, 0, 0)
    const d = x.getImageData(0, 0, c.width, c.height)
    return { data: Array.from(d.data), width: c.width, height: c.height }
  }, buf.toString('base64'))
  const res = jsQR(Uint8ClampedArray.from(data), width, height)
  const ok = Boolean(res)
  if (!ok) bad++
  console.log(`${id.padEnd(9)} ${sel.padEnd(12)} ${width}x${height}px  ${ok ? '→ ' + res.data : '→ DID NOT DECODE'}`)
  }
  await p.close()
}
await b.close()
process.exit(bad ? 1 : 0)
