'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * WeThink / WeBuild / WeGrow.
 *
 * "We" never moves. Only the word after it flips, so the eye stays fixed on
 * the brand and reads three promises off the same anchor.
 *
 * Both halves are painted with the ramp sampled off the logo mark, and the
 * gradient is laid across the whole line rather than each word, so "We" and
 * the flipping word are two parts of one wash rather than two separate
 * gradients that happen to sit side by side.
 *
 * The box is sized by the longest word, invisibly, so nothing reflows as the
 * words change.
 */

const WORDS = ['Think', 'Build', 'Grow']
const LONGEST = WORDS.reduce((a, b) => (b.length > a.length ? b : a))

export default function WeWordmark({ className = '' }: { className?: string }) {
  const [i, setI] = useState(0)
  const [still, setStill] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true)
      return
    }
    const id = window.setInterval(() => setI((n) => (n + 1) % WORDS.length), 2400)
    return () => window.clearInterval(id)
  }, [])

  // The wash is laid on the container, not on each word. Painting the words
  // separately gave each its own full teal-to-violet ramp, so the line read as
  // two gradients side by side instead of one wordmark.
  const paint: React.CSSProperties = {
    fontFamily: 'var(--font-display)',
    backgroundImage: 'var(--logo-ramp)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  }

  return (
    <span className={`inline-flex items-baseline ${className}`} style={paint}>
      <span>We</span>

      {still ? (
        <span>{WORDS[0]}</span>
      ) : (
        <span className="inline-grid" aria-live="polite">
          {/* Both cells sit in the same grid slot, so the word overlays the
              sizer without being taken out of flow. An absolutely positioned
              word is outside the ancestor's text box and never receives the
              clipped background at all. */}
          <span
            className="invisible"
            aria-hidden="true"
            style={{ gridArea: '1 / 1' }}
          >
            {LONGEST}
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={WORDS[i]}
              // Opacity only. A blur filter or a transform on this element
              // promotes it to its own layer, which breaks the ancestor's
              // background-clip and the word disappears entirely.
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className="whitespace-nowrap text-left"
              style={{ gridArea: '1 / 1' }}
            >
              {WORDS[i]}
            </motion.span>
          </AnimatePresence>
        </span>
      )}
    </span>
  )
}
