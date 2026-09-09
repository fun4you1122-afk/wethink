'use client'

import { motion } from 'framer-motion'
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline'
import { BrainCircuit, BarChart3, Server, Compass, Megaphone } from 'lucide-react'
import { SERVICE_LINES } from '@/lib/services'

/* The orbit shows the five lines of work, in the order they are set out on
   the company profile. Titles and summaries come from lib/services so the
   home page cannot drift from the profile and the services page. */

const ICONS = [BrainCircuit, BarChart3, Server, Compass, Megaphone]
const CATEGORIES = ['Transformation', 'Analytics', 'Platforms', 'Strategy', 'Brand']
const ENERGY = [96, 90, 88, 84, 80]
const RELATED: number[][] = [[2, 4], [1, 3], [2, 5], [1, 5], [3, 4]]

const timelineData = SERVICE_LINES.map((line, i) => ({
  id: line.id,
  title: line.title,
  date: 'Core Service',
  content: line.summary,
  category: CATEGORIES[i],
  icon: ICONS[i],
  relatedIds: RELATED[i],
  status: (i % 2 === 0 ? 'completed' : 'in-progress') as 'completed' | 'in-progress',
  energy: ENERGY[i],
}))


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
