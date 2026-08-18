'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { CalendarPlus, Check, ExternalLink, MapPin, Send } from 'lucide-react'
import ThaiBackdrop from '@/components/embassy/ThaiBackdrop'
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
  time: '5:00 PM',
  venue: 'Reem Mall, Abu Dhabi',
  mapUrl: 'https://maps.google.com/?q=Reem+Mall+Abu+Dhabi',
  start: '2026-09-11T17:00:00+04:00',
}

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
  entries?: { name?: string; email?: string; organisation?: string; guests?: string }
}

const REGISTRATION: RegistrationConfig = {
  mode: 'pending',
  // mode: 'native',
  // action: 'https://docs.google.com/forms/d/e/FORM_ID/formResponse',
  // entries: { name: 'entry.111', email: 'entry.222', organisation: 'entry.333', guests: 'entry.444' },
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
    'DTEND:20260911T180000Z',
    'SUMMARY:Marhaba Thailand — Opening Ceremony',
    'DESCRIPTION:Opening Ceremony of Marhaba Thailand\\, hosted by the Royal Thai Embassy\\, Abu Dhabi.',
    'LOCATION:Reem Mall, Abu Dhabi, UAE',
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
  const [email, setEmail] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [guests, setGuests] = useState('1')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !REGISTRATION.action || !REGISTRATION.entries) return
    setState('sending')

    const body = new FormData()
    const { entries } = REGISTRATION
    if (entries.name) body.append(entries.name, name)
    if (entries.email) body.append(entries.email, email)
    if (entries.organisation) body.append(entries.organisation, organisation)
    if (entries.guests) body.append(entries.guests, guests)

    try {
      // Google Forms accepts the post but blocks reading the response, so the
      // request is fire-and-forget: an opaque result still means delivered.
      await fetch(REGISTRATION.action, { method: 'POST', mode: 'no-cors', body })
      setState('done')
    } catch {
      setState('error')
    }
  }

  if (REGISTRATION.mode === 'iframe' && REGISTRATION.embedUrl) {
    return (
      <Panel>
        <Heading title="Kindly Confirm Your Attendance" note="Registration for the Opening Ceremony" />
        <div className="overflow-hidden rounded-2xl border border-[rgba(3,122,138,0.15)] bg-white">
          <iframe
            src={REGISTRATION.embedUrl}
            title="Opening Ceremony registration"
            className="h-[720px] w-full"
            loading="lazy"
          />
        </div>
      </Panel>
    )
  }

  if (REGISTRATION.mode === 'pending') {
    return (
      <Panel>
        <Heading title="Kindly Confirm Your Attendance" note="Registration for the Opening Ceremony" />
        <div className="mx-auto max-w-md text-center">
          <p className="text-[16px] leading-relaxed" style={{ color: C.ink }}>
            Registration for the Opening Ceremony opens here shortly. Guests will be able to
            confirm their attendance on this page.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
              'Marhaba Thailand — Opening Ceremony',
            )}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-[13.5px] font-medium uppercase tracking-[0.08em]"
            style={{ borderColor: C.teal, color: C.tealDeep, fontFamily: sans }}
          >
            <Send className="h-4 w-4" /> Enquire by email
          </a>
        </div>
      </Panel>
    )
  }

  return (
    <Panel>
      <Heading title="Kindly Confirm Your Attendance" note="Registration for the Opening Ceremony" />
      <AnimatePresence mode="wait">
        {state !== 'done' ? (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto flex max-w-sm flex-col gap-3"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              aria-label="Full name"
              required
              className="rounded-2xl border border-[rgba(3,122,138,0.25)] bg-white/70 px-4 py-3.5 text-[15px] outline-none focus:border-[#037A8A] focus:ring-2 focus:ring-[rgba(3,122,138,0.12)]"
              style={{ color: C.ink, fontFamily: sans }}
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email address"
              aria-label="Email address"
              required
              className="rounded-2xl border border-[rgba(3,122,138,0.25)] bg-white/70 px-4 py-3.5 text-[15px] outline-none focus:border-[#037A8A] focus:ring-2 focus:ring-[rgba(3,122,138,0.12)]"
              style={{ color: C.ink, fontFamily: sans }}
            />
            <input
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              placeholder="Organisation (optional)"
              aria-label="Organisation"
              className="rounded-2xl border border-[rgba(3,122,138,0.25)] bg-white/70 px-4 py-3.5 text-[15px] outline-none focus:border-[#037A8A]"
              style={{ color: C.ink, fontFamily: sans }}
            />
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              aria-label="Number attending"
              className="rounded-2xl border border-[rgba(3,122,138,0.25)] bg-white/70 px-4 py-3.5 text-[15px] outline-none focus:border-[#037A8A]"
              style={{ color: C.ink, fontFamily: sans }}
            >
              {['1', '2', '3', '4'].map((g) => (
                <option key={g} value={g}>
                  {g === '1' ? 'Attending alone' : `${g} attending`}
                </option>
              ))}
            </select>

            {state === 'error' && (
              <p className="text-center text-[13px]" style={{ color: '#9B2C2C' }}>
                Something went wrong sending that. Please try again, or email{' '}
                {CONTACT_EMAIL}.
              </p>
            )}

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
              Thank you, {name.split(' ')[0]}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-[15px]" style={{ color: C.inkSoft }}>
              Your attendance is confirmed with the Embassy. We look forward to welcoming you on
              11 September.
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
  return (
    <MotionConfig reducedMotion="user">
      <div
        className="relative min-h-screen"
        style={{ background: C.bg, color: C.ink, fontFamily: sans }}
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
                className="mt-2 text-[13.5px] font-medium uppercase tracking-[0.14em]"
                style={{ color: C.teal }}
              >
                {EVENT.venue}
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
                  <span className="text-[15px]" style={{ color: C.inkSoft }}>
                    Opening Ceremony begins at {EVENT.time}
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
              <a
                href="/embassy/programme"
                className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-[13.5px] font-medium uppercase tracking-[0.08em]"
                style={{ borderColor: C.teal, color: C.tealDeep, fontFamily: sans }}
              >
                View the daily programme <ExternalLink className="h-4 w-4" />
              </a>
            </Panel>
          </Reveal>

          <SiteFooter note="Concept presentation prepared by WeThink. Programme details and timings are subject to confirmation by the Royal Thai Embassy." />
        </div>
      </div>
    </MotionConfig>
  )
}
