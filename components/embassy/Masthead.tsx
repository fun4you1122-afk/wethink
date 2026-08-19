'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

/**
 * The three marks that head the invitation: WeThink top-left, Reem Mall
 * top-right, with the Embassy seal crowning the hero between them.
 *
 * It rides above the page and condenses as the visitor scrolls — the marks
 * shrink and settle onto a glass bar — so the studio's logo is on screen from
 * the first moment to the last without ever covering the content.
 */

export default function Masthead() {
  const { scrollY } = useScroll()
  const eased = useSpring(scrollY, { stiffness: 140, damping: 30, mass: 0.3 })

  const logoH = useTransform(eased, [0, 220], [46, 32])
  const reemH = useTransform(eased, [0, 220], [44, 30])
  const barAlpha = useTransform(eased, [0, 160], [0, 0.72])
  const barBlur = useTransform(eased, [0, 160], ['blur(0px)', 'blur(14px)'])
  const barShadow = useTransform(eased, [0, 200], [
    '0 0 0 rgba(1,88,102,0)',
    '0 6px 26px rgba(1,88,102,0.14)',
  ])
  const pad = useTransform(eased, [0, 220], ['22px', '12px'])

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-40"
      style={{ paddingTop: pad, paddingBottom: pad, boxShadow: barShadow }}
    >
      {/* the bar only materialises once you start moving */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background: useTransform(barAlpha, (a) => `rgba(255,255,255,${a})`),
          backdropFilter: barBlur,
          WebkitBackdropFilter: barBlur,
        }}
      />

      <div className="flex items-center justify-between px-5 sm:px-8">
        <a
          href="https://www.wethink.ae"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WeThink"
          className="block"
        >
          <motion.img
            src="/wethink-logo.png"
            alt="WeThink"
            width={140}
            height={47}
            style={{ height: logoH }}
            className="w-auto drop-shadow-[0_2px_10px_rgba(1,88,102,0.18)]"
          />
        </a>

        <motion.img
          src="/embassy/reem-mall.png"
          alt="Reem Mall"
          width={132}
          height={67}
          style={{ height: reemH }}
          className="w-auto"
        />
      </div>
    </motion.div>
  )
}
