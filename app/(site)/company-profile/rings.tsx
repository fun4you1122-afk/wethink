/**
 * The concentric ring artwork from the profile deck's cover.
 *
 * Each band is a stack of ellipses turned a little further round than the
 * last; where their strokes cross they build the moiré the printed cover
 * carries. Nothing random: the same geometry every render, so the page and
 * the PDF show the same figure.
 */

/* The eccentricity is what makes the moiré: near-circles stacked on each
   other just draw a thicker circle. */
const BANDS = [
  { rx: 344, ry: 196, n: 78, from: '#22D3EE', to: '#3D8BFF', op: 0.34 },
  { rx: 272, ry: 152, n: 66, from: '#3D8BFF', to: '#6D6BF6', op: 0.34 },
  { rx: 204, ry: 112, n: 56, from: '#6D6BF6', to: '#A855F7', op: 0.32 },
  { rx: 138, ry: 76, n: 44, from: '#A855F7', to: '#3D8BFF', op: 0.30 },
]

export default function Rings({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="-360 -360 720 720" className={className} aria-hidden="true">
      <defs>
        {BANDS.map((b, i) => (
          <linearGradient key={i} id={`rg-${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={b.from} />
            <stop offset="1" stopColor={b.to} />
          </linearGradient>
        ))}
      </defs>
      {BANDS.map((b, i) => (
        <g key={i} stroke={`url(#rg-${i})`} fill="none" strokeWidth=".55" opacity={b.op}>
          {Array.from({ length: b.n }, (_, k) => (
            <ellipse key={k} rx={b.rx} ry={b.ry} transform={`rotate(${(k * 180) / b.n})`} />
          ))}
        </g>
      ))}
      <circle r="72" fill="none" stroke="#3D8BFF" strokeWidth="1" opacity=".55" />
      <circle r="350" fill="none" stroke="#22D3EE" strokeWidth=".8" opacity=".28"
        strokeDasharray="2 7" />
    </svg>
  )
}
