'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WeThinkMark } from './WeThinkMark'

/**
 * The first two seconds of every Marhaba Thailand link.
 *
 * A deep teal curtain, the WeThink monogram drawn stroke by stroke as if by
 * hand, a single line of credit, then the curtain parts to reveal the
 * invitation. This is the studio's title card, so it runs before the Embassy's
 * content rather than competing with it.
 *
 * Shown once per session, skippable by tap, and skipped entirely for visitors
 * who ask for less motion or who have already seen it.
 */

const SEEN_KEY = 'wt:marhaba:signature'
const HOLD_MS = 2150

export default function SignatureIntro({ label }: { label?: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* private mode: show it, just don't remember */
    }
    setShow(true)
    document.documentElement.style.overflow = 'hidden'
    const id = window.setTimeout(() => setShow(false), HOLD_MS)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!show) document.documentElement.style.overflow = ''
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="signature"
          onClick={() => setShow(false)}
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } }}
          style={{
            background:
              'radial-gradient(120% 90% at 50% 40%, #04525F 0%, #012F38 55%, #01222A 100%)',
          }}
        >
          {/* silk threads drifting behind the mark */}
          <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" aria-hidden="true">
            {[18, 34, 50, 66, 82].map((x, i) => (
              <motion.line
                key={x}
                x1={`${x}%`}
                y1="-10%"
                x2={`${x + 6}%`}
                y2="110%"
                stroke="rgba(1,193,213,0.16)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.1 + i * 0.07, ease: 'easeOut' }}
              />
            ))}
          </svg>

          <motion.div
            className="relative z-10 flex flex-col items-center"
            exit={{ y: -26, opacity: 0, transition: { duration: 0.45 } }}
          >
            <WeThinkMark
              size={128}
              stroke="#EAF9FB"
              dot="#01C1D5"
              width={4.2}
              draw
              delay={0.15}
            />

            <motion.p
              initial={{ opacity: 0, y: 10, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.28em' }}
              transition={{ duration: 0.7, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 text-[10.5px] uppercase text-[#8FD9E4] sm:text-[11.5px]"
            >
              {label ?? 'A digital experience by WeThink'}
            </motion.p>

            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 h-px w-28 origin-center"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(1,193,213,0.9), transparent)',
              }}
            />
          </motion.div>

          {/* the curtain parts */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-1/2 origin-top"
            exit={{ scaleY: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
            style={{ background: 'linear-gradient(180deg,#01222A,#012F38)' }}
          />
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-1/2 origin-bottom"
            exit={{ scaleY: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
            style={{ background: 'linear-gradient(0deg,#01222A,#012F38)' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
