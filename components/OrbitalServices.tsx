'use client'

import { motion } from 'framer-motion'
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

export default function OrbitalServices() {
  return (
    <section
      id="orbital"
      className="relative overflow-hidden py-24"
      style={{ background: 'var(--bg)' }}
    >
      {/* Soft background orbs */}
      <div className="orb w-[500px] h-[500px] bg-violet-900 opacity-20 top-[-120px] right-[-120px] pointer-events-none" />
      <div className="orb w-[400px] h-[400px] bg-purple-900 opacity-15 bottom-[-100px] left-[-80px] pointer-events-none" style={{ animationDelay: '1.5s' }} />

      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-4"
        >
          <span className="section-label" style={{ justifyContent: 'center' }}>What We Do</span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold" style={{ color: 'var(--text)' }}>
            Our{' '}
            <span className="gradient-text">Services</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Click any node to explore — services are interconnected by design.
          </p>
        </motion.div>

        {/* Orbital */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full"
          style={{ height: 'clamp(480px, 70vh, 680px)' }}
        >
          <RadialOrbitalTimeline timelineData={timelineData} />
        </motion.div>
      </div>
    </section>
  )
}
