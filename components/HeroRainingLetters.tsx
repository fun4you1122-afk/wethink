'use client'

import { useState, useEffect, useCallback } from 'react'

interface Character {
  char: string
  x: number
  y: number
  speed: number
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'

export default function HeroRainingLetters() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set())

  const createCharacters = useCallback(() => {
    const result: Character[] = []
    for (let i = 0; i < 300; i++) {
      result.push({
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.1 + Math.random() * 0.3,
      })
    }
    return result
  }, [])

  useEffect(() => {
    setCharacters(createCharacters())
  }, [createCharacters])

  // Flicker a few random characters bright
  useEffect(() => {
    const id = setInterval(() => {
      const next = new Set<number>()
      const count = Math.floor(Math.random() * 3) + 3
      for (let i = 0; i < count; i++) {
        next.add(Math.floor(Math.random() * 300))
      }
      setActiveIndices(next)
    }, 50)
    return () => clearInterval(id)
  }, [])

  // rAF loop — fall and wrap
  useEffect(() => {
    let rafId: number
    const tick = () => {
      setCharacters(prev =>
        prev.map(c => ({
          ...c,
          y: c.y + c.speed,
          ...(c.y >= 100 && {
            y: -5,
            x: Math.random() * 100,
            char: CHARS[Math.floor(Math.random() * CHARS.length)],
          }),
        }))
      )
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {characters.map((c, i) => (
        <span
          key={i}
          className="absolute select-none"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: '1.8rem',
            fontFamily: 'monospace',
            fontWeight: activeIndices.has(i) ? 700 : 300,
            color: activeIndices.has(i) ? '#A78BFA' : '#3b1f6a',
            opacity: activeIndices.has(i) ? 0.9 : 0.35,
            textShadow: activeIndices.has(i)
              ? '0 0 10px rgba(167,139,250,0.7), 0 0 20px rgba(124,58,237,0.4)'
              : 'none',
            transition: 'color 0.1s, text-shadow 0.1s',
            willChange: 'top',
          }}
        >
          {c.char}
        </span>
      ))}
    </div>
  )
}
