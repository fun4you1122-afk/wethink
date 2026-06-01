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
              <img src="/app-store-icon.png" alt="App Store" width={22} height={22} style={{ objectFit: 'contain' }} />
              <div className="text-left">
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Coming to</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>App Store</div>
              </div>
            </div>
            {/* Google Play placeholder */}
            <div className="flex items-center gap-2 px-5 py-3 rounded-xl cursor-not-allowed select-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <img src="/google-play-icon.png" alt="Google Play" width={22} height={22} style={{ objectFit: 'contain' }} />
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
