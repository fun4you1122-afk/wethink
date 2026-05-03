'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  const springConfig = { damping: 28, stiffness: 300, mass: 0.5 }
  const ringSpringConfig = { damping: 20, stiffness: 150, mass: 0.8 }

  const smoothX = useSpring(cursorX, ringSpringConfig)
  const smoothY = useSpring(cursorY, ringSpringConfig)
  const dotSmoothX = useSpring(dotX, springConfig)
  const dotSmoothY = useSpring(dotY, springConfig)

  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  const isHoveringRef = useRef(false)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      dotX.set(e.clientX)
      dotY.set(e.clientY)
    }

    const handleEnter = () => {
      isHoveringRef.current = true
      ringRef.current?.classList.add('cursor-hover')
      dotRef.current?.classList.add('cursor-hover')
    }

    const handleLeave = () => {
      isHoveringRef.current = false
      ringRef.current?.classList.remove('cursor-hover')
      dotRef.current?.classList.remove('cursor-hover')
    }

    window.addEventListener('mousemove', move)

    const interactives = document.querySelectorAll(
      'a, button, [data-cursor-hover], input, textarea, select'
    )
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', handleEnter)
      el.addEventListener('mouseleave', handleLeave)
    })

    // MutationObserver to pick up dynamically added elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, [data-cursor-hover], input, textarea, select').forEach((el) => {
        el.addEventListener('mouseenter', handleEnter)
        el.addEventListener('mouseleave', handleLeave)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', move)
      observer.disconnect()
    }
  }, [cursorX, cursorY, dotX, dotY])

  if (isTouch) return null

  return (
    <>
      {/* Outer ring */}
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="w-10 h-10 rounded-full border border-violet-300 transition-all duration-200"
          style={{ opacity: 0.7 }}
          whileHover={{ scale: 1.8 }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          x: dotSmoothX,
          y: dotSmoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div className="w-2 h-2 rounded-full bg-violet-400" />
      </motion.div>

      <style jsx global>{`
        .cursor-hover .w-10 {
          transform: scale(1.6);
          background: rgba(167, 139, 250, 0.1);
          border-color: rgb(167, 139, 250);
        }
      `}</style>
    </>
  )
}
