'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { gulfHour } from './useTimeOfDay'

/**
 * What is happening at the festival right now, for someone standing in the
 * mall with their phone.
 *
 * A ring drains through the current activity and names what follows. Outside
 * the two festival days it counts the days down instead, so the panel is never
 * dead space.
 */

export type Slot = {
  start: number
  end: number
  time: string
  title: string
  where: string
  rest?: boolean
}

const DAYS: Record<string, 1 | 2> = { '2026-09-11': 1, '2026-09-12': 2 }

function gulfDate() {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dubai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
  return p
}

export default function LiveNow({ schedule }: { schedule: Record<1 | 2, Slot[]> }) {
  const [now, setNow] = useState<{ date: string; minutes: number } | null>(null)

  useEffect(() => {
    const tick = () => {
      const h = gulfHour()
      setNow({ date: gulfDate(), minutes: Math.round(h * 60) })
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  if (!now) return null

  const day = DAYS[now.date]
  if (!day) {
    const target = new Date('2026-09-11T10:00:00+04:00').getTime()
    const days = Math.max(0, Math.ceil((target - Date.now()) / 86400000))
    return (
      <div className="text-center">
        <p className="text-[13px] uppercase tracking-[0.18em]" style={{ color: '#3A737F' }}>
          {days > 0 ? `${days} day${days === 1 ? '' : 's'} until the festival` : 'See you next time'}
        </p>
      </div>
    )
  }

  // three stages run at once, so "now" is a short list rather than one line
  const slots = schedule[day]
  const running = slots.filter((s) => now.minutes >= s.start && now.minutes < s.end)
  const live = running.filter((s) => !s.rest)
  const current = live.length ? live : running
  const soonest = current.reduce<Slot | null>(
    (best, s) => (!best || s.end < best.end ? s : best),
    null,
  )
  const upcoming = slots
    .filter((s) => s.start > now.minutes && !s.rest)
    .sort((a, b) => a.start - b.start)
  const next = upcoming[0]

  const progress = soonest
    ? Math.min(1, Math.max(0, (now.minutes - soonest.start) / (soonest.end - soonest.start)))
    : 0

  const R = 34
  const C = 2 * Math.PI * R

  return (
    <div className={`flex gap-5 ${current.length > 1 ? 'items-start' : 'items-center'}`}>
      <svg
        viewBox="0 0 80 80"
        className={`h-[80px] w-[80px] flex-shrink-0 ${current.length > 1 ? 'mt-1' : ''}`}
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(3,122,138,0.16)" strokeWidth="6" />
        <motion.circle
          cx="40"
          cy="40"
          r={R}
          fill="none"
          stroke="url(#liveRing)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - progress) }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 40 40)"
        />
        <defs>
          <linearGradient id="liveRing" x1="0" y1="0" x2="80" y2="80">
            <stop offset="0%" stopColor="#015866" />
            <stop offset="100%" stopColor="#01C1D5" />
          </linearGradient>
        </defs>
      </svg>

      <div className="min-w-0 text-left">
        {current.length ? (
          <>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                  style={{ background: '#01C1D5' }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ background: '#029FB1' }}
                />
              </span>
              <span
                className="text-[10.5px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: '#037A8A' }}
              >
                Happening now
              </span>
            </div>
            <ul className="mt-1 list-none space-y-1">
              {current.map((s) => (
                <li key={s.where + s.title}>
                  <p className="text-[15.5px] font-medium leading-snug" style={{ color: '#0C3A42' }}>
                    {s.title}
                  </p>
                  {s.where && (
                    <p className="text-[12.5px]" style={{ color: '#46707A' }}>
                      {s.where}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-[15px]" style={{ color: '#0C3A42' }}>
            Between activities
          </p>
        )}

        {next && (
          <p className="mt-2 text-[12.5px]" style={{ color: '#3A737F' }}>
            Next at {next.time} · {next.title}
          </p>
        )}
      </div>
    </div>
  )
}
