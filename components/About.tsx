'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const values = [
  {
    title: 'Innovation First',
    desc: 'We embrace emerging technologies and methodologies to deliver solutions that keep you ahead of the curve.',
  },
  {
    title: 'Client Partnership',
    desc: 'We embed ourselves as strategic partners — not vendors — deeply invested in your long-term success.',
  },
  {
    title: 'Delivery Excellence',
    desc: 'Every commitment we make is backed by rigorous project governance and measurable outcomes.',
  },
  {
    title: 'Integrity Always',
    desc: 'Transparent communication and honest guidance form the foundation of every client relationship.',
  },
]

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headingRef, { once: true, margin: '-80px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section id="about" ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Parallax background blob */}
      <motion.div
        style={{ y: bgY }}
        className="absolute pointer-events-none"
      >
        <div className="orb w-[700px] h-[700px] bg-violet-900 opacity-15 top-[-200px] left-[-300px]" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label mx-auto">Our Story</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mt-3"
          >
            Who We <span className="gradient-text">Are</span>
          </motion.h2>
        </div>

        {/* Split layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — story */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="divider" />

            <p className="text-lg text-text-muted leading-relaxed mb-6">
              Founded in <span className="text-accent font-semibold">2019</span> in Abu Dhabi, WeThink was built
              on a simple conviction: businesses deserve technology partners who truly understand both the
              strategic and the technical dimensions of digital change.
            </p>

            <p className="text-lg text-text-muted leading-relaxed mb-6">
              From our base at <span className="text-white font-medium">Pixel, Al Reem Island</span>, we have
              partnered with organisations across the UAE and the broader Gulf region — from government entities
              and financial institutions to fast-growing startups — delivering tailored solutions that create
              measurable, lasting impact.
            </p>

            <p className="text-lg text-text-muted leading-relaxed mb-10">
              We don&apos;t believe in one-size-fits-all technology. We believe in asking the right questions,
              listening deeply, and engineering solutions that fit your reality — not someone else&apos;s template.
            </p>

            {/* Values grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass-card rounded-xl p-5"
                >
                  <div className="w-2 h-2 rounded-full bg-violet-400 mb-3" />
                  <h4 className="text-white font-semibold mb-1 text-sm">{v.title}</h4>
                  <p className="text-text-muted text-xs leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — CEO card + decorative */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center gap-8"
          >
            {/* Decorative ring */}
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-20px] border border-violet-500/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-40px] border border-violet-400/10 rounded-full"
              />

              {/* CEO Avatar */}
              <div className="relative w-56 h-56 rounded-full overflow-hidden glow-purple">
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #5B21B6 100%)',
                  }}
                >
                  {/* Abstract portrait */}
                  <svg viewBox="0 0 120 120" fill="none" className="w-36 h-36">
                    <circle cx="60" cy="45" r="20" fill="rgba(255,255,255,0.2)" />
                    <path
                      d="M20 110 Q20 75 60 75 Q100 75 100 110"
                      fill="rgba(255,255,255,0.15)"
                    />
                    <circle cx="60" cy="45" r="20" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
                    <circle cx="60" cy="45" r="10" fill="rgba(255,255,255,0.25)" />
                    <text
                      x="60"
                      y="50"
                      textAnchor="middle"
                      fill="white"
                      fontSize="14"
                      fontFamily="Inter, sans-serif"
                      fontWeight="700"
                    >
                      RJ
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            {/* CEO info card */}
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(124, 58, 237, 0.25)' }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-2xl p-8 text-center max-w-sm w-full"
            >
              <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-accent rounded-full mx-auto mb-5" />

              <h3 className="text-2xl font-bold text-white mb-1">Rasha Aljalam</h3>
              <p className="text-violet-400 font-semibold text-sm tracking-wide uppercase mb-4">
                Chief Executive Officer
              </p>

              <p className="text-text-muted text-sm leading-relaxed mb-6">
                A seasoned technology strategist and digital transformation leader, Rasha founded WeThink with
                a vision to make world-class IT consulting accessible to businesses across the UAE and the
                wider MENA region.
              </p>

              {/* Social links */}
              <div className="flex items-center justify-center gap-3">
                {[
                  {
                    label: 'LinkedIn',
                    href: 'https://www.linkedin.com/in/rasha-aljalam/',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Instagram',
                    href: 'https://www.instagram.com/wethink.ae/',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'WhatsApp',
                    href: 'https://wa.me/971503128823',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    ),
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full glass flex items-center justify-center text-text-muted hover:text-violet-400 transition-colors"
                    title={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm text-text-muted"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-violet-400">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>Pixel, Al Reem Island, Abu Dhabi, UAE</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
