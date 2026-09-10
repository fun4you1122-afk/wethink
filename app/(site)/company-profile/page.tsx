import type { Metadata } from 'next'
import Link from 'next/link'
import './profile.css'
import {
  AnalyticsMockup, AutomationMockup, PlatformMockup, RoadmapMockup, EventMockup, ReportMockup,
  CrmMockup, ErpMockup,
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

function Lockup({ dark = false }: { dark?: boolean }) {
  return (
    <div className="cp-lockup">
      <img src="/wethink-logo.png" alt="" width={104} height={104} />
      <div>
        <div className="n">WeThink</div>
        <div className="t">Think &middot; Plan &middot; Grow</div>
      </div>
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="cp-eyebrow">{children}</span>
}

/** A ruled section head: the eyebrow, then the serif line under it. */
function Head({ label, title }: { label: string; title: React.ReactNode }) {
  return (
    <div>
      <Eyebrow>{label}</Eyebrow>
      <h2 className="mt-4 text-[34px] leading-[1.04] md:text-[46px]">{title}</h2>
    </div>
  )
}

export default function CompanyProfilePage() {
  return (
    <div className="cp pt-24">
      <div className="cp-ground" aria-hidden="true" />
      <div className="cp-gradbar" aria-hidden="true" />

      {/* ── cover ── */}
      <section className="px-6 pb-20 pt-10 md:pb-28 md:pt-16">
        <div className="mx-auto max-w-7xl">
          <Lockup />

          <div className="mt-14">
            <Eyebrow>Company Profile</Eyebrow>
            <h1 className="mt-5 max-w-[16ch] text-[46px] leading-[0.99] md:text-[86px]">
              Building smarter, more efficient businesses
            </h1>
          </div>

          <div className="cp-creds mt-12">
            <p className="a">
              We work with government entities, embassies and private organizations
              across the United Arab Emirates.
            </p>
            <p className="b">
              Official events, national programmes and the systems behind them &mdash;
              delivered to institutional standards of accuracy, presentation and
              confidentiality.
            </p>
          </div>

          {/* The slogan sits here rather than beside the buttons: at desktop
              widths the floating chat buttons hover over the right end of
              that row. */}
          <p className="cp-serif mt-8 text-[24px]" style={{ color: 'var(--cp-violet)' }}>
            {CLOSING.title}
          </p>

          <div className="cp-rule mt-10 pt-8">
            <div className="flex flex-wrap gap-3">
              <Link href="#services" className="cp-btn cp-btn-solid">What we do</Link>
              {/* ?download=1 forces the save. Without it, in-app browsers show
                  the PDF with no way to keep it. */}
              <a href="/WeThink-Company-Profile.pdf?download=1" className="cp-btn cp-btn-ghost">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 19h16"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
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

      {/* ── about & purpose ── */}
      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
          <div>
            <Eyebrow>About us</Eyebrow>
            <p className="cp-serif mt-5 text-[28px] leading-[1.16] md:text-[34px]">{ABOUT.pull}</p>
            <p className="cp-lead mt-5 text-[16px]">{ABOUT.lead}</p>
            <div className="mt-8 flex flex-col gap-4">
              {ABOUT.halves.map((h) => (
                <div key={h.k} className="cp-card">
                  <div className="text-[15px] font-bold">{h.k}</div>
                  <p className="cp-lead mt-2 text-[14.5px]">{h.v}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Eyebrow>Our purpose</Eyebrow>
            <p className="cp-serif mt-5 text-[28px] leading-[1.16] md:text-[34px]">{PURPOSE.pull}</p>
            <p className="cp-lead mt-5 text-[16px]">{PURPOSE.body}</p>
            <div className="mt-10"><AnalyticsMockup /></div>
          </div>
        </div>
      </section>

      {/* ── what the solutions support ── */}
      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>Our solutions are designed to support</Eyebrow>
          <ul className="mt-10 grid list-none gap-x-14 gap-y-0 p-0 md:grid-cols-2">
            {SUPPORTS.map((s, i) => (
              <li key={s} className="cp-row mt-5 first:mt-0 md:mt-5">
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[18px] font-semibold leading-snug">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── vision, mission, values ── */}
      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-2">
            {[['Vision', VISION], ['Mission', MISSION]].map(([k, v]) => (
              <div key={k}>
                <Eyebrow>{k}</Eyebrow>
                <p className="mt-5 text-[19px] leading-[1.55]">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-14">
            <Eyebrow>Values</Eyebrow>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {VALUES.map((v) => <span key={v} className="cp-chip">{v}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* ── the five services, each with a screen ── */}
      <section id="services" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Head label="What we do" title="Five lines of work" />

          <div className="mt-16 flex flex-col gap-24">
            {SERVICES.map((s, i) => {
              const Mockup = MOCKUPS[s.mockup]
              const flip = i % 2 === 1
              return (
                <div key={s.n} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                  <div className={flip ? 'lg:order-2' : ''}>
                    <div className="cp-row">
                      <span className="n">{s.n}</span>
                      <h3 className="text-[26px] leading-tight md:text-[31px]">{s.title}</h3>
                    </div>
                    <p className="cp-lead mt-5 text-[16px]">{s.proposition}</p>

                    {s.approach && (
                      <ol className="mt-6 flex list-none flex-col gap-3 p-0">
                        {s.approach.map((a, ai) => (
                          <li key={a} className="flex items-start gap-3">
                            <span className="cp-serif mt-[2px] shrink-0 text-[17px]"
                              style={{ color: 'var(--cp-violet)' }}>{String(ai + 1).padStart(2, '0')}</span>
                            <span className="text-[15px] leading-snug">{a}</span>
                          </li>
                        ))}
                      </ol>
                    )}

                    <p className="cp-eyebrow mt-8 block">{s.listLabel}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {s.list.map((c) => <span key={c} className="cp-chip">{c}</span>)}
                    </div>

                    {s.outcome && (
                      <div className="cp-outcome mt-8">
                        <span className="cp-eyebrow">Outcome</span>
                        <p className="mt-2 text-[15px] leading-snug">{s.outcome}</p>
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

      {/* ── the systems clients ask for by name ── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Head label="Systems we build" title="The two clients ask for by name, built to fit how they already work." />
          <div className="mt-14 grid gap-12 lg:grid-cols-2">
            <div>
              <CrmMockup />
              <p className="cp-lead mt-5 text-[15px]">
                Pipeline, activity and follow-ups in one place, so nothing waits on a memory.
              </p>
            </div>
            <div>
              <ErpMockup />
              <p className="cp-lead mt-5 text-[15px]">
                Finance, procurement, inventory and assets on one ledger, closing in days rather than weeks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── why ── */}
      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>Why WeThink</Eyebrow>
          <div className="mt-10 grid gap-x-14 gap-y-0 md:grid-cols-2 lg:grid-cols-3">
            {WHY.map(([k, v], i) => (
              <div key={k} className="cp-row mt-5 flex-col !items-start gap-3 lg:mt-5">
                <span className="cp-serif text-[24px] leading-none" style={{ color: 'var(--cp-violet)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="text-[17px] font-bold leading-tight">{k}</div>
                  <p className="cp-lead mt-2 text-[14.5px]">{v}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-12 text-[16px] font-semibold">{WHY_NOTE}</p>
        </div>
      </section>

      {/* ── how we work ── */}
      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Head label="How we work" title="Six steps, start to running" />
          <ol className="mt-14 grid list-none gap-x-14 gap-y-0 p-0 md:grid-cols-2 lg:grid-cols-3">
            {HOW.map(([k, v], i) => (
              <li key={k} className="cp-row mt-5 flex-col !items-start gap-3 lg:mt-5">
                <span className="cp-serif text-[24px] leading-none" style={{ color: 'var(--cp-violet)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="text-[17px] font-bold leading-tight">{k}</div>
                  <p className="cp-lead mt-2 text-[14.5px]">{v}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── core areas ── */}
      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Eyebrow>Our core areas</Eyebrow>
            <p className="cp-serif mt-5 text-[26px] leading-[1.18] md:text-[32px]">{CORE_NOTE}</p>
          </div>
          <div className="flex flex-col">
            {CORE.map(([k, v], i) => (
              <div key={k} className="cp-row mt-5 first:mt-0">
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div className="text-[17px] font-bold">{k}</div>
                  <p className="cp-lead mt-1 text-[14.5px]">{v}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── closing ── */}
      <section className="cp-dark px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <Lockup dark />
          <h2 className="mt-12 text-[42px] leading-[1.02] md:text-[66px]">{CLOSING.title}</h2>
          <p className="cp-lead mt-5 text-[19px]">{CLOSING.sub}</p>

          <div className="mt-12 flex flex-wrap gap-3">
            <a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer"
              className="cp-btn" style={{ background: '#FBFAF7', color: '#14121C' }}>
              WhatsApp {COMPANY.phone}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="cp-btn"
              style={{ border: '1px solid rgba(251,250,247,0.32)', color: '#FBFAF7' }}>
              {COMPANY.email}
            </a>
            <a href="/WeThink-Company-Profile.pdf?download=1" className="cp-btn"
              style={{ border: '1px solid rgba(251,250,247,0.32)', color: '#FBFAF7' }}>
              Download the PDF
            </a>
          </div>

          <p className="mt-12 text-[14px]" style={{ color: 'rgba(251,250,247,0.55)' }}>
            {COMPANY.legal} &middot; {COMPANY.base} &middot; {COMPANY.site}
          </p>
        </div>
      </section>
    </div>
  )
}
