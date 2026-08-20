'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { CalendarPlus, Check, ExternalLink, MapPin, Send } from 'lucide-react'
import ThaiBackdrop from '@/components/embassy/ThaiBackdrop'
import { useTimeOfDay } from '@/components/embassy/useTimeOfDay'
import { useGuestName } from '@/components/embassy/useGuestName'
import ShareCardButton from '@/components/embassy/ShareCard'
import SignatureIntro from '@/components/embassy/SignatureIntro'
import ThreadRail from '@/components/embassy/ThreadRail'
import { CEREMONY } from '../programme/schedule'
import CultureVideo from '@/components/embassy/CultureVideo'
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
   Opening Ceremony — the VIP invitation sent by email.
   ──────────────────────────────────────────────────────────── */
const EVENT = {
  host: 'The Royal Thai Embassy, Abu Dhabi',
  title: 'Opening Ceremony',
  festival: 'Marhaba Thailand',
  subtitle: 'Creating Your Own Thai Experience',
  day: 'Friday 11 September 2026',
  time: '17:00 – 18:00 hrs',
  venue: 'Main Atrium, Ground Floor (near Zara)',
  venueFull: 'Reem Mall, Abu Dhabi',
  mapUrl: 'https://maps.google.com/?q=Reem+Mall+Abu+Dhabi',
  start: '2026-09-11T17:00:00+04:00',
}

/** The Embassy's running order for the evening. */


/* ────────────────────────────────────────────────────────────
   Registration.

   'native'  — our own styled fields posting straight into the
               Embassy's Google Form, so responses land in the
               existing sheet. Needs the formResponse URL plus the
               entry IDs, which are readable from the live form.
   'iframe'  — the Google Form embedded as-is.
   'pending' — neither is configured yet, so the panel explains
               that registration opens shortly rather than showing
               a form that quietly discards what guests type.
   ──────────────────────────────────────────────────────────── */
type RegistrationConfig = {
  mode: 'native' | 'iframe' | 'pending'
  action?: string
  embedUrl?: string
  /** somewhere to send anyone whose submission fails */
  formUrl?: string
  entries?: {
    name?: string
    position?: string
    affiliation?: string
    phone?: string
    email?: string
  }
}

const REGISTRATION: RegistrationConfig = {
  mode: 'native',
  action:
    'https://docs.google.com/forms/d/e/1FAIpQLScWP5xzoVwQN7ZZVnXXUODsXFW5xmSpGEBYdbcbKQLiod61nQ/formResponse',
  entries: {
    name: 'entry.1612220284',
    position: 'entry.98852281',
    affiliation: 'entry.264572762',
    phone: 'entry.383538205',
    email: 'entry.1408811448',
  },
  // the same form the QR code on the printed card opens
  formUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLScWP5xzoVwQN7ZZVnXXUODsXFW5xmSpGEBYdbcbKQLiod61nQ/viewform',
}

const CONTACT_EMAIL = 'info@wethink.ae'

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
      ? [['–', 'Days'], ['–', 'Hours'], ['–', 'Minutes'], ['–', 'Seconds']]
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

/* ── calendar ────────────────────────────────────────────── */

function downloadIcs() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Marhaba Thailand//Royal Thai Embassy Abu Dhabi//EN',
    'BEGIN:VEVENT',
    'UID:marhaba-thailand-opening-2026@wethink.ae',
    'DTSTAMP:20260814T000000Z',
    'DTSTART:20260911T130000Z',
    'DTEND:20260911T140000Z',
    'SUMMARY:Marhaba Thailand — Opening Ceremony',
    'DESCRIPTION:Opening Ceremony of Marhaba Thailand\\, hosted by the Royal Thai Embassy\\, Abu Dhabi.',
    'LOCATION:Main Atrium (near Zara), Reem Mall, Abu Dhabi, UAE',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'marhaba-thailand-opening-ceremony.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/* ── registration ────────────────────────────────────────── */

