'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?'

export default function ScrambleText({
  children,
  className,
  delay = 0,
  speed = 38,
}: {
  children: string
  className?: string
  delay?: number
  speed?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [output, setOutput] = useState<string | null>(null)
  const done = useRef(false)

  useEffect(() => {
    if (!inView || done.current) return
    done.current = true

    const text = children

    const start = () => {
      let frame = 0
      const framesPerChar = 5
      const id = setInterval(() => {
        const resolved = Math.floor(frame / framesPerChar)
        setOutput(
          text.split('').map((ch, i) => {
            if (ch === ' ') return ' '
            if (i < resolved) return ch
            return POOL[Math.floor(Math.random() * POOL.length)]
          }).join('')
        )
        frame++
        if (resolved >= text.length) {
          setOutput(text)
          clearInterval(id)
        }
      }, speed)
    }

    const t = setTimeout(start, delay)
    return () => clearTimeout(t)
  }, [inView])

  return (
    <span ref={ref} className={className} aria-label={children}>
      {output !== null
        ? output
        : <span aria-hidden style={{ opacity: 0 }}>{children}</span>
      }
    </span>
  )
}
