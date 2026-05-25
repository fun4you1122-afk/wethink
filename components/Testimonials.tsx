'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import ScrambleText from '@/components/ScrambleText'

const TESTIMONIALS = [
  {
    quote: "WeThink transformed our entire IT infrastructure in under 6 months. The team's depth of knowledge and project discipline is unlike anything we've experienced before.",
    name: 'Ahmed Al Mansoori',
    role: 'CTO',
    company: 'Abu Dhabi National Energy',
    initials: 'AM',
    color: '#7C3AED',
  },
  {
    quote: "From zero to ISO 27001 certified in 9 months. Their cybersecurity team didn't just implement frameworks — they built a genuine security culture across our organisation.",
    name: 'Sarah Mitchell',
    role: 'Head of Information Security',
    company: 'Financial Services — Abu Dhabi',
    initials: 'SM',
    color: '#059669',
  },
  {
    quote: "Our smart campus platform went live on time, under budget, and our 18,000 daily users love it. WeThink treated our project like it was their own.",
    name: 'Dr. Khalid Al Rashidi',
    role: 'VP Operations',
    company: 'UAE University',
    initials: 'KR',
    color: '#0EA5E9',
  },
  {
    quote: "The cloud migration was seamless — zero downtime, 45% cost reduction, and a team that communicated clearly at every single step.",
    name: 'Fatima Al Zaabi',
    role: 'Director of Technology',
    company: 'Emirates Finance Group',
    initials: 'FZ',
    color: '#F59E0B',
  },
]

const DURATION = 5500

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const go = useCallback((idx: number) => {
    setDir(idx > active ? 1 : -1)
    setActive(idx)
  }, [active])

  const next = useCallback(() => {
    const idx = (active + 1) % TESTIMONIALS.length
    setDir(1)
    setActive(idx)
  }, [active])

  useEffect(() => {
    const id = setInterval(next, DURATION)
    return () => clearInterval(id)
  }, [next])

  const t = TESTIMONIALS[active]

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 48 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -48 }),
  }

  return (
    <section className="section-padding" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label mx-auto">Client Stories</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-violet-50 mt-3">
            <ScrambleText>Trusted by </ScrambleText>
            <ScrambleText className="gradient-text">Leaders</ScrambleText>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          {/* Large decorative quote */}
          <div
            className="absolute top-4 right-8 text-9xl font-black leading-none select-none pointer-events-none"
            style={{ color: `${t.color}0e`, fontFamily: 'Georgia, serif' }}
            aria-hidden
          >
            "
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={active}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 18 18">
                    <path
                      d="M9 1.5l2.08 4.22 4.66.68-3.37 3.28.8 4.64L9 12.02l-4.17 2.3.8-4.64L2.26 6.4l4.66-.68L9 1.5z"
                      fill={t.color}
                    />
                  </svg>
                ))}
              </div>

              <p className="text-lg md:text-xl font-medium leading-relaxed text-violet-100/90 mb-8">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}aa)` }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-violet-50">{t.name}</div>
                  <div className="text-sm text-violet-300/70">{t.role} · {t.company}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress bars */}
          <div className="flex gap-2 mt-8">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className="flex-1 rounded-full overflow-hidden"
                style={{
                  height: 4,
                  background: 'rgba(124,58,237,0.1)',
                  border: 'none',
                  padding: 0,
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              >
                {i === active ? (
                  <motion.div
                    key={active}
                    className="h-full rounded-full"
                    style={{ background: t.color }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: DURATION / 1000, ease: 'linear' }}
                  />
                ) : i < active ? (
                  <div className="h-full w-full rounded-full" style={{ background: item.color }} />
                ) : null}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
