import PptxGenJS from 'pptxgenjs'

const pptx = new PptxGenJS()

// ── Brand colours ──────────────────────────────────────────────────
const C = {
  purple:      '7C3AED',
  purpleDark:  '5B21B6',
  purpleDeep:  '3B0764',
  ink:         '1A0A2E',
  white:       'FFFFFF',
  offWhite:    'F8F7FF',
  muted:       '64748B',
  lightBorder: 'EDE9FE',
  emerald:     '059669',
  sky:         '0EA5E9',
  red:         'EF4444',
  amber:       'F59E0B',
}

pptx.layout = 'LAYOUT_WIDE'   // 13.33 × 7.5 in

// ── helpers ────────────────────────────────────────────────────────

function darkBg(slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: '100%',
    fill: { color: C.ink },
  })
  // subtle dot grid overlay (faked with very small shapes spread)
  for (let col = 0; col <= 12; col++) {
    for (let row = 0; row <= 7; row++) {
      slide.addShape(pptx.ShapeType.ellipse, {
        x: col * 1.1, y: row * 1.1, w: 0.04, h: 0.04,
        fill: { color: 'FFFFFF', transparency: 92 },
        line: { color: 'FFFFFF', transparency: 100 },
      })
    }
  }
}

function lightBg(slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: '100%',
    fill: { color: C.offWhite },
  })
}

function accentBar(slide, yInches = 0) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: yInches, w: '100%', h: 0.06,
    fill: { type: 'grad', stops: [{ position: 0, color: C.purple }, { position: 100, color: C.purpleDark }] },
  })
}

function sectionLabel(slide, text, x, y, color = C.purple) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w: 0.22, h: 0.03,
    fill: { color },
    line: { color, transparency: 100 },
    rectRadius: 1,
  })
  slide.addText(text, {
    x: x + 0.3, y: y - 0.03, w: 3, h: 0.2,
    fontSize: 8, bold: true, color: color,
    charSpacing: 2, align: 'left',
  })
}

function statBox(slide, value, label, x, y, color = C.purple) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w: 2.2, h: 1.1,
    fill: { color: color, transparency: 90 },
    line: { color: color, transparency: 70 },
    rectRadius: 0.12,
  })
  slide.addText(value, {
    x, y: y + 0.1, w: 2.2, h: 0.55,
    fontSize: 30, bold: true, color: color, align: 'center',
  })
  slide.addText(label, {
    x, y: y + 0.65, w: 2.2, h: 0.3,
    fontSize: 10, color: C.muted, align: 'center',
  })
}

function serviceCard(slide, number, title, desc, stat, tags, x, y, w, h, color) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color, transparency: 94 },
    line: { color, transparency: 75 },
    rectRadius: 0.12,
  })
  // number watermark
  slide.addText(number, {
    x: x + w - 0.55, y: y + 0.05, w: 0.5, h: 0.45,
    fontSize: 28, bold: true, color, transparency: 85, align: 'right',
  })
  // title
  slide.addText(title, {
    x: x + 0.18, y: y + 0.14, w: w - 0.36, h: 0.28,
    fontSize: 11, bold: true, color: C.ink, align: 'left',
  })
  // desc
  slide.addText(desc, {
    x: x + 0.18, y: y + 0.4, w: w - 0.36, h: h - 0.85,
    fontSize: 8.5, color: C.muted, align: 'left', wrap: true,
  })
  // stat pill
  if (stat) {
    slide.addText(stat, {
      x: x + 0.18, y: y + h - 0.32, w: w - 0.36, h: 0.2,
      fontSize: 7.5, bold: true, color, align: 'left',
    })
  }
}

