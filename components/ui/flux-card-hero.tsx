'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Cloud, Search, ShieldCheck, Sparkles } from 'lucide-react'

/**
 * A stack of layered cards behind the hero copy, cycling every few seconds.
 *
 * Rebuilt from the supplied component rather than pasted: that file does not
 * parse (closing tags written as "< /div>", attributes as className= "…"), and
 * its content was another product's navigation, login and AI-assistant demo.
 * What is kept is the idea: a fanned deck whose top card changes on a timer,
 * with dots to drive it by hand.
 *
 * The deck is decorative, so it is hidden from assistive technology and the
 * timer stops for anyone who has asked for less motion.
 */

export type FluxCard = {
  /** any CSS colour or gradient for the face of the card */
  face: string
  eyebrow: string
  title: string
  body: React.ReactNode
}

const TIMER = 3600

export function FluxCardDeck({
  cards,
  className = '',
}: {
  cards: FluxCard[]
  className?: string
}) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  // `current` is a dependency on purpose: choosing a card by hand restarts the
  // clock, so a deliberate pick is not snatched away a moment later.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (paused) return
    const id = window.setTimeout(() => setCurrent((n) => (n + 1) % cards.length), TIMER)
    return () => window.clearTimeout(id)
  }, [cards.length, paused, current])

  const card = cards[current]

  // the fanned cards behind the top one
  const shadows = [
    { rotate: 3, scale: 0.95, delay: 'delay-0' },
    { rotate: -2, scale: 0.96, delay: 'delay-150' },
    { rotate: 1, scale: 0.97, delay: 'delay-300' },
    { rotate: -1, scale: 0.98, delay: 'delay-500' },
  ]

  return (
    <div className={`w-full ${className}`}>
      <div
        className="relative w-full"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div aria-hidden="true">
          {shadows.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${s.delay}`}
              style={{ transform: `rotate(${s.rotate}deg) scale(${current === i ? s.scale + 0.03 : s.scale})` }}
            >
              <div
                className="h-[16.5rem] w-full rounded-3xl shadow-2xl transition-opacity duration-1000"
                style={{
                  background: cards[(current + i + 1) % cards.length].face,
                  opacity: current === i ? 0.55 : 0.34,
                }}
              />
            </div>
          ))}
        </div>

        <div
          className="relative z-10 flex h-[16.5rem] w-full flex-col rounded-3xl p-5 shadow-2xl transition-all duration-1000 ease-in-out hover:scale-[1.02] sm:p-6"
          style={{ background: card.face }}
        >
          <div className="flex flex-1 flex-col rounded-2xl bg-white/25 p-4 backdrop-blur-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="h-3 w-3 rounded-full bg-white/70" />
                <span className="h-3 w-3 rounded-full bg-white/50" />
                <span className="h-3 w-3 rounded-full bg-white/35" />
              </div>
              <span className="rounded-full bg-white/35 px-2.5 py-1 text-[11px] font-medium text-[#2b1b47]">
                {card.eyebrow}
              </span>
            </div>

            <h3 className="text-[17px] font-semibold text-[#241536]">{card.title}</h3>
            <div className="mt-3 flex flex-1 flex-col justify-center text-[#241536]/80">{card.body}</div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {cards.map((c, i) => (
          <button
            key={c.title}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Show ${c.title}`}
            aria-current={current === i}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === i ? 'w-6 bg-[#4E11BB]' : 'w-2 bg-[#4E11BB]/30 hover:bg-[#4E11BB]/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/* ── the four faces, in WeThink's own terms ───────────────────────────── */

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 rounded-xl bg-white/30 px-3 py-2.5">{children}</div>
)

export const WETHINK_CARDS: FluxCard[] = [
  {
    face: 'linear-gradient(135deg, #C8B6FF 0%, #A78BFA 100%)',
    eyebrow: 'Start here',
    title: 'Tell us what you need',
    body: (
      <div className="space-y-2.5">
        <Row>
          <Search className="h-4 w-4 shrink-0" />
          <span className="text-[13.5px]">Migrate our estate to Azure</span>
        </Row>
        <Row>
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span className="text-[13.5px]">Get us ISO 27001 ready</span>
        </Row>
        <Row>
          <Sparkles className="h-4 w-4 shrink-0" />
          <span className="text-[13.5px]">Build the portal our team asked for</span>
        </Row>
      </div>
    ),
  },
  {
    face: 'linear-gradient(135deg, #A5C8FF 0%, #7FA5F5 100%)',
    eyebrow: 'How it runs',
    title: 'Discover, build, hand over',
    body: (
      <div className="mt-1 flex items-center gap-2">
        {['Discover', 'Build', 'Hand over'].map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className="flex-1 rounded-xl bg-white/35 px-2 py-3 text-center text-[12.5px] font-medium">
              {s}
            </div>
            {i < 2 && <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-60" />}
          </div>
        ))}
      </div>
    ),
  },
  {
    face: 'linear-gradient(135deg, #9FE6EC 0%, #3FC4D0 100%)',
    eyebrow: 'What we build on',
    title: 'Cloud, wherever it belongs',
    body: (
      <div className="flex flex-wrap gap-2">
        {['Microsoft Azure', 'AWS', 'Google Cloud', 'Kubernetes', 'Docker'].map((t) => (
          <span key={t} className="rounded-full bg-white/35 px-3 py-1.5 text-[12.5px] font-medium">
            {t}
          </span>
        ))}
      </div>
    ),
  },
  {
    face: 'linear-gradient(135deg, #E7C4F5 0%, #C48BE0 100%)',
    eyebrow: 'Practice areas',
    title: 'Four things, done properly',
    body: (
      <div className="grid grid-cols-2 gap-2">
        {[
          ['Cloud', Cloud],
          ['Cybersecurity', ShieldCheck],
          ['Custom software', Sparkles],
          ['Data & AI', Search],
        ].map(([label, Icon]) => {
          const I = Icon as typeof Cloud
          return (
            <div key={label as string} className="flex items-center gap-2 rounded-xl bg-white/30 px-3 py-2.5">
              <I className="h-4 w-4 shrink-0" />
              <span className="text-[12.5px] font-medium">{label as string}</span>
            </div>
          )
        })}
      </div>
    ),
  },
]

export default FluxCardDeck
