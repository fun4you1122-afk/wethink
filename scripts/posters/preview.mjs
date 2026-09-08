/* Small on-screen proofs of the print files, for reviewing in chat. */
import { chromium } from 'playwright-core'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(HERE, '../../public/embassy/print')
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
for (const id of process.argv.slice(2)) {
  const p = await b.newPage({ viewport: { width: 1723, height: 4369 }, deviceScaleFactor: 0.26 })
  await p.goto('file://' + path.join(OUT, `${id}.html`))
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(400)
  const m = await p.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect() : null }
    return { days: r('.days'), footer: r('footer'), body: document.body.scrollHeight }
  })
  console.log(id, 'days bottom', Math.round(m.days.bottom), 'footer top', Math.round(m.footer.top), 'body', m.body)
  await p.screenshot({ path: path.join(OUT, `proof-${id}.png`) })
  await p.close()
}
await b.close()
