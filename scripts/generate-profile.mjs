import PptxGenJS from 'pptxgenjs'

const pptx = new PptxGenJS()
pptx.layout = 'LAYOUT_WIDE'   // 13.33 × 7.5 in

// ── Brand colours ─────────────────────────────────────────────────
const C = {
  purple:     '7C3AED',
  purpleMid:  '8B5CF6',
  purpleDark: '5B21B6',
  purpleDeep: '3B0764',
  ink:        '1A0A2E',
  white:      'FFFFFF',
  offWhite:   'F8F7FF',
  surface:    'F0EFFE',
  muted:      '64748B',
  light:      '94A3B8',
  border:     'E2E8F0',
  emerald:    '059669',
  sky:        '0EA5E9',
  red:        'EF4444',
  amber:      'F59E0B',
  indigo:     '4F46E5',
  cyan:       '06B6D4',
  rose:       'E11D48',
}

// ── Layout constants ───────────────────────────────────────────────
const W  = 13.33   // slide width
const H  = 7.5     // slide height
const MX = 0.55    // left/right margin
const CW = W - MX * 2   // content width = 12.23"
const FOOTER_Y = 7.18

// ── Reusable helpers ───────────────────────────────────────────────

function darkBg(slide, gradEnd = C.ink) {
  slide.addShape(pptx.ShapeType.rect, { x:0, y:0, w:'100%', h:'100%',
    fill:{ type:'grad', stops:[{position:0,color:C.purpleDeep},{position:100,color:gradEnd}] } })
}

function lightBg(slide) {
  slide.addShape(pptx.ShapeType.rect, { x:0, y:0, w:'100%', h:'100%',
    fill:{ color:C.offWhite } })
}

function topBar(slide) {
  slide.addShape(pptx.ShapeType.rect, { x:0, y:0, w:'100%', h:0.055,
    fill:{ type:'grad', stops:[{position:0,color:C.purple},{position:100,color:C.purpleDark}] },
    line:{ transparency:100 } })
}

function bottomBar(slide, dark=false) {
  slide.addShape(pptx.ShapeType.rect, { x:0, y:FOOTER_Y, w:'100%', h:H-FOOTER_Y,
    fill:{ color: dark ? C.purpleDeep : C.purple, transparency: dark ? 40 : 88 },
    line:{ transparency:100 } })
  slide.addText('WeThink Technology Consulting  ·  Abu Dhabi, UAE  ·  wethink.ae  ·  © 2025', {
    x:0, y:FOOTER_Y, w:'100%', h:H-FOOTER_Y,
    fontSize:7.5, color: dark ? 'A78BFA' : C.purple, align:'center' })
}

function slideHeader(slide, label, title, subtitle='') {
  topBar(slide)
  // Label with leading line
  slide.addShape(pptx.ShapeType.rect, { x:MX, y:0.22, w:0.22, h:0.03,
    fill:{ color:C.purple }, line:{ transparency:100 } })
  slide.addText(label, { x:MX+0.30, y:0.14, w:CW, h:0.22,
    fontSize:7.5, bold:true, color:C.purple, charSpacing:2 })
  slide.addText(title, { x:MX, y:0.42, w:CW, h:0.62,
    fontSize:30, bold:true, color:C.ink })
  if (subtitle) {
    slide.addText(subtitle, { x:MX, y:1.04, w:CW, h:0.28,
      fontSize:10, color:C.muted })
  }
}

function metricBox(slide, value, label, x, y, color, w=3.8, h=1.05) {
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h,
    fill:{ color, transparency:90 }, line:{ color, transparency:65 }, rectRadius:0.1 })
  slide.addText(value, { x, y:y+0.08, w, h:0.52,
    fontSize:28, bold:true, color, align:'center' })
  slide.addText(label, { x, y:y+0.6, w, h:0.35,
    fontSize:9, color:C.muted, align:'center', wrap:true })
}

function accentCard(slide, title, body, x, y, w, h, color) {
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h,
    fill:{ color:C.white }, line:{ color:C.border }, rectRadius:0.1,
    shadow:{ type:'outer', blur:6, offset:3, angle:270, color:'000000', transparency:90 } })
  slide.addShape(pptx.ShapeType.rect, { x, y, w:0.045, h,
    fill:{ color }, line:{ transparency:100 }, rectRadius:0 })
  slide.addText(title, { x:x+0.18, y:y+0.14, w:w-0.28, h:0.28,
    fontSize:11.5, bold:true, color:C.ink })
  slide.addText(body, { x:x+0.18, y:y+0.44, w:w-0.28, h:h-0.55,
    fontSize:9.5, color:C.muted, wrap:true, lineSpacingMultiple:1.4 })
}

function tagLine(slide, tags, x, y, color) {
  slide.addText(tags.join('  ·  '), { x, y, w:CW, h:0.22,
    fontSize:8.5, color, bold:true })
}

