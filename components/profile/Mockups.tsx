/**
 * Illustrative product screens for the company profile.
 *
 * Every one of these is drawn here rather than screenshotted: they stand for
 * the kind of thing we build, so they are deliberately generic, and drawing
 * them keeps the page sharp at any size and free of anyone else's interface.
 *
 * The chart palette is validated for colour-vision deficiency: adjacent pairs
 * clear the CVD separation floor, and because two of the hues sit below 3:1
 * against the surface, every mark carries a visible label rather than relying
 * on colour alone.
 */

const INK = 'var(--text)'
const MUTED = 'var(--text-muted)'

export const SERIES = {
  violet: '#6D28D9',
  sky: '#0EA5E9',
  green: '#0E9F6E',
  amber: '#F59E0B',
}

function Frame({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border ${className}`}
      style={{
        borderColor: 'rgba(109,40,217,0.14)',
        background: 'var(--surface)',
        boxShadow: '0 24px 60px rgba(76,29,149,0.10), 0 2px 8px rgba(76,29,149,0.05)',
      }}
    >
      <div
        className="flex items-center gap-2 border-b px-4 py-2.5"
        style={{ borderColor: 'rgba(109,40,217,0.10)', background: 'rgba(243,232,255,0.5)' }}
      >
        <span className="flex gap-1.5" aria-hidden="true">
          {['#F87171', '#FBBF24', '#34D399'].map((c) => (
            <span key={c} className="h-2 w-2 rounded-full" style={{ background: c, opacity: 0.65 }} />
          ))}
        </span>
        <span className="text-[11px] font-semibold tracking-wide" style={{ color: MUTED }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

/* ── Data analytics: a management dashboard ───────────────── */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const THROUGHPUT = [58, 66, 61, 78, 84, 92]
const MANUAL = [44, 39, 33, 26, 20, 14]

export function AnalyticsMockup() {
  const w = 520
  const h = 132
  const pad = { l: 26, r: 10, t: 10, b: 20 }
  const x = (i: number) => pad.l + (i * (w - pad.l - pad.r)) / (MONTHS.length - 1)
  const y = (v: number) => pad.t + (1 - v / 100) * (h - pad.t - pad.b)
  const line = (d: number[]) => d.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ')

  return (
    <Frame title="Operations dashboard">
      <div className="p-4 sm:p-5">
        {/* stat tiles: a headline number needs no plot */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { k: 'Throughput', v: '+34%', c: SERIES.violet },
            { k: 'Manual steps', v: '−68%', c: SERIES.green },
            { k: 'Time to report', v: '4h to 9m', c: SERIES.sky },
          ].map((t) => (
            <div
              key={t.k}
              className="rounded-xl px-3 py-2.5"
              style={{ background: 'rgba(243,232,255,0.55)' }}
            >
              <div className="text-[9.5px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
                {t.k}
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: t.c }} aria-hidden="true" />
                <span className="text-[17px] font-black leading-none" style={{ color: INK }}>
                  {t.v}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* two series, so a legend is present and both are direct-labelled */}
        <div className="mt-4 flex items-center gap-4">
          {[
            { k: 'Throughput', c: SERIES.violet },
            { k: 'Manual steps', c: SERIES.amber },
          ].map((s) => (
            <span key={s.k} className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: MUTED }}>
              <span className="h-1.5 w-4 rounded-full" style={{ background: s.c }} aria-hidden="true" />
              {s.k}
            </span>
          ))}
        </div>

        <svg viewBox={`0 0 ${w} ${h}`} className="mt-1.5 w-full" role="img"
          aria-label="Throughput rising and manual steps falling across six months">
          {[0, 50, 100].map((v) => (
            <g key={v}>
              <line x1={pad.l} x2={w - pad.r} y1={y(v)} y2={y(v)} stroke="rgba(109,40,217,0.10)" strokeWidth="1" />
              <text x={pad.l - 6} y={y(v) + 3} textAnchor="end" fontSize="8" fill={MUTED}>{v}</text>
            </g>
          ))}
          <path d={line(THROUGHPUT)} fill="none" stroke={SERIES.violet} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
          <path d={line(MANUAL)} fill="none" stroke={SERIES.amber} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
          {[THROUGHPUT, MANUAL].map((d, si) => (
            <circle key={si} cx={x(d.length - 1)} cy={y(d[d.length - 1])} r="4"
              fill={si ? SERIES.amber : SERIES.violet} stroke="var(--surface)" strokeWidth="2" />
          ))}
          {/* label the end of each series rather than every point */}
          <text x={x(5) - 4} y={y(THROUGHPUT[5]) - 8} textAnchor="end" fontSize="9" fontWeight="700" fill={INK}>92</text>
          <text x={x(5) - 4} y={y(MANUAL[5]) + 14} textAnchor="end" fontSize="9" fontWeight="700" fill={INK}>14</text>
          {MONTHS.map((m, i) => (
            <text key={m} x={x(i)} y={h - 6} textAnchor="middle" fontSize="8" fill={MUTED}>{m}</text>
          ))}
        </svg>
      </div>
    </Frame>
  )
}

/* ── Digital transformation: a workflow with an AI step ───── */

export function AutomationMockup() {
  const steps = [
    { k: 'Request', d: 'Email · form · portal' },
    { k: 'AI triage', d: 'Classify · extract · route' },
    { k: 'Rules', d: 'Approvals · thresholds' },
    { k: 'Systems', d: 'ERP · CRM · finance' },
  ]
  return (
    <Frame title="Automated request handling">
      <div className="p-4 sm:p-5">
        <ol className="flex list-none flex-col gap-2.5 p-0">
          {steps.map((s, i) => (
            <li key={s.k} className="relative flex items-center gap-3">
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-black"
                style={{
                  background: i === 1 ? SERIES.violet : 'rgba(243,232,255,0.9)',
                  color: i === 1 ? '#fff' : SERIES.violet,
                  boxShadow: i === 1 ? '0 6px 18px rgba(109,40,217,0.32)' : 'none',
                }}>
                {String(i + 1).padStart(2, '0')}
                {i < steps.length - 1 && (
                  <span aria-hidden="true" className="absolute left-1/2 top-full h-2.5 w-px -translate-x-1/2"
                    style={{ background: 'rgba(109,40,217,0.28)' }} />
                )}
              </span>
              <span className="min-w-0 flex-1 rounded-xl px-3 py-2"
                style={{ background: i === 1 ? 'rgba(109,40,217,0.07)' : 'rgba(243,232,255,0.45)' }}>
                <span className="block text-[12px] font-bold leading-tight" style={{ color: INK }}>{s.k}</span>
                <span className="block text-[10.5px] leading-tight" style={{ color: MUTED }}>{s.d}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-3 flex items-center justify-between rounded-xl px-3 py-2"
          style={{ background: 'rgba(14,159,110,0.10)' }}>
          <span className="text-[11px] font-bold" style={{ color: INK }}>Resolved without manual handling</span>
          <span className="text-[13px] font-black" style={{ color: SERIES.green }}>82%</span>
        </div>
      </div>
    </Frame>
  )
}

/* ── Business systems: a portal and its admin view ────────── */

export function PlatformMockup() {
  return (
    <Frame title="Service portal">
      <div className="p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[1.25fr_1fr]">
          <div className="rounded-xl p-3" style={{ background: 'rgba(243,232,255,0.5)' }}>
            <div className="h-2 w-20 rounded-full" style={{ background: 'rgba(109,40,217,0.35)' }} />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {['New request', 'My cases', 'Documents', 'Approvals'].map((t) => (
                <div key={t} className="rounded-lg px-2.5 py-2" style={{ background: 'var(--surface)' }}>
                  <div className="h-1.5 w-6 rounded-full" style={{ background: SERIES.violet, opacity: 0.5 }} />
                  <div className="mt-1.5 text-[10px] font-semibold" style={{ color: INK }}>{t}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg px-2.5 py-2" style={{ background: 'var(--surface)' }}>
              <div className="text-[9.5px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
                Open case
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: SERIES.sky }} aria-hidden="true" />
                <span className="text-[10.5px] font-semibold" style={{ color: INK }}>In review · 2 of 4 steps</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'rgba(109,40,217,0.12)' }}>
                <div className="h-full rounded-full" style={{ width: '50%', background: SERIES.sky }} />
              </div>
            </div>
          </div>

          <div className="rounded-xl p-3" style={{ background: 'rgba(243,232,255,0.5)' }}>
            <div className="text-[9.5px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
              Queue
            </div>
            <ul className="mt-2 flex list-none flex-col gap-1.5 p-0">
              {[
                ['Licence renewal', SERIES.green, 'Done'],
                ['Vendor onboarding', SERIES.sky, 'Active'],
                ['Budget approval', SERIES.amber, 'Waiting'],
                ['Site access', SERIES.violet, 'New'],
              ].map(([t, c, s]) => (
                <li key={t as string} className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                  style={{ background: 'var(--surface)' }}>
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c as string }} aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-[10px] font-semibold" style={{ color: INK }}>{t as string}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: MUTED }}>{s as string}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Frame>
  )
}

/* ── Strategy: a phased roadmap ───────────────────────────── */

export function RoadmapMockup() {
  const rows = [
    { k: 'Assess', s: 0, w: 26, c: SERIES.violet },
    { k: 'Define', s: 20, w: 28, c: SERIES.sky },
    { k: 'Design & build', s: 42, w: 36, c: SERIES.green },
    { k: 'Implement', s: 70, w: 24, c: SERIES.amber },
  ]
  return (
    <Frame title="Transformation roadmap">
      <div className="p-4 sm:p-5">
        <div className="flex justify-between text-[9px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
          {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => <span key={q}>{q}</span>)}
        </div>
        <div className="mt-2 flex flex-col gap-2.5">
          {rows.map((r) => (
            <div key={r.k} className="flex items-center gap-3">
              <span className="w-[86px] shrink-0 text-[10.5px] font-bold" style={{ color: INK }}>{r.k}</span>
              <span className="relative h-5 flex-1 overflow-hidden rounded-full"
                style={{ background: 'rgba(109,40,217,0.08)' }}>
                <span className="absolute inset-y-0 flex items-center rounded-full px-2 text-[9px] font-bold text-white"
                  style={{ left: `${r.s}%`, width: `${r.w}%`, background: r.c }}>
                  {r.w}%
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  )
}

/* ── Brand, events and media: a digital invitation ────────── */

const QR_ROWS = [
  '1111111010101111111', '1000001011001000001', '1011101000101011101',
  '1011101011101011101', '1011101001001011101', '1000001010101000001',
  '1111111010101111111', '0000000011000000000', '1101101101011010110',
  '0100010001110101001', '1110110110001011101', '0001001010110100010',
  '1111111011010110110', '1000001001100101001', '1011101010111011101',
  '1011101101001010010', '1011101011101101101', '1000001000110010100',
  '1111111011011011011',
]

export function EventMockup() {
  return (
    <Frame title="Event invitation">
      <div className="flex items-center gap-4 p-4 sm:p-5">
        <div className="relative shrink-0 rounded-[18px] p-2"
          style={{ width: 118, background: 'linear-gradient(160deg,#1F1147,#3B1D77)' }}>
          <div className="rounded-[12px] px-3 py-3.5" style={{ background: 'rgba(255,255,255,0.96)' }}>
            <div className="mx-auto h-5 w-5 rounded-full" style={{ background: 'var(--logo-ramp)' }} />
            <div className="mt-2 text-center text-[8px] font-bold uppercase tracking-[0.14em]" style={{ color: MUTED }}>
              You are invited
            </div>
            <div className="mt-1 text-center text-[11px] font-black leading-tight" style={{ color: INK }}>
              Opening<br />Ceremony
            </div>
            <svg viewBox="0 0 19 19" className="mx-auto mt-2 h-12 w-12" role="img" aria-label="Entry code">
              {QR_ROWS.map((row, y) =>
                row.split('').map((c, x) =>
                  c === '1' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={INK} /> : null,
                ),
              )}
            </svg>
            <div className="mt-1.5 text-center text-[7px] font-semibold tracking-wide" style={{ color: MUTED }}>
              Scan at the door
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {[
            ['Invitations sent', '1,240'],
            ['Confirmed', '862'],
            ['Checked in', '798'],
          ].map(([k, v], i) => (
            <div key={k} className="flex items-center justify-between border-b py-2 last:border-b-0"
              style={{ borderColor: 'rgba(109,40,217,0.10)' }}>
              <span className="text-[10.5px] font-semibold" style={{ color: MUTED }}>{k}</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full"
                  style={{ background: [SERIES.violet, SERIES.sky, SERIES.green][i] }} aria-hidden="true" />
                <span className="text-[13px] font-black" style={{ color: INK }}>{v}</span>
              </span>
            </div>
          ))}
          <div className="mt-2.5 rounded-xl px-3 py-2" style={{ background: 'rgba(14,159,110,0.10)' }}>
            <span className="text-[10px] font-bold" style={{ color: INK }}>Live arrivals, no paper list</span>
          </div>
        </div>
      </div>
    </Frame>
  )
}

/* ── A KPI report: one series, so direct labels and no legend ─ */

const KPIS: [string, number, string][] = [
  ['Service requests closed on time', 94, '94%'],
  ['Reports produced automatically', 88, '88%'],
  ['Processes with a single owner', 76, '76%'],
  ['Data captured at source', 69, '69%'],
]

export function ReportMockup() {
  return (
    <Frame title="Quarterly KPI report">
      <div className="p-4 sm:p-5">
        <div className="text-[9.5px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
          Against target
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {KPIS.map(([k, v, label]) => (
            <div key={k}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[11.5px] font-semibold leading-tight" style={{ color: INK }}>{k}</span>
                <span className="text-[12px] font-black tabular-nums" style={{ color: INK }}>{label}</span>
              </div>
              {/* 4px rounded end, anchored to the baseline, one hue for magnitude */}
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full"
                style={{ background: 'rgba(109,40,217,0.10)' }}>
                <div className="h-full rounded-full"
                  style={{ width: `${v}%`, background: SERIES.violet }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl px-3 py-2"
          style={{ background: 'rgba(14,159,110,0.10)' }}>
          <span className="text-[11px] font-bold" style={{ color: INK }}>Reporting cycle</span>
          <span className="text-[12px] font-black" style={{ color: SERIES.green }}>Monthly to live</span>
        </div>
      </div>
    </Frame>
  )
}
