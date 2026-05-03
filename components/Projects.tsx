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
    accent: '#A78BFA',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80&fit=crop',
    stat: '70%',
    statLabel: 'faster onboarding',
  },
  {
    title: 'Core Banking Modernisation',
    client: 'Financial Institution — Abu Dhabi',
    category: 'IT Consulting',
    desc: 'Led the migration of legacy on-premise banking infrastructure to a hybrid cloud environment, cutting operational costs by 45% and improving uptime to 99.98%.',
    tags: ['Hybrid Cloud', 'Cybersecurity', 'DevOps'],
    accent: '#34D399',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80&fit=crop',
    stat: '45%',
    statLabel: 'cost reduction',
  },
  {
    title: 'Smart Campus Management System',
    client: 'Higher Education — UAE',
    category: 'Custom Software',
    desc: 'Built a full-stack IoT-connected campus platform covering attendance, facilities, and energy monitoring — deployed across 3 campuses with 18,000 daily users.',
    tags: ['IoT', 'React', 'Node.js', 'Azure'],
    accent: '#38BDF8',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=80&fit=crop',
    stat: '18K',
    statLabel: 'daily users',
  },
  {
    title: 'Retail Analytics Dashboard',
    client: 'Retail Group — Gulf Region',
    category: 'Data Analytics',
    desc: 'Designed and deployed a real-time BI platform aggregating POS, inventory, and customer loyalty data across 80+ stores, enabling same-day executive decision-making.',
    tags: ['Power BI', 'Data Warehouse', 'ML'],
    accent: '#FB923C',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&fit=crop',
    stat: '80+',
    statLabel: 'stores connected',
  },
  {
    title: 'Zero-Trust Security Framework',
    client: 'Energy Sector — ADNOC Supplier',
    category: 'Cybersecurity',
    desc: 'Implemented a zero-trust network architecture and 24/7 SOC monitoring programme, achieving ISO 27001 certification within 9 months of engagement.',
    tags: ['Zero Trust', 'SOC', 'ISO 27001'],
    accent: '#F87171',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&q=80&fit=crop',
    stat: '9mo',
    statLabel: 'to ISO 27001',
  },
  {
    title: 'AI-Powered HR Platform',
    client: 'Fast-Growing Startup — Abu Dhabi',
    category: 'Strategic Consulting',
    desc: 'Co-designed and shipped a SaaS HR platform with AI-driven talent matching and automated onboarding workflows — reaching 5,000 active users within 6 months.',
    tags: ['AI/ML', 'SaaS', 'UX Design'],
    accent: '#C084FC',
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=900&q=80&fit=crop',
    stat: '5K',
    statLabel: 'users in 6 months',
  },
]

function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: typeof projects[0]
  index: number
  featured?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative overflow-hidden rounded-2xl ${featured ? 'min-h-[420px]' : 'min-h-[280px]'}`}
    >
      {/* Background image */}
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* Hover colour wash */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${project.accent}25 0%, rgba(0,0,0,0.6) 100%)` }}
      />

      {/* Accent top line slides in */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: `linear-gradient(90deg, ${project.accent}, transparent)` }}
      />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm"
            style={{ background: `${project.accent}25`, color: project.accent, border: `1px solid ${project.accent}40` }}
          >
            {project.category}
          </span>

          {/* Stat — appears on hover */}
          <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 text-right">
            <div className="text-2xl font-black text-white leading-none">{project.stat}</div>
            <div className="text-[10px] text-white/60 mt-0.5">{project.statLabel}</div>
          </div>
        </div>

        {/* Bottom content */}
        <div>
          <p className="text-xs font-medium mb-1.5" style={{ color: project.accent }}>
            {project.client}
          </p>

          <h3 className="text-white font-bold text-lg leading-snug">
            {project.title}
          </h3>

          {/* Description + tags slide in on hover */}
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500">
            <div className="overflow-hidden">
              <p className="text-white/75 text-sm leading-relaxed pt-2 pb-3">
                {project.desc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-0.5 rounded-lg font-medium text-white/70 backdrop-blur-sm"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const headingRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headingRef, { once: true, margin: '-80px' })

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
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

        {/* Row 1: featured (2 cols) + 2 stacked (1 col) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="md:col-span-2">
            <ProjectCard project={projects[0]} index={0} featured />
          </div>
          <div className="flex flex-col gap-5">
            <ProjectCard project={projects[1]} index={1} />
            <ProjectCard project={projects[2]} index={2} />
          </div>
        </div>

        {/* Row 2: 3 equal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ProjectCard project={projects[3]} index={3} />
          <ProjectCard project={projects[4]} index={4} />
          <ProjectCard project={projects[5]} index={5} />
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
