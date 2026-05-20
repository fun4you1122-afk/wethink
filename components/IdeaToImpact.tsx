'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

const PHASES = [
  {
    step: '01',
    label: 'The Beginning',
    title: 'Every great product starts with a blank canvas.',
    desc: 'Your idea is the seed. Before any line of code, there is a moment of pure possibility.',
    color: '#A78BFA',
    glow: 'rgba(124,58,237,0.18)',
  },
  {
    step: '02',
    label: 'Your Vision',
    title: 'You bring the spark. We listen closely.',
    desc: 'We dive deep into your goals, your users, and your market to understand exactly what to build.',
    color: '#818CF8',
    glow: 'rgba(79,70,229,0.20)',
  },
  {
    step: '03',
    label: 'WeThink Builds',
    title: 'Our engineers turn your vision into reality.',
    desc: 'From architecture to design to deployment — every function crafted with precision for your users.',
    color: '#38BDF8',
    glow: 'rgba(56,189,248,0.14)',
  },
  {
    step: '04',
    label: 'Your Success',
    title: 'Watch your audience and revenue grow.',
    desc: "A product built right doesn't just launch — it scales. Real users, real growth, real impact.",
    color: '#34D399',
    glow: 'rgba(5,150,105,0.18)',
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

  // Heading fade
  const headingOpacity = useTransform(scrollYProgress, [0, 0.04, 0.12, 0.18], [1, 1, 1, 0])

  // Phone entrance
  const phoneOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1])
  const phoneY = useTransform(scrollYProgress, [0, 0.08], [60, 0])
  const phoneScale = useTransform(scrollYProgress, [0, 0.08], [0.88, 1])

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

  // Phase 4 — bar heights (px, parent is 70px tall)
  const bh = [
    useTransform(scrollYProgress, [0.78, 0.93], [4, 38]),
    useTransform(scrollYProgress, [0.79, 0.94], [4, 52]),
    useTransform(scrollYProgress, [0.80, 0.95], [4, 32]),
    useTransform(scrollYProgress, [0.81, 0.96], [4, 62]),
    useTransform(scrollYProgress, [0.82, 0.97], [4, 44]),
  ]

  const activeColor = PHASES[activePhase].color
  const activeGlow = PHASES[activePhase].glow

  return (
    <section ref={sectionRef} id="journey" className="relative" style={{ height: '380vh' }}>
      <div
        className="sticky top-0 h-screen flex items-center overflow-hidden"
        style={{ background: '#04080f' }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Atmospheric glow — changes per phase */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${activeGlow} 0%, transparent 70%)` }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />

        {/* Corner orbs */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: -160,
            right: -160,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(124,58,237,0.08)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: -120,
            left: -120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(56,189,248,0.05)',
            filter: 'blur(100px)',
          }}
        />

        {/* Section heading */}
        <motion.div
          style={{ opacity: headingOpacity }}
          className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none"
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase"
            style={{ color: 'rgba(167,139,250,0.9)' }}
          >
            <span
              style={{
                display: 'block',
                width: 22,
                height: 2,
                borderRadius: 2,
                background: 'rgba(167,139,250,0.9)',
              }}
            />
            From Idea to Impact
          </span>
        </motion.div>

        <div className="relative w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-5 lg:gap-20">

            {/* ── Desktop text panel ── */}
            <div className="flex-1 hidden lg:block">
              <div className="relative" style={{ height: 300 }}>
                {PHASES.map((phase, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      opacity: activePhase === i ? 1 : 0,
                      y: activePhase === i ? 0 : activePhase > i ? -18 : 18,
                    }}
                    transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute inset-0"
                    style={{ pointerEvents: activePhase === i ? 'auto' : 'none' }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          background: `${phase.color}18`,
                          color: phase.color,
                          border: `1px solid ${phase.color}35`,
                        }}
                      >
                        {phase.step}
                      </span>
                      <span
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: phase.color }}
                      >
                        {phase.label}
                      </span>
                    </div>

                    <h2
                      className="text-5xl xl:text-6xl font-black leading-tight mb-6"
                      style={{ color: '#F1F5F9' }}
                    >
                      {phase.title}
                    </h2>

                    <p
                      className="text-lg leading-relaxed max-w-md"
                      style={{ color: 'rgba(148,163,184,0.85)' }}
                    >
                      {phase.desc}
                    </p>

                    {/* Decorative line */}
                    <div
                      className="mt-8"
                      style={{
                        width: 48,
                        height: 3,
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${phase.color}, transparent)`,
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Phone + dots ── */}
            <div className="flex flex-col items-center gap-5">

              {/* Mobile phase label */}
              <div className="lg:hidden relative text-center" style={{ height: 68, width: 320 }}>
                {PHASES.map((phase, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: activePhase === i ? 1 : 0, y: activePhase === i ? 0 : 8 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{ pointerEvents: activePhase === i ? 'auto' : 'none' }}
                  >
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: phase.color }}
                    >
                      {phase.step} — {phase.label}
                    </span>
                    <p
                      className="text-sm font-semibold mt-1 leading-snug"
                      style={{ color: '#F1F5F9' }}
                    >
                      {phase.title}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Phone shell */}
              <motion.div
                style={{ opacity: phoneOpacity, y: phoneY, scale: phoneScale }}
                className="relative"
              >
                {/* Ambient glow beneath phone */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                  animate={{ background: `radial-gradient(ellipse at center, ${activeColor}50, transparent 70%)` }}
                  transition={{ duration: 0.8 }}
                  style={{
                    bottom: -32,
                    width: 220,
                    height: 60,
                    filter: 'blur(18px)',
                  }}
                />

                <div
                  className="relative"
                  style={{
                    padding: 8,
                    background: 'linear-gradient(145deg, #2d1b69, #0f172a)',
                    width: 240,
                    borderRadius: '2.5rem',
                    boxShadow:
                      '0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.10)',
                  }}
                >
                  {/* Side button detail */}
                  <div
                    className="absolute"
                    style={{
                      right: -3,
                      top: 90,
                      width: 3,
                      height: 40,
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: '0 2px 2px 0',
                    }}
                  />

                  {/* Screen */}
                  <div
                    className="relative overflow-hidden bg-white"
                    style={{ height: 450, borderRadius: '2rem' }}
                  >
                    {/* Notch */}
                    <div
                      className="absolute top-3 left-1/2 -translate-x-1/2 z-20"
                      style={{ width: 72, height: 18, background: '#0f172a', borderRadius: 999 }}
                    />

                    {/* ─── S1: Empty ─── */}
                    <motion.div
                      style={{ opacity: s1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                      <div
                        className="w-16 h-16 rounded-2xl mb-5 flex items-center justify-center"
                        style={{ background: '#f0effe' }}
                      >
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                          <rect x="3" y="3" width="26" height="26" rx="6" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 3" />
                        </svg>
                      </div>
                      <div className="w-24 h-2.5 rounded-full bg-slate-100 mb-2.5" />
                      <div className="w-16 h-2.5 rounded-full bg-slate-100 mb-5" />
                      <p className="text-[11px] text-slate-300 text-center px-10 leading-relaxed">
                        Scroll to begin your journey
                      </p>
                    </motion.div>

                    {/* ─── S2: Idea ─── */}
                    <motion.div
                      style={{ opacity: s2 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-6"
                    >
                      <div
                        className="w-18 h-18 rounded-full mb-4 flex items-center justify-center"
                        style={{
                          width: 72,
                          height: 72,
                          background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
                        }}
                      >
                        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                          <path
                            d="M19 5a10 10 0 0 1 5 18.66V27a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-3.34A10 10 0 0 1 19 5z"
                            stroke="#7C3AED"
                            strokeWidth="1.6"
                            fill="none"
                          />
                          <path d="M15 30h8M16 33h6" stroke="#7C3AED" strokeWidth="1.6" strokeLinecap="round" />
                          <circle cx="19" cy="14" r="2" fill="#7C3AED" />
                        </svg>
                      </div>
                      <div className="text-center mb-5">
                        <div
                          className="text-[11px] font-bold uppercase tracking-wider mb-1.5"
                          style={{ color: '#7C3AED' }}
                        >
                          Your Idea
                        </div>
                        <div className="text-sm font-semibold text-gray-700 leading-snug">
                          A vision waiting to become real
                        </div>
                      </div>
                      <div className="w-full space-y-2.5">
                        {['💡 Mobile App', '📊 Dashboard', '🛒 Marketplace'].map((t) => (
                          <div
                            key={t}
                            className="text-xs px-3 py-2.5 rounded-xl text-gray-500 text-center font-medium"
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
                      className="absolute inset-0 flex flex-col p-4 pt-11"
                    >
                      <div className="flex items-center gap-1.5 mb-4">
                        {['#f87171', '#fbbf24', '#4ade80'].map((c) => (
                          <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                        ))}
                        <span className="text-[10px] text-slate-400 font-mono ml-1.5">wethink-app.tsx</span>
                      </div>

                      <div className="space-y-3 flex-1">
                        {cl.map((w, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <span className="text-slate-600 text-[10px] font-mono w-3.5 flex-shrink-0">{i + 1}</span>
                            <div
                              className="flex-1 overflow-hidden"
                              style={{ height: 11, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}
                            >
                              <motion.div
                                style={{ width: w, background: CODE_COLORS[i], height: '100%', borderRadius: 3 }}
                              />
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center gap-2.5">
                          <span className="text-slate-600 text-[10px] font-mono w-3.5">5</span>
                          <span className="text-slate-500 text-[10px] font-mono">{'});'}</span>
                        </div>
                      </div>

                      <div className="mt-3 pb-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-slate-400">Deploying to cloud...</span>
                          <span className="text-[10px] text-violet-400 font-mono">WeThink ✓</span>
                        </div>
                        <div
                          className="overflow-hidden"
                          style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.08)' }}
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
                        style={{ paddingTop: 44 }}
                      >
                        <span className="text-xs font-black" style={{ color: '#7C3AED' }}>WeThink App</span>
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: '#f0effe' }}
                        >
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#7C3AED' }} />
                        </div>
                      </div>

                      <div className="flex-1 px-3 py-3 flex flex-col gap-2.5 overflow-hidden">
                        {/* Revenue */}
                        <div
                          className="rounded-2xl p-3.5"
                          style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
                        >
                          <div className="text-[10px] text-violet-200 mb-0.5">Total Revenue</div>
                          <div className="text-xl font-black text-white leading-none">
                            AED {revenue.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-emerald-300 mt-1">↑ 124% this month</div>
                        </div>

                        {/* Users */}
                        <div
                          className="flex items-center gap-2.5 p-2.5 rounded-xl"
                          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: '#dcfce7' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <circle cx="5.5" cy="5" r="2.2" stroke="#059669" strokeWidth="1.3" />
                              <circle cx="10.5" cy="5" r="2.2" stroke="#059669" strokeWidth="1.3" />
                              <path d="M1 14c0-2.8 2-4 4.5-4M15 14c0-2.8-2-4-4.5-4" stroke="#059669" strokeWidth="1.3" strokeLinecap="round" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-400">Active Users</div>
                            <div className="text-sm font-black text-gray-800">{users.toLocaleString()}</div>
                          </div>
                          <div className="ml-auto text-[10px] font-bold" style={{ color: '#059669' }}>↑ 89%</div>
                        </div>

                        {/* Bar chart */}
                        <div className="flex-1 min-h-0">
                          <div className="text-[10px] text-gray-400 mb-2">Monthly Growth</div>
                          <div className="flex items-end gap-2" style={{ height: 70 }}>
                            {bh.map((h, i) => (
                              <motion.div
                                key={i}
                                style={{
                                  height: h,
                                  flex: 1,
                                  background: 'linear-gradient(to top, #7C3AED, #A78BFA)',
                                  borderRadius: '4px 4px 0 0',
                                  opacity: 0.55 + i * 0.09,
                                }}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between mt-1.5">
                            {MONTHS.map((m) => (
                              <span key={m} className="text-[9px] text-gray-300 flex-1 text-center">{m}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Home bar */}
                    <div
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20"
                      style={{ width: 56, height: 4, background: '#d1d5db', borderRadius: 999 }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Progress dots */}
              <div className="flex items-center gap-2.5 mt-1">
                {PHASES.map((phase, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      width: activePhase === i ? 28 : 8,
                      backgroundColor: activePhase >= i ? phase.color : 'rgba(255,255,255,0.15)',
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
