'use client'

import { useEffect, useRef } from 'react'
import { useTimeOfDay, type Palette } from './useTimeOfDay'

/**
 * The sky behind every Marhaba Thailand page, drawn on one 2D canvas and
 * driven by the hour in Abu Dhabi.
 *
 * Back to front: a sky wash for the current phase, stars once the sun is down,
 * gilded chedi silhouettes in two parallax bands, khom loi lanterns rising
 * through the dark, and drifting lotus petals over everything.
 *
 * Parallax follows the pointer on a desktop and the device's tilt on a phone.
 * One static frame under prefers-reduced-motion, paused while offscreen, and
 * device pixel ratio capped at 2.
 */

type Petal = {
  x: number; y: number; size: number; rot: number; spin: number
  vy: number; vx: number; sway: number; phase: number; alpha: number
}
type Mote = { x: number; y: number; r: number; vy: number; phase: number; speed: number }
type Star = { x: number; y: number; r: number; phase: number; speed: number }
type Lantern = { x: number; y: number; r: number; vy: number; sway: number; phase: number; hue: number }

function petalPath(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath()
  ctx.moveTo(0, -size)
  ctx.bezierCurveTo(size * 0.62, -size * 0.5, size * 0.5, size * 0.45, 0, size * 0.72)
  ctx.bezierCurveTo(-size * 0.5, size * 0.45, -size * 0.62, -size * 0.5, 0, -size)
  ctx.closePath()
}

function chedi(ctx: CanvasRenderingContext2D, x: number, base: number, h: number) {
  const w = h * 0.34
  ctx.beginPath()
  ctx.moveTo(x - w, base); ctx.lineTo(x + w, base)
  ctx.lineTo(x + w * 0.78, base - h * 0.13); ctx.lineTo(x - w * 0.78, base - h * 0.13)
  ctx.closePath(); ctx.fill()

  ctx.beginPath()
  ctx.moveTo(x - w * 0.72, base - h * 0.13)
  ctx.bezierCurveTo(x - w * 0.66, base - h * 0.46, x - w * 0.3, base - h * 0.58, x, base - h * 0.62)
  ctx.bezierCurveTo(x + w * 0.3, base - h * 0.58, x + w * 0.66, base - h * 0.46, x + w * 0.72, base - h * 0.13)
  ctx.closePath(); ctx.fill()

  ctx.beginPath()
  ctx.moveTo(x, base - h)
  ctx.lineTo(x + w * 0.13, base - h * 0.6); ctx.lineTo(x - w * 0.13, base - h * 0.6)
  ctx.closePath(); ctx.fill()

  for (let i = 0; i < 3; i++) {
    const ry = base - h * (0.66 + i * 0.07)
    const rw = w * (0.2 - i * 0.045)
    ctx.beginPath(); ctx.ellipse(x, ry, rw, rw * 0.34, 0, 0, Math.PI * 2); ctx.fill()
  }
}

function skyline(
  ctx: CanvasRenderingContext2D, w: number, baseY: number,
  scale: number, color: string, alpha: number, shift: number,
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
    if (i % 3 === 1) {
      const rw = step * 0.42
      ctx.beginPath()
      ctx.moveTo(x + step * 0.4 - rw, baseY)
      ctx.lineTo(x + step * 0.4, baseY - 46 * scale)
      ctx.lineTo(x + step * 0.4 + rw, baseY)
      ctx.closePath(); ctx.fill()
    }
  }
  ctx.restore()
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

