'use client'

import { useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
const N = 300
const CHAR_SIZE = 28

type Char = { x: number; y: number; speed: number; char: string }

export default function RainingLettersBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const chars: Char[] = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: 0.0004 + Math.random() * 0.0014,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
    }))

    const activeSet = new Set<number>()

    function resize() {
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas!)

    const flickerTimer = setInterval(() => {
      activeSet.clear()
      const n = 3 + Math.floor(Math.random() * 4)
      for (let i = 0; i < n; i++) activeSet.add(Math.floor(Math.random() * N))
    }, 50)

    let raf = 0
    function draw() {
      raf = requestAnimationFrame(draw)
      if (!canvas) return
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i < chars.length; i++) {
        const c = chars[i]
        c.y += c.speed
        if (c.y > 1.06) {
          c.y = -0.04
          c.x = Math.random()
          c.char = CHARS[Math.floor(Math.random() * CHARS.length)]
        }

        const cx = c.x * W
        const cy = c.y * H
        const active = activeSet.has(i)

        ctx.save()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        if (active) {
          ctx.font = `bold ${CHAR_SIZE * 1.18}px monospace`
          ctx.fillStyle = '#E2D9FE'
          ctx.shadowColor = '#A78BFA'
          ctx.shadowBlur = 14
          ctx.globalAlpha = 1
        } else {
          ctx.font = `${CHAR_SIZE}px monospace`
          ctx.fillStyle = 'rgba(167,139,250,0.22)'
          ctx.shadowBlur = 0
          ctx.globalAlpha = 0.45
        }

        ctx.fillText(c.char, cx, cy)
        ctx.restore()
      }
    }

    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); clearInterval(flickerTimer); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}
