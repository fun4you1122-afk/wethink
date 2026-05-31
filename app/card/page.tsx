'use client'

import { useRef, useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const INFO = {
  name: 'Rasha Aljalam',
  company: 'WeThink',
  tagline: 'Digital Smart Solutions',
  email: 'info@wethink.ae',
  phone: '+971 50 312 5078',
  website: 'www.wethink.ae',
  instagram: '@wethink.ae',
  linkedinLabel: 'Rasha Aljalam',
  linkedinHref: 'https://ae.linkedin.com/in/rasha-aljalam-74a6b4188',
  location: 'Makers District, Abu Dhabi, UAE',
}

/* ─── Floating particle network ─── */
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const COLORS = ['#00C9A7', '#3B5BFF', '#8B30D4', '#C026D3', '#00A8E8']
    const pts = Array.from({ length: 52 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    let raf: number
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.globalAlpha = 0.65
        ctx.fillStyle = p.color
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 140) {
            ctx.globalAlpha = (1 - d / 140) * 0.25
            ctx.strokeStyle = pts[i].color
            ctx.lineWidth = 0.7
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
}

/* ─── 3-D tilt card ─── */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), { stiffness: 280, damping: 28 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 280, damping: 28 })
  const glareX = useTransform(mx, [-0.5, 0.5], ['20%', '80%'])
  const glareY = useTransform(my, [-0.5, 0.5], ['20%', '80%'])

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    const el = ref.current!; const rect = el.getBoundingClientRect()
    const cx = 'touches' in e ? e.touches[0].clientX : e.clientX
    const cy = 'touches' in e ? e.touches[0].clientY : e.clientY
    mx.set((cx - rect.left) / rect.width - 0.5)
    my.set((cy - rect.top)  / rect.height - 0.5)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  return (
    <motion.div ref={ref}
      onMouseMove={onMove} onMouseLeave={onLeave}
      onTouchMove={onMove} onTouchEnd={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d', position: 'relative' }}
    >
      {children}
      <motion.div
        style={{
          position: 'absolute', inset: 0, borderRadius: 26, pointerEvents: 'none', zIndex: 10,
          backgroundImage: useTransform(
            [glareX, glareY],
            ([gx, gy]) => `radial-gradient(ellipse at ${gx} ${gy}, rgba(255,255,255,0.10) 0%, rgba(120,80,255,0.04) 40%, transparent 70%)`
          ),
        }}
      />
    </motion.div>
  )
}

/* ─── Animated iridescent border ─── */
function IridescentBorder({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let angle = 0, raf: number
    const tick = () => {
      angle = (angle + 0.6) % 360
      if (ref.current) {
        ref.current.style.background =
          `conic-gradient(from ${angle}deg, #00C9A7, #3B8BFF, #8B30D4, #C026D3, #FF6BAA, #00C9A7)`
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div ref={ref} style={{ padding: 2, borderRadius: 28, position: 'relative' }}>
      {children}
    </div>
  )
}

/* ─── Contact row ─── */
function Row({ icon, label, sub, href }: { icon: string; label: string; sub?: string; href?: string }) {
  const [hov, setHov] = useState(false)
  const inner = (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '11px 14px',
        borderRadius: 14, cursor: href ? 'pointer' : 'default', textDecoration: 'none',
        transition: 'background 0.2s, box-shadow 0.2s',
        background: hov ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hov ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hov ? '0 0 18px rgba(124,58,237,0.2)' : 'none',
      }}
    >
      <span style={{ fontSize: 17, width: 24, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: hov ? '#fff' : 'rgba(255,255,255,0.75)', fontSize: 13.5, fontWeight: 500, transition: 'color 0.2s' }}>{label}</div>
        {sub && <div style={{ color: 'rgba(167,139,250,0.55)', fontSize: 11, marginTop: 1 }}>{sub}</div>}
      </div>
      {href && <span style={{ marginLeft: 'auto', color: hov ? '#A78BFA' : 'rgba(167,139,250,0.35)', fontSize: 14, transition: 'color 0.2s' }}>↗</span>}
    </div>
  )
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{inner}</a>
    : inner
}

