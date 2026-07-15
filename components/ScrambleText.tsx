'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?'

function rnd() {
  return POOL[Math.floor(Math.random() * POOL.length)]
}

export default function ScrambleText({
  children,
  className,
  delay = 0,
  speed = 42,
}: {
  children: string
  className?: string
  delay?: number
  speed?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [output, setOutput] = useState(children)
  const done = useRef(false)

  useEffect(() => {
    if (!inView || done.current) return
    done.current = true

    const text = children
    let chaosId: ReturnType<typeof setInterval> | undefined
    let resolveId: ReturnType<typeof setInterval> | undefined

    const run = () => {
      // Phase 1 — scramble everything (8 chaotic frames)
      let chaos = 0
      chaosId = setInterval(() => {
        setOutput(text.split('').map(ch => (ch === ' ' ? ' ' : rnd())).join(''))
        chaos++
        if (chaos >= 8) {
          clearInterval(chaosId)

          // Phase 2 — resolve each character left-to-right
          let frame = 0
          const framesPerChar = 5
          resolveId = setInterval(() => {
            const resolved = Math.floor(frame / framesPerChar)
            setOutput(
              text.split('').map((ch, i) => {
                if (ch === ' ') return ' '
                if (i < resolved) return ch
                return rnd()
              }).join('')
            )
            frame++
            if (resolved >= text.length) {
              setOutput(text)
              clearInterval(resolveId)
            }
          }, speed)
        }
      }, 35)
    }

    const t = setTimeout(run, delay)
    return () => {
      clearTimeout(t)
      if (chaosId) clearInterval(chaosId)
      if (resolveId) clearInterval(resolveId)
    }
  }, [inView])

  return (
    <span ref={ref} className={className} aria-label={children}>
      {output}
    </span>
  )
}
