'use client'

import { motion } from 'framer-motion'

/**
 * Shared furniture for the Marhaba Thailand pages — the invitation, the
 * Opening Ceremony invite, and the daily programme all draw from here so the
 * three links look like one family.
 */

/** Teal ramp sampled from the Reem Mall RM mark. */
export const C = {
  bg: '#F2FAFB',
  bg2: '#E3F4F7',
  pale: '#CBEEF3',
  light: '#9FDDE8',
  mid: '#6FC7D8',
  tealDeep: '#015866',
  teal: '#037A8A',
  tealMid: '#029FB1',
  tealBright: '#01C1D5',
  tealSoft: '#3A737F',
  ink: '#0C3A42',
  inkSoft: '#46707A',
  glass: 'rgba(255,255,255,0.58)',
  glassStrong: 'rgba(255,255,255,0.80)',
}

export const serif = 'var(--font-fraunces), Georgia, serif'
export const sans = 'var(--font-jost), system-ui, sans-serif'

export const TITLE_GRADIENT = `linear-gradient(100deg, ${C.tealDeep} 0%, ${C.teal} 34%, ${C.tealMid} 68%, ${C.tealBright} 100%)`

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Rule() {
  return (
    <div className="my-11 flex items-center gap-3.5" aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(3,122,138,0.25)] to-transparent" />
      <svg viewBox="0 0 22 22" className="h-5 w-5 flex-shrink-0" fill="none">
        <circle cx="11" cy="11" r="3.5" stroke={C.tealMid} strokeWidth="1.2" />
        <path
          d="M11 1 L11 6 M11 16 L11 21 M1 11 L6 11 M16 11 L21 11"
          stroke={C.tealMid}
          strokeWidth="1.2"
        />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(3,122,138,0.25)] to-transparent" />
    </div>
  )
}

export function Panel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-[26px] border border-[rgba(3,122,138,0.12)] p-7 shadow-[0_16px_40px_rgba(3,122,138,0.10)] backdrop-blur-md sm:p-10 ${className}`}
      style={{ background: C.glass }}
    >
      {children}
    </div>
  )
}

export function Heading({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-7 text-center">
      <h2
        className="text-[26px] font-medium sm:text-[28px]"
        style={{ fontFamily: serif, color: C.tealDeep }}
      >
        {title}
      </h2>
      {note && (
        <p className="mt-1 text-[16px] italic" style={{ fontFamily: serif, color: C.inkSoft }}>
          {note}
        </p>
      )}
    </div>
  )
}

/** Royal Thai Embassy seal, centred — the mark that crowns every page. */
export function Seal({ className = '' }: { className?: string }) {
  return (
    <motion.img
      src="/embassy/royal-thai-embassy.png"
      alt="Royal Thai Embassy, Abu Dhabi"
      width={130}
      height={171}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`mx-auto h-[104px] w-auto drop-shadow-[0_6px_20px_rgba(1,88,102,0.28)] sm:h-[128px] ${className}`}
    />
  )
}

/** Reem Mall mark, parked in the top-right corner. */
export function VenueMark() {
  return (
    <div className="relative z-20 flex items-start justify-end px-5 pt-6 sm:px-8 sm:pt-7">
      <img
        src="/embassy/reem-mall.png"
        alt="Reem Mall"
        width={132}
        height={67}
        className="h-[40px] w-auto sm:h-[52px]"
      />
    </div>
  )
}

export function SiteFooter({ note }: { note?: string }) {
  return (
    <footer className="mt-12 pt-8 text-center">
      {/* Credit block agreed with the Embassy in place of a fee. Clear
          attribution, kept quiet enough to sit inside a formal invitation. */}
      <div
        className="mx-auto max-w-[360px] rounded-[22px] border border-[rgba(3,122,138,0.14)] px-6 py-7"
        style={{ background: 'rgba(255,255,255,0.55)' }}
      >
        <p className="text-[10.5px] uppercase tracking-[0.2em]" style={{ color: C.tealSoft }}>
          Designed and built by
        </p>
        <img
          src="/wethink-logo.png"
          alt="WeThink"
          width={150}
          height={50}
          className="mx-auto mt-3 h-12 w-auto"
        />
        <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: C.inkSoft }}>
          Digital invitation and daily programme for Marhaba Thailand
        </p>
        <p className="mt-3 text-[12px] tracking-[0.03em]" style={{ color: C.inkSoft }}>
          <a
            href="https://www.instagram.com/wethink.ae/"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-[rgba(70,112,122,0.4)] no-underline"
            style={{ color: C.inkSoft }}
          >
            @wethink.ae
          </a>
          {'  '}&nbsp;·&nbsp;{' '}
          <a
            href="https://www.wethink.ae"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-[rgba(70,112,122,0.4)] no-underline"
            style={{ color: C.inkSoft }}
          >
            www.wethink.ae
          </a>
        </p>
      </div>

      {note && (
        <p className="mx-auto mt-5 max-w-md text-[11.5px] italic" style={{ color: C.inkSoft }}>
          {note}
        </p>
      )}
    </footer>
  )
}