export default function ThaiBackdrop({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const palette = useTimeOfDay()
  // the loop reads the latest palette without being torn down each hour
  const paletteRef = useRef<Palette>(palette)
  paletteRef.current = palette

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compact = window.innerWidth < 720

    let w = 0, h = 0
    let petals: Petal[] = [], motes: Mote[] = [], stars: Star[] = [], lanterns: Lantern[] = []

    const seed = () => {
      petals = Array.from({ length: compact ? 9 : 18 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        size: 7 + Math.random() * 13, rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.006,
        vy: 0.12 + Math.random() * 0.3, vx: (Math.random() - 0.5) * 0.16,
        sway: 14 + Math.random() * 26, phase: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.4,
      }))
      motes = Array.from({ length: compact ? 14 : 30 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: 0.7 + Math.random() * 1.7, vy: 0.1 + Math.random() * 0.26,
        phase: Math.random() * Math.PI * 2, speed: 0.01 + Math.random() * 0.02,
      }))
      stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * w, y: Math.random() * h * 0.72,
        r: 0.5 + Math.random() * 1.3, phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.03,
      }))
      lanterns = Array.from({ length: 18 }, () => ({
        x: Math.random() * w, y: h + Math.random() * h,
        r: 4 + Math.random() * 6, vy: 0.12 + Math.random() * 0.22,
        sway: 10 + Math.random() * 30, phase: Math.random() * Math.PI * 2,
        hue: Math.random(),
      }))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const onPointer = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth - 0.5
      pointer.ty = e.clientY / window.innerHeight - 0.5
    }
    // phones have no pointer, so the scene follows how the device is held
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      pointer.tx = Math.max(-0.5, Math.min(0.5, e.gamma / 45))
      pointer.ty = Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 60))
    }

    let t = 0

    const draw = () => {
      const p = paletteRef.current
      ctx.clearRect(0, 0, w, h)
      pointer.x += (pointer.tx - pointer.x) * 0.06
      pointer.y += (pointer.ty - pointer.y) * 0.06

      // 1 — sky for this hour
      const sky = ctx.createLinearGradient(0, 0, w * 0.35, h)
      sky.addColorStop(0, p.sky[0])
      sky.addColorStop(0.55, p.sky[1])
      sky.addColorStop(1, p.sky[2])
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, w, h)

      // 2 — stars, once the sun is down
      if (p.stars > 0) {
        const count = Math.min(p.stars, stars.length)
        for (let i = 0; i < count; i++) {
          const s = stars[i]
          const tw = 0.35 + Math.abs(Math.sin(t * 1.6 + s.phase)) * 0.65
          ctx.globalAlpha = tw * (p.isDark ? 0.9 : 0.35)
          ctx.fillStyle = '#FFFFFF'
          ctx.beginPath()
          ctx.arc(s.x + pointer.x * 10, s.y + pointer.y * 6, s.r, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }

      // 3 — the horizon
      const baseY = h + 2
      skyline(ctx, w, baseY, compact ? 0.7 : 1, p.silhouette, p.isDark ? 0.55 : 0.16, pointer.x * -18)
      skyline(ctx, w, baseY, compact ? 0.48 : 0.66, p.silhouette, p.isDark ? 0.75 : 0.13, pointer.x * -34 + 120)

      // 4 — khom loi rising through the dark
      if (p.lanterns > 0) {
        const count = Math.min(p.lanterns, lanterns.length)
        for (let i = 0; i < count; i++) {
          const l = lanterns[i]
          const x = l.x + Math.sin(t * 0.3 + l.phase) * l.sway + pointer.x * 26
          const glow = ctx.createRadialGradient(x, l.y, 0, x, l.y, l.r * 5)
          glow.addColorStop(0, 'rgba(255,196,110,0.55)')
          glow.addColorStop(1, 'rgba(255,196,110,0)')
          ctx.fillStyle = glow
          ctx.beginPath(); ctx.arc(x, l.y, l.r * 5, 0, Math.PI * 2); ctx.fill()

          ctx.fillStyle = l.hue > 0.5 ? '#FFD79A' : '#FFC46E'
          ctx.beginPath()
          ctx.ellipse(x, l.y, l.r * 0.72, l.r, 0, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // 5 — petals over everything
      for (const petal of petals) {
        ctx.save()
        ctx.translate(
          petal.x + Math.sin(t * 0.4 + petal.phase) * petal.sway + pointer.x * 22,
          petal.y + pointer.y * 14,
        )
        ctx.rotate(petal.rot)
        ctx.globalAlpha = petal.alpha * (p.isDark ? 0.55 : 1)
        ctx.fillStyle = p.accent
        petalPath(ctx, petal.size)
        ctx.fill()
        ctx.globalAlpha = petal.alpha * 0.4
        ctx.strokeStyle = p.isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.9)'
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(0, -petal.size * 0.8); ctx.lineTo(0, petal.size * 0.55)
        ctx.stroke()
        ctx.restore()
      }

      const [ar, ag, ab] = hexToRgb(p.accent)
      for (const m of motes) {
        const tw = 0.35 + Math.abs(Math.sin(t + m.phase)) * 0.6
        ctx.globalAlpha = tw * 0.7
        ctx.fillStyle = `rgb(${ar},${ag},${ab})`
        ctx.beginPath()
        ctx.arc(m.x + pointer.x * 30, m.y + pointer.y * 18, m.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const step = () => {
      t += 0.016
      for (const p of petals) {
        p.y += p.vy; p.x += p.vx; p.rot += p.spin
        if (p.y - p.size > h) { p.y = -p.size * 2; p.x = Math.random() * w }
        if (p.x < -60) p.x = w + 40
        if (p.x > w + 60) p.x = -40
      }
      for (const m of motes) {
        m.y -= m.vy; m.phase += m.speed
        if (m.y < -4) { m.y = h + 4; m.x = Math.random() * w }
      }
      for (const l of lanterns) {
        l.y -= l.vy
        if (l.y < -40) { l.y = h + 20 + Math.random() * h * 0.4; l.x = Math.random() * w }
      }
      draw()
    }

    let raf = 0
    let running = false
    const loop = () => { raf = requestAnimationFrame(loop); step() }

    resize()
    draw()

    if (!reduced) {
      running = true
      loop()
      window.addEventListener('pointermove', onPointer, { passive: true })
      window.addEventListener('deviceorientation', onTilt, true)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (reduced) return
      if (entry.isIntersecting && !running) { running = true; loop() }
      else if (!entry.isIntersecting && running) { running = false; cancelAnimationFrame(raf) }
    })
    io.observe(canvas)

    const onResize = () => { resize(); draw() }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('deviceorientation', onTilt, true)
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