function projectCard(slide, category, title, desc, stat, statLabel, accent, x, y, w = 3.0) {
  const h = 1.85
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color: C.white, transparency: 0 },
    line: { color: 'E2E8F0', transparency: 0 },
    shadow: { type: 'outer', blur: 8, offset: 4, angle: 270, color: '000000', transparency: 88 },
    rectRadius: 0.12,
  })
  // top accent line
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h: 0.045,
    fill: { color: accent },
    line: { color: accent, transparency: 100 },
    rectRadius: 0,
  })
  // category
  slide.addText(category.toUpperCase(), {
    x: x + 0.18, y: y + 0.1, w: w - 0.36, h: 0.18,
    fontSize: 7, bold: true, color: accent, charSpacing: 1.5,
  })
  // stat (top right)
  slide.addText(stat, {
    x: x + w - 0.9, y: y + 0.1, w: 0.72, h: 0.22,
    fontSize: 17, bold: true, color: accent, align: 'right',
  })
  slide.addText(statLabel, {
    x: x + w - 0.9, y: y + 0.3, w: 0.72, h: 0.14,
    fontSize: 6.5, color: C.muted, align: 'right',
  })
  // title
  slide.addText(title, {
    x: x + 0.18, y: y + 0.32, w: w - 0.36, h: 0.36,
    fontSize: 11, bold: true, color: C.ink, wrap: true, align: 'left',
  })
  // desc
  slide.addText(desc, {
    x: x + 0.18, y: y + 0.68, w: w - 0.36, h: 0.95,
    fontSize: 8, color: C.muted, wrap: true, align: 'left',
  })
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 1 — Cover
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  darkBg(s)

  // Purple gradient panel (left half)
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 5.8, h: 7.5,
    fill: { type: 'grad', stops: [{ position: 0, color: C.purpleDeep }, { position: 100, color: C.purpleDark }] },
  })

  // Decorative circle
  s.addShape(pptx.ShapeType.ellipse, {
    x: -1.0, y: -1.0, w: 4.5, h: 4.5,
    fill: { color: C.purple, transparency: 80 },
    line: { color: C.purple, transparency: 100 },
  })
  s.addShape(pptx.ShapeType.ellipse, {
    x: 2.2, y: 4.5, w: 3.2, h: 3.2,
    fill: { color: C.purple, transparency: 85 },
    line: { color: C.purple, transparency: 100 },
  })

  // WeThink wordmark
  s.addText('WeThink', {
    x: 0.55, y: 2.3, w: 4.7, h: 1.1,
    fontSize: 60, bold: true, color: C.white, align: 'left',
  })

  // Tagline
  s.addText('Engineered for the Digital Age.', {
    x: 0.55, y: 3.45, w: 4.7, h: 0.4,
    fontSize: 16, color: 'C4B5FD', align: 'left', italic: true,
  })

  // Divider
  s.addShape(pptx.ShapeType.rect, {
    x: 0.55, y: 4.0, w: 1.5, h: 0.05,
    fill: { color: 'A78BFA' },
    line: { color: 'A78BFA', transparency: 100 },
  })

  // Sub-details
  s.addText('IT Consulting  ·  Cloud Strategy  ·  Cybersecurity  ·  Custom Software', {
    x: 0.55, y: 4.2, w: 4.7, h: 0.3,
    fontSize: 9.5, color: 'C4B5FD', align: 'left', charSpacing: 0.5,
  })
  s.addText('Abu Dhabi, UAE  ·  Est. 2019  ·  wethink.ae', {
    x: 0.55, y: 4.6, w: 4.7, h: 0.25,
    fontSize: 9, color: '8B5CF6', align: 'left',
  })

  // Right panel — headline text
  s.addText('Transforming\nEnterprises\nAcross the Gulf.', {
    x: 6.1, y: 1.6, w: 6.8, h: 3.2,
    fontSize: 38, bold: true, color: C.white, align: 'left',
    lineSpacingMultiple: 1.15,
  })
  s.addText(
    'WeThink delivers end-to-end technology consulting, cloud architecture, cybersecurity, and bespoke software — helping UAE and Gulf enterprises compete and grow in an accelerating digital world.',
    {
      x: 6.1, y: 4.85, w: 6.8, h: 1.2,
      fontSize: 11, color: '94A3B8', align: 'left', wrap: true, lineSpacingMultiple: 1.5,
    }
  )

  // Bottom bar
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.2, w: '100%', h: 0.3,
    fill: { color: C.purple, transparency: 60 },
  })
  s.addText('CONFIDENTIAL  ·  Company Profile 2025  ·  wethink.ae', {
    x: 0, y: 7.2, w: '100%', h: 0.3,
    fontSize: 7.5, color: 'A78BFA', align: 'center',
  })
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 2 — About Us + Mission + Vision
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  accentBar(s)

  sectionLabel(s, 'ABOUT US', 0.55, 0.28)
  s.addText('Who We Are', {
    x: 0.55, y: 0.55, w: 5.5, h: 0.65,
    fontSize: 34, bold: true, color: C.ink,
  })

  s.addText(
    'Founded in Abu Dhabi in 2019, WeThink is a technology and IT consulting firm built for the ambitions of UAE and Gulf enterprises. We combine deep technical expertise with strategic advisory — delivering transformation programmes that actually work.\n\nOur multidisciplinary team of engineers, architects, and consultants operates across government, financial services, energy, education, and retail sectors. We speak the language of business and the language of technology — and we bridge the gap between the two.',
    {
      x: 0.55, y: 1.28, w: 6.0, h: 2.8,
      fontSize: 11, color: C.muted, wrap: true, lineSpacingMultiple: 1.7, align: 'left',
    }
  )

  // Mission box
  s.addShape(pptx.ShapeType.rect, {
    x: 0.55, y: 4.25, w: 5.8, h: 1.2,
    fill: { color: C.purple, transparency: 93 },
    line: { color: C.purple, transparency: 75 },
    rectRadius: 0.12,
  })
  s.addText('OUR MISSION', {
    x: 0.75, y: 4.38, w: 5.4, h: 0.22,
    fontSize: 8, bold: true, color: C.purple, charSpacing: 2,
  })
  s.addText(
    'To empower UAE and Gulf organisations with technology strategies and solutions that create lasting competitive advantage — delivered with clarity, speed, and integrity.',
    {
      x: 0.75, y: 4.6, w: 5.4, h: 0.72,
      fontSize: 10.5, color: C.ink, wrap: true, lineSpacingMultiple: 1.5, italic: true,
    }
  )

  // Vision box
  s.addShape(pptx.ShapeType.rect, {
    x: 0.55, y: 5.6, w: 5.8, h: 1.2,
    fill: { color: C.purpleDark, transparency: 93 },
    line: { color: C.purpleDark, transparency: 75 },
    rectRadius: 0.12,
  })
  s.addText('OUR VISION', {
    x: 0.75, y: 5.73, w: 5.4, h: 0.22,
    fontSize: 8, bold: true, color: C.purpleDark, charSpacing: 2,
  })
  s.addText(
    'To be the most trusted technology partner for enterprises across the Middle East — known for transformative outcomes, not just deliverables.',
    {
      x: 0.75, y: 5.95, w: 5.4, h: 0.72,
      fontSize: 10.5, color: C.ink, wrap: true, lineSpacingMultiple: 1.5, italic: true,
    }
  )

  // Right: values
  const values = [
    { icon: '◆', title: 'Client-First Delivery', desc: 'Every engagement is shaped around your goals, your timeline, and your definition of success.' },
    { icon: '◆', title: 'Technical Excellence', desc: 'We hire specialists, not generalists — and hold our work to the highest engineering standards.' },
    { icon: '◆', title: 'Transparent Partnership', desc: 'Clear communication, honest assessments, and no surprises. We are your trusted advisor, not just a vendor.' },
    { icon: '◆', title: 'UAE-Rooted Expertise', desc: 'Deep knowledge of local regulations, culture, and Vision 2031 priorities — applied to global best practice.' },
  ]
  s.addText('Our Values', {
    x: 7.0, y: 0.55, w: 5.8, h: 0.5,
    fontSize: 22, bold: true, color: C.ink,
  })
  values.forEach((v, i) => {
    const yy = 1.2 + i * 1.45
    s.addShape(pptx.ShapeType.rect, {
      x: 7.0, y: yy, w: 5.8, h: 1.28,
      fill: { color: C.white },
      line: { color: 'E2E8F0' },
      shadow: { type: 'outer', blur: 6, offset: 2, angle: 270, color: '7C3AED', transparency: 92 },
      rectRadius: 0.1,
    })
    s.addShape(pptx.ShapeType.rect, {
      x: 7.0, y: yy, w: 0.045, h: 1.28,
      fill: { color: C.purple },
      line: { color: C.purple, transparency: 100 },
      rectRadius: 0,
    })
    s.addText(v.title, {
      x: 7.18, y: yy + 0.12, w: 5.4, h: 0.28,
      fontSize: 11.5, bold: true, color: C.ink,
    })
    s.addText(v.desc, {
      x: 7.18, y: yy + 0.42, w: 5.4, h: 0.72,
      fontSize: 9.5, color: C.muted, wrap: true, lineSpacingMultiple: 1.4,
    })
  })

  accentBar(s, 7.44)
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 3 — Services
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  accentBar(s)

  sectionLabel(s, 'WHAT WE DO', 0.55, 0.28)
  s.addText('Our Services', {
    x: 0.55, y: 0.5, w: 12.0, h: 0.65,
    fontSize: 34, bold: true, color: C.ink,
  })
  s.addText('End-to-end technology services — from strategy and consulting through to build and managed operations.', {
    x: 0.55, y: 1.12, w: 12.0, h: 0.3,
    fontSize: 10.5, color: C.muted,
  })

  const svcs = [
    { n: '01', t: 'Digital Transformation', d: 'End-to-end digital overhaul of your processes, culture, and technology stack — aligned with UAE Vision 2031.', stat: '↑ 70% faster onboarding', color: C.purple },
    { n: '02', t: 'Strategic Consulting', d: 'Technology roadmap design and C-suite advisory — aligning IT investments with long-term business objectives.', stat: '3× faster decision-making', color: '4F46E5' },
    { n: '03', t: 'IT Solutions', d: 'Infrastructure design, systems integration, and managed IT services tailored to your scale and complexity.', stat: '99.98% uptime delivered', color: C.sky },
    { n: '04', t: 'Project Management', d: 'Rigorous PMO governance, agile delivery, and stakeholder coordination — every project on time and on budget.', stat: '100% on-time delivery', color: '9333EA' },
    { n: '05', t: 'Cloud Services', d: 'Hybrid and multi-cloud architecture, migration, and 24/7 managed operations on AWS, Azure, and GCP.', stat: '45% cost reduction', color: '06B6D4' },
    { n: '06', t: 'Cybersecurity', d: 'Zero-trust frameworks, SOC monitoring, penetration testing, and compliance including ISO 27001 and NESA.', stat: 'ISO 27001 in 9 months', color: C.red },
    { n: '07', t: 'Custom Software Dev', d: 'Bespoke web, mobile, and enterprise applications engineered from the ground up for your requirements.', stat: '5,000 users in 6 months', color: C.emerald },
    { n: '08', t: 'Data Analytics', d: 'Business intelligence dashboards, data warehouse design, and ML models that turn raw data into revenue.', stat: '80+ stores connected', color: C.amber },
  ]

  const cols = 4
  const cardW = 3.05
  const cardH = 1.75
  const gapX = 0.12
  const gapY = 0.15
  const startX = 0.55
  const startY = 1.55

  svcs.forEach((sv, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = startX + col * (cardW + gapX)
    const y = startY + row * (cardH + gapY)
    serviceCard(s, sv.n, sv.t, sv.d, sv.stat, [], x, y, cardW, cardH, sv.color)
  })

  accentBar(s, 7.44)
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 4 — Case Studies
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  lightBg(s)
  accentBar(s)

  sectionLabel(s, 'OUR WORK', 0.55, 0.28)
  s.addText('Case Studies', {
    x: 0.55, y: 0.5, w: 12.0, h: 0.65,
    fontSize: 34, bold: true, color: C.ink,
  })
  s.addText('A selection of transformative engagements across government, finance, education, and enterprise sectors.', {
    x: 0.55, y: 1.12, w: 12.0, h: 0.3,
    fontSize: 10.5, color: C.muted,
  })

  const projects = [
    {
      category: 'Digital Transformation',
      title: 'National Digital Identity Platform',
      desc: 'End-to-end design and delivery of a unified citizen identity portal, integrating 12 federal services and reducing onboarding time by 70%.',
      stat: '70%', statLabel: 'faster onboarding',
      accent: C.purple,
    },
    {
      category: 'IT Consulting',
      title: 'Core Banking Modernisation',
      desc: 'Migrated legacy on-premise banking infrastructure to a hybrid cloud environment, cutting operational costs by 45% and improving uptime to 99.98%.',
      stat: '45%', statLabel: 'cost reduction',
      accent: '059669',
    },
    {
      category: 'Custom Software',
      title: 'Smart Campus Management System',
      desc: 'Full-stack IoT-connected campus platform covering attendance, facilities, and energy monitoring — deployed across 3 campuses with 18,000 daily users.',
      stat: '18K', statLabel: 'daily users',
      accent: C.sky,
    },
    {
      category: 'Cybersecurity',
      title: 'Zero-Trust Security Framework',
      desc: 'Implemented a zero-trust network architecture and 24/7 SOC monitoring programme, achieving ISO 27001 certification within 9 months.',
      stat: '9mo', statLabel: 'to ISO 27001',
      accent: C.red,
    },
  ]

  const w = 2.95
  const gap = 0.14
  const startX = 0.55
  projects.forEach((p, i) => {
    projectCard(s, p.category, p.title, p.desc, p.stat, p.statLabel, p.accent, startX + i * (w + gap), 1.55, w)
  })

  // Quote at bottom
  s.addShape(pptx.ShapeType.rect, {
    x: 0.55, y: 5.62, w: 12.23, h: 1.4,
    fill: { color: C.purple, transparency: 94 },
    line: { color: C.purple, transparency: 75 },
    rectRadius: 0.12,
  })
  s.addText('"', {
    x: 0.7, y: 5.6, w: 0.5, h: 0.7,
    fontSize: 52, bold: true, color: C.purple, transparency: 40,
  })
  s.addText(
    '"WeThink transformed our entire IT infrastructure in under 6 months. The team\'s depth of knowledge and project discipline is unlike anything we\'ve experienced before."',
    {
      x: 1.2, y: 5.76, w: 10.0, h: 0.65,
      fontSize: 11, color: C.ink, italic: true, wrap: true,
    }
  )
  s.addText('Ahmed Al Mansoori  ·  CTO, Abu Dhabi National Energy', {
    x: 1.2, y: 6.45, w: 10.0, h: 0.22,
    fontSize: 9, bold: true, color: C.purple,
  })

  accentBar(s, 7.44)
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 5 — Stats & Achievements
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  darkBg(s)

  // Gradient overlay
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: '100%',
    fill: { type: 'grad', stops: [{ position: 0, color: C.purpleDeep, transparency: 30 }, { position: 100, color: C.ink, transparency: 0 }] },
  })

  s.addText('Numbers That', {
    x: 0.55, y: 0.5, w: 12.0, h: 0.75,
    fontSize: 46, bold: true, color: C.white, align: 'center',
  })
  s.addText('Define Us', {
    x: 0.55, y: 1.2, w: 12.0, h: 0.75,
    fontSize: 46, bold: true, color: 'A78BFA', align: 'center',
  })

  const stats = [
    { v: '5+', l: 'Years of Excellence', c: C.purple },
    { v: '5,000+', l: 'Projects Delivered', c: '4F46E5' },
    { v: '1,000+', l: 'Clients Served', c: C.sky },
    { v: '8', l: 'Core Service Areas', c: C.emerald },
    { v: '99.98%', l: 'Average Uptime SLA', c: C.amber },
  ]

  const boxW = 2.35
  const gap = 0.16
  const totalW = stats.length * boxW + (stats.length - 1) * gap
  const startX = (13.33 - totalW) / 2

  stats.forEach((st, i) => {
    const x = startX + i * (boxW + gap)
    s.addShape(pptx.ShapeType.rect, {
      x, y: 2.25, w: boxW, h: 1.5,
      fill: { color: st.c, transparency: 82 },
      line: { color: st.c, transparency: 50 },
      rectRadius: 0.14,
    })
    s.addText(st.v, {
      x, y: 2.35, w: boxW, h: 0.8,
      fontSize: 32, bold: true, color: st.c, align: 'center',
    })
    s.addText(st.l, {
      x, y: 3.1, w: boxW, h: 0.55,
      fontSize: 9, color: '94A3B8', align: 'center', wrap: true,
    })
  })

  // Key achievements list
  s.addText('Key Achievements', {
    x: 0.55, y: 4.05, w: 12.0, h: 0.4,
    fontSize: 18, bold: true, color: C.white, align: 'center',
  })

  const achievements = [
    'ISO 27001 Certification programmes completed in under 9 months',
    'Zero-downtime cloud migrations across financial sector clients',
    'Trusted technology partner for UAE Federal and Emirate Government entities',
    'Custom platforms serving 18,000+ daily active users across UAE campuses',
    'Real-time BI deployed across 80+ retail locations in the Gulf region',
  ]

  achievements.forEach((ach, i) => {
    const col = i % 2 === 0
    const row = Math.floor(i / 2)
    const x = col ? 0.6 : 6.8
    const y = 4.6 + row * 0.48
    const useCol = i < 4 ? C.purple : C.sky
    s.addShape(pptx.ShapeType.ellipse, {
      x: x, y: y + 0.06, w: 0.12, h: 0.12,
      fill: { color: i % 2 === 0 ? C.purple : C.sky },
      line: { color: 'FFFFFF', transparency: 100 },
    })
    s.addText(ach, {
      x: x + 0.2, y, w: 5.8, h: 0.35,
      fontSize: 9.5, color: '94A3B8', wrap: true,
    })
  })

  // Bottom
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.2, w: '100%', h: 0.3,
    fill: { color: C.purple, transparency: 60 },
  })
  s.addText('wethink.ae  ·  Abu Dhabi, UAE', {
    x: 0, y: 7.2, w: '100%', h: 0.3,
    fontSize: 8, color: 'A78BFA', align: 'center',
  })
}

