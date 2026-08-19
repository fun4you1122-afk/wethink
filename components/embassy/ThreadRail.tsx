'use client'

import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { WeThinkMark } from './WeThinkMark'

/**
 * A hairline thread down the right edge with the WeThink monogram travelling
 * along it as the visitor scrolls, and the studio name set vertically beneath.
 *
 * This is the "throughout" half of the credit: quiet enough to live alongside
 * an Embassy seal, present on every screen from the first scroll to the last.
 */

export default function ThreadRail() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  const top = useTransform(progress, [0, 1], ['4%', '92%'])
  const fill = useTransform(progress, [0, 1], ['0%', '100%'])

  return (
    <div
      className="pointer-events-none fixed right-2 top-0 z-30 hidden h-full w-9 sm:right-4 sm:block"
      aria-hidden="true"
    >
      {/* the unlit thread */}
      <div
        className="absolute left-1/2 top-[4%] h-[88%] w-px -translate-x-1/2"
        style={{ background: 'rgba(3,122,138,0.18)' }}
      />
      {/* the lit portion, drawn as you go */}
      <motion.div
        className="absolute left-1/2 top-[4%] w-px -translate-x-1/2 origin-top"
        style={{
          height: fill,
          maxHeight: '88%',
          background: 'linear-gradient(180deg, #01C1D5, #037A8A)',
        }}
      />

      {/* the travelling bead */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ top }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm"
          style={{
            background: 'rgba(255,255,255,0.82)',
            border: '1px solid rgba(3,122,138,0.22)',
            boxShadow: '0 4px 14px rgba(1,88,102,0.18)',
          }}
        >
          <WeThinkMark size={19} stroke="#015866" dot="#01C1D5" width={5} />
        </div>
      </motion.div>

      {/* vertical studio credit, low and constant */}
      <div
        className="absolute bottom-[3%] left-1/2 -translate-x-1/2"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span
          className="text-[9.5px] uppercase tracking-[0.42em]"
          style={{ color: 'rgba(1,88,102,0.45)' }}
        >
          Built by WeThink
        </span>
      </div>
    </div>
  )
}
