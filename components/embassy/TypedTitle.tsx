'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * The title, typed.
 *
 * Two layers sit on top of each other. Underneath, a hidden copy of the full
 * text reserves the exact final box, so nothing on the page moves while the
 * line is being written. On top, a layer of the same size holds however much
 * has been typed so far, plus the caret.
 *
 * Because the visible layer is always the full final size, the gradient's box
 * never changes — the ramp stays put while the letters arrive, and the sheen
 * keeps travelling across it afterwards.
 *
 * Nothing here transforms a glyph. Per-character transforms push each letter
 * into its own layer, where a background-clip:text gradient cannot reach it,
 * which is what produced the artefacts in the earlier version.
 */

export default function TypedTitle({
  text,
  className = '',
  style,
  gradient,
  solid,
  delay = 0.35,
  speed = 62,
}: {
  text: string
  className?: string
  style?: React.CSSProperties
  /** worn once the line is finished */
  gradient: string
  /** worn while typing */
  solid: string
  delay?: number
  /** milliseconds per character */
  speed?: number
}) {
  const [shown, setShown] = useState(0)
  const [done, setDone] = useState(false)
  const [instant, setInstant] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInstant(true)
      setShown(text.length)
      setDone(true)
      return
    }

    let i = 0
    let tick: number | undefined
    const start = window.setTimeout(() => {
      tick = window.setInterval(() => {
        i += 1
        setShown(i)
        if (i >= text.length) {
          window.clearInterval(tick)
          // let the caret blink once more before it leaves
          window.setTimeout(() => setDone(true), 420)
        }
        // a hair slower over the space, the way a hand would pause
      }, speed)
    }, delay * 1000)

    return () => {
      window.clearTimeout(start)
      if (tick) window.clearInterval(tick)
    }
  }, [text, delay, speed])

  const typed = text.slice(0, shown)

  return (
    <span className={`relative inline-block ${className}`} style={style}>
      {/* reserves the final box so the page never shifts */}
      <span aria-hidden="true" className="invisible block">
        {text}
      </span>

      <span
        className="absolute inset-0 flex items-center justify-center bg-clip-text"
        style={{
          backgroundImage: done ? gradient : undefined,
          backgroundSize: '260% 100%',
          color: done ? 'transparent' : solid,
          WebkitTextFillColor: done ? 'transparent' : solid,
        }}
      >
        <span>
          {typed}
          {!done && !instant && (
            <motion.span
              aria-hidden="true"
              className="ml-[0.06em] inline-block align-baseline"
              style={{
                width: '0.055em',
                height: '0.78em',
                background: solid,
                verticalAlign: '-0.06em',
              }}
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </span>
      </span>
    </span>
  )
}
