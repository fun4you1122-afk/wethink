'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

/**
 * Named work, in place of the testimonial carousel.
 *
 * The carousel quoted five executives with hard numbers and no companies
 * behind them, which is the kind of thing a careful prospect discounts on
 * sight. Everything here names a real client and says what was actually
 * built, and the first one can be opened and checked on the spot.
 */

const ENGAGEMENTS = [
  {
    client: 'The Royal Thai Embassy, Abu Dhabi',
    sector: 'Diplomatic · Cultural',
    title: 'Marhaba Thailand',
    body:
      'Three connected digital experiences for the Embassy’s two-day national cultural festival at Reem Mall: the public invitation, a VIP invitation for the Opening Ceremony with registration wired into the Embassy’s own systems, and a live three-stage programme reached from QR codes at the venue.',
    meta: '11 – 12 September 2026 · Reem Mall',
    href: '/embassy',
    hrefLabel: 'Open the invitation',
  },
  {
    client: 'Albina Alareeq Contracting & General Maintenance',
    sector: 'Construction · Abu Dhabi',
    title: 'Tender to site, in one place',
    body:
      'End-to-end digital transformation: a brand-aligned corporate website plus a connected project-management portal unifying the tender pipeline, site progress, HSE compliance and manpower tracking across twelve active jobs.',
    meta: 'Corporate site and operations portal',
  },
  {
    client: 'Masakin',
    sector: 'Real Estate · Dubai',
    title: 'Arabic-first property portal',
    body:
      'A bilingual listing platform built right-to-left from the ground up rather than translated, with map-based search and a lead-scoring dashboard that tells agents which enquiries to call first.',
    meta: 'Next.js · Arabic RTL · Lead scoring',
  },
]

export default function Engagements() {
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative bg-[#05030C] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={seen ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-300">
            Selected engagements
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1.08] tracking-tight text-white">
            Work you can look up
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {ENGAGEMENTS.map((e, i) => (
            <motion.article
              key={e.client}
              initial={{ opacity: 0, y: 28 }}
              animate={seen ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-300/80">
                {e.sector}
              </p>
              <h3 className="mt-3 text-[19px] font-bold leading-snug text-white">{e.title}</h3>
              <p className="mt-1.5 text-[13.5px] text-white/50">{e.client}</p>
              <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-white/70">{e.body}</p>
              <p className="mt-5 text-[12.5px] text-white/40">{e.meta}</p>
              {e.href && (
                <a
                  href={e.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-white no-underline transition-colors hover:text-violet-300"
                >
                  {e.hrefLabel}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={seen ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-10"
        >
          <a
            href="/work"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white no-underline transition-colors hover:border-violet-400/60 hover:bg-white/5"
          >
            All our work
            <ArrowUpRight className="h-4 w-4 text-violet-300" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
