'use client'

import { useState, useEffect, useRef } from 'react'

interface Char {
  char: string
  x: number
  y: number
  speed: number
  size: number
}

const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*+=[]{}|;:,.<>?~'

function randomChar() {
  return POOL[Math.floor(Math.random() * POOL.length)]
}

export default function HeroRain() {
  const [chars, setChars] = useState<Char[]>([])
  const [active, setActive] = useState<Set<number>>(new Set())
  const rafRef = useRef<number>(0)

  // Initialise characters once on mount
  useEffect(() => {
    const list: Char[] = []
    for (let i = 0; i < 160; i++) {
      list.push({
        char: randomChar(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.04 + Math.random() * 0.14,
        size: 0.75 + Math.random() * 0.75,
      })
    }
    setChars(list)
  }, [])

  // Flicker active (glowing) indices every 60 ms
  useEffect(() => {
    if (chars.length === 0) return
    const id = setInterval(() => {
      const next = new Set<number>()
      const n = Math.floor(Math.random() * 5) + 4
      for (let i = 0; i < n; i++) next.add(Math.floor(Math.random() * chars.length))
      setActive(next)
    }, 60)
    return () => clearInterval(id)
  }, [chars.length])

  // Rain fall loop via rAF
  useEffect(() => {
    if (chars.length === 0) return
    const tick = () => {
      setChars(prev =>
        prev.map(c => {
          const nextY = c.y + c.speed
          if (nextY >= 102) {
            return { ...c, y: -4, x: Math.random() * 100, char: randomChar() }
          }
          return { ...c, y: nextY }
        })
      )
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [chars.length])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]" aria-hidden>
      {chars.map((c, i) => {
        const isActive = active.has(i)
        return (
          <span
            key={i}
            className="absolute select-none font-mono"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              fontSize: `${c.size}rem`,
              fontWeight: isActive ? 700 : 300,
              color: isActive ? '#7C3AED' : 'rgba(124,58,237,0.13)',
              textShadow: isActive
                ? '0 0 10px rgba(124,58,237,0.85), 0 0 22px rgba(124,58,237,0.45)'
                : 'none',
              transform: `translate(-50%,-50%) scale(${isActive ? 1.3 : 1})`,
              transition: 'color 0.08s, text-shadow 0.08s, transform 0.08s',
              willChange: 'top',
            }}
          >
            {c.char}
          </span>
        )
      })}
    </div>
  )
}
