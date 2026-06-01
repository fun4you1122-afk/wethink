'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SCREENS = [
  { src: '/app-screen-1.jpg', label: 'Splash' },
  { src: '/app-screen-2.jpg', label: 'Home' },
  { src: '/app-screen-3.jpg', label: 'Insights' },
  { src: '/app-screen-4.jpg', label: 'Services' },
  { src: '/app-screen-5.jpg', label: 'Portfolio' },
  { src: '/app-screen-6.jpg', label: 'AI Tools' },
  { src: '/app-screen-7.jpg', label: 'Contact' },
]

export default function AppComingSoon() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Orbs */}
      <div className="orb w-[500px] h-[500px] bg-violet-900 opacity-20 top-0 left-[-150px] pointer-events-none" />
      <div className="orb w-[400px] h-[400px] opacity-15 bottom-0 right-[-100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00C9A7 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div ref={ref} className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <span className="section-label mx-auto flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              In Development
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black"
            style={{ color: 'var(--text)' }}
          >
            The{' '}
            <span className="gradient-text">WeThink App</span>
            <br />is Coming Soon
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            AI tools, live insights, portfolio, and direct consultation — all in your pocket.
            Our mobile app is currently in development and launching soon.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-2 justify-center mt-6"
          >
            {['AI Chat', 'Live Analytics', 'Portfolio', 'Instant Consultation', 'Direct Contact'].map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#A78BFA' }}>
                {f}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Phone screenshots — horizontal scroll */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="relative"
        >
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, var(--bg), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, var(--bg), transparent)' }} />

          <div className="flex gap-5 overflow-x-auto pb-4 px-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {SCREENS.map((screen, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.07 }}
                className="flex-shrink-0 snap-center"
                style={{ width: 200 }}
              >
                {/* Phone frame */}
                <div className="relative rounded-[2.2rem] overflow-hidden"
                  style={{
                    border: '3px solid rgba(124,58,237,0.35)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)',
                    background: '#0a0014',
                  }}>
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
                    style={{ width: 70, height: 22, background: '#0a0014', borderRadius: '0 0 14px 14px' }} />
                  <img
                    src={screen.src}
                    alt={`WeThink App — ${screen.label}`}
                    style={{ width: '100%', display: 'block', aspectRatio: '9/19.5', objectFit: 'cover' }}
                  />
                </div>
                <p className="text-center mt-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  {screen.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center mt-12"
        >
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Stay tuned — available on iOS & Android
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {/* App Store placeholder */}
            <div className="flex items-center gap-2 px-5 py-3 rounded-xl cursor-not-allowed select-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#A78BFA' }}>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Coming to</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>App Store</div>
              </div>
            </div>
            {/* Google Play placeholder */}
            <div className="flex items-center gap-2 px-5 py-3 rounded-xl cursor-not-allowed select-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <svg width="20" height="20" viewBox="0 0 512 512">
                <path d="M48 59.49v393a4.33 4.33 0 007.37 3.07L260 256 55.37 56.42A4.33 4.33 0 0048 59.49z" fill="#32BBFF"/>
                <path d="M345 185l-89.45-49L55.37 56.42A4.33 4.33 0 0048 59.49v.54L258.41 268z" fill="#32BBFF"/>
                <path d="M345 185l-86.59 71L48 452.51v.54a4.33 4.33 0 007.37 3.07L255.55 376z" fill="#32BBFF"/>
                <path d="M48 59.49v393a4.33 4.33 0 007.37 3.07L260 256 55.37 56.42A4.33 4.33 0 0048 59.49z" fill="#32BBFF"/>
                <path d="M256 270.58L345 327l102.08 58.8a4.33 4.33 0 004.92-7L349 256l-93-70.58z" fill="#FFD300"/>
                <path d="M256 270.58L345 327l102.08 58.8a4.33 4.33 0 004.92-7L349 256l-93-70.58z" fill="#FFD300"/>
                <path d="M256 241.42L349 185 452 126.2a4.33 4.33 0 00-4.92-7L345 178l-89 57z" fill="#FF3333"/>
                <path d="M256 241.42L349 185 452 126.2a4.33 4.33 0 00-4.92-7L345 178l-89 57z" fill="#FF3333"/>
                <path d="M345 327L258.41 268 48 452.51a4.33 4.33 0 005.37 1.06z" fill="#00F076"/>
                <path d="M345 185L53.37 57.43A4.33 4.33 0 0048 59.49L258.41 244z" fill="#00F076"/>
              </svg>
              <div className="text-left">
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Coming to</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Google Play</div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
