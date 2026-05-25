'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Calendar, ShieldCheck, Clock, Cloud, BarChart3, Award, CheckCircle } from 'lucide-react'
import ScrambleText from '@/components/ScrambleText'
import { TestimonialStack, Testimonial } from '@/components/ui/glass-testimonial-swiper'

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    initials: 'AM',
    name: 'Ahmed Al Mansoori',
    role: 'CTO · Abu Dhabi National Energy',
    quote: "WeThink transformed our entire IT infrastructure in under 6 months. The team's depth of knowledge and project discipline is unlike anything we've experienced before.",
    tags: [{ text: 'FEATURED', type: 'featured' }, { text: 'Infrastructure', type: 'default' }],
    stats: [{ icon: Users, text: '500+ employees' }, { icon: Calendar, text: '6 month delivery' }],
    avatarGradient: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
  },
  {
    id: 2,
    initials: 'SM',
    name: 'Sarah Mitchell',
    role: 'Head of Information Security · Financial Services',
    quote: "From zero to ISO 27001 certified in 9 months. Their cybersecurity team didn't just implement frameworks — they built a genuine security culture across our organisation.",
    tags: [{ text: 'ISO 27001', type: 'featured' }, { text: 'Cybersecurity', type: 'default' }],
    stats: [{ icon: ShieldCheck, text: 'Certified' }, { icon: Clock, text: '9 months' }],
    avatarGradient: 'linear-gradient(135deg, #059669, #047857)',
  },
  {
    id: 3,
    initials: 'KR',
    name: 'Dr. Khalid Al Rashidi',
    role: 'VP Operations · UAE University',
    quote: "Our smart campus platform went live on time, under budget, and our 18,000 daily users love it. WeThink treated our project like it was their own.",
    tags: [{ text: 'Smart Campus', type: 'featured' }, { text: 'Education', type: 'default' }],
    stats: [{ icon: Users, text: '18K daily users' }, { icon: Award, text: 'On time & budget' }],
    avatarGradient: 'linear-gradient(135deg, #0EA5E9, #0369A1)',
  },
  {
    id: 4,
    initials: 'FZ',
    name: 'Fatima Al Zaabi',
    role: 'Director of Technology · Emirates Finance Group',
    quote: "The cloud migration was seamless — zero downtime, 45% cost reduction, and a team that communicated clearly at every single step.",
    tags: [{ text: 'Cloud Migration', type: 'featured' }, { text: 'Finance', type: 'default' }],
    stats: [{ icon: Cloud, text: '45% cost saving' }, { icon: CheckCircle, text: 'Zero downtime' }],
    avatarGradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
  },
  {
    id: 5,
    initials: 'RA',
    name: 'Reem Al Ahbabi',
    role: 'COO · Abu Dhabi Logistics Co.',
    quote: "The custom ERP WeThink built for us replaced three legacy systems overnight. Our operations team now has real-time visibility they'd been asking for over a decade.",
    tags: [{ text: 'Custom Software', type: 'featured' }, { text: 'ERP', type: 'default' }],
    stats: [{ icon: BarChart3, text: 'Real-time data' }, { icon: CheckCircle, text: '3 systems unified' }],
    avatarGradient: 'linear-gradient(135deg, #EC4899, #9333EA)',
  },
]

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="orb w-[400px] h-[400px] bg-violet-900 opacity-15 top-0 right-[-100px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6">
        {/* Header */}
        <div ref={ref} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label mx-auto">Client Stories</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black mt-3" style={{ color: 'var(--text)' }}>
            <ScrambleText>Trusted by </ScrambleText>
            <ScrambleText className="gradient-text">Leaders</ScrambleText>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-sm uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            Drag or tap dots to explore
          </motion.p>
        </div>

        {/* Card stack */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          /* height keeps the section tall enough for all stacked cards + dots */
          style={{ minHeight: 420 + (TESTIMONIALS.length - 1) * 10 + 32 }}
        >
          <TestimonialStack testimonials={TESTIMONIALS} visibleBehind={2} />
        </motion.div>
      </div>
    </section>
  )
}
