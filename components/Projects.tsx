'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const projects = [
  {
    title: 'Marhaba Thailand — Royal Thai Embassy',
    client: 'The Royal Thai Embassy, Abu Dhabi · Reem Mall',
    category: 'Digital Transformation',
    desc: 'Three connected digital experiences for the Embassy’s two-day national cultural festival: the public invitation, a VIP invitation for the Opening Ceremony with registration wired into the Embassy’s own systems, and a live three-stage programme reached from QR codes at the venue.',
    tags: ['Next.js', 'Live Programme', 'Wallet Passes'],
    accent: '#037A8A',
    image: '/projects/marhaba/invitation-desktop.jpg',
    stat: 'Live',
    statLabel: 'open it on your phone',
    href: '/embassy',
  },
  {
    title: 'Nexa Pay — Digital Payments App',
    client: 'Nexa Pay · Fintech Startup, Abu Dhabi',
    category: 'Custom Software',
    desc: 'Took a first-time founder from wireframes to a working payments app: onboarding and KYC flows, wallet top-ups, and a merchant checkout — ready for their pre-launch pilot.',
    tags: ['React Native', 'Node.js', 'KYC Flows'],
    accent: '#A78BFA',
    image: '/projects/nexa-pay.jpg',
    stat: '8 wks',
    statLabel: 'idea to pilot',
  },
  {
    title: 'CargoFlow — Shipment Tracking SaaS',
    client: 'CargoFlow · Logistics Tech, Dubai',
    category: 'Cloud Services',
    desc: 'Designed and built a real-time shipment tracking dashboard with fleet API integrations and automated customer notifications, hosted on a cost-optimised AWS stack.',
    tags: ['AWS', 'Realtime APIs', 'Dashboards'],
    accent: '#FB923C',
    image: '/projects/cargoflow.jpg',
    stat: '40%',
    statLabel: 'less manual dispatch work',
  },
  {
    title: 'Lumora — D2C Skincare Launch',
    client: 'Lumora · Beauty Brand, UAE',
    category: 'Digital Transformation',
    desc: 'Full digital launch for a new skincare label: brand identity, e-commerce store, payment and delivery integrations, and analytics to steer the first campaigns.',
    tags: ['E-commerce', 'Brand Identity', 'Analytics'],
    accent: '#C084FC',
    image: '/projects/lumora.jpg',
    stat: '3×',
    statLabel: 'launch-month return on ad spend',
  },
  {
    title: 'Pulse Loop — Wellness App MVP',
    client: 'Pulse Loop · HealthTech Startup',
    category: 'Custom Software',
    desc: 'Scoped and shipped a lean wellness-tracking MVP with wearable sync, streak-based habit loops, and a coach dashboard — built to validate the concept before seed fundraising.',
    tags: ['Flutter', 'Firebase', 'Wearable Sync'],
    accent: '#34D399',
    image: '/projects/pulse-loop.jpg',
    stat: '12 wks',
    statLabel: 'to app-store beta',
  },
  {
    title: 'Masakin — Bilingual Property Portal',
    client: 'مساكن · Real Estate, Dubai',
    category: 'Data Analytics',
    desc: 'Arabic-first property listing platform with full RTL design, map-based search, and a lead-scoring dashboard that tells agents which enquiries to call first.',
    tags: ['Next.js', 'Arabic RTL', 'Lead Scoring'],
    accent: '#38BDF8',
    image: '/projects/masakin.jpg',
    stat: '2.5K',
    statLabel: 'monthly qualified leads',
  },
  {
    title: 'KidiVerse — Kids-Safe Streaming',
    client: 'KidiVerse · EdTech Platform',
    category: 'Cybersecurity',
    desc: 'Built the trust layer for a children\'s streaming platform: parental controls, screen-time limits, and a human-plus-automated content review pipeline.',
    tags: ['Parental Controls', 'Content Moderation', 'CDN'],
    accent: '#F87171',
    image: '/projects/kidiverse.jpg',
    stat: '100%',
    statLabel: 'curated-safe library',
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
      className={`group relative overflow-hidden rounded-2xl ${featured ? 'min-h-[420px] h-full' : 'min-h-[280px] flex-1'}`}
    >
      {/* work that is actually live is openable from the tile */}
      {'href' in project && project.href && (
        <a
          href={project.href as string}
          className="absolute inset-0 z-30"
          aria-label={`Open ${project.title}`}
        />
      )}
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
            className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md"
            style={{ background: 'rgba(8,14,20,0.62)', color: '#FFFFFF', border: `1px solid ${project.accent}80` }}
          >
            {project.category}
          </span>

          {/* Stat — appears on hover (always visible on touch devices) */}
          <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 text-right [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0">
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

          {/* Description + tags slide in on hover (expanded on touch devices) */}
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 [@media(hover:none)]:grid-rows-[1fr]">
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
          <h2 className="text-4xl md:text-6xl font-black mt-3 overflow-hidden">
            {[{ text: 'Projects', gradient: false }, { text: 'Achieved', gradient: true }].map((w, i) => (
              <motion.span
                key={w.text}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.13, ease: [0.32, 0.72, 0, 1] }}
                className={w.gradient ? 'gradient-text' : ''}
                style={!w.gradient ? { color: 'var(--text)', display: 'inline-block', marginRight: '0.25em' } : { display: 'inline-block' }}
              >
                {w.text}
              </motion.span>
            ))}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-text-muted text-lg max-w-2xl mx-auto"
          >
            Launches and transformations we've delivered side-by-side with founders and growing businesses across the UAE and the Gulf.
          </motion.p>
        </div>

        {/* Row 1: featured (2 cols) + 2 stacked (1 col) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="md:col-span-2 h-full">
            <ProjectCard project={projects[0]} index={0} featured />
          </div>
          <div className="flex flex-col gap-5 h-full">
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
            onClick={() => (document.querySelector('#contact') ? document.querySelector('#contact')!.scrollIntoView({ behavior: 'smooth' }) : window.location.assign('/#contact'))}
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
