'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

/**
 * The hero, matching the reference exactly in structure.
 *
 * Theirs is a full-bleed autoplay video with a ticker along the foot that
 * repeats a single current announcement, and one button beside it. No
 * headline, no paragraph, no chips. The video carries the frame and the
 * ticker carries the news.
 *
 * Everything that used to live here moved into the section below, so nothing
 * was lost, it just stopped competing with the film.
 */

const ANNOUNCEMENT = 'Marhaba Thailand, for the Royal Thai Embassy, Abu Dhabi'
const HREF = '/embassy'
const REPEATS = 4

export default function HomeHero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [motionOk, setMotionOk] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setMotionOk(true)
    videoRef.current?.play().catch(() => {
      /* the poster carries the frame on its own */
    })
  }, [])

  const ticker = (
    <span className="flex shrink-0 items-center" aria-hidden="true">
      {Array.from({ length: REPEATS }).map((_, n) => (
        <span key={n} className="flex shrink-0 items-center">
          <span className="whitespace-nowrap px-6 text-[14px] font-medium text-white/85 sm:text-[15px]">
            {ANNOUNCEMENT}
          </span>
          <span className="text-white/30">—</span>
        </span>
      ))}
    </span>
  )

  return (
    <section id="home" className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[#14101C]">
      {motionOk ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/images/wethink/event.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/video/wethink-hero.mp4" type="video/mp4" />
          <source src="/video/wethink-hero.webm" type="video/webm" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/wethink/event.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* just enough to keep the ticker legible, so the film stays the subject */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,16,28,0.42) 0%, rgba(20,16,28,0.10) 38%, rgba(20,16,28,0.34) 72%, rgba(20,16,28,0.88) 100%)',
        }}
      />

      <div className="relative flex min-h-[100svh] flex-col justify-end pb-28 sm:pb-10">
        <div // right padding keeps the button clear of the floating chat bubbles
          className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-6 sm:flex-row sm:items-center sm:gap-8 sm:pr-28">
          <div
            className="relative min-w-0 flex-1 overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, #000 84%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, #000 84%, transparent)',
            }}
          >
            <div
              className="flex w-max"
              style={motionOk ? { animation: 'wt-marquee 38s linear infinite' } : undefined}
            >
              {ticker}
              {ticker}
            </div>
            {/* the ticker is decorative repetition; this is what is announced */}
            <span className="sr-only">{ANNOUNCEMENT}</span>
          </div>

          <a
            href={HREF}
            className="inline-flex w-auto shrink-0 items-center justify-center gap-2.5 self-start rounded-full border border-white/25 px-7 py-3.5 text-[14px] font-semibold text-white no-underline backdrop-blur-md transition-colors hover:bg-white/15 sm:self-auto"
          >
            See the invitation
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
