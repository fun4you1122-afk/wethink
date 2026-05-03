'use client'

import { useRef, MouseEvent } from 'react'
import { motion, useInView } from 'framer-motion'

const services = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <path d="M8 20C8 13.373 13.373 8 20 8s12 5.373 12 12-5.373 12-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 14v6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="8" cy="28" r="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 25v-3M8 31v3M5 28H2M11 28h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Digital Transformation',
    description:
      'End-to-end digital overhaul of your business processes, culture, and technology stack — aligned with UAE Vision 2031.',
    gradient: 'from-violet-600 to-purple-700',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <path d="M20 4L36 13v14L20 36 4 27V13L20 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M20 4v32M4 13l16 9 16-9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Strategic Consulting',
    description:
      'Data-driven strategy and advisory services that help businesses navigate complexity and unlock competitive advantage.',
    gradient: 'from-purple-600 to-indigo-700',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <rect x="4" y="8" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 26l4-8 4 8M30 14l-6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 14h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'IT Solutions',
    description:
      'Tailored infrastructure, software integration, and managed IT services that scale with your business ambitions.',
    gradient: 'from-indigo-600 to-violet-700',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <path d="M6 10h28M6 20h20M6 30h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="32" cy="28" r="6" stroke="currentColor" strokeWidth="2"/>
        <path d="M30 28l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Project Management',
    description:
      'Agile and structured delivery frameworks that keep complex technology projects on time, on budget, and on scope.',
    gradient: 'from-violet-700 to-pink-600',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <path d="M8 26c0-7.18 5.82-13 13-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 26c0-3.866 3.134-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="21" cy="26" r="2" fill="currentColor"/>
        <path d="M28 10v4M34 16h-4M28 30v-4M22 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M34 22c0 6.627-5.373 12-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Cloud Services',
    description:
      'Multi-cloud architecture, migration, and optimisation on AWS, Azure, and GCP — built for resilience and efficiency.',
    gradient: 'from-sky-600 to-violet-600',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <rect x="12" y="18" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M15 18v-4a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="20" cy="25" r="2" fill="currentColor"/>
        <path d="M20 27v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Cybersecurity',
    description:
      'Comprehensive security assessments, threat monitoring, and compliance frameworks that protect your critical assets.',
    gradient: 'from-rose-600 to-violet-700',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <path d="M8 32V16l12-8 12 8v16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <rect x="16" y="22" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 16h4M22 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Custom Software Dev',
    description:
      'Bespoke web, mobile, and enterprise applications engineered from the ground up for your unique requirements.',
    gradient: 'from-violet-600 to-emerald-600',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <path d="M6 30l8-10 6 6 6-8 8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="28" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M28 8V6M32 12h2M28 16v2M24 12h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Data Analytics',
    description:
      'Transform raw data into actionable intelligence — dashboards, predictive models, and BI platforms built to drive decisions.',
    gradient: 'from-amber-500 to-violet-600',
  },
]

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateX = ((y - cy) / cy) * -8
    const rotateY = ((x - cx) / cx) * 8
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
    card.style.transition = 'transform 0.1s ease'

    // Glow follow
    const glow = card.querySelector<HTMLDivElement>('.card-glow')
    if (glow) {
      glow.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(124, 58, 237, 0.12), transparent 70%)`
    }
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    card.style.transition = 'transform 0.5s ease'
    const glow = card.querySelector<HTMLDivElement>('.card-glow')
    if (glow) glow.style.background = 'transparent'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-card rounded-2xl p-7 h-full relative overflow-hidden group will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Glow follow effect */}
        <div className="card-glow absolute inset-0 pointer-events-none transition-all duration-300 rounded-2xl" />

        {/* Top border accent */}
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${service.gradient} opacity-60`} />

        {/* Icon */}
        <div
          className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.gradient} text-white mb-5`}
          style={{ filter: 'drop-shadow(0 4px 12px rgba(124, 58, 237, 0.4))' }}
        >
          {service.icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-violet-200 transition-colors">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-text-muted text-sm leading-relaxed">{service.description}</p>

        {/* Arrow */}
        <div className="mt-5 flex items-center gap-2 text-violet-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-8px] group-hover:translate-x-0">
          <span>Learn more</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-surface/50" />
      <div className="orb w-[500px] h-[500px] bg-violet-900/30 opacity-30 top-0 right-[-200px] pointer-events-none" />

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

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mt-3"
          >
            Our <span className="gradient-text">Services</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-text-muted text-lg max-w-2xl mx-auto"
          >
            From strategy to execution — we deliver the full spectrum of digital and technology services
            that modern enterprises demand.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
