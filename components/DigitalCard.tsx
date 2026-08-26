'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'

const SERIF   = "'Playfair Display', Georgia, serif"
const SERIF_B = "'Playfair Display', Georgia, serif"
const BODY    = "'Lora', Georgia, serif"

export type CardTheme = {
  /** page ground */
  bg: string
  /** raised panels: the QR sheet */
  surface: string
  /** the canvas banner's ground */
  banner: string
  /** the five node colours drifting in the banner */
  bannerNodes: string[]
  /** the brand colour: buttons, rings, accents */
  primary: string
  /** the darker end of the button gradient */
  primaryDeep: string
  /** what sits on top of primary — must survive the contrast check */
  primaryFg: string
  /** primary as "r,g,b" so it can be used inside rgba() */
  primaryRgb: string
  /** the lighter tint used for link text and hover states */
  accentSoft: string
  /** secondary copy */
  mutedFg: string
}

/** the original card's palette, so anything not passing a theme is unchanged */
export const VIOLET_THEME: CardTheme = {
  bg: '#06010F',
  surface: '#0D0820',
  banner: '#04010C',
  bannerNodes: ['#00C9A7', '#3B8BFF', '#8B30D4', '#C026D3', '#00B4D8'],
  primary: '#7C3AED',
  primaryDeep: '#5B21B6',
  primaryFg: '#ffffff',
  primaryRgb: '124,58,237',
  accentSoft: '#C4B5FD',
  mutedFg: 'rgba(255,255,255,0.38)',
}

export type CardPerson = {
  name: string
  role: string
  company: string
  tagline: string
  email: string
  phone: string
  phoneDisplay: string
  website: string
  websiteDisplay: string
  instagram: string
  linkedinHref: string
  whatsapp: string
  location: string
  /** the card's own address, used by the QR and the share sheet */
  cardUrl: string
  cardUrlDisplay: string
  /** filename for the saved contact */
  vcardFile: string
  /** a portrait for the frame; without one the WeThink mark is used */
  photo?: string
  /** optional palette; omit for the original violet */
  theme?: CardTheme
}


/* ── Animated AI neural-network banner (canvas) ── */
function AIBanner({ T }: { T: CardTheme }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx    = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height
    const COLS = T.bannerNodes

    const nodes = Array.from({ length: 28 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 2.2 + 1.4,
      color: COLS[Math.floor(Math.random() * COLS.length)],
      phase: Math.random() * Math.PI * 2,
    }))

    let raf: number
    const tick = () => {
      // Dark bg
      ctx.fillStyle = T.banner
      ctx.fillRect(0, 0, W, H)

      // Subtle grid
      ctx.strokeStyle = 'rgba(80,100,255,0.07)'
      ctx.lineWidth = 0.5
      for (let x = 0; x <= W; x += 28) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke() }
      for (let y = 0; y <= H; y += 28) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke() }

      // Gradient wash
      const wash = ctx.createLinearGradient(0, 0, W, H)
      wash.addColorStop(0,   'rgba(0,201,167,0.07)')
      wash.addColorStop(0.5, 'rgba(59,139,255,0.05)')
      wash.addColorStop(1,   'rgba(192,38,211,0.08)')
      ctx.fillStyle = wash; ctx.fillRect(0, 0, W, H)

      // Update
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy; n.phase += 0.035
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
      }

      // Edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const d  = Math.sqrt(dx*dx + dy*dy)
          if (d < 110) {
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = nodes[i].color
            ctx.globalAlpha = (1 - d / 110) * 0.35
            ctx.lineWidth = 0.7; ctx.stroke()
          }
        }
      }

      // Nodes with glow
      for (const n of nodes) {
        const pr = n.r + Math.sin(n.phase) * 0.8
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pr * 6)
        glow.addColorStop(0, n.color + '55'); glow.addColorStop(1, 'transparent')
        ctx.globalAlpha = 0.5; ctx.fillStyle = glow
        ctx.beginPath(); ctx.arc(n.x, n.y, pr * 6, 0, Math.PI * 2); ctx.fill()
        ctx.globalAlpha = 0.95; ctx.fillStyle = n.color
        ctx.beginPath(); ctx.arc(n.x, n.y, pr, 0, Math.PI * 2); ctx.fill()
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas ref={ref} width={480} height={110}
      style={{ width: '100%', height: '100%', display: 'block' }} />
  )
}

