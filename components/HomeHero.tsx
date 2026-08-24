'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Search } from 'lucide-react'
import LogoMarquee from '@/components/LogoMarquee'
import WeWordmark from '@/components/WeWordmark'

/**
 * The home hero, built on the G42 pattern: a full-bleed autoplay video, a
 * small announcement pill riding above it, an oversized text marquee crossing
 * the frame, and one action out to more.
 *
 * The content is ours and unchanged. What is borrowed is the arrangement: the
 * video carries the page rather than sitting behind a headline block, and the
 * marquee does the work a static strapline would otherwise do.
 *
 * The scrim is violet-tinted rather than neutral black so the frame still
 * belongs to the brand, and the wordmark takes the lifted ramp because the
 * ordinary one goes to mud over a dark ground.
 */

const ease = [0.16, 1, 0.3, 1] as const
const BAND = ['WeThink', 'WeBuild', 'WeGrow']

const TOPICS = [
  { label: 'Cloud', href: '/services#cloud' },
  { label: 'Cybersecurity', href: '/services#security' },
  { label: 'Custom Software', href: '/services#software' },
  { label: 'Data & AI', href: '/services#data' },
]

function Band() {
  const row = (
    <span className="flex shrink-0 items-center" aria-hidden="true">
      {BAND.map((w) => (
        <span key={w} className="flex shrink-0 items-center">
          <span
            className="px-8 text-[clamp(2.75rem,7vw,6rem)] font-bold leading-none tracking-tight"
            style={{
              fontFamily: 'var(--font-display)',
              backgroundImage: 'var(--logo-ramp-on-dark)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {w}
          </span>
          <span className="text-[clamp(2rem,4vw,3rem)] leading-none text-white/25">·</span>
        </span>
      ))}
    </span>
  )
  return (
    <div
      className="relative overflow-hidden py-2"
      style={{
        maskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
      }}
    >
      <div className="flex w-max" style={{ animation: 'wt-marquee 34s linear infinite' }}>
        {row}
        {row}
      </div>
    </div>
  )
}

export default function HomeHero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [motionOk, setMotionOk] = useState(false)
  const [brief, setBrief] = useState('')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setMotionOk(true)
    videoRef.current?.play().catch(() => {
      /* the poster carries the frame on its own */
    })
  }, [])

  const send = () => {
    const text = brief.trim()
      ? `Hello WeThink, I'd like to talk about: ${brief.trim()}`
      : 'Hello WeThink, I would like to discuss a project.'
    window.open(
      `https://wa.me/971503125078?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

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

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,16,28,0.78) 0%, rgba(20,16,28,0.58) 34%, rgba(20,16,28,0.72) 68%, rgba(20,16,28,0.94) 100%)',
        }}
      />

      <div className="relative flex min-h-[100svh] w-full flex-col justify-between pb-10 pt-28">
        {/* the announcement pill, carrying something that is actually current */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="mx-auto w-full max-w-7xl px-6"
        >
          <a
            href="/embassy"
            className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 py-2 pl-4 pr-3 text-[13px] font-medium text-white no-underline backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.14em]">
              Live
            </span>
            Marhaba Thailand, for the Royal Thai Embassy
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </motion.div>

        <div className="w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 1, ease }}
          >
            <Band />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.9, ease }}
            className="mx-auto mt-10 w-full max-w-7xl px-6"
          >
            <p className="max-w-xl text-[17px] leading-relaxed text-white/70 md:text-[19px]">
              Cloud, cybersecurity, custom software and data for government,
              financial institutions and growing companies across the UAE and
              the Gulf.
            </p>

            {/* On a phone the row is too narrow for a field and a button side
                by side, so it stacks rather than the button sitting on the
                placeholder. */}
            <div className="mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-3xl border border-white/15 bg-white/10 p-2 backdrop-blur-md sm:flex-row sm:items-center sm:rounded-full sm:pl-5">
              <div className="flex min-w-0 flex-1 items-center gap-2 pl-3 sm:pl-0">
              <Search className="h-[18px] w-[18px] shrink-0 text-white/45" />
              <input
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Tell us what you need"
                aria-label="Tell us what you need"
                className="min-w-0 flex-1 bg-transparent py-3 text-[16px] text-white outline-none placeholder:text-white/45"
              />
              </div>
              <button
                type="button"
                onClick={send}
                className="w-full shrink-0 rounded-full bg-white px-7 py-3.5 text-[14.5px] font-semibold text-[#14101C] transition-transform hover:scale-[1.02] active:scale-[0.99] sm:w-auto"
              >
                Get Started
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {TOPICS.map((t) => (
                <a
                  key={t.label}
                  href={t.href}
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-[13.5px] font-medium text-white/80 no-underline backdrop-blur-md transition-colors hover:bg-white/15"
                >
                  {t.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1, ease }}
          className="mt-10"
        >
          <LogoMarquee className="[--mq-ink:rgba(255,255,255,0.75)]" onDark />
        </motion.div>
      </div>
    </section>
  )
}
