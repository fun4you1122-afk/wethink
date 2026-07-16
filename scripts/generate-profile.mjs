// WeThink Company Profile — 16:9 landscape deck
// Design language follows the corporate-profile reference: full-bleed photo
// cover, "at a glance" split layout, dark feature pages with icon capability
// grids, horizontal timeline, portfolio grid, and a dark closing page —
// rendered in WeThink's light teal→violet brand identity.
//
// Run:  node scripts/generate-profile.mjs
// Out:  public/WeThink-Company-Profile-2026.pptx

import PptxGenJS from 'pptxgenjs'

const pptx = new PptxGenJS()
pptx.layout = 'LAYOUT_WIDE' // 13.33 × 7.5 in (16:9)

// ── Brand tokens ────────────────────────────────────────────────────
const C = {
  bgLight:   'F6FAF9',
  white:     'FFFFFF',
  dark:      '0E262B',   // deep teal-navy feature background
  dark2:     '0A1D21',
  teal:      '14B8A6',
  tealDark:  '0E9384',
  violet:    '7C3AED',
  violetMid: '8B5CF6',
  ink:       '10232E',   // headings on light
  body:      '3A4A56',   // body on light
  muted:     '52677A',   // captions on light
  dBody:     'D9E6E4',   // body on dark
  dMuted:    '9FB8B4',   // captions on dark
  line:      'DCE9E6',
  sky:       '38BDF8',
  emerald:   '34D399',
  amber:     'F59E0B',
  rose:      'F87171',
}
const FONT = 'Segoe UI'

const W = 13.33
const H = 7.5
const MX = 0.6
const CW = W - MX * 2

// ── Helpers ─────────────────────────────────────────────────────────
const grad = (from, to, angle = 90) => ({
  type: 'grad',
  stops: [{ position: 0, color: from }, { position: 100, color: to }],
  angle,
})

