'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

/*
  ADMIN GUIDE — how to enable each card:
  1. Drop your photo/video files into  public/presence/
     (e.g. public/presence/gitex-2025.jpg, public/presence/workshop-adu.mp4)
  2. Fill in the entry below: set `src` to '/presence/your-file.jpg' (or .mp4)
     and set `type` to 'image' or 'video'.
  3. Any entry with an empty `src` renders as a styled "coming soon" tile,
     so the section never looks broken while you gather media.
  Videos autoplay muted immediately (no click needed) and show a play badge.
*/

type MediaItem = {
  type: 'image' | 'video'
  src: string
  title: string
  kind: 'Conference' | 'Workshop' | 'Exhibition' | 'Meetup' | 'Panel'
  location: string
  date: string
  wide?: boolean // spans 2 columns on desktop
}

const ITEMS: MediaItem[] = [
  {
    type: 'video',
    src: 'https://assets.mixkit.co/videos/20211/20211-720.mp4',
    title: 'GITEX Global 2025',
    kind: 'Exhibition',
    location: 'Dubai World Trade Centre',
    date: 'Oct 2025',
    wide: true,
  },
  {
    type: 'video',
    src: 'https://videos.pexels.com/video-files/3252123/3252123-hd_1920_1080_25fps.mp4',
    title: 'AI in Business Workshop',
    kind: 'Workshop',
    location: 'Abu Dhabi',
    date: 'Sep 2025',
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/8938630/pexels-photo-8938630.jpeg?w=1200&q=75&fit=crop',
    title: 'UAE Digital Economy Forum',
    kind: 'Conference',
    location: 'ADNEC, Abu Dhabi',
    date: 'Jun 2025',
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/8938271/pexels-photo-8938271.jpeg?w=1200&q=75&fit=crop',
    title: 'Startup Founders Meetup',
    kind: 'Meetup',
    location: 'Hub71, Abu Dhabi',
    date: 'Apr 2025',
  },
  {
    type: 'video',
    src: 'https://assets.mixkit.co/videos/20111/20111-720.mp4',
    title: 'Cybersecurity Panel Talk',
    kind: 'Panel',
    location: 'Dubai Internet City',
    date: 'Feb 2025',
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/8939042/pexels-photo-8939042.jpeg?w=1600&q=75&fit=crop',
    title: 'Web Development Bootcamp',
    kind: 'Workshop',
    location: 'Abu Dhabi University',
    date: 'Nov 2024',
    wide: true,
  },
]

const KIND_COLORS: Record<MediaItem['kind'], string> = {
  Conference: '#A78BFA',
  Workshop: '#34D399',
  Exhibition: '#FB923C',
  Meetup: '#38BDF8',
  Panel: '#F472B6',
}

function PlayBadge() {
  return (
    <div className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
      <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
        <path d="M1 1.5v11l10-5.5L1 1.5z" fill="white" />
      </svg>
    </div>
  )
}

function MediaCard({ item, index }: { item: MediaItem; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const accent = KIND_COLORS[item.kind]
  const hasMedia = item.src !== '' && !failed

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative overflow-hidden rounded-2xl min-h-[260px] ${item.wide ? 'md:col-span-2' : ''}`}
      style={{ background: '#0A0A14', border: '1px solid rgba(124,58,237,0.15)' }}
    >
      {/* Media layer */}
      {hasMedia ? (
        item.type === 'video' ? (
          <video
            ref={videoRef}
            src={item.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <img
            src={item.src}
            alt={item.title}
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )
      ) : (
        /* Placeholder tile until the admin adds media */
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${accent}18 0%, transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(124,58,237,0.12) 0%, transparent 60%)`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.25 }}>
              {item.type === 'video' ? (
                <path d="M4 5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3.5l4 3v-9l-4 3V7a2 2 0 00-2-2H4z" fill={accent} />
              ) : (
                <path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2H4zm4 4a2 2 0 110 4 2 2 0 010-4zm-4 10l5-6 3.5 4L15 12l5 6H4z" fill={accent} />
              )}
            </svg>
          </div>
        </div>
      )}

      {item.type === 'video' && hasMedia && <PlayBadge />}

      {/* Gradient for caption legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <span
          className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}40` }}
        >
          {item.kind}
        </span>
        <h3 className="mt-2.5 text-white font-bold text-lg leading-snug">{item.title}</h3>
        <p className="mt-1 text-sm text-white/60">
          {item.location} · {item.date}
        </p>
      </div>
    </motion.div>
  )
}

export default function Presence() {
  const headingRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headingRef, { once: true, margin: '-80px' })

  return (
    <section id="presence" className="section-padding relative overflow-hidden">
      <div className="orb w-[450px] h-[450px] bg-violet-900/20 opacity-25 top-[-80px] left-[-180px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div ref={headingRef} className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label mx-auto">Our Presence</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black mt-3">
            <span style={{ color: 'var(--text)' }}>Where You&apos;ll </span>
            <span className="gradient-text">Find Us</span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-text-muted text-lg max-w-2xl mx-auto"
          >
            From exhibitions and conferences to hands-on workshops — we show up, share, and build
            alongside the UAE tech community.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ITEMS.map((item, i) => (
            <MediaCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
