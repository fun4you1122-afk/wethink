'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SplineScene } from './SplineScene'

const WORDS = ['Digital Transformation', 'Smart Solutions', 'Cloud Architecture', 'Business Growth']

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
    <section id="home" className="relative h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-bg" />
      <div className="absolute inset-0 grid-bg opacity-25" />

      {/* Ambient orbs */}
      <div className="orb w-[500px] h-[500px] bg-violet-800 opacity-15 top-[-150px] left-[-150px] pointer-events-none" />
      <div className="orb w-[300px] h-[300px] bg-violet-900 opacity-20 bottom-[-100px] left-[30%] pointer-events-none" />

      {/* ── SPLIT LAYOUT ── */}
      <div className="relative w-full h-full flex items-center">

        {/* LEFT — text content */}
        <div className="w-full lg:w-[52%] flex items-center px-6 md:px-12 lg:pl-20 xl:pl-28 z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="section-label">Abu Dhabi, UAE — Est. 2019</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight text-white mt-5"
            >
              We Engineer
              <br />
              <span className="gradient-text">Your</span>
            </motion.h1>

            {/* Rotating word */}
            <div className="h-[1.15em] overflow-hidden mt-1">
              <motion.div
                key={wordIndex}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight text-white/90"
              >
                {WORDS[wordIndex]}
              </motion.div>
            </div>

            {/* Sub */}
            <motion.p
              variants={itemVariants}
              className="mt-7 text-base md:text-lg text-text-muted leading-relaxed max-w-md"
            >
              WeThink delivers end-to-end IT consulting, cloud strategy, cybersecurity, and custom
              software — helping UAE enterprises compete and thrive in the digital age.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => scrollTo('#contact')} className="btn-primary text-base">
                Start a Project
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3.75 9h10.5M10.5 5.25L14.25 9l-3.75 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={() => scrollTo('#services')} className="btn-outline text-base">
                Our Services
              </button>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              {[
                { stat: '5+', label: 'Years' },
                { stat: '100+', label: 'Projects' },
                { stat: '50+', label: 'Clients' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-2xl font-black gradient-text-purple">{item.stat}</span>
                  <span className="text-xs text-text-muted uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
              <div className="w-px h-10 bg-violet-500/20 hidden sm:block" />
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Pixel, Al Reem Island
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT — Spline 3D scene */}
        <div className="hidden lg:block absolute right-0 top-0 w-[55%] h-full" style={{ zIndex: 6 }}>
          {mounted && (
            <SplineScene
              scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
              className="w-full h-full"
            />
          )}
          {/* Gradient fade — left edge blends into bg */}
          <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-bg to-transparent pointer-events-none" style={{ zIndex: 7 }} />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" style={{ zIndex: 7 }} />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 10 }}
      >
        <span className="text-xs text-text-muted uppercase tracking-widest">Scroll</span>
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