function Registration() {
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [affiliation, setAffiliation] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')

  // The form posts natively into a hidden frame rather than through fetch.
  // A no-cors fetch to Google never settles, which left the button stuck on
  // "Sending". A real submit has no such restriction, and the frame's load
  // event tells us it went through.
  const sent = useRef(false)
  const guard = useRef<number | undefined>(undefined)

  const onSubmit = () => {
    sent.current = true
    setState('sending')
    // if the frame's load never reaches us, don't strand the guest
    guard.current = window.setTimeout(() => setState('done'), 4500)
  }

  const onFrameLoad = () => {
    if (!sent.current) return // the frame's own initial load
    if (guard.current) window.clearTimeout(guard.current)
    setState('done')
  }

  useEffect(() => () => {
    if (guard.current) window.clearTimeout(guard.current)
  }, [])

  if (REGISTRATION.mode === 'pending' || !REGISTRATION.action || !REGISTRATION.entries) {
    return (
      <Panel>
        <Heading title="Kindly Confirm Your Attendance" note="Registration for the Opening Ceremony" />
        <p className="mx-auto max-w-md text-center text-[16px]" style={{ color: C.ink }}>
          Registration opens here shortly.
        </p>
      </Panel>
    )
  }

  const f = REGISTRATION.entries
  const field =
    'rounded-2xl border border-[rgba(3,122,138,0.25)] bg-white/80 px-4 py-3.5 text-[15px] outline-none focus:border-[#037A8A] focus:ring-2 focus:ring-[rgba(3,122,138,0.12)]'

  return (
    <Panel>
      <Heading
        title="Kindly Confirm Your Attendance"
        note="Spouses, children, colleagues and friends are all welcome"
      />

      <iframe
        name="wt-registration"
        title="Registration delivery"
        onLoad={onFrameLoad}
        className="hidden"
        aria-hidden="true"
      />

      <AnimatePresence mode="wait">
        {state !== 'done' ? (
          <motion.form
            key="form"
            action={REGISTRATION.action}
            method="POST"
            target="wt-registration"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto flex max-w-sm flex-col gap-3"
          >
            <input
              name={f.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Title, name and surname"
              aria-label="Title, name and surname"
              required
              className={field}
              style={{ color: C.ink, fontFamily: sans }}
            />
            <input
              name={f.position}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Position (optional)"
              aria-label="Position"
              className={field}
              style={{ color: C.ink, fontFamily: sans }}
            />
            <input
              name={f.affiliation}
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder="Affiliation"
              aria-label="Affiliation"
              required
              className={field}
              style={{ color: C.ink, fontFamily: sans }}
            />
            <input
              name={f.phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder="Phone number"
              aria-label="Phone number"
              required
              className={field}
              style={{ color: C.ink, fontFamily: sans }}
            />
            <input
              name={f.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              aria-label="Email"
              required
              className={field}
              style={{ color: C.ink, fontFamily: sans }}
            />

            <motion.button
              type="submit"
              disabled={state === 'sending'}
              whileTap={{ scale: 0.97 }}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[13.5px] font-medium uppercase tracking-[0.08em] shadow-[0_8px_20px_rgba(3,122,138,0.18)] disabled:opacity-60"
              style={{
                background: `linear-gradient(135deg, ${C.tealDeep}, ${C.teal})`,
                color: '#ffffff',
                fontFamily: sans,
              }}
            >
              {state === 'sending' ? 'Sending…' : 'Confirm attendance'} <Check className="h-4 w-4" />
            </motion.button>

            <p className="mt-1 text-center text-[12px]" style={{ color: C.inkSoft }}>
              Your details go directly to the Royal Thai Embassy.
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: `linear-gradient(135deg, ${C.tealDeep}, ${C.tealMid})` }}
            >
              <Check className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-[22px]" style={{ fontFamily: serif, color: C.tealDeep }}>
              Thank you, {name.split(' ').slice(-1)[0] || 'and welcome'}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-[15px]" style={{ color: C.inkSoft }}>
              Your attendance is confirmed with the Embassy. We look forward to welcoming you on
              Friday 11 September at 17:00.
            </p>
            <button
              type="button"
              onClick={downloadIcs}
              className="mt-6 inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-[13.5px] font-medium uppercase tracking-[0.08em]"
              style={{ borderColor: C.teal, color: C.tealDeep, fontFamily: sans }}
            >
              <CalendarPlus className="h-4 w-4" /> Add to Calendar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  )
}

/* ══════════════════ PAGE ══════════════════ */

export default function OpeningCeremony() {
  const tod = useTimeOfDay()
  const guest = useGuestName()
  return (
    <MotionConfig reducedMotion="user">
      <SignatureIntro />
      <ThreadRail />
      <div
        className="relative min-h-screen"
        style={{ background: tod.sky[2], color: C.ink, fontFamily: sans, overflowX: 'clip' }}
      >
        <ThaiBackdrop />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-[92vh] overflow-hidden">
          <CultureVideo />
        </div>

        <VenueMark />

        <div className="relative z-10 mx-auto max-w-[780px] px-5 pb-24 pt-6">
          <header className="text-center">
            <Seal />

            <Reveal delay={0.1}>
              {guest && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                  className="mt-6 text-[22px] italic sm:text-[25px]"
                  style={{ fontFamily: serif, color: C.tealDeep }}
                >
                  Dear {guest},
                </motion.p>
              )}
              <p
                className="mt-5 text-[12.5px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: C.teal }}
              >
                {EVENT.host}
              </p>
              <p className="mt-3 text-[18px] italic" style={{ fontFamily: serif, color: C.tealSoft }}>
                requests the pleasure of your company at the
              </p>
              <h1
                className="mt-1 text-[clamp(42px,8vw,70px)] font-semibold leading-[1.05] tracking-tight"
                style={{
                  fontFamily: serif,
                  filter: 'drop-shadow(0 2px 14px rgba(255,255,255,0.85))',
                }}
              >
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: TITLE_GRADIENT }}
                >
                  {EVENT.title}
                </span>
              </h1>
              <p
                className="mt-2 text-[19px] italic"
                style={{ fontFamily: serif, color: C.tealSoft }}
              >
                of {EVENT.festival} — {EVENT.subtitle}
              </p>

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
                {EVENT.day} <span style={{ color: C.tealMid }}>✦</span> {EVENT.time}
              </p>
              <p
                className="mt-2 text-[13.5px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: '#065F6B' }}
              >
                {EVENT.venue} <span style={{ color: C.tealMid }}>✦</span> {EVENT.venueFull}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <Countdown />
            </Reveal>
          </header>

          <Rule />

          <Reveal>
            <Panel>
              <p
                className="mx-auto max-w-[600px] text-center text-[18px] leading-relaxed"
                style={{ color: C.ink }}
              >
                The Royal Thai Embassy warmly invites you to the Opening Ceremony of Marhaba
                Thailand, a two-day celebration of Thai culture, craft, and hospitality at Reem
                Mall. The evening opens the festival with traditional performances and an
                introduction to the two days ahead — from live Muay Thai and hands-on workshops to
                a showcase of Thailand’s finest destinations.
              </p>
            </Panel>
          </Reveal>

          <Rule />

          <Reveal>
            <Panel>
              <Heading title="The Evening" note="Draft programme for the ceremony" />
              <ol className="mx-auto max-w-sm list-none">
                {CEREMONY.map((item, i) => (
                  <li
                    key={item}
                    className="grid grid-cols-[34px_1fr] items-baseline gap-3 py-2.5"
                    style={{
                      borderBottom:
                        i === CEREMONY.length - 1 ? 'none' : '1px dashed rgba(3,122,138,0.18)',
                    }}
                  >
                    <span
                      className="text-[12px] font-semibold tabular-nums"
                      style={{ color: C.tealMid }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[16px]" style={{ color: C.ink }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
              <p
                className="mt-5 text-center text-[13px] italic"
                style={{ fontFamily: serif, color: C.inkSoft }}
              >
                Stay to the end for the lucky draw. Order subject to confirmation by the Embassy.
              </p>
            </Panel>
          </Reveal>

          <Rule />

          <Reveal>
            <Registration />
          </Reveal>

          <Rule />

          <Reveal>
            <Panel>
              <Heading title="The Venue" note="Al Reem Island, Abu Dhabi" />
              <div className="flex flex-col items-center gap-4 text-center">
                <MapPin className="h-7 w-7" style={{ color: C.teal }} />
                <p className="text-[17px]" style={{ color: C.ink }}>
                  {EVENT.venue}
                  <br />
                  {EVENT.venueFull}
                  <br />
                  <span className="text-[15px]" style={{ color: C.inkSoft }}>
                    The ceremony runs {EVENT.time}
                  </span>
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href={EVENT.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em]"
                    style={{ borderColor: C.teal, color: C.tealDeep }}
                  >
                    Open in Maps
                  </a>
                  <button
                    type="button"
                    onClick={downloadIcs}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-white"
                    style={{ background: `linear-gradient(135deg, ${C.tealDeep}, ${C.teal})` }}
                  >
                    <CalendarPlus className="h-4 w-4" /> Add to Calendar
                  </button>
                </div>
              </div>
            </Panel>
          </Reveal>

          <Rule />

          <Reveal>
            <Panel className="text-center">
              <Heading
                title="The Two-Day Programme"
                note="Everything happening on 11 and 12 September"
              />
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="/embassy/programme"
                  className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-[13.5px] font-medium uppercase tracking-[0.08em]"
                  style={{ borderColor: C.teal, color: C.tealDeep, fontFamily: sans }}
                >
                  View the daily programme <ExternalLink className="h-4 w-4" />
                </a>
                <ShareCardButton guest={guest ?? undefined} label="Save your invitation" />
              </div>
            </Panel>
          </Reveal>

          <SiteFooter note="Programme details and timings are subject to confirmation by the Royal Thai Embassy." />
        </div>
      </div>
    </MotionConfig>
  )
}
