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

/* ────────────────────────────────────────────────────────────
   The logo side.

   Rather than a texture the mark happens to sit on, the pattern starts
   at the mark and moves outward: rings radiating from its centre, and
   circuit traces that run to the edge and terminate in a node. It gives
   the eye somewhere to arrive rather than something to wade through, and
   it carries none of the signature footer's language.
   ──────────────────────────────────────────────────────────── */

export function orbitBackdrop({ w, h, seed = 3, cx = 0.5, cy = 0.44 }) {
  const r = rng(seed)
  const id = (n) => `${n}o${seed}`
  const CX = w * cx
  const CY = h * cy

  /* rings, spaced so they open out rather than march evenly */
  const rings = Array.from({ length: 9 }, (_, i) => {
    const rad = w * 0.085 * Math.pow(1.29, i)
    const dash = i % 3 === 2 ? ` stroke-dasharray="${(0.7 + r()).toFixed(2)} ${(1.4 + r()).toFixed(2)}"` : ''
    const op = Math.max(0.05, 0.4 - i * 0.042)
    return `<circle cx="${CX.toFixed(2)}" cy="${CY.toFixed(2)}" r="${rad.toFixed(2)}"
      fill="none" stroke="${INK.cyan}" stroke-width="${(0.2 - i * 0.012).toFixed(3)}"
      opacity="${op.toFixed(3)}"${dash}/>`
  }).join('')

  /* circuit traces: out from the centre, one right-angle turn, node at the end */
  const traces = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 + r() * 0.5
    const r0 = w * 0.13
    const r1 = w * (0.30 + r() * 0.34)
    const x0 = CX + Math.cos(a) * r0
    const y0 = CY + Math.sin(a) * r0
    const x1 = CX + Math.cos(a) * r1
    const y1 = CY + Math.sin(a) * r1
    const horiz = r() > 0.5
    const mx = horiz ? x1 : x0
    const my = horiz ? y0 : y1
    const nx = horiz ? x1 + (Math.cos(a) > 0 ? 1 : -1) * w * 0.06 : x1
    const ny = horiz ? y1 : y1 + (Math.sin(a) > 0 ? 1 : -1) * h * 0.08
    return `<g opacity="${(0.30 + r() * 0.3).toFixed(2)}">
      <path d="M${x0.toFixed(2)} ${y0.toFixed(2)} L${mx.toFixed(2)} ${my.toFixed(2)} L${nx.toFixed(2)} ${ny.toFixed(2)}"
        fill="none" stroke="${INK.cyan}" stroke-width=".16" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="${nx.toFixed(2)}" cy="${ny.toFixed(2)}" r="${(0.34 + r() * 0.26).toFixed(2)}" fill="${INK.cyan}"/>
    </g>`
  }).join('')

  /* a sparse field, thinning towards the centre so the mark stays clean */
  const motes = Array.from({ length: 46 }, () => {
    const x = r() * w
    const y = r() * h
    const d = Math.hypot(x - CX, y - CY) / (w * 0.5)
    if (d < 0.42) return ''
    return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(0.12 + r() * 0.22).toFixed(2)}"
      fill="${INK.cyan}" opacity="${(0.16 + Math.min(0.5, d * 0.34)).toFixed(2)}"/>`
  }).join('')

  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <linearGradient id="${id('bg')}" x1="0" y1="0" x2=".85" y2="1">
      <stop offset="0" stop-color="#070B22"/>
      <stop offset=".52" stop-color="#111845"/>
      <stop offset="1" stop-color="#23155E"/>
    </linearGradient>
    <radialGradient id="${id('halo')}" cx="${cx}" cy="${cy}" r=".62">
      <stop offset="0" stop-color="${INK.blue}" stop-opacity=".42"/>
      <stop offset=".45" stop-color="${INK.violet}" stop-opacity=".16"/>
      <stop offset="1" stop-color="${INK.violet}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id('scrim')}" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#070B22" stop-opacity=".62"/>
      <stop offset=".55" stop-color="#070B22" stop-opacity=".34"/>
      <stop offset="1" stop-color="#070B22" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="${id('c')}"><rect width="${w}" height="${h}"/></clipPath>
  </defs>
  <g clip-path="url(#${id('c')})">
    <rect width="${w}" height="${h}" fill="url(#${id('bg')})"/>
    <rect width="${w}" height="${h}" fill="url(#${id('halo')})"/>
    ${rings}
    ${traces}
    ${motes}
    <!-- the pattern recedes where the lockup sits, so traces do not run
         through the wordmark -->
    <ellipse cx="${(w * cx).toFixed(2)}" cy="${(h * 0.60).toFixed(2)}"
      rx="${(w * 0.46).toFixed(2)}" ry="${(h * 0.34).toFixed(2)}"
      fill="url(#${id('scrim')})"/>
  </g>
</svg>`
}
