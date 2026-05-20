'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const INDUSTRIES = [
  { label: 'Government', value: 'government', rate: 0.28, risk: 62 },
  { label: 'Financial Services', value: 'finance', rate: 0.32, risk: 71 },
  { label: 'Healthcare', value: 'healthcare', rate: 0.25, risk: 58 },
  { label: 'Retail & Commerce', value: 'retail', rate: 0.30, risk: 65 },
  { label: 'Energy & Oil', value: 'energy', rate: 0.35, risk: 74 },
  { label: 'Education', value: 'education', rate: 0.22, risk: 54 },
]

function AnimatedValue({ target, prefix = '', suffix = '', decimals = 0, duration = 800 }: {
  target: number; prefix?: string; suffix?: string; decimals?: number; duration?: number
}) {
  const [val, setVal] = useState(0)
  const prevRef = useRef(0)

  useEffect(() => {
    const from = prevRef.current
    prevRef.current = target
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(from + (target - from) * eased)
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return <>{prefix}{val.toFixed(decimals)}{suffix}</>
}

function RangeSlider({
  label, min, max, value, onChange, format,
}: {
  label: string; min: number; max: number; value: number; onChange: (v: number) => void; format: (v: number) => string
}) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</span>
        <span className="text-sm font-bold" style={{ color: '#7C3AED' }}>{format(value)}</span>
      </div>
      <div className="relative h-2 rounded-full" style={{ background: 'rgba(124,58,237,0.12)' }}>
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-100"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)' }}
        />
        <input
          type="range" min={min} max={max} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ margin: 0 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg border-2 border-violet-500 pointer-events-none transition-all duration-100"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  )
}

function ResultCard({ label, value, sub, accent }: { label: string; value: React.ReactNode; sub?: string; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl p-6 text-center"
      style={{
        background: `linear-gradient(135deg, ${accent}10, ${accent}06)`,
        border: `1px solid ${accent}25`,
      }}
    >
      <div className="text-3xl font-black mb-1" style={{ color: accent }}>
        {value}
      </div>
      <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text)' }}>{label}</div>
      {sub && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</div>}
    </motion.div>
  )
}

export default function ROICalculator() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [employees, setEmployees] = useState(500)
  const [industry, setIndustry] = useState('finance')
  const [annualSpend, setAnnualSpend] = useState(5_000_000)

  const selected = INDUSTRIES.find(i => i.value === industry) ?? INDUSTRIES[1]
  const projectedSavings = Math.round(annualSpend * selected.rate)
  const implCost = Math.max(100_000, employees * 380)
  const roiPct = Math.round(((projectedSavings - implCost) / implCost) * 100)
  const months = Math.max(3, Math.min(9, Math.ceil(employees / 600)))
  const riskReduction = selected.risk

  const fmtAED = (v: number) => {
    if (v >= 1_000_000) return `AED ${(v / 1_000_000).toFixed(1)}M`
    if (v >= 1_000) return `AED ${Math.round(v / 1000)}K`
    return `AED ${v}`
  }

  return (
    <section id="roi" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'var(--surface-2)' }} />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="orb w-[600px] h-[600px] bg-violet-200 opacity-30 top-[-200px] right-[-200px] pointer-events-none" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label mx-auto">ROI Estimator</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mt-3"
            style={{ color: 'var(--text)' }}
          >
            See Your Return <span className="gradient-text">Before You Invest</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            Adjust the inputs to estimate the value WeThink can deliver for your organisation.
            Results are based on benchmarks across 1,000+ UAE engagements.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* LEFT — Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass-card rounded-3xl p-8 space-y-8"
          >
            <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Your Organisation</h3>

            <RangeSlider
              label="Team Size (employees)"
              min={50} max={5000} value={employees}
              onChange={setEmployees}
              format={v => v.toLocaleString()}
            />

            <RangeSlider
              label="Annual IT Spend"
              min={500_000} max={50_000_000} value={annualSpend}
              onChange={setAnnualSpend}
              format={fmtAED}
            />

            {/* Industry selector */}
            <div>
              <label className="text-sm font-medium block mb-3" style={{ color: 'var(--text)' }}>
                Industry Sector
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INDUSTRIES.map(ind => (
                  <button
                    key={ind.value}
                    onClick={() => setIndustry(ind.value)}
                    className="px-3 py-2.5 rounded-xl text-xs font-semibold text-center transition-all duration-200"
                    style={{
                      background: industry === ind.value ? 'linear-gradient(135deg, #7C3AED, #5B21B6)' : 'rgba(124,58,237,0.06)',
                      color: industry === ind.value ? '#fff' : 'var(--text-muted)',
                      border: industry === ind.value ? '1px solid transparent' : '1px solid rgba(124,58,237,0.15)',
                      transform: industry === ind.value ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              * Estimates based on median outcomes across WeThink client engagements. Actual results vary by project scope.
            </p>
          </motion.div>

          {/* RIGHT — Live Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-4"
          >
            {/* Hero result */}
            <div
              className="rounded-3xl p-8 text-center"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                boxShadow: '0 20px 60px rgba(124,58,237,0.35)',
              }}
            >
              <p className="text-sm font-semibold text-violet-200 uppercase tracking-wider mb-2">
                Projected Annual Savings
              </p>
              <div className="text-5xl md:text-6xl font-black text-white mb-2">
                <AnimatedValue target={projectedSavings / 1_000_000} prefix="AED " suffix="M" decimals={1} />
              </div>
              <p className="text-violet-300 text-sm">per year, based on {Math.round(selected.rate * 100)}% industry benchmark</p>
            </div>

            {/* Result grid */}
            <div className="grid grid-cols-3 gap-4">
              <ResultCard
                label="ROI"
                value={<AnimatedValue target={roiPct} suffix="%" />}
                sub="return on investment"
                accent="#7C3AED"
              />
              <ResultCard
                label="Time to Value"
                value={<AnimatedValue target={months} suffix=" mo" />}
                sub="first measurable result"
                accent="#34D399"
              />
              <ResultCard
                label="Risk Reduction"
                value={<AnimatedValue target={riskReduction} suffix="%" />}
                sub="operational risk score"
                accent="#38BDF8"
              />
            </div>

            {/* CTA */}
            <motion.div
              className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex-1 text-center sm:text-left">
                <p className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>
                  Ready for your full analysis?
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Our consultants will validate these numbers with your actual data.
                </p>
              </div>
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary text-sm flex-shrink-0"
              >
                Get Analysis
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
