'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const WORDS = ['Impactful Realities', 'Digital Futures', 'Smart Solutions', 'Business Growth']

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [wordIndex, setWordIndex] = useState(0)

  // Smooth mouse springs for parallax
  const springX = useSpring(mouseX, { damping: 30, stiffness: 80 })
  const springY = useSpring(mouseY, { damping: 30, stiffness: 80 })

  // Parallax transforms for layered depth
  const layer1X = useTransform(springX, [-0.5, 0.5], ['-12px', '12px'])
  const layer1Y = useTransform(springY, [-0.5, 0.5], ['-12px', '12px'])
  const layer2X = useTransform(springX, [-0.5, 0.5], ['-24px', '24px'])
  const layer2Y = useTransform(springY, [-0.5, 0.5], ['-24px', '24px'])
  const layer3X = useTransform(springX, [-0.5, 0.5], ['10px', '-10px'])
  const layer3Y = useTransform(springY, [-0.5, 0.5], ['10px', '-10px'])

  // Mouse tracking
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      mouseX.set((e.clientX / innerWidth - 0.5))
      mouseY.set((e.clientY / innerHeight - 0.5))
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [mouseX, mouseY])

  // Rotating words
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % WORDS.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  // Canvas particle network
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let mouseCanvasX = 0
    let mouseCanvasY = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouse = (e: MouseEvent) => {
      mouseCanvasX = e.clientX
      mouseCanvasY = e.clientY
    }
    window.addEventListener('mousemove', handleMouse)

    interface Particle {
      x: number; y: number
      vx: number; vy: number
      radius: number
      alpha: number
    }

    const COUNT = 90
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        // Mouse repulsion
        const dx = p.x - mouseCanvasX
        const dy = p.y - mouseCanvasY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          p.vx += (dx / dist) * force * 0.5
          p.vy += (dy / dist) * force * 0.5
        }

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 2) {
          p.vx = (p.vx / speed) * 2
          p.vy = (p.vy / speed) * 2
        }

        // Friction
        p.vx *= 0.99
        p.vy *= 0.99

        p.x += p.vx
        p.y += p.vy

        // Wrap around
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(167, 139, 250, ${p.alpha})`
        ctx.fill()
      })

      // Draw connecting lines
      const MAX_DIST = 140
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.25
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" ref={sectionRef} className="relative h-screen flex items-center overflow-hidden">
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Background gradient orbs — parallax layer 3 (counter-moves) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: layer3X, y: layer3Y, zIndex: 1 }}
      >
        <div className="orb w-[600px] h-[600px] bg-violet-800 opacity-20 top-[-200px] right-[-100px]" />
        <div className="orb w-[400px] h-[400px] bg-purple-900 opacity-25 bottom-[-100px] left-[-100px]" />
      </motion.div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-50" style={{ zIndex: 2 }} />

      {/* Noise overlay */}
      <div className="absolute inset-0 noise" style={{ zIndex: 3 }} />

      {/* Floating geometric accents — layer 1 */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ x: layer1X, y: layer1Y, top: '20%', right: '12%', zIndex: 4 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="w-32 h-32 border border-violet-500/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border border-violet-400/15 rounded-full absolute top-6 left-6"
        />
      </motion.div>

      {/* Floating accent — layer 2 */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ x: layer2X, y: layer2Y, bottom: '25%', right: '20%', zIndex: 4 }}
      >
        <div className="w-3 h-3 rounded-full bg-violet-400/60 animate-float" />
      </motion.div>

      <motion.div
        className="absolute pointer-events-none"
        style={{ x: layer1X, y: layer1Y, top: '35%', left: '8%', zIndex: 4 }}
      >
        <div className="w-2 h-2 rounded-full bg-accent/50 animate-float" style={{ animationDelay: '1.5s' }} />
      </motion.div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 w-full" style={{ zIndex: 5 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Label */}
          <motion.div variants={itemVariants}>
            <span className="section-label">
              Abu Dhabi, UAE — Est. 2019
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight text-white mt-4"
          >
            Transforming
            <br />
            <span className="gradient-text">Ideas into</span>
          </motion.h1>

          {/* Animated rotating word */}
          <motion.div
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight mt-1 h-[1.2em] overflow-hidden relative"
          >
            <motion.div
              key={wordIndex}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-white/90"
            >
              {WORDS[wordIndex]}
            </motion.div>
          </motion.div>

          {/* Sub */}
          <motion.p
            variants={itemVariants}
            className="mt-8 text-lg md:text-xl text-text-muted max-w-xl leading-relaxed"
          >
            WeThink delivers digital transformation, cloud architecture, and strategic IT consulting
            — built for ambitious businesses in the UAE and beyond.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap gap-4 items-center">
            <button onClick={() => scrollTo('#contact')} className="btn-primary text-base">
              Start a Project
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.75 9h10.5M10.5 5.25L14.25 9l-3.75 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={() => scrollTo('#services')} className="btn-outline text-base">
              Explore Services
            </button>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            variants={itemVariants}
            className="mt-14 flex flex-wrap items-center gap-6 text-sm text-text-muted"
          >
            {['5+ Years', '100+ Projects', '50+ Clients'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 5 }}
      >
        <span className="text-xs text-text-muted uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 border border-violet-400/40 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-violet-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}
