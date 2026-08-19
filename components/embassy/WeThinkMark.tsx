'use client'

import { motion } from 'framer-motion'

/**
 * The WeThink monogram as a drawable path.
 *
 * The raster logo can't be animated stroke-first, so the mark is rebuilt here
 * as geometry: two descending strokes forming the W, plus the dot. Used by the
 * entrance signature, the scroll thread, and the section dividers, so one shape
 * carries the studio's presence through every page.
 */

export const W_PATH = 'M6 8 L15 30 L24 15 L33 30 L42 8'
export const DOT = { cx: 44.5, cy: 9.5, r: 3.4 }

export function WeThinkMark({
  size = 36,
  stroke = '#037A8A',
  dot = '#01C1D5',
  width = 4.6,
  className = '',
  draw = false,
  delay = 0,
}: {
  size?: number
  stroke?: string
  dot?: string
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
      <motion.circle
        cx={DOT.cx}
        cy={DOT.cy}
        r={DOT.r}
        fill={dot}
        initial={draw ? { scale: 0, opacity: 0 } : false}
        animate={draw ? { scale: 1, opacity: 1 } : undefined}
        style={{ transformBox: 'view-box', transformOrigin: `${DOT.cx}px ${DOT.cy}px` }}
        transition={
          draw ? { type: 'spring', stiffness: 300, damping: 14, delay: delay + 0.95 } : undefined
        }
      />
    </svg>
  )
}
