'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SplineScene } from '@/components/ui/splite'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'

const WORDS = ['Digital Transformation', 'Smart Solutions', 'Cloud Architecture', 'Business Growth']

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
    <section id="home" className="relative h-screen">
      <Card className="w-full h-full bg-black/[0.96] relative overflow-hidden rounded-none border-0">

        {/* Aceternity Spotlight */}
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />

        {/* Subtle grid */}
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

        {/* Split layout — exact demo structure */}
        <div className="flex h-full">

          {/* ── LEFT — text content ── */}
          <div className="flex-1 p-8 md:p-14 lg:p-20 relative z-10 flex flex-col justify-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-lg"
            >
              {/* Badge */}
              <motion.div variants={itemVariants}>
                <span className="section-label">Abu Dhabi, UAE — Est. 2019</span>
              </motion.div>

              {/* Headline — matches demo gradient style */}
              <motion.h1
                variants={itemVariants}
                className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight"
              >
                We Engineer
                <br />
                Your
              </motion.h1>

              {/* Rotating word */}
              <div className="h-[1.2em] overflow-hidden mt-1">
                <motion.div
                  key={wordIndex}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text leading-tight"
                >
                  {WORDS[wordIndex]}
                </motion.div>
              </div>

              {/* Sub — matches demo neutral-300 style */}
              <motion.p
                variants={itemVariants}
                className="mt-6 text-neutral-300 max-w-md leading-relaxed"
              >
                WeThink delivers end-to-end IT consulting, cloud strategy, cybersecurity,
                and custom software — helping UAE enterprises compete and thrive in the digital age.
              </motion.p>

              {/* CTAs */}
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
                    <span className="text-xs text-neutral-400 uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
                <div className="w-px h-10 bg-violet-500/20 hidden sm:block" />
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Pixel, Al Reem Island
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* ── RIGHT — Spline 3D scene ── */}
          <div className="flex-1 relative hidden lg:block">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>

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

      </Card>
    </section>
  )
}