function orb(slide, cx, cy, r, color, t=80) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x:cx-r, y:cy-r, w:r*2, h:r*2,
    fill:{ color, transparency:t }, line:{ transparency:100 } })
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 1 — COVER
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  darkBg(s, C.ink)
  orb(s, 0, 0, 4.5, C.purple, 86)
  orb(s, W, H, 4.0, C.purpleDark, 82)
  orb(s, W*0.5, H*0.5, 2.5, C.purpleDark, 90)

  // Left panel
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:5.9, h:H,
    fill:{ type:'grad', stops:[{position:0,color:C.purpleDeep},{position:100,color:C.purpleDark}] },
    line:{ transparency:100 } })

  // Brand name
  s.addText('We', { x:0.5, y:1.8, w:5.0, h:1.2,
    fontSize:72, bold:true, color:C.white })
  s.addText('Think', { x:0.5, y:2.8, w:5.0, h:1.2,
    fontSize:72, bold:true, color:'C4B5FD' })

  s.addShape(pptx.ShapeType.rect, { x:0.5, y:4.1, w:2.0, h:0.05,
    fill:{ color:'A78BFA' }, line:{ transparency:100 } })

  s.addText('Engineered for the Digital Age.', { x:0.5, y:4.25, w:5.0, h:0.35,
    fontSize:12, color:'C4B5FD', italic:true })
  s.addText('Abu Dhabi, UAE  ·  Est. 2019  ·  wethink.ae', { x:0.5, y:4.68, w:5.0, h:0.28,
    fontSize:9.5, color:'8B5CF6' })

  s.addText('IT Consulting', { x:0.5, y:5.2, w:5.0, h:0.28, fontSize:9, color:'7C6DAF' })
  s.addText('Cloud Strategy', { x:0.5, y:5.5, w:5.0, h:0.28, fontSize:9, color:'7C6DAF' })
  s.addText('Cybersecurity', { x:0.5, y:5.8, w:5.0, h:0.28, fontSize:9, color:'7C6DAF' })
  s.addText('Custom Software', { x:0.5, y:6.1, w:5.0, h:0.28, fontSize:9, color:'7C6DAF' })

  // Right content
  s.addText('Transforming\nEnterprises\nAcross the Gulf.', { x:6.3, y:1.3, w:6.5, h:3.5,
    fontSize:42, bold:true, color:C.white, lineSpacingMultiple:1.2 })
  s.addText(
    'WeThink delivers end-to-end technology consulting, cloud architecture, cybersecurity, and bespoke software — helping UAE and Gulf enterprises compete and thrive in an accelerating digital world.',
    { x:6.3, y:4.85, w:6.5, h:1.1, fontSize:11, color:'94A3B8', wrap:true, lineSpacingMultiple:1.6 })

  s.addShape(pptx.ShapeType.rect, { x:0, y:FOOTER_Y, w:'100%', h:H-FOOTER_Y,
    fill:{ color:C.purple, transparency:70 }, line:{ transparency:100 } })
  s.addText('Company Profile  2025  ·  Confidential', { x:0, y:FOOTER_Y, w:'100%', h:H-FOOTER_Y,
    fontSize:8, color:'A78BFA', align:'center' })
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 2 — WHO WE ARE
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  slideHeader(s, 'ABOUT US', 'Who We Are',
    'Founded in Abu Dhabi in 2019, WeThink is a technology consulting firm built for the ambitions of UAE and Gulf enterprises.')

  // Main body text — left column
  s.addText(
    'We combine deep technical expertise with strategic advisory — delivering transformation programmes that create measurable, lasting impact.\n\nOur multidisciplinary team of engineers, architects, and consultants operates across government, financial services, energy, education, and retail sectors across the UAE and Gulf region.\n\nWe speak the language of business and the language of technology — and we bridge the gap between the two.',
    { x:MX, y:1.38, w:7.2, h:2.9,
      fontSize:11, color:C.muted, wrap:true, lineSpacingMultiple:1.7 })

  // Right: key facts boxes
  const facts = [
    { label:'Founded',      value:'2019', color:C.purple },
    { label:'Headquarters', value:'Abu Dhabi, UAE', color:C.indigo },
    { label:'Sectors Served', value:'Government · Finance · Energy · Education · Retail', color:C.sky },
    { label:'Capabilities', value:'Strategy · Build · Operate · Optimise', color:C.emerald },
  ]
  facts.forEach((f, i) => {
    const y = 1.38 + i * 1.0
    s.addShape(pptx.ShapeType.rect, { x:8.1, y, w:4.68, h:0.85,
      fill:{ color:f.color, transparency:92 }, line:{ color:f.color, transparency:65 }, rectRadius:0.09 })
    s.addShape(pptx.ShapeType.rect, { x:8.1, y, w:0.045, h:0.85,
      fill:{ color:f.color }, line:{ transparency:100 } })
    s.addText(f.label.toUpperCase(), { x:8.26, y:y+0.1, w:4.3, h:0.2,
      fontSize:7.5, bold:true, color:f.color, charSpacing:1.5 })
    s.addText(f.value, { x:8.26, y:y+0.36, w:4.3, h:0.36,
      fontSize:10.5, color:C.ink, wrap:true })
  })

  // Divider
  s.addShape(pptx.ShapeType.rect, { x:MX, y:4.42, w:7.2, h:0.04,
    fill:{ color:C.border }, line:{ transparency:100 } })

  // Quote
  s.addShape(pptx.ShapeType.rect, { x:MX, y:4.56, w:7.2, h:1.85,
    fill:{ color:C.purple, transparency:93 }, line:{ color:C.purple, transparency:72 }, rectRadius:0.1 })
  s.addText('"', { x:MX+0.1, y:4.52, w:0.5, h:0.6,
    fontSize:52, bold:true, color:C.purple, transparency:35 })
  s.addText(
    '"WeThink transformed our entire IT infrastructure in under 6 months. The team\'s depth of knowledge and project discipline is unlike anything we\'ve experienced before."',
    { x:MX+0.55, y:4.68, w:6.5, h:0.9, fontSize:10.5, color:C.ink, italic:true, wrap:true, lineSpacingMultiple:1.5 })
  s.addText('Ahmed Al Mansoori  ·  CTO, Abu Dhabi National Energy', {
    x:MX+0.55, y:5.65, w:6.5, h:0.25, fontSize:9, bold:true, color:C.purple })

  bottomBar(s)
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 3 — MISSION, VISION & VALUES
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  slideHeader(s, 'FOUNDATION', 'Mission, Vision & Values')

  // Mission
  s.addShape(pptx.ShapeType.rect, { x:MX, y:1.38, w:CW*0.48, h:1.42,
    fill:{ color:C.purple, transparency:91 }, line:{ color:C.purple, transparency:65 }, rectRadius:0.1 })
  s.addText('MISSION', { x:MX+0.2, y:1.5, w:CW*0.48-0.3, h:0.22,
    fontSize:8, bold:true, color:C.purple, charSpacing:2 })
  s.addText(
    'To empower UAE and Gulf organisations with technology strategies and solutions that create lasting competitive advantage — delivered with clarity, speed, and integrity.',
    { x:MX+0.2, y:1.74, w:CW*0.48-0.3, h:0.88,
      fontSize:10.5, color:C.ink, wrap:true, italic:true, lineSpacingMultiple:1.5 })

  // Vision
  const vx = MX + CW*0.52
  s.addShape(pptx.ShapeType.rect, { x:vx, y:1.38, w:CW*0.48, h:1.42,
    fill:{ color:C.indigo, transparency:91 }, line:{ color:C.indigo, transparency:65 }, rectRadius:0.1 })
  s.addText('VISION', { x:vx+0.2, y:1.5, w:CW*0.48-0.3, h:0.22,
    fontSize:8, bold:true, color:C.indigo, charSpacing:2 })
  s.addText(
    'To be the most trusted technology partner for enterprises across the Middle East — known for transformative outcomes, not just deliverables.',
    { x:vx+0.2, y:1.74, w:CW*0.48-0.3, h:0.88,
      fontSize:10.5, color:C.ink, wrap:true, italic:true, lineSpacingMultiple:1.5 })

  // Values — 2×2 grid
  s.addText('Our Core Values', { x:MX, y:2.96, w:CW, h:0.35,
    fontSize:17, bold:true, color:C.ink })

  const values = [
    { t:'Client-First Delivery', d:'Every engagement is shaped around your goals, timeline, and definition of success — not ours.', c:C.purple },
    { t:'Technical Excellence', d:'We hire specialists, not generalists, and hold every deliverable to the highest engineering standards.', c:C.sky },
    { t:'Transparent Partnership', d:'Clear communication, honest assessments, and no surprises — we are your trusted advisor, not a vendor.', c:C.emerald },
    { t:'UAE-Rooted Expertise', d:'Deep knowledge of local regulations, Vision 2031 priorities, and Gulf market dynamics applied to global best practice.', c:C.amber },
  ]

  const vCardW = (CW - 0.15) / 2
  const vCardH = 1.42
  values.forEach((v, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = MX + col * (vCardW + 0.15)
    const y = 3.38 + row * (vCardH + 0.14)
    accentCard(s, v.t, v.d, x, y, vCardW, vCardH, v.c)
  })

  bottomBar(s)
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 4 — SERVICES (1 of 2)
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  slideHeader(s, 'SERVICES  1/2', 'Our Services',
    'End-to-end technology services — from strategy and consulting through to build and managed operations.')

  const svcs = [
    { n:'01', t:'Digital Transformation', d:'End-to-end overhaul of your business processes, culture, and technology stack — aligned with UAE Vision 2031 and global best practices.', stat:'↑ 70% faster onboarding', tags:['Process Design','Change Management','Vision 2031','Roadmapping'], c:C.purple },
    { n:'02', t:'Strategic Consulting', d:'Technology roadmap design and C-suite advisory — aligning IT investments with long-term business objectives and competitive positioning.', stat:'3× faster decision-making', tags:['C-Suite Advisory','OKRs','Technology Roadmap','Business Analysis'], c:C.indigo },
    { n:'03', t:'IT Solutions', d:'Infrastructure design, systems integration, and managed IT services tailored to your organisation\'s scale, complexity, and industry requirements.', stat:'99.98% uptime delivered', tags:['Infrastructure','Managed IT','Systems Integration','ERP'], c:C.sky },
    { n:'04', t:'Project Management', d:'Rigorous PMO governance, agile delivery, and stakeholder coordination — ensuring every technology project lands on time, on budget, and on scope.', stat:'100% on-time delivery', tags:['Agile / Scrum','PMO Governance','Stakeholder Mgmt','Risk Management'], c:'9333EA' },
  ]

  const cardW = (CW - 0.15) / 2
  const cardH = 2.58
  const startY = 1.42

  svcs.forEach((sv, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = MX + col * (cardW + 0.15)
    const y = startY + row * (cardH + 0.16)

    s.addShape(pptx.ShapeType.rect, { x, y, w:cardW, h:cardH,
      fill:{ color:sv.c, transparency:93 }, line:{ color:sv.c, transparency:68 }, rectRadius:0.12 })
    s.addShape(pptx.ShapeType.rect, { x, y, w:0.045, h:cardH,
      fill:{ color:sv.c }, line:{ transparency:100 } })

    // Watermark number
    s.addText(sv.n, { x:x+cardW-0.65, y:y+0.06, w:0.6, h:0.5,
      fontSize:32, bold:true, color:sv.c, transparency:82, align:'right' })

    // Title
    s.addText(sv.t, { x:x+0.2, y:y+0.15, w:cardW-0.8, h:0.36,
      fontSize:14, bold:true, color:C.ink })

    // Description
    s.addText(sv.d, { x:x+0.2, y:y+0.55, w:cardW-0.3, h:1.12,
      fontSize:9.5, color:C.muted, wrap:true, lineSpacingMultiple:1.45 })

    // Stat
    s.addText(sv.stat, { x:x+0.2, y:y+1.72, w:cardW-0.3, h:0.25,
      fontSize:9, bold:true, color:sv.c })

    // Tags
    s.addText(sv.tags.join('  ·  '), { x:x+0.2, y:y+2.0, w:cardW-0.3, h:0.44,
      fontSize:8, color:C.light, wrap:true })
  })

  bottomBar(s)
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 5 — SERVICES (2 of 2)
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  slideHeader(s, 'SERVICES  2/2', 'Our Services',
    'Specialised capabilities across cloud, security, software engineering, and advanced analytics.')

  const svcs = [
    { n:'05', t:'Cloud Services', d:'Hybrid and multi-cloud architecture, migration, and optimisation on AWS, Azure, and GCP — built for resilience, scalability, and cost efficiency.', stat:'45% cost reduction', tags:['AWS · Azure · GCP','Cloud Migration','FinOps','24/7 Operations'], c:C.cyan },
    { n:'06', t:'Cybersecurity', d:'Zero-trust frameworks, 24/7 SOC monitoring, penetration testing, and compliance programmes including ISO 27001 and NESA for critical infrastructure.', stat:'ISO 27001 in 9 months', tags:['Zero Trust','SOC / SIEM','Pen Testing','ISO 27001 · NESA'], c:C.red },
    { n:'07', t:'Custom Software Development', d:'Bespoke web, mobile, and enterprise applications engineered from the ground up — including AI-powered platforms and deep API integrations.', stat:'5,000 users in 6 months', tags:['React · Node.js','Mobile Apps','AI / ML','API Integration'], c:C.emerald },
    { n:'08', t:'Data & Analytics', d:'Business intelligence dashboards, data warehouse architecture, and machine-learning models that turn raw data into actionable revenue-generating intelligence.', stat:'80+ stores connected', tags:['Power BI','Data Warehouse','ML Models','Real-Time BI'], c:C.amber },
  ]

  const cardW = (CW - 0.15) / 2
  const cardH = 2.58
  const startY = 1.42

  svcs.forEach((sv, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = MX + col * (cardW + 0.15)
    const y = startY + row * (cardH + 0.16)

    s.addShape(pptx.ShapeType.rect, { x, y, w:cardW, h:cardH,
      fill:{ color:sv.c, transparency:93 }, line:{ color:sv.c, transparency:68 }, rectRadius:0.12 })
    s.addShape(pptx.ShapeType.rect, { x, y, w:0.045, h:cardH,
      fill:{ color:sv.c }, line:{ transparency:100 } })

    s.addText(sv.n, { x:x+cardW-0.65, y:y+0.06, w:0.6, h:0.5,
      fontSize:32, bold:true, color:sv.c, transparency:82, align:'right' })
    s.addText(sv.t, { x:x+0.2, y:y+0.15, w:cardW-0.8, h:0.36,
      fontSize:14, bold:true, color:C.ink })
    s.addText(sv.d, { x:x+0.2, y:y+0.55, w:cardW-0.3, h:1.12,
      fontSize:9.5, color:C.muted, wrap:true, lineSpacingMultiple:1.45 })
    s.addText(sv.stat, { x:x+0.2, y:y+1.72, w:cardW-0.3, h:0.25,
      fontSize:9, bold:true, color:sv.c })
    s.addText(sv.tags.join('  ·  '), { x:x+0.2, y:y+2.0, w:cardW-0.3, h:0.44,
      fontSize:8, color:C.light, wrap:true })
  })

  bottomBar(s)
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 6 — CASE STUDY 1: National Digital Identity Platform
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  topBar(s)

  const AC = C.purple

  // Left column
  s.addText('CASE STUDY  ·  DIGITAL TRANSFORMATION  ·  GOVERNMENT', {
    x:MX, y:0.17, w:8.0, h:0.22, fontSize:7.5, bold:true, color:AC, charSpacing:1.2 })

  s.addText('National Digital\nIdentity Platform', {
    x:MX, y:0.44, w:7.9, h:1.05,
    fontSize:28, bold:true, color:C.ink, lineSpacingMultiple:1.18 })

  s.addText('Government Entity — UAE', {
    x:MX, y:1.54, w:7.9, h:0.28, fontSize:11, bold:true, color:AC })

  s.addShape(pptx.ShapeType.rect, { x:MX, y:1.88, w:7.5, h:0.04,
    fill:{ color:C.border }, line:{ transparency:100 } })

  s.addText('Project Overview', {
    x:MX, y:2.0, w:7.5, h:0.28, fontSize:11, bold:true, color:C.ink })
  s.addText(
    'WeThink was engaged to design and deliver a unified citizen identity portal for a UAE federal entity, integrating 12 separate government services into a single secure platform. The programme covered discovery, UX design, cloud architecture, identity and access management, and full API integration with legacy systems.',
    { x:MX, y:2.3, w:7.5, h:1.1, fontSize:10, color:C.muted, wrap:true, lineSpacingMultiple:1.55 })

  // Challenge / Approach
  accentCard(s, 'The Challenge',
    'Fragmented citizen experience across 12 federal services. Manual onboarding process taking 3–4 weeks per citizen. No unified identity layer.',
    MX, 3.54, 3.62, 1.28, C.red)

  accentCard(s, 'Our Approach',
    'Cloud-native identity platform with single sign-on, biometric verification, and a microservices API layer connecting all 12 services in real time.',
    MX+3.78, 3.54, 3.72, 1.28, AC)

  // Technologies
  s.addText('TECHNOLOGIES', { x:MX, y:4.96, w:7.5, h:0.22,
    fontSize:7.5, bold:true, color:C.light, charSpacing:1.5 })
  tagLine(s, ['Cloud Architecture','Identity & Access Management','API Integration','Microservices','Biometric Verification'], MX, 5.2, AC)

  // Right column — metrics
  const metrics = [
    { v:'70%', l:'Reduction in onboarding time', c:AC },
    { v:'12',  l:'Federal services integrated', c:C.indigo },
    { v:'1M+', l:'Citizens served on platform', c:C.emerald },
  ]
  metrics.forEach((m, i) => metricBox(s, m.v, m.l, 8.78, 0.55 + i*1.9, m.c, 4.0, 1.68))

  bottomBar(s)
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 7 — CASE STUDY 2: Core Banking Modernisation
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  topBar(s)

  const AC = C.emerald

  s.addText('CASE STUDY  ·  IT CONSULTING  ·  FINANCIAL SERVICES', {
    x:MX, y:0.17, w:8.0, h:0.22, fontSize:7.5, bold:true, color:AC, charSpacing:1.2 })

  s.addText('Core Banking\nModernisation', {
    x:MX, y:0.44, w:7.9, h:1.05,
    fontSize:28, bold:true, color:C.ink, lineSpacingMultiple:1.18 })

  s.addText('Financial Institution — Abu Dhabi, UAE', {
    x:MX, y:1.54, w:7.9, h:0.28, fontSize:11, bold:true, color:AC })

  s.addShape(pptx.ShapeType.rect, { x:MX, y:1.88, w:7.5, h:0.04,
    fill:{ color:C.border }, line:{ transparency:100 } })

  s.addText('Project Overview', {
    x:MX, y:2.0, w:7.5, h:0.28, fontSize:11, bold:true, color:C.ink })
  s.addText(
    'WeThink led the full migration of a legacy on-premise core banking infrastructure to a hybrid cloud environment. The 18-month programme included a phased migration strategy to ensure zero downtime, a DevSecOps transformation, and a new cybersecurity framework aligned with UAE Central Bank regulations.',
    { x:MX, y:2.3, w:7.5, h:1.1, fontSize:10, color:C.muted, wrap:true, lineSpacingMultiple:1.55 })

  accentCard(s, 'The Challenge',
    'High maintenance costs on aging on-premise infrastructure. Frequent downtime impacting business operations. No modern DevOps or security practices in place.',
    MX, 3.54, 3.62, 1.28, C.red)

  accentCard(s, 'Our Approach',
    'Phased zero-downtime migration to hybrid cloud (Azure). Introduced CI/CD pipelines, automated testing, and a UAE Central Bank-compliant cybersecurity framework.',
    MX+3.78, 3.54, 3.72, 1.28, AC)

  s.addText('TECHNOLOGIES', { x:MX, y:4.96, w:7.5, h:0.22,
    fontSize:7.5, bold:true, color:C.light, charSpacing:1.5 })
  tagLine(s, ['Hybrid Cloud (Azure)','DevSecOps','CI/CD Pipelines','Cybersecurity','UAE Central Bank Compliance'], MX, 5.2, AC)

  const metrics = [
    { v:'45%', l:'Reduction in IT operational costs', c:AC },
    { v:'99.98%', l:'System uptime post-migration', c:C.sky },
    { v:'0', l:'Downtime incidents during migration', c:C.purple },
  ]
  metrics.forEach((m, i) => metricBox(s, m.v, m.l, 8.78, 0.55 + i*1.9, m.c, 4.0, 1.68))

  bottomBar(s)
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 8 — CASE STUDY 3: Smart Campus Management System
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  topBar(s)

  const AC = C.sky

  s.addText('CASE STUDY  ·  CUSTOM SOFTWARE  ·  HIGHER EDUCATION', {
    x:MX, y:0.17, w:8.0, h:0.22, fontSize:7.5, bold:true, color:AC, charSpacing:1.2 })

  s.addText('Smart Campus\nManagement System', {
    x:MX, y:0.44, w:7.9, h:1.05,
    fontSize:28, bold:true, color:C.ink, lineSpacingMultiple:1.18 })

  s.addText('Higher Education Institution — UAE  (3 Campuses)', {
    x:MX, y:1.54, w:7.9, h:0.28, fontSize:11, bold:true, color:AC })

  s.addShape(pptx.ShapeType.rect, { x:MX, y:1.88, w:7.5, h:0.04,
    fill:{ color:C.border }, line:{ transparency:100 } })

  s.addText('Project Overview', {
    x:MX, y:2.0, w:7.5, h:0.28, fontSize:11, bold:true, color:C.ink })
  s.addText(
    'WeThink designed and built a full-stack IoT-connected campus management platform deployed across 3 campuses. The platform unifies student attendance, facility bookings, energy monitoring, and security access into a single mobile-first system — integrated with the university\'s existing ERP and student information systems.',
    { x:MX, y:2.3, w:7.5, h:1.1, fontSize:10, color:C.muted, wrap:true, lineSpacingMultiple:1.55 })

  accentCard(s, 'The Challenge',
    'Separate disconnected systems across 3 campuses for attendance, facilities, and energy. No real-time visibility. High administrative overhead.',
    MX, 3.54, 3.62, 1.28, C.red)

  accentCard(s, 'Our Approach',
    'Built a unified React/Node.js platform with IoT sensor integration on Azure. Mobile app for students and staff. Real-time dashboards for campus operations teams.',
    MX+3.78, 3.54, 3.72, 1.28, AC)

  s.addText('TECHNOLOGIES', { x:MX, y:4.96, w:7.5, h:0.22,
    fontSize:7.5, bold:true, color:C.light, charSpacing:1.5 })
  tagLine(s, ['React & Node.js','Microsoft Azure','IoT Sensors','Mobile Application','ERP Integration'], MX, 5.2, AC)

  const metrics = [
    { v:'18K', l:'Daily active users across campuses', c:AC },
    { v:'3', l:'Campuses unified on one platform', c:C.purple },
    { v:'30%', l:'Reduction in energy consumption', c:C.emerald },
  ]
  metrics.forEach((m, i) => metricBox(s, m.v, m.l, 8.78, 0.55 + i*1.9, m.c, 4.0, 1.68))

  bottomBar(s)
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 9 — CASE STUDY 4: Zero-Trust Security Framework
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  topBar(s)

  const AC = C.red

  s.addText('CASE STUDY  ·  CYBERSECURITY  ·  ENERGY SECTOR', {
    x:MX, y:0.17, w:8.0, h:0.22, fontSize:7.5, bold:true, color:AC, charSpacing:1.2 })

  s.addText('Zero-Trust Security\nFramework', {
    x:MX, y:0.44, w:7.9, h:1.05,
    fontSize:28, bold:true, color:C.ink, lineSpacingMultiple:1.18 })

  s.addText('Energy Sector — ADNOC Supply Chain, Abu Dhabi', {
    x:MX, y:1.54, w:7.9, h:0.28, fontSize:11, bold:true, color:AC })

  s.addShape(pptx.ShapeType.rect, { x:MX, y:1.88, w:7.5, h:0.04,
    fill:{ color:C.border }, line:{ transparency:100 } })

  s.addText('Project Overview', {
    x:MX, y:2.0, w:7.5, h:0.28, fontSize:11, bold:true, color:C.ink })
  s.addText(
    'WeThink was engaged to implement a zero-trust network architecture and establish a 24/7 Security Operations Centre (SOC) for a critical ADNOC supply chain operator. The engagement included a full security audit, threat modelling, network re-segmentation, and a 9-month ISO 27001 certification programme.',
    { x:MX, y:2.3, w:7.5, h:1.1, fontSize:10, color:C.muted, wrap:true, lineSpacingMultiple:1.55 })

  accentCard(s, 'The Challenge',
    'No formal security framework in place. Network perimeter-based security with no monitoring. Compliance gap against NESA and ISO 27001 required by ADNOC supply chain.',
    MX, 3.54, 3.62, 1.28, C.red)

  accentCard(s, 'Our Approach',
    'Full zero-trust re-architecture, 24/7 SOC with SIEM, penetration testing programme, and a structured ISO 27001 readiness sprint over 9 months.',
    MX+3.78, 3.54, 3.72, 1.28, AC)

  s.addText('TECHNOLOGIES', { x:MX, y:4.96, w:7.5, h:0.22,
    fontSize:7.5, bold:true, color:C.light, charSpacing:1.5 })
  tagLine(s, ['Zero Trust Architecture','SOC / SIEM','Penetration Testing','ISO 27001','NESA Compliance'], MX, 5.2, AC)

  const metrics = [
    { v:'9mo', l:'To ISO 27001 certification', c:AC },
    { v:'0', l:'Security incidents post-deployment', c:C.emerald },
    { v:'100%', l:'NESA compliance achieved', c:C.amber },
  ]
  metrics.forEach((m, i) => metricBox(s, m.v, m.l, 8.78, 0.55 + i*1.9, m.c, 4.0, 1.68))

  bottomBar(s)
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 10 — WHY CHOOSE WETHINK
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  slideHeader(s, 'OUR DIFFERENCE', 'Why Choose WeThink',
    'Four qualities that set us apart — and keep our clients coming back.')

  const reasons = [
    {
      n:'01', t:'UAE-Native Expertise',
      d:'Deep understanding of local regulations, UAE Vision 2031, NESA standards, and Gulf market dynamics — applied alongside global technology best practice. We know how business gets done here.',
      c:C.purple,
    },
    {
      n:'02', t:'End-to-End Ownership',
      d:'We don\'t hand off deliverables and disappear. We own the outcome from initial strategy through design, build, and post-launch operations — ensuring every project actually succeeds in production.',
      c:C.sky,
    },
    {
      n:'03', t:'Certified Professionals',
      d:'Our team holds certifications across AWS, Azure, GCP, PMP, CISSP, ISO 27001, and more. Clients benefit from proven, credentialed expertise — not junior consultants on the job for the first time.',
      c:C.emerald,
    },
    {
      n:'04', t:'Proven Track Record',
      d:'5,000+ projects delivered, 1,000+ clients served, and a portfolio spanning UAE federal government, leading banks, energy operators, and fast-growing startups. Our results speak for themselves.',
      c:C.amber,
    },
  ]

  const cardW = (CW - 0.15) / 2
  const cardH = 2.52
  const startY = 1.42

  reasons.forEach((r, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = MX + col * (cardW + 0.15)
    const y = startY + row * (cardH + 0.16)

    s.addShape(pptx.ShapeType.rect, { x, y, w:cardW, h:cardH,
      fill:{ color:r.c, transparency:92 }, line:{ color:r.c, transparency:65 }, rectRadius:0.12 })

    // Large background number
    s.addText(r.n, { x:x+cardW-0.62, y:y+0.08, w:0.58, h:0.52,
      fontSize:32, bold:true, color:r.c, transparency:80, align:'right' })

    // Left accent bar
    s.addShape(pptx.ShapeType.rect, { x, y, w:0.045, h:cardH,
      fill:{ color:r.c }, line:{ transparency:100 } })

    s.addText(r.t, { x:x+0.2, y:y+0.16, w:cardW-0.75, h:0.36,
      fontSize:14, bold:true, color:C.ink })

    s.addText(r.d, { x:x+0.2, y:y+0.58, w:cardW-0.3, h:1.82,
      fontSize:9.5, color:C.muted, wrap:true, lineSpacingMultiple:1.48 })
  })

  bottomBar(s)
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 11 — STATS & ACHIEVEMENTS
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  darkBg(s, C.ink)
  orb(s, 0, 0, 3.5, C.purple, 88)
  orb(s, W, H, 3.0, C.purpleDark, 85)

  topBar(s)

  s.addShape(pptx.ShapeType.rect, { x:MX, y:0.14, w:0.22, h:0.03,
    fill:{ color:'A78BFA' }, line:{ transparency:100 } })
  s.addText('BY THE NUMBERS', { x:MX+0.3, y:0.08, w:CW, h:0.22,
    fontSize:7.5, bold:true, color:'A78BFA', charSpacing:2 })

  s.addText('Numbers That', { x:MX, y:0.38, w:CW, h:0.68,
    fontSize:44, bold:true, color:C.white })
  s.addText('Define Us', { x:MX, y:1.0, w:CW, h:0.68,
    fontSize:44, bold:true, color:'A78BFA' })

  const stats = [
    { v:'5+',     l:'Years of Excellence', c:C.purple },
    { v:'5,000+', l:'Projects Delivered',  c:C.indigo },
    { v:'1,000+', l:'Clients Served',      c:C.sky },
    { v:'99.98%', l:'Average Uptime SLA',  c:C.emerald },
    { v:'8',      l:'Core Service Areas',  c:C.amber },
  ]

  const boxW = 2.28
  const totalW = stats.length * boxW + (stats.length-1) * 0.12
  const sx = (W - totalW) / 2

  stats.forEach((st, i) => {
    const x = sx + i*(boxW+0.12)
    s.addShape(pptx.ShapeType.rect, { x, y:2.0, w:boxW, h:1.55,
      fill:{ color:st.c, transparency:80 }, line:{ color:st.c, transparency:50 }, rectRadius:0.12 })
    s.addText(st.v, { x, y:2.08, w:boxW, h:0.75,
      fontSize:34, bold:true, color:st.c, align:'center' })
    s.addText(st.l, { x, y:2.8, w:boxW, h:0.6,
      fontSize:9, color:'94A3B8', align:'center', wrap:true })
  })

  // Achievements
  s.addShape(pptx.ShapeType.rect, { x:MX, y:3.75, w:CW, h:0.04,
    fill:{ color:C.purpleDark, transparency:50 }, line:{ transparency:100 } })

  s.addText('Key Achievements', { x:MX, y:3.86, w:CW, h:0.38,
    fontSize:17, bold:true, color:C.white })

  const achievements = [
    { t:'ISO 27001 certification programmes completed in under 9 months', c:C.purple },
    { t:'Zero-downtime cloud migrations delivered across multiple financial sector clients', c:C.sky },
    { t:'Trusted technology partner for UAE Federal and Emirate Government entities', c:C.emerald },
    { t:'Custom platforms serving 18,000+ daily active users across UAE university campuses', c:C.amber },
    { t:'Real-time BI platforms deployed across 80+ retail locations in the Gulf region', c:C.indigo },
    { t:'AI-powered SaaS HR platform reaching 5,000 active users within 6 months of launch', c:C.rose },
  ]

  achievements.forEach((a, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = MX + col * (CW/2 + 0.1)
    const y = 4.32 + row * 0.52

    s.addShape(pptx.ShapeType.ellipse, { x, y:y+0.07, w:0.1, h:0.1,
      fill:{ color:a.c }, line:{ transparency:100 } })
    s.addText(a.t, { x:x+0.2, y, w:5.8, h:0.45,
      fontSize:9, color:'94A3B8', wrap:true })
  })

  s.addShape(pptx.ShapeType.rect, { x:0, y:FOOTER_Y, w:'100%', h:H-FOOTER_Y,
    fill:{ color:C.purple, transparency:70 }, line:{ transparency:100 } })
  s.addText('wethink.ae  ·  Abu Dhabi, UAE', { x:0, y:FOOTER_Y, w:'100%', h:H-FOOTER_Y,
    fontSize:8, color:'A78BFA', align:'center' })
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 12 — CONTACT & NEXT STEPS
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  darkBg(s, C.ink)
  orb(s, 0, H, 4.0, C.purple, 85)
  orb(s, W, 0, 3.5, C.purpleDark, 88)

  // Left panel
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:5.6, h:H,
    fill:{ type:'grad', stops:[{position:0,color:C.purpleDeep},{position:100,color:C.purpleDark}] },
    line:{ transparency:100 } })

  s.addText('Let\'s Build\nSomething\nGreat Together.', { x:0.48, y:1.5, w:4.7, h:3.2,
    fontSize:36, bold:true, color:C.white, lineSpacingMultiple:1.2 })
  s.addText('We\'d love to hear about your next project.', { x:0.48, y:4.78, w:4.7, h:0.38,
    fontSize:11, color:'C4B5FD', italic:true })
  s.addText('Reach out and let\'s start a conversation.', { x:0.48, y:5.18, w:4.7, h:0.3,
    fontSize:10, color:'8B5CF6' })

  // Right panel
  s.addText('Contact Us', { x:6.0, y:0.55, w:6.8, h:0.65,
    fontSize:34, bold:true, color:C.white })
  s.addText('WeThink Technology Consulting', { x:6.0, y:1.24, w:6.8, h:0.32,
    fontSize:13, bold:true, color:'A78BFA' })

  const contacts = [
    { label:'Website',        value:'www.wethink.ae' },
    { label:'Email',          value:'info@wethink.ae' },
    { label:'Location',       value:'Pixel Building, Al Reem Island, Abu Dhabi, UAE' },
    { label:'Established',    value:'2019  ·  UAE Registered' },
  ]

  contacts.forEach((c, i) => {
    const y = 1.68 + i * 0.95
    s.addShape(pptx.ShapeType.rect, { x:6.0, y, w:6.78, h:0.78,
      fill:{ color:C.white, transparency:90 }, line:{ color:C.purple, transparency:65 }, rectRadius:0.09 })
    s.addShape(pptx.ShapeType.rect, { x:6.0, y, w:0.04, h:0.78,
      fill:{ color:C.purple }, line:{ transparency:100 } })
    s.addText(c.label.toUpperCase(), { x:6.16, y:y+0.09, w:6.4, h:0.2,
      fontSize:7.5, bold:true, color:C.purple, charSpacing:1.5 })
    s.addText(c.value, { x:6.16, y:y+0.32, w:6.4, h:0.35,
      fontSize:11, color:C.white, wrap:true })
  })

  // Services recap
  s.addText('SERVICES', { x:6.0, y:5.66, w:1.0, h:0.22,
    fontSize:7.5, bold:true, color:'8B5CF6', charSpacing:1.5 })
  s.addText('IT Consulting  ·  Cloud Strategy  ·  Cybersecurity  ·  Custom Software  ·  Data Analytics  ·  Digital Transformation', {
    x:7.12, y:5.66, w:5.66, h:0.22,
    fontSize:8.5, color:'94A3B8' })

  // CTA button
  s.addShape(pptx.ShapeType.rect, { x:6.0, y:6.08, w:3.2, h:0.6,
    fill:{ type:'grad', stops:[{position:0,color:C.purple},{position:100,color:C.purpleDark}] },
    line:{ transparency:100 }, rectRadius:0.3 })
  s.addText('Start Your Project  →', { x:6.0, y:6.08, w:3.2, h:0.6,
    fontSize:12, bold:true, color:C.white, align:'center' })

  s.addShape(pptx.ShapeType.rect, { x:0, y:FOOTER_Y, w:'100%', h:H-FOOTER_Y,
    fill:{ color:C.purple, transparency:65 }, line:{ transparency:100 } })
  s.addText('WeThink Technology Consulting  ·  Abu Dhabi, UAE  ·  wethink.ae  ·  © 2025', {
    x:0, y:FOOTER_Y, w:'100%', h:H-FOOTER_Y,
    fontSize:8, color:'A78BFA', align:'center' })
}

// ── Write ──────────────────────────────────────────────────────────
const outPath = 'public/WeThink-Company-Profile-2025.pptx'
await pptx.writeFile({ fileName: outPath })
console.log(`\n  ✓  12 slides saved → ${outPath}\n`)
