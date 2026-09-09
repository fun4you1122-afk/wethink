import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AnalyticsMockup, AutomationMockup, PlatformMockup, RoadmapMockup, EventMockup, ReportMockup,
} from '@/components/profile/Mockups'
import {
  ABOUT, CLOSING, COMPANY, CORE, CORE_NOTE, HOW, MISSION, PURPOSE,
  SERVICES, SUPPORTS, VALUES, VISION, WHY, WHY_NOTE,
} from './profile-data'

export const metadata: Metadata = {
  title: 'Company Profile | WeThink',
  description:
    'WeThink is an Abu Dhabi-based technology and business solutions company. We help organizations simplify operations, reduce manual work, control costs and make better decisions.',
  alternates: { canonical: '/company-profile' },
  openGraph: {
    title: 'Company Profile | WeThink',
    description: 'Building smarter, more efficient businesses. Abu Dhabi, UAE.',
    url: '/company-profile',
  },
}

const MOCKUPS = {
  automation: AutomationMockup,
  analytics: ReportMockup,
  platform: PlatformMockup,
  roadmap: RoadmapMockup,
  event: EventMockup,
} as const

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="section-label">{children}</span>
}

export default function CompanyProfilePage() {
  return (
    <div className="pt-24">
      {/* ── cover ── */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--surface-2)' }} />
        <div className="orb pointer-events-none right-[-220px] top-[-120px] h-[560px] w-[560px] bg-violet-900 opacity-25" />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Eyebrow>Company Profile</Eyebrow>
            <h1 className="mt-4 text-4xl font-black leading-[1.05] md:text-6xl" style={{ color: 'var(--text)' }}>
              Building smarter,<br />
              <span className="gradient-text">more efficient businesses</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {ABOUT.lead}
            </p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--primary-dark)' }}>
              {COMPANY.legal} · {COMPANY.base}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#services"
                className="rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(109,40,217,0.28)]"
                style={{ background: 'var(--primary)' }}>
                What we do
              </Link>
              {/* ?download=1 forces the save. Without it, in-app browsers show
                  the PDF with no way to keep it. */}
              <a href="/WeThink-Company-Profile.pdf?download=1"
                className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-bold"
                style={{ borderColor: 'rgba(109,40,217,0.3)', color: 'var(--primary-dark)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 19h16"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download PDF
              </a>
              <a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer"
                className="rounded-full border px-7 py-3.5 text-sm font-bold"
                style={{ borderColor: 'rgba(109,40,217,0.3)', color: 'var(--primary-dark)' }}>
                Talk to us
              </a>
            </div>
          </div>

          <div className="relative"><AnalyticsMockup /></div>
        </div>
      </section>

      {/* ── about & purpose ── */}
      <section className="section-padding relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>About us</Eyebrow>
              <p className="mt-5 text-2xl font-black leading-snug md:text-3xl" style={{ color: 'var(--text)' }}>
                {ABOUT.pull}
              </p>
              <div className="mt-7 flex flex-col gap-5">
                {ABOUT.halves.map((h) => (
                  <div key={h.k} className="rounded-2xl border p-5"
                    style={{ borderColor: 'rgba(109,40,217,0.14)', background: 'var(--surface)' }}>
                    <div className="text-sm font-black" style={{ color: 'var(--primary-dark)' }}>{h.k}</div>
                    <p className="mt-1.5 text-[15px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{h.v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Eyebrow>Our purpose</Eyebrow>
              <p className="mt-5 text-2xl font-black leading-snug md:text-3xl" style={{ color: 'var(--text)' }}>
                {PURPOSE.pull}
              </p>
              <p className="mt-5 text-[15px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {PURPOSE.body}
              </p>

              <p className="mt-8 text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
                Our solutions are designed to support
              </p>
              <ul className="mt-4 grid list-none grid-cols-1 gap-x-6 gap-y-2.5 p-0 sm:grid-cols-2">
                {SUPPORTS.map((s, i) => (
                  <li key={s} className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-[11px] font-black tabular-nums" style={{ color: 'var(--primary)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[14.5px] leading-snug" style={{ color: 'var(--text)' }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── vision, mission, values ── */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--surface-2)' }} />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {[['Vision', VISION], ['Mission', MISSION]].map(([k, v]) => (
              <div key={k} className="rounded-3xl p-8"
                style={{ background: 'var(--surface)', boxShadow: '0 18px 44px rgba(76,29,149,0.08)' }}>
                <div className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: 'var(--primary)' }}>{k}</div>
                <p className="mt-4 text-lg leading-relaxed" style={{ color: 'var(--text)' }}>{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <div className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: 'var(--primary)' }}>Values</div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {VALUES.map((v) => (
                <span key={v} className="rounded-full border px-5 py-2.5 text-sm font-bold"
                  style={{ borderColor: 'rgba(109,40,217,0.22)', background: 'var(--surface)', color: 'var(--text)' }}>
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── the five services, each with a screen ── */}
      <section id="services" className="section-padding relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <Eyebrow>What we do</Eyebrow>
            <h2 className="mt-3 text-4xl font-black md:text-5xl" style={{ color: 'var(--text)' }}>
              Five lines of <span className="gradient-text">work</span>
            </h2>
          </div>

          <div className="mt-16 flex flex-col gap-20">
            {SERVICES.map((s, i) => {
              const Mockup = MOCKUPS[s.mockup]
              const flip = i % 2 === 1
              return (
                <div key={s.n} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                  <div className={flip ? 'lg:order-2' : ''}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black tabular-nums" style={{ color: 'rgba(109,40,217,0.28)' }}>{s.n}</span>
                      <h3 className="text-2xl font-black leading-tight md:text-3xl" style={{ color: 'var(--text)' }}>
                        {s.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-[15.5px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {s.proposition}
                    </p>

                    {s.approach && (
                      <ol className="mt-5 flex list-none flex-col gap-2 p-0">
                        {s.approach.map((a, ai) => (
                          <li key={a} className="flex items-start gap-2.5">
                            <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                              style={{ background: 'var(--primary)' }}>{ai + 1}</span>
                            <span className="text-[14.5px] leading-snug" style={{ color: 'var(--text)' }}>{a}</span>
                          </li>
                        ))}
                      </ol>
                    )}

                    <p className="mt-6 text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
                      {s.listLabel}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.list.map((c) => (
                        <span key={c} className="rounded-lg px-3 py-1.5 text-[12.5px] font-semibold"
                          style={{ background: 'rgba(243,232,255,0.75)', color: 'var(--text)' }}>
                          {c}
                        </span>
                      ))}
                    </div>

                    {s.outcome && (
                      <div className="mt-6 rounded-2xl border-l-[3px] py-2 pl-4"
                        style={{ borderColor: 'var(--primary)' }}>
                        <span className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: 'var(--primary)' }}>
                          Outcome
                        </span>
                        <p className="mt-1 text-[14.5px] leading-snug" style={{ color: 'var(--text)' }}>{s.outcome}</p>
                      </div>
                    )}
                  </div>

                  <div className={flip ? 'lg:order-1' : ''}><Mockup /></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── why ── */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--surface-2)' }} />
        <div className="relative mx-auto max-w-7xl px-6">
          <Eyebrow>Why WeThink</Eyebrow>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WHY.map(([k, v], i) => (
              <div key={k} className="rounded-2xl p-6" style={{ background: 'var(--surface)' }}>
                <span className="text-[11px] font-black tabular-nums" style={{ color: 'var(--primary)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="mt-2 text-[16px] font-black leading-tight" style={{ color: 'var(--text)' }}>{k}</div>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[15px] font-semibold" style={{ color: 'var(--text)' }}>{WHY_NOTE}</p>
        </div>
      </section>

      {/* ── how we work ── */}
      <section className="section-padding relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <Eyebrow>How we work</Eyebrow>
            <h2 className="mt-3 text-4xl font-black md:text-5xl" style={{ color: 'var(--text)' }}>
              Six steps, <span className="gradient-text">start to running</span>
            </h2>
          </div>
          <ol className="mt-14 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
            {HOW.map(([k, v], i) => (
              <li key={k} className="relative rounded-2xl border p-6"
                style={{ borderColor: 'rgba(109,40,217,0.14)', background: 'var(--surface)' }}>
                <span className="absolute right-5 top-4 text-4xl font-black tabular-nums"
                  style={{ color: 'rgba(109,40,217,0.09)' }}>{String(i + 1).padStart(2, '0')}</span>
                <div className="text-[17px] font-black" style={{ color: 'var(--text)' }}>{k}</div>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── core areas ── */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--surface-2)' }} />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow>Our core areas</Eyebrow>
              <p className="mt-5 text-xl font-black leading-snug md:text-2xl" style={{ color: 'var(--text)' }}>
                {CORE_NOTE}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {CORE.map(([k, v], i) => (
                <div key={k} className="flex items-start gap-4 rounded-2xl px-5 py-4" style={{ background: 'var(--surface)' }}>
                  <span className="text-sm font-black tabular-nums" style={{ color: 'var(--primary)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="text-[15.5px] font-black" style={{ color: 'var(--text)' }}>{k}</div>
                    <p className="mt-0.5 text-[14px]" style={{ color: 'var(--text-muted)' }}>{v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── closing ── */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(150deg,#1F1147,#3B1D77 55%,#4E11BB)' }} />
        <div className="orb pointer-events-none left-[-160px] bottom-[-160px] h-[440px] w-[440px] bg-fuchsia-700 opacity-30" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">{CLOSING.title}</h2>
          <p className="mt-4 text-lg" style={{ color: 'rgba(255,255,255,0.72)' }}>{CLOSING.sub}</p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer"
              className="rounded-full bg-white px-8 py-4 text-sm font-black" style={{ color: '#3B1D77' }}>
              WhatsApp {COMPANY.phone}
            </a>
            <a href={`mailto:${COMPANY.email}`}
              className="rounded-full border px-8 py-4 text-sm font-black text-white"
              style={{ borderColor: 'rgba(255,255,255,0.35)' }}>
              {COMPANY.email}
            </a>
          </div>

          <p className="mt-8 text-[13px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {COMPANY.legal} · {COMPANY.base} · {COMPANY.site}
          </p>
        </div>
      </section>
    </div>
  )
}
