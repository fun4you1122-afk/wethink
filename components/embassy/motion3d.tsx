'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'

/**
 * The depth system for the invitation.
 *
 * DepthScene establishes a perspective and tracks the pointer (or the phone's
 * tilt). DepthLayer places its children at a z distance inside that scene, so
 * layers separate and slide against one another as the visitor moves. Real 3D
 * transforms, not offset shadows.
 *
 * Everything here is transform and opacity only, so it stays on the compositor.
 */

type Ctx = { rx: MotionValue<number>; ry: MotionValue<number>; on: boolean; zScale: number }
const DepthCtx = createContext<Ctx | null>(null)

export function DepthScene({
  children,
  className = '',
  strength = 1,
  perspective = 1100,
}: {
  children: React.ReactNode
  className?: string
  /** multiplier on how far layers swing */
  strength?: number
  perspective?: number
}) {
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const [on, setOn] = useState(false)
  const [zScale, setZScale] = useState(0)

  useEffect(() => {
    const compact = window.innerWidth < 768
    setZScale(compact ? 0 : 1)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setOn(true)

    const onPointer = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 2)
      py.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      px.set(Math.max(-1, Math.min(1, e.gamma / 35)))
      py.set(Math.max(-1, Math.min(1, (e.beta - 45) / 45)))
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('deviceorientation', onTilt, true)
    return () => {
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('deviceorientation', onTilt, true)
    }
  }, [px, py])

  const spring = { stiffness: 90, damping: 22, mass: 0.6 }
  const rx = useSpring(useTransform(py, (v) => -v * 3.2 * strength), spring)
  const ry = useSpring(useTransform(px, (v) => v * 4 * strength), spring)

  return (
    <DepthCtx.Provider value={{ rx, ry, on, zScale }}>
      <div className={className} style={{ perspective, transformStyle: 'preserve-3d' }}>
        <motion.div
          style={{
            rotateX: on ? rx : 0,
            rotateY: on ? ry : 0,
            transformStyle: 'preserve-3d',
          }}
        >
          {children}
        </motion.div>
      </div>
    </DepthCtx.Provider>
  )
}

/** One plane inside a DepthScene. Higher z sits nearer the viewer. */
export function DepthLayer({
  children,
  z = 0,
  className = '',
}: {
  children: React.ReactNode
  z?: number
  className?: string
}) {
  const ctx = useContext(DepthCtx)
  // hooks must run unconditionally, so keep local fallbacks and pick after
  const zeroX = useMotionValue(0)
  const zeroY = useMotionValue(0)
  const depth = z * (ctx?.zScale ?? 0)
  const shiftX = useTransform(ctx?.ry ?? zeroX, (v) => (v / 4) * depth * 0.22)
  const shiftY = useTransform(ctx?.rx ?? zeroY, (v) => (-v / 3.2) * depth * 0.16)

  return (
    <motion.div
      className={className}
      style={{
        translateZ: depth,
        x: ctx?.on ? shiftX : 0,
        y: ctx?.on ? shiftY : 0,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * A headline that assembles letter by letter, each character swinging in on its
 * own axis. Whole words stay together so the line still wraps properly.
 */
export function SplitHeadline({
  text,
  className = '',
  style,
  delay = 0,
  solid,
}: {
  text: string
  className?: string
  style?: React.CSSProperties
  delay?: number
  /** colour worn during the entry, before the parent's gradient takes over */
  solid?: string
}) {
  const words = text.split(' ')
  const chars = text.replace(/ /g, '').length
  const [settled, setSettled] = useState(false)

  // Once the letters have landed we drop the per-character transforms. A
  // transformed descendant paints in its own layer, which stops an ancestor's
  // background-clip:text gradient from covering it — so the parent ramp only
  // works after the entry finishes.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettled(true)
      return
    }
    const ms = (delay + chars * 0.045 + 0.9) * 1000
    const id = window.setTimeout(() => setSettled(true), ms)
    return () => window.clearTimeout(id)
  }, [delay, chars])

  if (settled) {
    return (
      <span className={className} style={{ ...style, display: 'inline-block' }}>
        {text}
      </span>
    )
  }

  let i = 0
  return (
    <span className={className} style={{ ...style, display: 'inline-block' }}>
      {words.map((word, w) => (
        <span key={w} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {Array.from(word).map((ch) => {
            const at = delay + i * 0.045
            i += 1
            return (
              <motion.span
                key={`${w}-${i}`}
                initial={{ opacity: 0, rotateX: -78, y: '0.32em', filter: 'blur(6px)' }}
                animate={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: at }}
                style={{
                  display: 'inline-block',
                  transformOrigin: '50% 100%',
                  // While a letter is transformed it paints in its own layer,
                  // where the parent's background-clip:text gradient cannot
                  // reach it. Without an ink of its own it would be invisible
                  // for the whole entry, which read as a blank gap.
                  color: solid,
                  WebkitTextFillColor: solid,
                }}
              >
                {ch}
              </motion.span>
            )
          })}
          {w < words.length - 1 && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}

/** A card that tips toward the pointer, with a highlight that follows it. */
export function TiltCard({
  children,
  className = '',
  max = 9,
}: {
  children: React.ReactNode
  className?: string
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spring = { stiffness: 220, damping: 20, mass: 0.4 }
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), spring)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), spring)
  const glareX = useTransform(px, [-0.5, 0.5], ['12%', '88%'])
  const glare = useTransform(
    glareX,
    (x) => `radial-gradient(140px 90px at ${x} 12%, rgba(255,255,255,0.5), transparent 70%)`,
  )

  const move = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return
    const b = el.getBoundingClientRect()
    px.set((e.clientX - b.left) / b.width - 0.5)
    py.set((e.clientY - b.top) / b.height - 0.5)
  }
  const reset = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      className={className}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 900 }}
    >
      <div style={{ transformStyle: 'preserve-3d', position: 'relative' }}>
        {children}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[18px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
        />
      </div>
    </motion.div>
  )
}
