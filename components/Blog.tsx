'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import ScrambleText from '@/components/ScrambleText'

const posts = [
  {
    category: 'Digital Transformation',
    readTime: '6 min read',
    date: 'March 2025',
    title: 'Digital Transformation in the UAE: The Road Ahead',
    excerpt:
      'The UAE has positioned itself as one of the world\'s most ambitious digital economies. From Abu Dhabi\'s Smart City initiatives to Dubai\'s paperless government pledge, the nation is moving at extraordinary pace.',
    body: `The UAE Vision 2031 framework places digital economy development at its core, targeting a contribution of over AED 300 billion to the national GDP. This creates both pressure and extraordinary opportunity for enterprises willing to modernise.

Successful digital transformation is not about deploying the latest technology for its own sake. It is about fundamentally rethinking how value is created, delivered, and captured — from customer experience through to back-office operations. Organisations that approach transformation strategically, with clear KPIs and a genuine change-management programme, consistently outperform those that treat it as an IT project.

At WeThink, we have seen first-hand that the companies who lead digital transformation share three traits: executive commitment, a willingness to pilot and fail fast, and a disciplined focus on data as a strategic asset.

The most successful transformations we have been part of began not with a technology decision, but with a clear-eyed assessment of business outcomes. What does winning look like in three years? Which customer journeys need to be reimagined? Where is the organisation losing time, money, or talent to manual processes? These questions, answered honestly, become the compass for every technology decision that follows.`,
    color: 'from-violet-600 to-purple-700',
    accent: '#A78BFA',
  },
  {
    category: 'Cybersecurity',
    readTime: '5 min read',
    date: 'February 2025',
    title: 'Cybersecurity in 2025: Protecting What Matters Most',
    excerpt:
      'As the UAE\'s digital infrastructure grows, so does its attack surface. Ransomware, supply-chain compromises, and AI-powered phishing attacks are no longer hypothetical threats — they are weekly realities for organisations across the Gulf.',
    body: `The average cost of a data breach in the Middle East reached $8.75 million in 2024 — significantly above the global average — driven by the high value of financial and government data in the region. This statistic alone should elevate cybersecurity from an IT concern to a boardroom imperative.

Modern cybersecurity architecture follows a Zero Trust model: assume breach, verify every access request, and limit blast radius through micro-segmentation. Beyond architecture, continuous threat monitoring and a well-rehearsed incident response plan are the difference between a contained event and a catastrophic one.

Regulatory compliance — including UAE's National Cybersecurity Strategy requirements and emerging sector-specific frameworks — must also be baked into security programmes from the outset, not retrofitted after the fact. WeThink helps clients build security programmes that are both technically robust and audit-ready.

The threat landscape is evolving faster than most organisations can track. AI-assisted attacks can now craft convincing spear-phishing emails in seconds, automate vulnerability scanning, and adapt in real time to defensive responses. Meeting this threat requires equally intelligent defences — automated detection, AI-assisted triage, and security orchestration that can respond at machine speed.`,
    color: 'from-rose-600 to-violet-700',
    accent: '#F9A8D4',
  },
  {
    category: 'Cloud Strategy',
    readTime: '7 min read',
    date: 'January 2025',
    title: 'Cloud Migration: A Strategic Guide for UAE Businesses',
    excerpt:
      'Moving workloads to the cloud is now a standard expectation for competitive enterprises — but the path to cloud is not one-size-fits-all. A poorly planned migration can result in spiralling costs, compliance gaps, and performance degradation.',
    body: `The UAE's cloud market is experiencing remarkable growth, accelerated by the establishment of hyperscaler availability zones from AWS, Microsoft Azure, and Google Cloud within the country — enabling data residency compliance for even the most regulated sectors.

A successful cloud migration begins with a thorough workload assessment: understanding which applications benefit from lift-and-shift, which should be re-platformed, and which should be re-architected for cloud-native architectures. Cost modelling must account for egress charges, reserved instance commitments, and the FinOps discipline required to sustain cloud economics over time.

Equally important is the operating model transformation that must accompany cloud adoption — from procurement processes and skills development to security governance and DevOps practices. WeThink's cloud advisory practice guides clients through every dimension, ensuring migration delivers on its promise of agility, resilience, and efficiency.

One dimension often underestimated is the cultural shift required. Cloud is not simply a new place to run old workloads. It is a fundamentally different way of building, deploying, and operating technology — one that rewards experimentation, punishes over-provisioning, and demands continuous optimisation. Organisations that invest in building cloud-native engineering cultures alongside their technical migrations consistently see better outcomes.`,
    color: 'from-sky-600 to-violet-700',
    accent: '#7DD3FC',
  },
]

