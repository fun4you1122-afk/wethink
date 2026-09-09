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
import {
  GOLD, kanokBand, skyline, petal, lotus, corner, sideChain,
  whatsappGlyph, instagramGlyph, globeGlyph, mailGlyph,
} from './ornament.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../..')
const OUT = path.join(ROOT, 'public/embassy/print')

/* ── the panel ────────────────────────────────────────────── */

const PANEL = { w: 450, h: 1150 }   // mm, the physical panel
const BLEED = 3                      // mm, trim allowance for the printer
const SAFE = 16                      // mm, kept clear of the glass frame
const CROWN = 196                    // mm, the deep teal field at the head of the panel
const CROWN_DENSE = 168              // mm, shallower on the master, which carries 110 rows
const FOOTER = 122                   // mm, the white band at the foot of the panel;
                                     // the skyline is anchored to sit just above it

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

/* What kind of thing is it? Read off the act itself, so a new schedule from
   the Embassy needs no tagging by hand. Order matters: first match wins. */
const KINDS = [
  [/ceremony/i,                          'Ceremony',  GOLD.mid],
  [/muay thai/i,                         'Muay Thai', '#C2564B'],
  [/workshop|colouring|registration/i,   'Workshop',  '#0E8F7E'],
  [/demonstration/i,                     'Demo',      '#2E7DA6'],
  [/music|instrument|\bkim\b|sun der/i,  'Music',     '#6A5AC0'],
  [/dance|puppet|nora|hanuman|kipas|celestial|heritage|journey/i, 'Show', '#B0722B'],
  [/trivia|quiz|talent|games|panel|kiosks|mc /i, 'Live', '#3E7C8C'],
]

function kind(title) {
  for (const [re, label, colour] of KINDS) if (re.test(title)) return { label, colour }
  return { label: 'Stage', colour: '#4E7A85' }
}

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
const WT_SITE = 'https://www.wethink.ae/'

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
    return `<div class="row rest">
      <div class="rail"><span class="dot hollow"></span></div>
      <div class="t">${clock(s.start).time}</div>
      <div class="b"><div class="act">${esc(s.title)}</div></div></div>`
  }
  if (s.ceremony) {
    return `<div class="row cer">
      <div class="rail"><span class="dot" style="background:${GOLD.light}"></span></div>
      <div class="t">${clock(s.start).time}<span class="ap">PM</span>
        <span class="kind" style="color:${GOLD.light}">Ceremony</span></div>
      <div class="b">
        <div class="act big">Opening Ceremony</div>
        <div class="by">Main Atrium, Ground Floor</div>
        ${dense ? '' : `<ol class="cer-list">${s.ceremony.map((i) => `<li>${esc(i)}</li>`).join('')}</ol>`}
      </div></div>`
  }
  const { act, by } = split(s.title)
  const { time, ampm } = clock(s.start)
  const k = kind(s.title)
  return `<div class="row">
    <div class="rail"><span class="dot" style="background:${k.colour}"></span></div>
    <div class="t">${time}<span class="ap">${ampm}</span>
      <span class="kind" style="color:${k.colour}">${k.label}</span></div>
    <div class="b"><div class="act">${esc(act)}</div>${by ? `<div class="by">${esc(by)}</div>` : ''}</div></div>`
}

function dayColumn(schedule, day, track, dense) {
  const d = DAYS.find((x) => x.n === day)
  const head =
    `<div class="dayhead">${lotus({ size: 26, fill: GOLD.mid, opacity: 0.9 })}` +
    `<span class="dow">${d.dow}</span><span class="date">${d.date}</span></div>`

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
  // The big code belongs to the Embassy. This one is ours, tagged so the
  // scans coming off these five panels can be told apart from other traffic.
  const qrWt = await QRCode.toString(`${WT_SITE}?from=marhaba`, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'H',
    color: { dark: WT.ink, light: '#00000000' },
  })
  const dense = !panel.track
  /** schedule type, scaled to fill the column on this particular panel */
  const crown = dense ? CROWN_DENSE : CROWN
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

.sheet{position:absolute;inset:0;padding:0 ${BLEED + SAFE}mm}
.wash{position:absolute;left:0;right:0;top:0;bottom:0;
  background:linear-gradient(178deg,${C.bg} 0%,${C.bg} 62%,${C.pale} 100%)}

