'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: new Date().getFullYear() - 2019, suffix: '+', label: 'Years of Excellence', desc: 'Serving clients since 2019' },
  { value: 5000, suffix: '+', label: 'Projects Delivered', desc: 'Across UAE & MENA' },
  { value: 1000, suffix: '+', label: 'Happy Clients', desc: 'From startups to enterprise' },
  { value: 8, suffix: '', label: 'Core Services', desc: 'End-to-end digital solutions' },
]

function AnimatedCounter({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    const duration = 1800
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [active, value])

  return (
    <span className="text-5xl md:text-6xl font-black gradient-text-purple">
      {count}{suffix}
    </span>
  )
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'var(--surface)' }} />
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Glowing line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
      {/* Glowing line bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center group"
            >
              {/* Number */}
              <div className="flex items-end justify-center gap-0">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} active={inView} />
              </div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ delay: i * 0.12 + 0.3, duration: 0.6 }}
                className="w-8 h-0.5 bg-gradient-to-r from-violet-500 to-accent rounded-full mx-auto my-3 origin-left"
              />

              {/* Label */}
              <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text)' }}>{stat.label}</h3>
              <p className="text-text-muted text-xs">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
