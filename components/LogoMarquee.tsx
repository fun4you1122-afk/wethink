'use client'

import { useEffect, useState } from 'react'

/**
 * The moving logo strip, in the manner of the reference: monochrome marks on a
 * pale ground, scrolling slowly and continuously.
 *
 * The row is rendered twice and translated by exactly half its width, so the
 * second copy lands where the first began and the loop has no seam. CSS does
 * the animation rather than JavaScript, so it costs nothing per frame and
 * stops dead for anyone who has asked for less motion.
 *
 * Two groups, labelled, because they are not the same claim: three are clients
 * we delivered for, the rest are platforms we build on.
 */

type Mark = { name: string; src: string; kind: 'client' | 'platform'; h?: number }

const MARKS: Mark[] = [
  { name: 'The Royal Thai Embassy', src: '/embassy/royal-thai-embassy.png', kind: 'client', h: 40 },
  { name: 'Albina Alareeq Contracting', src: '/logos/albina-alareeq.png', kind: 'client', h: 34 },
  { name: 'Nabe Eldiyafa Aldimashqi', src: '/logos/nabe-eldiyafa.png', kind: 'client', h: 36 },
  { name: 'Microsoft Azure', src: '/logos/tech/microsoftazure.svg', kind: 'platform' },
  { name: 'Amazon Web Services', src: '/logos/tech/amazonwebservices.svg', kind: 'platform' },
  { name: 'Google Cloud', src: '/logos/tech/google.svg', kind: 'platform' },
  { name: 'GitHub', src: '/logos/tech/github.svg', kind: 'platform' },
  { name: 'Vercel', src: '/logos/tech/vercel.svg', kind: 'platform' },
  { name: 'Docker', src: '/logos/tech/docker.svg', kind: 'platform' },
  { name: 'Kubernetes', src: '/logos/tech/kubernetes.svg', kind: 'platform' },
]

function Row({ marks, onDark }: { marks: Mark[]; onDark: boolean }) {
  return (
    <ul className="flex shrink-0 list-none items-center gap-14 pr-14" aria-hidden="true">
      {marks.map((m) => (
        <li key={m.name} className="flex shrink-0 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.src}
            alt=""
            style={{ height: m.h ?? 26 }}
            // The client marks are rasters with white backgrounds, which box
            // out against the pale ground. Multiply drops the white and keeps
            // the artwork.
            className={`w-auto shrink-0 ${
              m.kind === 'platform'
                ? onDark
                  ? 'opacity-70 brightness-0 invert'
                  : 'opacity-45'
                : onDark
                  ? 'opacity-95'
                  : 'opacity-95 mix-blend-multiply'
            }`}
          />
          <span
            className="whitespace-nowrap text-[15px] font-medium"
            style={{ color: onDark ? 'rgba(255,255,255,0.72)' : '#4b5563' }}
          >
            {m.name}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function LogoMarquee({
  label = 'Clients, and the platforms we build on',
  className = '',
  onDark = false,
}: {
  label?: string
  className?: string
  /** invert the ink and drop the multiply blend when sitting over video */
  onDark?: boolean
}) {
  const [still, setStill] = useState(false)

  useEffect(() => {
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  return (
    <div className={className}>
      {label && (
        <p
          className="mb-6 text-center text-[10.5px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: onDark ? 'rgba(255,255,255,0.45)' : '#9ca3af' }}
        >
          {label}
        </p>
      )}

      <div
        className="relative overflow-hidden"
        style={{
          // fade the marks out at both edges instead of cutting them off
          maskImage:
            'linear-gradient(to right, transparent, #000 9%, #000 91%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, #000 9%, #000 91%, transparent)',
        }}
      >
        <div
          className="flex w-max"
          style={
            still
              ? undefined
              : { animation: 'wt-marquee 46s linear infinite' }
          }
        >
          <Row marks={MARKS} onDark={onDark} />
          <Row marks={MARKS} onDark={onDark} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes wt-marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </div>
  )
}
