'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Spotlight } from '@/components/ui/spotlight'
import HeroRain from '@/components/HeroRain'

const WORDS = ['IT Consulting', 'Cloud Strategy', 'Cybersecurity', 'Business Growth']

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
    <section id="home" className="relative min-h-screen overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg)' }}>

      {/* Raining characters — behind everything */}
      <HeroRain />

      {/* Floating orbs */}
      <div className="orb w-[600px] h-[600px] bg-violet-200 opacity-40 top-[-200px] left-[-200px] pointer-events-none animate-float" />
      <div className="orb w-[400px] h-[400px] bg-purple-200 opacity-30 bottom-[-100px] right-[40%] pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Spotlight */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="purple" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none z-[1]" />

      {/* Centred text content */}
      <div className="relative z-10 w-full px-8 pt-28 pb-24 md:px-14 flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
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

          {/* Rotating word */}
          <div className="relative mt-1 flex justify-center" style={{ height: '1.25em' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={wordIndex}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute top-0 text-4xl md:text-5xl lg:text-6xl font-bold gradient-text whitespace-nowrap"
              >
                {WORDS[wordIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.p
            variants={itemVariants}
            className="mt-8 max-w-xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            WeThink delivers end-to-end IT consulting, cloud strategy, cybersecurity,
            and custom software — helping UAE enterprises compete and thrive in the digital age.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center gap-4">
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

          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap justify-center items-center gap-6">
            {[
              { stat: '5+', label: 'Years' },
              { stat: '5000+', label: 'Projects' },
              { stat: '1000+', label: 'Clients' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
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
