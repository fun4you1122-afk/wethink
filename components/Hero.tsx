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
    <section id="home" className="relative min-h-screen overflow-hidden flex items-center justify-center">

      {/* Video background — lowest layer */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source src="https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_30fps.mp4" type="video/mp4" />
        <source src="https://videos.pexels.com/video-files/857251/857251-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>

      {/* Light overlay — preserves light-theme look over the video */}
      <div className="absolute inset-0 z-[1] bg-[#F8F7FF]/80 pointer-events-none" />

      {/* Raining characters — behind everything */}
      <HeroRain />

      {/* Floating orbs */}
      <div className="orb w-[600px] h-[600px] bg-violet-200 opacity-40 top-[-200px] left-[-200px] pointer-events-none animate-float" />
      <div className="orb w-[400px] h-[400px] bg-purple-200 opacity-30 bottom-[-100px] right-[40%] pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Spotlight */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="purple" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none z-[1]" />

      {/* Full-width centred text content */}
      <div className="relative z-10 w-full px-6 pt-28 pb-28 md:px-16 lg:px-24 flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <motion.div variants={itemVariants}>
            <span className="section-label" style={{ justifyContent: 'center' }}>Abu Dhabi, UAE — Est. 2019</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mt-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.95] tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            We Engineer
            <br />
            <span className="gradient-text">Your Future.</span>
          </motion.h1>

          {/* Rotating word pill */}
          <div className="mt-6 flex justify-center">
            <div className="relative inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-violet-200 bg-white/70 backdrop-blur-sm shadow-sm">
              <span className="text-sm font-medium text-violet-500 uppercase tracking-widest">Now</span>
              <div className="w-px h-4 bg-violet-200" />
              <div className="relative" style={{ minWidth: '160px', height: '1.4em' }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute inset-0 flex items-center justify-start text-sm font-bold gradient-text-purple whitespace-nowrap"
                  >
                    {WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <motion.p
            variants={itemVariants}
            className="mt-8 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            WeThink delivers end-to-end IT consulting, cloud strategy, cybersecurity,
            and custom software — helping UAE enterprises compete and thrive in the digital age.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap justify-center gap-4">
            <button onClick={() => scrollTo('#contact')} className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
              Start a Project
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.75 9h10.5M10.5 5.25L14.25 9l-3.75 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={() => scrollTo('#services')} className="btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
              Our Services
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap justify-center items-center gap-3">
            {['ISO 27001 Ready', 'AWS Partner', 'Microsoft Azure', 'UAE Gov Compliant'].map((badge) => (
              <span
                key={badge}
                className="px-4 py-1.5 rounded-full text-xs font-semibold border border-violet-200/70 bg-white/60 backdrop-blur-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                {badge}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator — full-width row so centering is always correct */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 z-10"
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
