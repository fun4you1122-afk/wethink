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

export default function DepthScroll() {
  const outerRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const cubeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const outer = outerRef.current
    if (!outer) return

    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[]
    if (panels.length < SECTIONS.length) return

    // Initial states — all panels hidden except none (scroll reveals them)
    panels.forEach((p, i) => {
      gsap.set(p, {
        z: i === 0 ? -12000 : -12000,
        rotateX: i === 0 ? 60 : 0,
        rotateZ: i === 0 ? 110 : 0,
        opacity: i === 0 ? 1 : 0,
        transformOrigin: '50% 50% 50vmin',
        transformStyle: 'preserve-3d',
      })
    })

    if (cubeRef.current) {
      gsap.set(cubeRef.current, {
        z: -12000,
        rotateX: 60,
        rotateZ: 110,
        transformOrigin: '50% 50% 50vmin',
        transformStyle: 'preserve-3d',
      })
    }

    // Total timeline duration = 1, divided into 5 × 0.2 segments
    // Each panel: in over 0.2, out over 0.2 (overlapping with next)
    const tl = gsap.timeline({ defaults: { ease: 'none' } })

    // Panel 0 — fly in with rotation
    tl.to(panels[0], { z: 0, rotateX: 0, rotateZ: 0, ease: 'power2.out', duration: 0.2 }, 0)
    tl.to(panels[0], { z: 1200, opacity: 0, ease: 'power2.in', duration: 0.2 }, 0.2)

    // Cube tracks panel 0 fly-in
    if (cubeRef.current) {
      tl.to(cubeRef.current, { z: 0, rotateX: 0, rotateZ: 0, ease: 'power2.out', duration: 0.2 }, 0)
      tl.to(cubeRef.current, { z: 1200, opacity: 0, ease: 'power2.in', duration: 0.2 }, 0.2)
    }

    // Panels 1–4
    for (let i = 1; i < SECTIONS.length; i++) {
      const inAt = i * 0.2
      const outAt = inAt + 0.2
      tl.to(panels[i], { z: 0, opacity: 1, ease: 'power2.out', duration: 0.2 }, inAt)
      if (i < SECTIONS.length - 1) {
        tl.to(panels[i], { z: 1200, opacity: 0, ease: 'power2.in', duration: 0.2 }, outAt)
      }
    }

    ScrollTrigger.create({
      trigger: outer,
      start: 'top top',
      end: 'bottom bottom',
      animation: tl,
      scrub: 1,
    })

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [])

  return (
    <div ref={outerRef} style={{ position: 'relative', height: '500vh' }}>
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        perspective: '1200px',
      }}>

        {/* Cube — first panel only */}
        <div
          ref={cubeRef}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6 }}
        >
          {([
            { left: 0, top: 0, width: '100vmin', height: '100%', transform: 'rotateY(-90deg)', transformOrigin: 'left' },
            { right: 0, top: 0, width: '100vmin', height: '100%', transform: 'rotateY(90deg)', transformOrigin: 'right' },
            { left: 0, top: 0, width: '100%', height: '100vmin', transform: 'rotateX(90deg)', transformOrigin: 'top' },
            { left: 0, bottom: 0, width: '100%', height: '100vmin', transform: 'rotateX(-90deg)', transformOrigin: 'bottom' },
          ] as React.CSSProperties[]).map((style, i) => (
            <div key={i} style={{
              position: 'absolute',
              background: 'rgba(255,200,255,0.35)',
              boxShadow: '0 0 50px #000 inset',
              ...style,
            }} />
          ))}
        </div>

        {/* Content panels */}
        {SECTIONS.map((s, i) => (
          <div
            key={i}
            ref={el => { panelRefs.current[i] = el }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              alignContent: 'center',
              gap: '1rem',
              padding: '2em',
              zIndex: 5 - i,
              color: '#111',
              backgroundColor: s.color,
              backgroundImage:
                'repeating-linear-gradient(#fff3 0 2px, transparent 0 40px), repeating-linear-gradient(90deg, #fff3 0 2px, transparent 0 40px)',
            }}
          >
            {s.isTop ? (
              <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: 900, maxWidth: '40rem', width: '100%' }}>
                {s.title}
              </h1>
            ) : (
              <h2 style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.8rem)',
                fontWeight: 900,
                maxWidth: '40rem',
                width: '100%',
                textAlign: s.center ? 'center' : 'left',
              }}>
                {s.title}
              </h2>
            )}

            <p style={{
              maxWidth: '40rem',
              lineHeight: 1.6,
              fontSize: 'clamp(14px, 1.5vw, 20px)',
              textAlign: s.center ? 'center' : 'left',
            }}>
              {s.body}
            </p>

            {s.hasButtons && (
              <div style={{ display: 'flex', gap: '1em', flexWrap: 'wrap', marginTop: '0.25em' }}>
                <button
                  style={{ padding: '0.5em 1.4em', background: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 'inherit' }}
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Start a Project
                </button>
                <button
                  style={{ padding: '0.5em 1.4em', background: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 'inherit' }}
                  onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Our Services
                </button>
              </div>
            )}

            {s.hasScrollable && (
              <div style={{
                maxWidth: '40rem',
                width: '100%',
                background: 'rgba(255,255,255,0.5)',
                padding: '1em',
                borderRadius: 8,
                maxHeight: 200,
                overflowY: 'scroll',
                overscrollBehavior: 'contain',
                fontSize: '0.85em',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5em',
                marginTop: '0.25em',
              }}>
                {['AI & Machine Learning', 'Cloud Architecture & Migration', 'Cybersecurity & Compliance', 'Custom Software Development', 'Digital Product Design', 'Data Analytics & Business Intelligence'].map(item => (
                  <p key={item} style={{ maxWidth: 'none' }}>✦ {item}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
