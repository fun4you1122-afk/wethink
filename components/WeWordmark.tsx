'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * WeThink / WeBuild / WeGrow, rolling like an odometer.
 *
 * "We" never moves. The word after it rolls up out of the frame while the next
 * one rolls in beneath, inside a box that clips both.
 *
 * The awkward part is keeping one gradient across the whole line while the
 * second half moves. Painting the container and letting the words inherit does
 * not survive a transform: a moving element is promoted to its own layer and
 * falls out of the ancestor's background-clip, so the word disappears. So each
 * word paints itself, but with the ramp sized to the whole line and shifted
 * left by the width of "We". The seam lands exactly where it would have if the
 * line were painted in one go, and the words are then free to move.
 */

const WORDS = ['Think', 'Build', 'Grow']
const LONGEST = WORDS.reduce((a, b) => (b.length > a.length ? b : a))
const ROLL = { duration: 0.62, ease: [0.22, 1, 0.28, 1] as const }

export default function WeWordmark({
  className = '',
  ramp = 'var(--logo-ramp)',
}: {
  className?: string
  /** swap for --logo-ramp-on-dark when the wordmark sits over video */
  ramp?: string
}) {
  const [i, setI] = useState(0)
  const [still, setStill] = useState(false)
  const [metrics, setMetrics] = useState({ we: 0, line: 0 })

  const weRef = useRef<HTMLSpanElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)

  // Measure before paint, and again whenever the line can have reflowed, so
  // the ramp offset stays right across breakpoints and font loading.
  useLayoutEffect(() => {
    const measure = () => {
      const we = weRef.current?.getBoundingClientRect().width ?? 0
      const line = lineRef.current?.getBoundingClientRect().width ?? 0
      setMetrics((m) => (Math.abs(m.we - we) < 0.5 && Math.abs(m.line - line) < 0.5 ? m : { we, line }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (lineRef.current) ro.observe(lineRef.current)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true)
      return
    }
    const id = window.setInterval(() => setI((n) => (n + 1) % WORDS.length), 2600)
    return () => window.clearInterval(id)
  }, [])

  const clip: React.CSSProperties = {
    backgroundImage: ramp,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  }

  // the same wash the whole line would have had, offset per half
  const wePaint: React.CSSProperties = {
    ...clip,
    backgroundSize: metrics.line ? `${metrics.line}px 100%` : '100% 100%',
    backgroundPosition: '0 0',
  }
  const wordPaint: React.CSSProperties = {
    ...clip,
    backgroundSize: metrics.line ? `${metrics.line}px 100%` : '100% 100%',
    backgroundPosition: metrics.we ? `-${metrics.we}px 0` : '0 0',
    backgroundRepeat: 'no-repeat',
  }

  return (
    <span
      ref={lineRef}
      className={`inline-flex items-baseline ${className}`}
      style={{ fontFamily: 'var(--font-display)' }}
    >
      <span ref={weRef} style={wePaint}>
        We
      </span>

      {still ? (
        <span style={wordPaint}>{WORDS[0]}</span>
      ) : (
        <span
          className="relative inline-block overflow-hidden align-baseline"
          aria-live="polite"
          // a touch of room top and bottom so ascenders and descenders are not
          // shaved by the clip while a word is mid-roll
          style={{ paddingTop: '0.12em', paddingBottom: '0.12em', marginTop: '-0.12em', marginBottom: '-0.12em' }}
        >
          <span className="invisible block" aria-hidden="true">
            {LONGEST}
          </span>
          <AnimatePresence initial={false}>
            <motion.span
              key={WORDS[i]}
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-105%' }}
              transition={ROLL}
              className="absolute inset-x-0 top-[0.12em] whitespace-nowrap text-left"
              style={wordPaint}
            >
              {WORDS[i]}
            </motion.span>
          </AnimatePresence>
        </span>
      )}
    </span>
  )
}
