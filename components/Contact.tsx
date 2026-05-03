'use client'

import { useRef, useState, FormEvent } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const contactInfo = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Email',
    value: 'info@wethink.ae',
    href: 'mailto:info@wethink.ae',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Phone',
    value: '+971 50 312 5078',
    href: 'tel:+971503125078',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Location',
    value: 'Pixel, Al Reem Island, Abu Dhabi, UAE',
    href: 'https://maps.google.com/?q=Al+Reem+Island+Abu+Dhabi',
  },
]

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate async submission
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  const services = [
    'Digital Transformation',
    'Strategic Consulting',
    'IT Solutions',
    'Project Management',
    'Cloud Services',
    'Cybersecurity',
    'Custom Software Development',
    'Data Analytics',
  ]

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-violet-900/25 opacity-40 top-[-100px] right-[-200px] pointer-events-none" />
      <div className="orb w-[400px] h-[400px] bg-purple-900/20 opacity-30 bottom-[-150px] left-[-150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={ref} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label mx-auto">Let&apos;s Talk</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mt-3" style={{ color: 'var(--text)' } as React.CSSProperties}
          >
            Start Your{' '}
            <span className="gradient-text">Journey</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' } as React.CSSProperties}
          >
            Tell us about your challenge. We&apos;ll respond within one business day with how we can help.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="divider" />
            <h3 className="text-2xl font-bold text-gray-900">Get in Touch</h3>
            <p className="text-text-muted leading-relaxed">
              Whether you&apos;re looking to modernise your infrastructure, secure your digital assets, or build
              a transformation roadmap — WeThink is ready.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              {contactInfo.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.label === 'Location' ? '_blank' : undefined}
                  rel="noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-4 glass-card rounded-xl p-4 group transition-all hover:border-violet-500/30"
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center group-hover:bg-violet-600/30 transition-colors">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="text-gray-900 text-sm font-medium">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social */}
            <div className="mt-4">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { name: 'WhatsApp', href: 'https://wa.me/971503128823', icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor" /> },
                  { name: 'Instagram', href: 'https://www.instagram.com/wethink.ae/', icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="currentColor" /> },
                  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/rasha-aljalam/', icon: <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="currentColor" /> },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 glass rounded-xl flex items-center justify-center text-text-muted hover:text-violet-400 transition-colors"
                    title={s.name}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4">{s.icon}</svg>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
              {/* Top gradient border */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-violet-600/20 border border-violet-500/40 flex items-center justify-center mb-6"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-violet-400">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent!</h3>
                    <p className="text-text-muted max-w-sm">
                      Thank you for reaching out. A member of the WeThink team will be in touch within one business day.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', message: '' }) }}
                      className="btn-outline mt-8 text-sm"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                  >
                    {/* Row 1 */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wider">
                          Full Name *
                        </label>
                        <motion.input
                          animate={{ borderColor: focused === 'name' ? 'rgba(139, 92, 246, 0.6)' : 'rgba(167, 139, 250, 0.15)' }}
                          type="text"
                          required
                          placeholder="Your full name"
                          value={form.name}
                          onFocus={() => setFocused('name')}
                          onBlur={() => setFocused(null)}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wider">
                          Email Address *
                        </label>
                        <motion.input
                          animate={{ borderColor: focused === 'email' ? 'rgba(139, 92, 246, 0.6)' : 'rgba(167, 139, 250, 0.15)' }}
                          type="email"
                          required
                          placeholder="you@company.com"
                          value={form.email}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused(null)}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="input-field"
                        />
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wider">
                          Phone Number
                        </label>
                        <motion.input
                          animate={{ borderColor: focused === 'phone' ? 'rgba(139, 92, 246, 0.6)' : 'rgba(167, 139, 250, 0.15)' }}
                          type="tel"
                          placeholder="+971 50 000 0000"
                          value={form.phone}
                          onFocus={() => setFocused('phone')}
                          onBlur={() => setFocused(null)}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wider">
                          Service of Interest
                        </label>
                        <select
                          value={form.service}
                          onFocus={() => setFocused('service')}
                          onBlur={() => setFocused(null)}
                          onChange={(e) => setForm({ ...form, service: e.target.value })}
                          className="input-field appearance-none"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2rem', paddingRight: '2.5rem' }}
                        >
                          <option value="">Select a service...</option>
                          {services.map((s) => (
                            <option key={s} value={s} style={{ background: '#F8F7FF' }}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wider">
                        Your Message *
                      </label>
                      <motion.textarea
                        animate={{ borderColor: focused === 'message' ? 'rgba(139, 92, 246, 0.6)' : 'rgba(167, 139, 250, 0.15)' }}
                        required
                        rows={5}
                        placeholder="Describe your project, challenge, or question..."
                        value={form.message}
                        onFocus={() => setFocused('message')}
                        onBlur={() => setFocused(null)}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="input-field resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      className="btn-primary w-full justify-center text-base py-4"
                      style={{ opacity: loading ? 0.85 : 1 }}
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 9l12-6-6 12-2-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
