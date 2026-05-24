"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"

interface Character {
  char: string
  x: number
  y: number
  speed: number
  size: number
}

class TextScramble {
  el: HTMLElement
  chars: string
  queue: Array<{ from: string; to: string; start: number; end: number; char?: string }>
  frame: number
  frameRequest: number
  resolve: (value: void | PromiseLike<void>) => void

  constructor(el: HTMLElement) {
    this.el = el
    this.chars = "!<>-_\\/[]{}—=+*^?#"
    this.queue = []
    this.frame = 0
    this.frameRequest = 0
    this.resolve = () => {}
    this.update = this.update.bind(this)
  }

  setText(newText: string) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise<void>((resolve) => (this.resolve = resolve))
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ""
      const to = newText[i] || ""
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = ""
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      const { from, to, start, end } = this.queue[i]
      let { char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)]
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
}

const ScrambledTitle: React.FC = () => {
  const elementRef = useRef<HTMLHeadingElement>(null)
  const scramblerRef = useRef<TextScramble | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (elementRef.current && !scramblerRef.current) {
      scramblerRef.current = new TextScramble(elementRef.current)
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (mounted && scramblerRef.current) {
      const phrases = [
        "Hello, wethink.",
        "It's RAINING",
        "with letters",
        "and alphabets",
        "don't FORGET to bring",
        "your umbrella today",
      ]
      let counter = 0
      const next = () => {
        if (scramblerRef.current) {
          scramblerRef.current.setText(phrases[counter]).then(() => {
            setTimeout(next, 2000)
          })
          counter = (counter + 1) % phrases.length
        }
      }
      next()
    }
  }, [mounted])

  return (
    <h1
      ref={elementRef}
      className="text-white text-4xl sm:text-6xl font-bold tracking-wider text-center"
      style={{ fontFamily: "monospace" }}
    >
      RAINING LETTERS
    </h1>
  )
}

export default function Hero() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set())
  const isMobileRef = useRef(false)
  const frameRef = useRef(0)
  const rafRef = useRef(0)

  const createCharacters = useCallback(() => {
    const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
    const count = isMobileRef.current ? 80 : 300
    const list: Character[] = []
    for (let i = 0; i < count; i++) {
      list.push({
        char: allChars[Math.floor(Math.random() * allChars.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: isMobileRef.current ? 0.06 + Math.random() * 0.1 : 0.1 + Math.random() * 0.3,
        size: 1.2 + Math.random() * 0.8,
      })
    }
    return list
  }, [])

  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768
    setCharacters(createCharacters())
  }, [createCharacters])

  // Flicker
  useEffect(() => {
    if (characters.length === 0) return
    const interval = isMobileRef.current ? 120 : 50
    const n = isMobileRef.current ? 3 : 6
    const id = setInterval(() => {
      const next = new Set<number>()
      for (let i = 0; i < n; i++) next.add(Math.floor(Math.random() * characters.length))
      setActiveIndices(next)
    }, interval)
    return () => clearInterval(id)
  }, [characters.length])

  // Fall — skip every other frame on mobile
  useEffect(() => {
    if (characters.length === 0) return
    const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
    const tick = () => {
      frameRef.current++
      if (!isMobileRef.current || frameRef.current % 2 === 0) {
        setCharacters((prev) =>
          prev.map((c) => {
            const nextY = c.y + c.speed
            if (nextY >= 102) {
              return { ...c, y: -4, x: Math.random() * 100, char: allChars[Math.floor(Math.random() * allChars.length)] }
            }
            return { ...c, y: nextY }
          })
        )
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [characters.length])

  return (
    <section id="home" className="relative w-full h-screen bg-black overflow-hidden">
      {/* Scrambled title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-4">
        <ScrambledTitle />
      </div>

      {/* Raining characters */}
      {characters.map((c, i) => {
        const isActive = activeIndices.has(i)
        return (
          <span
            key={i}
            className="absolute select-none font-mono"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              fontSize: `${c.size}rem`,
              fontWeight: isActive ? 700 : 300,
              color: isActive ? "#00ff00" : "rgba(0,255,0,0.08)",
              textShadow: isActive
                ? "0 0 8px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.4)"
                : "none",
              transform: `translate(-50%,-50%) scale(${isActive ? 1.25 : 1})`,
              transition: "color 0.1s, text-shadow 0.1s, transform 0.1s",
              willChange: "top",
            }}
          >
            {c.char}
          </span>
        )
      })}
    </section>
  )
}
