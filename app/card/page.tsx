'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'

/* ── Unicode font converters ── */
function toScript(s: string) {
  // Bold Script: 𝓐–𝓩 / 𝓪–𝔃
  return s.split('').map(c => {
    const u = c.charCodeAt(0)
    if (u >= 65 && u <= 90) return String.fromCodePoint(0x1D4D0 + u - 65)
    if (u >= 97 && u <= 122) return String.fromCodePoint(0x1D4EA + u - 97)
    return c
  }).join('')
}

function toFraktur(s: string) {
  // Fraktur: 𝔄–𝔜 / 𝔞–𝔷  (a few letters use reserved codepoints)
  const su: Record<string,number> = { C:0x212D, H:0x210C, I:0x2111, R:0x211C, Z:0x2128 }
  return s.split('').map(c => {
    if (su[c]) return String.fromCodePoint(su[c])
    const u = c.charCodeAt(0)
    if (u >= 65 && u <= 90) return String.fromCodePoint(0x1D504 + u - 65)
    if (u >= 97 && u <= 122) return String.fromCodePoint(0x1D51E + u - 97)
    return c
  }).join('')
}

function toMono(s: string) {
  // Monospace: 𝙰–𝚉 / 𝚊–𝚣 / 𝟶–𝟿
  return s.split('').map(c => {
    const u = c.charCodeAt(0)
    if (u >= 65 && u <= 90)  return String.fromCodePoint(0x1D670 + u - 65)
    if (u >= 97 && u <= 122) return String.fromCodePoint(0x1D68A + u - 97)
    if (u >= 48 && u <= 57)  return String.fromCodePoint(0x1D7F6 + u - 48)
    return c
  }).join('')
}

function toDoubleStruck(s: string) {
  // Double-Struck: 𝔸–𝕐 / 𝕒–𝕫  (a few letters use reserved codepoints)
  const su: Record<string,number> = { C:0x2102, H:0x210D, N:0x2115, P:0x2119, Q:0x211A, R:0x211D, Z:0x2124 }
  return s.split('').map(c => {
    if (su[c]) return String.fromCodePoint(su[c])
    const u = c.charCodeAt(0)
    if (u >= 65 && u <= 90)  return String.fromCodePoint(0x1D538 + u - 65)
    if (u >= 97 && u <= 122) return String.fromCodePoint(0x1D552 + u - 97)
    if (u >= 48 && u <= 57)  return String.fromCodePoint(0x1D7D8 + u - 48)
    return c
  }).join('')
}

const INFO = {
  name: 'Rasha Aljalam',
  company: 'WeThink',
  tagline: 'Digital Smart Solutions',
  email: 'info@wethink.ae',
  phone: '+971503125078',
  phoneDisplay: '+971 50 312 5078',
  website: 'https://www.wethink.ae',
  websiteDisplay: 'www.wethink.ae',
  instagram: 'https://instagram.com/wethink.ae',
  linkedinHref: 'https://ae.linkedin.com/in/rasha-aljalam-74a6b4188',
  whatsapp: 'https://wa.me/971503125078',
  location: 'Makers District, Abu Dhabi, UAE',
}

