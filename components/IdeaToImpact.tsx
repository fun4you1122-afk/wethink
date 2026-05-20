'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

const PHASES = [
  {
    step: '01',
    label: 'The Beginning',
    title: 'Every great product starts with a blank canvas.',
    desc: 'Your idea is the seed. Before any line of code, there is a moment of pure possibility.',
    color: '#7C3AED',
  },
  {
    step: '02',
    label: 'Your Vision',
    title: 'You bring the spark. We listen closely.',
    desc: 'We dive deep into your goals, your users, and your market to understand exactly what to build.',
    color: '#4F46E5',
  },
  {
    step: '03',
    label: 'WeThink Builds',
    title: 'Our engineers turn your vision into reality.',
    desc: 'From architecture to design to deployment — every function crafted with precision for your users.',
    color: '#7C3AED',
  },
  {
    step: '04',
    label: 'Your Success',
    title: 'Watch your audience and revenue grow.',
    desc: "A product built right doesn't just launch — it scales. Real users, real growth, real impact.",
    color: '#059669',
  },
]

const CODE_COLORS = ['#A78BFA', '#34D399', '#38BDF8', '#FB923C']
const MONTHS = ['J', 'F', 'M', 'A', 'M']

export default function IdeaToImpact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activePhase, setActivePhase] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [users, setUsers] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v < 0.25) setActivePhase(0)
    else if (v < 0.50) setActivePhase(1)
    else if (v < 0.75) setActivePhase(2)
    else setActivePhase(3)

    if (v >= 0.75) {
      const t = Math.min((v - 0.75) / 0.20, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setRevenue(Math.round(eased * 47_291))
      setUsers(Math.round(eased * 12_847))
    } else {
      setRevenue(0)
      setUsers(0)
    }
  })

  // Phone entrance
  const phoneOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1])
  const phoneY = useTransform(scrollYProgress, [0, 0.08], [40, 0])

  // Screen layer opacities
  const s1 = useTransform(scrollYProgress, [0.00, 0.04, 0.22, 0.28], [0, 1, 1, 0])
  const s2 = useTransform(scrollYProgress, [0.23, 0.29, 0.45, 0.50], [0, 1, 1, 0])
  const s3 = useTransform(scrollYProgress, [0.47, 0.53, 0.70, 0.75], [0, 1, 1, 0])
  const s4 = useTransform(scrollYProgress, [0.72, 0.78, 1.00, 1.00], [0, 1, 1, 1])

  // Phase 3 — code line widths
  const cl = [
    useTransform(scrollYProgress, [0.53, 0.66], ['0%', '82%']),
    useTransform(scrollYProgress, [0.55, 0.68], ['0%', '60%']),
    useTransform(scrollYProgress, [0.57, 0.70], ['0%', '72%']),
    useTransform(scrollYProgress, [0.59, 0.72], ['0%', '46%']),
  ]
  const buildPct = useTransform(scrollYProgress, [0.53, 0.74], ['0%', '100%'])

  // Phase 4 — bar heights (px, parent is 60px tall)
  const bh = [
    useTransform(scrollYProgress, [0.78, 0.93], [4, 33]),
    useTransform(scrollYProgress, [0.79, 0.94], [4, 46]),
    useTransform(scrollYProgress, [0.80, 0.95], [4, 27]),
    useTransform(scrollYProgress, [0.81, 0.96], [4, 55]),
    useTransform(scrollYProgress, [0.82, 0.97], [4, 40]),
  ]

  return (
    <section ref={sectionRef} id="journey" className="relative" style={{ height: '380vh' }}>
      <div
        className="sticky top-0 h-screen flex items-center overflow-hidden"
        style={{ background: 'var(--bg)' }}
      >
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="orb w-[500px] h-[500px] bg-violet-200 opacity-25 top-[-150px] right-[-100px] pointer-events-none" />

        {/* Section heading — visible briefly at scroll start */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.04, 0.12, 0.18], [1, 1, 1, 0]) }}
          className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none"
        >
          <span className="section-label mx-auto">From Idea to Impact</span>
        </motion.div>

        <div className="relative w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-5 lg:gap-16">

            {/* ── Desktop text panel ── */}
            <div className="flex-1 hidden lg:block">
              <div className="relative" style={{ height: 260 }}>
                {PHASES.map((phase, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      opacity: activePhase === i ? 1 : 0,
                      y: activePhase === i ? 0 : activePhase > i ? -14 : 14,
                    }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute inset-0"
                    style={{ pointerEvents: activePhase === i ? 'auto' : 'none' }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          background: `${phase.color}15`,
                          color: phase.color,
                          border: `1px solid ${phase.color}30`,
                        }}
                      >
                        {phase.step}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: phase.color }}>
                        {phase.label}
                      </span>
                    </div>
                    <h2 className="text-4xl xl:text-5xl font-black leading-tight mb-5" style={{ color: 'var(--text)' }}>
                      {phase.title}
                    </h2>
                    <p className="text-lg leading-relaxed max-w-md" style={{ color: 'var(--text-muted)' }}>
                      {phase.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Phone + dots ── */}
            <div className="flex flex-col items-center gap-4">

              {/* Mobile phase label */}
              <div className="lg:hidden relative text-center" style={{ height: 64, width: 300 }}>
                {PHASES.map((phase, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: activePhase === i ? 1 : 0, y: activePhase === i ? 0 : 8 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{ pointerEvents: activePhase === i ? 'auto' : 'none' }}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: phase.color }}>
                      {phase.step} — {phase.label}
                    </span>
                    <p className="text-sm font-semibold mt-1 leading-snug" style={{ color: 'var(--text)' }}>
                      {phase.title}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Phone shell */}
              <motion.div style={{ opacity: phoneOpacity, y: phoneY }} className="relative">
                <div
                  className="relative"
                  style={{
                    padding: 8,
                    background: 'linear-gradient(145deg, #1e1b4b, #0f172a)',
                    width: 195,
                    borderRadius: '2.2rem',
                    boxShadow: '0 32px 64px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  {/* Screen */}
                  <div
                    className="relative overflow-hidden bg-white"
                    style={{ height: 370, borderRadius: '1.6rem' }}
                  >
                    {/* Notch */}
                    <div
                      className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20"
                      style={{ width: 64, height: 16, background: '#0f172a', borderRadius: 999 }}
                    />

                    {/* ─── S1: Empty ─── */}
                    <motion.div
                      style={{ opacity: s1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center"
                        style={{ background: '#f0effe' }}
                      >
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <rect x="3" y="3" width="22" height="22" rx="5" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 2" />
                        </svg>
                      </div>
                      <div className="w-20 h-2 rounded-full bg-slate-100 mb-2" />
                      <div className="w-14 h-2 rounded-full bg-slate-100 mb-4" />
                      <p className="text-[10px] text-slate-300 text-center px-8">Scroll to begin your journey</p>
                    </motion.div>

                    {/* ─── S2: Idea ─── */}
                    <motion.div
                      style={{ opacity: s2 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-5"
                    >
                      <div
                        className="w-16 h-16 rounded-full mb-3 flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' }}
                      >
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                          <path d="M17 5a8.5 8.5 0 0 1 4 16V24a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-3A8.5 8.5 0 0 1 17 5z" stroke="#7C3AED" strokeWidth="1.6" fill="none" />
                          <path d="M13.5 27h7M14.5 30h5" stroke="#7C3AED" strokeWidth="1.6" strokeLinecap="round" />
                          <circle cx="17" cy="13" r="1.5" fill="#7C3AED" />
                        </svg>
                      </div>
                      <div className="text-center mb-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#7C3AED' }}>
                          Your Idea
                        </div>
                        <div className="text-xs font-semibold text-gray-700">A vision waiting to become real</div>
                      </div>
                      <div className="w-full space-y-2">
                        {['💡 Mobile App', '📊 Dashboard', '🛒 Marketplace'].map((t) => (
                          <div
                            key={t}
                            className="text-xs px-3 py-2 rounded-lg text-gray-500 text-center"
                            style={{
                              background: 'rgba(124,58,237,0.06)',
                              border: '1px dashed rgba(124,58,237,0.2)',
                            }}
                          >
                            {t}
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* ─── S3: Building ─── */}
                    <motion.div
                      style={{ opacity: s3, background: '#0f172a' }}
                      className="absolute inset-0 flex flex-col p-3 pt-9"
                    >
                      <div className="flex items-center gap-1.5 mb-3">
                        {['#f87171', '#fbbf24', '#4ade80'].map((c) => (
                          <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
                        ))}
                        <span className="text-[9px] text-slate-400 font-mono ml-1">wethink-app.tsx</span>
                      </div>

                      <div className="space-y-2.5 flex-1">
                        {cl.map((w, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-slate-600 text-[9px] font-mono w-3 flex-shrink-0">{i + 1}</span>
                            <div
                              className="flex-1 overflow-hidden"
                              style={{ height: 10, borderRadius: 2, background: 'rgba(255,255,255,0.04)' }}
                            >
                              <motion.div
                                style={{ width: w, background: CODE_COLORS[i], height: '100%', borderRadius: 2 }}
                              />
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <span className="text-slate-600 text-[9px] font-mono w-3">5</span>
                          <span className="text-slate-500 text-[9px] font-mono">{'});'}</span>
                        </div>
                      </div>

                      <div className="mt-2 pb-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] text-slate-400">Deploying to cloud...</span>
                          <span className="text-[9px] text-violet-400 font-mono">WeThink ✓</span>
                        </div>
                        <div
                          className="overflow-hidden"
                          style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.08)' }}
                        >
                          <motion.div
                            style={{
                              width: buildPct,
                              height: '100%',
                              borderRadius: 999,
                              background: 'linear-gradient(90deg, #7C3AED, #A78BFA)',
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* ─── S4: Success ─── */}
                    <motion.div
                      style={{ opacity: s4, background: '#F8F7FF' }}
                      className="absolute inset-0 flex flex-col"
                    >
                      <div
                        className="flex items-center justify-between px-4 pb-2 border-b border-gray-100"
                        style={{ paddingTop: 38 }}
                      >
                        <span className="text-xs font-black" style={{ color: '#7C3AED' }}>WeThink App</span>
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: '#f0effe' }}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ background: '#7C3AED' }} />
                        </div>
                      </div>

                      <div className="flex-1 px-3 py-2 flex flex-col gap-2 overflow-hidden">
                        {/* Revenue */}
                        <div
                          className="rounded-xl p-3"
                          style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
                        >
                          <div className="text-[9px] text-violet-200 mb-0.5">Total Revenue</div>
                          <div className="text-lg font-black text-white leading-none">
                            AED {revenue.toLocaleString()}
                          </div>
                          <div className="text-[9px] text-emerald-300 mt-0.5">↑ 124% this month</div>
                        </div>

                        {/* Users */}
                        <div
                          className="flex items-center gap-2 p-2 rounded-lg"
                          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: '#dcfce7' }}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <circle cx="5" cy="4.5" r="2" stroke="#059669" strokeWidth="1.2" />
                              <circle cx="9" cy="4.5" r="2" stroke="#059669" strokeWidth="1.2" />
                              <path d="M1 12c0-2.5 1.8-3.5 4-3.5M13 12c0-2.5-1.8-3.5-4-3.5" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-[9px] text-gray-400">Active Users</div>
                            <div className="text-xs font-black text-gray-800">{users.toLocaleString()}</div>
                          </div>
                          <div className="ml-auto text-[9px] font-bold" style={{ color: '#059669' }}>↑ 89%</div>
                        </div>

                        {/* Bar chart */}
                        <div className="flex-1 min-h-0">
                          <div className="text-[9px] text-gray-400 mb-1.5">Monthly Growth</div>
                          <div className="flex items-end gap-1.5" style={{ height: 60 }}>
                            {bh.map((h, i) => (
                              <motion.div
                                key={i}
                                style={{
                                  height: h,
                                  flex: 1,
                                  background: 'linear-gradient(to top, #7C3AED, #A78BFA)',
                                  borderRadius: '3px 3px 0 0',
                                  opacity: 0.6 + i * 0.08,
                                }}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between mt-1">
                            {MONTHS.map((m) => (
                              <span key={m} className="text-[8px] text-gray-300 flex-1 text-center">{m}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Home bar */}
                    <div
                      className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20"
                      style={{ width: 48, height: 4, background: '#d1d5db', borderRadius: 999 }}
                    />
                  </div>
                </div>

                {/* Glow beneath phone */}
                <div
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{
                    bottom: -12,
                    width: 120,
                    height: 24,
                    background: 'rgba(124,58,237,0.35)',
                    borderRadius: '50%',
                    filter: 'blur(16px)',
                  }}
                />
              </motion.div>

              {/* Progress dots */}
              <div className="flex items-center gap-2 mt-1">
                {PHASES.map((phase, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      width: activePhase === i ? 24 : 8,
                      backgroundColor: activePhase >= i ? phase.color : '#E2E8F0',
                    }}
                    transition={{ duration: 0.35 }}
                    style={{ height: 8, borderRadius: 999 }}
                  />
                ))}
              </div>
            </div>

            {/* Desktop spacer */}
            <div className="flex-1 hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  )
}
