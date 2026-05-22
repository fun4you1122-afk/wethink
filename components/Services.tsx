'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
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

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const isFeatured = service.featured

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8 }}
      className={`group relative rounded-3xl overflow-hidden flex flex-col ${
        isFeatured ? 'lg:col-span-2' : ''
      }`}
      style={{
        background: isFeatured
          ? `linear-gradient(145deg, #1A0A2E 0%, ${service.color}CC 100%)`
          : '#FFFFFF',
        border: `1px solid ${isFeatured ? service.color + '60' : service.color + '22'}`,
        boxShadow: hovered
          ? `0 24px 64px ${service.color}30, 0 4px 20px rgba(0,0,0,0.08)`
          : '0 2px 16px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      {/* Mouse-following spotlight glow */}
      <div
        className="pointer-events-none absolute z-0 rounded-full transition-opacity duration-300"
        style={{
          width: 320,
          height: 320,
          background: `radial-gradient(circle, ${service.color}35, transparent 70%)`,
          left: mouse.x - 160,
          top: mouse.y - 160,
          filter: 'blur(24px)',
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Gradient top bar */}
      <div
        className="h-[3px] w-full flex-shrink-0"
        style={{ background: `linear-gradient(90deg, ${service.color}, ${service.color}44)` }}
      />

      {/* Large faded background number */}
      <div
        className="absolute bottom-2 right-3 text-[8rem] font-black leading-none select-none pointer-events-none"
        style={{
          color: isFeatured ? 'rgba(255,255,255,0.06)' : `${service.color}0D`,
          lineHeight: 1,
        }}
      >
        {service.number}
      </div>

      <div className={`relative z-10 flex flex-col gap-5 p-6 flex-1 ${isFeatured ? 'lg:p-8' : ''}`}>
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isFeatured ? 'rgba(255,255,255,0.12)' : `${service.color}14`,
            color: isFeatured ? '#fff' : service.color,
            border: `1.5px solid ${isFeatured ? 'rgba(255,255,255,0.2)' : service.color + '28'}`,
          }}
        >
          {service.icon}
        </div>

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
            background: isFeatured ? 'rgba(255,255,255,0.1)' : `${service.color}0F`,
            border: `1px solid ${isFeatured ? 'rgba(255,255,255,0.18)' : service.color + '22'}`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
            style={{ background: isFeatured ? '#fff' : service.color }}
          />
          <span
            className="text-xs font-bold"
            style={{ color: isFeatured ? '#fff' : service.color }}
          >
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
                background: isFeatured ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                color: isFeatured ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)',
                border: `1px solid ${isFeatured ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'}`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-1.5 text-sm font-semibold mt-1 w-fit group/cta"
          style={{ color: isFeatured ? '#fff' : service.color }}
        >
          <span>Get started</span>
          <svg
            className="transition-transform duration-200 group-hover/cta:translate-x-1"
            width="15" height="15" viewBox="0 0 15 15" fill="none"
          >
            <path d="M3 7.5h9M8.5 4l3.5 3.5L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'var(--surface-2)' }} />
      <div className="orb w-[500px] h-[500px] bg-violet-200 opacity-35 top-0 right-[-200px] pointer-events-none" />
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