/* ── Save .vcf contact ── */
function saveContact(INFO: CardPerson) {
  const vcf = [
    'BEGIN:VCARD', 'VERSION:3.0',
    `FN:${INFO.name}`, `ORG:${INFO.company}`,
    `TEL;TYPE=CELL:${INFO.phone}`, `EMAIL:${INFO.email}`, `URL:${INFO.website}`,
    `ADR:;;${INFO.location}`,
    `TITLE:${INFO.role}`,
    'END:VCARD',
  ].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([vcf], { type: 'text/vcard' }))
  a.download = INFO.vcardFile; a.click()
}

/* ── Share ── */
async function shareCard(INFO: CardPerson, setCopied: (v: boolean) => void) {
  const url = INFO.cardUrl
  if (navigator.share) { try { await navigator.share({ title: `${INFO.name} — ${INFO.company}`, url }) } catch {} }
  else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) }
}

/* ── Icon button ── */
function IconBtn({ icon, label, href, onClick, delay = 0, T }: {
  icon: React.ReactNode; label: string; href?: string; onClick?: () => void; delay?: number; T: CardTheme
}) {
  const wrap: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    textDecoration: 'none', background: 'none', border: 'none', padding: 0, cursor: 'pointer',
  }
  const circle = (
    <>
      {/* Outer pulse ring */}
      <div style={{ position: 'relative', width: 44, height: 44 }}>
        <motion.div
          animate={{ scale: [1, 1.45, 1], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `1.5px solid rgba(${T.primaryRgb},0.6)`,
            pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ boxShadow: [
            `0 0 0px rgba(${T.primaryRgb},0)`,
            `0 0 14px rgba(${T.primaryRgb},0.55)`,
            `0 0 0px rgba(${T.primaryRgb},0)`,
          ]}}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay }}
          whileTap={{ scale: 0.78, rotate: 10, transition: { type: 'spring', stiffness: 400, damping: 12 } }}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.accentSoft, fontSize: 17,
          }}
        >{icon}</motion.div>
      </div>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: BODY, letterSpacing: '0.02em' }}>{label}</span>
    </>
  )
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" style={wrap}>{circle}</a>
    : <button style={wrap} onClick={onClick}>{circle}</button>
}

/* ── Social button ── */
function SocialBtn({ href, color, icon, delay = 0 }: { href: string; color: string; icon: React.ReactNode; delay?: number }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div style={{ position: 'relative' }}>
        {/* Ripple ring */}
        <motion.div
          animate={{ scale: [1, 1.55, 1], opacity: [0.45, 0, 0.45] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `1.5px solid ${color}`,
            pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay }}
          whileTap={{ scale: 0.78, rotate: -12, transition: { type: 'spring', stiffness: 400, damping: 12 } }}
          style={{
            width: 44, height: 44, borderRadius: '50%', background: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 19,
            boxShadow: `0 4px 18px ${color}66`,
          }}
        >{icon}</motion.div>
      </div>
    </a>
  )
}

/* ── Action link ── */
const makeArrowVariants = (T: CardTheme) => ({
  rest: { x: 0, y: 0, opacity: 0.5, color: `rgba(${T.primaryRgb},0.55)`, scale: 1 },
  hover: { x: 4, y: -4, opacity: 1, color: T.accentSoft, scale: 1.2,
    transition: { type: 'spring' as const, stiffness: 400, damping: 18 } },
  tap: { x: 2, y: -2, scale: 0.95 },
})

