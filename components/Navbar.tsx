'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Our Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  // The home page opens on a black studio, so the bar has to invert while it
  // is over it and return to normal once the glass panel appears on scroll.
  // The home hero is pale again, so the bar keeps its normal colours there.
  const overDarkHero = false

  useEffect(() => {
    let last = 0
    const handleScroll = () => {
      const y = window.scrollY
      const heroHeight = window.innerHeight
      setScrolled(y > 40)
      // Only hide after user has scrolled past the hero section
      if (y > heroHeight) {
        setHidden(y > last)
      } else {
        setHidden(false)
      }
      last = y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the mobile menu after navigating to a new tab
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const goToContact = () => {
    setMenuOpen(false)
    const el = document.querySelector('#contact')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.assign('/#contact')
    }
  }

  return (
    <>
      {/* Floating pill navbar */}
      <div className="fixed top-0 left-0 right-0 z-[1002] flex justify-center px-4 pt-4 pointer-events-none">
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: hidden ? -80 : 0, opacity: hidden ? 0 : 1 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="w-full max-w-5xl pointer-events-auto"
        >
          <div className={`flex items-center justify-between px-5 transition-all duration-500 ${
            scrolled
              ? 'rounded-2xl glass py-3 shadow-xl shadow-teal-900/10'
              : 'rounded-2xl py-4 bg-transparent'
          }`}>
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Logo size="sm" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-300"
                    style={{
                      color: overDarkHero
                        ? isActive
                          ? '#ffffff'
                          : 'rgba(255,255,255,0.62)'
                        : isActive
                          ? '#7C3AED'
                          : 'var(--text-muted)',
                      background: isActive
                        ? overDarkHero
                          ? 'rgba(255,255,255,0.10)'
                          : 'rgba(124,58,237,0.1)'
                        : 'transparent',
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${overDarkHero ? 'bg-white' : 'bg-violet-600'}`}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={goToContact}
                className={`group text-sm ${
                  overDarkHero
                    ? 'inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 font-semibold text-black transition-transform hover:scale-[1.03]'
                    : 'btn-primary px-5 py-2'
                }`}
              >
                Get Started
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Mobile menu button — morphs to X */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden relative w-8 h-8 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 0 : -5 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="absolute block w-5 h-px bg-slate-800 origin-center"
              />
              <motion.span
                animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="absolute block w-5 h-px bg-slate-800 origin-center"
              />
              <motion.span
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? 0 : 5 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="absolute block w-5 h-px bg-slate-800 origin-center"
              />
            </button>
          </div>
        </motion.header>
      </div>

      {/* Mobile menu — full-screen glass overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[1001] flex flex-col items-center justify-center gap-6"
            style={{ background: 'rgba(246,250,249,0.95)', backdropFilter: 'blur(24px)' }}
          >
            {navLinks.map((link, i) => (
              <div key={link.href} style={{ overflow: 'hidden' }}>
                <motion.div
                  initial={{ y: 48, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 48, opacity: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.32, 0.72, 0, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl font-bold hover:text-violet-400 transition-colors duration-300"
                    style={{ color: pathname === link.href ? '#7C3AED' : 'var(--text)' }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              </div>
            ))}
            <div style={{ overflow: 'hidden' }}>
              <motion.button
                initial={{ y: 48, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 48, opacity: 0 }}
                transition={{ duration: 0.4, delay: navLinks.length * 0.06, ease: [0.32, 0.72, 0, 1] }}
                onClick={goToContact}
                className="btn-primary mt-4"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
