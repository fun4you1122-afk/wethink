'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Logo from './Logo'

const footerLinks = {
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Services', href: '/services' },
    { label: 'Our Work', href: '/work' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/#contact' },
  ],
  Services: [
    { label: 'Digital Transformation', href: '/services' },
    { label: 'Cloud Services', href: '/services' },
    { label: 'Cybersecurity', href: '/services' },
    { label: 'Data Analytics', href: '/services' },
    { label: 'Custom Software', href: '/services' },
    { label: 'IT Consulting', href: '/services' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
}

const socials = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/wethink.ae/',
    icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="currentColor" />,
  },
  {
    name: 'LinkedIn — Rasha Aljalam',
    href: 'https://www.linkedin.com/in/rasha-aljalam-74a6b4188/',
    icon: <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="currentColor" />,
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/971503125078',
    icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor" />,
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/wethink.ae',
    icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor" />,
  },
]

export default function Footer() {
  const goToContact = () => {
    const el = document.querySelector('#contact')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.assign('/#contact')
    }
  }

  return (
    <footer className="relative overflow-hidden border-t border-violet-500/20" style={{ background: 'var(--surface-2)' }}>
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

      {/* Background orb */}
      <div className="orb w-[600px] h-[600px] bg-violet-200 opacity-40 bottom-[-300px] left-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/">
              <Logo size="md" />
            </Link>
            <p className="mt-5 text-text-muted text-sm leading-relaxed max-w-xs">
              Transforming ideas into impactful realities through digital innovation, strategic consulting,
              and world-class IT solutions — from Abu Dhabi to the world.
            </p>

            {/* Social row */}
            <div className="flex items-center gap-3 mt-6">
              {socials.map((s) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  whileHover={{ y: -2, color: '#A78BFA' }}
                  transition={{ duration: 0.2 }}
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-text-muted hover:text-violet-400 transition-colors"
                  title={s.name}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4">{s.icon}</svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-semibold text-sm mb-5 uppercase tracking-wider" style={{ color: 'var(--text)' }}>{group}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href === '#' ? (
                      <span className="text-text-muted/50 text-sm cursor-default">{link.label}</span>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-text-muted text-sm hover:text-violet-400 transition-colors text-left"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-5"
        >
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Ready to transform your business?</p>
            <p className="text-text-muted text-sm">Let&apos;s start the conversation today.</p>
          </div>
          <button
            onClick={goToContact}
            className="btn-primary flex-shrink-0"
          >
            Get Started
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-violet-500/10 pt-8">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} WeThink Information Technology Consulting. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Pixel, Al Reem Island, Abu Dhabi, UAE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
