'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User, Sparkles, RotateCcw } from 'lucide-react'

/* ── Mock knowledge base ─────────────────────────────────── */
const RESPONSES: { patterns: RegExp[]; reply: string }[] = [
  {
    patterns: [/service/i, /offer/i, /what do you do/i, /capabilities/i],
    reply:
      'WeThink offers **8 core services** across the UAE and Gulf:\n\n• Digital Transformation\n• Strategic Consulting\n• IT Solutions & Infrastructure\n• Cloud Services (AWS, Azure, GCP)\n• Cybersecurity & Compliance\n• Custom Software Development\n• Project Management\n• Data Analytics & BI\n\nWould you like details on any specific service?',
  },
  {
    patterns: [/contact|reach|email|phone|call|whatsapp/i],
    reply:
      'You can reach us through:\n\n📧 **info@wethink.ae**\n📞 **+971 50 312 5078**\n💬 WhatsApp (same number)\n📍 Pixel, Al Reem Island, Abu Dhabi\n\nOr use the **Contact section** on our home page — we reply within 24 hours.',
  },
  {
    patterns: [/location|where|address|abu dhabi|uae/i],
    reply:
      "We're headquartered at **Pixel, Al Reem Island, Abu Dhabi, UAE** — in the heart of the emirate's growing tech and business district.\n\nFounded in 2019, we serve clients across the UAE and the wider Gulf region.",
  },
  {
    patterns: [/about|who are|wethink|founded|history/i],
    reply:
      "WeThink is an Abu Dhabi-based IT consulting firm founded in **2019** by Rasha Aljalam.\n\nWe've delivered **5,000+ projects** for **1,000+ clients** — from government entities and financial institutions to fast-growing startups — across digital transformation, cloud, cybersecurity, and custom software.",
  },
  {
    patterns: [/price|cost|pricing|quote|budget|fee|rate/i],
    reply:
      "Our pricing depends on project scope, timeline, and engagement type (advisory, delivery, or managed services).\n\nThe best next step is a **free consultation call** — no commitment required. You can:\n\n• Fill out the **Contact form** on our home page\n• Email **info@wethink.ae**\n• WhatsApp **+971 50 312 5078**",
  },
  {
    patterns: [/cloud|aws|azure|gcp|migration/i],
    reply:
      'Our Cloud Services practice covers:\n\n☁️ **Cloud Strategy & Architecture** — hybrid and multi-cloud design\n🚀 **Migration** — lift-and-shift, re-platform, or cloud-native rebuild\n🔧 **Managed Operations** — 24/7 monitoring and optimisation\n💰 **FinOps** — cost governance and reserved instance planning\n\nWe work across AWS, Microsoft Azure, and Google Cloud.',
  },
  {
    patterns: [/security|cyber|iso|compliance|soc|zero trust/i],
    reply:
      "Our Cybersecurity practice includes:\n\n🛡️ Zero-Trust network architecture\n🔍 Penetration testing & vulnerability assessment\n📋 ISO 27001 & NESA compliance programmes\n👁️ 24/7 SOC monitoring\n\nWe helped an ADNOC supplier achieve **ISO 27001 certification in 9 months**.",
  },
  {
    patterns: [/project|case study|portfolio|work|achieve/i],
    reply:
      'Recent highlights from our project portfolio:\n\n🏛️ **National Digital Identity Platform** — UAE Government, 12 federal services integrated\n🏦 **Core Banking Modernisation** — Abu Dhabi FI, 45% cost reduction\n🎓 **Smart Campus System** — 18,000 daily users across 3 campuses\n📊 **Retail Analytics Dashboard** — 80+ stores, real-time BI\n🔒 **Zero-Trust Framework** — ISO 27001 in 9 months\n🤖 **AI HR Platform** — 5,000 users in 6 months',
  },
  {
    patterns: [/ai|artificial intelligence|machine learning|data analytic/i],
    reply:
      "Great question — AI is a growing focus for us!\n\nWe build **AI-powered solutions** including:\n• Intelligent dashboards and BI platforms\n• ML-driven matching and recommendation engines\n• Automated workflow and onboarding systems\n• Predictive analytics for business decisions\n\nYou can also try our **Live AI Analytics Demo** on the Services page — pick a dataset and ask a question in plain English!",
  },
  {
    patterns: [/hello|hi|hey|good morning|good afternoon|salaam/i],
    reply:
      "Hello! 👋 I'm the WeThink AI assistant.\n\nI can answer questions about our **services**, **projects**, **pricing**, **team**, or help you get in **contact** with us.\n\nWhat would you like to know?",
  },
  {
    patterns: [/thank|thanks|شكر/i],
    reply:
      "You're most welcome! 😊 If you have any other questions or would like to discuss a project, don't hesitate to reach out at **info@wethink.ae**.\n\nHave a great day!",
  },
]