function ActionLink({ icon, label, href, onClick, T }: { icon: React.ReactNode; label: string; href?: string; onClick?: () => void; T: CardTheme }) {
  const arrowVariants = makeArrowVariants(T)
  const inner = (
    <motion.div
      initial="rest" whileHover="hover" whileTap="tap"
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
        borderRadius: 12, background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', textDecoration: 'none' }}
    >
      <span style={{ fontSize: 19, width: 26, textAlign: 'center' }}>{icon}</span>
      <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 500, fontSize: 14,
        flex: 1, fontFamily: BODY }}>{label}</span>
      <motion.span variants={arrowVariants} style={{ fontSize: 16, display: 'inline-block' }}>↗</motion.span>
    </motion.div>
  )
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{inner}</a>
    : <div onClick={onClick} style={{ cursor: 'pointer' }}>{inner}</div>
}

/* ── QR Modal ── */
function QRModal({ onClose, INFO, T }: { onClose: () => void; INFO: CardPerson; T: CardTheme }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100,
        background: T.bg + 'ee', backdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <motion.div initial={{ scale: 0.88, y: 20 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: T.surface, borderRadius: 24, padding: 32,
          border: `1px solid rgba(${T.primaryRgb},0.3)`, boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
      >
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0,
          letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: BODY }}>Scan to open card</p>
        <div style={{ padding: 14, background: '#fff', borderRadius: 16 }}>
          <QRCodeSVG value={INFO.cardUrl} size={180} bgColor="#fff" fgColor="#04010c" level="M" />
        </div>
        <p style={{ color: T.primary, fontWeight: 700, fontSize: 15, margin: 0, fontFamily: SERIF }}>{INFO.cardUrlDisplay}</p>
        <button onClick={onClose} style={{ padding: '10px 28px', borderRadius: 50, border: 'none',
          background: `rgba(${T.primaryRgb},0.15)`, color: T.primary,
          fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: BODY }}>Close</button>
      </motion.div>
    </motion.div>
  )
}

