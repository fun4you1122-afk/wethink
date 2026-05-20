'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'

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
    desc: 'Designed and deployed a real-time BI platform aggregating POS, inventory, and customer loyalty data across 80+ stores, enabling same-day executive decisions.',
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

function SplitWords({ text, inView, delay = 0 }: { text: string; inView: boolean; delay?: number }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={inView ? { y: 0 } : { y: '110%' }}
            transition={{ duration: 0.6, delay: delay + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </>
  )
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl flex-shrink-0"
      style={{ width: 'clamp(300px, 36vw, 440px)', minHeight: '460px' }}
    >
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-black/10" />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${project.accent}30 0%, rgba(0,0,0,0.55) 100%)` }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: `linear-gradient(90deg, ${project.accent}, transparent)` }}
      />

      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm"
            style={{ background: `${project.accent}25`, color: project.accent, border: `1px solid ${project.accent}40` }}
          >
            {project.category}
          </span>
          <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 text-right">
            <div className="text-2xl font-black text-white leading-none">{project.stat}</div>
            <div className="text-[10px] text-white/60 mt-0.5">{project.statLabel}</div>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium mb-1.5" style={{ color: project.accent }}>{project.client}</p>
          <h3 className="text-white font-bold text-lg leading-snug">{project.title}</h3>
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500">
            <div className="overflow-hidden">
              <p className="text-white/75 text-sm leading-relaxed pt-2 pb-3">{project.desc}</p>
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

function HorizontalFilmstrip() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const [xEnd, setXEnd] = useState(-800)
  const inView = useInView(headingRef, { once: true })

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        const extra = 64
        setXEnd(-(trackRef.current.scrollWidth - window.innerWidth + extra))
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const rawX = useTransform(scrollYProgress, [0, 1], [48, xEnd])
  const x = useSpring(rawX, { stiffness: 55, damping: 22, restDelta: 0.001 })

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={containerRef} style={{ height: '350vh' }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div ref={headingRef} className="flex-shrink-0 pt-20 pb-6 px-12 flex items-end justify-between">
          <div>
            <span className="section-label">Our Work</span>
            <h2
              className="text-5xl font-black mt-2 leading-tight"
              style={{ color: 'var(--text)' }}
              aria-label="Projects Achieved"
            >
              <SplitWords text="Projects" inView={inView} />
              {' '}
              <span className="gradient-text">
                <SplitWords text="Achieved" inView={inView} delay={0.3} />
              </span>
            </h2>
          </div>
          <p className="text-sm max-w-xs text-right hidden xl:block" style={{ color: 'var(--text-muted)' }}>
            Transformative engagements across government, finance, education & enterprise.
          </p>
        </div>

        {/* Scroll progress bar */}
        <div className="flex-shrink-0 h-[2px] mx-12 mb-6 rounded-full overflow-hidden" style={{ background: 'rgba(124,58,237,0.12)' }}>
          <motion.div className="h-full rounded-full" style={{ width: progressWidth, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)' }} />
        </div>

        {/* Scrolling track */}
        <div className="flex-1 flex items-center overflow-visible">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-6 pl-12 will-change-transform"
          >
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-shrink-0 rounded-2xl flex flex-col items-center justify-center gap-6 p-10 text-center"
              style={{
                width: 'clamp(260px, 28vw, 360px)',
                minHeight: '460px',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(124,58,237,0.02))',
                border: '1px dashed rgba(124,58,237,0.25)',
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7C3AED20, #7C3AED40)', border: '1px solid rgba(124,58,237,0.25)' }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 5v18M5 14h18" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>Ready to add your project?</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Let's build something remarkable together.</p>
              </div>
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary text-sm"
              >
                Start a Project
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function MobileGrid() {
  const headingRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headingRef, { once: true, margin: '-80px' })

  return (
    <div className="section-padding">
      <div ref={headingRef} className="text-center mb-16">
        <span className="section-label mx-auto">Our Work</span>
        <h2 className="text-4xl font-black text-gray-900 mt-3">
          Projects <span className="gradient-text">Achieved</span>
        </h2>
        <p className="mt-4 text-text-muted text-base max-w-xl mx-auto">
          Transformative engagements across government, finance, education, and enterprise sectors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div className="md:col-span-2">
          <ProjectCard project={projects[0]} index={0} />
        </div>
        <div className="flex flex-col gap-5">
          <ProjectCard project={projects[1]} index={1} />
          <ProjectCard project={projects[2]} index={2} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <ProjectCard project={projects[3]} index={3} />
        <ProjectCard project={projects[4]} index={4} />
        <ProjectCard project={projects[5]} index={5} />
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="btn-primary"
        >
          Start Your Project
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3.75 9h10.5M10.5 5.25L14.25 9l-3.75 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-violet-900/20 opacity-20 top-[-100px] right-[-200px] pointer-events-none" />

      {/* Desktop: horizontal filmstrip */}
      <div className="hidden lg:block">
        <HorizontalFilmstrip />
      </div>

      {/* Mobile/tablet: grid */}
      <div className="lg:hidden">
        <MobileGrid />
      </div>
    </section>
  )
}
