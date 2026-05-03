'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

// Microsoft Azure: "What can you do with Azure?" — publicly available, verified
const VIDEO_ID = 'J9LK6EtxzgM'

export default function VideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [playing, setPlaying] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.93, 1, 0.93])
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.4, 1, 1, 0.4])

  const embedSrc = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1&color=white`

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
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <div className="absolute inset-0 rounded-3xl border border-violet-500/20 pointer-events-none z-10" />
          <div className="absolute inset-0 rounded-3xl shadow-[0_0_60px_rgba(124,58,237,0.2)] pointer-events-none z-10" />

          {/* 16:9 */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            {playing ? (
              <>
                <iframe
                  className="absolute inset-0 w-full h-full rounded-3xl"
                  src={embedSrc}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen={false}
                  title="WeThink — The Future is Digital"
                  style={{ border: 0 }}
                />
                {/* Thin top overlay — only covers the very top 40px where title appears */}
                <div
                  className="absolute top-0 left-0 right-0 pointer-events-none"
                  style={{ height: '44px', background: 'linear-gradient(to bottom, rgba(7,7,26,0.95), transparent)', zIndex: 5 }}
                />
              </>
            ) : (
              /* Poster state */
              <div
                className="absolute inset-0 flex items-center justify-center rounded-3xl"
                style={{ background: 'linear-gradient(135deg, #0D0D25 0%, #130a2e 50%, #07071A 100%)' }}
              >
                <div className="absolute inset-0 grid-bg opacity-30 rounded-3xl" />

                {/* Pulsing bg glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-80 h-80 rounded-full bg-violet-600/10 blur-3xl animate-pulse-slow" />
                </div>

                {/* Abstract tech visual */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
                  <svg viewBox="0 0 800 450" className="w-full h-full" fill="none">
                    <circle cx="400" cy="225" r="180" stroke="rgba(139,92,246,0.6)" strokeWidth="1" />
                    <circle cx="400" cy="225" r="120" stroke="rgba(139,92,246,0.4)" strokeWidth="1" />
                    <circle cx="400" cy="225" r="60" stroke="rgba(139,92,246,0.7)" strokeWidth="1.5" />
                    <line x1="100" y1="225" x2="700" y2="225" stroke="rgba(139,92,246,0.3)" strokeWidth="1" />
                    <line x1="400" y1="20" x2="400" y2="430" stroke="rgba(139,92,246,0.3)" strokeWidth="1" />
                    {[45, 135, 225, 315].map((angle) => (
                      <line
                        key={angle}
                        x1={400} y1={225}
                        x2={400 + 220 * Math.cos((angle * Math.PI) / 180)}
                        y2={225 + 220 * Math.sin((angle * Math.PI) / 180)}
                        stroke="rgba(167,139,250,0.2)" strokeWidth="1"
                      />
                    ))}
                  </svg>
                </div>

                {/* Play button */}
                <button
                  onClick={() => setPlaying(true)}
                  className="relative z-10 flex flex-col items-center gap-4 group"
                  aria-label="Play video"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                      boxShadow: '0 0 60px rgba(124,58,237,0.5)',
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border border-violet-400/50"
                    />
                    <motion.div
                      animate={{ scale: [1, 2.2, 1], opacity: [0.2, 0, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                      className="absolute inset-0 rounded-full border border-violet-400/25"
                    />
                    <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1 relative z-10">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                  <span className="text-white/70 text-sm font-medium tracking-wide group-hover:text-white transition-colors">
                    Watch the Vision
                  </span>
                </button>

                {/* Corner brackets */}
                {[
                  'top-6 left-6 border-t-2 border-l-2 rounded-tl-lg',
                  'top-6 right-6 border-t-2 border-r-2 rounded-tr-lg',
                  'bottom-6 left-6 border-b-2 border-l-2 rounded-bl-lg',
                  'bottom-6 right-6 border-b-2 border-r-2 rounded-br-lg',
                ].map((cls) => (
                  <div key={cls} className={`absolute w-8 h-8 border-violet-500/40 ${cls}`} />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* CTA */}
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
