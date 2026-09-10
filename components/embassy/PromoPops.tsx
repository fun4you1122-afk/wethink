'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowUpRight, Mail, X } from 'lucide-react'
import { C, sans, serif } from './ui'

/**
 * A short series of WeThink pop-ups over the invitation.
 *
 * The dock on the left edge introduces the company once and then folds away,
 * and the card near the foot of the page waits for anyone who scrolls that
 * far. Plenty of guests will do neither: they open the link, read the slot
 * they came for, and put the phone away. These are for them.
 *
 * The rules that keep it hospitable rather than nagging:
 *   · one card at a time, at the top, clear of the concierge and the dock;
 *   · four in a whole visit, spaced further and further apart;
 *   · each folds itself away after a few seconds, untouched;
 *   · closing one ends the series, and so does following a link;
 *   · the clock only runs while the page is actually on screen, so a phone in
 *     a pocket does not burn through all four;
 *   · nothing shows until the signature intro has cleared.
 *
 * Ending the series ends it for that page view only. Nothing is written down,
 * so opening the link again — a reload, a new tab, coming back tomorrow —
 * starts it over. Guests arrive at this page once and read it in a minute;
 * a dismissal that outlived them would only mean the next person to pick up
 * the phone sees nothing.
 */

const WT = { cyan: '#03CFF2', blue: '#108FFC', violet: '#983CFC', ink: '#050D2E' }
const GRADIENT = `linear-gradient(120deg, ${WT.cyan}, ${WT.blue} 48%, ${WT.violet})`

const PROFILE = 'https://www.wethink.ae/company-profile'

type Pop = {
  id: string
  /** seconds of on-screen time before this one opens */
  at: number
  kicker: string
  title: string
  body: string
  cta: string
  href: string
  /** the mark that rides in the button, where the channel has one */
  icon?: 'whatsapp' | 'instagram' | 'mail'
  /** the closing card carries the profile QR */
  qr?: boolean
}

/** lucide dropped its brand icons at v1, so these two are drawn here. */
function WhatsAppGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.83c2.16 0 4.19.84 5.72 2.37a8.03 8.03 0 0 1 2.37 5.72c0 4.46-3.63 8.08-8.09 8.08a8.2 8.2 0 0 1-4.14-1.13l-.3-.18-3.07.81.82-3-.19-.31a8.03 8.03 0 0 1-1.23-4.28c0-4.46 3.63-8.08 8.11-8.08Zm-2.6 4.02c-.2 0-.52.08-.8.38-.28.3-1.05 1.02-1.05 2.49s1.08 2.89 1.23 3.09c.15.2 2.08 3.18 5.06 4.34 2.47.96 2.98.77 3.51.72.53-.05 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.57-.35-.3-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.66.15-.2.3-.75.95-.92 1.15-.17.2-.34.22-.63.07-.3-.15-1.24-.46-2.37-1.46-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.65-1.62-.9-2.22-.23-.57-.47-.49-.65-.5h-.55Z"/>
    </svg>
  )
}

function InstagramGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

const GLYPH = {
  whatsapp: WhatsAppGlyph,
  instagram: InstagramGlyph,
  mail: Mail,
} as const

const POPS: Pop[] = [
  {
    id: 'built',
    at: 7,
    kicker: 'Powered by WeThink',
    title: 'This programme is ours.',
    body: 'The live schedule you are reading was designed and built by WeThink, here in Abu Dhabi.',
    cta: '+971 50 312 5078',
    href: 'https://wa.me/971503125078?text=Hi%20WeThink%2C%20I%20saw%20the%20Marhaba%20Thailand%20programme.',
    icon: 'whatsapp',
  },
  {
    id: 'follow',
    at: 95,
    kicker: 'WeThink · Abu Dhabi',
    title: 'Follow along.',
    body: 'Reem Island, Makers District. AI, data, systems, strategy and brand work for teams across the UAE.',
    cta: '@wethink.ae',
    href: 'https://www.instagram.com/wethink.ae/',
    icon: 'instagram',
  },
  {
    id: 'talk',
    at: 210,
    kicker: 'Have an event of your own?',
    title: 'We can build you one.',
    body: 'Invitations, live programmes, dashboards and the systems behind them. Tell us what you need.',
    cta: 'info@wethink.ae',
    href: 'mailto:info@wethink.ae?subject=Marhaba%20Thailand%20%C2%B7%20WeThink',
    icon: 'mail',
  },
  {
    id: 'profile',
    at: 370,
    kicker: 'Before you go',
    title: 'Take WeThink with you.',
    body: 'Scan for the company profile: who we are, what we do, and the work behind it.',
    cta: 'Open the profile',
    href: PROFILE,
    qr: true,
  },
]

