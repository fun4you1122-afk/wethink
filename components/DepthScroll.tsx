'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SECTIONS = [
  {
    color: 'hsl(0 75% 75%)',
    title: 'Think. Plan. Grow.',
    body: 'WeThink delivers end-to-end digital transformation — turning your vision into scalable, high-impact technology solutions.',
    isTop: true,
  },
  {
    color: 'hsl(72 75% 75%)',
    title: 'Strategy',
    body: 'We craft data-driven digital strategies tailored to your business. Every decision backed by research, market insight, and years of expertise.',
  },
  {
    color: 'hsl(144 75% 75%)',
    title: 'Build',
    body: 'From web applications to enterprise platforms, our team ships clean, performant software that scales with your growth.',
    hasButtons: true,
  },
  {
    color: 'hsl(216 75% 75%)',
    title: 'Innovate',
    body: 'We harness AI, cloud, and emerging technology to future-proof your business — so you stay ahead, not behind.',
    hasScrollable: true,
  },
  {
    color: 'hsl(288 75% 75%)',
    title: '5+ years · 5000+ projects · 1000+ clients',
    body: 'Ready to be next? 🚀',
    center: true,
  },
]

const GRID_BG = 'repeating-linear-gradient(#fff3 0 2px, transparent 0 40px), repeating-linear-gradient(90deg, #fff3 0 2px, transparent 0 40px)'

function PanelContent({ s }: { s: typeof SECTIONS[0] }) {
  return (
    <>
      {s.isTop ? (
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: 900, maxWidth: '40rem', width: '100%' }}>
          {s.title}
        </h1>
      ) : (
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', fontWeight: 900,
          maxWidth: '40rem', width: '100%',
          textAlign: (s as any).center ? 'center' : 'left',
        }}>
          {s.title}
        </h2>
      )}
      <p style={{
        maxWidth: '40rem', lineHeight: 1.6,
        fontSize: 'clamp(14px, 1.5vw, 20px)',
        textAlign: (s as any).center ? 'center' : 'left',
      }}>
        {s.body}
      </p>
      {(s as any).hasButtons && (
        <div style={{ display: 'flex', gap: '1em', flexWrap: 'wrap', marginTop: '0.25em' }}>
          <button style={{ padding: '0.5em 1.4em', background: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 'inherit' }}
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Start a Project
          </button>
          <button style={{ padding: '0.5em 1.4em', background: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 'inherit' }}
            onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}>
            Our Services
          </button>
        </div>
      )}
      {(s as any).hasScrollable && (
        <div style={{
          maxWidth: '40rem', width: '100%', background: 'rgba(255,255,255,0.5)',
          padding: '1em', borderRadius: 8, maxHeight: 200, overflowY: 'scroll',
          overscrollBehavior: 'contain', fontSize: '0.85em',
          display: 'flex', flexDirection: 'column', gap: '0.5em', marginTop: '0.25em',
        }}>
          {['AI & Machine Learning', 'Cloud Architecture & Migration', 'Cybersecurity & Compliance', 'Custom Software Development', 'Digital Product Design', 'Data Analytics & Business Intelligence'].map(item => (
            <p key={item} style={{ maxWidth: 'none' }}>✦ {item}</p>
          ))}
        </div>
      )}
    </>
  )
}

export default function DepthScroll() {
  const outerRef  = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Check at runtime — no React state, no re-render, no hydration flash
    if (window.innerWidth < 768) return

    gsap.registerPlugin(ScrollTrigger)
    const outer = outerRef.current
    if (!outer) return

    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[]
    if (panels.length < SECTIONS.length) return

    panels.forEach((p, i) => {
      gsap.set(p, {
        z: -12000,
        rotateX: i === 0 ? 60 : 0,
        rotateZ: i === 0 ? 110 : 0,
        opacity: i === 0 ? 1 : 0,
        transformOrigin: '50% 50% 50vmin',
        transformStyle: 'preserve-3d',
      })
    })

    const tl = gsap.timeline({ defaults: { ease: 'none' } })

    tl.to(panels[0], { z: 0, rotateX: 0, rotateZ: 0, ease: 'power2.out', duration: 0.2 }, 0)
    tl.to(panels[0], { z: 1200, opacity: 0, ease: 'power2.in', duration: 0.2 }, 0.2)

    for (let i = 1; i < SECTIONS.length; i++) {
      const inAt  = i * 0.2
      const outAt = inAt + 0.2
      tl.to(panels[i], { z: 0, opacity: 1, ease: 'power2.out', duration: 0.2 }, inAt)
      if (i < SECTIONS.length - 1) {
        tl.to(panels[i], { z: 1200, opacity: 0, ease: 'power2.in', duration: 0.2 }, outAt)
      }
    }

    // Store the instance so cleanup only kills THIS trigger, not every trigger on the page
    const st = ScrollTrigger.create({
      trigger: outer,
      start: 'top top',
      end: 'bottom bottom',
      animation: tl,
      scrub: 1,
    })

    return () => { st.kill() }
  }, [])  // run once — no isMobile state dependency

  return (
    <>
      {/* ── Mobile: plain vertical stack (CSS-driven, no GSAP) ── */}
      <div className="md:hidden">
        {SECTIONS.map((s, i) => (
          <div key={i} style={{
            display: 'grid', placeItems: 'center', alignContent: 'center',
            gap: '1rem', padding: '3em 1.5em',
            color: '#111', backgroundColor: s.color, backgroundImage: GRID_BG,
          }}>
            <PanelContent s={s} />
          </div>
        ))}
      </div>

      {/* ── Desktop: full 3D scroll animation ── */}
      <div ref={outerRef} className="hidden md:block" style={{ position: 'relative', height: '500vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', perspective: '1200px' }}>

          {SECTIONS.map((s, i) => (
            <div
              key={i}
              ref={el => { panelRefs.current[i] = el }}
              style={{
                position: 'absolute', inset: 0,
                display: 'grid', placeItems: 'center', alignContent: 'center',
                gap: '1rem', padding: '2em', zIndex: 5 - i,
                color: '#111', backgroundColor: s.color, backgroundImage: GRID_BG,
              }}
            >
              <PanelContent s={s} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
