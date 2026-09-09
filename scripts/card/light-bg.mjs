/* ────────────────────────────────────────────────────────────
   Backgrounds that belong on a light card.

   The constellation and circuit traces are a dark-mode idiom: they work
   as glowing lines on near-black and read as scratchy scaffolding on
   near-white. These three are built the other way round, from things
   that print well on paper — soft washes of colour, one oversized mark,
   and a halftone that resolves into a wave.
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

/** C: halftone. A dot field whose radius swells along a diagonal wave. */
export function halftone({ w, h, step = 2.4 }) {
  const dots = []
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      const t = (x / w) * 1.4 + (y / h) * 0.6
      const wave = Math.sin(t * Math.PI * 1.15 - 0.5)
      const k = Math.max(0, wave)
      if (k < 0.04) continue
      const r = 0.14 + k * 0.46
      const hue = x / w
      const col = hue < 0.42 ? RAMP.cyan : hue < 0.72 ? RAMP.blue : RAMP.violet
      dots.push(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r.toFixed(2)}"
        fill="${col}" opacity="${(0.10 + k * 0.34).toFixed(2)}"/>`)
    }
  }
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none" aria-hidden="true">
  <rect width="${w}" height="${h}" fill="#FCFBFE"/>
  ${dots.join('')}
</svg>`
}