function lightBg(s) {
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: C.bgLight } })
}
function darkBg(s) {
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: C.dark } })
}
function brandBar(s) {
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.06, fill: grad(C.teal, C.violet, 0) })
}
function footer(s, page, onDark = false) {
  s.addText([
    { text: 'WeThink', options: { bold: true, color: onDark ? C.white : C.ink } },
    { text: '  ·  Digital Smart Solutions  ·  wethink.ae', options: { color: onDark ? C.dMuted : C.muted } },
  ], { x: MX, y: 7.08, w: 6, h: 0.3, fontSize: 8.5, fontFace: FONT })
  s.addText(String(page).padStart(2, '0'), {
    x: W - MX - 0.6, y: 7.08, w: 0.6, h: 0.3, fontSize: 8.5, fontFace: FONT,
    color: onDark ? C.dMuted : C.muted, align: 'right',
  })
}
function logoBlock(s, x, y, scale = 1, onDark = false) {
  s.addImage({ path: 'public/logo.png', x, y, w: 0.52 * scale, h: 0.52 * scale })
  s.addText([
    { text: 'We', options: { color: onDark ? C.white : C.ink, bold: true } },
    { text: 'Think', options: { color: C.violetMid, bold: true } },
  ], { x: x + 0.55 * scale, y: y - 0.04 * scale, w: 1.8 * scale, h: 0.4 * scale, fontSize: 17 * scale, fontFace: FONT })
  s.addText('THINK · PLAN · GROW', {
    x: x + 0.57 * scale, y: y + 0.3 * scale, w: 2 * scale, h: 0.24 * scale,
    fontSize: 6.5 * scale, fontFace: FONT, color: onDark ? C.dMuted : C.muted, charSpacing: 3,
  })
}
function sectionTitle(s, text, { x = MX, y = 0.5, onDark = false, size = 26 } = {}) {
  s.addText(text, {
    x, y, w: CW, h: 0.6, fontSize: size, bold: true, fontFace: FONT,
    color: onDark ? C.white : C.ink,
  })
  s.addShape(pptx.ShapeType.rect, { x: x + 0.02, y: y + 0.62, w: 0.55, h: 0.045, fill: grad(C.teal, C.violet, 0) })
}
function chip(s, text, x, y, w, { onDark = false, color = C.tealDark } = {}) {
  s.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h: 0.32, rectRadius: 0.16,
    fill: { color: onDark ? C.dark2 : C.white },
    line: { color, width: 0.75 },
  })
  s.addText(text, {
    x, y: y - 0.008, w, h: 0.34, fontSize: 8.5, fontFace: FONT, align: 'center', valign: 'middle',
    color: onDark ? C.dBody : color, bold: true,
  })
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 1 — COVER
// ════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  darkBg(s)
  s.addImage({ path: 'public/projects/nexa-pay.jpg', x: 0, y: 0, w: W, h: H, sizing: { type: 'cover', w: W, h: H } })
  // dark scrim for legibility
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: C.dark2, transparency: 28 } })
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.09, fill: grad(C.teal, C.violet, 0) })

  logoBlock(s, MX, 0.5, 1.15, true)

  // title block with vertical rule (reference style)
  s.addShape(pptx.ShapeType.rect, { x: 1.05, y: 3.05, w: 0.028, h: 2.0, fill: { color: C.white, transparency: 30 } })
  s.addText('Company\nProfile', {
    x: 1.35, y: 2.95, w: 7.5, h: 1.75, fontSize: 46, bold: true, fontFace: FONT, color: C.white, lineSpacing: 52,
  })
  s.addShape(pptx.ShapeType.rect, { x: 1.38, y: 4.9, w: 0.14, h: 0.42, fill: grad(C.teal, C.violet, 90) })
  s.addText('Your Digital Transformation Partner', {
    x: 1.62, y: 4.87, w: 8.5, h: 0.45, fontSize: 20, fontFace: FONT, color: C.white,
  })
  s.addText('Consulting  –  Cloud  –  Cybersecurity  –  Custom Software  –  Data & AI', {
    x: 1.62, y: 5.35, w: 9.5, h: 0.35, fontSize: 12.5, fontFace: FONT, color: C.dBody,
  })

  s.addText('Abu Dhabi, United Arab Emirates  ·  Est. 2019  ·  wethink.ae', {
    x: MX, y: 6.9, w: 9, h: 0.35, fontSize: 10.5, fontFace: FONT, color: C.dBody,
  })
  s.addText('2026', { x: W - MX - 1.2, y: 6.82, w: 1.2, h: 0.45, fontSize: 20, bold: true, fontFace: FONT, color: C.white, align: 'right' })
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 2 — WETHINK AT A GLANCE (split layout, reference style)
// ════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  const SW = 5.4
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: SW, h: H, fill: { color: C.dark } })
  s.addShape(pptx.ShapeType.rect, { x: SW, y: 0, w: 0.05, h: H, fill: grad(C.teal, C.violet, 90) })

  s.addText('WETHINK', { x: 0.55, y: 0.5, w: 4, h: 0.35, fontSize: 14, fontFace: FONT, color: C.teal, charSpacing: 4, bold: true })
  s.addText('AT A GLANCE', { x: 0.55, y: 0.85, w: 4.5, h: 0.55, fontSize: 27, bold: true, fontFace: FONT, color: C.white })

  s.addText('COMPANY OVERVIEW', { x: 0.55, y: 1.68, w: 4, h: 0.3, fontSize: 10, bold: true, fontFace: FONT, color: C.dBody, charSpacing: 2 })
  const stats = [
    ['2019', 'Founded in\nAbu Dhabi'],
    ['8', 'Core service\nlines'],
    ['5,000+', 'Projects\ndelivered'],
    ['1,000+', 'Clients\nserved'],
  ]
  stats.forEach(([v, l], i) => {
    const x = 0.55 + (i % 2) * 2.25
    const y = 2.05 + Math.floor(i / 2) * 1.0
    s.addText(v, { x, y, w: 2.1, h: 0.45, fontSize: 21, bold: true, fontFace: FONT, color: C.white })
    s.addText(l, { x, y: y + 0.42, w: 2.1, h: 0.5, fontSize: 8.5, fontFace: FONT, color: C.dMuted, lineSpacing: 10.5 })
  })
  s.addShape(pptx.ShapeType.rect, { x: 0.55, y: 4.15, w: 4.3, h: 0.012, fill: { color: C.dMuted, transparency: 55 } })

  s.addText('SOLUTION DOMAINS', { x: 0.55, y: 4.3, w: 4, h: 0.3, fontSize: 10, bold: true, fontFace: FONT, color: C.dBody, charSpacing: 2 })
  const domains = ['Digital Transformation', 'Strategic Consulting', 'Cloud Services', 'Cybersecurity', 'Custom Software', 'Data & Analytics', 'IT Solutions', 'Project Management']
  domains.forEach((d, i) => {
    const x = 0.55 + (i % 2) * 2.25
    const y = 4.68 + Math.floor(i / 2) * 0.42
    s.addShape(pptx.ShapeType.rect, { x, y: y + 0.11, w: 0.09, h: 0.09, fill: { color: i % 2 ? C.violetMid : C.teal } })
    s.addText(d, { x: x + 0.18, y, w: 2.1, h: 0.32, fontSize: 9, fontFace: FONT, color: C.dBody, valign: 'middle' })
  })
  s.addText('INDUSTRY FOCUS', { x: 0.55, y: 6.5, w: 4, h: 0.25, fontSize: 8, bold: true, fontFace: FONT, color: C.dBody, charSpacing: 2 })
  s.addText('Startups · Retail · Real Estate · Education · Healthcare · Logistics · F&B', {
    x: 0.55, y: 6.76, w: 4.5, h: 0.35, fontSize: 8.5, fontFace: FONT, color: C.dMuted,
  })

  // right column
  const RX = SW + 0.55
  const RW = W - RX - MX
  sectionTitle(s, 'About Us', { x: RX, y: 0.45 })
  s.addText(
    'WeThink Information Technology Consulting is an Abu Dhabi-based digital consultancy founded in 2019 by Rasha Aljalam. We take businesses from idea to impact — combining strategy, engineering, and design under one roof so our clients never have to stitch together a dozen vendors.',
    { x: RX, y: 1.22, w: RW, h: 1.05, fontSize: 11, fontFace: FONT, color: C.body, lineSpacing: 15.5 },
  )
  s.addText(
    'We work side-by-side with founders launching their first product and with established organisations modernising their technology stack — across the UAE and the wider Gulf.',
    { x: RX, y: 2.3, w: RW, h: 0.75, fontSize: 11, fontFace: FONT, color: C.body, lineSpacing: 15.5 },
  )

  // leadership card
  s.addShape(pptx.ShapeType.roundRect, { x: RX, y: 3.2, w: RW, h: 1.5, rectRadius: 0.09, fill: { color: C.white }, line: { color: C.line, width: 1 } })
  s.addImage({ path: 'public/ceo.jpg', x: RX + 0.18, y: 3.38, w: 1.14, h: 1.14, sizing: { type: 'cover', w: 1.14, h: 1.14 }, rounding: true })
  s.addText('Rasha Aljalam', { x: RX + 1.5, y: 3.45, w: 4.5, h: 0.35, fontSize: 14, bold: true, fontFace: FONT, color: C.ink })
  s.addText('Founder & Chief Executive Officer', { x: RX + 1.5, y: 3.79, w: 4.5, h: 0.3, fontSize: 10, fontFace: FONT, color: C.tealDark, bold: true })
  s.addText('"We don\'t just advise — we execute, deliver, and stay accountable until you win."', {
    x: RX + 1.5, y: 4.09, w: RW - 1.7, h: 0.55, fontSize: 10, italic: true, fontFace: FONT, color: C.muted, lineSpacing: 13,
  })

  sectionTitle(s, 'Credentials & Alignment', { x: RX, y: 5.0, size: 18 })
  const badges = ['ISO 27001 Ready', 'NESA-aligned', 'UAE Gov Compliant', 'AWS Partner', 'Microsoft Azure', 'UAE PDPL Aware']
  badges.forEach((b, i) => {
    chip(s, b, RX + (i % 3) * 2.35, 5.8 + Math.floor(i / 3) * 0.46, 2.2, { color: i % 2 ? C.violet : C.tealDark })
  })
  // custom footer: left text sits on the dark sidebar, page number on light side
  s.addText([
    { text: 'WeThink', options: { bold: true, color: C.white } },
    { text: '  ·  Digital Smart Solutions  ·  wethink.ae', options: { color: C.dMuted } },
  ], { x: 0.55, y: 7.08, w: 4.5, h: 0.3, fontSize: 8.5, fontFace: FONT })
  s.addText('02', { x: W - MX - 0.6, y: 7.08, w: 0.6, h: 0.3, fontSize: 8.5, fontFace: FONT, color: C.muted, align: 'right' })
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 3 — OUR JOURNEY (horizontal timeline)
// ════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  brandBar(s)
  sectionTitle(s, 'Our Journey')
  s.addText(
    'WeThink started in 2019 as an entrepreneurial venture in Abu Dhabi. Since then it has grown into a full-spectrum digital consultancy — adding practice areas year on year while staying founder-led and delivery-obsessed.',
    { x: MX, y: 1.3, w: CW, h: 0.65, fontSize: 11.5, fontFace: FONT, color: C.body, lineSpacing: 15 },
  )

  const items = [
    ['2019', 'WeThink founded in Abu Dhabi — IT consulting and web delivery for local businesses'],
    ['2020', 'Cloud practice launched: AWS and Azure migrations for UAE SMEs'],
    ['2021', 'Cybersecurity practice added — ISO 27001 and NESA-aligned programmes'],
    ['2022', 'Custom software studio formed: web, mobile, and API engineering'],
    ['2023', 'Data & AI practice: BI dashboards, analytics, and ML-assisted tooling'],
    ['2024', 'Pre-launch venture programme — building brands from idea to market'],
    ['2025', 'Six venture launches delivered; digital business card and app initiatives'],
    ['2026', 'New brand identity and expanded portfolio across the Gulf'],
  ]
  const lineY = 4.35
  s.addShape(pptx.ShapeType.rect, { x: MX + 0.2, y: lineY, w: CW - 0.4, h: 0.03, fill: grad(C.teal, C.violet, 0) })
  const step = (CW - 0.4) / (items.length - 1)
  items.forEach(([year, text], i) => {
    const cx = MX + 0.2 + step * i
    const up = i % 2 === 0
    s.addShape(pptx.ShapeType.ellipse, {
      x: cx - 0.07, y: lineY - 0.055, w: 0.14, h: 0.14,
      fill: { color: C.white }, line: { color: i < 4 ? C.tealDark : C.violet, width: 2 },
    })
    s.addText(year, {
      x: cx - 0.55, y: up ? lineY - 0.62 : lineY + 0.16, w: 1.1, h: 0.32,
      fontSize: 13, bold: true, fontFace: FONT, color: i < 4 ? C.tealDark : C.violet, align: 'center',
    })
    s.addText(text, {
      x: cx - 0.73, y: up ? lineY - 2.2 : lineY + 0.52, w: 1.46, h: 1.55,
      fontSize: 8.5, fontFace: FONT, color: C.body, align: 'center', lineSpacing: 11,
      valign: up ? 'bottom' : 'top',
    })
  })
  footer(s, 3)
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 4 — MISSION, VISION & VALUES
// ════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  brandBar(s)
  sectionTitle(s, 'Mission, Vision & Values')

  const cards = [
    ['Our Mission', 'To transform ideas into impactful realities — giving UAE businesses and founders the strategy, engineering, and momentum they need to compete in the digital age.', C.teal],
    ['Our Vision', 'To be the Gulf\'s most trusted end-to-end digital partner: the first call for anyone who wants technology delivered right the first time.', C.violet],
    ['Our Promise', 'One partner, every layer. We stay accountable from the first workshop to long after launch — with radical transparency at every step.', C.sky],
  ]
  cards.forEach(([t, d, color], i) => {
    const x = MX + i * (CW / 3)
    const w = CW / 3 - 0.25
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.5, w, h: 2.5, rectRadius: 0.1, fill: { color: C.white }, line: { color: C.line, width: 1 } })
    s.addShape(pptx.ShapeType.rect, { x, y: 1.5, w, h: 0.07, fill: { color } })
    s.addText(t, { x: x + 0.25, y: 1.72, w: w - 0.5, h: 0.4, fontSize: 16, bold: true, fontFace: FONT, color: C.ink })
    s.addText(d, { x: x + 0.25, y: 2.2, w: w - 0.5, h: 1.65, fontSize: 10.5, fontFace: FONT, color: C.body, lineSpacing: 14.5 })
  })

  sectionTitle(s, 'Values We Work By', { y: 4.4, size: 18 })
  const values = [
    ['Think', 'Understand deeply before building anything'],
    ['Plan', 'Tailored roadmaps — never templates'],
    ['Grow', 'Ship, measure, and keep improving'],
    ['Own It', 'Accountable until the outcome lands'],
    ['Stay Human', 'Founder-level attention on every account'],
  ]
  values.forEach(([t, d], i) => {
    const x = MX + i * (CW / 5)
    const w = CW / 5 - 0.2
    s.addShape(pptx.ShapeType.roundRect, { x, y: 5.3, w, h: 1.3, rectRadius: 0.08, fill: { color: C.white }, line: { color: C.line, width: 1 } })
    s.addText(t, { x: x + 0.16, y: 5.44, w: w - 0.32, h: 0.32, fontSize: 12.5, bold: true, fontFace: FONT, color: i % 2 ? C.violet : C.tealDark })
    s.addText(d, { x: x + 0.16, y: 5.8, w: w - 0.32, h: 0.72, fontSize: 8.5, fontFace: FONT, color: C.muted, lineSpacing: 11 })
  })
  footer(s, 4)
}

