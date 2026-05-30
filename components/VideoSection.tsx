'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent, useInView } from 'framer-motion'

const TOTAL_FRAMES = 4
const VH_PER_FRAME = 300

export default function VideoSection() {
  const headingRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headingRef, { once: true, margin: '-80px' })

  const [activeFrame, setActiveFrame] = useState(0)
  const activeFrameRef = useRef(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const desktopVideoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const segment = 1 / TOTAL_FRAMES
    const buffer = segment * 0.08 // 8% buffer before advancing
    const current = activeFrameRef.current

    const nextThreshold = (current + 1) * segment + buffer
    const prevThreshold = current * segment - buffer

    let next = current
    if (v >= nextThreshold && current < TOTAL_FRAMES - 1) next = current + 1
    else if (v < prevThreshold && current > 0) next = current - 1

    if (next !== current) {
      activeFrameRef.current = next
      setActiveFrame(next)
    }
  })

  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return
      if (i === activeFrame) { vid.play().catch(() => {}) }
      else { vid.pause(); vid.currentTime = 0 }
    })
    desktopVideoRefs.current.forEach((vid, i) => {
      if (!vid) return
      if (i === activeFrame) { vid.play().catch(() => {}) }
      else { vid.pause(); vid.currentTime = 0 }
    })
  }, [activeFrame])

  return (
    <div>
      {/* Section header — normal flow, above the pinned area */}
      <div ref={headingRef} className="section-padding pb-0 relative overflow-hidden">
        <div className="orb w-[600px] h-[600px] bg-violet-900/20 opacity-40 bottom-[-200px] right-[-200px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label mx-auto">See Us in Action</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-violet-50 mt-3"
          >
            The Future is{' '}
            <span className="gradient-text">Digital</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-text-muted text-lg max-w-xl mx-auto"
          >
            Technology is reshaping every industry. The question isn&apos;t whether to transform —
            it&apos;s whether you&apos;ll lead the change or follow it.
          </motion.p>
        </div>
      </div>

      {/* Pinned scroll frames */}
      <section ref={sectionRef} style={{ height: `${TOTAL_FRAMES * VH_PER_FRAME}vh` }} className="relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">

          {/* Video layers */}
          {Array.from({ length: TOTAL_FRAMES }).map((_, i) => (
            <div key={i} className="absolute inset-0">
              <motion.video
                ref={(el) => { videoRefs.current[i] = el }}
                className="absolute inset-0 w-full h-full object-cover md:hidden"
                src={`/scroll-frames/${i + 1}.mp4`}
                muted playsInline loop preload="auto"
                animate={{ opacity: activeFrame === i ? 1 : 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
              <motion.video
                ref={(el) => { desktopVideoRefs.current[i] = el }}
                className="absolute inset-0 w-full h-full object-cover hidden md:block"
                src={`/scroll-frames/${i + 1}-desktop.mp4`}
                muted playsInline loop preload="auto"
                animate={{ opacity: activeFrame === i ? 1 : 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
          ))}

          {/* Progress dots */}
          <div className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20">
            {Array.from({ length: TOTAL_FRAMES }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full"
                animate={{
                  height: activeFrame === i ? 28 : 6,
                  background: activeFrame === i ? '#A78BFA' : 'rgba(255,255,255,0.25)',
                }}
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              />
            ))}
          </div>

          {/* Frame counter */}
          <div className="absolute bottom-8 left-6 md:left-10 z-20 flex items-center gap-3">
            <span className="text-xs font-semibold tabular-nums text-white/50 tracking-widest">
              {String(activeFrame + 1).padStart(2, '0')}
              <span className="mx-1.5 text-white/20">/</span>
              {String(TOTAL_FRAMES).padStart(2, '0')}
            </span>
            <div className="w-20 md:w-32 h-px bg-white/15 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-violet-400"
                animate={{ width: `${((activeFrame + 1) / TOTAL_FRAMES) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              />
            </div>
          </div>

          {/* Scroll nudge */}
          <motion.div
            className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-1.5 z-20"
            animate={{ opacity: activeFrame === 0 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-[10px] uppercase tracking-widest text-white/30">Scroll</span>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-4 h-7 border border-white/20 rounded-full flex items-start justify-center pt-1"
            >
              <div className="w-0.5 h-1.5 rounded-full bg-violet-400/60" />
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* CTA — normal flow, below the pinned area */}
      <div className="section-padding pt-14 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Ready to Transform?
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.75 9h10.5M10.5 5.25L14.25 9l-3.75 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