/* ─── Main page ─── */
export default function CardPage() {
  const [copied, setCopied] = useState(false)
  const [shared, setShared]  = useState(false)

  const handleShare = async () => {
    const url = 'https://www.wethink.ae/card'
    if (navigator.share) {
      try { await navigator.share({ title: `${INFO.name} — WeThink`, url }); setShared(true); setTimeout(() => setShared(false), 2000) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    }
  }

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'radial-gradient(ellipse 140% 90% at 50% -10%, #120630 0%, #04020e 50%, #060212 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '24px 16px 44px',
      fontFamily: "'Inter', -apple-system, sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>

      <Particles />

      {/* Ambient glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,91,255,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '0%', right: '0%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,48,212,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 70%)', filter: 'blur(40px)', transform: 'translateX(-50%)' }} />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 420, perspective: 1200, zIndex: 2 }}
      >
        <TiltCard>
          <IridescentBorder>
            <div style={{
              borderRadius: 26,
              background: 'linear-gradient(160deg, rgba(14,6,35,0.97) 0%, rgba(6,2,18,0.99) 100%)',
              backdropFilter: 'blur(30px)',
              overflow: 'hidden',
            }}>

              {/* Scanline texture */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, borderRadius: 26,
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
              }} />

              <div style={{ padding: '30px 26px 26px', position: 'relative', zIndex: 2 }}>
                <motion.div variants={stagger} initial="hidden" animate="show">

                  {/* Header: logo + brand */}
                  <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ flexShrink: 0, filter: 'drop-shadow(0 0 12px rgba(59,91,255,0.4))' }}>
                      <img src="/wethink-logo.png" alt="WeThink" width={46} height={46} style={{ objectFit: 'contain', display: 'block' }} />
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: '0.01em' }}>WeThink</div>
                      <div style={{ color: 'rgba(167,139,250,0.6)', fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Digital Smart Solutions</div>
                    </div>
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C9A7', boxShadow: '0 0 8px #00C9A7' }} />
                      <span style={{ color: 'rgba(0,201,167,0.7)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Abu Dhabi</span>
                    </motion.div>
                  </motion.div>

                  {/* Divider */}
                  <motion.div variants={fadeUp} style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(139,48,212,0.5), rgba(59,91,255,0.5), transparent)', marginBottom: 24 }} />

                  {/* Name */}
                  <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
                    <h1 style={{
                      margin: 0, fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1,
                      background: 'linear-gradient(135deg, #fff 30%, #C4B5FD 60%, #A78BFA 100%)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 2px 20px rgba(167,139,250,0.3))',
                    }}>
                      {INFO.name}
                    </h1>
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        background: 'linear-gradient(90deg, #00C9A7, #3B5BFF, #8B30D4)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        fontWeight: 700, fontSize: 14,
                      }}>WeThink</span>
                      <span style={{ color: 'rgba(255,255,255,0.18)' }}>·</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Digital Smart Solutions</span>
                    </div>
                  </motion.div>

                  {/* Contact rows */}
                  <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                    <Row icon="📞" label={INFO.phone} href={`tel:${INFO.phone.replace(/\s/g,'')}`} />
                    <Row icon="✉️" label={INFO.email} href={`mailto:${INFO.email}`} />
                    <Row icon="🌐" label={INFO.website} href="https://www.wethink.ae" />
                    <Row icon="📸" label={INFO.instagram} href="https://instagram.com/wethink.ae" />
                    <Row icon="💼" label={INFO.linkedinLabel} sub="LinkedIn Profile" href={INFO.linkedinHref} />
                    <Row icon="📍" label={INFO.location} />
                  </motion.div>

                  {/* Divider */}
                  <motion.div variants={fadeUp} style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(59,91,255,0.4), transparent)', marginBottom: 22 }} />

                  {/* QR + tagline */}
                  <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    {/* QR with scanning line */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{
                        padding: 10, background: '#fff', borderRadius: 14,
                        boxShadow: '0 4px 24px rgba(139,48,212,0.35), 0 0 0 1px rgba(139,48,212,0.2)',
                      }}>
                        <QRCodeSVG value="https://www.wethink.ae" size={82} bgColor="#ffffff" fgColor="#04020e" level="M" />
                      </div>
                      {/* Scan line animation */}
                      <motion.div
                        animate={{ y: [0, 82, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          position: 'absolute', left: 10, right: 10, top: 10,
                          height: 2, background: 'linear-gradient(90deg, transparent, #00C9A7, transparent)',
                          boxShadow: '0 0 8px #00C9A7', borderRadius: 1, pointerEvents: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Scan to explore</div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>www.wethink.ae</div>
                      <div style={{ color: 'rgba(167,139,250,0.55)', fontSize: 11.5, marginTop: 6, lineHeight: 1.5 }}>
                        Transforming Ideas into<br />Impactful Realities
                      </div>
                      {/* Tiny brand dots */}
                      <div style={{ display: 'flex', gap: 5, marginTop: 10 }}>
                        {['#00C9A7', '#3B5BFF', '#8B30D4'].map((c, i) => (
                          <motion.div key={c}
                            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
                            style={{ width: 6, height: 6, borderRadius: '50%', background: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>

                </motion.div>
              </div>

              {/* Bottom gradient bar */}
              <div style={{
                height: 4,
                background: 'linear-gradient(90deg, #00C9A7, #3B5BFF, #8B30D4, #C026D3)',
              }} />
            </div>
          </IridescentBorder>
        </TiltCard>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{ display: 'flex', gap: 12, marginTop: 20, width: '100%', maxWidth: 420, zIndex: 2 }}
      >
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          style={{
            flex: 1, height: 52, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            color: '#fff', fontWeight: 700, fontSize: 15,
            boxShadow: '0 8px 28px rgba(124,58,237,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {copied ? '✓ Copied!' : shared ? '✓ Shared!' : '↗ Share Card'}
        </motion.button>

        <motion.a
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          href="https://wa.me/971503125078?text=Hi%20Rasha%2C%20I%20got%20your%20card%20from%20WeThink!"
          target="_blank" rel="noopener noreferrer"
          style={{
            flex: 1, height: 52, borderRadius: 16, textDecoration: 'none',
            background: 'rgba(37,211,102,0.1)',
            border: '1px solid rgba(37,211,102,0.28)',
            color: '#25D366', fontWeight: 700, fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </motion.a>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11, marginTop: 18, letterSpacing: '0.05em', zIndex: 2 }}
      >
        wethink.ae/card
      </motion.p>
    </div>
  )
}
