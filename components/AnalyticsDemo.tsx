'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { BarChart3, Users, TrendingUp, Sparkles, ChevronRight, CheckCircle, Send } from 'lucide-react'

/* ─── Dataset definitions ─────────────────────────────────── */
const datasets = [
  {
    id: 'sales',
    name: 'Sales Performance',
    icon: BarChart3,
    rows: '2,847 rows · 18 months',
    description: 'Monthly revenue, pipeline, and conversion metrics across the Gulf region.',
    accent: '#A78BFA',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'hr',
    name: 'HR Analytics',
    icon: Users,
    rows: '412 employees',
    description: 'Headcount, turnover, department breakdown, and tenure analysis.',
    accent: '#34D399',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'traffic',
    name: 'Web & App Traffic',
    icon: TrendingUp,
    rows: '90 days · 5 channels',
    description: 'Sessions, conversions, source breakdown, and user behaviour patterns.',
    accent: '#38BDF8',
    gradient: 'from-sky-500 to-blue-600',
  },
]

/* ─── Suggested questions per dataset ────────────────────── */
const suggestions: Record<string, string[]> = {
  sales: [
    'What are the top 3 revenue months?',
    'Show conversion rate trend',
    'Which product drives the most revenue?',
  ],
  hr: [
    'What is the turnover rate by department?',
    'Show headcount growth over time',
    'Which team has the lowest retention?',
  ],
  traffic: [
    'Which day drives the most sessions?',
    'Show conversion funnel drop-off',
    'Which channel has the best ROI?',
  ],
}

/* ─── Mock analysis results ──────────────────────────────── */
type MockResult = {
  metrics: { label: string; value: string; change: string; positive: boolean }[]
  chartData: { label: string; value: number; sub: string }[]
  chartColor: string
  chartTitle: string
  finding: string
  caveat: string
}

const mockResults: Record<string, MockResult> = {
  sales: {
    metrics: [
      { label: 'Total Revenue', value: 'AED 2.4M', change: '+18% YoY', positive: true },
      { label: 'Best Month', value: 'Dec 2024', change: 'AED 420K', positive: true },
      { label: 'Avg Deal Size', value: 'AED 84K', change: '+6% vs prior', positive: true },
      { label: 'Conversion', value: '24.3%', change: '-2.1pp YoY', positive: false },
    ],
    chartData: [
      { label: 'Jul', value: 280, sub: '280K' },
      { label: 'Aug', value: 310, sub: '310K' },
      { label: 'Sep', value: 295, sub: '295K' },
      { label: 'Oct', value: 350, sub: '350K' },
      { label: 'Nov', value: 385, sub: '385K' },
      { label: 'Dec', value: 420, sub: '420K' },
    ],
    chartColor: '#A78BFA',
    chartTitle: 'Monthly Revenue (AED \'000) — H2 2024',
    finding:
      'December 2024 was your strongest month at AED 420K, driven by Q4 enterprise deal closures. Revenue accelerated consistently through H2 with an 8.3% month-on-month growth rate. Three enterprise accounts represent 62% of total revenue — a concentration risk worth monitoring going into 2025.',
    caveat:
      'Analysis based on 2,847 closed-won records. Pipeline and verbal commitments excluded. Seasonal patterns suggest Q1 typically dips 15–20% — factor this into forecasting.',
  },
  hr: {
    metrics: [
      { label: 'Total Headcount', value: '412', change: '+31% YoY', positive: true },
      { label: 'Turnover Rate', value: '14.2%', change: '+2.1pp YoY', positive: false },
      { label: 'Avg Tenure', value: '2.8 yrs', change: 'Stable', positive: true },
      { label: 'Open Roles', value: '23', change: '5.6% vacancy', positive: false },
    ],
    chartData: [
      { label: 'Eng', value: 98, sub: '98' },
      { label: 'Sales', value: 74, sub: '74' },
      { label: 'Ops', value: 61, sub: '61' },
      { label: 'Product', value: 55, sub: '55' },
      { label: 'CS', value: 48, sub: '48' },
      { label: 'Other', value: 76, sub: '76' },
    ],
    chartColor: '#34D399',
    chartTitle: 'Headcount by Department',
    finding:
      'Engineering has the highest turnover at 22%, well above the company average of 14.2%. Customer Success shows the strongest retention at 8%. Most new hires in the past 6 months joined Sales and Product. Time-to-hire has increased by 18 days since last year, suggesting a tightening talent market.',
    caveat:
      'Turnover calculated as voluntary exits only. Contract and intern headcount excluded. Departments under 10 people not shown for privacy.',
  },
  traffic: {
    metrics: [
      { label: 'Total Sessions', value: '48.2K', change: '+22% QoQ', positive: true },
      { label: 'Conversion Rate', value: '3.4%', change: '+0.6pp QoQ', positive: true },
      { label: 'Avg Session', value: '4m 12s', change: '+38s vs prior', positive: true },
      { label: 'Mobile Share', value: '61%', change: 'Conv. only 28%', positive: false },
    ],
    chartData: [
      { label: 'Mon', value: 5800, sub: '5.8K' },
      { label: 'Tue', value: 8200, sub: '8.2K' },
      { label: 'Wed', value: 9100, sub: '9.1K' },
      { label: 'Thu', value: 7600, sub: '7.6K' },
      { label: 'Fri', value: 6400, sub: '6.4K' },
      { label: 'Sat', value: 3200, sub: '3.2K' },
    ],
    chartColor: '#38BDF8',
    chartTitle: 'Average Daily Sessions by Weekday',
    finding:
      'Tuesday and Wednesday together drive 36% of weekly traffic. LinkedIn is your highest-converting channel at 5.8% vs organic search at 2.1%. Mobile accounts for 61% of sessions but only 28% of conversions — a significant optimisation opportunity. Users who view the Services page convert at 4.7×  the site average.',
    caveat:
      'Data covers 90 days ending Apr 2025. Bot traffic filtered. Conversion defined as contact form submission or WhatsApp click.',
  },
}