/* ── Download .vcf contact ── */
function saveContact() {
  const vcf = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${INFO.name}`,
    `ORG:${INFO.company}`,
    `TITLE:${INFO.tagline}`,
    `TEL;TYPE=CELL:${INFO.phone}`,
    `EMAIL:${INFO.email}`,
    `URL:${INFO.website}`,
    `ADR:;;Makers District;;Abu Dhabi;;UAE`,
    `NOTE:WeThink - Digital Smart Solutions`,
    'END:VCARD',
  ].join('\n')
  const blob = new Blob([vcf], { type: 'text/vcard' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'Rasha-Aljalam-WeThink.vcf'; a.click()
  URL.revokeObjectURL(url)
}

/* ── Share card URL ── */
async function shareCard(setCopied: (v: boolean) => void) {
  const url = 'https://www.wethink.ae/card'
  if (navigator.share) {
    try { await navigator.share({ title: 'Rasha Aljalam — WeThink', url }) } catch {}
  } else {
    await navigator.clipboard.writeText(url)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
}

/* ── Icon button ── */
function IconBtn({ icon, label, href, onClick }: { icon: React.ReactNode; label: string; href?: string; onClick?: () => void }) {
  const style: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    textDecoration: 'none', cursor: 'pointer', background: 'none', border: 'none', padding: 0,
  }
  const inner = (
    <>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: 'rgba(124,58,237,0.1)',
        border: '1px solid rgba(124,58,237,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#7C3AED', fontSize: 20,
      }}>{icon}</div>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.03em' }}>{label}</span>
    </>
  )
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" style={style}>{inner}</a>
  return <button onClick={onClick} style={style}>{inner}</button>
}

/* ── Social circle button ── */
function SocialBtn({ href, color, icon }: { href: string; color: string; icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }} style={{
        width: 50, height: 50, borderRadius: '50%',
        background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 22,
        boxShadow: `0 4px 14px ${color}55`,
      }}>{icon}</motion.div>
    </a>
  )
}

/* ── Action link row ── */
function ActionLink({ icon, label, href, onClick }: { icon: React.ReactNode; label: string; href?: string; onClick?: () => void }) {
  const inner = (
    <motion.div whileHover={{ x: 3 }} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '15px 18px', borderRadius: 14,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      textDecoration: 'none', cursor: 'pointer',
    }}>
      <span style={{ fontSize: 20, width: 26, textAlign: 'center' }}>{icon}</span>
      <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, fontSize: 14, flex: 1 }}>{label}</span>
      <span style={{ color: 'rgba(124,58,237,0.6)', fontSize: 16 }}>↗</span>
    </motion.div>
  )
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{inner}</a>
  return <div onClick={onClick} style={{ cursor: 'pointer' }}>{inner}</div>
}

/* ── QR Modal ── */
function QRModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(4,2,14,0.88)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.88, y: 20 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0D0820', borderRadius: 24, padding: 32,
          border: '1px solid rgba(124,58,237,0.3)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Scan to open card</p>
        <div style={{ padding: 14, background: '#fff', borderRadius: 16 }}>
          <QRCodeSVG value="https://www.wethink.ae/card" size={180} bgColor="#fff" fgColor="#04020e" level="M" />
        </div>
        <p style={{ color: '#7C3AED', fontWeight: 700, fontSize: 14, margin: 0 }}>wethink.ae/card</p>
        <button onClick={onClose} style={{
          padding: '10px 28px', borderRadius: 50, border: 'none',
          background: 'rgba(124,58,237,0.15)', color: '#A78BFA',
          fontWeight: 600, fontSize: 13, cursor: 'pointer',
        }}>Close</button>
      </motion.div>
    </motion.div>
  )
}

/* ══════════════ MAIN PAGE ══════════════ */
export default function CardPage() {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#07040F',
      fontFamily: "'Inter', -apple-system, sans-serif",
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* ── Header banner ── */}
        <div style={{ position: 'relative', height: 180 }}>
          {/* Gradient banner */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #00C9A7 0%, #3B5BFF 45%, #8B30D4 80%, #C026D3 100%)',
          }} />
          {/* Subtle mesh overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)',
          }} />
          {/* Company name on banner */}
          <div style={{
            position: 'absolute', top: 22, left: 0, right: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            {/* Double-Struck for the brand name on the banner */}
            <span style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 800, fontSize: 22, textShadow: '0 1px 10px rgba(0,0,0,0.3)', letterSpacing: '0.02em' }}>
              {toDoubleStruck('WeThink')}
            </span>
            {/* Monospace for the tagline */}
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, letterSpacing: '0.04em' }}>
              {toMono('Digital Smart Solutions')}
            </span>
          </div>
        </div>

        {/* ── Profile section ── */}
        <div style={{ padding: '0 24px 28px', position: 'relative' }}>

          {/* Circular logo — overlaps banner */}
          <div style={{ marginTop: -52, marginBottom: 14, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              border: '4px solid #07040F',
              background: '#fff',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              flexShrink: 0,
            }}>
              <img src="/wethink-logo.png" alt="WeThink" width={72} height={72} style={{ objectFit: 'contain' }} />
            </div>
            {/* Verified badge area */}
            <div style={{ paddingBottom: 10 }}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3B5BFF, #8B30D4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(124,58,237,0.5)',
                  border: '2px solid #07040F',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Name + info */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              {/* Script / cursive for the person's name */}
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '0.01em', lineHeight: 1.2 }}>
                {toScript(INFO.name)}
              </h1>
            </div>
            {/* Fraktur / gothic for the company label */}
            <p style={{ margin: '0 0 3px', color: 'rgba(167,139,250,0.85)', fontSize: 15, fontWeight: 500, letterSpacing: '0.02em' }}>
              {toFraktur(INFO.company)}
            </p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: 12.5 }}>
              {INFO.location}
            </p>
          </div>

          {/* ── Quick-action icon row ── */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 22 }}>
            <IconBtn icon="📞" label="Call" href={`tel:${INFO.phone}`} />
            <IconBtn icon="✉️" label="Email" href={`mailto:${INFO.email}`} />
            <IconBtn icon="🌐" label="Website" href={INFO.website} />
            <IconBtn icon="↗" label="Share" onClick={() => shareCard(setCopied)} />
          </div>

          {/* ── Save / Exchange buttons ── */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={saveContact}
              style={{
                flex: 1, height: 46, borderRadius: 50,
                background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                border: 'none', cursor: 'pointer',
                color: '#fff', fontWeight: 700, fontSize: 13.5,
                boxShadow: '0 6px 20px rgba(124,58,237,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Save Contact
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowQR(true)}
              style={{
                flex: 1, height: 46, borderRadius: 50,
                background: 'transparent',
                border: '1.5px solid rgba(124,58,237,0.5)',
                cursor: 'pointer',
                color: '#A78BFA', fontWeight: 700, fontSize: 13.5,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                <path d="M14 14h3v3m0 4h4v-4m-4 0h-3"/>
              </svg>
              My QR Code
            </motion.button>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 22 }} />

          {/* ── Social icons ── */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 28, justifyContent: 'center' }}>
            <SocialBtn href={INFO.instagram} color="#E1306C" icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            } />
            <SocialBtn href={INFO.linkedinHref} color="#0077B5" icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            } />
            <SocialBtn href={INFO.whatsapp} color="#25D366" icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            } />
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 20 }} />

          {/* ── Action links ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            <ActionLink icon="🌐" label="Visit Website" href={INFO.website} />
            <ActionLink icon="🛠️" label="Our Services" href="https://www.wethink.ae/#services" />
            <ActionLink icon="💬" label="Book a Call" href={INFO.whatsapp} />
            <ActionLink icon="✉️" label="Send us an Email" href={`mailto:${INFO.email}`} />
          </div>

          {/* ── Footer ── */}
          <div style={{ textAlign: 'center', paddingBottom: 12 }}>
            <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, margin: 0, letterSpacing: '0.04em' }}>
              wethink.ae/card
            </p>
          </div>

        </div>
      </div>

      {/* ── QR Modal ── */}
      {showQR && <QRModal onClose={() => setShowQR(false)} />}

      {/* ── Copied toast ── */}
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
            background: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: 13,
            padding: '10px 24px', borderRadius: 50,
            boxShadow: '0 8px 24px rgba(124,58,237,0.4)', zIndex: 200,
          }}
        >
          ✓ Link copied!
        </motion.div>
      )}
    </div>
  )
}
