'use client'

import { motion } from 'framer-motion'
import { MoveRight, PhoneCall } from 'lucide-react'

/**
 * A photograph-led hero, in the manner of the references: one image, one
 * claim, two actions, and a line of names underneath that can be checked.
 *
 * The scrim is a left-weighted gradient rather than a flat wash, so the copy
 * sits on near-black while the right of the frame keeps the room visible.
 */

const ease = [0.16, 1, 0.3, 1] as const

const TRUSTED = [
  'The Royal Thai Embassy',
  'Albina Alareeq Contracting',
  'Reem Mall',
  'Nabe Eldiyafa Aldimashqi',
]

export default function PhotoHero() {
  const openWhatsApp = () =>
    window.open('https://wa.me/971503125078', '_blank', 'noopener,noreferrer')

  return (
    <section id="home" className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[#0B1016]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/wethink/event.jpg"
        alt="Professionals in conversation at a technology event in Abu Dhabi"
        className="absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, rgba(6,10,14,0.94) 0%, rgba(6,10,14,0.86) 34%, rgba(6,10,14,0.55) 62%, rgba(6,10,14,0.35) 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-56"
        style={{ background: 'linear-gradient(to top, rgba(6,10,14,0.95), transparent)' }}
      />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-6 pb-40 pt-32 sm:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55"
        >
          Abu Dhabi · Since 2019
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.9, ease }}
          className="mt-6 max-w-3xl text-[clamp(2.5rem,6.2vw,4.75rem)] font-bold leading-[1.02] tracking-tight text-white"
        >
          New Era of Automation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease }}
          className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/70 md:text-[19px]"
        >
          Cloud, cybersecurity, custom software and digital transformation for
          organisations across the UAE and the Gulf. We advise, then we build,
          and we stay until it works.
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

        {/* Names rather than adjectives, which is what the references do.
            In flow under the buttons rather than pinned to the bottom edge,
            where the floating widgets sit. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 1, ease }}
          className="mt-14 border-t border-white/12 pt-6"
        >
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Delivered for
          </span>
          <ul className="mt-3 flex list-none flex-wrap gap-x-7 gap-y-2">
            {TRUSTED.map((name, i) => (
              <li
                key={name}
                // a phone shows the two strongest names; the full list needs
                // more lines than the hero has room for above the widgets
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
