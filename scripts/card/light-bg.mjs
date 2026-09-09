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

/** C: chevrons. The W's own stroke, repeated as a rhythm.

    Flat rounded strokes rather than a field of small dots: there is
    nothing here for a press to smudge, and the shape is the mark's, so
    the pattern is owned rather than borrowed. */
export function chevrons({ w, h, pitch = 9, weight = 1.0 }) {
  const rows = []
  const rise = pitch * 0.52
  for (let ry = -rise, i = 0; ry < h + rise * 2; ry += rise * 1.55, i++) {
    const off = (i % 2) * pitch * 0.5
    const pts = []
    for (let x = -pitch + off; x < w + pitch; x += pitch) {
      pts.push(`${x.toFixed(2)} ${(ry + rise).toFixed(2)}`)
      pts.push(`${(x + pitch / 2).toFixed(2)} ${ry.toFixed(2)}`)
    }
    rows.push(`<polyline points="${pts.join(' ')}" fill="none"
      stroke="url(#cvg)" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round"/>`)
  }

  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <linearGradient id="cvg" x1="0" y1="0" x2="1" y2=".35">
      <stop offset="0" stop-color="${RAMP.cyan}"/>
      <stop offset=".5" stop-color="${RAMP.blue}"/>
      <stop offset="1" stop-color="${RAMP.violet}"/>
    </linearGradient>
    <!-- the pattern clears the middle, where the lockup and the service
         list sit, and gathers towards the edges -->
    <radialGradient id="cvf" cx=".5" cy=".46" r=".78">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".42" stop-color="#fff" stop-opacity=".06"/>
      <stop offset=".72" stop-color="#fff" stop-opacity=".34"/>
      <stop offset="1" stop-color="#fff" stop-opacity=".62"/>
    </radialGradient>
    <mask id="cvm"><rect width="${w}" height="${h}" fill="url(#cvf)"/></mask>
  </defs>
  <rect width="${w}" height="${h}" fill="#FCFBFE"/>
  <g mask="url(#cvm)">${rows.join('')}</g>
</svg>`
}
