'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TextEffect } from '@/components/ui/text-effect'

export default function Welcome() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-28 md:py-36"
      style={{ background: 'var(--bg)' }}
    >
      <div className="orb w-[500px] h-[500px] bg-violet-900 opacity-20 top-[-150px] left-[-150px] pointer-events-none" />
      <div className="orb w-[350px] h-[350px] bg-purple-900 opacity-15 bottom-[-80px] right-[-80px] pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {inView && (
          <TextEffect per="char" preset="blur" delay={0} as="p" className="section-label mx-auto mb-6">
            Abu Dhabi, UAE — Est. 2019
          </TextEffect>
        )}

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

        <motion.h2
          initial={{ opacity: 0, y: 50, scale: 0.88, filter: 'blur(20px)' }}
          animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
          transition={{ type: 'spring', damping: 12, stiffness: 110, delay: 0.65 }}
          className="gradient-text text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none"
        >
          WeThink
        </motion.h2>

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
      </div>
    </section>
  )
}
