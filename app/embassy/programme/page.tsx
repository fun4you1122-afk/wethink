'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { CalendarPlus, MapPin, QrCode, Share2 } from 'lucide-react'
import ThaiBackdrop from '@/components/embassy/ThaiBackdrop'
import { useTimeOfDay } from '@/components/embassy/useTimeOfDay'
import LiveNow from '@/components/embassy/LiveNow'
import { COMPANY, SCHEDULE, TRACKS, TrackId, allSlots } from './schedule'
import ShareCardButton from '@/components/embassy/ShareCard'
import SignatureIntro from '@/components/embassy/SignatureIntro'
import ThreadRail from '@/components/embassy/ThreadRail'
import Masthead from '@/components/embassy/Masthead'
import Concierge from '@/components/embassy/Concierge'
import {
  C,
  Heading,
  Panel,
  Reveal,
  Rule,
  Seal,
  SiteFooter,
  StudioCredit,
  TITLE_GRADIENT,
  VenueMark,
  sans,
  serif,
} from '@/components/embassy/ui'

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
  const tod = useTimeOfDay()
  const [day, setDay] = useState<1 | 2>(1)
  const [track, setTrack] = useState<TrackId>('main')
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

  const slots = SCHEDULE[day][track]
  const isToday = now?.date === DAY_DATE[day]
  const isLive = (s: { start: number; end: number }) =>
    Boolean(isToday && now && now.minutes >= s.start && now.minutes < s.end)

  // the two days, each flattened across its three tracks, for the live panel
  const merged = { 1: allSlots(1), 2: allSlots(2) } as const

  const share = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Marhaba Thailand — Daily Programme',
          text: 'The full programme for Marhaba Thailand, all three stages.\n\nBuilt by WeThink · wethink.ae',
          url: PAGE_URL,
        })
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
        style={{ background: tod.sky[2], color: C.ink, fontFamily: sans, overflowX: 'clip' }}
      >
        <ThaiBackdrop />
        <Masthead />
        <VenueMark />

        <div className="relative z-10 mx-auto max-w-[780px] px-5 pb-24 pt-[96px]">
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
            <Panel className="mb-6">
              <LiveNow schedule={merged} />
            </Panel>
          </Reveal>

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

              {/* three stages run in parallel; pick one */}
              <div className="mb-5 flex flex-wrap justify-center gap-1.5" role="tablist">
                {TRACKS.map((tr) => (
                  <button
                    key={tr.id}
                    role="tab"
                    aria-selected={track === tr.id}
                    onClick={() => setTrack(tr.id)}
                    className="rounded-full border px-4 py-2 text-[11.5px] font-semibold uppercase tracking-[0.1em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#037A8A]"
                    style={
                      track === tr.id
                        ? {
                            borderColor: 'transparent',
                            background: `linear-gradient(135deg, ${C.tealDeep}, ${C.teal})`,
                            color: '#fff',
                          }
                        : { borderColor: 'rgba(3,122,138,0.28)', color: C.teal }
                    }
                  >
                    {tr.short}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.ol
                  key={`${day}-${track}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="mx-auto max-w-lg list-none"
                >
                  {slots.map((slot, i) => {
                    const live = isLive(slot)
                    return (
                      <li
                        key={slot.time + slot.title}
                        className="grid grid-cols-[78px_1fr] gap-3 py-3 sm:grid-cols-[92px_1fr] sm:gap-4"
                        style={{
                          borderBottom:
                            i === slots.length - 1 ? 'none' : '1px dashed rgba(3,122,138,0.18)',
                          opacity: slot.rest ? 0.62 : 1,
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
                              style={{
                                color: C.ink,
                                fontWeight: live || slot.feature ? 600 : 400,
                                fontFamily: slot.feature ? serif : sans,
                                fontSize: slot.feature ? '17.5px' : undefined,
                              }}
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
                          {slot.where && slot.feature && (
                            <div className="mt-0.5 text-[13px]" style={{ color: C.inkSoft }}>
                              {slot.where}
                            </div>
                          )}
                          {slot.feature && (
                            <ol
                              className="mt-2 list-none rounded-xl px-4 py-3 text-[13.5px]"
                              style={{
                                background: `linear-gradient(135deg, ${C.pale}, ${C.light})`,
                                color: C.tealDeep,
                              }}
                            >
                              {slot.feature.map((line, n) => (
                                <li key={line} className="flex gap-2.5 py-0.5">
                                  <span className="tabular-nums opacity-55">
                                    {String(n + 1).padStart(2, '0')}
                                  </span>
                                  <span>{line}</span>
                                </li>
                              ))}
                            </ol>
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
                {TRACKS.find((t) => t.id === track)?.note} · timings as issued by the
                Royal Thai Embassy and subject to change on the day.
              </p>
            </Panel>
          </Reveal>

          <Rule />

          <StudioCredit
            what="The live programme for all three stages, both days of the festival"
            className="my-12"
          />

          <Reveal>
            <Panel>
              <Heading
                title="Who You’ll Meet"
                note="The artists, artisans and teams behind the two days"
              />
              <ul className="mx-auto grid max-w-xl list-none gap-x-6 gap-y-3 sm:grid-cols-2">
                {COMPANY.map(([name, what]) => (
                  <li key={name}>
                    <div
                      className="text-[14.5px] font-semibold"
                      style={{ color: C.tealDeep, fontFamily: serif }}
                    >
                      {name}
                    </div>
                    <div className="text-[13px] leading-snug" style={{ color: C.inkSoft }}>
                      {what}
                    </div>
                  </li>
                ))}
              </ul>
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
                  <ShareCardButton />
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
                  <a
                    href="/embassy/opening"
                    className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[12.5px] uppercase tracking-[0.08em]"
                    style={{ borderColor: 'rgba(3,122,138,0.28)', color: C.teal }}
                  >
                    <CalendarPlus className="h-3.5 w-3.5" /> Opening Ceremony
                  </a>
                </div>
              </div>
            </Panel>
          </Reveal>

          <SiteFooter note="Programme details and timings are subject to confirmation by the Royal Thai Embassy." />
        </div>

        <Concierge />
      </div>
    </MotionConfig>
  )
}
