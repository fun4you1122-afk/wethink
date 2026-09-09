/* ────────────────────────────────────────────────────────────
   Backgrounds that belong on a light card.

   The constellation and circuit traces are a dark-mode idiom: they work
   as glowing lines on near-black and read as scratchy scaffolding on
   near-white. These three are built the other way round, from things
   that print well on paper — soft washes of colour, one oversized mark,
   and the mark's own chevron repeated as a rhythm.
   ──────────────────────────────────────────────────────────── */

const RAMP = { cyan: '#00B4BD', blue: '#3B6BE0', violet: '#7C3AED', deep: '#4E11BB' }

/** A: ribbons. Broad translucent sweeps of the brand ramp, bleeding off. */
export function ribbons({ w, h, seed = 1 }) {
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <linearGradient id="r${seed}a" x1="0" y1="0" x2="1" y2=".6">
      <stop offset="0" stop-color="${RAMP.cyan}" stop-opacity=".30"/>
      <stop offset="1" stop-color="${RAMP.blue}" stop-opacity=".05"/>
    </linearGradient>
    <linearGradient id="r${seed}b" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${RAMP.violet}" stop-opacity=".26"/>
      <stop offset="1" stop-color="${RAMP.deep}" stop-opacity=".04"/>
    </linearGradient>
    <linearGradient id="r${seed}c" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="${RAMP.blue}" stop-opacity=".16"/>
      <stop offset="1" stop-color="${RAMP.cyan}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#FBFAFE"/>
  <path d="M${-w * 0.1} ${h * 0.86} C ${w * 0.24} ${h * 0.52} ${w * 0.42} ${h * 1.06} ${w * 1.1} ${h * 0.58}
           L ${w * 1.1} ${h * 1.1} L ${-w * 0.1} ${h * 1.1} Z" fill="url(#r${seed}a)"/>
  <path d="M${w * 1.1} ${-h * 0.1} C ${w * 0.68} ${h * 0.30} ${w * 0.86} ${h * 0.52} ${w * 0.42} ${-h * 0.08}
           L ${w * 1.1} ${-h * 0.1} Z" fill="url(#r${seed}b)"/>
  <path d="M${-w * 0.1} ${h * 0.30} C ${w * 0.3} ${h * 0.06} ${w * 0.52} ${h * 0.46} ${w * 1.1} ${h * 0.14}
           L ${w * 1.1} ${-h * 0.1} L ${-w * 0.1} ${-h * 0.1} Z" fill="url(#r${seed}c)"/>
</svg>`
}

/** B: the mark itself, oversized and quiet, cropped by the card edge. */
export function ghostMark({ w, h, mark }) {
  return `<div style="position:absolute;inset:0;overflow:hidden;background:
      linear-gradient(155deg,#FFFFFF 0%,#FAF8FE 52%,#F1ECFC 100%)">
    <img src="data:image/png;base64,${mark}" alt=""
      style="position:absolute;right:-${w * 0.16}mm;bottom:-${h * 0.30}mm;
             height:${h * 1.26}mm;opacity:.09">
    <div style="position:absolute;left:0;top:0;bottom:0;width:${w * 0.022}mm;
      background:linear-gradient(180deg,${RAMP.cyan},${RAMP.blue} 46%,${RAMP.violet})"></div>
  </div>`
}

/** C: a triangulated mesh along the bottom edge.

    Points are laid on jittered rows and joined across them, which gives
    real triangles rather than the scattered lines a random constellation
    produces. It is confined to a band so the card stays mostly clean, and
    a few spikes reach up out of it, as on the reference.

    Seeded, so a rebuild is identical. */
export function polyMesh({ w, h, seed = 5, band = 0.28, line = '#2E6BE6', node = '#2E6BE6', strength = 1 }) {
  let s0 = seed
  const rnd = () => {
    s0 = (s0 * 1664525 + 1013904223) % 4294967296
    return s0 / 4294967296
  }

  const top = h * (1 - band)
  const rows = [
    { y: top + h * 0.02, n: 9, jit: h * 0.055 },
    { y: top + h * 0.16, n: 11, jit: h * 0.05 },
    { y: top + h * 0.30, n: 10, jit: h * 0.045 },
    { y: h + h * 0.02, n: 8, jit: h * 0.04 },
  ].map((r) =>
    Array.from({ length: r.n }, (_, i) => ({
      x: (-0.06 + (i / (r.n - 1)) * 1.12) * w + (rnd() - 0.5) * (w / r.n) * 0.8,
      y: r.y + (rnd() - 0.5) * r.jit,
    })),
  )

  const edges = []
  rows.forEach((row, ri) => {
    for (let i = 0; i < row.length - 1; i++) edges.push([row[i], row[i + 1], ri])
    const next = rows[ri + 1]
    if (!next) return
    row.forEach((p) => {
      const near = [...next].sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))
      edges.push([p, near[0], ri], [p, near[1], ri])
    })
  })

  /* a few long spikes out of the band, each ending in a node */
  const spikes = Array.from({ length: 4 }, () => {
    const from = rows[0][Math.floor(rnd() * rows[0].length)]
    const x = from.x + (rnd() - 0.5) * w * 0.12
    const y = top - h * (0.06 + rnd() * 0.30)
    return { from, to: { x, y } }
  })

  const fade = (y) => strength * Math.max(0.12, Math.min(0.8, (y - top + h * 0.12) / (h * 0.5)))

  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <linearGradient id="pm${seed}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset=".55" stop-color="#FBFAFE"/>
      <stop offset="1" stop-color="#F3EFFC"/>
    </linearGradient>
    <clipPath id="pc${seed}"><rect width="${w}" height="${h}"/></clipPath>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#pm${seed})"/>
  <g clip-path="url(#pc${seed})">
    ${spikes.map((sp) => `<g opacity="${(0.5 * strength).toFixed(2)}">
      <line x1="${sp.from.x.toFixed(2)}" y1="${sp.from.y.toFixed(2)}"
            x2="${sp.to.x.toFixed(2)}" y2="${sp.to.y.toFixed(2)}"
            stroke="${line}" stroke-width=".16"/>
      <circle cx="${sp.to.x.toFixed(2)}" cy="${sp.to.y.toFixed(2)}" r=".42" fill="${node}"/>
    </g>`).join('')}
    ${edges.map(([a, b]) => `<line x1="${a.x.toFixed(2)}" y1="${a.y.toFixed(2)}"
      x2="${b.x.toFixed(2)}" y2="${b.y.toFixed(2)}" stroke="${line}" stroke-width=".17"
      opacity="${fade((a.y + b.y) / 2).toFixed(2)}"/>`).join('')}
    ${rows.flat().map((p) => `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}"
      r="${(0.3 + (p.x * 7919 % 100) / 100 * 0.34).toFixed(2)}" fill="${node}"
      opacity="${Math.min(0.95, fade(p.y) + 0.2 * strength).toFixed(2)}"/>`).join('')}
  </g>
</svg>`
}
