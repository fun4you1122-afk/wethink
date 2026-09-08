/* ────────────────────────────────────────────────────────────
   Printable programme panels for Marhaba Thailand 2026.

   Four panels for Reem Mall's info stands, each 450 x 1150 mm and
   double sided with the same artwork on both faces:

     main.pdf      Main Stage, both days
     second.pdf    Secondary Stage, both days
     workshop.pdf  Workshops, both days
     master.pdf    all three tracks, both days

   Rendered from app/embassy/programme/schedule.ts, the same module the
   website reads, so the panel on the wall and the page behind the QR
   cannot drift apart. Re-run after any change from the Embassy.

     node scripts/posters/build.mjs            # PDFs and PNG previews
     node scripts/posters/build.mjs --preview  # previews only, quicker

   ──────────────────────────────────────────────────────────── */

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import QRCode from 'qrcode'
import { chromium } from 'playwright-core'
import { loadSchedule, clock } from './schedule-data.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../..')
const OUT = path.join(ROOT, 'public/embassy/print')

/* ── the panel ────────────────────────────────────────────── */

const PANEL = { w: 450, h: 1150 }   // mm, the physical panel
const BLEED = 3                      // mm, trim allowance for the printer
const SAFE = 16                      // mm, kept clear of the glass frame

/* ── palette, sampled from the Reem Mall RM mark like the site ── */

const C = {
  bg: '#F2FAFB',
  pale: '#CBEEF3',
  tealDeep: '#015866',
  teal: '#037A8A',
  tealMid: '#029FB1',
  tealBright: '#01C1D5',
  ink: '#0C3A42',
  inkSoft: '#46707A',
}

/** WeThink's own marks, sampled from the company signature footer. */
const WT = {
  ink: '#050D2E',
  cyan: '#03CFF2',
  blue: '#108FFC',
  violet: '#983CFC',
  grey: '#5B6478',
}

/* ── titles for print ─────────────────────────────────────────
   The site can wrap a 144 character title over four lines on a
   phone. A poster column cannot. These three combined Kai Kaew
   billings are shortened by hand; everything else is split into
   an act and a performer, which is shorter and reads better in a
   column anyway. */

const SHORTEN = new Map([
  [
    'The Celestial Bird Dance + The Dance of Silver & Golden Branches + Thai Puppet Theatre by Kai Kaew',
    'Celestial Bird Dance · Silver & Golden Branches · Thai Puppet Theatre by Kai Kaew',
  ],
  [
    'A Journey Through Thailand’s Four Regions + Kipas Renang, the Traditional Thai Fan Dance + Isan Long-Drum Dance by Kai Kaew',
    'A Journey Through Thailand’s Four Regions · Kipas Renang Fan Dance · Isan Long-Drum Dance by Kai Kaew',
  ],
  [
    'Hanuman & the Mermaid Princess + Nora, Southern Thailand’s Traditional Dance + Thailand’s Heritage: From Tradition to World Heritage by Kai Kaew',
    'Hanuman & the Mermaid Princess · Nora · Thailand’s Heritage by Kai Kaew',
  ],
])

/** "Music performance by Sun Der" becomes act + performer on its own line. */
function split(title) {
  const t = SHORTEN.get(title) ?? title
  const m = t.match(/^(.*?)\s+(?:by|with)\s+(.+)$/)
  if (!m) return { act: t, by: '' }
  return { act: m[1], by: m[2].replace(/^the\s+/i, '') }
}

/* ── assets ───────────────────────────────────────────────── */

const b64 = (p) => readFileSync(path.join(ROOT, p)).toString('base64')
const font = (f) => readFileSync(path.join(HERE, 'fonts', f)).toString('base64')

const CREST = b64('public/embassy/royal-thai-embassy.png')
const REEM = b64('public/embassy/reem-mall.png')
const WETHINK = b64('public/wethink-logo.png')

const SITE = 'https://www.wethink.ae/embassy/programme'

/* ── the panels ───────────────────────────────────────────── */

