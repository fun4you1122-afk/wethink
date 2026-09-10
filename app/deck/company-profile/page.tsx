import './deck.css'
import {
  AnalyticsMockup, AutomationMockup, PlatformMockup, RoadmapMockup, EventMockup, ReportMockup,
  CrmMockup, ErpMockup,
} from '@/components/profile/Mockups'
import {
  ABOUT, CLOSING, COMPANY, CORE, CORE_NOTE, HOW, MISSION, PURPOSE,
  SERVICES, SUPPORTS, VALUES, VISION, WHY, WHY_NOTE,
} from '../../(site)/company-profile/profile-data'

const MOCKUPS = {
  automation: AutomationMockup,
  analytics: ReportMockup,
  platform: PlatformMockup,
  roadmap: RoadmapMockup,
  event: EventMockup,
} as const

const INK = '#14121C'
const MUTED = '#55506A'
const VIOLET = '#6D28D9'
const SLIDES = 16

/** The company signature: the gradient mark, the wordmark, the slogan. */
function Lockup({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const big = size === 'lg'
  return (
    <div className="lockup" style={{ gap: big ? '5mm' : '2.4mm' }}>
      <img className="lockup-mark" src="/wethink-logo.png" alt=""
        style={{ height: big ? '17mm' : '5.4mm' }} />
      <div>
        <div className="lockup-name" style={{ fontSize: big ? '7.4mm' : '3.2mm',
          letterSpacing: big ? '1.6mm' : '.7mm' }}>WeThink</div>
        {big && <div className="lockup-tag">Think &middot; Plan &middot; Grow</div>}
      </div>
    </div>
  )
}

function Slide({
  n,
  children,
  dark = false,
  label,
}: {
  n: number
  children: React.ReactNode
  dark?: boolean
  label?: string
}) {
  return (
    <section className={`slide${dark ? ' dark' : ''}`}>
      <div className="slide-body">{children}</div>
      <div className="slide-foot">
        <span className="foot-left">
          <Lockup size="sm" />
          <span className="foot-label">{label ?? 'Company Profile'}</span>
        </span>
        <span className="foot-n">{String(n).padStart(2, '0')} / {SLIDES}</span>
      </div>
    </section>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>
}

export default function DeckPage() {
  return (
    <>


      {/* 01 — cover */}
      <Slide n={1} label={COMPANY.site}>
        <div className="cover">
          <Lockup />
          <div>
            <Eyebrow>Company Profile</Eyebrow>
            <h1 style={{ marginTop: '6mm', maxWidth: '250mm' }}>
              Building smarter,<br />more efficient businesses
            </h1>
          </div>
          <div className="creds">
            <p className="creds-line">
              We work with government entities, embassies and private organizations
              across the United Arab Emirates.
            </p>
            <p className="creds-sub">
              Official events, national programmes and the systems behind them &mdash;
              delivered to institutional standards of accuracy, presentation and
              confidentiality.
            </p>
          </div>
          <div className="cover-foot">
            <div className="contact" style={{ marginTop: 0 }}>
              <span>{COMPANY.phone}</span>
              <span>{COMPANY.email}</span>
              <span>{COMPANY.site}</span>
              <span>@wethink.ae</span>
            </div>
            <span className="slogan">{CLOSING.title}</span>
          </div>
        </div>
      </Slide>

      {/* 02 — about */}
      <Slide n={2}>
        <div className="cols c-split">
          <div>
            <Eyebrow>About us</Eyebrow>
            <p className="pull">{ABOUT.pull}</p>
            <p className="lead" style={{ marginTop: '5mm', fontSize: '4.3mm' }}>{ABOUT.lead}</p>
          </div>
          <div style={{ display: 'grid', gap: '5mm' }}>
            {ABOUT.halves.map((h) => (
              <div className="card" key={h.k}>
                <div className="k">{h.k}</div>
                <div className="v">{h.v}</div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* 03 — purpose */}
      <Slide n={3}>
        <div className="cols c-split">
          <div>
            <Eyebrow>Our purpose</Eyebrow>
            <p className="pull">{PURPOSE.pull}</p>
            <p className="lead" style={{ marginTop: '5mm', fontSize: '4.3mm' }}>{PURPOSE.body}</p>
          </div>
          <div className="mock"><AnalyticsMockup /></div>
        </div>
      </Slide>

      {/* 04 — what the solutions support */}
      <Slide n={4}>
        <Eyebrow>Our solutions are designed to support</Eyebrow>
        <div className="grid2 fill" style={{ marginTop: '8mm' }}>
          {SUPPORTS.map((s, i) => (
            <div key={s} className="card" style={{ display: 'flex', gap: '5mm', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'SerifD', color: VIOLET, fontSize: '6mm', lineHeight: 1 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '4.6mm', fontWeight: 600 }}>{s}</span>
            </div>
          ))}
        </div>
      </Slide>

      {/* 05 — vision, mission, values */}
      <Slide n={5}>
        <div className="grid2" style={{ flexGrow: 1, alignContent: 'center' }}>
          {[['Vision', VISION], ['Mission', MISSION]].map(([k, v]) => (
            <div key={k}>
              <Eyebrow>{k}</Eyebrow>
              <p style={{ marginTop: '4mm', fontSize: '5mm', lineHeight: 1.42 }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '11mm' }}>
          <Eyebrow>Values</Eyebrow>
          <div className="chips">
            {VALUES.map((v) => <span className="chip" key={v}>{v}</span>)}
          </div>
        </div>
      </Slide>

      {/* 06 — what we do */}
      <Slide n={6}>
        <Eyebrow>What we do</Eyebrow>
        <ul className="num-list spread" style={{ marginTop: '7mm' }}>
          {SERVICES.map((s) => (
            <li key={s.n}>
              <span className="n">{s.n}</span>
              <span className="t">
                <strong style={{ fontFamily: 'SansD', fontWeight: 700 }}>{s.title}</strong>
                <span className="d">{s.summary}</span>
              </span>
            </li>
          ))}
        </ul>
      </Slide>

      {/* 07–11 — a slide per service */}
      {SERVICES.map((s, i) => {
        const Mock = MOCKUPS[s.mockup]
        return (
          <Slide key={s.n} n={7 + i} label={`Services · ${s.title}`}>
            <div className="cols c-split">
              <div>
                <Eyebrow>Services</Eyebrow>
                <h2>{s.title}</h2>
                <p className="lead" style={{ marginTop: '4mm', fontSize: '4.3mm' }}>{s.proposition}</p>
                <div style={{ marginTop: '6mm' }}>
                  <span className="eyebrow" style={{ fontSize: '3.1mm' }}>{s.listLabel}</span>
                  <div className="chips">
                    {s.list.map((c) => <span className="chip" key={c}>{c}</span>)}
                  </div>
                </div>
                {s.outcome && (
                  <div className="outcome">
                    <div className="k">Outcome</div>
                    <div className="v">{s.outcome}</div>
                  </div>
                )}
              </div>
              <div className="mock"><Mock /></div>
            </div>
          </Slide>
        )
      })}

      {/* 12 — the systems we build */}
      <Slide n={12} label="Systems we build">
        <Eyebrow>Systems we build</Eyebrow>
        <h2 style={{ fontSize: '10mm', maxWidth: '210mm' }}>
          The two clients ask for by name, built to fit how they already work.
        </h2>
        <div className="grid2" style={{ marginTop: '7mm', flexGrow: 1, alignContent: 'center' }}>
          <div>
            <div className="mock"><CrmMockup /></div>
            <p className="mock-cap">Pipeline, activity and follow-ups in one place, so nothing waits on a memory.</p>
          </div>
          <div>
            <div className="mock"><ErpMockup /></div>
            <p className="mock-cap">Finance, procurement, inventory and assets on one ledger, closing in days rather than weeks.</p>
          </div>
        </div>
      </Slide>

      {/* 13 — why */}
      <Slide n={13}>
        <Eyebrow>Why WeThink</Eyebrow>
        <div className="grid3 fill" style={{ marginTop: '7mm' }}>
          {WHY.map(([k, v], i) => (
            <div className="card" key={k}>
              <span style={{ fontFamily: 'SerifD', color: VIOLET, fontSize: '5.4mm', lineHeight: 1 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="k" style={{ marginTop: '1.6mm', color: INK, fontSize: '4.4mm' }}>{k}</div>
              <div className="v" style={{ fontSize: '3.7mm' }}>{v}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '7mm', fontSize: '4.2mm', fontWeight: 600 }}>{WHY_NOTE}</p>
      </Slide>

      {/* 14 — how we work */}
      <Slide n={14}>
        <Eyebrow>How we work</Eyebrow>
        <div className="grid3 fill" style={{ marginTop: '7mm' }}>
          {HOW.map(([k, v], i) => (
            <div className="card" key={k}>
              <span style={{ fontFamily: 'SerifD', color: VIOLET, fontSize: '5.4mm', lineHeight: 1 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="k" style={{ marginTop: '1.6mm', color: INK, fontSize: '4.6mm' }}>{k}</div>
              <div className="v" style={{ fontSize: '3.7mm' }}>{v}</div>
            </div>
          ))}
        </div>
      </Slide>

      {/* 15 — core areas */}
      <Slide n={15}>
        <div className="cols c-split">
          <div>
            <Eyebrow>Our core areas</Eyebrow>
            <p className="pull" style={{ fontSize: '8.5mm' }}>{CORE_NOTE}</p>
          </div>
          <ul className="num-list">
            {CORE.map(([k, v], i) => (
              <li key={k}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <span className="t">
                  <strong style={{ fontFamily: 'SansD', fontWeight: 700, fontSize: '4.3mm' }}>{k}</strong>
                  <span className="d">{v}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Slide>

      {/* 16 — closing */}
      <Slide n={16} dark label={COMPANY.site}>
        <div className="stack">
          <Lockup />
          <h1 style={{ fontSize: '17mm', marginTop: '9mm' }}>{CLOSING.title}</h1>
          <p className="lead" style={{ marginTop: '5mm', fontSize: '5.4mm' }}>{CLOSING.sub}</p>
          <div className="contact">
            <span>{COMPANY.phone}</span>
            <span>{COMPANY.email}</span>
            <span>{COMPANY.site}</span>
            <span>@wethink.ae</span>
          </div>
          <p style={{ marginTop: '7mm', fontSize: '3.6mm', color: 'rgba(255,255,255,.55)' }}>
            {COMPANY.legal} · {COMPANY.base}
          </p>
        </div>
      </Slide>
    </>
  )
}
