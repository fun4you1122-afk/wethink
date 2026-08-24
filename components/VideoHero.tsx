'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MoveRight, PhoneCall } from 'lucide-react'

/**
 * The hero: a slow loop cut from our own photographs, one claim, two actions.
 *
 * The video is decoration, so it is treated as such. It carries a poster of
 * the first frame, it is muted and inline so a phone will actually play it,
 * and anyone who has asked for less motion gets the poster and nothing else.
 * If the file fails for any reason the poster stays and the hero is unchanged
 * apart from the movement.
 */

const ease = [0.16, 1, 0.3, 1] as const

const PRACTICE = [
  'Cloud & Infrastructure',
  'Cybersecurity',
  'Custom Software',
  'Data & AI',
]

export default function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [motionOk, setMotionOk] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setMotionOk(true)
    // Some browsers refuse the autoplay attribute but allow a scripted play
    // on a muted inline video, so ask once the element exists.
    videoRef.current?.play().catch(() => {
      /* poster carries the hero on its own */
    })
  }, [])

  const openWhatsApp = () =>
    window.open('https://wa.me/971503125078', '_blank', 'noopener,noreferrer')

  return (
    <section
      id="home"
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[#0B1016]"
    >
      {motionOk && (
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
          {/* MP4 first: it is the smaller file and every target browser
              decodes it. The WebM is only here for the ones that will not. */}
          <source src="/video/wethink-hero.mp4" type="video/mp4" />
          <source src="/video/wethink-hero.webm" type="video/webm" />
        </video>
      )}
      {!motionOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/wethink/event.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, rgba(6,10,14,0.95) 0%, rgba(6,10,14,0.88) 34%, rgba(6,10,14,0.58) 64%, rgba(6,10,14,0.38) 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-60"
        style={{ background: 'linear-gradient(to top, rgba(6,10,14,0.96), transparent)' }}
      />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-6 pb-40 pt-32 sm:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55"
        >
          IT Consulting · Abu Dhabi
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.9, ease }}
          className="mt-6 max-w-4xl text-[clamp(2.4rem,5.8vw,4.5rem)] font-bold leading-[1.04] tracking-tight text-white"
        >
          We don&apos;t just advise.
          <span className="block text-white/60">We build it, and stay until it runs.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease }}
          className="mt-7 max-w-xl text-[17px] leading-relaxed text-white/70 md:text-[19px]"
        >
          Cloud, cybersecurity, custom software and data for government,
          financial institutions and growing companies across the UAE and the
          Gulf. One team in Abu Dhabi, from the first conversation to the
          handover.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <a
            href="/work"
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-[#0B1016] no-underline transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Explore WeThink Now
            <MoveRight className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={openWhatsApp}
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/25 px-8 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
          >
            Book a Call
            <PhoneCall className="h-4 w-4" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 1, ease }}
          className="mt-14 border-t border-white/12 pt-6"
        >
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-white/40">
            What we do
          </span>
          <ul className="mt-3 flex list-none flex-wrap gap-x-7 gap-y-2">
            {PRACTICE.map((name, i) => (
              <li
                key={name}
                className={`text-[13.5px] font-medium text-white/75 ${i > 1 ? 'hidden sm:list-item' : ''}`}
              >
                {name}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
