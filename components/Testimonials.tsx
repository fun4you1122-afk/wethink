'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ScrambleText from '@/components/ScrambleText'
import {
  ContainerScroll,
  CardsContainer,
  CardTransformed,
  ReviewStars,
} from '@/components/ui/scroll-cards'

const TESTIMONIALS = [
  {
    id: 'ahmed',
    quote: "WeThink transformed our entire IT infrastructure in under 6 months. The team's depth of knowledge and project discipline is unlike anything we've experienced before.",
    name: 'Ahmed Al Mansoori',
    role: 'CTO',
    company: 'Abu Dhabi National Energy',
    initials: 'AM',
    color: '#7C3AED',
  },
  {
    id: 'sarah',
    quote: "From zero to ISO 27001 certified in 9 months. Their cybersecurity team didn't just implement frameworks — they built a genuine security culture across our organisation.",
    name: 'Sarah Mitchell',
    role: 'Head of Information Security',
    company: 'Financial Services — Abu Dhabi',
    initials: 'SM',
    color: '#059669',
  },
  {
    id: 'khalid',
    quote: "Our smart campus platform went live on time, under budget, and our 18,000 daily users love it. WeThink treated our project like it was their own.",
    name: 'Dr. Khalid Al Rashidi',
    role: 'VP Operations',
    company: 'UAE University',
    initials: 'KR',
    color: '#0EA5E9',
  },
  {
    id: 'fatima',
    quote: "The cloud migration was seamless — zero downtime, 45% cost reduction, and a team that communicated clearly at every single step.",
    name: 'Fatima Al Zaabi',
    role: 'Director of Technology',
    company: 'Emirates Finance Group',
    initials: 'FZ',
    color: '#F59E0B',
  },
]

const CARD_H = 380

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-8 text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label mx-auto">Client Stories</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="text-4xl md:text-5xl font-black mt-3"
          style={{ color: 'var(--text)' }}
        >
          <ScrambleText>Trusted by </ScrambleText>
          <ScrambleText className="gradient-text">Leaders</ScrambleText>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mt-4 text-sm uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          Scroll to explore
        </motion.p>
      </div>

      {/* Scroll-driven card stack */}
      <ContainerScroll className="min-h-[200vh]">
        <div
          className="sticky flex justify-center items-start px-6"
          style={{ top: '15vh' }}
        >
          <CardsContainer
            className="w-full max-w-md mx-auto"
            style={{ height: CARD_H + (TESTIMONIALS.length - 1) * 10 }}
          >
            {TESTIMONIALS.map((t, i) => (
              <CardTransformed
                key={t.id}
                arrayLength={TESTIMONIALS.length}
                index={i}
                variant="dark"
                className="bg-[#0D0D1A]/95 border-violet-500/25 text-white"
                style={{ width: '100%', height: CARD_H }}
              >
                {/* Stars */}
                <ReviewStars rating={5} className="text-violet-400" />

                {/* Quote */}
                <blockquote className="text-center text-sm md:text-base leading-relaxed font-medium text-violet-100/85 px-2">
                  "{t.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-violet-500/20 w-full">
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs"
                    style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}
                  >
                    {t.initials}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">{t.name}</div>
                    <div className="text-xs text-violet-300/60">{t.role} · {t.company}</div>
                  </div>
                </div>
              </CardTransformed>
            ))}
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  )
}
