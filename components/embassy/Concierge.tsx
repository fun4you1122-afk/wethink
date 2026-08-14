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
    patterns: [/schedule|programme|program|agenda|each day|what.*happen|timing|time/i],
    reply:
      'Both days run at Reem Mall.\n\nDay One (11 Sept) — doors open with the opening ceremony, cultural performances and workshops from midday, the Muay Thai showcase in the afternoon, and the lucky draw in the evening.\n\nDay Two (12 Sept) — workshops continue in the morning, Thai massage and the tourism pavilion at midday, a Muay Thai encore, then the grand prize draw and closing ceremony.',
  },
  {
    patterns: [/rsvp|register|sign up|book|attend|confirm/i],
    reply:
      'Use the RSVP panel on this page — choose Day One, Day Two, or both, and confirm. It prepares a message you can send straight to the Embassy desk by email or WhatsApp.\n\nKindly reply by 4 September 2026.',
  },
  {
    patterns: [/where|venue|location|reem|mall|address|map|park/i],
    reply:
      'The festival is at Reem Mall on Al Reem Island, Abu Dhabi. There is a map link in the Venue section of this page.\n\nParking arrangements have not been confirmed yet — the Embassy can advise closer to the date.',
  },
  {
    patterns: [/massage|spa|wellness/i],
    reply:
      'Complimentary traditional Thai massage sessions run through both days, courtesy of our wellness partners. They are offered on a first-come basis at the wellness corner.',
  },
  {
    patterns: [/muay|thai boxing|boxing|fight/i],
    reply:
      'The Muay Thai showcase features live demonstrations with the techniques explained ringside — afternoons on both days, with an encore on Day Two.',
  },
  {
    patterns: [/workshop|craft|carving|garland|hands.?on/i],
    reply:
      'The hands-on workshops cover Thai fruit carving, garland-making (phuang malai), and other traditional crafts, taught by artisans. Open from midday on Day One and all morning on Day Two.',
  },
  {
    patterns: [/dance|perform|music|show|stage|culture/i],
    reply:
      'Traditional Thai dance and live music run on the main stage across both days, beginning at midday on Day One.',
  },
  {
    patterns: [/prize|draw|lucky|win|raffle/i],
    reply:
      'There is a prize draw each evening, with flights, resort stays, and experiences across Thailand contributed by our sponsors. The grand draw closes Day Two.',
  },
  {
    patterns: [/tourism|travel|airline|resort|holiday|trip|visa/i],
    reply:
      "The tourism pavilion brings together Thailand's resorts, airlines, and tour operators, so you can plan a trip on the spot. For visa questions, please contact the Embassy directly.",
  },
  {
    patterns: [/food|eat|cuisine|restaurant|dish|aroi/i],
    reply:
      'Thai hospitality is central to the festival, and food partners will be on site. The full food line-up is still being confirmed by the Embassy.',
  },
  {
    patterns: [/cost|price|ticket|free|entry|fee/i],
    reply:
      'Entry is free and open to the public. An RSVP simply helps the Embassy plan numbers.',
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
    patterns: [/hello|hi|hey|sawasdee|salaam|marhaba|good (morning|evening|afternoon)/i],
    reply:
      "Sawasdee ka! 🌸 I'm the Marhaba Thailand concierge. Ask me about the programme, the venue, or how to RSVP.",
  },
  {
    patterns: [/thank|thanks|khop khun|شكر/i],
    reply: "Khop khun ka — you're very welcome. We hope to see you at Reem Mall in September.",
  },
  {
    patterns: [/who.*(made|built|design)|wethink|website/i],
    reply:
      'This invitation was designed and built by WeThink, a digital studio in Abu Dhabi — wethink.ae.',
  },
]

const FALLBACK =
  "That detail hasn't been confirmed yet. The Embassy's team can help directly — and everything currently confirmed is on this page: the programme, the two-day schedule, the venue, and the RSVP panel."

function answer(q: string) {
  for (const { patterns, reply } of KB) {
    if (patterns.some((p) => p.test(q))) return reply
  }
  return FALLBACK
}

const CHIPS = ["What's happening each day?", 'How do I RSVP?', 'Where is it held?']

export default function Concierge() {
  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      who: 'bot',
      text: "Sawasdee ka! 🌸 I'm the Marhaba Thailand concierge. Ask me about the programme, the highlights, or how to RSVP.",
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
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-medium text-white shadow-[0_10px_30px_rgba(139,80,100,0.35)]"
        style={{ background: 'linear-gradient(135deg,#8b5064,#d3c3e3)' }}
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
            className="fixed bottom-24 right-5 z-40 flex w-[340px] max-w-[calc(100vw-40px)] flex-col overflow-hidden rounded-3xl border border-[rgba(139,80,100,0.18)] bg-[#fdf7f0] shadow-[0_24px_60px_rgba(68,48,46,0.28)]"
            style={{ height: 460, maxHeight: 'calc(100vh - 150px)' }}
          >
            <div
              className="flex items-center justify-between px-4 py-3.5 text-white"
              style={{ background: 'linear-gradient(135deg,#8b5064,#d3c3e3)' }}
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
                      ? 'max-w-[86%] self-start whitespace-pre-line rounded-2xl rounded-bl-sm border border-[rgba(139,80,100,0.12)] bg-white/80 px-3.5 py-2.5 text-[14px] leading-relaxed text-[#44302e]'
                      : 'max-w-[86%] self-end whitespace-pre-line rounded-2xl rounded-br-sm px-3.5 py-2.5 text-[14px] leading-relaxed text-[#44302e]'
                  }
                  style={
                    m.who === 'user'
                      ? { background: 'linear-gradient(135deg,#f3c9c2,#ddb571)' }
                      : undefined
                  }
                >
                  {m.text}
                </motion.div>
              ))}

              {typing && (
                <div className="flex max-w-[86%] items-center gap-1 self-start rounded-2xl rounded-bl-sm border border-[rgba(139,80,100,0.12)] bg-white/80 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-[#8b5064]"
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
                  className="rounded-full border border-[rgba(139,80,100,0.18)] bg-[#f7ebe0] px-3 py-1.5 text-[12px] text-[#6e3e4e] transition-colors hover:bg-[#f3c9c2]"
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
              className="flex gap-2 border-t border-[rgba(139,80,100,0.12)] p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a question…"
                aria-label="Ask the concierge"
                className="flex-1 rounded-full border border-[rgba(139,80,100,0.25)] bg-white px-4 py-2.5 text-[14px] text-[#44302e] outline-none focus:border-[#8b5064]"
              />
              <button
                type="submit"
                aria-label="Send"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white"
                style={{ background: 'linear-gradient(135deg,#8b5064,#d3c3e3)' }}
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
