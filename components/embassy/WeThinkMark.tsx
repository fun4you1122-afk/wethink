'use client'

import { motion } from 'framer-motion'

/**
 * The WeThink monogram as a drawable path.
 *
 * The raster logo can't be animated stroke-first, so the mark is rebuilt here
 * as geometry: the bare W, drawn clean. The dot from the full lockup reads as a
 * stray speck at ornament sizes, so it is left to the real logo in the masthead
 * and the footer.
 */

export const W_PATH = 'M6 8 L15 30 L24 15 L33 30 L42 8'

export function WeThinkMark({
  size = 36,
  stroke = '#037A8A',
  width = 4.6,
  className = '',
  draw = false,
  delay = 0,
}: {
  size?: number
  stroke?: string
  width?: number
  className?: string
  /** animate the stroke on as if drawn by hand */
  draw?: boolean
  delay?: number
}) {
  return (
    <svg
      viewBox="0 0 50 38"
      width={size}
      height={(size * 38) / 50}
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d={W_PATH}
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={draw ? { pathLength: 0, opacity: 0 } : false}
        animate={draw ? { pathLength: 1, opacity: 1 } : undefined}
        transition={draw ? { duration: 1.05, ease: [0.22, 1, 0.36, 1], delay } : undefined}
      />
    </svg>
  )
}
