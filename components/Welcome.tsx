'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TextEffect } from '@/components/ui/text-effect'
import { BrainCircuit, ShieldCheck, Cloud } from 'lucide-react'

const PILLARS = [
  { icon: BrainCircuit, label: 'Strategic Consulting', desc: 'Technology roadmaps aligned with your business vision.' },
  { icon: ShieldCheck, label: 'Cybersecurity', desc: 'Zero-trust frameworks and ISO 27001-ready programmes.' },
  { icon: Cloud, label: 'Cloud & Infrastructure', desc: 'Multi-cloud architecture, migration, and managed ops.' },
]

export default function Welcome() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-28 md:py-36"
      style={{ background: 'var(--bg)' }}
    >
      {/* Background orbs */}
      <div className="orb w-[500px] h-[500px] bg-violet-900 opacity-20 top-[-150px] left-[-150px] pointer-events-none" />
      <div className="orb w-[350px] h-[350px] bg-purple-900 opacity-15 bottom-[-80px] right-[-80px] pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Small label — blur in */}
        {inView && (
          <TextEffect
            per="char"
            preset="blur"
            delay={0}
            as="p"
            className="section-label mx-auto mb-6"
          >
            Abu Dhabi, UAE — Est. 2019
          </TextEffect>
        )}

        {/* "Welcome to" — word slide */}
        {inView && (
          <TextEffect
            per="word"
            preset="slide"
            delay={0.3}
            as="h2"
            className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-2 text-[var(--text)]"
          >
            Welcome to
          </TextEffect>
        )}

        {/* "WeThink" — spring char explosion */}
        {inView && (
          <TextEffect
            per="char"
            delay={0.65}
            as="h2"
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none gradient-text"
            variants={{
              container: {
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.06 },
                },
              },
              item: {
                hidden: { opacity: 0, y: 60, scale: 0.5, filter: 'blur(16px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                  transition: {
                    type: 'spring',
                    damping: 14,
                    stiffness: 180,
                  },
                },
              },
            }}
          >
            WeThink
          </TextEffect>
        )}

        {/* Tagline — word slide with delay */}
        {inView && (
          <TextEffect
            per="word"
            preset="fade"
            delay={1.4}
            as="p"
            className="mt-8 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-[var(--text-muted)]"
          >
            End-to-end IT consulting, cloud strategy, cybersecurity, and custom software — helping UAE enterprises compete and thrive in the digital age.
          </TextEffect>
        )}

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 mb-14 h-px max-w-xs mx-auto origin-center"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)' }}
        />

        {/* Pillars */}
        <div className="grid sm:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 2.0 + i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass-card rounded-2xl p-6 text-center group hover:border-violet-500/30 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-violet-500/20 transition-colors">
                <p.icon className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>{p.label}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
