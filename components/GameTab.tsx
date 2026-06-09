'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'

// Game is heavy + canvas-only — load it only when the user opens it
const SonicGame = dynamic(() => import('./SonicGame'), { ssr: false })

/* Retro pixel spaceship icon */
function PixelIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      {/* exhaust flame */}
      <rect x="6" y="14" width="1" height="2" fill="#FFD020" />
      <rect x="9" y="14" width="1" height="2" fill="#FFD020" />
      <rect x="7" y="13" width="2" height="2" fill="#FF8020" />
      {/* engine base */}
      <rect x="5" y="11" width="6" height="2" fill="#5030D8" />
      {/* wings */}
      <rect x="1" y="9" width="4" height="3" fill="#4020C0" />
      <rect x="11" y="9" width="4" height="3" fill="#4020C0" />
      <rect x="2" y="11" width="2" height="1" fill="#7050FF" />
      <rect x="12" y="11" width="2" height="1" fill="#7050FF" />
      {/* hull */}
      <rect x="5" y="4" width="6" height="7" fill="#6040E8" />
      <rect x="6" y="4" width="4" height="7" fill="#7050FF" />
      {/* nose */}
      <rect x="6" y="2" width="4" height="2" fill="#6040E8" />
      <rect x="7" y="1" width="2" height="1" fill="#5030D0" />
      {/* cockpit */}
      <rect x="7" y="5" width="2" height="3" fill="#A0E8FF" />
      <rect x="7" y="5" width="1" height="1" fill="#E0F8FF" />
    </svg>
  )
}

export default function GameTab() {
  const [open, setOpen] = useState(false)

  // Lock background scroll while the game is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {/* Bottom-left tab */}
      <motion.button
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-2xl"
        style={{
          background: 'rgba(5,3,12,0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(124,58,237,0.35)',
          boxShadow: '0 8px 30px rgba(124,58,237,0.28)',
        }}
        aria-label="Play the WeThink mini-game"
      >
        <motion.span
          animate={{ rotate: [0, -8, 8, -8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
          className="flex items-center justify-center"
        >
          <PixelIcon />
        </motion.span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[10px] uppercase tracking-widest text-violet-300/80 font-semibold">Need a break?</span>
          <span className="text-sm font-extrabold text-white">Let&apos;s Play!</span>
        </span>
      </motion.button>

      {/* Game modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            style={{ background: 'rgba(5,3,12,0.9)', backdropFilter: 'blur(10px)' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-3xl p-5 md:p-6"
              style={{
                background: 'linear-gradient(180deg, #0D0820, #050508)',
                border: '1px solid rgba(124,58,237,0.25)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <PixelIcon size={28} />
                  <div className="flex flex-col leading-tight">
                    <span className="text-white font-extrabold text-lg">WeThink Space</span>
                    <span className="text-[11px] text-violet-300/70 uppercase tracking-wider">A little break — defend the sector</span>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                  aria-label="Close game"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <SonicGame />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
