/* ────────────────────────────────────────────────────────────
   The company profile as a 16:9 PDF.

   Renders /deck/company-profile, which is the same data and the same
   product screens the web profile uses, and prints it at PowerPoint's
   widescreen size. Run the site first, then:

     node scripts/profile/build-deck.mjs [baseUrl]

   ──────────────────────────────────────────────────────────── */

import { mkdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'public/WeThink-Company-Profile.pdf')
const BASE = process.argv[2] ?? 'http://localhost:3111'

const MM = { w: 338.667, h: 190.5 } // 13.333 x 7.5 in

mkdirSync(path.dirname(OUT), { recursive: true })

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({
  viewport: { width: Math.round((MM.w / 25.4) * 96), height: Math.round((MM.h / 25.4) * 96) },
})

await page.goto(`${BASE}/deck/company-profile`, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(600)

const slides = await page.evaluate(() => {
  const els = [...document.querySelectorAll('.slide')]
  return {
    count: els.length,
    overflowing: els
      .map((el, i) => {
        const body = el.querySelector('.slide-body')
        const foot = el.querySelector('.slide-foot')
        const over = body.scrollHeight > body.clientHeight
        const clash = body.getBoundingClientRect().bottom > foot.getBoundingClientRect().top + 1
        return over || clash ? i + 1 : null
      })
      .filter(Boolean),
  }
})

console.log(`slides: ${slides.count}`)
console.log(
  slides.overflowing.length
    ? `  !! content overruns on slide(s): ${slides.overflowing.join(', ')}`
    : '  every slide fits its frame',
)

await page.pdf({
  path: OUT,
  width: `${MM.w}mm`,
  height: `${MM.h}mm`,
  printBackground: true,
  preferCSSPageSize: true,
})

await browser.close()
console.log(`\n${path.relative(ROOT, OUT)}  ${(statSync(OUT).size / 1024 / 1024).toFixed(2)} MB`)
