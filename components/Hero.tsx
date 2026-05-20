'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WORDS = ['IT Consulting', 'Cloud Strategy', 'Cybersecurity', 'Business Growth']

interface Particle {
  x: number; y: number
  vx: number; vy: number
  ox: number; oy: number
  r: number
  rgb: readonly [number, number, number]
  alpha: number
}

const PALETTES: Array<readonly [number, number, number]> = [
  [167, 139, 250],
  [124, 58, 237],
  [192, 132, 252],
  [139, 92, 246],
  [255, 255, 255],
]

const CONNECT_DIST = 145
const MOUSE_RADIUS = 125
const MOUSE_FORCE = 0.17

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>()

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const iv = setInterval(() => setWordIndex(i => (i + 1) % WORDS.length), 2800)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const init = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const count = canvas.width < 768 ? 45 : 90
      particlesRef.current = Array.from({ length: count }, () => {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        return {
          x, y, ox: x, oy: y,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: Math.random() * 1.8 + 0.7,
          rgb: PALETTES[Math.floor(Math.random() * PALETTES.length)],
          alpha: Math.random() * 0.5 + 0.3,
        }
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const { x: mx, y: my } = mouseRef.current
      const ps = particlesRef.current
      const n = ps.length

      for (let i = 0; i < n; i++) {
        const p = ps[i]
        const dx = p.x - mx
        const dy = p.y - my
        const d2 = dx * dx + dy * dy
        if (d2 < MOUSE_RADIUS * MOUSE_RADIUS) {
          const d = Math.sqrt(d2)
          const f = (MOUSE_RADIUS - d) / MOUSE_RADIUS * MOUSE_FORCE
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }
        p.vx += (p.ox - p.x) * 0.0022
        p.vy += (p.oy - p.y) * 0.0022
        p.vx *= 0.94
        p.vy *= 0.94
        p.x += p.vx
        p.y += p.vy

        for (let j = i + 1; j < n; j++) {
          const q = ps[j]
          const cdx = p.x - q.x
          const cdy = p.y - q.y
          const cd = Math.sqrt(cdx * cdx + cdy * cdy)
          if (cd < CONNECT_DIST) {
            const a = (1 - cd / CONNECT_DIST) * 0.32
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(124,58,237,${a})`
            ctx.lineWidth = 0.75
            ctx.stroke()
          }
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.rgb[0]},${p.rgb[1]},${p.rgb[2]},${p.alpha})`
        ctx.fill()
      }

      // Mouse glow
      if (mx > 0) {
        const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 100)
        glow.addColorStop(0, 'rgba(124,58,237,0.08)')
        glow.addColorStop(1, 'rgba(124,58,237,0)')
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }
    const onResize = () => init()

    init()
    draw()
    window.addEventListener('resize', onResize)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
  }
  const item = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <section id="home" className="relative min-h-screen overflow-hidden flex items-center" style={{ background: '#030814' }}>

      {/* Animated gradient mesh — slow breathing color */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #030814 0%, #0d0629 35%, #030814 60%, #06011a 100%)',
          backgroundSize: '400% 400%',
          animation: 'heroMesh 12s ease infinite',
        }}
      />

      {/* Video background — add /public/hero-video.mp4 to activate */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.18, mixBlendMode: 'luminosity' }}
        aria-hidden
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Canvas — interactive particle constellation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Vignette + gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030814]/70 via-transparent to-[#030814]/85 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030814]/60 via-transparent to-[#030814]/30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-14 lg:px-20 py-32">
        <motion.div variants={container} initial="hidden" animate="visible" className="max-w-3xl">

          <motion.div variants={item}>
            <span
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-8"
              style={{
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.4)',
                color: '#A78BFA',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Abu Dhabi, UAE — Est. 2019
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white"
          >
            We Engineer
            <br />
            Your
          </motion.h1>

          {/* Rotating word */}
          <div className="relative mt-1" style={{ height: '1.2em' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={wordIndex}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -26 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute top-0 left-0 text-5xl md:text-6xl lg:text-7xl font-black whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 50%, #C026D3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {WORDS[wordIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.p
            variants={item}
            className="mt-8 max-w-lg text-lg leading-relaxed"
            style={{ color: 'rgba(203,213,225,0.82)' }}
          >
            WeThink delivers end-to-end IT consulting, cloud strategy, cybersecurity, and custom
            software — helping UAE enterprises compete and thrive in the digital age.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo('#contact')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 hover:-translate-y-1 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                boxShadow: '0 8px 32px rgba(124,58,237,0.5), 0 0 0 1px rgba(167,139,250,0.2)',
              }}
            >
              Start a Project
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.75 9h10.5M10.5 5.25L14.25 9l-3.75 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => scrollTo('#services')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 active:scale-95"
              style={{
                color: '#A78BFA',
                border: '1.5px solid rgba(167,139,250,0.35)',
                background: 'rgba(124,58,237,0.08)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Our Services
            </button>
          </motion.div>

          <motion.div variants={item} className="mt-12 flex flex-wrap items-center gap-8">
            {[
              { stat: '5+', label: 'Years' },
              { stat: '5000+', label: 'Projects' },
              { stat: '1000+', label: 'Clients' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span
                  className="text-2xl font-black"
                  style={{
                    background: 'linear-gradient(135deg, #A78BFA, #7C3AED)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {s.stat}
                </span>
                <span className="text-xs uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.75)' }}>
                  {s.label}
                </span>
              </div>
            ))}
            <div className="w-px h-10 hidden sm:block" style={{ background: 'rgba(124,58,237,0.4)' }} />
            <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(148,163,184,0.75)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Pixel, Al Reem Island
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(167,139,250,0.55)' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: '1px solid rgba(167,139,250,0.3)' }}
        >
          <div className="w-1 h-2 rounded-full bg-violet-400" />
        </motion.div>
      </motion.div>

    </section>
  )
}
