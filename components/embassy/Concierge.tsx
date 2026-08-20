'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, X } from 'lucide-react'

/**
 * "Marhaba Concierge" — an on-page assistant for the invitation.
 *
 * Answers are matched locally from the event fact sheet below, the same
 * pattern the site's main AI widget uses. Nothing is sent anywhere: a browser
 * cannot safely hold an API key, so a live model call would either leak the
 * key or fail. Anything outside the fact sheet is handed back to the Embassy.
 */

type Msg = { who: 'bot' | 'user'; text: string }

const KB: { patterns: RegExp[]; reply: string }[] = [
  {
    // first in the list, and without a bare "opening", so "when does the
    // opening ceremony start" lands here while "what time do you open" does not
    patterns: [/ceremony|opening ceremony|\bvip\b|ambassador/i],
    reply:
      'The Opening Ceremony is on Friday 11 September, 17:00 to 18:00, in the Main Atrium on the Ground Floor near Zara. It runs to opening remarks, a cultural performance, the cake cutting, a Muay Thai performance, the group photo, and a lucky draw. Invited guests can confirm attendance on the Opening Ceremony page.',
  },
  {
    patterns: [/open|close|hour|what time|when.*(start|end|finish)|late|early/i],
    reply:
      'Doors open at 10:00 AM and the festival runs until 10:00 PM on both days, 11 and 12 September. Come and go as you please — entry is free.',
  },
  {
    patterns: [/schedule|programme|program|agenda|each day|what.*happen|timing|time/i],
    reply:
      'Three stages run in parallel from 10:00 AM to 10:00 PM on both days: the Main Stage, the Second Stage, and the Workshop area.\n\nDay One (11 Sept): music by Sun Der, Thai cultural performance by Kai Kaew, Thai dance with Kru Kae, Influencer Panel I, Muay Thai by UAM at 2:40 PM, the Opening Ceremony at 5:00 PM in the Main Atrium, then a quiz game, the Officers\u2019 band and batik painting through the evening.\n\nDay Two (12 Sept): the same three tracks, with Influencer Panel II, the Reem Mall campaign prize presentation at 5:00 PM, and Muay Thai again at 8:15 PM.\n\nThe full hour-by-hour programme for all three stages is on the Daily Programme page.',
  },
  {
    patterns: [/rsvp|register|sign up|book|attend|ticket|save the date/i],
    reply:
      'No registration is needed for the festival itself. Entry is free and open to the public. The Opening Ceremony on Friday evening is by invitation, and invited guests can confirm attendance on the Opening Ceremony page. Use the Save the Date panel here to add the festival to your calendar.',
  },
  {
    patterns: [/where|venue|location|reem|mall|address|map|park/i],
    reply:
      'The festival is at Reem Mall on Al Reem Island, Abu Dhabi, open 10:00 AM to 10:00 PM on both days. There is a map link in the Venue section of this page.\n\nParking arrangements have not been confirmed yet — the Embassy can advise closer to the date.',
  },
  {
    patterns: [/muay|thai boxing|boxing|fight/i],
    reply:
      'Muay Thai is demonstrated by UAM on the Main Stage at 2:40 PM on both days, with a second demonstration on Saturday at 8:15 PM, and a Wai Kru at the Opening Ceremony.',
  },
  {
    patterns: [/workshop|craft|carving|garland|hands.?on/i],
    reply:
      'The workshop area runs all day, both days. Fruit and soap carving and Roy Malai garlands with the Thai Women\u2019s Circle, weaving, batik and Benjarong painting with SACIT, umbrella painting with Kai Kaew, and tote bag decoration and Thai art colouring with the Embassy.',
  },
  {
    patterns: [/dance|perform|music|show|stage|culture/i],
    reply:
      'Kai Kaew brings Thai cultural performance, Kru Kae leads Thai dance performances and classes, and the band Sun Der plays through the day, joined by Kany on Saturday. Kim from Dusit Thani opens each morning on the Second Stage, and the Officers\u2019 band plays on Friday evening.',
  },
  {
    patterns: [/prize|draw|lucky|win|raffle/i],
    reply:
      'There is a lucky draw at the Opening Ceremony on Friday evening, and the Reem Mall campaign prize presentation takes place on Saturday at 5:00 PM.',
  },
  {
    patterns: [/tourism|travel|airline|resort|holiday|trip|visa/i],
    reply:
      'For travel and visa questions, the Royal Thai Embassy in Abu Dhabi can help directly. The festival itself is a cultural celebration rather than a travel fair.',
  },
  {
    patterns: [/food|eat|cuisine|restaurant|dish|aroi/i],
    reply:
      'Thai hospitality is central to the festival, and the food line-up is being confirmed by the Embassy. The programme also includes fruit and soap carving demonstrations by the Thai Women\u2019s Circle.',
  },
  {
    patterns: [/cost|price|free|entry|\bfee\b/i],
    reply:
      'Entry is free and open to the public — just come along any time between 10:00 AM and 10:00 PM on either day.',
  },
  {
    patterns: [/dress|wear|attire|code/i],
    reply:
      "A dress code has not been set. Smart casual is a safe choice for an Embassy occasion — the Embassy can confirm if you'd like to be certain.",
  },
  {
    patterns: [/kid|child|family|baby/i],
    reply:
      'The festival is a public, family-friendly celebration — the workshops and performances are enjoyable for all ages.',
  },
  {
    patterns: [/\b(hello|hi|hey|sawasdee|salaam|marhaba)\b|good (morning|evening|afternoon)/i],
    reply:
      "Sawasdee ka! 🌸 I'm the Marhaba Thailand concierge, built by WeThink. Ask me about the programme, the venue, or getting there.",
  },
  {
    patterns: [/thank|thanks|khop khun|شكر/i],
    reply: "Khop khun ka — you're very welcome. We hope to see you at Reem Mall in September.",
  },
  {
    patterns: [/who.*(made|built|design)|wethink|website/i],
    reply:
      'WeThink is a digital studio in Abu Dhabi. We designed and built the invitation for the Opening Ceremony, this live programme, the ticket and wallet pass, and me. It was our contribution to Marhaba Thailand rather than a commission.\n\nwethink.ae · @wethink.ae on Instagram',
  },
]

