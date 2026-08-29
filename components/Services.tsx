'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import ScrambleText from '@/components/ScrambleText'

const services = [
  {
    number: '01',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
        <path d="M8 20C8 13.373 13.373 8 20 8s12 5.373 12 12-5.373 12-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 14v6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="8" cy="28" r="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 25v-3M8 31v3M5 28H2M11 28h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Digital Transformation & AI',
    description: 'End-to-end overhaul of how the business runs — process, culture and technology — with AI applied where it moves the numbers rather than where it decorates the slide. Aligned with UAE Vision 2031.',
    color: '#7C3AED',
    stat: '70% faster onboarding',
    capabilities: [
      'Operating model & process design',
      'AI, ML and intelligent automation',
      'Workflow and back-office automation',
      'Change management & adoption',
    ],
    tags: ['Process Design', 'AI/ML', 'Automation', 'Vision 2031'],
    featured: true,
  },
  {
    number: '02',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
        <path d="M6 30l8-10 6 6 6-8 8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="28" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M28 8V6M32 12h2M28 16v2M24 12h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Data Analytics & Decision Intelligence',
    description: 'Raw data turned into decisions — dashboards leaders actually open, forecasts they can act on, and a warehouse underneath that the numbers can be trusted from.',
    color: '#F59E0B',
    stat: 'Real-time dashboards',
    capabilities: [
      'BI dashboards & executive reporting',
      'Data warehousing and pipelines',
      'Predictive & forecasting models',
      'KPI and performance frameworks',
    ],
    tags: ['Power BI', 'Data Warehouse', 'ML Models', 'Forecasting'],
    featured: false,
  },
  {
    number: '03',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
        <rect x="4" y="8" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 26l4-8 4 8M30 14l-6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 14h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Business Systems & Digital Platforms',
    description: 'The systems the business actually runs on: bespoke software, the integrations between it, the cloud underneath and the security around all of it — built to scale and to stay up.',
    color: '#0EA5E9',
    stat: '99.98% uptime delivered',
    capabilities: [
      'Custom web, mobile & enterprise apps',
      'Cloud architecture, migration & FinOps',
      'Systems integration and managed IT',
      'Cybersecurity, Zero Trust & compliance',
    ],
    tags: ['React', 'Node.js', 'AWS / Azure / GCP', 'ISO 27001'],
    featured: false,
  },
  {
    number: '04',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
        <path d="M20 4L36 13v14L20 36 4 27V13L20 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M20 4v32M4 13l16 9 16-9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Strategy, Transformation & Optimization',
    description: 'Advisory that ends in delivery — strategy and roadmaps at the top, and the PMO discipline underneath that keeps complex programmes on time, on budget and on scope.',
    color: '#4F46E5',
    stat: '100% on-time delivery',
    capabilities: [
      'C-suite advisory and roadmapping',
      'Operating model optimisation',
      'Programme & project management (PMO)',
      'Cost, process and efficiency reviews',
    ],
    tags: ['Roadmapping', 'OKRs', 'Agile', 'PMO'],
    featured: false,
  },
  {
    number: '05',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
        <rect x="5" y="9" width="30" height="22" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M17 16.5l7 3.5-7 3.5v-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M11 35h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M31 4v3M34.5 6.5L32.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Brand, Events & Media',
    description: 'How the work is seen. Brand systems, the digital platforms around an event, and the film and photography that carry it — from the invitation in someone\u2019s hand to the room on the day.',
    color: '#059669',
    stat: 'From invitation to the room',
    capabilities: [
      'Brand identity and design systems',
      'Event platforms & digital invitations',
      'Film, photography and content',
      'Campaign and launch support',
    ],
    tags: ['Brand Systems', 'Event Platforms', 'Film & Photo', 'Campaigns'],
    featured: false,
  },
]