/* ─── Animated bar chart ─────────────────────────────────── */
function MiniBarChart({ data, color }: { data: { label: string; value: number; sub: string }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.value))
  return (
    <div className="flex items-end gap-1.5 h-28 w-full pt-2">
      {data.map((d, i) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[9px] text-gray-400 leading-none">{d.sub}</span>
          <div className="w-full flex flex-col justify-end" style={{ height: '72px' }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(6, (d.value / max) * 100)}%` }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full rounded-t-sm"
              style={{ background: `linear-gradient(to top, ${color}99, ${color})` }}
            />
          </div>
          <span className="text-[9px] text-gray-500 leading-none">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────── */
export default function AnalyticsDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [selected, setSelected] = useState<string | null>(null)
  const [question, setQuestion] = useState('')
  const [phase, setPhase] = useState<'idle' | 'thinking' | 'result'>('idle')
  const [result, setResult] = useState<MockResult | null>(null)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const activeDataset = datasets.find((d) => d.id === selected)

  const runAnalysis = (q: string) => {
    if (!selected) return
    setQuestion(q)
    setPhase('thinking')
    setResult(null)
    setTimeout(() => {
      setResult(mockResults[selected])
      setPhase('result')
    }, 2200)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setEmailSent(true)
  }

  return (
    <section id="ai-demo" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'var(--surface-2)' }} />
      <div className="orb w-[500px] h-[500px] bg-violet-200 opacity-30 top-[-100px] right-[-150px] pointer-events-none" />
      <div className="orb w-[400px] h-[400px] bg-sky-200 opacity-20 bottom-[-100px] left-[-100px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div ref={ref} className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label mx-auto flex items-center justify-center gap-2">
              <Sparkles size={12} />
              AI-Powered
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mt-3"
            style={{ color: 'var(--text)' }}
          >
            Live <span className="gradient-text">Analytics Demo</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            Pick a sample dataset, ask a question in plain English, and watch our AI analyst
            explore, clean, and visualise the data — just like it would on your real business data.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">

          {/* Step 1 — Pick dataset */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
              Step 1 — Choose a sample dataset
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {datasets.map((ds, i) => {
                const Icon = ds.icon
                const isSelected = selected === ds.id
                return (
                  <motion.button
                    key={ds.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.35 + i * 0.08 }}
                    onClick={() => { setSelected(ds.id); setPhase('idle'); setResult(null); setQuestion('') }}
                    className={`group relative text-left rounded-2xl p-5 border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-violet-400 shadow-lg shadow-violet-200/40'
                        : 'border-violet-100 hover:border-violet-300'
                    }`}
                    style={{ background: isSelected ? `${ds.accent}08` : 'var(--surface)' }}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="dataset-selected"
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{ background: `${ds.accent}06` }}
                      />
                    )}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${ds.gradient} text-white`}
                    >
                      <Icon size={18} />
                    </div>
                    <h4 className="font-bold text-sm mb-0.5" style={{ color: 'var(--text)' }}>{ds.name}</h4>
                    <p className="text-[10px] font-medium mb-2" style={{ color: ds.accent }}>{ds.rows}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{ds.description}</p>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: ds.accent }}
                      >
                        <CheckCircle size={12} className="text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* Step 2 — Ask a question */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                  Step 2 — Ask a question
                </p>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {suggestions[selected].map((s) => (
                    <button
                      key={s}
                      onClick={() => runAnalysis(s)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-violet-200 hover:border-violet-400 hover:bg-violet-50 transition-all duration-200 font-medium"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <ChevronRight size={10} className="text-violet-400" />
                      {s}
                    </button>
                  ))}
                </div>

                {/* Custom input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && question.trim() && runAnalysis(question)}
                    placeholder="Or type your own question…"
                    className="flex-1 px-4 py-3 rounded-xl text-sm border border-violet-200 focus:border-violet-400 focus:outline-none bg-white transition-colors"
                    style={{ color: 'var(--text)' }}
                  />
                  <button
                    onClick={() => question.trim() && runAnalysis(question)}
                    className="btn-primary px-5 py-3 text-sm"
                  >
                    Analyse
                    <Sparkles size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3 — Results */}
          <AnimatePresence mode="wait">

            {/* Thinking state */}
            {phase === 'thinking' && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 rounded-full border-2 border-violet-400 border-t-transparent"
                  />
                  <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                    Analysing dataset…
                  </span>
                </div>
                {[
                  'Loading data — 2,847 rows × 14 columns detected',
                  'Checking for nulls and type mismatches…',
                  'Running aggregations and building chart…',
                  'Generating plain-language findings…',
                ].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.45 }}
                    className="flex items-center gap-2 mb-2"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.45 + 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0"
                    />
                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{step}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Results */}
            {phase === 'result' && result && activeDataset && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                {/* Result header */}
                <div className="px-6 pt-5 pb-4 border-b border-violet-100 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-1">
                      AI Analysis · {activeDataset.name}
                    </p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>"{question}"</p>
                  </div>
                  <span className="flex-shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    ✓ Complete
                  </span>
                </div>

                <div className="p-6 space-y-6">

                  {/* Metric cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {result.metrics.map((m, i) => (
                      <motion.div
                        key={m.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="rounded-xl p-3 text-center"
                        style={{ background: 'var(--surface-2)' }}
                      >
                        <p className="text-lg font-black" style={{ color: 'var(--text)' }}>{m.value}</p>
                        <p className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          m.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {m.change}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="rounded-xl p-4 border border-violet-100" style={{ background: 'var(--surface)' }}>
                    <p className="text-[11px] font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                      {result.chartTitle}
                    </p>
                    <MiniBarChart data={result.chartData} color={activeDataset.accent} />
                  </div>

                  {/* Findings */}
                  <div className="rounded-xl p-4 border-l-4" style={{ borderColor: activeDataset.accent, background: `${activeDataset.accent}08` }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: activeDataset.accent }}>
                      Key Findings
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                      {result.finding}
                    </p>
                  </div>

                  {/* Caveats */}
                  <p className="text-xs leading-relaxed px-1" style={{ color: 'var(--text-muted)' }}>
                    ⚠ {result.caveat}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email capture CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 rounded-3xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #C026D3 100%)' }}
          >
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
            <div className="orb w-[300px] h-[300px] bg-white opacity-5 top-[-100px] right-[-50px] pointer-events-none" />

            <div className="relative p-8 md:p-10">
              <div className="max-w-xl">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-200 mb-3 block">
                  Coming Soon
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
                  Want this on your own data?
                </h3>
                <p className="text-violet-200 text-sm leading-relaxed mb-6">
                  WeThink AI Analytics connects to your existing data sources — ERP, CRM, spreadsheets, or databases —
                  and gives your team instant answers in plain language. Be first to know when we launch.
                </p>

                <AnimatePresence mode="wait">
                  {!emailSent ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleEmailSubmit}
                      className="flex flex-col sm:flex-row gap-3"
                    >
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-1 px-4 py-3 rounded-xl text-sm bg-white/10 text-white placeholder-violet-300 border border-white/20 focus:border-white/50 focus:outline-none backdrop-blur-sm"
                      />
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-violet-700 rounded-xl text-sm font-bold hover:bg-violet-50 transition-colors flex-shrink-0"
                      >
                        Get Early Access
                        <Send size={14} />
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 text-white"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">You&apos;re on the list!</p>
                        <p className="text-violet-200 text-xs">We&apos;ll reach out as soon as the platform launches.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
