'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTimeOfDay } from './useTimeOfDay'

/**
 * Loy Krathong, on a phone.
 *
 * A guest writes a wish, releases a lit krathong, and it drifts away down the
 * water with buoyancy, sway, and a wake. Wishes are kept on the visitor's own
 * device, never sent anywhere, and the float they released is waiting when they
 * come back.
 *
 * The canvas is only mounted once the section is on screen, and never runs
 * under prefers-reduced-motion, where the wish is simply acknowledged in text.
 */

type Float = { id: number; text: string; x: number; y: number; vx: number; phase: number; born: number }

const STORE = 'wt:marhaba:wishes'

export default function KrathongRelease() {
  const p = useTimeOfDay()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const floatsRef = useRef<Float[]>([])
  const [wish, setWish] = useState('')
  const [released, setReleased] = useState<string[]>([])
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) ?? '[]')
      if (Array.isArray(saved)) {
        setReleased(saved)
        saved.slice(-4).forEach((t: string, i: number) => spawn(t, 0.15 + i * 0.2))
      }
    } catch {
      /* storage unavailable, start empty */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const spawn = (text: string, atX?: number) => {
    const canvas = canvasRef.current
    const w = canvas?.clientWidth ?? 320
    floatsRef.current.push({
      id: Math.floor(performance.now() * 1000) + floatsRef.current.length,
      text,
      x: atX != null ? w * atX : -30,
      y: 0.55 + Math.random() * 0.22,
      vx: 0.22 + Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
      born: performance.now(),
    })
  }

  const release = (e: React.FormEvent) => {
    e.preventDefault()
    const text = wish.trim()
    if (!text) return
    const next = [...released, text].slice(-12)
    setReleased(next)
    try {
      localStorage.setItem(STORE, JSON.stringify(next))
    } catch {
      /* non-fatal */
    }
    if (!reduced) spawn(text)
    setWish('')
  }

  /* ── the water ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || reduced) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0, h = 0, t = 0, raf = 0, running = false

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const frame = () => {
      raf = requestAnimationFrame(frame)
      t += 0.016
      ctx.clearRect(0, 0, w, h)

      // water
      const water = ctx.createLinearGradient(0, 0, 0, h)
      water.addColorStop(0, p.isDark ? 'rgba(1,32,40,0.9)' : 'rgba(2,110,128,0.16)')
      water.addColorStop(1, p.isDark ? 'rgba(0,14,20,0.95)' : 'rgba(1,88,102,0.28)')
      ctx.fillStyle = water
      ctx.fillRect(0, 0, w, h)

      // ripples
      ctx.strokeStyle = p.isDark ? 'rgba(140,220,235,0.10)' : 'rgba(255,255,255,0.35)'
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        const y = h * (0.25 + i * 0.16)
        ctx.beginPath()
        for (let x = 0; x <= w; x += 8) {
          const yy = y + Math.sin(x * 0.02 + t * 0.8 + i) * 3
          x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy)
        }
        ctx.stroke()
      }

      for (const f of floatsRef.current) {
        f.x += f.vx
        const y = h * f.y + Math.sin(t * 1.4 + f.phase) * 3.5
        const tilt = Math.sin(t * 1.4 + f.phase) * 0.06

        ctx.save()
        ctx.translate(f.x, y)
        ctx.rotate(tilt)

        // glow on the water
        const glow = ctx.createRadialGradient(0, -6, 0, 0, -6, 34)
        glow.addColorStop(0, 'rgba(255,198,110,0.55)')
        glow.addColorStop(1, 'rgba(255,198,110,0)')
        ctx.fillStyle = glow
        ctx.beginPath(); ctx.arc(0, -6, 34, 0, Math.PI * 2); ctx.fill()

        // banana-leaf base
        ctx.fillStyle = p.isDark ? '#1E5E52' : '#2E7D6B'
        ctx.beginPath(); ctx.ellipse(0, 0, 17, 6.5, 0, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = p.isDark ? '#16463E' : '#256454'
        ctx.beginPath(); ctx.ellipse(0, 2.5, 17, 5, 0, 0, Math.PI); ctx.fill()

        // petals
        ctx.fillStyle = p.isDark ? '#E9C6C0' : '#F0CEC6'
        for (let i = 0; i < 7; i++) {
          const a = (i / 7) * Math.PI * 2
          ctx.beginPath()
          ctx.ellipse(Math.cos(a) * 11, -2 + Math.sin(a) * 3.4, 4.6, 2.9, a, 0, Math.PI * 2)
          ctx.fill()
        }

        // candle and flame
        ctx.fillStyle = '#FFF3DA'
        ctx.fillRect(-1.6, -13, 3.2, 9)
        const flame = 3.2 + Math.sin(t * 9 + f.phase) * 0.9
        const fg = ctx.createRadialGradient(0, -15, 0, 0, -15, flame * 2.4)
        fg.addColorStop(0, '#FFF6D8')
        fg.addColorStop(0.45, '#FFC44E')
        fg.addColorStop(1, 'rgba(255,150,40,0)')
        ctx.fillStyle = fg
        ctx.beginPath(); ctx.ellipse(0, -15, flame, flame * 1.7, 0, 0, Math.PI * 2); ctx.fill()

        ctx.restore()

        // wake
        ctx.strokeStyle = p.isDark ? 'rgba(255,200,120,0.22)' : 'rgba(255,255,255,0.5)'
        ctx.beginPath()
        ctx.moveTo(f.x - 20, y + 7)
        ctx.lineTo(f.x - 52 - Math.sin(t + f.phase) * 6, y + 7)
        ctx.stroke()
      }

      floatsRef.current = floatsRef.current.filter((f) => f.x < w + 60)
    }

    resize()
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; frame() }
      else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf) }
    })
    io.observe(canvas)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', resize)
    }
  }, [reduced, p.isDark])

  return (
    <div className="overflow-hidden rounded-[22px] border" style={{ borderColor: p.panelBorder }}>
      <div className="relative h-[190px] w-full sm:h-[220px]">
        <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
        {!reduced && floatsRef.current.length === 0 && released.length === 0 && (
          <p
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-[13px] italic"
            style={{ color: p.isDark ? 'rgba(220,245,250,0.6)' : 'rgba(1,88,102,0.55)' }}
          >
            the water is still
          </p>
        )}
      </div>

      <form onSubmit={release} className="flex gap-2 p-3" style={{ background: p.panel }}>
        <input
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          maxLength={80}
          placeholder="Make a wish, then release your krathong"
          aria-label="Your wish"
          className="min-w-0 flex-1 rounded-full border px-4 py-2.5 text-[14px] outline-none focus:border-[#037A8A]"
          style={{ borderColor: 'rgba(3,122,138,0.25)', background: 'rgba(255,255,255,0.9)', color: '#0C3A42' }}
        />
        <button
          type="submit"
          className="flex-shrink-0 rounded-full px-5 py-2.5 text-[12.5px] font-medium uppercase tracking-[0.08em] text-white"
          style={{ background: 'linear-gradient(135deg,#015866,#029FB1)' }}
        >
          Release
        </button>
      </form>

      <AnimatePresence>
        {released.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 pb-3 text-center text-[12px] italic"
            style={{ background: p.panel, color: '#46707A' }}
          >
            {released.length === 1
              ? 'One krathong released. ขอให้สมหวัง — may your wish come true.'
              : `${released.length} krathong released. ขอให้สมหวัง — may your wishes come true.`}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
