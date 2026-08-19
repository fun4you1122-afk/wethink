'use client'

import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { useRef } from 'react'

/**
 * A ribbon of Thai words travelling across the page between sections, in the
 * spirit of a temple frieze. It drifts on its own and speeds up, or reverses,
 * with the direction the visitor is scrolling.
 *
 * The words are real and correct: welcome, thank you, delicious, beautiful,
 * happiness, friend, and the festival's own greeting.
 */

const WORDS: [string, string][] = [
  ['ยินดีต้อนรับ', 'welcome'],
  ['สวัสดี', 'hello'],
  ['ขอบคุณ', 'thank you'],
  ['อร่อย', 'delicious'],
  ['สวยงาม', 'beautiful'],
  ['ความสุข', 'happiness'],
  ['เพื่อน', 'friend'],
  ['สบายดี', 'well'],
]

export default function ThaiMarquee() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { stiffness: 200, damping: 46, mass: 0.4 })
  // scrolling drags the ribbon along with you
  const drag = useTransform(smooth, [-3000, 0, 3000], ['12%', '0%', '-12%'], { clamp: true })

  const row = [...WORDS, ...WORDS]

  return (
    <div
      ref={ref}
      className="relative left-1/2 my-12 w-screen -translate-x-1/2 overflow-hidden py-5"
      aria-hidden="true"
      style={{
        borderTop: '1px solid rgba(3,122,138,0.16)',
        borderBottom: '1px solid rgba(3,122,138,0.16)',
        background:
          'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.42) 18%, rgba(255,255,255,0.42) 82%, rgba(255,255,255,0) 100%)',
      }}
    >
      <motion.div className="flex w-max" style={{ x: drag }}>
        <motion.div
          className="flex w-max items-baseline gap-10 pr-10"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 46, ease: 'linear', repeat: Infinity }}
        >
          {row.map(([thai, en], i) => (
            <span key={`${thai}-${i}`} className="flex items-baseline gap-3 whitespace-nowrap">
              <span className="text-[22px]" style={{ color: '#026B79' }}>
                {thai}
              </span>
              <span
                className="text-[10.5px] uppercase tracking-[0.24em]"
                style={{ color: '#4C8A93' }}
              >
                {en}
              </span>
              <span className="text-[12px]" style={{ color: '#8FC9D2' }}>
                ✦
              </span>
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
