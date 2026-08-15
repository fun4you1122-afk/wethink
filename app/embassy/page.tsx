'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import {
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  MapPin,
  QrCode,
  Send,
  Share2,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import ThaiBackdrop from '@/components/embassy/ThaiBackdrop'
import LotusBloom from '@/components/embassy/LotusBloom'
import Concierge from '@/components/embassy/Concierge'
import CultureVideo from '@/components/embassy/CultureVideo'
import ImageBand from '@/components/embassy/ImageBand'

/* ────────────────────────────────────────────────────────────
   Event details — single source of truth for the page.
   ──────────────────────────────────────────────────────────── */
const EVENT = {
  host: 'The Royal Thai Embassy, Abu Dhabi',
  title: 'Marhaba Thailand',
  subtitle: 'Creating Your Own Thai Experience',
  dates: '11 – 12 September 2026',
  venue: 'Reem Mall, Abu Dhabi',
  hours: '10:00 AM – 10:00 PM daily',
  mapUrl: 'https://maps.google.com/?q=Reem+Mall+Abu+Dhabi',
  start: '2026-09-11T10:00:00+04:00',
}

const C = {
  cream: '#F2FAFB',
  cream2: '#E3F4F7',
  blush: '#9FDDE8',
  blushDeep: '#6FC7D8',
  sage: '#B7E4E9',
  lavender: '#CBEEF3',
  gold: '#029FB1',
  plum: '#037A8A',
  plumDeep: '#015866',
  ink: '#0C3A42',
  inkSoft: '#46707A',
  // Sampled from the RM mark: deep teal through to bright cyan.
  tealDeep: '#015866',
  teal: '#037A8A',
  tealMid: '#029FB1',
  tealBright: '#01C1D5',
  tealSoft: '#3A737F',
  glass: 'rgba(255,255,255,0.58)',
  glassStrong: 'rgba(255,255,255,0.80)',
}

const serif = 'var(--font-fraunces), Georgia, serif'
const sans = 'var(--font-jost), system-ui, sans-serif'

/* ── shared bits ─────────────────────────────────────────── */

