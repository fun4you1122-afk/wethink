'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

/**
 * Where the studio actually works.
 *
 * A real photograph of Abu Dhabi, credited to the person who took it, under a
 * licence that permits this use. It sets place, and nothing more: it is not
 * captioned as our office and does not pretend to be our team.
 */

const PHOTO = {
  src: '/context/abu-dhabi-skyline.jpg',
  author: 'Robert Haandrikman',
  licence: 'CC BY 2.0',
  licenceUrl: 'https://creativecommons.org/licenses/by/2.0/',
  source: 'https://commons.wikimedia.org/wiki/File:Skyline_of_Abu_Dhabi_at_sunset.jpg',
}

export default function CityBand() {
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref, { once: true, margin: '-60px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      // the theme's own dark ground rather than a near-black of its own, so
      // the one dark moment on the page still belongs to the palette
      style={{ background: '#1C1917' }}
    >
      <div className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
        <motion.img
          src={PHOTO.src}
          alt="Abu Dhabi, photographed from the water at sunset"
          style={{ y }}
          className="absolute inset-0 h-[116%] w-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(28,25,23,0.70) 0%, rgba(45,37,53,0.24) 42%, rgba(28,25,23,0.92) 100%)',
          }}
        />

        <div className="relative flex h-full items-end">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={seen ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-7xl px-6 pb-12"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: 'var(--primary-tint, #C0AAFD)' }}>
              Where we work
            </p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.08] tracking-tight text-white">
              Abu Dhabi, since 2019
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/60">
              Based on Al Reem Island, working with organisations across the UAE and the Gulf.
            </p>
          </motion.div>
        </div>

        {/* credit, because the licence asks for it and because it is honest */}
        <a
          href={PHOTO.source}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-3 text-[10px] text-white/35 no-underline transition-colors hover:text-white/70"
        >
          Photo: {PHOTO.author}, {PHOTO.licence}
        </a>
      </div>
    </section>
  )
}