/* ══════════════ PAGE ══════════════ */
export default function DigitalCard({ INFO }: { INFO: CardPerson }) {
  const T = INFO.theme ?? VIOLET_THEME
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR]  = useState(false)

  return (
    <div style={{ minHeight: '100dvh', background: T.bg,
      fontFamily: BODY, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* ── AI Banner ── */}
        <div style={{ position: 'relative', height: 110, overflow: 'hidden' }}>
          <AIBanner T={T} />

          {/* Company name overlay on banner */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 4, pointerEvents: 'none' }}>
            <span style={{
              fontFamily: SERIF_B, fontWeight: 800, fontSize: 22,
              color: '#fff', letterSpacing: '0.04em',
              textShadow: '0 0 30px rgba(59,139,255,0.6), 0 2px 12px rgba(0,0,0,0.8)',
            }}>WeThink</span>
            <span style={{
              fontFamily: BODY, fontStyle: 'italic', fontSize: 11,
              color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em',
            }}>Digital Smart Solutions</span>
          </div>
        </div>

        {/* ── Profile ── */}
        <div style={{ padding: '0 20px 10px' }}>

          {/* Avatar row */}
          <div style={{ marginTop: -38, marginBottom: 10, display: 'flex', alignItems: 'flex-end', gap: 12 }}>

            {/* Circular logo with badge ON the frame */}
            <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%',
                border: `4px solid ${T.bg}`, background: '#fff',
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 2px rgba(${T.primaryRgb},0.25)`,
              }}>
                {INFO.photo ? (
                  <img
                    src={INFO.photo}
                    alt={INFO.name}
                    width={100}
                    height={100}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img src="/wethink-logo.png" alt={INFO.company} width={72} height={72}
                    style={{ objectFit: 'contain' }} />
                )}
              </div>

              {/* ✓ Blue verified badge on frame — bottom-right */}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{
                  position: 'absolute', bottom: 3, right: 3,
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1D9BF0, #1A7AC7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2.5px solid ${T.bg}`,
                  boxShadow: '0 2px 10px rgba(29,155,240,0.6)',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Name & info */}
          <div style={{ marginBottom: 12 }}>
            <h1 style={{ margin: '0 0 3px', fontFamily: SERIF_B, fontWeight: 800,
              fontSize: 24, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2,
              textShadow: `0 2px 20px rgba(${T.primaryRgb},0.25)` }}>
              {INFO.name}
            </h1>
            <p style={{ margin: '0 0 3px', fontFamily: SERIF_B, fontWeight: 600,
              fontStyle: 'italic', color: T.primary, fontSize: 14 }}>
              {INFO.role}
            </p>
            <p style={{ margin: 0, fontFamily: BODY, color: T.mutedFg,
              fontSize: 12.5 }}>
              {INFO.location}
            </p>
          </div>

          {/* Quick-action icons */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 14 }}>
            <IconBtn T={T} delay={0} label="Call" href={`tel:${INFO.phone}`} icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.5 2 2 0 0 1 3.62 1.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.08a16 16 0 0 0 6.01 6.01l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            } />
            <IconBtn T={T} delay={0.6} label="Email" href={`mailto:${INFO.email}`} icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            } />
            <IconBtn T={T} delay={1.2} label="Website" href={INFO.website} icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>
              </svg>
            } />
            <IconBtn T={T} delay={1.8} label="Share" onClick={() => shareCard(INFO, setCopied)} icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>
              </svg>
            } />
          </div>

          {/* Save / QR buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => saveContact(INFO)}
              style={{ flex: 1, height: 42, borderRadius: 50,
                background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDeep})`,
                // primaryFg, not white: on a gold button white is 1.93:1
                border: 'none', cursor: 'pointer', color: T.primaryFg,
                fontWeight: 700, fontSize: 13.5, fontFamily: SERIF_B,
                boxShadow: `0 6px 20px rgba(${T.primaryRgb},0.35)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Save Contact
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowQR(true)}
              style={{ flex: 1, height: 42, borderRadius: 50,
                background: 'transparent', border: `1.5px solid rgba(${T.primaryRgb},0.45)`,
                cursor: 'pointer', color: T.primary,
                fontWeight: 700, fontSize: 13.5, fontFamily: SERIF_B,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3m0 4h4v-4m-4 0h-3"/>
              </svg>
              My QR Code
            </motion.button>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 12 }} />

          {/* Socials */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 12 }}>
            <SocialBtn href={INFO.instagram} color="#E1306C" delay={0} icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            } />
            <SocialBtn href={INFO.linkedinHref} color="#0077B5" delay={0.7} icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            } />
            <SocialBtn href={INFO.whatsapp} color="#25D366" delay={1.4} icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            } />
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 10 }} />

          {/* Action links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 10 }}>
            <ActionLink T={T} href="https://www.wethink.ae/services" label="Our Services" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            } />
            <ActionLink T={T} href="https://www.wethink.ae/work" label="Our Projects" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="6" height="6" rx="1"/><rect x="16" y="3" width="6" height="6" rx="1"/>
                <rect x="2" y="15" width="6" height="6" rx="1"/><rect x="16" y="15" width="6" height="6" rx="1"/>
                <path d="M8 6h8M6 8v7M18 8v7M8 18h8"/>
              </svg>
            } />
            <ActionLink T={T} href="https://www.wethink.ae/about" label="About WeThink" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            } />
            <ActionLink T={T} href="https://www.wethink.ae/#contact" label="Get a Free Quote" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            } />
          </div>

          <div style={{ textAlign: 'center', paddingBottom: 8 }}>
            <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11, margin: 0,
              fontFamily: BODY, letterSpacing: '0.05em', fontStyle: 'italic' }}>
              {INFO.cardUrlDisplay}
            </p>
          </div>
        </div>
      </div>

      {showQR && <QRModal INFO={INFO} T={T} onClose={() => setShowQR(false)} />}

      {copied && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
            background: T.primary, color: T.primaryFg, fontWeight: 700, fontSize: 13,
            padding: '10px 24px', borderRadius: 50, fontFamily: SERIF_B,
            boxShadow: `0 8px 24px rgba(${T.primaryRgb},0.4)`, zIndex: 200 }}>
          ✓ Link copied!
        </motion.div>
      )}
    </div>
  )
}
