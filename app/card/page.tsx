'use client'

import { useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const INFO = {
  name: 'Ahmad Saeed',
  role: 'Founder',
  company: 'WeThink',
  tagline: 'Digital Smart Solutions',
  email: 'info@wethink.ae',
  phone: '+971 50 312 5078',
  website: 'www.wethink.ae',
  instagram: '@wethink.ae',
  linkedin: 'linkedin.com/company/wethink',
  location: 'Makers District, Abu Dhabi, UAE',
}

export default function CardPage() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  const handleShare = async () => {
    const url = 'https://www.wethink.ae/card'
    if (navigator.share) {
      try {
        await navigator.share({ title: `${INFO.name} — WeThink`, url })
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #1a0a3e 0%, #06030f 55%, #0a0518 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px 40px',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '10%',
          width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', right: '-5%',
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192,38,211,0.14) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          borderRadius: 28,
          padding: '2px',
          background: 'linear-gradient(145deg, rgba(124,58,237,0.6), rgba(192,38,211,0.3) 40%, rgba(255,255,255,0.06) 100%)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.15)',
        }}
      >
        <div style={{
          borderRadius: 27,
          background: 'linear-gradient(160deg, rgba(18,8,40,0.97) 0%, rgba(8,4,22,0.99) 100%)',
          backdropFilter: 'blur(24px)',
          overflow: 'hidden',
        }}>

          {/* Top accent bar */}
          <div style={{
            height: 4,
            background: 'linear-gradient(90deg, #7C3AED, #A855F7, #C026D3, #A855F7, #7C3AED)',
          }} />

          <div style={{ padding: '32px 28px 28px' }}>

            {/* Brand header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #7C3AED, #C026D3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
                flexShrink: 0,
              }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 16, letterSpacing: '-1px' }}>W</span>
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: '0.02em' }}>WeThink</div>
                <div style={{ color: 'rgba(167,139,250,0.7)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Digital Smart Solutions</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <div style={{
                  padding: '3px 10px', borderRadius: 20,
                  border: '1px solid rgba(124,58,237,0.35)',
                  background: 'rgba(124,58,237,0.1)',
                  color: 'rgba(167,139,250,0.8)', fontSize: 10,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>Est. 2019</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), transparent)', marginBottom: 28 }} />

            {/* Name & role */}
            <div style={{ marginBottom: 28 }}>
              <h1 style={{
                margin: 0, fontSize: 34, fontWeight: 900,
                color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1,
                textShadow: '0 2px 24px rgba(124,58,237,0.4)',
              }}>
                {INFO.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <span style={{
                  color: 'transparent',
                  background: 'linear-gradient(90deg, #A78BFA, #C026D3)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700, fontSize: 15, letterSpacing: '0.01em',
                }}>
                  {INFO.role}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>·</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{INFO.company}</span>
              </div>
            </div>

            {/* Contact rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              <ContactRow icon="📞" label={INFO.phone} href={`tel:${INFO.phone.replace(/\s/g,'')}`} />
              <ContactRow icon="✉️" label={INFO.email} href={`mailto:${INFO.email}`} />
              <ContactRow icon="🌐" label={INFO.website} href="https://www.wethink.ae" />
              <ContactRow icon="📸" label={INFO.instagram} href="https://instagram.com/wethink.ae" />
              <ContactRow icon="💼" label="LinkedIn · WeThink" href="https://linkedin.com/company/wethink" />
              <ContactRow icon="📍" label={INFO.location} />
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)', marginBottom: 24 }} />

            {/* QR + tagline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                padding: 10,
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                flexShrink: 0,
              }}>
                <QRCodeSVG
                  value="https://www.wethink.ae"
                  size={88}
                  bgColor="#ffffff"
                  fgColor="#06030f"
                  level="M"
                />
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Scan to visit
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>www.wethink.ae</div>
                <div style={{ color: 'rgba(167,139,250,0.6)', fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>
                  Transforming Ideas into<br />Impactful Realities
                </div>
              </div>
            </div>

          </div>

          {/* Bottom accent */}
          <div style={{
            height: 3,
            background: 'linear-gradient(90deg, #7C3AED, #C026D3)',
            opacity: 0.5,
          }} />
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24, width: '100%', maxWidth: 420 }}>
        <button
          onClick={handleShare}
          style={{
            flex: 1, height: 52, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
            color: '#fff', fontWeight: 700, fontSize: 15,
            boxShadow: '0 8px 24px rgba(124,58,237,0.35)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <span>{copied ? '✓ Link Copied!' : shared ? '✓ Shared!' : '↗ Share Card'}</span>
        </button>

        <a
          href="https://wa.me/971503125078?text=Hi%20Ahmad%2C%20I%20got%20your%20card%20from%20WeThink!"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, height: 52, borderRadius: 16,
            background: 'rgba(37,211,102,0.12)',
            border: '1px solid rgba(37,211,102,0.3)',
            color: '#25D366', fontWeight: 700, fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            textDecoration: 'none',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </a>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 20, letterSpacing: '0.04em' }}>
        wethink.ae/card
      </p>
    </div>
  )
}

function ContactRow({ icon, label, href }: { icon: string; label: string; href?: string }) {
  const content = (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px', borderRadius: 12,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.06)',
      transition: 'background 0.2s, border-color 0.2s',
      cursor: href ? 'pointer' : 'default',
      textDecoration: 'none',
    }}>
      <span style={{ fontSize: 16, width: 22, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13.5, fontWeight: 500, letterSpacing: '0.01em' }}>
        {label}
      </span>
      {href && (
        <span style={{ marginLeft: 'auto', color: 'rgba(167,139,250,0.5)', fontSize: 14 }}>↗</span>
      )}
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        {content}
      </a>
    )
  }
  return content
}
