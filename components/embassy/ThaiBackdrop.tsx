'use client'

import { useEffect, useRef } from 'react'

/**
 * Animated Thai-inspired backdrop, drawn on a single 2D canvas.
 *
 * Three layers, back to front:
 *   1. a soft gradient wash (jasmine cream -> blush -> lavender)
 *   2. gilded chedi/prang silhouettes along the bottom, in two parallax bands
 *   3. drifting lotus petals and floating gold motes
 *
 * Follows the same performance contract as the rest of the site: one static
 * frame under prefers-reduced-motion, animation paused while offscreen, and
 * device pixel ratio capped at 2.
 */

type Petal = {
  x: number
  y: number
  size: number
  rot: number
  spin: number
  vy: number
  vx: number
  sway: number
  phase: number
  color: string
  alpha: number
}

type Mote = {
  x: number
  y: number
  r: number
  vy: number
  phase: number
  speed: number
}

const PETAL_COLORS = ['#9FDDE8', '#6FC7D8', '#CBEEF3', '#B7E4E9', '#029FB1']

/** One lotus petal, centred on the origin, pointing up. */
function petalPath(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath()
  ctx.moveTo(0, -size)
  ctx.bezierCurveTo(size * 0.62, -size * 0.5, size * 0.5, size * 0.45, 0, size * 0.72)
  ctx.bezierCurveTo(-size * 0.5, size * 0.45, -size * 0.62, -size * 0.5, 0, -size)
  ctx.closePath()
}

/** A stylised Thai chedi — tiered base, tapering spire, ringed needle. */
function chedi(ctx: CanvasRenderingContext2D, x: number, base: number, h: number) {
  const w = h * 0.34

  // tiered plinth
  ctx.beginPath()
  ctx.moveTo(x - w, base)
  ctx.lineTo(x + w, base)
  ctx.lineTo(x + w * 0.78, base - h * 0.13)
  ctx.lineTo(x - w * 0.78, base - h * 0.13)
  ctx.closePath()
  ctx.fill()

  // bell
  ctx.beginPath()
  ctx.moveTo(x - w * 0.72, base - h * 0.13)
  ctx.bezierCurveTo(
    x - w * 0.66, base - h * 0.46,
    x - w * 0.3, base - h * 0.58,
    x, base - h * 0.62,
  )
  ctx.bezierCurveTo(
    x + w * 0.3, base - h * 0.58,
    x + w * 0.66, base - h * 0.46,
    x + w * 0.72, base - h * 0.13,
  )
  ctx.closePath()
  ctx.fill()

  // needle
  ctx.beginPath()
  ctx.moveTo(x, base - h)
  ctx.lineTo(x + w * 0.13, base - h * 0.6)
  ctx.lineTo(x - w * 0.13, base - h * 0.6)
  ctx.closePath()
  ctx.fill()

  // rings up the needle
  for (let i = 0; i < 3; i++) {
    const ry = base - h * (0.66 + i * 0.07)
    const rw = w * (0.2 - i * 0.045)
    ctx.beginPath()
    ctx.ellipse(x, ry, rw, rw * 0.34, 0, 0, Math.PI * 2)
    ctx.fill()
  }
}

/** A row of chedis + a temple roofline, used for each parallax band. */
function skyline(
  ctx: CanvasRenderingContext2D,
  w: number,
  baseY: number,
  scale: number,
  color: string,
  alpha: number,
  shift: number,
) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.translate(shift, 0)

  const step = 190 * scale
  for (let i = -1; i * step < w + step * 2; i++) {
    const x = i * step + step * 0.5
    const h = (i % 3 === 0 ? 150 : i % 3 === 1 ? 96 : 122) * scale
    chedi(ctx, x, baseY, h)

    // low temple roof between spires
    if (i % 3 === 1) {
      const rw = step * 0.42
      ctx.beginPath()
      ctx.moveTo(x + step * 0.4 - rw, baseY)
      ctx.lineTo(x + step * 0.4, baseY - 46 * scale)
      ctx.lineTo(x + step * 0.4 + rw, baseY)
      ctx.closePath()
      ctx.fill()
    }
  }
  ctx.restore()
}

