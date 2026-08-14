'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Interactive lotus (ดอกบัว) — the flower Thai hosts offer in greeting.
 *
 * It breathes gently, and on tap the petals spread wide and release a burst of
 * floating petals. Motion is suppressed for visitors who ask for less of it —
 * the page wraps this in <MotionConfig reducedMotion="user">.
 */

const PETALS = 8
const BURST = 10

export default function LotusBloom({ size = 116 }: { size?: number }) {
  const [open, setOpen] = useState(false)
  const [bursts, setBursts] = useState<number[]>([])

  const pop = () => {
    setOpen((v) => !v)
    const id = Date.now()
    setBursts((b) => [...b, id])
    window.setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 2600)
  }

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* escaping petals */}
      <AnimatePresence>
        {bursts.map((id) =>
          Array.from({ length: BURST }).map((_, i) => {
            const angle = (i / BURST) * Math.PI * 2
            const dist = 90 + Math.random() * 80
            return (
              <motion.span
                key={`${id}-${i}`}
                initial={{ x: 0, y: 0, opacity: 0.9, scale: 0.5, rotate: 0 }}
                animate={{
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist - 40,
                  opacity: 0,
                  scale: 1,
                  rotate: (Math.random() - 0.5) * 260,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2, ease: 'easeOut' }}
                className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: i % 3 === 0 ? '#6FC7D8' : i % 3 === 1 ? '#9FDDE8' : '#CBEEF3',
                }}
              />
            )
          }),
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={pop}
        aria-label="Bloom the lotus"
        whileTap={{ scale: 0.92 }}
        className="relative block h-full w-full cursor-pointer rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[#037A8A] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
      >
        <motion.svg
          viewBox="0 0 120 120"
          className="h-full w-full drop-shadow-[0_6px_18px_rgba(3,122,138,0.18)]"
          animate={{ scale: [1, 1.035, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <defs>
            <radialGradient id="lotusCore" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#8FE3F0" />
              <stop offset="100%" stopColor="#029FB1" />
            </radialGradient>
          </defs>

          {/* back ring — outer leaves */}
          {Array.from({ length: PETALS }).map((_, i) => (
            <g key={`b${i}`} transform={`rotate(${(360 / PETALS) * i + 22.5} 60 60)`}>
              <motion.path
                d="M60 26 C71 40 71 54 60 66 C49 54 49 40 60 26Z"
                fill="#B7E4E9"
                opacity={0.55}
                style={{ transformBox: 'view-box', transformOrigin: '60px 60px' }}
                animate={{ scale: open ? 1.3 : 1.08 }}
                transition={{ type: 'spring', stiffness: 90, damping: 14, delay: i * 0.02 }}
              />
            </g>
          ))}

          {/* front ring — main petals */}
          {Array.from({ length: PETALS }).map((_, i) => (
            <g key={`f${i}`} transform={`rotate(${(360 / PETALS) * i} 60 60)`}>
              <motion.path
                d="M60 18 C73 36 73 54 60 68 C47 54 47 36 60 18Z"
                fill={i % 2 === 0 ? '#9FDDE8' : '#6FC7D8'}
                style={{ transformBox: 'view-box', transformOrigin: '60px 60px' }}
                animate={{ scale: open ? 1.16 : 0.94 }}
                transition={{ type: 'spring', stiffness: 110, damping: 13, delay: i * 0.025 }}
              />
            </g>
          ))}

          {/* inner ring */}
          {Array.from({ length: 5 }).map((_, i) => (
            <g key={`i${i}`} transform={`rotate(${(360 / 5) * i + 36} 60 60)`}>
              <motion.path
                d="M60 34 C68 46 68 56 60 64 C52 56 52 46 60 34Z"
                fill="#CBEEF3"
                style={{ transformBox: 'view-box', transformOrigin: '60px 60px' }}
                animate={{ scale: open ? 1.08 : 0.88 }}
                transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.05 + i * 0.03 }}
              />
            </g>
          ))}

          <motion.circle
            cx="60"
            cy="60"
            r="9"
            fill="url(#lotusCore)"
            style={{ transformBox: 'view-box', transformOrigin: '60px 60px' }}
            animate={{ scale: open ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 140, damping: 11 }}
          />
        </motion.svg>
      </motion.button>
    </div>
  )
}
