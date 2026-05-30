'use client'

import { useRef, useState, useEffect } from 'react'
import { useScroll, useMotionValueEvent, motion } from 'framer-motion'

const TOTAL_FRAMES = 4

export default function ScrollFrames() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeFrame, setActiveFrame] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const desktopVideoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const frame = Math.min(Math.floor(v * TOTAL_FRAMES), TOTAL_FRAMES - 1)
    setActiveFrame(frame)
  })

  // Play active video, pause others
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return
      if (i === activeFrame) {
        vid.play().catch(() => {})
      } else {
        vid.pause()
        vid.currentTime = 0
      }
    })
    desktopVideoRefs.current.forEach((vid, i) => {
      if (!vid) return
      if (i === activeFrame) {
        vid.play().catch(() => {})
      } else {
        vid.pause()
        vid.currentTime = 0
      }
    })
  }, [activeFrame])

  return (
    <section ref={sectionRef} style={{ height: `${TOTAL_FRAMES * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">

        {/* Video layers */}
        {Array.from({ length: TOTAL_FRAMES }).map((_, i) => (
          <div key={i} className="absolute inset-0">
            {/* Mobile */}
            <motion.video
              ref={(el) => { videoRefs.current[i] = el }}
              className="absolute inset-0 w-full h-full object-cover md:hidden"
              src={`/scroll-frames/${i + 1}.mp4`}
              muted
              playsInline
              loop
              preload="auto"
              animate={{ opacity: activeFrame === i ? 1 : 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            {/* Desktop */}
            <motion.video
              ref={(el) => { desktopVideoRefs.current[i] = el }}
              className="absolute inset-0 w-full h-full object-cover hidden md:block"
              src={`/scroll-frames/${i + 1}-desktop.mp4`}
              muted
              playsInline
              loop
              preload="auto"
              animate={{ opacity: activeFrame === i ? 1 : 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        ))}

        {/* Progress dots — right side */}
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

        {/* Frame counter — bottom left */}
        <div className="absolute bottom-8 left-6 md:left-10 z-20 flex items-center gap-3">
          <span className="text-xs font-semibold tabular-nums text-white/50 tracking-widest">
            {String(activeFrame + 1).padStart(2, '0')}
            <span className="mx-1.5 text-white/20">/</span>
            {String(TOTAL_FRAMES).padStart(2, '0')}
          </span>
          {/* Thin progress bar */}
          <div className="w-20 md:w-32 h-px bg-white/15 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-violet-400"
              animate={{ width: `${((activeFrame + 1) / TOTAL_FRAMES) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            />
          </div>
        </div>

        {/* Scroll nudge — fades out after first scroll */}
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
  )
}