// ════════════════════════════════════════════════════════════════════
// SLIDES 5 & 6 — SERVICES (dark feature pages)
// ════════════════════════════════════════════════════════════════════
const SERVICES = [
  {
    t: 'Digital Transformation',
    d: 'End-to-end overhaul of business processes, culture, and technology — aligned with UAE Vision 2031.',
    caps: ['Process Design', 'Change Management', 'Digital Roadmaps', 'Legacy Modernisation'], c: C.violetMid,
  },
  {
    t: 'Strategic Consulting',
    d: 'Data-driven strategy and C-suite advisory that turns complexity into competitive advantage.',
    caps: ['Technology Roadmaps', 'C-Suite Advisory', 'OKRs & Governance', 'Vendor Selection'], c: C.sky,
  },
  {
    t: 'Cloud Services',
    d: 'Multi-cloud architecture, migration, and optimisation on AWS, Azure, and GCP.',
    caps: ['Cloud Architecture', 'Migration', 'Managed Operations', 'FinOps & Cost Control'], c: C.teal,
  },
  {
    t: 'Cybersecurity',
    d: 'Security assessments, threat monitoring, and compliance frameworks that protect critical assets.',
    caps: ['Zero-Trust Design', 'ISO 27001 Programmes', 'NESA Alignment', 'SOC Monitoring'], c: C.rose,
  },
  {
    t: 'Custom Software',
    d: 'Bespoke web, mobile, and enterprise applications engineered from the ground up.',
    caps: ['Web & Mobile Apps', 'API Engineering', 'AI-Powered Platforms', 'MVPs in 8–12 Weeks'], c: C.emerald,
  },
  {
    t: 'Data & Analytics',
    d: 'Dashboards, predictive models, and BI platforms that turn raw data into decisions.',
    caps: ['BI Dashboards', 'Data Warehousing', 'ML Models', 'Real-Time Reporting'], c: C.amber,
  },
  {
    t: 'IT Solutions',
    d: 'Tailored infrastructure, systems integration, and managed IT that scales with ambition.',
    caps: ['Infrastructure', 'Systems Integration', 'Managed IT', '99.98% Uptime Targets'], c: C.violetMid,
  },
  {
    t: 'Project Management',
    d: 'Agile, structured delivery that keeps complex technology projects on time and on scope.',
    caps: ['Agile Delivery', 'PMO Governance', 'Stakeholder Management', 'On-Time Delivery'], c: C.teal,
  },
]

