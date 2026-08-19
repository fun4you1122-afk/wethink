'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTimeOfDay } from './useTimeOfDay'

/**
 * A split-flap countdown, the kind that used to clatter above an airport gate.
 *
 * Each digit is its own flap: the old number tips away over the hinge while the
 * new one drops in behind it, with a hairline across the middle. Only the
 * digits that actually changed move, so the seconds tick while the days sit
 * still.
 */

const serif = 'var(--font-fraunces), Georgia, serif'

function Flap({ value, label }: { value: string; label: string }) {
  const tod = useTimeOfDay()
  const digits = value.split('')

  return (
    <div
      className="min-w-0 rounded-[18px] border px-2 py-3.5 text-center shadow-[0_6px_18px_rgba(3,122,138,0.10)] backdrop-blur-sm sm:min-w-[86px] sm:px-4"
      style={{ background: tod.panel, borderColor: tod.panelBorder }}
    >
      <div className="flex items-center justify-center gap-[3px]">
        {digits.map((d, i) => (
          <span
            key={i}
            className="relative block overflow-hidden rounded-[6px]"
            style={{ height: '1.05em', width: '0.62em', perspective: 260 }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={d + i}
                initial={{ rotateX: -88, opacity: 0, y: '-42%' }}
                animate={{ rotateX: 0, opacity: 1, y: '0%' }}
                exit={{ rotateX: 88, opacity: 0, y: '42%' }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center text-[26px] leading-none tabular-nums sm:text-[30px]"
                style={{
                  fontFamily: serif,
                  color: '#00252E',
                  transformOrigin: '50% 50%',
                  backfaceVisibility: 'hidden',
                }}
              >
                {d}
              </motion.span>
            </AnimatePresence>
            {/* the hinge */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-1/2 h-px"
              style={{ background: 'rgba(1,70,83,0.16)' }}
            />
          </span>
        ))}
      </div>
      <div
        className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] sm:text-[10px] sm:tracking-[0.14em]"
        style={{ color: '#3A737F' }}
      >
        {label}
      </div>
    </div>
  )
}

export default function FlipCountdown({ start }: { start: string }) {
  const target = useMemo(() => new Date(start).getTime(), [start])
  const [left, setLeft] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, target - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  const units: [string, string][] =
    left === null
      ? [
          ['––', 'Days'],
          ['––', 'Hours'],
          ['––', 'Minutes'],
          ['––', 'Seconds'],
        ]
      : [
          [String(Math.floor(left / 86400000)).padStart(2, '0'), 'Days'],
          [String(Math.floor((left / 3600000) % 24)).padStart(2, '0'), 'Hours'],
          [String(Math.floor((left / 60000) % 60)).padStart(2, '0'), 'Minutes'],
          [String(Math.floor((left / 1000) % 60)).padStart(2, '0'), 'Seconds'],
        ]

  return (
    <div
      className="mx-auto mt-7 grid max-w-[380px] grid-cols-4 gap-2 sm:max-w-none sm:flex sm:justify-center sm:gap-3.5"
      aria-live="polite"
    >
      {units.map(([v, l]) => (
        <Flap key={l} value={v} label={l} />
      ))}
    </div>
  )
}