// ══════════════════════════════════════════════════════════════════
// SLIDE 6 — Contact
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide()
  darkBg(s)

  // Left purple panel
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 5.4, h: 7.5,
    fill: { type: 'grad', stops: [{ position: 0, color: C.purpleDeep }, { position: 100, color: C.purpleDark }] },
  })

  // Decorative circles
  s.addShape(pptx.ShapeType.ellipse, {
    x: -0.8, y: -0.8, w: 3.5, h: 3.5,
    fill: { color: C.purple, transparency: 78 },
    line: { color: C.purple, transparency: 100 },
  })
  s.addShape(pptx.ShapeType.ellipse, {
    x: 1.5, y: 5.2, w: 3.5, h: 3.5,
    fill: { color: C.purple, transparency: 82 },
    line: { color: C.purple, transparency: 100 },
  })

  s.addText('Let\'s Build\nSomething\nGreat.', {
    x: 0.45, y: 1.8, w: 4.5, h: 3.0,
    fontSize: 38, bold: true, color: C.white, lineSpacingMultiple: 1.18,
  })
  s.addText('We\'d love to hear about your next project.', {
    x: 0.45, y: 4.9, w: 4.5, h: 0.4,
    fontSize: 11, color: 'C4B5FD', italic: true,
  })

  // Right: contact details
  s.addText('Get in Touch', {
    x: 5.9, y: 0.7, w: 7.0, h: 0.6,
    fontSize: 30, bold: true, color: C.white,
  })
  s.addText('WeThink Technology Consulting', {
    x: 5.9, y: 1.4, w: 7.0, h: 0.3,
    fontSize: 13, bold: true, color: 'A78BFA',
  })

  const contacts = [
    { label: 'Website', value: 'www.wethink.ae' },
    { label: 'Location', value: 'Pixel, Al Reem Island, Abu Dhabi, UAE' },
    { label: 'Established', value: '2019' },
    { label: 'Specialisations', value: 'IT Consulting · Cloud · Cybersecurity · Custom Software · Data Analytics' },
  ]

  contacts.forEach((c, i) => {
    const y = 1.9 + i * 0.82
    s.addShape(pptx.ShapeType.rect, {
      x: 5.9, y, w: 7.0, h: 0.68,
      fill: { color: C.white, transparency: 92 },
      line: { color: C.purple, transparency: 70 },
      rectRadius: 0.08,
    })
    s.addShape(pptx.ShapeType.rect, {
      x: 5.9, y, w: 0.04, h: 0.68,
      fill: { color: C.purple },
      line: { color: C.purple, transparency: 100 },
    })
    s.addText(c.label.toUpperCase(), {
      x: 6.08, y: y + 0.05, w: 6.6, h: 0.2,
      fontSize: 7.5, bold: true, color: C.purple, charSpacing: 1.5,
    })
    s.addText(c.value, {
      x: 6.08, y: y + 0.28, w: 6.6, h: 0.3,
      fontSize: 10.5, color: C.white, wrap: true,
    })
  })

  // CTA
  s.addShape(pptx.ShapeType.rect, {
    x: 5.9, y: 6.1, w: 3.0, h: 0.55,
    fill: { type: 'grad', stops: [{ position: 0, color: C.purple }, { position: 100, color: C.purpleDark }] },
    line: { color: C.purple, transparency: 100 },
    rectRadius: 0.28,
  })
  s.addText('Start a Project →', {
    x: 5.9, y: 6.1, w: 3.0, h: 0.55,
    fontSize: 11.5, bold: true, color: C.white, align: 'center',
  })
  s.addText('info@wethink.ae', {
    x: 9.1, y: 6.22, w: 3.5, h: 0.3,
    fontSize: 10, color: 'A78BFA', align: 'left',
  })

  // Footer
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.2, w: '100%', h: 0.3,
    fill: { color: C.purple, transparency: 60 },
  })
  s.addText('WeThink Technology Consulting  ·  Pixel, Al Reem Island, Abu Dhabi  ·  wethink.ae  ·  © 2025', {
    x: 0, y: 7.2, w: '100%', h: 0.3,
    fontSize: 7.5, color: 'A78BFA', align: 'center',
  })
}

// ── Write file ─────────────────────────────────────────────────────
const outPath = 'public/WeThink-Company-Profile-2025.pptx'
await pptx.writeFile({ fileName: outPath })
console.log(`\n  ✓  Saved → ${outPath}\n`)