const PARTICLES = [
  { w: 4, h: 4, top: '15%', left: '10%', dur: '4s', delay: '0s' },
  { w: 3, h: 3, top: '35%', left: '80%', dur: '5.5s', delay: '1s' },
  { w: 5, h: 5, top: '65%', left: '20%', dur: '3.8s', delay: '0.5s' },
  { w: 3, h: 3, top: '80%', left: '70%', dur: '6s', delay: '1.8s' },
  { w: 4, h: 4, top: '50%', left: '50%', dur: '4.5s', delay: '0.3s' },
  { w: 2, h: 2, top: '25%', left: '60%', dur: '5s', delay: '2s' },
]

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const isFeatured = service.featured

  // 3D tilt via spring-smoothed motion values
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotX = useSpring(rawX, { stiffness: 180, damping: 22 })
  const rotY = useSpring(rawY, { stiffness: 180, damping: 22 })

  // Holographic glare position derived from tilt
  const glareLeft = useTransform(rotY, [-15, 15], ['10%', '90%'])
  const glareTop  = useTransform(rotX, [-15, 15], ['90%', '10%'])
  const glareBg   = useMotionTemplate`radial-gradient(circle at ${glareLeft} ${glareTop}, rgba(255,255,255,0.18), transparent 65%)`

  const [hovered, setHovered] = useState(false)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapRef.current) return
    const r = wrapRef.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - 0.5  // -0.5 → 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    rawX.set(-y * 18)
    rawY.set( x * 18)
  }
  const onLeave = () => { rawX.set(0); rawY.set(0); setHovered(false) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ perspective: '1000px' }}
      className={isFeatured ? 'lg:col-span-2' : ''}
    >
      <motion.div
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: 'preserve-3d',
          boxShadow: hovered
            ? `0 30px 70px ${service.color}35, 0 6px 24px rgba(0,0,0,0.10)`
            : '0 2px 16px rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.4s ease',
        }}
        className="relative rounded-3xl overflow-hidden flex flex-col h-full"
      >
        {/* ── Card background ── */}
        <div
          className="absolute inset-0"
          style={{
            background: isFeatured
              ? `linear-gradient(145deg, ${service.color} 0%, ${service.color}B8 100%)`
              : '#FFFFFF',
            border: isFeatured ? 'none' : '1px solid rgba(16,35,46,0.08)',
            borderRadius: 'inherit',
          }}
        />

        {/* ── Floating particles (featured cards only) ── */}
        {isFeatured && PARTICLES.map((p, i) => (
          <div
            key={i}
            className="float-dot absolute rounded-full pointer-events-none"
            style={{
              width: p.w, height: p.h,
              top: p.top, left: p.left,
              background: `${service.color}`,
              animationDuration: p.dur,
              animationDelay: p.delay,
              opacity: 0.35,
            }}
          />
        ))}

        {/* ── Animated border beam ── */}
        <div
          className="card-beam z-10"
          style={{
            background: `conic-gradient(from var(--beam-angle, 0deg), transparent 75%, ${service.color}BB 85%, ${service.color} 90%, ${service.color}BB 95%, transparent 100%)`,
            animationDuration: hovered ? '2s' : '5s',
          }}
        />

        {/* ── Holographic glare (follows tilt) ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          style={{ background: glareBg, opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }}
        />

        {/* ── Gradient top bar ── */}
        <div
          className="relative z-10 h-[3px] flex-shrink-0"
          style={{ background: `linear-gradient(90deg, ${service.color}, ${service.color}44)` }}
        />

        {/* ── Large faded number ── */}
        <div
          className="absolute bottom-1 right-3 font-black leading-none select-none pointer-events-none z-10"
          style={{
            fontSize: 'clamp(5rem, 10vw, 8rem)',
            color: isFeatured ? 'rgba(255,255,255,0.06)' : `${service.color}0D`,
          }}
        >
          {service.number}
        </div>

        {/* ── Content (lifted in Z for depth) ── */}
        <div
          className={`relative z-10 flex flex-col gap-5 p-6 flex-1 ${isFeatured ? 'lg:p-8' : ''}`}
          style={{ transform: 'translateZ(24px)' }}
        >
          {/* Icon */}
          <motion.div
            animate={hovered ? { scale: 1.12, rotate: -6 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: isFeatured ? 'rgba(255,255,255,0.12)' : `${service.color}14`,
              color: isFeatured ? '#fff' : service.color,
              border: `1.5px solid ${isFeatured ? 'rgba(255,255,255,0.2)' : service.color + '28'}`,
              boxShadow: hovered ? `0 0 20px ${service.color}60` : 'none',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            {service.icon}
          </motion.div>

          {/* Title + description */}
          <div>
            <h3
              className={`font-black leading-tight mb-2 ${isFeatured ? 'text-2xl' : 'text-xl'}`}
              style={{ color: isFeatured ? '#fff' : 'var(--text)' }}
            >
              {service.title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: isFeatured ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}
            >
              {service.description}
            </p>
          </div>

          {/* Stat pill */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl w-fit"
            style={{
              background: isFeatured ? 'rgba(255,255,255,0.10)' : `${service.color}0F`,
              border: `1px solid ${isFeatured ? 'rgba(255,255,255,0.18)' : service.color + '22'}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
              style={{ background: isFeatured ? '#fff' : service.color }}
            />
            <span className="text-xs font-bold" style={{ color: isFeatured ? '#fff' : service.color }}>
              {service.stat}
            </span>
          </div>

          {/* Folded-in capabilities */}
          <ul className="flex list-none flex-col gap-1.5 p-0">
            {service.capabilities.map((capability) => (
              <li key={capability} className="flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full"
                  style={{ background: isFeatured ? 'rgba(255,255,255,0.55)' : service.color }}
                />
                <span
                  className="text-[13px] leading-snug"
                  style={{ color: isFeatured ? 'rgba(255,255,255,0.78)' : 'var(--text-muted)' }}
                >
                  {capability}
                </span>
              </li>
            ))}
          </ul>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg"
                style={{
                  background: isFeatured ? 'rgba(255,255,255,0.08)' : 'rgba(124,58,237,0.1)',
                  color: isFeatured ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)',
                  border: `1px solid ${isFeatured ? 'rgba(255,255,255,0.12)' : 'rgba(124,58,237,0.2)'}`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            onClick={() => (document.querySelector('#contact') ? document.querySelector('#contact')!.scrollIntoView({ behavior: 'smooth' }) : window.location.assign('/#contact'))}
            animate={hovered ? { x: 4 } : { x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center gap-1.5 text-sm font-semibold mt-1 w-fit"
            style={{ color: isFeatured ? '#fff' : service.color }}
          >
            <span>Get started</span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M3 7.5h9M8.5 4l3.5 3.5L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Services() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'var(--surface-2)' }} />
      <div className="orb w-[500px] h-[500px] bg-violet-900 opacity-25 top-0 right-[-200px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={ref} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label mx-auto">What We Do</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black mt-3" style={{ color: 'var(--text)' }}>
            <ScrambleText>Our </ScrambleText>
            <ScrambleText className="gradient-text">Services</ScrambleText>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            Five lines of work, from strategy through to the thing running in production —
            and the brand and media around it.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