const PANELS = [
  { id: 'main', track: 'main', name: 'Main Stage', where: 'Main Atrium, Ground Floor' },
  { id: 'second', track: 'second', name: 'Secondary Stage', where: 'Secondary Stage' },
  { id: 'workshop', track: 'workshop', name: 'Workshops', where: 'Workshop Area' },
  { id: 'master', track: null, name: 'Full Programme', where: 'All three stages' },
]

const DAYS = [
  { n: 1, dow: 'Friday', date: '11 September' },
  { n: 2, dow: 'Saturday', date: '12 September' },
]

const TRACK_NAMES = { main: 'Main Stage', second: 'Secondary Stage', workshop: 'Workshops' }

/* ── markup ───────────────────────────────────────────────── */

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function slotRow(s, dense) {
  if (s.rest) {
    return `<div class="row rest"><div class="t">${clock(s.start).time}</div>
      <div class="b"><div class="act">${esc(s.title)}</div></div></div>`
  }
  if (s.ceremony) {
    return `<div class="row cer"><div class="t">${clock(s.start).time}<span class="ap">PM</span></div>
      <div class="b">
        <div class="act big">Opening Ceremony</div>
        <div class="by">Main Atrium, Ground Floor</div>
        ${dense ? '' : `<ol class="cer-list">${s.ceremony.map((i) => `<li>${esc(i)}</li>`).join('')}</ol>`}
      </div></div>`
  }
  const { act, by } = split(s.title)
  const { time, ampm } = clock(s.start)
  return `<div class="row"><div class="t">${time}<span class="ap">${ampm}</span></div>
    <div class="b"><div class="act">${esc(act)}</div>${by ? `<div class="by">${esc(by)}</div>` : ''}</div></div>`
}

function dayColumn(schedule, day, track, dense) {
  const d = DAYS.find((x) => x.n === day)
  const head = `<div class="dayhead"><span class="dow">${d.dow}</span><span class="date">${d.date}</span></div>`

  if (track) {
    return `<section class="col">${head}${schedule[day][track].map((s) => slotRow(s, dense)).join('')}</section>`
  }
  const blocks = ['main', 'second', 'workshop']
    .map(
      (tr) =>
        `<div class="trackhead">${TRACK_NAMES[tr]}</div>` +
        schedule[day][tr].map((s) => slotRow(s, true)).join(''),
    )
    .join('')
  return `<section class="col">${head}${blocks}</section>`
}

async function html(panel, schedule, scale = 1, air = 0) {
  const qrUrl = panel.track ? `${SITE}?track=${panel.track}` : SITE
  const qr = await QRCode.toString(qrUrl, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: C.tealDeep, light: '#00000000' },
  })
  const dense = !panel.track
  /** schedule type, scaled to fill the column on this particular panel */
  const z = (mm) => `${(mm * scale).toFixed(2)}mm`
  /** surplus column height, spread through the rows so a short
      programme breathes instead of leaving a hole above the footer */
  const pad = (mm) => `${(mm * scale + air).toFixed(2)}mm`

  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Fraunces';src:url(data:font/ttf;base64,${font('Fraunces-Regular.ttf')}) format('truetype');font-weight:400;font-style:normal;font-display:block}
@font-face{font-family:'Fraunces';src:url(data:font/ttf;base64,${font('Fraunces-SemiBold.ttf')}) format('truetype');font-weight:600;font-style:normal;font-display:block}
@font-face{font-family:'Fraunces';src:url(data:font/ttf;base64,${font('Fraunces-Italic.ttf')}) format('truetype');font-weight:400;font-style:italic;font-display:block}
@font-face{font-family:'Jost';src:url(data:font/ttf;base64,${font('Jost-Regular.ttf')}) format('truetype');font-weight:400;font-style:normal;font-display:block}
@font-face{font-family:'Jost';src:url(data:font/ttf;base64,${font('Jost-Medium.ttf')}) format('truetype');font-weight:500;font-style:normal;font-display:block}
@font-face{font-family:'Jost';src:url(data:font/ttf;base64,${font('Jost-SemiBold.ttf')}) format('truetype');font-weight:600;font-style:normal;font-display:block}
@font-face{font-family:'Jost';src:url(data:font/ttf;base64,${font('Jost-Bold.ttf')}) format('truetype');font-weight:700;font-style:normal;font-display:block}

