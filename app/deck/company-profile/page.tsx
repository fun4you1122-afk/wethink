import './deck.css'
import {
  AnalyticsMockup, AutomationMockup, PlatformMockup, RoadmapMockup, EventMockup, ReportMockup,
  CrmMockup, ErpMockup,
} from '@/components/profile/Mockups'
import { CapIcon, iconFor } from '@/components/profile/icons'
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

const SLIDES = 16

/* ── the sweep ─────────────────────────────────────────────
   The shape that cuts in from a corner on every page. It alternates side
   down the deck so consecutive spreads do not read as the same page, and
   carries a thin echo of itself a little further in. */

type Side = 'left' | 'right' | 'none'

function Sweep({ side, id }: { side: Side; id: string }) {
  if (side === 'none') return null
  const left = side === 'left'
  return (
    <div className="sweep" aria-hidden="true">
      <svg viewBox="0 0 1280 720" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`sw-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#03CFF2" />
            <stop offset=".48" stopColor="#1163E8" />
            <stop offset="1" stopColor="#983CFC" />
          </linearGradient>
        </defs>
        {left ? (
          <>
            <path d="M0 0 L268 0 C176 32 80 58 0 116 Z" fill={`url(#sw-${id})`} />
            <path d="M418 0 C286 74 132 142 0 214" fill="none" stroke={`url(#sw-${id})`}
              strokeWidth="3" opacity=".40" />
          </>
        ) : (
          <>
            <path d="M1280 0 L1012 0 C1104 32 1200 58 1280 116 Z" fill={`url(#sw-${id})`} />
            <path d="M862 0 C994 74 1148 142 1280 214" fill="none" stroke={`url(#sw-${id})`}
              strokeWidth="3" opacity=".40" />
          </>
        )}
      </svg>
    </div>
  )
}

