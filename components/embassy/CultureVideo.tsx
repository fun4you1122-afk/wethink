'use client'

import { useEffect, useRef, useState } from 'react'

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

      {/* Cream scrim — keeps the invitation's light, printed-paper feel and
          guarantees contrast for the headline whatever the footage shows. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(253,247,240,0.80) 0%, rgba(253,247,240,0.72) 42%, rgba(253,247,240,0.98) 88%, rgba(253,247,240,1) 100%)',
        }}
      />
    </div>
  )
}
