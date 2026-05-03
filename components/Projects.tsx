'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const projects = [
  {
    title: 'National Digital Identity Platform',
    client: 'Government Entity — UAE',
    category: 'Digital Transformation',
    desc: 'End-to-end design and delivery of a unified citizen identity portal, integrating 12 federal services and reducing onboarding time by 70%.',
    tags: ['Cloud', 'Identity & Access', 'API Integration'],
    gradient: 'from-violet-600/30 to-indigo-800/30',
    accent: '#A78BFA',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Core Banking Modernisation',
    client: 'Financial Institution — Abu Dhabi',
    category: 'IT Consulting',
    desc: 'Led the migration of legacy on-premise banking infrastructure to a hybrid cloud environment, cutting operational costs by 45% and improving uptime to 99.98%.',
    tags: ['Hybrid Cloud', 'Cybersecurity', 'DevOps'],
    gradient: 'from-emerald-600/25 to-teal-800/25',
    accent: '#34D399',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Smart Campus Management System',
    client: 'Higher Education — UAE',
    category: 'Custom Software',
    desc: 'Built a full-stack IoT-connected campus platform covering attendance, facilities, and energy monitoring — deployed across 3 campuses with 18,000 daily users.',
    tags: ['IoT', 'React', 'Node.js', 'Azure'],
    gradient: 'from-blue-600/25 to-cyan-800/25',
    accent: '#38BDF8',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Retail Analytics Dashboard',
    client: 'Retail Group — Gulf Region',
    category: 'Data Analytics',
    desc: 'Designed and deployed a real-time BI platform aggregating POS, inventory, and customer loyalty data across 80+ stores, enabling same-day executive decision-making.',
    tags: ['Power BI', 'Data Warehouse', 'ML'],
    gradient: 'from-orange-600/25 to-rose-800/25',
    accent: '#FB923C',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Zero-Trust Security Framework',
    client: 'Energy Sector — ADNOC Supplier',
    category: 'Cybersecurity',
    desc: 'Implemented a zero-trust network architecture and 24/7 SOC monitoring programme, achieving ISO 27001 certification within 9 months of engagement.',
    tags: ['Zero Trust', 'SOC', 'ISO 27001'],
    gradient: 'from-red-600/25 to-pink-800/25',
    accent: '#F87171',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'AI-Powered HR Platform',
    client: 'Fast-Growing Startup — Abu Dhabi',
    category: 'Strategic Consulting',
    desc: 'Co-designed and shipped a SaaS HR platform with AI-driven talent matching and automated onboarding workflows — reaching 5,000 active users within 6 months of launch.',
    tags: ['AI/ML', 'SaaS', 'UX Design'],
    gradient: 'from-purple-600/25 to-fuchsia-800/25',
    accent: '#C084FC',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function Projects() {
  const headingRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headingRef, { once: true, margin: '-80px' })

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[500px] h-[500px] bg-violet-900/20 opacity-30 top-[-100px] right-[-200px] pointer-events-none" />
      <div className="orb w-[400px] h-[400px] bg-indigo-900/20 opacity-20 bottom-[-100px] left-[-150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label mx-auto">Our Work</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-gray-900 mt-3"
          >
            Projects <span className="gradient-text">Achieved</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-text-muted text-lg max-w-2xl mx-auto"
          >
            A selection of transformative engagements across government, finance, education, and enterprise sectors across the UAE and Gulf region.
          </motion.p>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative glass-card rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Gradient top band */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              {/* Top accent line */}
              <div
                className="h-[2px] w-full"
                style={{ background: `linear-gradient(90deg, ${project.accent}60, transparent)` }}
              />

              <div className="relative p-7 flex flex-col flex-1">
                {/* Icon + category */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${project.accent}18`, color: project.accent }}
                  >
                    {project.icon}
                  </div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ background: `${project.accent}15`, color: project.accent }}
                  >
                    {project.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-gray-900 font-bold text-lg leading-snug mb-1 group-hover:text-gray-900 transition-colors">
                  {project.title}
                </h3>

                {/* Client */}
                <p className="text-xs font-medium mb-3" style={{ color: project.accent }}>
                  {project.client}
                </p>

                {/* Description */}
                <p className="text-text-muted text-sm leading-relaxed flex-1 mb-5">
                  {project.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-1 rounded-lg border font-medium"
                      style={{
                        borderColor: 'rgba(167,139,250,0.15)',
                        color: 'var(--text-muted)',
                        background: 'rgba(167,139,250,0.05)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14"
        >
          <p className="text-text-muted mb-5 text-sm">Ready to add your project to this list?</p>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Start Your Project
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.75 9h10.5M10.5 5.25L14.25 9l-3.75 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
