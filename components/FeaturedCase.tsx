'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, Calendar, MapPin } from 'lucide-react'

/**
 * The Royal Thai Embassy work, up front.
 *
 * Every image here is a screenshot of a page that is actually live, and every
 * link opens the real thing. That is the point: a visitor can check the claim
 * on their own phone while they are still standing in front of you, which no
 * amount of photography can do.
 */

const SHOTS = [
  { src: '/projects/marhaba/invitation-phone.jpg', label: 'The invitation' },
  { src: '/projects/marhaba/programme-schedule.jpg', label: 'Live programme' },
  { src: '/projects/marhaba/opening-hero.jpg', label: 'Ceremony invitation' },
]

const LINKS = [
  { href: '/embassy', label: 'The invitation' },
  { href: '/embassy/programme', label: 'Daily programme' },
  { href: '/embassy/opening', label: 'Opening ceremony' },
]

const FACTS = [
  { icon: Calendar, text: '11 – 12 September 2026' },
  { icon: MapPin, text: 'Reem Mall, Abu Dhabi' },
]

export default function FeaturedCase() {
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#05030C] py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          background:
            'radial-gradient(70% 55% at 15% 0%, rgba(1,88,102,0.5) 0%, rgba(5,3,12,0) 65%), radial-gradient(60% 50% at 90% 100%, rgba(124,58,237,0.28) 0%, rgba(5,3,12,0) 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={seen ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
              Live now
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-300">
              Diplomatic · Cultural
            </span>
          </div>

          <h2 className="mt-5 max-w-3xl text-[clamp(2rem,5vw,3.6rem)] font-bold leading-[1.05] tracking-tight text-white">
            The Royal Thai Embassy asked for an invitation.
            <span className="text-white/45"> We built the whole festival online.</span>
          </h2>

          <p className="mt-6 max-w-2xl text-[clamp(1rem,1.4vw,1.15rem)] leading-relaxed text-white/65">
            Marhaba Thailand is the Embassy&apos;s two-day national cultural festival at Reem Mall.
            We designed and built three connected experiences: the public invitation, a VIP
            invitation for the Opening Ceremony with registration wired into the Embassy&apos;s own
            systems, and a live programme covering three stages across both days, reached from QR
            codes at the venue.
          </p>

          <div className="mt-6 flex flex-wrap gap-5">
            {FACTS.map((f) => (
              <span key={f.text} className="flex items-center gap-2 text-sm text-white/55">
                <f.icon className="h-4 w-4 text-violet-300" />
                {f.text}
              </span>
            ))}
          </div>
        </motion.div>

        {/* real screens, in phone frames, because that is how guests see them */}
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {SHOTS.map((s, i) => (
            <motion.figure
              key={s.src}
              initial={{ opacity: 0, y: 34 }}
              animate={seen ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.12 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div
                className="overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.03] p-2 transition-transform duration-500 group-hover:-translate-y-1.5"
                style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.45)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={`${s.label} — Marhaba Thailand, built by WeThink`}
                  width={430}
                  height={900}
                  loading="lazy"
                  className="h-[400px] w-full rounded-[20px] object-cover object-top sm:h-[460px]"
                />
              </div>
              <figcaption className="mt-3 text-center text-[12.5px] uppercase tracking-[0.14em] text-white/45">
                {s.label}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={seen ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <p className="text-[13px] uppercase tracking-[0.16em] text-white/40">
            Open them yourself
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white no-underline transition-colors hover:border-violet-400/60 hover:bg-white/5"
              >
                {l.label}
                <ArrowUpRight className="h-4 w-4 text-violet-300" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
