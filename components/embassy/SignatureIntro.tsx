'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * The first two and a half seconds of the invitation.
 *
 * The WeThink logo — the real mark, the same file used in the footer — rises
 * out of a deep teal curtain in 3D, a light sweeps across it like foil catching
 * the light, the credit tracks open beneath, and then the curtain parts to
 * reveal the Embassy's invitation behind it.
 *
 * Once per session, skippable by tap, and not shown at all to visitors who ask
 * for less motion.
 */

const SEEN_KEY = 'wt:marhaba:signature'
const HOLD_MS = 2600

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
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }}
          style={{
            background:
              'radial-gradient(120% 90% at 50% 40%, #04525F 0%, #012F38 55%, #01222A 100%)',
            perspective: 1200,
          }}
        >
          {/* silk threads drifting behind the mark */}
          <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" aria-hidden="true">
            {[14, 30, 46, 62, 78, 92].map((x, i) => (
              <motion.line
                key={x}
                x1={`${x}%`}
                y1="-10%"
                x2={`${x + 7}%`}
                y2="110%"
                stroke="rgba(1,193,213,0.16)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.05 + i * 0.06, ease: 'easeOut' }}
              />
            ))}
          </svg>

          <motion.div
            className="relative z-10 flex flex-col items-center"
            style={{ transformStyle: 'preserve-3d' }}
            exit={{ y: -30, opacity: 0, transition: { duration: 0.45 } }}
          >
            {/* the real logo, lifted toward the viewer */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.82, rotateX: 42, y: 26 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img
                src="/wethink-logo.png"
                alt="WeThink"
                width={220}
                height={73}
                className="h-[86px] w-auto drop-shadow-[0_18px_44px_rgba(1,193,213,0.35)] sm:h-[104px]"
              />

              {/* light sweeping across the mark, clipped to its own shape */}
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                initial={{ backgroundPositionX: '-160%' }}
                animate={{ backgroundPositionX: '160%' }}
                transition={{ duration: 1.5, delay: 0.85, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  backgroundImage:
                    'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.92) 50%, transparent 62%)',
                  backgroundSize: '260% 100%',
                  backgroundRepeat: 'no-repeat',
                  WebkitMaskImage: 'url(/wethink-logo.png)',
                  maskImage: 'url(/wethink-logo.png)',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  mixBlendMode: 'screen',
                }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12, letterSpacing: '0.52em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.3em' }}
              transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 text-[10.5px] uppercase text-[#8FD9E4] sm:text-[11.5px]"
            >
              {label ?? 'A digital experience by WeThink'}
            </motion.p>

            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 1.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 h-px w-32 origin-center"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(1,193,213,0.9), transparent)',
              }}
            />
          </motion.div>

          {/* the curtain parts */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-1/2 origin-top"
            exit={{ scaleY: 0, transition: { duration: 0.62, ease: [0.76, 0, 0.24, 1] } }}
            style={{ background: 'linear-gradient(180deg,#01222A,#012F38)' }}
          />
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-1/2 origin-bottom"
            exit={{ scaleY: 0, transition: { duration: 0.62, ease: [0.76, 0, 0.24, 1] } }}
            style={{ background: 'linear-gradient(0deg,#01222A,#012F38)' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