/* the crown: a deep teal field carrying the crest, edged in gold kanok */
.crown{position:absolute;left:0;right:0;top:0;height:${crown}mm;overflow:hidden;
  background:linear-gradient(168deg,${C.tealDeep} 0%,#02414D 52%,${C.teal} 100%)}
.crown .sky{position:absolute;left:0;right:0;bottom:0;width:100%;height:34mm}
.crown .p{position:absolute}
.kanok{position:absolute;left:0;right:0;width:100%;height:7mm}
.kanok.bottom{bottom:0;transform:scaleY(-1)}
.goldline{position:absolute;left:0;right:0;height:.6mm;background:
  linear-gradient(90deg,transparent,${GOLD.mid} 12%,${GOLD.pale} 50%,${GOLD.mid} 88%,transparent)}

.sidepat{position:absolute;top:${crown + 6}mm;bottom:${BLEED + 8}mm;width:${SAFE - 4}mm;
  overflow:hidden;pointer-events:none}
.sidepat.l{left:${BLEED + 1}mm}
.sidepat.r{right:${BLEED + 1}mm}
.sidepat svg{width:100%;height:100%;display:block}

.frame{position:absolute;inset:${BLEED + 7}mm;pointer-events:none;
  border:.4mm solid rgba(201,162,39,.42);border-radius:2mm}
.frame .corner{position:absolute}
.frame .corner.tl{top:-1mm;left:-1mm}
.frame .corner.tr{top:-1mm;right:-1mm;transform:scaleX(-1)}
.frame .corner.bl{bottom:-1mm;left:-1mm;transform:scaleY(-1)}
.frame .corner.br{bottom:-1mm;right:-1mm;transform:scale(-1)}

.rule{height:1.1mm;background:linear-gradient(90deg,${C.tealDeep},${C.teal} 34%,${C.tealMid} 68%,${C.tealBright});border-radius:1mm}

header{position:relative;text-align:center;padding-top:20mm;height:${crown}mm}
.crest{height:52mm;width:auto;display:block;margin:0 auto 6mm;
  filter:drop-shadow(0 1.6mm 3mm rgba(0,0,0,.35))}
.host{font-size:5.2mm;letter-spacing:.62mm;text-transform:uppercase;font-weight:600;color:${GOLD.light}}
.fest{font-family:'Fraunces',serif;font-size:24mm;line-height:.98;font-weight:600;color:#fff;margin-top:4mm;letter-spacing:-.2mm}
.tag{font-family:'Fraunces',serif;font-style:italic;font-size:6.6mm;color:rgba(255,255,255,.72);margin-top:3mm}
.crestwrap{position:relative;display:inline-block}
.crestwrap .lotus{position:absolute;top:50%;margin-top:-4mm}
.crestwrap .lotus.l{left:-19mm}
.crestwrap .lotus.r{right:-19mm}

.plate{position:relative;margin-top:-14mm;text-align:center}
.stage{display:inline-block;padding:5mm 13mm;border-radius:40mm;
  background:${GOLD.mid};color:${C.tealDeep};font-size:10mm;font-weight:700;
  letter-spacing:.6mm;text-transform:uppercase;
  box-shadow:0 0 0 1.2mm ${C.bg},0 0 0 1.7mm rgba(201,162,39,.5)}
.where{font-size:5mm;letter-spacing:.4mm;text-transform:uppercase;color:${C.inkSoft};margin-top:6mm;font-weight:500}
.when{font-size:5.8mm;letter-spacing:.34mm;text-transform:uppercase;color:${C.teal};margin-top:2.5mm;font-weight:700}

.days{display:grid;grid-template-columns:1fr 1fr;gap:${z(dense ? 7 : 10)};margin-top:${z(dense ? 8 : 10)}}
.col{break-inside:avoid}
.dayhead{display:flex;align-items:center;flex-wrap:nowrap;gap:${z(2.6)};padding-bottom:${z(3)};margin-bottom:${z(dense ? 3 : 4.5)};
  border-bottom:.9mm solid ${C.tealDeep};position:relative}
.dayhead::after{content:'';position:absolute;left:0;right:0;bottom:-1.6mm;height:.4mm;
  background:${GOLD.mid};opacity:.7}
.dayhead .lotus{flex:0 0 auto}
.dow{font-family:'Fraunces',serif;font-size:${z(dense ? 8 : 9.6)};font-weight:600;color:${C.tealDeep}}
.date{font-size:${z(dense ? 4.7 : 5.1)};text-transform:uppercase;letter-spacing:.24mm;
  color:${C.teal};font-weight:600;white-space:nowrap}
.trackhead{margin:${z(dense ? 6 : 8)} 0 ${z(2.5)};font-size:${z(4.6)};font-weight:700;text-transform:uppercase;
  letter-spacing:.5mm;color:#fff;background:linear-gradient(90deg,${C.tealDeep},${C.teal});
  padding:${z(2)} ${z(3.5)};border-radius:2mm;border-left:1mm solid ${GOLD.mid}}
.trackhead:first-child{margin-top:0}

.row{display:flex;gap:${z(dense ? 2.2 : 2.8)};padding:${pad(dense ? 1.5 : 2.1)} ${z(1.6)};
  border-bottom:.25mm solid rgba(3,122,138,.16);position:relative;align-items:stretch}
.row:nth-child(even){background:rgba(3,122,138,.05);border-radius:1.6mm}

/* the timeline: one continuous rail down the column with a stop per slot */
.rail{flex:0 0 ${z(4.4)};position:relative}
.rail::before{content:'';position:absolute;left:50%;top:${z(-2.4)};bottom:${z(-2.4)};
  width:.5mm;margin-left:-.25mm;background:rgba(3,122,138,.28)}
.rail .dot{position:absolute;left:50%;top:${z(2.4)};width:${z(2.9)};height:${z(2.9)};
  margin-left:-${z(1.45)};border-radius:50%;box-shadow:0 0 0 ${z(.9)} ${C.bg}}
.rail .dot.hollow{background:${C.bg};box-shadow:0 0 0 .45mm rgba(3,122,138,.4),0 0 0 ${z(.9)} ${C.bg}}
.col .row:first-of-type .rail::before{top:${z(2.4)}}
.col .row:last-child .rail::before{bottom:auto;height:${z(4.8)}}

.kind{display:${dense ? 'none' : 'block'};font-size:${z(2.8)};font-weight:700;
  text-transform:uppercase;letter-spacing:.2mm;margin-top:${z(1)};line-height:1;white-space:nowrap}
.t{flex:0 0 ${z(dense ? 15 : 21)};font-size:${z(dense ? 5.4 : 6.4)};font-weight:700;color:${C.tealDeep};
  font-variant-numeric:tabular-nums;padding-top:${z(dense ? 0.2 : 0.4)};line-height:1}
.ap{font-size:${z(dense ? 2.9 : 3.4)};margin-left:.7mm;letter-spacing:.2mm}
.b{flex:1;min-width:0}
.act{font-size:${z(dense ? 5 : 6)};line-height:1.18;font-weight:600;color:${C.ink};letter-spacing:-.02mm}
.act.big{font-family:'Fraunces',serif;font-size:${z(dense ? 6 : 7.6)};font-weight:600;color:${C.tealDeep}}
.by{font-size:${z(dense ? 4 : 4.7)};line-height:1.18;color:${C.inkSoft};margin-top:${z(.8)};letter-spacing:.06mm}
.row.rest{opacity:.5}
.row.rest .act{font-size:${z(dense ? 4.1 : 4.7)};font-weight:500;letter-spacing:.12mm}
.row.cer{background:linear-gradient(150deg,${C.tealDeep},#02414D);color:#fff;
  border-radius:2.5mm;padding:${z(dense ? 3.4 : 4.6)};border-bottom:none;margin:${z(2.4)} 0;
  box-shadow:0 0 0 .5mm ${GOLD.mid}}
.row.cer .t{color:${GOLD.light}}
.row.cer .act.big{color:#fff}
.row.cer .by{color:rgba(255,255,255,.7)}
.row.cer .cer-list{color:rgba(255,255,255,.9)}
.row.cer .cer-list li::marker{color:${GOLD.light}}
.cer-list{margin:${z(3)} 0 0 ${z(5)};font-size:${z(4.3)};line-height:1.45;color:${C.ink}}

/* ── the foot ──────────────────────────────────────────────
   A white band across the full width of the panel, in two rows: the
   Embassy's live-programme code and the venue on top, and beneath it
   WeThink's signature strip, set the way the company signs its own
   documents — mark, wordmark, then the contacts in ruled cells, and the
   gradient sweep underneath. */

footer{position:absolute;left:0;right:0;bottom:0;z-index:2;background:#fff;
  padding:${BLEED + 8}mm ${BLEED + SAFE}mm ${BLEED + 7}mm;
  box-shadow:0 -.5mm 0 rgba(201,162,39,.5)}
footer .rule{display:none}
.footsky{position:absolute;left:0;right:0;bottom:${FOOTER}mm;height:52mm;z-index:1;pointer-events:none}
.footsky svg{width:100%;height:100%;display:block}

/* row one: the Embassy and the venue */
.foot{display:flex;align-items:center;justify-content:space-between;gap:10mm}
.scanblock{display:flex;align-items:center;gap:6mm}
.qr{flex:0 0 42mm;height:42mm;padding:2.4mm;background:#fff;border-radius:2.2mm;
  box-shadow:0 0 0 .4mm ${C.pale}}
.qr svg{width:100%;height:100%;display:block}
.scan .k{font-family:'Fraunces',serif;font-size:7.4mm;font-weight:600;color:${C.tealDeep};line-height:1.06}
.scan .v{font-size:4.3mm;color:${C.inkSoft};margin-top:2.2mm;line-height:1.3}
.venue{display:flex;align-items:center;gap:4mm}
.venue .vl{font-size:3.5mm;letter-spacing:.4mm;text-transform:uppercase;color:${C.inkSoft};font-weight:600}
.reem{height:11mm;display:block;opacity:.92}

/* row two: the company signature */
.sig{margin-top:8mm;padding-top:7mm;border-top:.3mm solid rgba(1,88,102,.16)}
.sigrow{display:flex;align-items:center}
.sigcell{display:flex;align-items:center;justify-content:center;gap:5mm;
  padding:0 5.5mm;border-right:.3mm solid #D0D1D5}
.sigcell:first-child{padding-left:0}
.sigcell:last-child{border-right:none;padding-right:0}
.sigcell.grow{flex:1 1 0;min-width:0}

.powered{font-size:5mm;font-weight:700;color:${WT.ink};letter-spacing:.72mm;
  text-transform:uppercase;line-height:1.42;white-space:nowrap;text-align:left}
.sigmark{height:30mm;width:auto;display:block}
.signame{font-size:12.6mm;font-weight:600;color:${WT.ink};line-height:.92;
  letter-spacing:1.7mm;text-transform:uppercase;padding-left:1.7mm;margin-right:-1.7mm}
.sigtag{font-size:3.6mm;font-weight:600;color:${WT.ink};letter-spacing:1mm;
  text-transform:uppercase;margin-top:2.6mm;white-space:nowrap;padding-left:1mm}
.sigtag i{font-style:normal;font-size:4.4mm;line-height:0;vertical-align:-.25mm;margin:0 .4mm}

.ct{display:flex;flex-direction:column;align-items:center;gap:2.4mm;min-width:0}
.ct .ring{width:12.4mm;height:12.4mm;border-radius:50%;background:#F1F3F8;
  display:flex;align-items:center;justify-content:center}
.ct .gl{display:block;width:6.4mm;height:6.4mm}
.ct .lb{font-size:3.9mm;font-weight:500;color:${WT.ink};letter-spacing:.06mm;white-space:nowrap}

.sigqr{flex:0 0 auto;padding:.9mm;border-radius:2.6mm;
  background:linear-gradient(140deg,${WT.cyan},${WT.blue} 45%,${WT.violet})}
.sigqr .code{position:relative;width:26mm;height:26mm;padding:1.4mm;background:#fff;border-radius:1.9mm}
.sigqr .code svg{width:100%;height:100%;display:block}
.sigqr .code .mid{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:6.4mm;height:6.4mm;background:#fff;border-radius:1mm;padding:.6mm}
.sigqr .code .mid img{width:100%;height:100%;object-fit:contain;display:block}

.build{font-size:4.4mm;font-weight:600;color:#696B7A;letter-spacing:.66mm;
  text-transform:uppercase;line-height:1.42;text-align:right;white-space:nowrap}

.sweep{margin-top:5mm;height:9mm}
.sweep svg{width:100%;height:9mm;display:block}
</style></head><body>
<div class="wash"></div>

<div class="crown">
  ${skyline({ width: 456, height: 34, fill: '#9FDDE8', opacity: 0.13 })}
  <span class="p" style="top:26mm;left:22mm">${petal({ size: 34, rotate: 24, opacity: 0.16 })}</span>
  <span class="p" style="top:74mm;right:26mm">${petal({ size: 26, rotate: -38, opacity: 0.14 })}</span>
  <span class="p" style="top:132mm;left:38mm">${petal({ size: 20, rotate: 62, opacity: 0.12 })}</span>
  <span class="p" style="top:118mm;right:44mm">${petal({ size: 30, rotate: -12, opacity: 0.1 })}</span>
  ${kanokBand({ width: 456, height: 7, fill: GOLD.mid, opacity: 0.7 })}
  <div class="goldline" style="top:7mm"></div>
  <div class="goldline" style="bottom:0"></div>
</div>

<div class="sidepat l">${sideChain({ height: PANEL.h, fill: GOLD.mid, opacity: 0.34 })}</div>
<div class="sidepat r">${sideChain({ height: PANEL.h, fill: GOLD.mid, opacity: 0.34 })}</div>

<div class="frame">
  ${['tl', 'tr', 'bl', 'br'].map((k) => `<span class="corner ${k}">${corner({ size: 26 })}</span>`).join('')}
</div>

<div class="footsky">${skyline({ width: 456, height: 64, fill: C.teal, opacity: 0.1 })}</div>

<div class="sheet">
  <header>
    <span class="crestwrap">
      <span class="lotus l">${lotus({ size: 8.5 * 3.78, fill: GOLD.mid, opacity: 0.55 })}</span>
      <img class="crest" src="data:image/png;base64,${CREST}" alt="">
      <span class="lotus r">${lotus({ size: 8.5 * 3.78, fill: GOLD.mid, opacity: 0.55 })}</span>
    </span>
    <div class="host">The Royal Thai Embassy, Abu Dhabi</div>
    <div class="fest">Marhaba Thailand</div>
    <div class="tag">Creating Your Own Thai Experience</div>
  </header>

  <div class="plate">
    <div class="stage">${esc(panel.name)}</div>
    <div class="where">${esc(panel.where)} · Reem Mall, Abu Dhabi</div>
    <div class="when">11 &amp; 12 September 2026 · 10.00 AM – 11.00 PM</div>
  </div>

  <div class="days">
    ${dayColumn(schedule, 1, panel.track, dense)}
    ${dayColumn(schedule, 2, panel.track, dense)}
  </div>
</div>

<footer>
  <div class="foot">
    <div class="scanblock">
      <div class="qr">${qr}</div>
      <div class="scan">
        <div class="k">Scan for the live programme</div>
        <div class="v">What is on right now, across all three stages.</div>
      </div>
    </div>
    <div class="venue">
      <span class="vl">Hosted at</span>
      <img class="reem" src="data:image/png;base64,${REEM}" alt="Reem Mall">
    </div>
  </div>

  <div class="sig">
    <div class="sigrow">
      <div class="sigcell">
        <div class="powered">Powered<br>by:</div>
      </div>

      <div class="sigcell">
        <img class="sigmark" src="data:image/png;base64,${WETHINK}" alt="">
        <div>
          <div class="signame">WeThink</div>
          <div class="sigtag">Think <i style="color:${WT.cyan}">•</i> Plan <i style="color:${WT.violet}">•</i> Grow</div>
        </div>
      </div>

      <div class="sigcell grow">
        <span class="ct">
          <span class="ring">${whatsappGlyph({ fill: WT.blue })}</span>
          <span class="lb">+971 50 312 5078</span>
        </span>
      </div>
      <div class="sigcell grow">
        <span class="ct">
          <span class="ring">${instagramGlyph({ fill: WT.blue })}</span>
          <span class="lb">@wethink.ae</span>
        </span>
      </div>
      <div class="sigcell grow">
        <span class="ct">
          <span class="ring">${mailGlyph({ fill: WT.blue })}</span>
          <span class="lb">info@wethink.ae</span>
        </span>
      </div>
      <div class="sigcell grow">
        <span class="ct">
          <span class="ring">${globeGlyph({ fill: WT.blue })}</span>
          <span class="lb">wethink.ae</span>
        </span>
      </div>

      <div class="sigcell">
        <div class="sigqr"><div class="code">${qrWt}
          <span class="mid"><img src="data:image/png;base64,${WETHINK}" alt=""></span>
        </div></div>
      </div>

      <div class="sigcell">
        <div class="build">Let&rsquo;s build<br>together</div>
      </div>
    </div>
    <div class="sweep">
      <svg viewBox="0 0 418 9" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs><linearGradient id="sw" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="${WT.cyan}"/><stop offset=".34" stop-color="${WT.blue}"/>
          <stop offset=".58" stop-color="#3963FC"/><stop offset=".78" stop-color="#6949FC"/>
          <stop offset="1" stop-color="${WT.violet}"/>
        </linearGradient></defs>
        <path d="M1.1 0.6 V3.9 Q1.1 7.9 5.1 7.9 H412.9 Q416.9 7.9 416.9 3.9 V0.6"
          fill="none" stroke="url(#sw)" stroke-width="2.2" stroke-linecap="round"/>
      </svg>
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
  const dense = !panel.track
  let scale = 1
  let markup = await html(panel, schedule, scale)
  let m = await measure(markup)

  for (let pass = 0; pass < 4; pass++) {
    const available = m.footerTop - GAP - m.top
    const used = m.bottom - m.top
    const next = Math.min(2.3, Math.max(dense ? 0.74 : 0.9, scale * (available / used)))
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