/** A faint field of chevrons in the corner the sweep does not occupy. */
function Field({ side, dark = false }: { side: Side; dark?: boolean }) {
  const cells = Array.from({ length: 24 }, (_, i) => ({ x: (i % 6) * 17, y: Math.floor(i / 6) * 17 }))
  const pos = side === 'left'
    ? { right: '16mm', bottom: '20mm' }
    : { left: '16mm', bottom: '20mm' }
  return (
    <div className="wm" style={{ ...pos, opacity: dark ? 0.22 : 0.5 }} aria-hidden="true">
      <svg width="106" height="106" viewBox="0 0 102 102" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke={dark ? '#FFFFFF' : '#0A1130'} strokeOpacity=".16" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round">
          {cells.map((c, i) => (
            <path key={i} d={`M${c.x + 3} ${c.y + 3} l5 5 -5 5`} />
          ))}
        </g>
      </svg>
    </div>
  )
}

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
  n, children, dark = false, label, side = 'left', svc = false,
}: {
  n: number
  children: React.ReactNode
  dark?: boolean
  label?: string
  side?: Side
  svc?: boolean
}) {
  return (
    <section className={`slide${dark ? ' dark' : ''}${svc ? ' svc' : ''}`}>
      <Sweep side={dark ? 'none' : side} id={`s${n}`} />
      <Field side={side === 'right' ? 'right' : 'left'} dark={dark} />
      <span className="pagebadge">{String(n).padStart(2, '0')}</span>
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

/** One capability: the badge, the chevron, the label and an optional line. */
function Cap({ k, v }: { k: string; v?: string }) {
  return (
    <div className="cap">
      <span className="badge"><CapIcon name={iconFor(k)} /></span>
      <span className="chev" aria-hidden="true" />
      <span className="txt">
        <span className="k">{k}</span>
        {v && <span className="v">{v}</span>}
      </span>
    </div>
  )
}

/** A product screen inside the gradient ring the sample uses for its art. */
function Ring({ children }: { children: React.ReactNode }) {
  return (
    <div className="ring">
      <span className="plate" aria-hidden="true" />
      <span className="dot" style={{ background: '#03CFF2', left: '-6mm', top: '30%' }} aria-hidden="true" />
      <span className="dot" style={{ background: '#983CFC', right: '-5mm', bottom: '18%' }} aria-hidden="true" />
      <div className="inner">{children}</div>
    </div>
  )
}

export default function DeckPage() {
  return (
    <>
      {/* 01 — cover */}
      <Slide n={1} dark label={COMPANY.site}>
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
      <Slide n={2} side="left">
        <div className="cols c-split">
          <div>
            <Eyebrow>About us</Eyebrow>
            <h2 style={{ fontSize: '10mm', marginTop: '3mm' }}>About WeThink</h2>
            <p className="pull" style={{ fontSize: '6.4mm' }}>{ABOUT.pull}</p>
            <p className="lead" style={{ marginTop: '5mm', fontSize: '4.1mm' }}>{ABOUT.lead}</p>
          </div>
          <div className="caps" style={{ alignContent: 'center', gap: '7mm' }}>
            {ABOUT.halves.map((h) => <Cap key={h.k} k={h.k} v={h.v} />)}
          </div>
        </div>
      </Slide>

      {/* 03 — purpose */}
      <Slide n={3} side="right">
        <div className="cols c-split">
          <div>
            <Eyebrow>Our purpose</Eyebrow>
            <h2 style={{ fontSize: '10mm', marginTop: '3mm' }}>Why we exist</h2>
            <p className="pull" style={{ fontSize: '6.4mm' }}>{PURPOSE.pull}</p>
            <p className="lead" style={{ marginTop: '5mm', fontSize: '4.1mm' }}>{PURPOSE.body}</p>
          </div>
          <Ring><div className="mock"><AnalyticsMockup /></div></Ring>
        </div>
      </Slide>

      {/* 04 — what the solutions support */}
      <Slide n={4} side="left">
        <Eyebrow>Our solutions are designed to support</Eyebrow>
        <h2 style={{ marginTop: '3mm' }}>What we improve</h2>
        <div className="caps c2" style={{ marginTop: '9mm', gap: '9mm 9mm', alignContent: 'center' }}>
          {SUPPORTS.map((s) => <Cap key={s} k={s} />)}
        </div>
      </Slide>

      {/* 05 — vision, mission, values */}
      <Slide n={5} side="right">
        <Eyebrow>Vision, mission and values</Eyebrow>
        <h2 style={{ marginTop: '3mm' }}>What we are aiming at</h2>
        <div className="grid2" style={{ marginTop: '8mm', gap: '12mm' }}>
          {[['Vision', VISION], ['Mission', MISSION]].map(([k, v]) => (
            <div key={k}>
              <div className="eyebrow">{k}</div>
              <p style={{ marginTop: '3.5mm', fontSize: '4.6mm', lineHeight: 1.45 }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto' }}>
          <Eyebrow>Values</Eyebrow>
          <div className="chips">{VALUES.map((v) => <span className="chip" key={v}>{v}</span>)}</div>
        </div>
      </Slide>

      {/* 06 — what we do */}
      <Slide n={6} side="left">
        <Eyebrow>What we do</Eyebrow>
        <h2 style={{ marginTop: '3mm' }}>Five lines of work</h2>
        <div className="caps c2" style={{ marginTop: '9mm', gap: '10mm 9mm', alignContent: 'center' }}>
          {SERVICES.map((s) => <Cap key={s.n} k={s.title} v={s.summary} />)}
        </div>
      </Slide>

      {/* 07–11 — a slide per service */}
      {SERVICES.map((s, i) => {
        const Mock = MOCKUPS[s.mockup]
        return (
          <Slide key={s.n} n={7 + i} label={`Services · ${s.title}`} side={i % 2 ? 'right' : 'left'} svc>
            <Eyebrow>Service {s.n}</Eyebrow>
            <h2 style={{ marginTop: '3mm', maxWidth: '215mm' }}>{s.title}</h2>
            <p className="lead" style={{ marginTop: '3.5mm', fontSize: '3.9mm', maxWidth: '210mm' }}>
              {s.proposition}
            </p>
            <div className="cols c-split" style={{ marginTop: '5mm', gap: '12mm', alignItems: 'center' }}>
              <div className="caps c2" style={{ gap: '4.2mm 7mm', alignContent: 'center' }}>
                {s.list.map((c) => <Cap key={c} k={c} />)}
              </div>
              <div>
                <Ring><div className="mock"><Mock /></div></Ring>
                {s.outcome && (
                  <div className="outcome" style={{ marginTop: '3.5mm' }}>
                    <div className="k">Outcome</div>
                    <div className="v">{s.outcome}</div>
                  </div>
                )}
              </div>
            </div>
          </Slide>
        )
      })}

      {/* 12 — the systems we build */}
      <Slide n={12} label="Systems we build" side="right">
        <Eyebrow>Systems we build</Eyebrow>
        <h2 style={{ marginTop: '3mm' }}>CRM and ERP</h2>
        <p className="lead" style={{ marginTop: '4mm', fontSize: '4.1mm' }}>
          The two clients ask for by name, built to fit how they already work.
        </p>
        <div className="grid2" style={{ marginTop: '6mm', flexGrow: 1, alignContent: 'center' }}>
          <div className="mock"><CrmMockup /></div>
          <div className="mock"><ErpMockup /></div>
        </div>
      </Slide>

      {/* 13 — why */}
      <Slide n={13} side="left">
        <Eyebrow>Why WeThink</Eyebrow>
        <h2 style={{ marginTop: '3mm' }}>How we are different</h2>
        <div className="caps c3" style={{ marginTop: '9mm', gap: '14mm 9mm', alignContent: 'center' }}>
          {WHY.map(([k, v]) => <Cap key={k} k={k} v={v} />)}
        </div>
        <p style={{ marginTop: '6mm', fontSize: '4mm', fontWeight: 700 }}>{WHY_NOTE}</p>
      </Slide>

      {/* 14 — how we work */}
      <Slide n={14} side="right">
        <Eyebrow>How we work</Eyebrow>
        <h2 style={{ marginTop: '3mm' }}>Six steps, start to running</h2>
        <div className="caps c3" style={{ marginTop: '9mm', gap: '14mm 9mm', alignContent: 'center' }}>
          {HOW.map(([k, v]) => <Cap key={k} k={k} v={v} />)}
        </div>
      </Slide>

      {/* 15 — core areas */}
      <Slide n={15} side="left">
        <Eyebrow>Our core areas</Eyebrow>
        <h2 style={{ marginTop: '3mm', maxWidth: '230mm' }}>Five areas, one operating model</h2>
        <p className="lead" style={{ marginTop: '4mm', fontSize: '4.1mm' }}>{CORE_NOTE}</p>
        <div className="caps c2" style={{ marginTop: '7mm', gap: '8mm 9mm', alignContent: 'center' }}>
          {CORE.map(([k, v]) => <Cap key={k} k={k} v={v} />)}
        </div>
      </Slide>

      {/* 16 — closing */}
      <Slide n={16} dark label={COMPANY.site}>
        <div className="stack">
          <Lockup />
          <h1 style={{ fontSize: '16mm', marginTop: '9mm' }}>{CLOSING.title}</h1>
          <p className="lead" style={{ marginTop: '5mm', fontSize: '5mm' }}>{CLOSING.sub}</p>
          <div className="contact">
            <span>{COMPANY.phone}</span>
            <span>{COMPANY.email}</span>
            <span>{COMPANY.site}</span>
            <span>@wethink.ae</span>
          </div>
          <p style={{ marginTop: '7mm', fontSize: '3.6mm', color: 'rgba(255,255,255,.62)' }}>
            {COMPANY.legal} &middot; {COMPANY.base}
          </p>
        </div>
      </Slide>
    </>
  )
}
