'use client'

import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * A handful of jasmine petals thrown into the air when something good happens —
 * a calendar saved, an invitation shared. Thai celebrations scatter flowers,
 * so the page does too.
 *
 * Returns a trigger you call from the action, and the layer that renders it.
 */

type Burst = { id: number; x: number; y: number }

const COLOURS = ['#9FDDE8', '#6FC7D8', '#CBEEF3', '#F4E3C8', '#FFFFFF']

export function usePetalBurst() {
  const [bursts, setBursts] = useState<Burst[]>([])

  const fire = useCallback((e?: { clientX: number; clientY: number }) => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = performance.now()
    setBursts((b) => [
      ...b,
      { id, x: e?.clientX ?? window.innerWidth / 2, y: e?.clientY ?? window.innerHeight / 2 },
    ])
    window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 2200)
  }, [])

  const layer = (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      <AnimatePresence>
        {bursts.map((b) =>
          Array.from({ length: 18 }).map((_, i) => {
            const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.4
            const dist = 90 + Math.random() * 190
            return (
              <motion.span
                key={`${b.id}-${i}`}
                initial={{ x: b.x, y: b.y, opacity: 1, scale: 0.4, rotate: 0 }}
                animate={{
                  x: b.x + Math.cos(angle) * dist,
                  y: b.y + Math.sin(angle) * dist * 0.65 + 150,
                  opacity: 0,
                  scale: 1,
                  rotate: (Math.random() - 0.5) * 420,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6 + Math.random() * 0.6, ease: [0.2, 0.6, 0.3, 1] }}
                className="absolute left-0 top-0 h-3 w-2 rounded-full"
                style={{ background: COLOURS[i % COLOURS.length], translateX: '-50%', translateY: '-50%' }}
              />
            )
          }),
        )}
      </AnimatePresence>
    </div>
  )

  return { fire, layer }
}
