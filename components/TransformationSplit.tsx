'use client'

import { Component } from '@/components/ui/lightning-split'

// ── Before panel ──────────────────────────────────────────────────────────────
function BeforePanel() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#111827] px-8 text-center">
      {/* Muted grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Label */}
      <span className="mb-6 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-red-400">
        Before WeThink
      </span>

      {/* Fake outdated website mockup */}
      <div className="mb-8 w-full max-w-sm rounded-xl border border-white/10 bg-[#1c2533] shadow-2xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 rounded-t-xl border-b border-white/10 bg-[#161e2b] px-4 py-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          <div className="mx-2 flex-1 rounded bg-white/5 px-3 py-0.5 text-[9px] text-gray-600">
            www.old-company-site.com
          </div>
        </div>
        {/* Page body */}
        <div className="space-y-3 p-4">
          <div className="h-3 w-3/4 rounded bg-white/10" />
          <div className="h-2 w-full rounded bg-white/6" />
          <div className="h-2 w-5/6 rounded bg-white/6" />
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="h-12 rounded bg-white/5" />
            <div className="h-12 rounded bg-white/5" />
            <div className="h-12 rounded bg-white/5" />
          </div>
          <div className="mt-2 h-7 w-1/3 rounded bg-gray-700/60" />
        </div>
      </div>

      {/* Pain-point stats */}
      <div className="grid w-full max-w-xs grid-cols-3 gap-3 text-center">
        {[
          { value: '72 hr', label: 'Avg Response Time', bad: true },
          { value: '61%', label: 'System Uptime', bad: true },
          { value: '0', label: 'Cloud Coverage', bad: true },
        ].map(s => (
          <div key={s.label} className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
            <p className="text-lg font-black text-red-400">{s.value}</p>
            <p className="mt-0.5 text-[9px] leading-tight text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Issues list */}
      <ul className="mt-6 space-y-2 text-left">
        {[
          'Manual IT support tickets',
          'No security monitoring',
          'On-premise only infrastructure',
          'No disaster recovery plan',
        ].map(item => (
          <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500/60" />
            {item}
          </li>
        ))}
      </ul>

      {/* Hover hint */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-widest text-gray-600">
        Hover right →
      </p>
    </div>
  )
}

// ── After panel ───────────────────────────────────────────────────────────────
function AfterPanel() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#0D0616] px-8 text-center">
      {/* Violet grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#7c3aed12_1px,transparent_1px),linear-gradient(to_bottom,#7c3aed12_1px,transparent_1px)] bg-[size:48px_48px]" />
      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[120px]" />

      {/* Label */}
      <span className="relative mb-6 rounded-full border border-violet-500/40 bg-violet-500/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-violet-300">
        With WeThink
      </span>

      {/* Modern dashboard mockup */}
      <div className="relative mb-8 w-full max-w-sm rounded-xl border border-violet-500/30 bg-[#13082a] shadow-[0_0_60px_rgba(124,58,237,0.25)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 rounded-t-xl border-b border-violet-500/20 bg-[#0d0619] px-4 py-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-violet-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-violet-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-violet-300/60" />
          <div className="mx-2 flex-1 rounded bg-violet-500/10 px-3 py-0.5 text-[9px] text-violet-400/70">
            dashboard.wethink.ae
          </div>
        </div>
        {/* Dashboard body */}
        <div className="p-4">
          <div className="mb-3 grid grid-cols-3 gap-2">
            {['99.9%', '2 hr', '100%'].map((v, i) => (
              <div key={i} className="rounded-lg bg-violet-500/10 p-2 text-center">
                <p className="text-sm font-black text-violet-300">{v}</p>
              </div>
            ))}
          </div>
          {/* Fake chart bars */}
          <div className="flex items-end gap-1 rounded-lg bg-white/[0.03] p-3" style={{ height: 56 }}>
            {[40, 55, 45, 70, 60, 80, 75, 90, 85, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-violet-700 to-violet-400"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <p className="text-[9px] text-emerald-400">All systems operational</p>
          </div>
        </div>
      </div>

      {/* Success stats */}
      <div className="grid w-full max-w-xs grid-cols-3 gap-3 text-center">
        {[
          { value: '2 hr', label: 'SLA Response' },
          { value: '99.9%', label: 'Uptime SLA' },
          { value: 'Full', label: 'Cloud Native' },
        ].map(s => (
          <div key={s.label} className="rounded-lg border border-violet-500/25 bg-violet-500/10 p-3">
            <p className="text-lg font-black text-violet-300">{s.value}</p>
            <p className="mt-0.5 text-[9px] leading-tight text-violet-300/60">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <ul className="mt-6 space-y-2 text-left">
        {[
          '24×7 NOC & SOC monitoring',
          'ISO 27001 + UAE Gov compliant',
          'Multi-cloud infrastructure',
          'Automated disaster recovery',
        ].map(item => (
          <li key={item} className="flex items-center gap-2 text-xs text-violet-300/70">
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-400" />
            {item}
          </li>
        ))}
      </ul>

      {/* Hover hint */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-widest text-violet-600/60">
        ← Hover left
      </p>
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
export default function TransformationSplit() {
  return (
    <section id="transformation" className="w-full overflow-hidden">
      <Component leftComponent={<BeforePanel />} rightComponent={<AfterPanel />} />
    </section>
  )
}
