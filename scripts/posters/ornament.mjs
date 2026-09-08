/* ────────────────────────────────────────────────────────────
   Thai ornament for the printed panels.

   All of it is drawn as SVG rather than placed as artwork: the panels
   print at 1.15 m, and the festival photography we hold tops out at
   1800 px, which is about 100 dpi at that size. Vector has no such
   ceiling and stays crisp at any size the Embassy asks for.

   The vocabulary follows the website's own backdrop: chedi silhouettes
   along the base, lotus petals drifting, and a kanok flame scroll, which
   is the curling motif on Thai temple gables and manuscript borders.
   ──────────────────────────────────────────────────────────── */

export const GOLD = {
  deep: '#A6802A',
  mid: '#C9A227',
  light: '#E3C15A',
  pale: '#F0DDA0',
}

/** One kanok flame, the repeating unit of a Thai border. */
function kanokUnit(w, h) {
  return `
    <path d="M0 ${h} C ${w * 0.06} ${h * 0.52} ${w * 0.2} ${h * 0.2} ${w * 0.42} ${h * 0.06}
             C ${w * 0.3} ${h * 0.3} ${w * 0.26} ${h * 0.56} ${w * 0.34} ${h}
             Z"/>
    <path d="M${w * 0.34} ${h} C ${w * 0.4} ${h * 0.62} ${w * 0.52} ${h * 0.36} ${w * 0.72} ${h * 0.24}
             C ${w * 0.6} ${h * 0.46} ${w * 0.58} ${h * 0.7} ${w * 0.63} ${h}
             Z"/>
    <path d="M${w * 0.63} ${h} C ${w * 0.68} ${h * 0.72} ${w * 0.78} ${h * 0.54} ${w} ${h * 0.44}
             C ${w * 0.86} ${h * 0.64} ${w * 0.84} ${h * 0.82} ${w * 0.86} ${h}
             Z"/>`
}

/** A horizontal kanok band, mirrored about the centre the way Thai borders are. */
export function kanokBand({ width = 418, height = 9, fill = GOLD.mid, opacity = 1 } = {}) {
  const unit = 34
  const n = Math.ceil(width / 2 / unit)
  let left = ''
  for (let i = 0; i < n; i++) {
    left += `<g transform="translate(${i * unit} 0)">${kanokUnit(unit, height)}</g>`
  }
  return `<svg class="orn kanok" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="${fill}" opacity="${opacity}">
      <g>${left}</g>
      <g transform="translate(${width} 0) scale(-1 1)">${left}</g>
    </g></svg>`
}

/** A chedi, the bell-and-spire silhouette of a Thai stupa. */
function chedi(x, base, h) {
  const w = h * 0.42
  return `M${x - w} ${base}
    C ${x - w * 0.86} ${base - h * 0.3} ${x - w * 0.5} ${base - h * 0.4} ${x - w * 0.34} ${base - h * 0.52}
    L ${x - w * 0.2} ${base - h * 0.66}
    L ${x - w * 0.12} ${base - h * 0.78}
    L ${x} ${base - h}
    L ${x + w * 0.12} ${base - h * 0.78}
    L ${x + w * 0.2} ${base - h * 0.66}
    L ${x + w * 0.34} ${base - h * 0.52}
    C ${x + w * 0.5} ${base - h * 0.4} ${x + w * 0.86} ${base - h * 0.3} ${x + w} ${base}
    Z`
}

/** The temple skyline that closes the foot of the panel. */
export function skyline({ width = 456, height = 46, fill = '#015866', opacity = 0.1 } = {}) {
  const spec = [
    [0.06, 0.52], [0.14, 0.78], [0.22, 0.46], [0.3, 0.94], [0.4, 0.6],
    [0.5, 1.0], [0.6, 0.58], [0.7, 0.86], [0.79, 0.5], [0.88, 0.74], [0.96, 0.44],
  ]
  const paths = spec.map(([fx, fh]) => chedi(width * fx, height, height * fh)).join(' ')
  return `<svg class="orn sky" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="${paths}" fill="${fill}" opacity="${opacity}"/></svg>`
}

/** A lotus petal, used singly as a drifting accent. */
export function petal({ size = 20, fill = GOLD.light, opacity = 0.5, rotate = 0 } = {}) {
  return `<svg class="orn petal" viewBox="0 0 24 24" width="${size}" height="${size}"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
    style="transform:rotate(${rotate}deg)">
    <path d="M12 1 C 18 7 21 13 12 23 C 3 13 6 7 12 1 Z" fill="${fill}" opacity="${opacity}"/>
    <path d="M12 4 C 15 9 16 14 12 20" fill="none" stroke="${fill}" stroke-width=".7" opacity="${opacity * 0.8}"/>
  </svg>`
}

/** A lotus seen face on, for the crest surround and the day markers. */
export function lotus({ size = 30, fill = GOLD.mid, opacity = 0.9 } = {}) {
  const petals = Array.from({ length: 8 }, (_, i) =>
    `<path d="M12 12 C 9.6 8 9.6 5 12 1.6 C 14.4 5 14.4 8 12 12 Z"
       transform="rotate(${i * 45} 12 12)"/>`).join('')
  return `<svg class="orn lotus" viewBox="0 0 24 24" width="${size}" height="${size}"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="${fill}" opacity="${opacity}">${petals}</g>
    <circle cx="12" cy="12" r="1.6" fill="${fill}"/></svg>`
}

/** Corner flourish for the gold frame. */
export function corner({ size = 30, fill = GOLD.mid, opacity = 0.85 } = {}) {
  return `<svg class="orn corner" viewBox="0 0 40 40" width="${size}" height="${size}"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="none" stroke="${fill}" stroke-width="1.5" opacity="${opacity}" stroke-linecap="round">
      <path d="M0 14 C 0 6 6 0 14 0"/>
      <path d="M0 24 C 0 11 11 0 24 0" opacity=".55"/>
      <path d="M6 20 C 6 12 12 6 20 6" opacity=".4"/>
    </g>
    <g fill="${fill}" opacity="${opacity}">
      <circle cx="4" cy="4" r="1.9"/>
    </g></svg>`
}
