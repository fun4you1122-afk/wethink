'use client'

import { useEffect, useRef, useId } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

/**
 * A line that draws itself as you scroll, with an arrow riding along it.
 *
 * Two things happen on the same scrubbed timeline. The path is hidden by
 * setting its dash offset to its own length, then animated back to zero so it
 * appears to draw. At the same time the arrow is placed on that same path with
 * MotionPathPlugin and autoRotate, so it turns through the curves rather than
 * sliding along flat.
 *
 * Scrub ties both to scroll position rather than to a clock, so the line only
 * moves while the reader does. Lenis is already fed into ScrollTrigger by
 * SmoothScroll, so the two stay in step.
 */

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

type Props = {
  /** the curve, in a 0 0 100 <height> viewBox */
  d?: string
  /** viewBox height, which also sets the aspect ratio */
  viewHeight?: number
  className?: string
  colour?: string
  /** how thick the drawn line is, in viewBox units */
  width?: number
}

const DEFAULT_PATH = 'M 50 0 C 12 60, 88 130, 50 190 C 12 250, 88 320, 50 380'

export default function ScrollPath({
  d = DEFAULT_PATH,
  viewHeight = 380,
  className = '',
  colour = '#7C3AED',
  width = 1.1,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const arrowRef = useRef<SVGGElement>(null)
  const raw = useId()
  const gradientId = `sp-${raw.replace(/[:]/g, '')}`

  useEffect(() => {
    const path = pathRef.current
    const arrow = arrowRef.current
    const wrap = wrapRef.current
    if (!path || !arrow || !wrap) return

    const length = path.getTotalLength()
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })

    // Readers who ask for less motion get the finished state, not a blank gap
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(path, { strokeDashoffset: 0 })
      gsap.set(arrow, { opacity: 0 })
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: 'top 85%',
        end: 'bottom 45%',
        scrub: 0.6,
      },
    })

    tl.to(path, { strokeDashoffset: 0, ease: 'none', duration: 10 }, 0).to(
      arrow,
      {
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: 90,
        },
        ease: 'none',
        duration: 10,
      },
      0,
    )

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [d])

  return (
    <div
      ref={wrapRef}
      data-scroll-path=""
      className={`pointer-events-none relative w-full ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 100 ${viewHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colour} stopOpacity="0.15" />
            <stop offset="35%" stopColor={colour} stopOpacity="0.55" />
            <stop offset="100%" stopColor={colour} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* the faint full route, so the drawn line has somewhere to go */}
        <path d={d} fill="none" stroke={colour} strokeOpacity="0.09" strokeWidth={width} />

        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={width}
          strokeLinecap="round"
        />

        <g ref={arrowRef}>
          <circle r="8" fill={colour} fillOpacity="0.1" />
          <circle r="4.6" fill={colour} />
          <path
            d="M -2.4 -1.2 L 0 1.5 L 2.4 -1.2"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.05"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  )
}
