'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MoveRight, PhoneCall } from 'lucide-react'

/**
 * The homepage hero: a dark studio, three spotlights that flicker on, and the
 * headline arriving once the room has settled.
 *
 * The studio itself pulls in three.js and react-three-fiber, so it loads after
 * hydration rather than sitting in the critical bundle. Until it arrives the
 * section is simply black, which is what the room resolves to anyway, so there
 * is no flash of a different design.
 */

const VolumetricStudio = dynamic(
  () => import('@/components/ui/volumetric-studio').then((m) => m.VolumetricStudio),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-black" /> },
)

const ease = [0.16, 1, 0.3, 1] as const

export default function StudioHero() {
  const openWhatsApp = () =>
    window.open('https://wa.me/971503125078', '_blank', 'noopener,noreferrer')

  return (
    <section id="home" className="relative min-h-[100svh] w-full overflow-hidden bg-black">
      <VolumetricStudio
        className="min-h-[100svh]"
        // drop the rail below the fixed navbar, and the back wall with it, so
        // the fixtures are not hanging through the menu
        railTop={11}
        backWall={{ tl: [22, 19], tr: [78, 19], br: [78, 74], bl: [22, 74] }}
      >
        <div className="pointer-events-none relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.55, duration: 1, ease }}
            className="mb-6 text-[11px] font-semibold uppercase tracking-[0.34em] text-white/40"
          >
            Abu Dhabi · Since 2019
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 1.2, ease }}
            className="mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-[clamp(2.75rem,8vw,6.25rem)] font-bold leading-[0.95] tracking-tight text-transparent drop-shadow-2xl"
          >
            New Era
            <br />
            of Automation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 1.2, ease }}
            className="mb-10 max-w-2xl text-lg font-medium text-white/50 md:text-xl"
          >
            Cloud, cybersecurity, custom software and digital transformation for
            organisations across the UAE and the Gulf.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 1.2, ease }}
            className="pointer-events-auto flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="/work"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-black no-underline shadow-[0_0_28px_rgba(255,255,255,0.18)] transition-transform hover:scale-[1.03] active:scale-95"
            >
              Explore WeThink Now
              <MoveRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={openWhatsApp}
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/20 bg-transparent px-8 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              Book a Call
              <PhoneCall className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </VolumetricStudio>
    </section>
  )
}