@page{size:${PANEL.w + BLEED * 2}mm ${PANEL.h + BLEED * 2}mm;margin:0}
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{width:${PANEL.w + BLEED * 2}mm;height:${PANEL.h + BLEED * 2}mm}
body{font-family:'Jost',sans-serif;color:${C.ink};background:${C.bg}}

.sheet{position:absolute;inset:0;padding:${BLEED + SAFE}mm ${BLEED + SAFE}mm}
.wash{position:absolute;left:0;right:0;top:0;height:330mm;
  background:linear-gradient(160deg,${C.pale} 0%,${C.bg} 78%)}
.rule{height:1.1mm;background:linear-gradient(90deg,${C.tealDeep},${C.teal} 34%,${C.tealMid} 68%,${C.tealBright});border-radius:1mm}

header{position:relative;text-align:center}
.crest{height:52mm;width:auto;display:block;margin:0 auto 7mm}
.host{font-size:5.4mm;letter-spacing:.62mm;text-transform:uppercase;font-weight:600;color:${C.teal}}
.fest{font-family:'Fraunces',serif;font-size:23mm;line-height:.98;font-weight:600;color:${C.tealDeep};margin-top:4mm;letter-spacing:-.2mm}
.tag{font-family:'Fraunces',serif;font-style:italic;font-size:6.6mm;color:${C.inkSoft};margin-top:3mm}
.stage{margin:9mm auto 0;display:inline-block;padding:4.5mm 11mm;border-radius:40mm;
  background:${C.tealDeep};color:#fff;font-size:9.4mm;font-weight:600;letter-spacing:.5mm;text-transform:uppercase}
.where{font-size:5mm;letter-spacing:.4mm;text-transform:uppercase;color:${C.inkSoft};margin-top:5mm;font-weight:500}
.when{font-size:5.6mm;letter-spacing:.34mm;text-transform:uppercase;color:${C.teal};margin-top:2.5mm;font-weight:600}
header .rule{margin-top:9mm}

.days{display:grid;grid-template-columns:1fr 1fr;gap:${z(dense ? 7 : 10)};margin-top:${z(dense ? 8 : 10)}}
.col{break-inside:avoid}
.dayhead{display:flex;align-items:baseline;gap:${z(3)};padding-bottom:${z(3)};margin-bottom:${z(dense ? 3 : 4.5)};
  border-bottom:.9mm solid ${C.tealDeep}}
.dow{font-family:'Fraunces',serif;font-size:${z(dense ? 8 : 9.6)};font-weight:600;color:${C.tealDeep}}
.date{font-size:${z(dense ? 5 : 5.8)};text-transform:uppercase;letter-spacing:.34mm;color:${C.teal};font-weight:600}
.trackhead{margin:${z(dense ? 6 : 8)} 0 ${z(2.5)};font-size:${z(4.6)};font-weight:700;text-transform:uppercase;
  letter-spacing:.5mm;color:#fff;background:${C.teal};padding:${z(2)} ${z(3.5)};border-radius:2mm}
.trackhead:first-child{margin-top:0}

.row{display:flex;gap:${z(dense ? 3 : 4)};padding:${pad(dense ? 2.1 : 3.1)} 0;
  border-bottom:.25mm solid rgba(3,122,138,.22)}
.t{flex:0 0 ${z(dense ? 15 : 18)};font-size:${z(dense ? 4.7 : 5.6)};font-weight:600;color:${C.teal};
  font-variant-numeric:tabular-nums;padding-top:${z(dense ? 0.3 : 0.5)}}
.ap{font-size:${z(dense ? 2.9 : 3.4)};margin-left:.7mm;letter-spacing:.2mm}
.b{flex:1;min-width:0}
.act{font-size:${z(dense ? 4.5 : 5.3)};line-height:1.22;font-weight:500;color:${C.ink}}
.act.big{font-family:'Fraunces',serif;font-size:${z(dense ? 6 : 7.6)};font-weight:600;color:${C.tealDeep}}
.by{font-size:${z(dense ? 3.9 : 4.5)};line-height:1.2;color:${C.inkSoft};margin-top:.9mm;letter-spacing:.08mm}
.row.rest{opacity:.5}
.row.rest .act{font-size:${z(dense ? 4 : 4.6)};font-weight:400;letter-spacing:.12mm}
.row.cer{background:${C.pale};border-radius:2.5mm;padding:${z(dense ? 3 : 4)};border-bottom:none;margin:${z(2)} 0}
.cer-list{margin:${z(3)} 0 0 ${z(5)};font-size:${z(4.3)};line-height:1.45;color:${C.ink}}

footer{position:absolute;left:${BLEED + SAFE}mm;right:${BLEED + SAFE}mm;bottom:${BLEED + SAFE}mm}
footer .rule{margin-bottom:8mm}
.foot{display:flex;align-items:center;gap:10mm}
.qr{flex:0 0 62mm;height:62mm;padding:3.4mm;background:#fff;border-radius:3mm;box-shadow:0 0 0 .4mm ${C.pale}}
.qr svg{width:100%;height:100%;display:block}
.scan{flex:1}
.scan .k{font-family:'Fraunces',serif;font-size:9mm;font-weight:600;color:${C.tealDeep};line-height:1.08}
.scan .v{font-size:5mm;color:${C.inkSoft};margin-top:2.6mm;line-height:1.32}
.credit{flex:0 0 auto;text-align:right;padding-left:9mm;border-left:.35mm solid ${C.pale}}
.credit .l{font-size:3.6mm;letter-spacing:.46mm;text-transform:uppercase;color:${C.inkSoft};font-weight:600}
.lockup{display:flex;align-items:center;gap:4mm;justify-content:flex-end;margin-top:3.6mm}
.wt{height:23mm;width:auto;display:block}
.wtname{font-size:11.4mm;font-weight:600;color:${WT.ink};line-height:.92;
  letter-spacing:1.5mm;text-transform:uppercase;padding-left:1.5mm;margin-right:-1.5mm}
.wttag{font-size:3.5mm;font-weight:500;color:${WT.ink};letter-spacing:.9mm;
  text-transform:uppercase;margin-top:2.4mm;white-space:nowrap;margin-right:-.9mm}
.wttag i{font-style:normal;font-size:4.6mm;line-height:0;vertical-align:-.3mm;margin:0 .4mm}
.credit .u{font-size:4mm;color:${C.inkSoft};letter-spacing:.3mm;margin-top:2.6mm;font-weight:500}
.reem{height:15mm;display:block;margin:0 0 0 auto;opacity:.9}
</style></head><body>
<div class="wash"></div>
<div class="sheet">
  <header>
    <img class="crest" src="data:image/png;base64,${CREST}" alt="">
    <div class="host">The Royal Thai Embassy, Abu Dhabi</div>
    <div class="fest">Marhaba Thailand</div>
    <div class="tag">Creating Your Own Thai Experience</div>
    <div class="stage">${esc(panel.name)}</div>
    <div class="where">${esc(panel.where)} · Reem Mall, Abu Dhabi</div>
    <div class="when">11 &amp; 12 September 2026 · 10.00 AM – 11.00 PM</div>
    <div class="rule"></div>
  </header>

  <div class="days">
    ${dayColumn(schedule, 1, panel.track, dense)}
    ${dayColumn(schedule, 2, panel.track, dense)}
  </div>
</div>

<footer>
  <div class="rule"></div>
  <div class="foot">
    <div class="qr">${qr}</div>
    <div class="scan">
      <div class="k">Scan for the live programme</div>
      <div class="v">See what is on right now across all three stages,
        on your phone, updated by the Embassy.</div>
    </div>
    <div class="credit">
      <img class="reem" src="data:image/png;base64,${REEM}" alt="">
      <div class="l" style="margin-top:6mm">Designed &amp; built by</div>
      <div class="lockup">
        <img class="wt" src="data:image/png;base64,${WETHINK}" alt="">
        <span class="wtname">WeThink</span>
      </div>
      <div class="wttag">Think <i style="color:${WT.cyan}">•</i> Plan <i style="color:${WT.violet}">•</i> Grow</div>
      <div class="u">wethink.ae · info@wethink.ae</div>
    </div>
  </div>
</footer>
</body></html>`
}

/* ── render ───────────────────────────────────────────────── */

const previewOnly = process.argv.includes('--preview')

const schedule = loadSchedule()
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })

// The fit has to be measured at the sheet's real pixel width, or the columns
// come out narrower than they print and every title wraps an extra line.
const PX = (mm) => Math.round((mm / 25.4) * 96)
const page = await browser.newPage({
  viewport: { width: PX(PANEL.w + BLEED * 2), height: PX(PANEL.h + BLEED * 2) },
})

const GAP = PX(12) // breathing room we insist on between the last slot and the rule

async function measure(markup) {
  await page.setContent(markup, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  return page.evaluate(() => {
    const days = document.querySelector('.days')
    const foot = document.querySelector('footer')
    return {
      top: days.getBoundingClientRect().top,
      bottom: days.getBoundingClientRect().bottom,
      footerTop: foot.getBoundingClientRect().top,
    }
  })
}

for (const panel of PANELS) {
  // Fit the schedule to the column: measure, scale, settle. Two passes is
  // enough because reflow only shifts the answer by a line here and there.
  let scale = 1
  let markup = await html(panel, schedule, scale)
  let m = await measure(markup)

  for (let pass = 0; pass < 4; pass++) {
    const available = m.footerTop - GAP - m.top
    const used = m.bottom - m.top
    const next = Math.min(1.55, Math.max(0.82, scale * (available / used)))
    if (Math.abs(next - scale) < 0.01) break
    scale = next
    markup = await html(panel, schedule, scale)
    m = await measure(markup)
  }

  // A sparse panel hits the type ceiling with the column half empty. Rather
  // than blow the type up past the others in the set, hand the surplus to the
  // rows so the rhythm opens out and the four panels still read as a family.
  let air = 0
  if (m.footerTop - GAP - m.bottom > 0) {
    const rows = Math.max(
      ...(panel.track
        ? [1, 2].map((d) => schedule[d][panel.track].length)
        : [1, 2].map((d) => ['main', 'second', 'workshop'].reduce((n, tr) => n + schedule[d][tr].length, 0))),
    )
    for (let pass = 0; pass < 4; pass++) {
      const surplus = m.footerTop - GAP - m.bottom
      if (surplus < PX(1)) break
      air += (surplus / rows / 2 / 96) * 25.4 // px of slack, per row, per side, in mm
      markup = await html(panel, schedule, scale, air)
      m = await measure(markup)
    }
  }

  const clear = m.footerTop - m.bottom
  console.log(
    `${panel.id.padEnd(9)} type ×${scale.toFixed(2)}  air +${air.toFixed(2)}mm  ` +
      (clear < 0 ? `OVERFLOWS by ${(-clear).toFixed(0)}px` : `${clear.toFixed(0)}px clear of the footer`),
  )

  writeFileSync(path.join(OUT, `${panel.id}.html`), markup)
  if (!previewOnly) {
    await page.pdf({
      path: path.join(OUT, `${panel.id}.pdf`),
      width: `${PANEL.w + BLEED * 2}mm`,
      height: `${PANEL.h + BLEED * 2}mm`,
      printBackground: true,
      preferCSSPageSize: true,
    })
  }
}

await browser.close()
console.log(`\n${previewOnly ? 'Markup' : 'PDFs'} in public/embassy/print/`)
