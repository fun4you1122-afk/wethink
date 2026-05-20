'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Spotlight } from '@/components/ui/spotlight'
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline'
import {
  Globe,
  BrainCircuit,
  Server,
  ClipboardList,
  Cloud,
  ShieldCheck,
  Code2,
  BarChart3,
} from 'lucide-react'

const WORDS = ['IT Consulting', 'Cloud Strategy', 'Cybersecurity', 'Business Growth']

const timelineData = [
  {
    id: 1,
    title: 'Digital Transformation',
    date: 'Core Service',
    content: 'End-to-end digital transformation strategies that modernise operations, culture, and customer experience across UAE enterprises.',
    category: 'Transformation',
    icon: Globe,
    relatedIds: [2, 5],
    status: 'completed' as const,
    energy: 98,
  },
  {
    id: 2,
    title: 'Strategic Consulting',
    date: 'Core Service',
    content: 'Technology roadmap design and C-suite advisory — aligning IT investments with long-term business objectives.',
    category: 'Consulting',
    icon: BrainCircuit,
    relatedIds: [1, 3],
    status: 'completed' as const,
    energy: 92,
  },
  {
    id: 3,
    title: 'IT Solutions',
    date: 'Core Service',
    content: 'Infrastructure design, systems integration, and managed IT services tailored to your organisation\'s scale and complexity.',
    category: 'Infrastructure',
    icon: Server,
    relatedIds: [2, 5],
    status: 'completed' as const,
    energy: 88,
  },
  {
    id: 4,
    title: 'Project Management',
    date: 'Core Service',
    content: 'Rigorous PMO governance, agile delivery, and stakeholder coordination to ensure every project lands on time and on budget.',
    category: 'Delivery',
    icon: ClipboardList,
    relatedIds: [1, 7],
    status: 'in-progress' as const,
    energy: 85,
  },
  {
    id: 5,
    title: 'Cloud Services',
    date: 'Core Service',
    content: 'Hybrid and multi-cloud architecture, migration, optimisation, and 24/7 managed cloud operations on AWS, Azure, and GCP.',
    category: 'Cloud',
    icon: Cloud,
    relatedIds: [3, 6],
    status: 'completed' as const,
    energy: 95,
  },
  {
    id: 6,
    title: 'Cybersecurity',
    date: 'Core Service',
    content: 'Zero-trust frameworks, SOC monitoring, penetration testing, and compliance programmes including ISO 27001 and NESA.',
    category: 'Security',
    icon: ShieldCheck,
    relatedIds: [5, 3],
    status: 'in-progress' as const,
    energy: 90,
  },
  {
    id: 7,
    title: 'Custom Software',
    date: 'Core Service',
    content: 'Bespoke web and mobile applications, API integrations, and AI-powered platforms built for UAE market realities.',
    category: 'Development',
    icon: Code2,
    relatedIds: [4, 8],
    status: 'completed' as const,
    energy: 82,
  },
  {
    id: 8,
    title: 'Data Analytics',
    date: 'Core Service',
    content: 'Business intelligence dashboards, data warehouse design, and machine-learning models that turn raw data into revenue.',
    category: 'Analytics',
    icon: BarChart3,
    relatedIds: [7, 2],
    status: 'in-progress' as const,
    energy: 78,
  },
]

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % WORDS.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <section id="home" className="relative min-h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* Floating orbs */}
      <div className="orb w-[600px] h-[600px] bg-violet-200 opacity-40 top-[-200px] left-[-200px] pointer-events-none animate-float" />
      <div className="orb w-[400px] h-[400px] bg-purple-200 opacity-30 bottom-[-100px] right-[40%] pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Spotlight */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="purple" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none z-[1]" />

      {/* Layout: text left + orbital right */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">

        {/* ── LEFT — text content ── */}
        <div className="flex-1 px-8 pt-28 pb-10 md:px-14 lg:px-20 lg:py-0 flex flex-col justify-center lg:max-w-[48%]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.div variants={itemVariants}>
              <span className="section-label">Abu Dhabi, UAE — Est. 2019</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ color: 'var(--text)' }}
            >
              We Engineer
              <br />
              Your
            </motion.h1>

            {/* Rotating word — absolute positioned inside a spacer div, zero clipping */}
            <div className="relative mt-1" style={{ height: '1.25em' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={wordIndex}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute top-0 left-0 text-4xl md:text-5xl lg:text-6xl font-bold gradient-text whitespace-nowrap"
                >
                  {WORDS[wordIndex]}
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-md leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              WeThink delivers end-to-end IT consulting, cloud strategy, cybersecurity,
              and custom software — helping UAE enterprises compete and thrive in the digital age.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="mt-2 text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              Tap any orbit node to explore our services →
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => scrollTo('#contact')} className="btn-primary">
                Start a Project
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3.75 9h10.5M10.5 5.25L14.25 9l-3.75 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={() => scrollTo('#services')} className="btn-outline">
                Our Services
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center gap-6">
              {[
                { stat: '5+', label: 'Years' },
                { stat: '5000+', label: 'Projects' },
                { stat: '1000+', label: 'Clients' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-2xl font-black gradient-text-purple">{item.stat}</span>
                  <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                </div>
              ))}
              <div className="w-px h-10 bg-violet-300/40 hidden sm:block" />
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Pixel, Al Reem Island
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── RIGHT — Orbital timeline ── */}
        <div className="relative w-full h-[500px] lg:flex-1 lg:h-auto rounded-t-3xl lg:rounded-none overflow-hidden" style={{ background: 'var(--surface-2)' }}>
          <RadialOrbitalTimeline timelineData={timelineData} />
        </div>

      </div>

      {/* Scroll indicator — desktop */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs text-neutral-500 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 border border-violet-400/40 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-violet-400" />
        </motion.div>
      </motion.div>

    </section>
  )
}
