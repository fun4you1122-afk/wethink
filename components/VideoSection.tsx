'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const VIDEO_ID = 'J9LK6EtxzgM'

export default function VideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96])
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.4, 1, 1, 0.4])

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="orb w-[600px] h-[600px] bg-violet-900/20 opacity-40 bottom-[-200px] right-[-200px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
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
            className="text-4xl md:text-6xl font-black text-white mt-3"
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

        {/* Video — autoplay, muted, looping, no controls */}
        <motion.div
          style={{ scale, opacity }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Glow border */}
          <div className="absolute inset-0 rounded-3xl border border-violet-500/20 pointer-events-none z-10" />
          <div className="absolute inset-0 rounded-3xl shadow-[0_0_80px_rgba(124,58,237,0.25)] pointer-events-none z-10" />

          {/* 16:9 wrapper */}
          <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&modestbranding=1&iv_load_policy=3&controls=0&autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&color=white&showinfo=0&disablekb=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="WeThink — The Future is Digital"
              style={{ border: 0 }}
            />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-10"
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
    </section>
  )
}
