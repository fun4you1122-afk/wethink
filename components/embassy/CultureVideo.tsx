'use client'

import { useEffect, useRef, useState } from 'react'
import { useTimeOfDay, withAlpha } from './useTimeOfDay'

/**
 * Looping Thai-culture footage behind the hero.
 *
 * VP9/WebM is offered first (smaller) with H.264/MP4 behind it for Safari. The
 * element removes itself on load failure, so the hero falls back to the canvas
 * backdrop with no broken frame or empty box.
 *
 * Muted + playsInline so mobile browsers allow autoplay, paused while
 * offscreen, and skipped entirely for visitors who ask for less motion.
 */

const SOURCES = [
  { src: '/embassy/thai-culture.webm', type: 'video/webm' },
  { src: '/embassy/thai-culture.mp4', type: 'video/mp4' },
]

export default function CultureVideo() {
  const p = useTimeOfDay()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || reduced) return

    // Pause the decode loop whenever the hero scrolls away.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {
          /* autoplay refused — the poster-less fallback is fine */
        })
      } else {
        video.pause()
      }
    })
    io.observe(video)
    return () => io.disconnect()
  }, [reduced])

  if (failed || reduced) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
      >
        {SOURCES.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>

      {/* Scrim, tinted to the hour. Kept luminous even at night so the
          invitation reads as lit paper held against a dark sky. */}
      <div
        className="absolute inset-0"
        style={{
          background: p.isDark
            ? `linear-gradient(180deg, ${withAlpha('#FFFFFF', 0.74)} 0%, ${withAlpha(
                '#FFFFFF',
                0.62,
              )} 42%, ${withAlpha(p.sky[2], 0.9)} 88%, ${p.sky[2]} 100%)`
            : `linear-gradient(180deg, ${withAlpha(p.sky[1], 0.8)} 0%, ${withAlpha(
                p.sky[1],
                0.72,
              )} 42%, ${withAlpha(p.sky[2], 0.98)} 88%, ${p.sky[2]} 100%)`,
        }}
      />
    </div>
  )
}
