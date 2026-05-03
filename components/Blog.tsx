'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const posts = [
  {
    category: 'Digital Transformation',
    readTime: '6 min read',
    date: 'March 2025',
    title: 'Digital Transformation in the UAE: The Road Ahead',
    excerpt:
      'The UAE has positioned itself as one of the world\'s most ambitious digital economies. From Abu Dhabi\'s Smart City initiatives to Dubai\'s paperless government pledge, the nation is moving at extraordinary pace. For businesses operating in this environment, transformation is no longer optional — it is existential.',
    body: `The UAE Vision 2031 framework places digital economy development at its core, targeting a contribution of over AED 300 billion to the national GDP. This creates both pressure and extraordinary opportunity for enterprises willing to modernise.

Successful digital transformation is not about deploying the latest technology for its own sake. It is about fundamentally rethinking how value is created, delivered, and captured — from customer experience through to back-office operations. Organisations that approach transformation strategically, with clear KPIs and a genuine change-management programme, consistently outperform those that treat it as an IT project.

At WeThink, we have seen first-hand that the companies who lead digital transformation share three traits: executive commitment, a willingness to pilot and fail fast, and a disciplined focus on data as a strategic asset.`,
    color: 'from-violet-600 to-purple-700',
    accent: '#A78BFA',
  },
  {
    category: 'Cybersecurity',
    readTime: '5 min read',
    date: 'February 2025',
    title: 'Cybersecurity in 2025: Protecting What Matters Most',
    excerpt:
      'As the UAE\'s digital infrastructure grows, so does its attack surface. Ransomware, supply-chain compromises, and AI-powered phishing attacks are no longer hypothetical threats — they are weekly realities for organisations across the Gulf. A reactive security posture is simply no longer sufficient.',
    body: `The average cost of a data breach in the Middle East reached $8.75 million in 2024 — significantly above the global average — driven by the high value of financial and government data in the region. This statistic alone should elevate cybersecurity from an IT concern to a boardroom imperative.

Modern cybersecurity architecture follows a Zero Trust model: assume breach, verify every access request, and limit blast radius through micro-segmentation. Beyond architecture, continuous threat monitoring and a well-rehearsed incident response plan are the difference between a contained event and a catastrophic one.

Regulatory compliance — including UAE's National Cybersecurity Strategy requirements and emerging sector-specific frameworks — must also be baked into security programmes from the outset, not retrofitted after the fact. WeThink helps clients build security programmes that are both technically robust and audit-ready.`,
    color: 'from-rose-600 to-violet-700',
    accent: '#F9A8D4',
  },
  {
    category: 'Cloud Strategy',
    readTime: '7 min read',
    date: 'January 2025',
    title: 'Cloud Migration: A Strategic Guide for UAE Businesses',
    excerpt:
      'Moving workloads to the cloud is now a standard expectation for competitive enterprises — but the path to cloud is not one-size-fits-all. A poorly planned migration can result in spiralling costs, compliance gaps, and performance degradation. The key is strategy before execution.',
    body: `The UAE\'s cloud market is experiencing remarkable growth, accelerated by the establishment of hyperscaler availability zones from AWS, Microsoft Azure, and Google Cloud within the country — enabling data residency compliance for even the most regulated sectors.

A successful cloud migration begins with a thorough workload assessment: understanding which applications benefit from lift-and-shift, which should be re-platformed, and which should be re-architected for cloud-native architectures. Cost modelling must account for egress charges, reserved instance commitments, and the FinOps discipline required to sustain cloud economics over time.

Equally important is the operating model transformation that must accompany cloud adoption — from procurement processes and skills development to security governance and DevOps practices. WeThink's cloud advisory practice guides clients through every dimension, ensuring migration delivers on its promise of agility, resilience, and efficiency.`,
    color: 'from-sky-600 to-violet-700',
    accent: '#7DD3FC',
  },
]

function BlogCard({ post, index }: { post: typeof posts[0]; index: number }) {
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
      className="glass-card rounded-2xl overflow-hidden flex flex-col group h-full"
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
        <h3 className="text-xl font-bold mb-3 group-hover:text-violet-700 transition-colors leading-snug" style={{ color: 'var(--text)' }}>
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
        <div className="flex items-center gap-2 mt-5 text-sm font-semibold group-hover:text-violet-800 text-violet-600 transition-colors">
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
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mt-3" style={{ color: 'var(--text)' } as React.CSSProperties}
          >
            From Our <span className="gradient-text">Blog</span>
          </motion.h2>
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
            <BlogCard key={post.title} post={post} index={i} />
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
          <button className="btn-outline">
            View All Articles
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
