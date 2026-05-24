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
  const frameRef = useRef(0)
  const isMobileRef = useRef(false)

  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768
    // Fewer chars on mobile to avoid lag
    const count = isMobileRef.current ? 40 : 130
    const list: Char[] = []
    for (let i = 0; i < count; i++) {
      list.push({
        char: randomChar(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: isMobileRef.current
          ? 0.06 + Math.random() * 0.10   // slower on mobile
          : 0.04 + Math.random() * 0.14,
        size: 0.75 + Math.random() * 0.65,
      })
    }
    setChars(list)
  }, [])

  // Flicker — slower interval on mobile
  useEffect(() => {
    if (chars.length === 0) return
    const interval = isMobileRef.current ? 120 : 60
    const id = setInterval(() => {
      const next = new Set<number>()
      const n = isMobileRef.current ? 2 : 5
      for (let i = 0; i < n; i++) next.add(Math.floor(Math.random() * chars.length))
      setActive(next)
    }, interval)
    return () => clearInterval(id)
  }, [chars.length])

  // Rain fall — skip every other frame on mobile (≈30 fps)
  useEffect(() => {
    if (chars.length === 0) return
    const tick = () => {
      frameRef.current++
      // On mobile only update every 2nd frame
      if (!isMobileRef.current || frameRef.current % 2 === 0) {
        setChars(prev =>
          prev.map(c => {
            const nextY = c.y + c.speed
            if (nextY >= 102) {
              return { ...c, y: -4, x: Math.random() * 100, char: randomChar() }
            }
            return { ...c, y: nextY }
          })
        )
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [chars.length])

  if (chars.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
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
              color: isActive ? '#7C3AED' : 'rgba(124,58,237,0.12)',
              textShadow: isActive
                ? '0 0 10px rgba(124,58,237,0.8), 0 0 20px rgba(124,58,237,0.4)'
                : 'none',
              transform: `translate(-50%,-50%) scale(${isActive ? 1.25 : 1})`,
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
