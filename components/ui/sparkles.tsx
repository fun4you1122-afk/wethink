"use client"

// Pure CSS sparkles — no external package, no workspace: issues
import { useEffect, useRef } from "react"

interface SparklesProps {
  className?: string
  color?: string
  density?: number
}

export function Sparkles({ className, color = "#9333EA", density = 40 }: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const particles = Array.from({ length: density }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.5 + Math.random() * 1.5,
      o: Math.random(),
      do: (Math.random() - 0.5) * 0.02,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.o += p.do
        if (p.o <= 0 || p.o >= 1) p.do *= -1
        ctx.globalAlpha = p.o
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", raf as unknown as EventListenerOrEventListenerObject)
      window.removeEventListener("resize", resize)
    }
  }, [color, density])

  return <canvas ref={canvasRef} className={className} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
}