const FALLBACK =
  "Thanks for your message! I'm a demo assistant — for complex queries, our team is happy to help directly.\n\n📧 **info@wethink.ae**\n📞 **+971 50 312 5078**\n\nOr use the **Contact form** on our home page — we reply within 24 hours."

function getResponse(input: string): string {
  for (const { patterns, reply } of RESPONSES) {
    if (patterns.some((p) => p.test(input))) return reply
  }
  return FALLBACK
}

/* ── Simple markdown renderer ────────────────────────────── */
function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line) return <div key={i} className="h-1" />
        // Bold **text**
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <p key={i} className="text-sm leading-relaxed">
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
          </p>
        )
      })}
    </div>
  )
}

/* ── Types ───────────────────────────────────────────────── */
type Message = {
  id: number
  role: 'user' | 'assistant'
  text: string
  ts: Date
}

const STARTER_PROMPTS = [
  'What services do you offer?',
  'Tell me about WeThink',
  'How can I contact you?',
  'Show me your projects',
]

/* ── Main component ──────────────────────────────────────── */
export default function AiChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      text: "Hello! 👋 I'm the WeThink AI assistant. Ask me about our services, projects, team, or how to get in touch.",
      ts: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const nextId = useRef(1)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || typing) return

    const userMsg: Message = { id: nextId.current++, role: 'user', text: trimmed, ts: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    const delay = 800 + Math.min(trimmed.length * 12, 1200)
    setTimeout(() => {
      const reply = getResponse(trimmed)
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, role: 'assistant', text: reply, ts: new Date() },
      ])
      setTyping(false)
    }, delay)
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const reset = () => {
    setMessages([
      {
        id: 0,
        role: 'assistant',
        text: "Hello! 👋 I'm the WeThink AI assistant. Ask me about our services, projects, team, or how to get in touch.",
        ts: new Date(),
      },
    ])
    nextId.current = 1
    setInput('')
    setTyping(false)
  }

  return (
    <>
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-24 md:bottom-40 right-4 md:right-6 z-[998] w-[340px] md:w-[380px] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/20"
            style={{ height: 'min(520px, calc(100dvh - 120px))', background: 'var(--surface)', border: '1px solid rgba(167,139,250,0.2)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-violet-100 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6D28D9, #7C3AED)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">WeThink AI</p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-violet-200 text-[10px]">Online · Demo mode</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={reset} title="Reset chat" aria-label="Reset chat"
                  className="w-7 h-7 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors">
                  <RotateCcw size={13} className="text-white/70" />
                </button>
                <button onClick={() => setOpen(false)} aria-label="Close chat"
                  className="w-7 h-7 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors">
                  <X size={15} className="text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'assistant'
                      ? 'bg-gradient-to-br from-violet-500 to-purple-600'
                      : 'bg-gradient-to-br from-gray-200 to-gray-300'
                  }`}>
                    {msg.role === 'assistant'
                      ? <Bot size={13} className="text-white" />
                      : <User size={13} className="text-gray-600" />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-tr-sm'
                      : 'rounded-tl-sm border border-violet-100'
                  }`}
                    style={msg.role === 'assistant' ? { background: 'var(--surface-2)' } : {}}>
                    {msg.role === 'assistant'
                      ? <MarkdownText text={msg.text} />
                      : <p className="text-sm leading-relaxed">{msg.text}</p>
                    }
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-full flex-shrink-0 bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Bot size={13} className="text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm px-4 py-3 border border-violet-100" style={{ background: 'var(--surface-2)' }}>
                      <div className="flex gap-1 items-center h-4">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-violet-400"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Starter prompts */}
            {messages.length === 1 && !typing && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {STARTER_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-violet-200 hover:border-violet-400 hover:bg-violet-50 transition-all font-medium"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex-shrink-0 px-3 py-3 border-t border-violet-100" style={{ background: 'var(--surface)' }}>
              <div className="flex items-end gap-2 rounded-xl border border-violet-200 focus-within:border-violet-400 transition-colors px-3 py-2"
                style={{ background: 'var(--surface-2)' }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask me anything…"
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-sm outline-none leading-relaxed max-h-24"
                  style={{ color: 'var(--text)' }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || typing}
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: input.trim() && !typing ? '#7C3AED' : 'rgba(124,58,237,0.15)' }}
                >
                  <Send size={13} className={input.trim() && !typing ? 'text-white' : 'text-violet-400'} />
                </button>
              </div>
              <p className="text-[10px] text-center mt-1.5" style={{ color: 'var(--text-muted)' }}>
                Demo mode · Powered by WeThink AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-24 right-4 md:right-6 z-[999] w-14 h-14 rounded-full shadow-xl shadow-violet-500/40 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #6D28D9, #7C3AED)' }}
        title="Chat with WeThink AI"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="ai" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <span className="text-white font-black text-lg tracking-tight leading-none">AI</span>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: '#7C3AED' }} />
        )}
      </motion.button>
    </>
  )
}
