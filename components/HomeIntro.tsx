'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import LogoMarquee from '@/components/LogoMarquee'
import WeWordmark from '@/components/WeWordmark'

/**
 * What used to sit inside the hero.
 *
 * The reference keeps its hero to film and a ticker, so the wordmark, the
 * positioning line, the brief field, the topics and the logo strip come down
 * here instead. Nothing was dropped; it just stopped competing with the video.
 */

const ease = [0.16, 1, 0.3, 1] as const

const TOPICS = [
  { label: 'Cloud', href: '/services#cloud' },
  { label: 'Cybersecurity', href: '/services#security' },
  { label: 'Custom Software', href: '/services#software' },
  { label: 'Data & AI', href: '/services#data' },
]

export default function HomeIntro() {
  const [brief, setBrief] = useState('')

  const send = () => {
    const text = brief.trim()
      ? `Hello WeThink, I'd like to talk about: ${brief.trim()}`
      : 'Hello WeThink, I would like to discuss a project.'
    window.open(
      `https://wa.me/971503125078?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <section className="relative isolate overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            'radial-gradient(42% 46% at 82% 18%, rgba(236,170,220,0.42) 0%, rgba(236,170,220,0) 70%)',
            'radial-gradient(40% 44% at 12% 72%, rgba(120,110,245,0.32) 0%, rgba(120,110,245,0) 70%)',
          ].join(','),
        }}
      />

      <div className="mx-auto max-w-7xl px-6 pb-16 pt-24 text-center sm:pt-28">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease }}
          className="text-[clamp(3rem,9vw,7rem)] font-bold leading-[1.02] tracking-tight"
        >
          <WeWordmark />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.1, duration: 0.9, ease }}
          className="mx-auto mt-7 max-w-2xl text-[17px] leading-relaxed md:text-[19px]"
          style={{ color: 'var(--text-muted)' }}
        >
          Cloud, cybersecurity, custom software and data for government,
          financial institutions and growing companies across the UAE and the
          Gulf.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.18, duration: 0.9, ease }}
          className="mx-auto mt-10 w-full max-w-2xl"
        >
          <div
            className="flex flex-col gap-2 rounded-3xl bg-white/85 p-2 shadow-[0_16px_44px_-12px_rgba(55,20,90,0.22)] backdrop-blur-sm sm:flex-row sm:items-center sm:rounded-full sm:pl-6"
            style={{ border: '1px solid rgba(233,216,253,0.9)' }}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 pl-3 sm:pl-0">
              <Search className="h-[18px] w-[18px] shrink-0" style={{ color: '#9ca3af' }} />
              <input
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Tell us what you need"
                aria-label="Tell us what you need"
                className="min-w-0 flex-1 bg-transparent py-3 text-[16px] outline-none placeholder:text-[#9ca3af]"
                style={{ color: 'var(--text)' }}
              />
            </div>
            <button
              type="button"
              onClick={send}
              className="w-full shrink-0 rounded-full bg-[#1a1523] px-7 py-3.5 text-[14.5px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.99] sm:w-auto"
            >
              Get Started
            </button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {TOPICS.map((t) => (
              <a
                key={t.label}
                href={t.href}
                className="rounded-full bg-white/80 px-6 py-2.5 text-[14px] font-medium no-underline shadow-[0_8px_22px_-10px_rgba(55,20,90,0.22)] transition-colors hover:bg-white"
                style={{ color: 'var(--text)', border: '1px solid rgba(233,216,253,0.9)' }}
              >
                {t.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="pb-16">
        <LogoMarquee />
      </div>
    </section>
  )
}
