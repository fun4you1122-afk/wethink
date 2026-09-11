import type { Metadata } from 'next'
import Link from 'next/link'
import './profile.css'
import Rings from './rings'
import {
  AnalyticsMockup, AutomationMockup, PlatformMockup, RoadmapMockup, EventMockup, ReportMockup,
  CrmMockup, ErpMockup,
} from '@/components/profile/Mockups'
import { CapIcon, iconFor } from '@/components/profile/icons'
import {
  ABOUT, CLOSING, COMPANY, CORE, CORE_NOTE, HOW, MISSION, PROFILE_PDF, PURPOSE,
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

function Lockup() {
  return (
    <div className="cp-lockup">
      <img src="/wethink-logo.png" alt="" width={92} height={92} />
      <div>
        <div className="n">WeThink</div>
        <div className="t">Think &middot; Plan &middot; Grow</div>
      </div>
    </div>
  )
}

/** A numbered, ruled row: the deck's list unit. */
function Row({ n, k, v }: { n?: number; k: string; v?: string }) {
  return (
    <div className="cp-row">
      <span className="n">{n === undefined ? '' : String(n).padStart(2, '0')}</span>
      <span className="i"><CapIcon name={iconFor(k)} /></span>
      <span>
        <span className="k">{k}</span>
        {v && <span className="v">{v}</span>}
      </span>
    </div>
  )
}

/** A section head: the small label on the right, the large line on the left. */
function Head({ label, title, note }: { label: string; title: string; note?: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
      <div>
        <h2>{title}</h2>
        {note && <p className="lead mt-6 max-w-xl text-[17px]">{note}</p>}
      </div>
      <div className="cp-tag">{label}</div>
    </div>
  )
}

export default function CompanyProfilePage() {
  return (
    <div className="cp">
      <div className="cp-glow" aria-hidden="true" />

      {/* ── cover ── */}
      <section className="px-6 pb-24 pt-10 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-end">
            <span className="cp-tag">Company profile</span>
          </div>

          <div className="relative mt-10 grid items-center gap-10 lg:mt-14 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h1 className="max-w-[13ch]">Building smarter, more efficient businesses</h1>
              <p className="lead mt-10 max-w-2xl text-[19px] md:text-[21px]">
                We work with government entities, embassies and private organizations
                across the United Arab Emirates.
              </p>
              <p className="dim mt-5 max-w-2xl">
                Official events, national programmes and the systems behind them,
                delivered to institutional standards of accuracy, presentation and
                confidentiality.
              </p>
            </div>
            <Rings className="pointer-events-none mx-auto w-full max-w-[560px] opacity-90" />
          </div>

          <div className="mt-16 border-t pt-8" style={{ borderColor: 'var(--rule)' }}>
            <div className="flex flex-wrap items-center justify-between gap-8">
              <div className="flex flex-wrap gap-x-10 gap-y-3 text-[15px]" style={{ fontWeight: 400 }}>
                <span>{COMPANY.phone}</span>
                <span>{COMPANY.email}</span>
                <span>{COMPANY.site}</span>
                <span>@wethink.ae</span>
              </div>
              <span className="cp-slogan">{CLOSING.title}</span>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="#services" className="cp-btn cp-btn-solid">What we do</Link>
              <a href={PROFILE_PDF} className="cp-btn cp-btn-ghost">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 19h16"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download the PDF
              </a>
              <a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer" className="cp-btn cp-btn-ghost">
                Talk to us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── about ── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Head label="About us" title={ABOUT.pull} note={ABOUT.lead} />
          <div className="cp-list mt-14">
            {ABOUT.halves.map((h, i) => <Row key={h.k} n={i + 1} k={h.k} v={h.v} />)}
          </div>
        </div>
      </section>

      {/* ── purpose ── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Head label="Our purpose" title={PURPOSE.pull} note={PURPOSE.body} />
          <div className="cp-screen mt-14"><AnalyticsMockup /></div>
        </div>
      </section>

      {/* ── what we improve ── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Head label="Our solutions" title="What we improve"
            note="Our solutions are designed to support" />
          <div className="cp-list mt-14">
            {SUPPORTS.map((s, i) => <Row key={s} n={i + 1} k={s} />)}
          </div>
        </div>
      </section>

      {/* ── vision, mission, values ── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Head label="Vision, mission and values" title="What we are aiming at" />
          <div className="mt-14 grid gap-12 lg:grid-cols-2">
            {[['Vision', VISION], ['Mission', MISSION]].map(([k, v]) => (
              <div key={k} className="border-t pt-6" style={{ borderColor: 'var(--rule)' }}>
                <div className="text-[13px]" style={{ color: 'var(--accent)' }}>{k}</div>
                <p className="lead mt-4 text-[18px]">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 border-t pt-8" style={{ borderColor: 'var(--rule)' }}>
            <div className="text-[13px]" style={{ color: 'var(--accent)' }}>Values</div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {VALUES.map((v) => <span key={v} className="cp-chip">{v}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* ── five lines of work ── */}
      <section id="services" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Head label="What we do" title="Five lines of work" />
          <div className="cp-list mt-14">
            {SERVICES.map((s, i) => <Row key={s.n} n={i + 1} k={s.title} v={s.summary} />)}
          </div>
        </div>
      </section>

      {/* ── a section per service ── */}
      {SERVICES.map((s, i) => {
        const Mockup = MOCKUPS[s.mockup]
        const flip = i % 2 === 1
        return (
          <section key={s.n} className="px-6 py-20 md:py-28">
            <div className="mx-auto max-w-7xl">
              <Head label={`Service ${s.n}`} title={s.title} note={s.proposition} />

              <div className="mt-14 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
                <div className={flip ? 'lg:order-2' : ''}>
                  <div className="cp-caps">
                    {s.list.map((c) => (
                      <div key={c} className="cp-cap">
                        <span className="i"><CapIcon name={iconFor(c)} /></span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                  {s.approach && (
                    <ol className="mt-8 flex list-none flex-col gap-3 p-0">
                      {s.approach.map((a, ai) => (
                        <li key={a} className="flex items-start gap-4">
                          <span className="mt-[3px] text-[12px]" style={{ color: 'var(--dim)' }}>
                            {String(ai + 1).padStart(2, '0')}
                          </span>
                          <span className="text-[15px]" style={{ fontWeight: 400 }}>{a}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                  {s.outcome && (
                    <div className="cp-outcome mt-10">
                      <div className="k">Outcome</div>
                      <div className="v">{s.outcome}</div>
                    </div>
                  )}
                </div>

                <div className={flip ? 'lg:order-1' : ''}>
                  <div className="cp-screen"><Mockup /></div>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* ── the systems clients ask for by name ── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Head label="Systems we build" title="CRM and ERP"
            note="The two clients ask for by name, built to fit how they already work." />
          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <div className="cp-screen"><CrmMockup /></div>
            <div className="cp-screen"><ErpMockup /></div>
          </div>
        </div>
      </section>

      {/* ── why ── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Head label="Why WeThink" title="How we are different" />
          <div className="cp-list mt-14">
            {WHY.map(([k, v], i) => <Row key={k} n={i + 1} k={k} v={v} />)}
          </div>
          <p className="lead mt-10 text-[17px]">{WHY_NOTE}</p>
        </div>
      </section>

      {/* ── how we work ── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Head label="How we work" title="Six steps, start to running" />
          <div className="cp-list mt-14">
            {HOW.map(([k, v], i) => <Row key={k} n={i + 1} k={k} v={v} />)}
          </div>
        </div>
      </section>

      {/* ── core areas ── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Head label="Our core areas" title="Five areas, one operating model" note={CORE_NOTE} />
          <div className="cp-list mt-14">
            {CORE.map(([k, v], i) => <Row key={k} n={i + 1} k={k} v={v} />)}
          </div>
        </div>
      </section>

      {/* ── closing ── */}
      <section className="px-6 pb-28 pt-20 md:pb-36 md:pt-28">
        <div className="relative mx-auto max-w-7xl">
          <Rings className="pointer-events-none absolute left-1/2 top-1/2 w-[720px] max-w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-50" />
          <div className="relative flex flex-col items-center text-center">
            <Lockup />
            <h2 className="mt-12 max-w-[18ch]">{CLOSING.title}</h2>
            <p className="lead mt-6 text-[18px]">{CLOSING.sub}</p>

            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer" className="cp-btn cp-btn-solid">
                WhatsApp {COMPANY.phone}
              </a>
              <a href={`mailto:${COMPANY.email}`} className="cp-btn cp-btn-ghost">{COMPANY.email}</a>
              <a href={PROFILE_PDF} className="cp-btn cp-btn-ghost">
                Download the PDF
              </a>
            </div>

            <p className="dim mt-12 text-[13px]">
              {COMPANY.legal} &middot; {COMPANY.base} &middot; {COMPANY.site}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
