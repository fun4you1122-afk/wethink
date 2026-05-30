'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

const pieces = [
  {
    id: 'left-arm',
    clip: 'polygon(0% 0%, 46% 0%, 46% 100%, 0% 100%)',
    fromX: -380,
    fromY: 80,
    fromRotate: -18,
  },
  {
    id: 'middle-arch',
    clip: 'polygon(35% 0%, 65% 0%, 65% 100%, 35% 100%)',
    fromX: 0,
    fromY: -300,
    fromRotate: 0,
  },
  {
    id: 'right-arm',
    clip: 'polygon(54% 38%, 100% 38%, 100% 100%, 54% 100%)',
    fromX: 380,
    fromY: 80,
    fromRotate: 18,
  },
  {
    id: 'dot',
    clip: 'polygon(66% 0%, 100% 0%, 100% 40%, 66% 40%)',
    fromX: 260,
    fromY: -280,
    fromRotate: 25,
  },
]

function Piece({
  piece,
  progress,
}: {
  piece: typeof pieces[0]
  progress: MotionValue<number>
}) {
  const x = useTransform(progress, [0, 1], [piece.fromX, 0])
  const y = useTransform(progress, [0, 1], [piece.fromY, 0])
  const rotate = useTransform(progress, [0, 1], [piece.fromRotate, 0])
  const opacity = useTransform(progress, [0, 0.25], [0, 1])

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        opacity,
        clipPath: piece.clip,
        position: 'absolute',
        inset: 0,
      }}
    >
      <img
        src="/logo.png"
        alt=""
        className="w-full h-full object-contain"
        draggable={false}
      />
    </motion.div>
  )
}

export default function LogoAssembly() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const assembleProgress = useTransform(scrollYProgress, [0, 0.65], [0, 1])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.65], [0, 1])
  const logoScale = useTransform(scrollYProgress, [0, 0.65, 0.85], [1.15, 1, 0.9])
  const textOpacity = useTransform(scrollYProgress, [0.68, 0.85], [0, 1])
  const textY = useTransform(scrollYProgress, [0.68, 0.85], [30, 0])
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  return (
    <section ref={sectionRef} style={{ height: '450vh' }} className="relative">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050508]">

        {/* Ambient glow */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          // inline style needed to use motion value
        >
          <div className="w-full h-full rounded-full" style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
          }} />
        </motion.div>

        {/* Logo */}
        <motion.div
          style={{ scale: logoScale }}
          className="relative w-[260px] h-[260px] md:w-[340px] md:h-[340px]"
        >
          {pieces.map((piece) => (
            <Piece key={piece.id} piece={piece} progress={assembleProgress} />
          ))}
        </motion.div>

        {/* Text after assembly */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="mt-6 text-center"
        >
          <p className="text-2xl md:text-3xl font-black tracking-tight text-white">
            We<span className="gradient-text">Think</span>
          </p>
          <p className="text-sm mt-2 tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Thank You for Visiting Us!
          </p>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest text-white/30">Scroll to assemble</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
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