function Reveal({
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

function Rule() {
  return (
    <div className="my-11 flex items-center gap-3.5" aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(3,122,138,0.25)] to-transparent" />
      <svg viewBox="0 0 22 22" className="h-5 w-5 flex-shrink-0" fill="none">
        <circle cx="11" cy="11" r="3.5" stroke={C.gold} strokeWidth="1.2" />
        <path
          d="M11 1 L11 6 M11 16 L11 21 M1 11 L6 11 M16 11 L21 11"
          stroke={C.gold}
          strokeWidth="1.2"
        />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(3,122,138,0.25)] to-transparent" />
    </div>
  )
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[26px] border border-[rgba(3,122,138,0.12)] p-7 shadow-[0_16px_40px_rgba(3,122,138,0.10)] backdrop-blur-md sm:p-10 ${className}`}
      style={{ background: C.glass }}
    >
      {children}
    </div>
  )
}

function Heading({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-7 text-center">
      <h2
        className="text-[26px] font-medium sm:text-[28px]"
        style={{ fontFamily: serif, color: C.plumDeep }}
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

/* ── countdown ───────────────────────────────────────────── */

function Countdown() {
  const target = useMemo(() => new Date(EVENT.start).getTime(), [])
  const [left, setLeft] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, target - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  const units =
    left === null
      ? [
          ['–', 'Days'],
          ['–', 'Hours'],
          ['–', 'Minutes'],
          ['–', 'Seconds'],
        ]
      : [
          [String(Math.floor(left / 86400000)), 'Days'],
          [String(Math.floor((left / 3600000) % 24)).padStart(2, '0'), 'Hours'],
          [String(Math.floor((left / 60000) % 60)).padStart(2, '0'), 'Minutes'],
          [String(Math.floor((left / 1000) % 60)).padStart(2, '0'), 'Seconds'],
        ]

  return (
    <div
      className="mx-auto mt-7 grid max-w-[380px] grid-cols-4 gap-2 sm:max-w-none sm:flex sm:justify-center sm:gap-3.5"
      aria-live="polite"
    >
      {units.map(([value, label]) => (
        <div
          key={label}
          className="min-w-0 rounded-[18px] border border-[rgba(3,122,138,0.15)] px-2 py-3.5 text-center shadow-[0_6px_18px_rgba(3,122,138,0.08)] backdrop-blur-sm sm:min-w-[82px] sm:px-4"
          style={{ background: C.glass }}
        >
          <div
            className="text-[26px] leading-none tabular-nums sm:text-[30px]"
            style={{ fontFamily: serif, color: C.tealDeep }}
          >
            {value}
          </div>
          <div
            className="mt-1.5 text-[9px] uppercase tracking-[0.1em] sm:text-[10px] sm:tracking-[0.14em]"
            style={{ color: C.tealSoft }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── programme highlights ────────────────────────────────── */

const HIGHLIGHTS = [
  {
    name: 'Cultural\nPerformances',
    back: 'Traditional Thai dance and live music on the main stage, throughout both days.',
    icon: (
      <path d="M12 3c-3 3-3 6 0 9M12 3c3 3 3 6 0 9M4 12c0 5 4 9 8 9s8-4 8-9M7 12c1.5 1 3 1 5 1s3.5 0 5-1" />
    ),
  },
  {
    name: 'Hands-On\nWorkshops',
    back: 'Thai fruit carving, garland-making, and traditional crafts with local artisans.',
    icon: (
      <path d="M4 15c2-1 3-3 3-5V6M8 10c2-1 3-3 3-5v3M12 10c2-1 3-3 3-6v4M16 10c1.5-.5 2.5-2 3-3.5M4 15c0 3 3 5 7 5s8-2 8-6" />
    ),
  },
  {
    name: 'Free Thai\nMassage',
    back: 'Complimentary traditional Thai massage sessions, courtesy of our wellness partners.',
    icon: (
      <>
        <circle cx="12" cy="7" r="3" />
        <path d="M6 21c0-4 2.5-7 6-7s6 3 6 7" />
      </>
    ),
  },
  {
    name: 'Tourism\nPavilion',
    back: "Meet Thailand's resorts, airlines, and tour operators, and plan your next trip.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.5 8.5 L13 13 L8.5 15.5 L11 11 Z" />
      </>
    ),
  },
  {
    name: 'Muay Thai\nShowcase',
    back: 'Live demonstrations from Muay Thai practitioners, with techniques explained ringside.',
    icon: (
      <>
        <circle cx="7" cy="7" r="3" />
        <path d="M9.5 9.5 L17 17M17 17 L21 17M17 17 L17 21M4 20 C4 16 5.5 14 8 13" />
      </>
    ),
  },
  {
    name: 'Prize\nLucky Draw',
    back: 'Daily prize draws featuring flights, resort stays, and experiences across Thailand.',
    icon: (
      <>
        <rect x="4" y="9" width="16" height="11" rx="0.5" />
        <path d="M4 13 H20 M12 9 V20M12 9 C9 9 8 6 12 5 C16 6 15 9 12 9Z" />
      </>
    ),
  },
]

function HighlightCard({ item, index }: { item: (typeof HIGHLIGHTS)[number]; index: number }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <motion.button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-expanded={flipped}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="h-[168px] w-full rounded-[18px] outline-none focus-visible:ring-2 focus-visible:ring-[#037A8A] focus-visible:ring-offset-2"
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {/* front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 rounded-[18px] border border-[rgba(3,122,138,0.14)] p-3.5 text-center"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(160deg, rgba(255,255,255,0.85), rgba(255,255,255,0.35))',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke={C.plum}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {item.icon}
          </svg>
          <span
            className="whitespace-pre-line text-[14.5px] font-medium leading-snug"
            style={{ fontFamily: serif, color: C.ink }}
          >
            {item.name}
          </span>
          <span className="text-[10px] uppercase tracking-[0.12em]" style={{ color: C.inkSoft }}>
            Tap
          </span>
        </div>

        {/* back */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-[18px] border border-[rgba(3,122,138,0.14)] p-4 text-center text-[14.5px] leading-snug"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: `linear-gradient(160deg, ${C.blush}, ${C.lavender})`,
            color: C.ink,
          }}
        >
          {item.back}
        </div>
      </motion.div>
      <span className="sr-only">{item.back}</span>
      <span className="sr-only">{index}</span>
    </motion.button>
  )
}

/* ── Thai phrasebook ─────────────────────────────────────── */

const PHRASES = [
  { thai: 'สวัสดี', roman: 'Sa-wat-dee', meaning: 'Hello — the greeting that opens every door' },
  { thai: 'ขอบคุณ', roman: 'Khop khun', meaning: 'Thank you' },
  { thai: 'ยินดีต้อนรับ', roman: 'Yin dee ton rap', meaning: 'Welcome' },
  { thai: 'สบายดีไหม', roman: 'Sabai dee mai', meaning: 'How are you?' },
  { thai: 'อร่อย', roman: 'A-roi', meaning: 'Delicious — you will need this one' },
  { thai: 'ไม่เป็นไร', roman: 'Mai pen rai', meaning: 'It’s all right, never mind' },
]

function Phrasebook() {
  const [i, setI] = useState(0)
  const [shown, setShown] = useState(false)
  const p = PHRASES[i]

  const go = (d: number) => {
    setShown(false)
    setI((v) => (v + d + PHRASES.length) % PHRASES.length)
  }

  return (
    <Panel>
      <LotusBloom size={86} />
      <div className="mt-4" />
      <Heading title="A Little Thai to Take With You" note="Tap the phrase to reveal its meaning" />
      <div className="mx-auto flex max-w-md items-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous phrase"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(3,122,138,0.22)] transition-colors hover:bg-white/70"
          style={{ color: C.plum }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setShown((v) => !v)}
          className="flex-1 rounded-[20px] border border-[rgba(3,122,138,0.16)] px-5 py-7 text-center outline-none transition-shadow hover:shadow-[0_10px_26px_rgba(3,122,138,0.12)] focus-visible:ring-2 focus-visible:ring-[#037A8A]"
          style={{ background: C.glassStrong }}
          aria-expanded={shown}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${i}-${shown}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <div className="text-[34px] leading-tight" style={{ color: C.plumDeep }}>
                {p.thai}
              </div>
              <div
                className="mt-1 text-[13px] uppercase tracking-[0.14em]"
                style={{ color: C.plum }}
              >
                {p.roman}
              </div>
              <div
                className="mt-3 min-h-[42px] text-[15px] italic"
                style={{ fontFamily: serif, color: shown ? C.ink : 'rgba(70,112,122,0.5)' }}
              >
                {shown ? p.meaning : 'tap to reveal'}
              </div>
            </motion.div>
          </AnimatePresence>
        </button>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next phrase"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(3,122,138,0.22)] transition-colors hover:bg-white/70"
          style={{ color: C.plum }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 flex justify-center gap-1.5">
        {PHRASES.map((_, n) => (
          <span
            key={n}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: n === i ? 18 : 6,
              background: n === i ? C.gold : 'rgba(3,122,138,0.22)',
            }}
          />
        ))}
      </div>
    </Panel>
  )
}

/* ── schedule ────────────────────────────────────────────── */

const SCHEDULE = {
  1: [
    ['10:00 AM', 'Doors open · Opening ceremony'],
    ['12:00 PM', 'Cultural performances begin · Workshops open'],
    ['3:00 PM', 'Muay Thai showcase'],
    ['6:00 PM', 'Evening performances · Thai massage'],
    ['9:00 PM', 'Lucky draw'],
    ['10:00 PM', 'Close of Day One'],
  ],
  2: [
    ['10:00 AM', 'Doors open · Workshops continue'],
    ['12:00 PM', 'Thai massage sessions · Tourism pavilion'],
    ['3:00 PM', 'Muay Thai showcase encore'],
    ['6:00 PM', 'Evening performances'],
    ['9:00 PM', 'Grand prize lucky draw'],
    ['10:00 PM', 'Closing ceremony'],
  ],
} as const

function Schedule() {
  const [day, setDay] = useState<1 | 2>(1)
  return (
    <Panel>
      <Heading title="Join Us Each Day" note="A festival across two days at Reem Mall" />

      <div className="mb-6 flex justify-center gap-1.5" role="tablist">
        {([1, 2] as const).map((d) => (
          <button
            key={d}
            role="tab"
            aria-selected={day === d}
            onClick={() => setDay(d)}
            className="relative rounded-full px-5 py-2.5 text-[13px] uppercase tracking-[0.06em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#037A8A]"
            style={{ color: day === d ? C.plumDeep : C.inkSoft, fontFamily: sans }}
          >
            {day === d && (
              <motion.span
                layoutId="dayPill"
                className="absolute inset-0 rounded-full"
                style={{ background: `linear-gradient(135deg, ${C.lavender}, ${C.blush})` }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              />
            )}
            <span className="relative">Day {d === 1 ? 'One · 11' : 'Two · 12'} Sept</span>
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            role="tabpanel"
          >
            {SCHEDULE[day].map(([time, desc], n) => (
              <div
                key={time}
                className="grid grid-cols-[86px_1fr] gap-4 py-3"
                style={{
                  borderBottom:
                    n === SCHEDULE[day].length - 1
                      ? 'none'
                      : '1px dashed rgba(3,122,138,0.18)',
                }}
              >
                <div
                  className="pt-0.5 text-[11.5px] font-medium uppercase tracking-[0.08em]"
                  style={{ color: C.plum }}
                >
                  {time}
                </div>
                <div style={{ color: C.ink }}>{desc}</div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        <p
          className="mt-4 text-center text-[13px] italic"
          style={{ fontFamily: serif, color: C.inkSoft }}
        >
          Doors open 10:00 AM and close 10:00 PM on both days. Session times are subject to confirmation by the Embassy.
        </p>
      </div>
    </Panel>
  )
}

/* ── calendar file ───────────────────────────────────────── */

function downloadIcs() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Marhaba Thailand//Royal Thai Embassy Abu Dhabi//EN',
    'BEGIN:VEVENT',
    'UID:marhaba-thailand-2026@wethink.ae',
    'DTSTAMP:20260814T000000Z',
    'DTSTART:20260911T060000Z',
    'DTEND:20260912T180000Z',
    'SUMMARY:Marhaba Thailand — Royal Thai Embassy Cultural Festival',
    'DESCRIPTION:Two-day Thai cultural festival at Reem Mall\\, Abu Dhabi. Performances\\, workshops\\, Thai massage\\, Muay Thai\\, and a daily lucky draw.',
    'LOCATION:Reem Mall, Abu Dhabi, UAE',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'marhaba-thailand-2026.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/* ── save the date & share ───────────────────────────────── */

const SHARE_URL = 'https://www.wethink.ae/embassy'

function SaveAndShare() {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const shareText = `${EVENT.title} — ${EVENT.dates}, ${EVENT.venue}`

  const share = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: EVENT.title, text: shareText, url: SHARE_URL })
        return
      } catch {
        /* dismissed — fall through to copying */
      }
    }
    try {
      await navigator.clipboard.writeText(SHARE_URL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      /* clipboard blocked — the QR code is still available */
    }
  }

  return (
    <Panel>
      <Heading title="Save the Date" note="Entry is free — simply come and join us" />

      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-3">
          <motion.button
            type="button"
            onClick={downloadIcs}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[13.5px] font-medium uppercase tracking-[0.08em] shadow-[0_8px_20px_rgba(3,122,138,0.18)]"
            style={{
              background: `linear-gradient(135deg, ${C.tealDeep}, ${C.teal})`,
              color: '#ffffff',
              fontFamily: sans,
            }}
          >
            <CalendarPlus className="h-4 w-4" /> Add to Calendar
          </motion.button>

          <button
            type="button"
            onClick={share}
            className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-[13.5px] font-medium uppercase tracking-[0.08em]"
            style={{ borderColor: C.plum, color: C.plumDeep, fontFamily: sans }}
          >
            <Share2 className="h-4 w-4" /> {copied ? 'Link copied' : 'Share Invitation'}
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${shareText} — ${SHARE_URL}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[12.5px] uppercase tracking-[0.08em]"
            style={{ borderColor: 'rgba(3,122,138,0.28)', color: C.plum }}
          >
            <Send className="h-3.5 w-3.5" /> WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setShowQR((v) => !v)}
            aria-expanded={showQR}
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[12.5px] uppercase tracking-[0.08em]"
            style={{ borderColor: 'rgba(3,122,138,0.28)', color: C.plum }}
          >
            <QrCode className="h-3.5 w-3.5" /> {showQR ? 'Hide QR' : 'Show QR'}
          </button>
        </div>

        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="overflow-hidden text-center"
            >
              <div className="mt-2 rounded-2xl bg-white p-3.5 shadow-[0_10px_26px_rgba(3,122,138,0.14)]">
                <QRCodeSVG value={SHARE_URL} size={150} bgColor="#ffffff" fgColor="#015866" level="M" />
              </div>
              <p className="mt-2.5 text-[12px]" style={{ color: C.inkSoft }}>
                Scan to open this invitation
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-1 text-center text-[13px] italic" style={{ fontFamily: serif, color: C.inkSoft }}>
          Questions about the programme? Ask the concierge in the corner.
        </p>
      </div>
    </Panel>
  )
}

/* ══════════════════ PAGE ══════════════════ */

export default function EmbassyInvitation() {
  return (
    // reducedMotion="user" makes every animation on the page collapse to an
    // instant state change when the visitor asks for less motion.
    <MotionConfig reducedMotion="user">
    <div
      className="relative min-h-screen"
      style={{ background: C.cream, color: C.ink, fontFamily: sans }}
    >
      <ThaiBackdrop />

      {/* Thai-culture footage behind the opening screen; removes itself if the
          file isn't present, leaving the canvas backdrop alone. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[92vh] overflow-hidden">
        <CultureVideo />
      </div>

      {/* ── Venue mark, top right (the Embassy seal now crowns the hero) ── */}
      <div className="relative z-20 flex items-start justify-end px-5 pt-6 sm:px-8 sm:pt-7">
        <img
          src="/embassy/reem-mall.png"
          alt="Reem Mall"
          width={132}
          height={67}
          className="h-[44px] w-auto sm:h-[56px]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[780px] px-5 pb-24 pt-6">
        {/* ── Hero ── */}
        <header className="text-center">
          <motion.img
            src="/embassy/royal-thai-embassy.png"
            alt="Royal Thai Embassy, Abu Dhabi"
            width={130}
            height={171}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto h-[118px] w-auto drop-shadow-[0_6px_20px_rgba(1,88,102,0.28)] sm:h-[140px]"
          />

          <Reveal delay={0.1}>
            <p
              className="mt-5 text-[12.5px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: C.teal }}
            >
              {EVENT.host}
            </p>
            <p className="mt-3 text-[18px] italic" style={{ fontFamily: serif, color: C.tealSoft }}>
              requests the pleasure of your company at
            </p>
            <h1
              className="mt-1 text-[clamp(46px,9vw,78px)] font-semibold leading-[1.05] tracking-tight"
              style={{
                fontFamily: serif,
                // Gradient text needs the clip on the element itself; the halo
                // has to sit on a wrapper, because a filter on clipped text
                // repaints the background box and kills the effect.
                filter: 'drop-shadow(0 2px 14px rgba(255,255,255,0.85))',
              }}
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(100deg, ${C.tealDeep} 0%, ${C.teal} 34%, ${C.tealMid} 68%, ${C.tealBright} 100%)`,
                }}
              >
                {EVENT.title}
              </span>
            </h1>
            <p
              className="mt-1 text-[21px] italic"
              style={{ fontFamily: serif, color: C.tealSoft }}
            >
              {EVENT.subtitle}
            </p>

            {/* trilingual welcome — Thai, Arabic, English */}
            <div
              className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[15px] font-medium"
              style={{ color: C.teal }}
            >
              <span>ยินดีต้อนรับ</span>
              <span style={{ color: C.tealMid }}>✦</span>
              <span dir="rtl">مرحبا</span>
              <span style={{ color: C.tealMid }}>✦</span>
              <span>Welcome</span>
            </div>

            <p
              className="mt-6 text-[14.5px] font-semibold uppercase tracking-[0.05em]"
              style={{ color: C.tealDeep }}
            >
              {EVENT.dates} <span style={{ color: C.tealMid }}>✦</span> {EVENT.venue}
            </p>
            <p
              className="mt-2 text-[13.5px] font-medium uppercase tracking-[0.14em]"
              style={{ color: C.teal }}
            >
              {EVENT.hours}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <Countdown />
          </Reveal>
        </header>

        <Rule />

        {/* ── About ── */}
        <Reveal>
          <Panel>
            <p
              className="mx-auto max-w-[600px] text-center text-[18px] leading-relaxed"
              style={{ color: C.ink }}
            >
              Join the Royal Thai Embassy in Abu Dhabi for a two-day celebration of Thai culture,
              craft, and hospitality at Reem Mall. Marhaba Thailand brings traditional dance, live
              Muay Thai, hands-on workshops, and complimentary Thai massage to the UAE capital,
              alongside a showcase of Thailand’s finest destinations from our tourism and airline
              partners. Each day closes with a lucky draw of prizes contributed by our sponsors.
            </p>
          </Panel>
        </Reveal>

        <Rule />

        {/* ── Highlights ── */}
        <Reveal>
          <Heading title="Programme Highlights" note="Tap a card to learn more" />
          <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2 min-[680px]:grid-cols-3">
            {HIGHLIGHTS.map((h, i) => (
              <HighlightCard key={h.name} item={h} index={i} />
            ))}
          </div>
        </Reveal>

        <Rule />

        {/* ── Phrasebook ── */}
        <Reveal>
          <Phrasebook />
        </Reveal>

        <Rule />

        {/* ── Schedule ── */}
        <Reveal>
          <Schedule />
        </Reveal>

        {/* ── Photographic interlude ── */}
        <ImageBand src="/embassy/thailand-hero.jpg" alt="A golden Thai temple above the river, framed by forested hills">
          <p className="text-[12px] uppercase tracking-[0.22em] text-white/85">Thailand awaits</p>
          <p
            className="text-[24px] italic leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-[28px]"
            style={{ fontFamily: serif }}
          >
            Come for a day, leave with a country
          </p>
        </ImageBand>

        {/* ── Venue ── */}
        <Reveal>
          <Panel>
            <Heading title="The Venue" note="Al Reem Island, Abu Dhabi" />
            <div className="flex flex-col items-center gap-4 text-center">
              <MapPin className="h-7 w-7" style={{ color: C.plum }} />
              <p className="text-[17px]" style={{ color: C.ink }}>
                {EVENT.venue}
                <br />
                <span className="text-[15px]" style={{ color: C.inkSoft }}>
                  Open 10:00 AM – 10:00 PM both days · Entry is free and open to the public
                </span>
              </p>
              <a
                href={EVENT.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em]"
                style={{ borderColor: C.plum, color: C.plumDeep }}
              >
                Open in Maps
              </a>
            </div>
          </Panel>
        </Reveal>

        <Rule />

        {/* ── Save the date ── */}
        <Reveal>
          <SaveAndShare />
        </Reveal>

        {/* ── Footer ── */}
        <footer className="mt-10 pt-6 text-center">
          <img
            src="/wethink-logo.png"
            alt="WeThink"
            width={132}
            height={44}
            className="mx-auto mb-4 h-11 w-auto opacity-90"
          />
          <p className="text-[12px] tracking-[0.03em]" style={{ color: C.inkSoft }}>
            Design by WeThink &nbsp;·&nbsp;{' '}
            <a
              href="https://www.instagram.com/wethink.ae/"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-[rgba(70,112,122,0.4)] no-underline"
              style={{ color: C.inkSoft }}
            >
              @wethink.ae
            </a>{' '}
            &nbsp;·&nbsp;{' '}
            <a
              href="https://www.wethink.ae"
              className="border-b border-[rgba(70,112,122,0.4)] no-underline"
              style={{ color: C.inkSoft }}
            >
              www.wethink.ae
            </a>
          </p>
          <p className="mx-auto mt-3 max-w-md text-[11.5px] italic" style={{ color: C.inkSoft }}>
            Concept presentation prepared by WeThink. Programme details and timings are subject to
            confirmation by the Royal Thai Embassy.
          </p>
        </footer>
      </div>

      <Concierge />
    </div>
    </MotionConfig>
  )
}
