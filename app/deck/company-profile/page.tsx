import './deck.css'
import {
  AnalyticsMockup, AutomationMockup, PlatformMockup, RoadmapMockup, EventMockup, ReportMockup,
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

const INK = '#241546'
const MUTED = '#6B6480'
const VIOLET = '#6D28D9'

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
        <span className="foot-label">{label ?? 'WeThink · Company Profile'}</span>
        <span className="foot-n">{String(n).padStart(2, '0')} / 15</span>
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
      <Slide n={1} dark label={COMPANY.site}>
        <div className="stack">
          <Eyebrow>Company Profile</Eyebrow>
          <h1 style={{ marginTop: '6mm' }}>
            Building smarter,<br />more efficient<br />businesses
          </h1>
          <p className="lead" style={{ marginTop: '7mm' }}>{COMPANY.legal}</p>
          <div className="contact">
            <span>{COMPANY.phone}</span>
            <span>{COMPANY.email}</span>
            <span>{COMPANY.site}</span>
            <span>@wethink.ae</span>
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
        <div className="grid2" style={{ marginTop: '8mm' }}>
          {SUPPORTS.map((s, i) => (
            <div key={s} className="card" style={{ display: 'flex', gap: '4mm', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'PoppinsD', fontWeight: 700, color: VIOLET, fontSize: '4.4mm' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '4.6mm', fontWeight: 600 }}>{s}</span>
            </div>
          ))}
        </div>
      </Slide>

      {/* 05 — vision, mission, values */}
      <Slide n={5}>
        <div className="grid2">
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
        <ul className="num-list" style={{ marginTop: '7mm' }}>
          {SERVICES.map((s) => (
            <li key={s.n}>
              <span className="n">{s.n}</span>
              <span className="t">
                <strong style={{ fontFamily: 'PoppinsD', fontWeight: 700 }}>{s.title}</strong>
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

      {/* 12 — why */}
      <Slide n={12}>
        <Eyebrow>Why WeThink</Eyebrow>
        <div className="grid3" style={{ marginTop: '7mm' }}>
          {WHY.map(([k, v], i) => (
            <div className="card" key={k}>
              <span style={{ fontFamily: 'PoppinsD', fontWeight: 700, color: VIOLET, fontSize: '3.6mm' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="k" style={{ marginTop: '1.6mm', color: INK, fontSize: '4.4mm' }}>{k}</div>
              <div className="v" style={{ fontSize: '3.7mm' }}>{v}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '7mm', fontSize: '4.2mm', fontWeight: 600 }}>{WHY_NOTE}</p>
      </Slide>

      {/* 13 — how we work */}
      <Slide n={13}>
        <Eyebrow>How we work</Eyebrow>
        <div className="grid3" style={{ marginTop: '7mm' }}>
          {HOW.map(([k, v], i) => (
            <div className="card" key={k}>
              <span style={{ fontFamily: 'PoppinsD', fontWeight: 700, color: VIOLET, fontSize: '3.6mm' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="k" style={{ marginTop: '1.6mm', color: INK, fontSize: '4.6mm' }}>{k}</div>
              <div className="v" style={{ fontSize: '3.7mm' }}>{v}</div>
            </div>
          ))}
        </div>
      </Slide>

      {/* 14 — core areas */}
      <Slide n={14}>
        <div className="cols c-split">
          <div>
            <Eyebrow>Our core areas</Eyebrow>
            <p className="pull" style={{ fontSize: '6.4mm' }}>{CORE_NOTE}</p>
          </div>
          <ul className="num-list">
            {CORE.map(([k, v], i) => (
              <li key={k}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <span className="t">
                  <strong style={{ fontFamily: 'PoppinsD', fontWeight: 700, fontSize: '4.3mm' }}>{k}</strong>
                  <span className="d">{v}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Slide>

      {/* 15 — closing */}
      <Slide n={15} dark label={COMPANY.site}>
        <div className="stack">
          <h1 style={{ fontSize: '17mm' }}>{CLOSING.title}</h1>
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