function ArticleModal({ post, onClose }: { post: typeof posts[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0A0A14] border border-violet-500/20 rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient bar */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${post.color} rounded-t-3xl`} />

        <div className="p-8">
          {/* Meta */}
          <div className="flex items-center justify-between mb-5">
            <span
              className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{ color: post.accent, background: `${post.accent}15`, border: `1px solid ${post.accent}30` }}
            >
              {post.category}
            </span>
            <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ color: 'var(--text)' }}>
            {post.title}
          </h2>

          {/* Body */}
          <div className="space-y-4">
            {post.body.split('\n\n').map((para, i) => (
              <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {para}
              </p>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 pt-6 border-t border-violet-500/20 flex items-center justify-between">
            <button
              onClick={() => { onClose(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn-primary text-sm"
            >
              Discuss This With Us
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={onClose} className="text-sm text-violet-300/60 hover:text-violet-200 transition-colors">
              Close ✕
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function BlogCard({ post, index, onOpen }: { post: typeof posts[0]; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    card.style.transform = `translate(${x * 0.04}px, ${y * 0.04}px)`
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translate(0, 0)'
  }

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col group h-full cursor-pointer"
      onClick={onOpen}
    >
      {/* Color band header */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${post.color}`} />

      {/* Card body */}
      <div className="flex flex-col flex-1 p-7">
        {/* Meta */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{
              color: post.accent,
              background: `${post.accent}15`,
              border: `1px solid ${post.accent}30`,
            }}
          >
            {post.category}
          </span>
          <div className="flex items-center gap-3 text-text-muted text-xs">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 group-hover:text-violet-400 transition-colors leading-snug" style={{ color: 'var(--text)' }}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1">
          {post.excerpt}
        </p>

        {/* Collapsed body preview */}
        <div className="overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-500 ease-in-out">
          <p className="text-text-muted/70 text-xs leading-relaxed border-t border-violet-500/10 pt-4 line-clamp-5">
            {post.body.split('\n\n')[0]}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 mt-5 text-sm font-semibold group-hover:text-violet-300 text-violet-400 transition-colors">
          <span>Read Article</span>
          <motion.svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            animate={{ x: 0 }}
            whileHover={{ x: 4 }}
            className="group-hover:translate-x-1 transition-transform duration-200"
          >
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>
      </div>
    </motion.article>
  )
}

export default function Blog() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activePost, setActivePost] = useState<typeof posts[0] | null>(null)

  return (
    <section id="blog" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'var(--surface-2)' }} />
      <div className="orb w-[400px] h-[400px] bg-violet-200 opacity-50 top-0 left-[-100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={ref} className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label mx-auto">Insights & Thinking</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black mt-3" style={{ color: 'var(--text)' }}>
            <ScrambleText>From Our </ScrambleText>
            <ScrambleText className="gradient-text">Blog</ScrambleText>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' } as React.CSSProperties}
          >
            Perspectives on technology, strategy, and digital transformation from the WeThink team.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <BlogCard key={post.title} post={post} index={i} onOpen={() => setActivePost(post)} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12"
        >
          <button
            className="btn-outline"
            onClick={() => document.querySelector('#blog')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View All Articles
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Article modal */}
      <AnimatePresence>
        {activePost && (
          <ArticleModal post={activePost} onClose={() => setActivePost(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
