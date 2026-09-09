/* ────────────────────────────────────────────────────────────
   A technology backdrop for the card, drawn rather than placed.

   The vocabulary is the one those reference cards use: a constellation
   of linked nodes, a fading dot field, arc hatching in a corner and a
   few loose shards, over a dark ground with a soft diagonal split.
   Here it is in WeThink's ramp rather than a stock teal.

   The randomness is seeded, so a rebuild produces the identical card
   rather than a new arrangement each time.
   ──────────────────────────────────────────────────────────── */

/** mulberry32: small, fast, and deterministic from a single integer */
function rng(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const INK = {
  base0: '#080D26',
  base1: '#141A47',
  base2: '#2A1A6E',
  cyan: '#03CFF2',
  blue: '#3B7BFF',
  violet: '#A24BFF',
}

export function techBackdrop({ w, h, seed = 7, dense = 1 }) {
  const r = rng(seed)
  const id = (n) => `${n}${seed}`

  /* constellation: nodes scattered with a margin, joined when close */
  const N = Math.round(16 * dense)
  const nodes = Array.from({ length: N }, () => ({
    x: r() * w,
    y: r() * h,
    s: 0.22 + r() * 0.32,
  }))
  const edges = []
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const d = Math.hypot(dx, dy)
      if (d < w * 0.26) edges.push([i, j, 1 - d / (w * 0.26)])
    }
  }

  /* arc hatching, the fan of concentric curves in a corner */
  const arcs = Array.from({ length: 13 }, (_, i) => {
    const rad = w * 0.16 + i * (w * 0.032)
    return `M ${-w * 0.04} ${h * 0.30 + i * 1.1} A ${rad} ${rad} 0 0 1 ${w * 0.30 + i * 1.6} ${h * 1.06}`
  })

  /* a few loose shards, as on the reference */
  const shards = Array.from({ length: 9 }, () => {
    const x = r() * w
    const y = r() * h
    const s = 0.5 + r() * 1.5
    const a = r() * 360
    return `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${a.toFixed(1)})">
      <path d="M0 0 L${(s * 2).toFixed(2)} ${(s * 0.5).toFixed(2)} L${(s * 1.2).toFixed(2)} ${(s * 1.8).toFixed(2)} Z"
        fill="url(#${id('sg')})" opacity="${(0.10 + r() * 0.18).toFixed(2)}"/></g>`
  }).join('')

  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <linearGradient id="${id('bg')}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${INK.base0}"/>
      <stop offset=".55" stop-color="${INK.base1}"/>
      <stop offset="1" stop-color="${INK.base2}"/>
    </linearGradient>
    <linearGradient id="${id('sg')}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${INK.cyan}"/>
      <stop offset="1" stop-color="${INK.violet}"/>
    </linearGradient>
    <radialGradient id="${id('glow')}" cx=".22" cy=".18" r=".85">
      <stop offset="0" stop-color="${INK.blue}" stop-opacity=".34"/>
      <stop offset="1" stop-color="${INK.blue}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="${id('dots')}" width="2.1" height="2.1" patternUnits="userSpaceOnUse">
      <circle cx="1.05" cy="1.05" r=".24" fill="${INK.cyan}"/>
    </pattern>
    <linearGradient id="${id('fade')}" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".5"/>
      <stop offset=".6" stop-color="#fff" stop-opacity=".06"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="${id('dm')}"><rect width="${w}" height="${h}" fill="url(#${id('fade')})"/></mask>
    <clipPath id="${id('clip')}"><rect width="${w}" height="${h}"/></clipPath>
  </defs>

  <g clip-path="url(#${id('clip')})">
    <rect width="${w}" height="${h}" fill="url(#${id('bg')})"/>
    <rect width="${w}" height="${h}" fill="url(#${id('glow')})"/>

    <!-- the diagonal split, a shade lighter -->
    <path d="M0 ${h * 0.62} L${w * 0.46} ${h * 0.30} L${w} ${h * 0.52} L${w} ${h} L0 ${h} Z"
      fill="#ffffff" opacity=".030"/>

    <rect width="${w}" height="${h}" fill="url(#${id('dots')})" mask="url(#${id('dm')})" opacity=".55"/>

    <g stroke="${INK.cyan}" fill="none" opacity=".18" stroke-width=".22">
      ${arcs.map((d) => `<path d="${d}"/>`).join('')}
    </g>

    <g>
      ${edges.map(([i, j, k]) =>
        `<line x1="${nodes[i].x.toFixed(2)}" y1="${nodes[i].y.toFixed(2)}"
               x2="${nodes[j].x.toFixed(2)}" y2="${nodes[j].y.toFixed(2)}"
               stroke="${INK.cyan}" stroke-width=".14" opacity="${(k * 0.5).toFixed(2)}"/>`).join('')}
      ${nodes.map((n) =>
        `<circle cx="${n.x.toFixed(2)}" cy="${n.y.toFixed(2)}" r="${n.s.toFixed(2)}"
                 fill="${INK.cyan}" opacity=".72"/>`).join('')}
    </g>

    ${shards}
  </g>
</svg>`
}
