'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { WeThinkMark } from './WeThinkMark'

/**
 * A small WeThink dock on the left edge of the invitation.
 *
 * It introduces itself once and then gets out of the way, which is the whole
 * idea: it slides open on its own a few seconds in, waits about seven seconds,
 * and if nobody touches it, folds back to a slim tab against the edge. Anyone
 * who wants it can reopen it; anyone who does not is left alone.
 *
 * The right side of these pages is already spoken for by the concierge and the
 * thread rail, so it lives on the left.
 *
 * Closing folds it back to the tab rather than removing it. The mark stays on
 * the edge either way, and nothing is remembered between visits: a refresh
 * gets the introduction again, which is the point of it being there.
 */

/** lucide dropped its brand icons at v1, so the Instagram mark is drawn here. */
function InstagramGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

const OPEN_AFTER = 4200
const FOLD_AFTER = 6200

const LINKS = [
  {
    label: 'Follow WeThink',
    detail: '@wethink.ae',
    href: 'https://www.instagram.com/wethink.ae/',
    Icon: InstagramGlyph,
  },
  {
    label: 'What we build',
    detail: 'wethink.ae',
    href: 'https://www.wethink.ae/services',
    Icon: null as null | typeof InstagramGlyph,
  },
] as const

export default function StudioDock() {
  const [state, setState] = useState<'hidden' | 'tab' | 'open'>('hidden')
  const [touched, setTouched] = useState(false)
  const foldTimer = useRef<number | undefined>(undefined)

  // Closing folds it away rather than removing it, so the studio mark is
  // always somewhere on the edge and the guest can bring it back.
  const dismiss = useCallback(() => {
    setTouched(true)
    setState('tab')
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = window.setTimeout(() => setState(reduced ? 'tab' : 'open'), OPEN_AFTER)
    return () => window.clearTimeout(id)
  }, [])

  // fold back on its own, but only while it has been left alone
  useEffect(() => {
    if (state !== 'open' || touched) return
    foldTimer.current = window.setTimeout(() => setState('tab'), FOLD_AFTER)
    return () => window.clearTimeout(foldTimer.current)
  }, [state, touched])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state === 'open') setState('tab')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state])

  if (state === 'hidden') return null

  return (
    <div className="fixed bottom-24 left-0 z-40 sm:bottom-28">
      <AnimatePresence mode="wait" initial={false}>
        {state === 'tab' ? (
          <motion.button
            key="tab"
            type="button"
            onClick={() => {
              setTouched(true)
              setState('open')
            }}
            aria-label="Open the WeThink panel"
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-14 w-11 items-center justify-center rounded-r-2xl border border-l-0 shadow-[0_10px_26px_rgba(1,88,102,0.18)]"
            style={{ background: 'rgba(255,255,255,0.92)', borderColor: 'rgba(3,122,138,0.18)' }}
          >
            <WeThinkMark size={20} stroke="#015866" width={5} />
          </motion.button>
        ) : (
          <motion.div
            key="open"
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            onMouseEnter={() => setTouched(true)}
            onFocusCapture={() => setTouched(true)}
            className="relative w-[244px] max-w-[calc(100vw-28px)] overflow-hidden rounded-r-3xl border border-l-0 p-3.5 shadow-[0_18px_44px_rgba(1,88,102,0.22)] sm:w-[268px] sm:p-4"
            style={{ background: 'rgba(255,255,255,0.95)', borderColor: 'rgba(3,122,138,0.18)' }}
          >
            {/* one slow sheen as it arrives, then never again */}
            <motion.span
              aria-hidden="true"
              initial={{ x: '-120%' }}
              animate={{ x: '140%' }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.25 }}
              className="pointer-events-none absolute inset-y-0 w-1/2"
              style={{
                background:
                  'linear-gradient(100deg, transparent, rgba(1,193,213,0.20), transparent)',
              }}
            />

            <div className="flex items-start justify-between gap-3">
              <img src="/wethink-logo.png" alt="WeThink" width={96} height={32} className="h-8 w-auto" />
              <button
                type="button"
                onClick={dismiss}
                aria-label="Close the panel"
                className="-mr-1 -mt-1 rounded-full p-1.5 transition-colors hover:bg-[rgba(3,122,138,0.08)]"
                style={{ color: '#5b7d86' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* the sentence is a nicety; on a phone the height it costs is
                better spent not covering the countdown behind it */}
            <p className="mt-2.5 hidden text-[12.5px] leading-snug sm:block" style={{ color: '#46707A' }}>
WeThink is an IT consulting company in Abu Dhabi. This invitation is ours.
            </p>

            <div className="mt-3.5 flex flex-col gap-2">
              {LINKS.map(({ label, detail, href, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 no-underline transition-colors hover:bg-[rgba(1,193,213,0.10)]"
                  style={{ border: '1px solid rgba(3,122,138,0.14)' }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: 'linear-gradient(135deg,#015866,#029FB1)' }}
                  >
                    {Icon ? (
                      <Icon className="h-4 w-4 text-white" />
                    ) : (
                      <WeThinkMark size={15} stroke="#ffffff" width={5} />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold" style={{ color: '#0C3A42' }}>
                      {label}
                    </span>
                    <span className="block text-[11.5px]" style={{ color: '#6b8f97' }}>
                      {detail}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