export default function ThaiBackdrop({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compact = window.innerWidth < 720

    let w = 0
    let h = 0
    let petals: Petal[] = []
    let motes: Mote[] = []

    const seed = () => {
      const petalCount = compact ? 9 : 18
      petals = Array.from({ length: petalCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 7 + Math.random() * 13,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.006,
        vy: 0.12 + Math.random() * 0.3,
        vx: (Math.random() - 0.5) * 0.16,
        sway: 14 + Math.random() * 26,
        phase: Math.random() * Math.PI * 2,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        alpha: 0.3 + Math.random() * 0.4,
      }))

      const moteCount = compact ? 14 : 30
      motes = Array.from({ length: moteCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.7 + Math.random() * 1.7,
        vy: 0.1 + Math.random() * 0.26,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
      }))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    // pointer parallax, eased toward the target each frame
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const onPointer = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth - 0.5
      pointer.ty = e.clientY / window.innerHeight - 0.5
    }

    let t = 0

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      pointer.x += (pointer.tx - pointer.x) * 0.06
      pointer.y += (pointer.ty - pointer.y) * 0.06

      // 1 — gradient wash
      const wash = ctx.createLinearGradient(0, 0, w * 0.6, h)
      wash.addColorStop(0, 'rgba(159,221,232,0.30)')
      wash.addColorStop(0.45, 'rgba(203,238,243,0.22)')
      wash.addColorStop(0.75, 'rgba(183,228,233,0.20)')
      wash.addColorStop(1, 'rgba(2,159,177,0.20)')
      ctx.fillStyle = wash
      ctx.fillRect(0, 0, w, h)

      const glow = ctx.createRadialGradient(w * 0.5, h * 0.18, 0, w * 0.5, h * 0.18, h * 0.55)
      glow.addColorStop(0, 'rgba(240,252,254,0.55)')
      glow.addColorStop(1, 'rgba(240,252,254,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      // 2 — gilded skyline, far band then near band
      const baseY = h + 2
      skyline(ctx, w, baseY, compact ? 0.7 : 1, '#029FB1', 0.16, pointer.x * -18)
      skyline(ctx, w, baseY, compact ? 0.48 : 0.66, '#037A8A', 0.13, pointer.x * -34 + 120)

      // 3 — petals
      for (const p of petals) {
        ctx.save()
        ctx.translate(
          p.x + Math.sin(t * 0.4 + p.phase) * p.sway + pointer.x * 22,
          p.y + pointer.y * 14,
        )
        ctx.rotate(p.rot)
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        petalPath(ctx, p.size)
        ctx.fill()
        // crease
        ctx.globalAlpha = p.alpha * 0.4
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(0, -p.size * 0.8)
        ctx.lineTo(0, p.size * 0.55)
        ctx.stroke()
        ctx.restore()
      }

      // gold motes
      for (const m of motes) {
        const tw = 0.35 + Math.abs(Math.sin(t + m.phase)) * 0.6
        ctx.globalAlpha = tw * 0.7
        ctx.fillStyle = '#029FB1'
        ctx.beginPath()
        ctx.arc(m.x + pointer.x * 30, m.y + pointer.y * 18, m.r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
    }

    const step = () => {
      t += 0.016

      for (const p of petals) {
        p.y += p.vy
        p.x += p.vx
        p.rot += p.spin
        if (p.y - p.size > h) {
          p.y = -p.size * 2
          p.x = Math.random() * w
        }
        if (p.x < -60) p.x = w + 40
        if (p.x > w + 60) p.x = -40
      }

      for (const m of motes) {
        m.y -= m.vy
        m.phase += m.speed
        if (m.y < -4) {
          m.y = h + 4
          m.x = Math.random() * w
        }
      }

      draw()
    }

    let raf = 0
    let running = false
    const loop = () => {
      raf = requestAnimationFrame(loop)
      step()
    }

    resize()
    draw()

    if (!reduced) {
      running = true
      loop()
      window.addEventListener('pointermove', onPointer, { passive: true })
    }

    // don't burn frames while the backdrop is scrolled out of view
    const io = new IntersectionObserver(([entry]) => {
      if (reduced) return
      if (entry.isIntersecting && !running) {
        running = true
        loop()
      } else if (!entry.isIntersecting && running) {
        running = false
        cancelAnimationFrame(raf)
      }
    })
    io.observe(canvas)

    const onResize = () => {
      resize()
      draw()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 h-full w-full ${className}`}
    />
  )
}
