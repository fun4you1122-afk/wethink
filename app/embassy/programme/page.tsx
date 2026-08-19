'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { CalendarPlus, MapPin, QrCode, Share2 } from 'lucide-react'
import ThaiBackdrop from '@/components/embassy/ThaiBackdrop'
import SignatureIntro from '@/components/embassy/SignatureIntro'
import ThreadRail from '@/components/embassy/ThreadRail'
import {
  C,
  Heading,
  Panel,
  Reveal,
  Rule,
  Seal,
  SiteFooter,
  TITLE_GRADIENT,
  VenueMark,
  sans,
  serif,
} from '@/components/embassy/ui'

/* ────────────────────────────────────────────────────────────
   Daily programme — the link behind the QR codes at the venue.

   Draft content, mirroring the schedule on the main invitation.
   Replace SCHEDULE below when the Embassy's final programme lands;
   `start` and `end` are minutes from midnight, Gulf time, and drive
   the "happening now" marker.
   ──────────────────────────────────────────────────────────── */

type Slot = { start: number; end: number; time: string; title: string; where: string }

const SCHEDULE: Record<1 | 2, Slot[]> = {
  1: [
    { start: 600, end: 720, time: '10:00 AM', title: 'Doors open · Opening of the festival', where: 'Main entrance' },
    { start: 720, end: 900, time: '12:00 PM', title: 'Cultural performances begin · Workshops open', where: 'Main stage · Workshop area' },
    { start: 900, end: 1080, time: '3:00 PM', title: 'Muay Thai showcase', where: 'Ring' },
    { start: 1020, end: 1080, time: '5:00 PM', title: 'Opening Ceremony', where: 'Main stage' },
    { start: 1080, end: 1260, time: '6:00 PM', title: 'Evening performances · Thai massage', where: 'Main stage · Wellness corner' },
    { start: 1260, end: 1320, time: '9:00 PM', title: 'Lucky draw', where: 'Main stage' },
    { start: 1320, end: 1321, time: '10:00 PM', title: 'Close of Day One', where: '' },
  ],
  2: [
    { start: 600, end: 720, time: '10:00 AM', title: 'Doors open · Workshops continue', where: 'Workshop area' },
    { start: 720, end: 900, time: '12:00 PM', title: 'Thai massage sessions · Tourism pavilion', where: 'Wellness corner · Pavilion' },
    { start: 900, end: 1080, time: '3:00 PM', title: 'Muay Thai showcase encore', where: 'Ring' },
    { start: 1080, end: 1260, time: '6:00 PM', title: 'Evening performances', where: 'Main stage' },
    { start: 1260, end: 1320, time: '9:00 PM', title: 'Grand prize lucky draw', where: 'Main stage' },
    { start: 1320, end: 1321, time: '10:00 PM', title: 'Closing ceremony', where: 'Main stage' },
  ],
}

const PAGE_URL = 'https://www.wethink.ae/embassy/programme'

/** Today in Abu Dhabi, as an ISO date plus minutes past midnight. */
function gulfNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dubai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '00'
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10),
  }
}

const DAY_DATE: Record<1 | 2, string> = { 1: '2026-09-11', 2: '2026-09-12' }

