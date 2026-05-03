'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

export default function VideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [playing, setPlaying] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.92])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4])

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="orb w-[600px] h-[600px] bg-violet-900/20 opacity-40 bottom-[-200px] right-[-200px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label mx-auto">See Us in Action</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mt-3"
          >
            The Future is{' '}
            <span className="gradient-text">Digital</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-text-muted text-lg max-w-xl mx-auto"
          >
            Technology is reshaping every industry. The question isn&apos;t whether to transform —
            it&apos;s whether you&apos;ll lead the change or follow it.
          </motion.p>
        </div>

        {/* Video container */}
        <motion.div
          style={{ scale, opacity }}
          className="relative rounded-3xl overflow-hidden glow-purple"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          {/* Aspect ratio wrapper 16:9 */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>

            {/* YouTube embed — nocookie domain, all controls/title hidden */}
            {playing ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube-nocookie.com/embed/Sv3ZFCxpyMY?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1&loop=1&playlist=Sv3ZFCxpyMY&mute=0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="WeThink — The Future is Digital"
              />
            ) : (
              /* Thumbnail / poster state */
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #0D0D25 0%, #1a0533 50%, #07071A 100%)',
                }}
              >
                {/* Animated background grid */}
                <div className="absolute inset-0 grid-bg opacity-40" />

                {/* Glowing orb */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-96 h-96 rounded-full bg-violet-600/10 blur-3xl animate-pulse-slow" />
                </div>

                {/* Abstract tech visual */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <svg viewBox="0 0 800 450" className="w-full h-full" fill="none">
                    <circle cx="400" cy="225" r="180" stroke="rgba(139,92,246,0.5)" strokeWidth="1" />
                    <circle cx="400" cy="225" r="120" stroke="rgba(139,92,246,0.4)" strokeWidth="1" />
                    <circle cx="400" cy="225" r="60" stroke="rgba(139,92,246,0.6)" strokeWidth="1.5" />
                    <line x1="0" y1="225" x2="800" y2="225" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
                    <line x1="400" y1="0" x2="400" y2="450" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
                    {[45, 135, 225, 315].map((angle) => (
                      <line
                        key={angle}
                        x1={400}
                        y1={225}
                        x2={400 + 250 * Math.cos((angle * Math.PI) / 180)}
                        y2={225 + 250 * Math.sin((angle * Math.PI) / 180)}
                        stroke="rgba(167,139,250,0.25)"
                        strokeWidth="1"
                      />
                    ))}
                  </svg>
                </div>

                {/* Play button */}
                <button
                  onClick={() => setPlaying(true)}
                  className="relative group z-10 flex flex-col items-center gap-4"
                  aria-label="Play video"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                      boxShadow: '0 0 60px rgba(124, 58, 237, 0.5)',
                    }}
                  >
                    {/* Ripple */}
                    <motion.div
                      animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute w-20 h-20 rounded-full border border-violet-400/50"
                    />
                    <motion.div
                      animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                      className="absolute w-20 h-20 rounded-full border border-violet-400/30"
                    />
                    <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                  <span className="text-white/70 text-sm font-medium tracking-wide">Watch the Vision</span>
                </button>

                {/* Corner decorations */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-violet-500/40 rounded-tl-lg" />
                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-violet-500/40 rounded-tr-lg" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-violet-500/40 rounded-bl-lg" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-violet-500/40 rounded-br-lg" />
              </div>
            )}

            {/* Overlay to block YouTube title/UI on iframe — pointer-events none */}
            {playing && (
              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                {/* Top bar cover — hides YouTube title */}
                <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/60 to-transparent" />
                {/* Bottom bar cover — hides progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}
          </div>

          {/* Border glow */}
          <div className="absolute inset-0 rounded-3xl border border-violet-500/20 pointer-events-none" />
        </motion.div>

        {/* CTA below video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-10"
        >
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Ready to Transform?
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.75 9h10.5M10.5 5.25L14.25 9l-3.75 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
