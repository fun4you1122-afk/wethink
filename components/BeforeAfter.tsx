'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const COMPARISONS = [
  {
    label: 'Deployment Speed',
    before: { value: '3–4 weeks', sub: 'manual, error-prone releases' },
    after: { value: '< 2 hours', sub: 'automated CI/CD pipeline' },
  },
  {
    label: 'System Uptime',
    before: { value: '94.2%', sub: 'frequent maintenance windows' },
    after: { value: '99.98%', sub: 'zero-downtime architecture' },
  },
  {
    label: 'IT Operational Cost',
    before: { value: 'AED 4.2M/yr', sub: 'legacy infrastructure overhead' },
    after: { value: 'AED 2.3M/yr', sub: '45% reduction via cloud optimisation' },
  },
  {
    label: 'Security Incidents',
    before: { value: '14 / year', sub: 'reactive, no monitoring' },
    after: { value: '0 / year', sub: '24/7 SOC + Zero Trust framework' },
  },
  {
    label: 'Time-to-Market',
    before: { value: '6–9 months', sub: 'siloed teams, no agile process' },
    after: { value: '6–8 weeks', sub: 'agile delivery, dedicated PMs' },
  },
  {
    label: 'Data Visibility',
    before: { value: 'Spreadsheets', sub: 'delayed, siloed reporting' },
    after: { value: 'Real-time BI', sub: 'live dashboards across all units' },
  },
]

export default function BeforeAfter() {
  const [isAfter, setIsAfter] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label mx-auto">The WeThink Effect</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mt-3"
          >
            See the <span className="gradient-text">Difference</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-text-muted text-lg max-w-xl mx-auto"
          >
            Real results from real engagements. Toggle to see what changes when WeThink steps in.
          </motion.p>
        </div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-10"
        >
          <div
            className="flex items-center p-1 rounded-full"
            style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.14)' }}
          >
            {[false, true].map((val) => (
              <button
                key={String(val)}
                onClick={() => setIsAfter(val)}
                className="relative px-6 py-2.5 rounded-full text-sm font-bold"
                style={{ color: isAfter === val ? '#fff' : 'var(--text-muted)' }}
              >
                {isAfter === val && (
                  <motion.div
                    layoutId="toggle-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: val
                        ? 'linear-gradient(135deg, #7C3AED, #5B21B6)'
                        : '#EF4444',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {val ? 'After WeThink' : 'Before WeThink'}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMPARISONS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.35 + i * 0.07 }}
              className="glass-card rounded-2xl p-5 relative overflow-hidden"
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                {item.label}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isAfter ? 'after' : 'before'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28 }}
                >
                  <div
                    className="text-2xl font-black mb-1 leading-none"
                    style={{ color: isAfter ? '#7C3AED' : '#EF4444' }}
                  >
                    {isAfter ? item.after.value : item.before.value}
                  </div>
                  <div className="text-xs text-gray-500 leading-relaxed">
                    {isAfter ? item.after.sub : item.before.sub}
                  </div>
                </motion.div>
              </AnimatePresence>

              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[3px]"
                animate={{
                  background: isAfter
                    ? 'linear-gradient(90deg, #7C3AED, #A78BFA)'
                    : 'linear-gradient(90deg, #EF4444, #FCA5A5)',
                }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