/** How long a card stays up on its own, in seconds. */
const DWELL = 11

export default function PromoPops() {
  const [shown, setShown] = useState<Pop | null>(null)
  const step = useRef(0)
  const elapsed = useRef(0)
  const finished = useRef(false)

  const stop = useCallback(() => {
    finished.current = true
    setShown(null)
  }, [])

  useEffect(() => {
    if (finished.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // ?promo=preview runs the whole series in about a minute, so the cards can
    // be checked without sitting on the page for six.
    const schedule = new URLSearchParams(window.location.search).get('promo') === 'preview'
      ? POPS.map((p, i) => ({ ...p, at: 8 + i * (DWELL + 4) }))
      : POPS

    let hideAt = Infinity
    const tick = window.setInterval(() => {
      if (finished.current || document.visibilityState !== 'visible') return
      elapsed.current += 1

      if (elapsed.current >= hideAt) {
        hideAt = Infinity
        setShown(null)
        return
      }

      const next = schedule[step.current]
      if (next && elapsed.current >= next.at && hideAt === Infinity) {
        step.current += 1
        hideAt = elapsed.current + DWELL
        setShown(next)
        if (step.current >= schedule.length) {
          // the last card has had its turn; do not come back this visit
          window.setTimeout(stop, DWELL * 1000)
        }
      }
    }, 1000)

    return () => window.clearInterval(tick)
  }, [stop])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[45] flex justify-center px-3">
      <AnimatePresence>
        {shown && (
          <motion.aside
            key={shown.id}
            initial={{ opacity: 0, y: -22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="pointer-events-auto mt-3 w-full max-w-[420px] overflow-hidden rounded-2xl border bg-white/95 shadow-[0_18px_44px_rgba(12,58,66,0.26)] backdrop-blur"
            style={{ borderColor: 'rgba(3,122,138,0.16)' }}
            aria-label="WeThink"
          >
            <div style={{ background: GRADIENT, height: 3 }} />

            <div className="flex items-start gap-3 px-4 pb-3.5 pt-3">
              <img
                src="/wethink-logo.png"
                alt="WeThink"
                width={92}
                height={30}
                className="mt-0.5 h-[26px] w-auto shrink-0"
              />

              <div className="min-w-0 flex-1">
                <div
                  className="text-[10.5px] font-semibold uppercase tracking-[0.13em]"
                  style={{ color: C.teal, fontFamily: sans }}
                >
                  {shown.kicker}
                </div>
                <div
                  className="mt-1 text-[16px] leading-tight"
                  style={{ color: WT.ink, fontFamily: serif }}
                >
                  {shown.title}
                </div>
                <p className="mt-1 text-[12.5px] leading-snug" style={{ color: C.inkSoft }}>
                  {shown.body}
                </p>

                <div className="mt-2.5 flex items-center gap-3">
                  <a
                    href={shown.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={stop}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-medium text-white"
                    style={{ background: GRADIENT, fontFamily: sans }}
                  >
                    {shown.icon
                      ? (() => {
                          const G = GLYPH[shown.icon]
                          return <G className="h-4 w-4" />
                        })()
                      : null}
                    {shown.cta}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                  </a>

                  {shown.qr && (
                    <a
                      href={shown.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={stop}
                      className="rounded-lg bg-white p-1"
                      style={{ boxShadow: `0 0 0 1px rgba(3,122,138,0.18)` }}
                      aria-label="Open the WeThink company profile"
                    >
                      <QRCodeSVG value={PROFILE} size={54} bgColor="#ffffff" fgColor={WT.ink} level="M" />
                    </a>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={stop}
                aria-label="Close, and no more of these"
                className="-mr-1 -mt-1 shrink-0 rounded-full p-1.5"
                style={{ color: C.inkSoft }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