export default function Programme() {
  const [day, setDay] = useState<1 | 2>(1)
  const [now, setNow] = useState<{ date: string; minutes: number } | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)

  // Open on whichever festival day it actually is, and keep the marker moving.
  useEffect(() => {
    const tick = () => {
      const n = gulfNow()
      setNow(n)
      if (n.date === DAY_DATE[2]) setDay(2)
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [])

  const isToday = now?.date === DAY_DATE[day]
  const liveIndex =
    isToday && now
      ? SCHEDULE[day].findIndex((s) => now.minutes >= s.start && now.minutes < s.end)
      : -1

  const share = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Marhaba Thailand — Daily Programme', url: PAGE_URL })
        return
      } catch {
        /* dismissed */
      }
    }
    try {
      await navigator.clipboard.writeText(PAGE_URL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      /* clipboard blocked — the QR panel still works */
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <SignatureIntro />
      <ThreadRail />
      <div
        className="relative min-h-screen"
        style={{ background: C.bg, color: C.ink, fontFamily: sans }}
      >
        <ThaiBackdrop />
        <VenueMark />

        <div className="relative z-10 mx-auto max-w-[780px] px-5 pb-24 pt-6">
          <header className="text-center">
            <Seal className="!h-[86px] sm:!h-[104px]" />
            <Reveal delay={0.1}>
              <p
                className="mt-5 text-[12.5px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: C.teal }}
              >
                Marhaba Thailand · Reem Mall, Abu Dhabi
              </p>
              <h1
                className="mt-2 text-[clamp(38px,8vw,60px)] font-semibold leading-[1.05] tracking-tight"
                style={{ fontFamily: serif }}
              >
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: TITLE_GRADIENT }}
                >
                  Daily Programme
                </span>
              </h1>
              <p
                className="mt-2 text-[15px] font-semibold uppercase tracking-[0.06em]"
                style={{ color: C.tealDeep }}
              >
                11 – 12 September 2026 <span style={{ color: C.tealMid }}>✦</span> 10:00 AM – 10:00 PM
              </p>
            </Reveal>
          </header>

          <Rule />

          <Reveal>
            <Panel>
              {/* day switch */}
              <div className="mb-6 flex justify-center gap-1.5" role="tablist">
                {([1, 2] as const).map((d) => (
                  <button
                    key={d}
                    role="tab"
                    aria-selected={day === d}
                    onClick={() => setDay(d)}
                    className="relative rounded-full px-5 py-2.5 text-[13px] uppercase tracking-[0.06em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#037A8A]"
                    style={{ color: day === d ? C.tealDeep : C.inkSoft, fontFamily: sans }}
                  >
                    {day === d && (
                      <motion.span
                        layoutId="progDayPill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: `linear-gradient(135deg, ${C.pale}, ${C.light})` }}
                        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                      />
                    )}
                    <span className="relative">
                      {d === 1 ? 'Friday 11 Sept' : 'Saturday 12 Sept'}
                    </span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.ol
                  key={day}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="mx-auto max-w-lg list-none"
                >
                  {SCHEDULE[day].map((slot, i) => {
                    const live = i === liveIndex
                    return (
                      <li
                        key={slot.time + slot.title}
                        className="grid grid-cols-[78px_1fr] gap-3 py-3 sm:grid-cols-[92px_1fr] sm:gap-4"
                        style={{
                          borderBottom:
                            i === SCHEDULE[day].length - 1
                              ? 'none'
                              : '1px dashed rgba(3,122,138,0.18)',
                        }}
                      >
                        <div
                          className="pt-0.5 text-[11.5px] font-semibold uppercase tracking-[0.06em]"
                          style={{ color: live ? C.tealDeep : C.teal }}
                        >
                          {slot.time}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="text-[15.5px]"
                              style={{ color: C.ink, fontWeight: live ? 600 : 400 }}
                            >
                              {slot.title}
                            </span>
                            {live && (
                              <span
                                className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white"
                                style={{
                                  background: `linear-gradient(135deg, ${C.tealDeep}, ${C.tealMid})`,
                                }}
                              >
                                Now
                              </span>
                            )}
                          </div>
                          {slot.where && (
                            <div className="mt-0.5 text-[13px]" style={{ color: C.inkSoft }}>
                              {slot.where}
                            </div>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </motion.ol>
              </AnimatePresence>

              <p
                className="mt-5 text-center text-[13px] italic"
                style={{ fontFamily: serif, color: C.inkSoft }}
              >
                Draft programme — activity times are being finalised by the Embassy.
              </p>
            </Panel>
          </Reveal>

          <Rule />

          <Reveal>
            <Panel>
              <Heading title="Share the Programme" note="Scan, send, or save the day" />
              <div className="mx-auto flex max-w-md flex-col items-center gap-4">
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={share}
                    className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[13.5px] font-medium uppercase tracking-[0.08em] text-white shadow-[0_8px_20px_rgba(3,122,138,0.18)]"
                    style={{
                      background: `linear-gradient(135deg, ${C.tealDeep}, ${C.teal})`,
                      fontFamily: sans,
                    }}
                  >
                    <Share2 className="h-4 w-4" /> {copied ? 'Link copied' : 'Share'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQR((v) => !v)}
                    aria-expanded={showQR}
                    className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-[13.5px] font-medium uppercase tracking-[0.08em]"
                    style={{ borderColor: C.teal, color: C.tealDeep, fontFamily: sans }}
                  >
                    <QrCode className="h-4 w-4" /> {showQR ? 'Hide QR' : 'Show QR'}
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
                        <QRCodeSVG
                          value={PAGE_URL}
                          size={170}
                          bgColor="#ffffff"
                          fgColor="#015866"
                          level="M"
                        />
                      </div>
                      <p className="mt-2.5 text-[12px]" style={{ color: C.inkSoft }}>
                        Scan to open the programme
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href="https://maps.google.com/?q=Reem+Mall+Abu+Dhabi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[12.5px] uppercase tracking-[0.08em]"
                    style={{ borderColor: 'rgba(3,122,138,0.28)', color: C.teal }}
                  >
                    <MapPin className="h-3.5 w-3.5" /> Reem Mall
                  </a>
                  <a
                    href="/embassy"
                    className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[12.5px] uppercase tracking-[0.08em]"
                    style={{ borderColor: 'rgba(3,122,138,0.28)', color: C.teal }}
                  >
                    <CalendarPlus className="h-3.5 w-3.5" /> About the festival
                  </a>
                </div>
              </div>
            </Panel>
          </Reveal>

          <SiteFooter note="Programme details and timings are subject to confirmation by the Royal Thai Embassy." />
        </div>
      </div>
    </MotionConfig>
  )
}