function servicesSlide(list, page, label) {
  const s = pptx.addSlide()
  darkBg(s)
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.06, fill: grad(C.teal, C.violet, 0) })
  s.addText(`Our Services  —  ${label}`, { x: MX, y: 0.4, w: CW, h: 0.55, fontSize: 24, bold: true, fontFace: FONT, color: C.white })
  s.addShape(pptx.ShapeType.rect, { x: MX + 0.02, y: 0.98, w: 0.55, h: 0.045, fill: grad(C.teal, C.violet, 0) })

  list.forEach((sv, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = MX + col * (CW / 2 + 0.1)
    const w = CW / 2 - 0.35
    const y = 1.4 + row * 2.75
    s.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 2.5, rectRadius: 0.1, fill: { color: C.dark2 }, line: { color: sv.c, width: 1 } })
    s.addShape(pptx.ShapeType.rect, { x: x + 0.28, y: y + 0.3, w: 0.14, h: 0.42, fill: { color: sv.c } })
    s.addText(sv.t, { x: x + 0.55, y: y + 0.2, w: w - 0.8, h: 0.45, fontSize: 17, bold: true, fontFace: FONT, color: C.white })
    s.addText(sv.d, { x: x + 0.55, y: y + 0.68, w: w - 0.85, h: 0.8, fontSize: 10, fontFace: FONT, color: C.dBody, lineSpacing: 13.5 })
    sv.caps.forEach((cp, j) => {
      const cx = x + 0.55 + (j % 2) * ((w - 1.0) / 2)
      const cy = y + 1.58 + Math.floor(j / 2) * 0.42
      s.addShape(pptx.ShapeType.rect, { x: cx, y: cy + 0.11, w: 0.08, h: 0.08, fill: { color: sv.c } })
      s.addText(cp, { x: cx + 0.16, y: cy, w: (w - 1.2) / 2, h: 0.32, fontSize: 9, fontFace: FONT, color: C.dBody, valign: 'middle' })
    })
  })
  footer(s, page, true)
}
servicesSlide(SERVICES.slice(0, 4), 5, '1 of 2')
servicesSlide(SERVICES.slice(4), 6, '2 of 2')

