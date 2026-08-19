'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

/**
 * The atmospheric layer: the effects that make the page feel alive without
 * belonging to any one section.
 *
 *   Spotlight   a soft light that follows the cursor across the page
 *   SkewOnScroll the column leans into the direction you are scrolling
 *   Magnetic    buttons that reach toward the pointer
 *   ChapterRail where you are in the story, named
 *
 * All of it is pointer-driven and desktop-only, and none of it runs under
 * prefers-reduced-motion.
 */

function useFine() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const ok =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setFine(ok)
  }, [])
  return fine
}

/* ── a light that follows the cursor ────────────────────── */

export function Spotlight() {
  const fine = useFine()
  const x = useMotionValue(-500)
  const y = useMotionValue(-500)
  const sx = useSpring(x, { stiffness: 140, damping: 26, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 140, damping: 26, mass: 0.5 })

  useEffect(() => {
    if (!fine) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [fine, x, y])

  if (!fine) return null

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[35] h-[520px] w-[520px] rounded-full"
        style={{
          left: sx,
          top: sy,
          x: '-50%',
          y: '-50%',
          background:
            'radial-gradient(circle, rgba(1,193,213,0.16) 0%, rgba(1,193,213,0.06) 38%, transparent 68%)',
          mixBlendMode: 'screen',
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[36] h-3 w-3 rounded-full"
        style={{
          left: x,
          top: y,
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle, rgba(1,193,213,0.9), rgba(1,193,213,0))',
        }}
      />
    </>
  )
}

/* ── the column leans into the scroll ───────────────────── */

export function SkewOnScroll({ children }: { children: React.ReactNode }) {
  const fine = useFine()
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { stiffness: 260, damping: 42, mass: 0.35 })
  const skew = useTransform(smooth, [-2600, 0, 2600], [2.2, 0, -2.2], { clamp: true })

  return (
    <motion.div style={fine ? { skewY: skew, willChange: 'transform' } : undefined}>
      {children}
    </motion.div>
  )
}

/* ── buttons that reach for the pointer ─────────────────── */

export function Magnetic({
  children,
  strength = 0.32,
  className = '',
}: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const fine = useFine()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 })

  const move = (e: React.PointerEvent) => {
    if (!fine) return
    const el = ref.current
    if (!el) return
    const b = el.getBoundingClientRect()
    x.set((e.clientX - (b.left + b.width / 2)) * strength)
    y.set((e.clientY - (b.top + b.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
    >
      {children}
    </motion.span>
  )
}

/* ── where you are in the story ─────────────────────────── */

export function ChapterRail({ chapters }: { chapters: { id: string; label: string }[] }) {
  const fine = useFine()
  const [active, setActive] = useState(0)

  useEffect(() => {
    const nodes = chapters
      .map((c) => document.getElementById(c.id))
      .filter(Boolean) as HTMLElement[]
    if (!nodes.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const i = nodes.indexOf(e.target as HTMLElement)
          if (i >= 0) setActive(i)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [chapters])

  if (!fine) return null

  return (
    <nav
      aria-label="Sections"
      className="pointer-events-none fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
    >
      {chapters.map((c, i) => (
        <div key={c.id} className="flex items-center gap-2.5">
          <motion.span
            className="block h-px origin-left"
            animate={{
              width: i === active ? 26 : 12,
              backgroundColor: i === active ? '#026B79' : 'rgba(3,122,138,0.35)',
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.span
            className="text-[10px] uppercase tracking-[0.18em]"
            animate={{
              opacity: i === active ? 1 : 0.42,
              color: i === active ? '#014653' : '#3A737F',
            }}
            transition={{ duration: 0.45 }}
          >
            {c.label}
          </motion.span>
        </div>
      ))}
    </nav>
  )
}
