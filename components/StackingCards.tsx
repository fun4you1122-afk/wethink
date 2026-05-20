'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView, MotionValue } from 'framer-motion'
import { Search, Layers, Code2, TrendingUp } from 'lucide-react'

const STEPS = [
  {
    step: '01',
    title: 'Discover',
    subtitle: 'Deep-dive audit & research',
    desc: 'We start by listening. Stakeholder interviews, systems audits, and competitive analysis give us a complete picture of your technical landscape and strategic ambitions.',
    icon: Search,
    accent: '#7C3AED',
    cardBg: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
    borderColor: 'rgba(124,58,237,0.2)',
    detail: ['Stakeholder Interviews', 'Systems Audit', 'Competitive Analysis', 'Risk Assessment'],
  },
  {
    step: '02',
    title: 'Design',
    subtitle: 'Blueprint & architecture',
    desc: 'Strategy meets design. We craft a precise technology roadmap — from system architecture and UI/UX wireframes to data flows and security frameworks — before a single line of code is written.',
    icon: Layers,
    accent: '#4F46E5',
    cardBg: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)',
    borderColor: 'rgba(79,70,229,0.2)',
    detail: ['Technology Roadmap', 'System Architecture', 'UI/UX Wireframes', 'Security Framework'],
  },
  {
    step: '03',
    title: 'Build',
    subtitle: 'Agile engineering & delivery',
    desc: 'Our engineers execute with precision using agile sprints, CI/CD pipelines, and rigorous QA — keeping you in the loop at every milestone. Quality is non-negotiable.',
    icon: Code2,
    accent: '#9333EA',
    cardBg: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)',
    borderColor: 'rgba(147,51,234,0.2)',
    detail: ['Agile Sprints', 'CI/CD Pipelines', 'Automated QA', 'Milestone Reviews'],
  },
  {
    step: '04',
    title: 'Scale',
    subtitle: 'Launch, optimise & grow',
    desc: 'Go-live is just the beginning. We monitor performance, iterate on feedback, and scale your solution as your business grows — ensuring long-term ROI.',
    icon: TrendingUp,
    accent: '#C026D3',
    cardBg: 'linear-gradient(135deg, #fdf4ff 0%, #ffffff 100%)',
    borderColor: 'rgba(192,38,211,0.2)',
    detail: ['Performance Monitoring', 'Iterative Updates', 'Capacity Planning', 'ROI Reporting'],
  },
]

function SplitWords({ text, inView }: { text: string; inView: boolean }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={inView ? { y: 0 } : { y: '110%' }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </>
  )
}

function StackCard({
  step,
  index,
  scrollYProgress,
}: {
  step: (typeof STEPS)[0]
  index: number
  scrollYProgress: MotionValue<number>
}) {
  const n = STEPS.length
  const entryStart = (index / n) * 0.85
  const entryEnd = entryStart + 0.12
  const exitStart = ((index + 1) / n) * 0.85
  const exitEnd = exitStart + 0.15
  const isLast = index === n - 1

  const y = useTransform(scrollYProgress, [Math.max(0, entryStart - 0.08), entryEnd], [100, 0])
  const opacity = useTransform(scrollYProgress, [Math.max(0, entryStart - 0.04), entryEnd], [0, 1])
  const scale = useTransform(
    scrollYProgress,
    isLast ? [0, 1] : [exitStart, exitEnd],
    isLast ? [1, 1] : [1, 0.94],
  )
  const blur = useTransform(
    scrollYProgress,
    isLast ? [0, 1] : [exitStart, exitEnd],
    isLast ? [0, 0] : [0, 3],
  )

  const Icon = step.icon

  return (
    <motion.div
      style={{
        y,
        opacity,
        scale,
        filter: blur ? blur.get() !== undefined ? `blur(${blur.get()}px)` : undefined : undefined,
        top: `${100 + index * 14}px`,
        zIndex: index + 1,
      }}
      className="sticky mx-auto w-full max-w-5xl px-6 will-change-transform"
    >
      <div
        className="rounded-3xl overflow-hidden shadow-xl"
        style={{
          background: step.cardBg,
          border: `1px solid ${step.borderColor}`,
          boxShadow: `0 20px 60px ${step.accent}15, 0 4px 20px rgba(0,0,0,0.06)`,
        }}
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left — content */}
          <div className="p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${step.accent}22, ${step.accent}44)`, border: `1px solid ${step.accent}33` }}
                >
                  <Icon size={24} style={{ color: step.accent }} />
                </div>
                <span className="text-6xl font-black opacity-10 leading-none" style={{ color: step.accent }}>
                  {step.step}
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-black mb-2" style={{ color: 'var(--text)' }}>
                {step.title}
              </h3>
              <p className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: step.accent }}>
                {step.subtitle}
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {step.desc}
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="w-8 h-0.5 rounded-full" style={{ background: step.accent }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: step.accent }}>
                Step {step.step} of {String(STEPS.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Right — detail chips */}
          <div
            className="p-8 md:p-12 flex flex-col justify-center gap-4"
            style={{ background: `linear-gradient(135deg, ${step.accent}08, ${step.accent}04)` }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: step.accent }}>
              Key Activities
            </p>
            {step.detail.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex items-center gap-3 rounded-xl px-5 py-3.5"
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  border: `1px solid ${step.accent}20`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: step.accent }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function StackingCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headingRef, { once: true, margin: '-80px' })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="process"
      ref={containerRef}
      style={{ height: `${STEPS.length * 100 + 60}vh` }}
      className="relative"
    >
      {/* Sticky heading */}
      <div
        className="sticky top-0 z-20 pt-20 pb-8 text-center"
        style={{ background: 'linear-gradient(to bottom, var(--bg) 80%, transparent)' }}
      >
        <div ref={headingRef}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label mx-auto">How We Work</span>
          </motion.div>
          <h2
            className="text-4xl md:text-6xl font-black mt-3"
            style={{ color: 'var(--text)' }}
            aria-label="Our Process"
          >
            <SplitWords text="Our" inView={inView} />
            <span className="gradient-text">
              <SplitWords text="Process" inView={inView} />
            </span>
          </h2>
        </div>
      </div>

      {/* Stacking cards */}
      <div className="relative pb-32">
        {STEPS.map((step, i) => (
          <StackCard key={step.title} step={step} index={i} scrollYProgress={scrollYProgress} />
        ))}
      </div>
    </section>
  )
}
