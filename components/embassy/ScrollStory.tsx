'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'

/**
 * The scroll choreography for the invitation.
 *
 * Four pieces, all driven by scroll position rather than time, so the visitor
 * is the one moving the story:
 *
 *   HeroRecede       the opening screen falls back into depth as you leave it
 *   MaskedHeading    section titles wipe in behind a moving edge
 *   ScrubJourney     a pinned photograph you push through, copy wiping over it
 *   HorizontalRail   cards travel sideways while the page scrolls down
 *
 * Pinning fights native scrolling on phones, so the two pinned pieces fall back
 * to ordinary stacked layouts on small screens, and everything collapses to a
 * static layout under prefers-reduced-motion.
 */

function useCompact() {
  const [compact, setCompact] = useState(true)
  useEffect(() => {
    const check = () =>
      setCompact(
        window.innerWidth < 768 ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      )
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return compact
}

/* ── the opening screen recedes ─────────────────────────── */

export function HeroRecede({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const compact = useCompact()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.35 })

  const scale = useTransform(p, [0, 1], [1, 0.88])
  const y = useTransform(p, [0, 1], [0, 70])
  const opacity = useTransform(p, [0, 0.72], [1, 0])
  const blur = useTransform(p, [0, 1], ['blur(0px)', 'blur(7px)'])

  return (
    <div ref={ref}>
      <motion.div
        style={compact ? undefined : { scale, y, opacity, filter: blur, willChange: 'transform' }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/* ── titles wipe in behind a moving edge ────────────────── */

export function MaskedHeading({
  children,
  className = '',
  style,
  as: Tag = 'h2',
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  as?: 'h1' | 'h2' | 'h3'
}) {
  // The ref lives on a plain wrapper: passing it through a dynamically indexed
  // motion tag left it null, so nothing was ever observed and the mask stayed
  // shut on every heading.
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const MotionTag = motion[Tag]

  return (
    <div ref={ref}>
      <MotionTag
        className={className}
        style={style}
        initial={false}
        animate={
          inView
            ? { clipPath: 'inset(0 0% -12% 0)', y: 0 }
            : { clipPath: 'inset(0 100% -12% 0)', y: 12 }
        }
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </MotionTag>
    </div>
  )
}

/* ── a photograph you scroll through ────────────────────── */

/** One thought in the journey, fading up as its slice of the scroll arrives. */
function JourneyLine({
  line,
  index,
  total,
  progress,
}: {
  line: { kicker?: string; text: string }
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const band = 1 / total
  const start = index * band
  const opacity = useTransform(
    progress,
    [start, start + band * 0.22, start + band * 0.72, start + band],
    [0, 1, 1, 0],
  )
  const y = useTransform(progress, [start, start + band], [40, -40])

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center"
      style={{ opacity, y, willChange: 'transform, opacity' }}
    >
      {line.kicker && (
        <p className="text-[11.5px] uppercase tracking-[0.28em] text-white/80">{line.kicker}</p>
      )}
      <p
        className="max-w-3xl text-[clamp(26px,4vw,46px)] italic leading-tight text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.5)]"
        style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
      >
        {line.text}
      </p>
    </motion.div>
  )
}


export function ScrubJourney({
  src,
  alt,
  lines,
}: {
  src: string
  alt: string
  /** one thought per scroll beat */
  lines: { kicker?: string; text: string }[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const compact = useCompact()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.35 })

  const imgScale = useTransform(p, [0, 1], [1.02, 1.28])
  const imgY = useTransform(p, [0, 1], ['0%', '-8%'])
  const veil = useTransform(p, [0, 0.5, 1], [0.46, 0.58, 0.72])
  // built here, not in the JSX below, so the hook runs on every render rather
  // than only once the desktop branch is taken
  const veilBg = useTransform(
    veil,
    (v) =>
      `linear-gradient(180deg, rgba(4,32,40,${v * 0.75}) 0%, rgba(4,32,40,${v}) 45%, rgba(2,20,26,${
        Math.min(0.9, v + 0.16)
      }) 100%)`,
  )

  if (compact) {
    return (
      <section className="relative left-1/2 my-14 w-screen -translate-x-1/2 overflow-hidden">
        <div className="relative h-[320px]">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: '50% 55%' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(242,250,251,0.9) 0%, rgba(12,58,66,0.2) 30%, rgba(12,58,66,0.62) 100%)',
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end gap-2 px-6 pb-8 text-center">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/85">
              {lines[0]?.kicker}
            </p>
            <p className="font-serif text-[22px] italic leading-snug text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
              {lines[0]?.text}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      className="relative left-1/2 w-screen -translate-x-1/2"
      style={{ height: `${lines.length * 90 + 120}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '50% 55%', scale: imgScale, y: imgY, willChange: 'transform' }}
        />
        <motion.div className="absolute inset-0" style={{ background: veilBg }} />

        {lines.map((line, i) => (
          <JourneyLine key={line.text} line={line} index={i} total={lines.length} progress={p} />
        ))}
      </div>
    </section>
  )
}

/* ── cards that travel sideways as the page goes down ───── */

export function HorizontalRail({
  children,
  count,
  fallback,
  title,
}: {
  children: React.ReactNode
  count: number
  /** the stacked layout used on phones */
  fallback: React.ReactNode
  /** stays pinned above the cards as they travel */
  title?: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const compact = useCompact()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.35 })
  const x = useTransform(p, [0, 1], ['2%', `-${Math.max(0, count - 2.6) * 33}%`])

  if (compact) return <>{fallback}</>

  return (
    <section ref={ref} className="relative left-1/2 w-screen -translate-x-1/2" style={{ height: '260vh' }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {title && <div className="mb-8 px-[8vw]">{title}</div>}
        <motion.div
          className="flex gap-6 px-[8vw]"
          style={{ x, willChange: 'transform' }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}