// ════════════════════════════════════════════════════════════════════
// SLIDE 7 — HOW WE WORK (execution methodology)
// ════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  brandBar(s)
  sectionTitle(s, 'How We Work')
  s.addText(
    'We don\'t push templates. Every engagement starts with your challenges, gets a tailored roadmap, and is delivered against it — with radical transparency at every step.',
    { x: MX, y: 1.3, w: CW, h: 0.6, fontSize: 11.5, fontFace: FONT, color: C.body, lineSpacing: 15 },
  )

  const steps = [
    ['01', 'Discover', 'Deep-dive workshops to map challenges, goals, and current-state technology', C.teal],
    ['02', 'Design', 'Architecture blueprints and a phased delivery plan built for your budget', C.sky],
    ['03', 'Deliver', 'Agile sprints, dedicated PMs, and weekly progress reports — on time', C.violetMid],
    ['04', 'Deploy', 'Zero-downtime rollouts with full testing, security sign-off, and training', C.violet],
    ['05', 'Drive', 'Post-launch monitoring, optimisation, and long-term partnership', C.emerald],
  ]
  steps.forEach(([n, t, d, color], i) => {
    const x = MX + i * (CW / 5)
    const w = CW / 5 - 0.22
    const y = 2.2
    s.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 2.9, rectRadius: 0.1, fill: { color: C.white }, line: { color: C.line, width: 1 } })
    s.addShape(pptx.ShapeType.rect, { x, y, w, h: 0.07, fill: { color } })
    s.addText(n, { x: x + 0.18, y: y + 0.2, w: w - 0.36, h: 0.55, fontSize: 26, bold: true, fontFace: FONT, color })
    s.addText(t, { x: x + 0.18, y: y + 0.82, w: w - 0.36, h: 0.35, fontSize: 14.5, bold: true, fontFace: FONT, color: C.ink })
    s.addText(d, { x: x + 0.18, y: y + 1.22, w: w - 0.36, h: 1.55, fontSize: 9.5, fontFace: FONT, color: C.muted, lineSpacing: 12.5 })
  })

  s.addShape(pptx.ShapeType.roundRect, { x: MX, y: 5.55, w: CW, h: 1.05, rectRadius: 0.09, fill: { color: C.white }, line: { color: C.line, width: 1 } })
  s.addText([
    { text: 'Engagement models:  ', options: { bold: true, color: C.ink } },
    { text: 'monthly retainers (Essentials · Growth · Enterprise), fixed-scope projects, and dedicated-team arrangements — in AED, with no hidden fees.', options: { color: C.body } },
  ], { x: MX + 0.3, y: 5.72, w: CW - 0.6, h: 0.7, fontSize: 11, fontFace: FONT, lineSpacing: 15, valign: 'middle' })
  footer(s, 7)
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 8 — PORTFOLIO (project image grid)
// ════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  brandBar(s)
  sectionTitle(s, 'Ventures We Helped Launch')
  s.addText(
    'Through our pre-launch venture programme we build brands from idea to market — product, engineering, and identity under one roof.',
    { x: MX, y: 1.26, w: CW, h: 0.45, fontSize: 11, fontFace: FONT, color: C.body },
  )

  const projects = [
    ['public/projects/nexa-pay.jpg', 'Nexa Pay', 'Payments app — idea to pilot in 8 weeks'],
    ['public/projects/cargoflow.jpg', 'CargoFlow', 'Shipment tracking SaaS — 40% less manual dispatch'],
    ['public/projects/lumora.jpg', 'Lumora', 'D2C skincare launch — 3× launch-month ROAS'],
    ['public/projects/pulse-loop.jpg', 'Pulse Loop', 'Wellness app MVP — app-store beta in 12 weeks'],
    ['public/projects/masakin.jpg', 'Masakin مساكن', 'Bilingual property portal — 2.5K monthly leads'],
    ['public/projects/kidiverse.jpg', 'KidiVerse', 'Kids-safe streaming — full parental-control layer'],
  ]
  const gw = (CW - 0.5) / 3
  projects.forEach(([img, name, sub], i) => {
    const x = MX + (i % 3) * (gw + 0.25)
    const y = 1.85 + Math.floor(i / 3) * 2.35
    s.addImage({ path: img, x, y, w: gw, h: 1.55, sizing: { type: 'cover', w: gw, h: 1.55 } })
    s.addText(name, { x, y: y + 1.57, w: gw, h: 0.3, fontSize: 12.5, bold: true, fontFace: FONT, color: C.ink })
    s.addText(sub, { x, y: y + 1.85, w: gw, h: 0.3, fontSize: 8.5, fontFace: FONT, color: C.muted })
  })

  s.addText('Every venture above was launched pre-market with WeThink as the end-to-end technology partner.', {
    x: MX, y: 6.66, w: CW, h: 0.3, fontSize: 9, italic: true, fontFace: FONT, color: C.muted,
  })
  footer(s, 8)
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 9 — CASE STUDIES
// ════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  brandBar(s)
  sectionTitle(s, 'Case Studies')

  const cases = [
    {
      t: 'Albina Alareeq Digital Hub', tag: 'Construction · Abu Dhabi', c: C.teal,
      d: 'End-to-end digital transformation for a major Abu Dhabi construction firm — a brand-aligned corporate website plus a connected project-management portal unifying field reporting and head-office visibility.',
      out: ['Corporate platform', 'PM portal', 'Unified reporting'],
    },
    {
      t: 'Nabe Eldiyafa Brand & Digital Ecosystem', tag: 'Hospitality · Abu Dhabi', c: C.violet,
      d: 'Full digital launch for a heritage Damascene restaurant — brand identity refresh, a bilingual reservations website, and a 12-month social media programme that filled weekend covers.',
      out: ['Brand identity', 'Bilingual site', '12-month campaign'],
    },
    {
      t: 'KidiVerse — Kids-Safe Streaming', tag: 'EdTech · Amman & UAE', c: C.sky,
      d: 'A kids-first video streaming platform for a family media operator — curated Arabic and English content, six layers of parental controls, and a human-plus-automated content review pipeline.',
      out: ['Parental controls', 'Content pipeline', 'AR/EN library'],
    },
  ]
  cases.forEach((cs, i) => {
    const w = CW / 3 - 0.25
    const x = MX + i * (CW / 3)
    const y = 1.55
    s.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 5.0, rectRadius: 0.1, fill: { color: C.white }, line: { color: C.line, width: 1 } })
    s.addShape(pptx.ShapeType.rect, { x, y, w, h: 0.07, fill: { color: cs.c } })
    s.addText(cs.tag.toUpperCase(), { x: x + 0.25, y: y + 0.22, w: w - 0.5, h: 0.28, fontSize: 8, bold: true, fontFace: FONT, color: cs.c, charSpacing: 1.5 })
    s.addText(cs.t, { x: x + 0.25, y: y + 0.5, w: w - 0.5, h: 0.8, fontSize: 14, bold: true, fontFace: FONT, color: C.ink, lineSpacing: 17 })
    s.addText(cs.d, { x: x + 0.25, y: y + 1.4, w: w - 0.5, h: 2.05, fontSize: 10, fontFace: FONT, color: C.body, lineSpacing: 14 })
    s.addText('DELIVERED', { x: x + 0.25, y: y + 3.52, w: w - 0.5, h: 0.25, fontSize: 7.5, bold: true, fontFace: FONT, color: C.muted, charSpacing: 2 })
    cs.out.forEach((o, j) => {
      chip(s, o, x + 0.25, y + 3.8 + j * 0.38, w - 0.5, { color: cs.c })
    })
  })
  footer(s, 9)
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 10 — WHY WETHINK (dark)
// ════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  darkBg(s)
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.06, fill: grad(C.teal, C.violet, 0) })
  s.addText('Why Choose WeThink', { x: MX, y: 0.42, w: CW, h: 0.55, fontSize: 24, bold: true, fontFace: FONT, color: C.white })
  s.addShape(pptx.ShapeType.rect, { x: MX + 0.02, y: 1.0, w: 0.55, h: 0.045, fill: grad(C.teal, C.violet, 0) })

  const reasons = [
    ['01', 'One Partner, Every Layer', 'Strategy, engineering, design, and operations under one roof — no vendor patchwork, no finger-pointing.', C.teal],
    ['02', 'Founder-Level Attention', 'Founder-led and delivery-obsessed. Senior people stay on your account from kickoff to long after launch.', C.violetMid],
    ['03', 'UAE-Rooted, Gulf-Ready', 'Bilingual Arabic/English delivery, UAE Vision 2031 alignment, and local regulatory awareness (NESA, PDPL).', C.sky],
    ['04', 'Security By Default', 'ISO 27001-aligned practices and zero-trust thinking baked into every build — not bolted on afterwards.', C.rose],
    ['05', 'Speed Without Chaos', 'MVPs in 8–12 weeks with agile governance: weekly demos, transparent backlogs, no surprises.', C.emerald],
    ['06', 'Honest Commercials', 'AED pricing, published retainers, and fixed-scope options. No hidden fees, cancel anytime.', C.amber],
  ]
  reasons.forEach(([n, t, d, color], i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const w = CW / 3 - 0.25
    const x = MX + col * (CW / 3)
    const y = 1.5 + row * 2.65
    s.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 2.35, rectRadius: 0.1, fill: { color: C.dark2 }, line: { color, width: 1 } })
    s.addText(n, { x: x + 0.25, y: y + 0.18, w: 1, h: 0.5, fontSize: 22, bold: true, fontFace: FONT, color })
    s.addText(t, { x: x + 0.25, y: y + 0.7, w: w - 0.5, h: 0.4, fontSize: 13.5, bold: true, fontFace: FONT, color: C.white })
    s.addText(d, { x: x + 0.25, y: y + 1.12, w: w - 0.5, h: 1.1, fontSize: 9.5, fontFace: FONT, color: C.dBody, lineSpacing: 13 })
  })
  footer(s, 10, true)
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 11 — TECHNOLOGY & STANDARDS
// ════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  brandBar(s)
  sectionTitle(s, 'Technology Expertise')
  s.addText('Vendor-neutral by principle — we recommend and build on the platforms that fit your goals, not our margins.', {
    x: MX, y: 1.26, w: CW, h: 0.4, fontSize: 11, fontFace: FONT, color: C.body,
  })

  const groups = [
    ['CLOUD & INFRASTRUCTURE', ['AWS', 'Microsoft Azure', 'Google Cloud', 'Kubernetes', 'Terraform', 'Docker'], C.teal],
    ['ENGINEERING', ['React & Next.js', 'Node.js', 'Flutter', 'React Native', 'Python', 'PostgreSQL & MongoDB'], C.violet],
    ['DATA & AI', ['Power BI', 'Data Warehousing', 'ML Models', 'Real-Time Analytics', 'AI Assistants', 'ETL Pipelines'], C.sky],
    ['SECURITY & DELIVERY', ['Zero Trust', 'SOC Monitoring', 'DevOps & CI/CD', 'Azure DevOps', 'Microservices', 'SAP Integration'], C.rose],
  ]
  groups.forEach(([label, items, color], g) => {
    const w = CW / 4 - 0.22
    const x = MX + g * (CW / 4)
    const y = 1.9
    s.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 3.2, rectRadius: 0.1, fill: { color: C.white }, line: { color: C.line, width: 1 } })
    s.addShape(pptx.ShapeType.rect, { x, y, w, h: 0.07, fill: { color } })
    s.addText(label, { x: x + 0.2, y: y + 0.18, w: w - 0.4, h: 0.5, fontSize: 9.5, bold: true, fontFace: FONT, color: C.ink, charSpacing: 1 })
    items.forEach((it, j) => {
      const iy = y + 0.78 + j * 0.39
      s.addShape(pptx.ShapeType.rect, { x: x + 0.2, y: iy + 0.11, w: 0.08, h: 0.08, fill: { color } })
      s.addText(it, { x: x + 0.36, y: iy, w: w - 0.55, h: 0.32, fontSize: 9.5, fontFace: FONT, color: C.body, valign: 'middle' })
    })
  })

  sectionTitle(s, 'Standards & Compliance Awareness', { y: 5.4, size: 16 })
  const stds = ['ISO 27001 (aligned)', 'NESA / UAE IA', 'UAE PDPL', 'WCAG Accessibility', 'OWASP Practices', 'UAE Gov Digital']
  stds.forEach((b, i) => {
    chip(s, b, MX + (i % 6) * (CW / 6), 6.2, CW / 6 - 0.2, { color: i % 2 ? C.violet : C.tealDark })
  })
  footer(s, 11)
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 12 — ENGAGEMENT MODELS (pricing)
// ════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  brandBar(s)
  sectionTitle(s, 'Engagement Models')
  s.addText('Transparent AED retainers — no hidden fees, cancel anytime. Fixed-scope projects and dedicated teams also available.', {
    x: MX, y: 1.26, w: CW, h: 0.4, fontSize: 11, fontFace: FONT, color: C.body,
  })

  const plans = [
    {
      n: 'Essentials', p: 'AED 1,499', per: '/month', hot: false,
      d: 'Reliable IT support and a clear technology roadmap for small businesses.',
      f: ['IT helpdesk support (8×5)', 'Network & device monitoring', 'Annual security health check', 'Cloud readiness assessment', 'Monthly reports & advisory call', 'Up to 15 users'],
    },
    {
      n: 'Growth', p: 'AED 4,499', per: '/month', hot: true,
      d: 'Managed IT + cloud for scaling teams that want a hands-on partner.',
      f: ['Everything in Essentials', '24×7 monitoring & response', 'Cloud architecture & cost control', 'Security hardening & training', 'Quarterly strategy workshops', 'Dedicated account manager · 60 users'],
    },
    {
      n: 'Enterprise', p: 'Custom', per: '', hot: false,
      d: 'Tailored transformation programmes, scoped and priced per engagement.',
      f: ['Everything in Growth', 'End-to-end digital transformation', 'Custom software & AI solutions', 'ISO 27001 / NESA programmes', 'Dedicated engineering team', 'Custom SLAs & user count'],
    },
  ]
  plans.forEach((p, i) => {
    const w = CW / 3 - 0.25
    const x = MX + i * (CW / 3)
    const y = 1.8
    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w, h: 4.75, rectRadius: 0.1,
      fill: { color: C.white },
      line: { color: p.hot ? C.teal : C.line, width: p.hot ? 1.75 : 1 },
    })
    if (p.hot) {
      s.addShape(pptx.ShapeType.rect, { x: x + 0.05, y, w: w - 0.1, h: 0.09, fill: grad(C.teal, C.violet, 0) })
      s.addShape(pptx.ShapeType.roundRect, { x: x + w - 1.55, y: y + 0.22, w: 1.35, h: 0.32, rectRadius: 0.16, fill: grad(C.teal, C.violet, 0) })
      s.addText('MOST POPULAR', { x: x + w - 1.55, y: y + 0.2, w: 1.35, h: 0.34, fontSize: 7, bold: true, color: C.white, align: 'center', valign: 'middle', fontFace: FONT, charSpacing: 1 })
    }
    s.addText(p.n, { x: x + 0.25, y: y + 0.2, w: w - 0.5, h: 0.4, fontSize: 16, bold: true, fontFace: FONT, color: C.ink })
    s.addText([
      { text: p.p, options: { fontSize: 24, bold: true, color: C.ink } },
      { text: `  ${p.per}`, options: { fontSize: 10.5, color: C.muted } },
    ], { x: x + 0.25, y: y + 0.6, w: w - 0.5, h: 0.5, fontFace: FONT })
    s.addText(p.d, { x: x + 0.25, y: y + 1.16, w: w - 0.5, h: 0.62, fontSize: 9.5, fontFace: FONT, color: C.muted, lineSpacing: 12.5 })
    p.f.forEach((f, j) => {
      const fy = y + 1.92 + j * 0.45
      s.addText('✓', { x: x + 0.22, y: fy, w: 0.25, h: 0.34, fontSize: 10, bold: true, color: p.hot ? C.teal : C.tealDark, fontFace: FONT })
      s.addText(f, { x: x + 0.48, y: fy, w: w - 0.7, h: 0.42, fontSize: 9, fontFace: FONT, color: C.body, valign: 'top', lineSpacing: 11 })
    })
  })
  s.addText('All prices exclusive of VAT (5%). Yearly billing includes two months free.', {
    x: MX, y: 6.72, w: CW, h: 0.3, fontSize: 9, italic: true, fontFace: FONT, color: C.muted,
  })
  footer(s, 12)
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 13 — BRANDS WALL
// ════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  brandBar(s)
  sectionTitle(s, 'Brands In Our Portfolio')
  s.addText('Identities we designed and launched through the pre-launch venture programme — English and Arabic, across fintech, retail, wellness, F&B, fragrance, and real estate.', {
    x: MX, y: 1.26, w: CW, h: 0.5, fontSize: 11, fontFace: FONT, color: C.body, lineSpacing: 15,
  })

  const logos = ['nexa-pay', 'cargoflow', 'lumora', 'pulse-loop', 'qahwat-al-asala', 'anmat', 'abeer-al-diyar', 'masaken']
  const names = ['Nexa Pay · Fintech', 'CargoFlow · Logistics', 'Lumora · Skincare', 'Pulse Loop · Wellness', 'قهوة الأصالة · Café', 'أنماط · Fashion', 'عبير الديار · Fragrance', 'مساكن · Real Estate']
  const gw = (CW - 0.9) / 4
  logos.forEach((l, i) => {
    const x = MX + (i % 4) * (gw + 0.3)
    const y = 2.05 + Math.floor(i / 4) * 2.3
    s.addShape(pptx.ShapeType.roundRect, { x: x - 0.05, y: y - 0.05, w: gw + 0.1, h: 1.9, rectRadius: 0.08, fill: { color: C.white }, line: { color: C.line, width: 1 } })
    s.addImage({ path: `public/logos/${l}.png`, x: x + 0.35, y: y + 0.12, w: gw - 0.7, h: (gw - 0.7) * 0.6, sizing: { type: 'contain', w: gw - 0.7, h: (gw - 0.7) * 0.6 } })
    s.addText(names[i], { x: x - 0.05, y: y + 1.45, w: gw + 0.1, h: 0.3, fontSize: 9.5, bold: true, fontFace: FONT, color: C.ink, align: 'center' })
  })
  footer(s, 13)
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 14 — BACK COVER / CONTACT (dark)
// ════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  darkBg(s)
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.09, fill: grad(C.teal, C.violet, 0) })

  s.addImage({ path: 'public/logo.png', x: W / 2 - 0.45, y: 0.95, w: 0.9, h: 0.9 })
  s.addText([
    { text: 'Think. ', options: { color: C.teal } },
    { text: 'Plan. ', options: { color: C.violetMid } },
    { text: 'Grow.', options: { color: C.white } },
  ], { x: 0, y: 2.0, w: W, h: 0.8, fontSize: 40, bold: true, align: 'center', fontFace: FONT })

  s.addText(
    'Since 2019, WeThink has been helping UAE businesses and founders turn ideas into impactful realities. Let\'s build what\'s next — together.',
    { x: 2.2, y: 2.95, w: W - 4.4, h: 0.85, fontSize: 13, align: 'center', fontFace: FONT, color: C.dBody, lineSpacing: 19 },
  )

  const contacts = [
    ['VISIT', 'www.wethink.ae'],
    ['EMAIL', 'info@wethink.ae'],
    ['CALL / WHATSAPP', '+971 50 312 5078'],
    ['HEADQUARTERS', 'Pixel, Al Reem Island\nAbu Dhabi, UAE'],
  ]
  contacts.forEach(([l, v], i) => {
    const w = CW / 4 - 0.3
    const x = MX + i * (CW / 4) + 0.15
    s.addShape(pptx.ShapeType.rect, { x, y: 4.3, w: 0.32, h: 0.035, fill: { color: i % 2 ? C.violetMid : C.teal } })
    s.addText(l, { x, y: 4.4, w, h: 0.3, fontSize: 9, bold: true, fontFace: FONT, color: C.dMuted, charSpacing: 2 })
    s.addText(v, { x, y: 4.7, w, h: 0.65, fontSize: 11.5, fontFace: FONT, color: C.white, lineSpacing: 15 })
  })

  s.addShape(pptx.ShapeType.rect, { x: 0, y: 6.1, w: W, h: 0.012, fill: { color: C.dMuted, transparency: 60 } })
  s.addText('Instagram  @wethink.ae      ·      LinkedIn  Rasha Aljalam      ·      Facebook  wethink.ae', {
    x: 0, y: 6.3, w: W, h: 0.35, fontSize: 10, align: 'center', fontFace: FONT, color: C.dMuted,
  })
  s.addText('© 2026 WeThink Information Technology Consulting. All rights reserved.', {
    x: 0, y: 6.9, w: W, h: 0.3, fontSize: 8.5, align: 'center', fontFace: FONT, color: C.dMuted,
  })
}

// ── Write file ──────────────────────────────────────────────────────
const OUT = 'public/WeThink-Company-Profile-2026.pptx'
await pptx.writeFile({ fileName: OUT })
console.log('Written', OUT)
