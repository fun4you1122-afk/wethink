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
    title: 'Digital Transformation',
    description: 'End-to-end digital overhaul of your business processes, culture, and technology stack — aligned with UAE Vision 2031.',
    color: '#7C3AED',
    stat: '70% faster onboarding',
    tags: ['Process Design', 'Change Mgmt', 'Vision 2031'],
    featured: true,
  },
  {
    number: '02',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
        <path d="M20 4L36 13v14L20 36 4 27V13L20 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M20 4v32M4 13l16 9 16-9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Strategic Consulting',
    description: 'Data-driven strategy and C-suite advisory that helps businesses navigate complexity and unlock competitive advantage.',
    color: '#4F46E5',
    stat: '3× faster decision-making',
    tags: ['Roadmapping', 'C-Suite Advisory', 'OKRs'],
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
    title: 'IT Solutions',
    description: 'Tailored infrastructure, software integration, and managed IT services that scale with your business ambitions.',
    color: '#0EA5E9',
    stat: '99.98% uptime delivered',
    tags: ['Infrastructure', 'Managed IT', 'Integration'],
    featured: false,
  },
  {
    number: '04',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
        <path d="M6 10h28M6 20h20M6 30h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="32" cy="28" r="6" stroke="currentColor" strokeWidth="2"/>
        <path d="M30 28l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Project Management',
    description: 'Agile and structured delivery frameworks that keep complex technology projects on time, on budget, and on scope.',
    color: '#9333EA',
    stat: '100% on-time delivery',
    tags: ['Agile', 'PMO', 'Stakeholder Mgmt'],
    featured: false,
  },
  {
    number: '05',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
        <path d="M8 26c0-7.18 5.82-13 13-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 26c0-3.866 3.134-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="21" cy="26" r="2" fill="currentColor"/>
        <path d="M28 10v4M34 16h-4M28 30v-4M22 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Cloud Services',
    description: 'Multi-cloud architecture, migration, and optimisation on AWS, Azure, and GCP — built for resilience and efficiency.',
    color: '#06B6D4',
    stat: '45% cost reduction',
    tags: ['AWS', 'Azure', 'GCP', 'FinOps'],
    featured: false,
  },
  {
    number: '06',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
        <rect x="12" y="18" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M15 18v-4a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="20" cy="25" r="2" fill="currentColor"/>
        <path d="M20 27v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Cybersecurity',
    description: 'Comprehensive security assessments, threat monitoring, and compliance frameworks that protect your critical assets.',
    color: '#EF4444',
    stat: 'ISO 27001 in 9 months',
    tags: ['Zero Trust', 'SOC 24/7', 'NESA'],
    featured: true,
  },
  {
    number: '07',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
        <path d="M8 32V16l12-8 12 8v16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <rect x="16" y="22" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 16h4M22 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Custom Software Dev',
    description: 'Bespoke web, mobile, and enterprise applications engineered from the ground up for your unique requirements.',
    color: '#059669',
    stat: '5K users in 6 months',
    tags: ['React', 'Node.js', 'Mobile', 'AI/ML'],
    featured: false,
  },
  {
    number: '08',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
        <path d="M6 30l8-10 6 6 6-8 8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="28" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M28 8V6M32 12h2M28 16v2M24 12h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Data Analytics',
    description: 'Transform raw data into actionable intelligence — dashboards, predictive models, and BI platforms built to drive decisions.',
    color: '#F59E0B',
    stat: '80+ stores connected',
    tags: ['Power BI', 'ML Models', 'Data Warehouse'],
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
              ? `linear-gradient(145deg, #0A0015 0%, ${service.color}CC 100%)`
              : '#0D0D18',
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
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
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
            From strategy to execution — we deliver the full spectrum of digital and technology services
            that modern enterprises demand.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