const FALLBACK =
  "That detail hasn't been confirmed yet. The Embassy's team can help directly — and everything currently confirmed is on this page: the programme, the two-day schedule, and the venue."

function answer(q: string) {
  for (const { patterns, reply } of KB) {
    if (patterns.some((p) => p.test(q))) return reply
  }
  return FALLBACK
}

const CHIPS = ["What's happening each day?", 'Do I need a ticket?', 'Where is it held?', 'Who built this?']

export default function Concierge() {
  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      who: 'bot',
      text: "Sawasdee ka! 🌸 I'm the Marhaba Thailand concierge, built by WeThink. Ask me about the programme, the highlights, or the venue.",
    },
  ])
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const ask = (q: string) => {
    const question = q.trim()
    if (!question || typing) return
    setMsgs((m) => [...m, { who: 'user', text: question }])
    setInput('')
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { who: 'bot', text: answer(question) }])
    }, 550 + Math.random() * 350)
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-medium text-white shadow-[0_10px_30px_rgba(3,122,138,0.35)]"
        style={{ background: 'linear-gradient(135deg,#015866,#029FB1)' }}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="hidden sm:inline">{open ? 'Close' : 'Ask about the event'}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="fixed bottom-24 right-5 z-40 flex w-[340px] max-w-[calc(100vw-40px)] flex-col overflow-hidden rounded-3xl border border-[rgba(3,122,138,0.18)] bg-[#F2FAFB] shadow-[0_24px_60px_rgba(12,58,66,0.28)]"
            style={{ height: 460, maxHeight: 'calc(100vh - 150px)' }}
          >
            <div
              className="flex items-center justify-between px-4 py-3.5 text-white"
              style={{ background: 'linear-gradient(135deg,#015866,#029FB1)' }}
            >
              <div>
                <div className="font-serif text-[16px] leading-tight">Marhaba Concierge</div>
                <div className="text-[11px] opacity-85">Event guide · by WeThink</div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close concierge"
                className="p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={bodyRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={
                    m.who === 'bot'
                      ? 'max-w-[86%] self-start whitespace-pre-line rounded-2xl rounded-bl-sm border border-[rgba(3,122,138,0.12)] bg-white/80 px-3.5 py-2.5 text-[14px] leading-relaxed text-[#0C3A42]'
                      : 'max-w-[86%] self-end whitespace-pre-line rounded-2xl rounded-br-sm px-3.5 py-2.5 text-[14px] leading-relaxed text-[#015866]'
                  }
                  style={
                    m.who === 'user'
                      ? { background: 'linear-gradient(135deg,#CBEEF3,#9FDDE8)' }
                      : undefined
                  }
                >
                  {m.text}
                </motion.div>
              ))}

              {typing && (
                <div className="flex max-w-[86%] items-center gap-1 self-start rounded-2xl rounded-bl-sm border border-[rgba(3,122,138,0.12)] bg-white/80 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-[#037A8A]"
                      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 px-4 pb-3">
              {CHIPS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => ask(c)}
                  className="rounded-full border border-[rgba(3,122,138,0.18)] bg-[#E3F4F7] px-3 py-1.5 text-[12px] text-[#015866] transition-colors hover:bg-[#9FDDE8]"
                >
                  {c}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                ask(input)
              }}
              className="flex gap-2 border-t border-[rgba(3,122,138,0.12)] p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a question…"
                aria-label="Ask the concierge"
                className="flex-1 rounded-full border border-[rgba(3,122,138,0.25)] bg-white px-4 py-2.5 text-[14px] text-[#0C3A42] outline-none focus:border-[#037A8A]"
              />
              <button
                type="submit"
                aria-label="Send"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white"
                style={{ background: 'linear-gradient(135deg,#015866,#029FB1)' }}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
