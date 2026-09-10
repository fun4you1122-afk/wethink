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

/** A vertical chain of diamonds and lotus buds, for the panel's side margins.
    Drawn as a tiling pattern so it repeats cleanly at any panel height. */
export function sideChain({ width = 13, height = 1150, fill = GOLD.mid, opacity = 0.3 } = {}) {
  return `<svg class="orn chain" viewBox="0 0 12 ${height}" preserveAspectRatio="xMidYMin slice"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <pattern id="ch" x="0" y="0" width="12" height="34" patternUnits="userSpaceOnUse">
        <g fill="${fill}" opacity="${opacity}">
          <path d="M6 2 L9.4 7 L6 12 L2.6 7 Z"/>
          <circle cx="6" cy="17" r="1.15"/>
          <path d="M6 22 C 8.4 25 8.4 27.6 6 30.6 C 3.6 27.6 3.6 25 6 22 Z"/>
        </g>
        <g stroke="${fill}" stroke-width=".55" opacity="${opacity * 0.6}" fill="none">
          <path d="M6 12 L6 15.6 M6 18.4 L6 22"/>
        </g>
      </pattern>
    </defs>
    <rect x="0" y="0" width="12" height="${height}" fill="url(#ch)"/></svg>`
}

/* Brand glyphs, drawn here because lucide dropped its brand icons at v1
   and a placed raster would not survive being printed at this size. */

export function whatsappGlyph({ size = 6, fill = '#25D366' } = {}) {
  return `<svg class="gl" viewBox="0 0 24 24" width="${size}" height="${size}"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="${fill}" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.26-8.24Zm-2.6 4.2c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.32-.75-1.8-.19-.44-.38-.38-.53-.39l-.45-.01Z"/></svg>`
}

export function instagramGlyph({ size = 6, fill = '#C13584' } = {}) {
  return `<svg class="gl" viewBox="0 0 24 24" width="${size}" height="${size}"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="none" stroke="${fill}" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="5.2"/>
      <circle cx="12" cy="12" r="4"/>
    </g>
    <circle cx="17.3" cy="6.7" r="1.25" fill="${fill}"/></svg>`
}

export function globeGlyph({ size = 6, fill = '#037A8A' } = {}) {
  return `<svg class="gl" viewBox="0 0 24 24" width="${size}" height="${size}"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="none" stroke="${fill}" stroke-width="1.9">
      <circle cx="12" cy="12" r="9"/>
      <path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18"/>
    </g></svg>`
}

export function mailGlyph({ size = 6, fill = '#037A8A' } = {}) {
  return `<svg class="gl" viewBox="0 0 24 24" width="${size}" height="${size}"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="none" stroke="${fill}" stroke-width="1.9" stroke-linejoin="round">
      <rect x="2.5" y="5" width="19" height="14" rx="2.4"/>
      <path d="M3 7l9 6 9-6"/>
    </g></svg>`
}

/** A thin-line handset, to sit beside the stroked mail and globe marks. */
export function phoneLineGlyph({ size = 6, fill = '#108FFC' } = {}) {
  return `<svg class="gl" viewBox="0 0 24 24" width="${size}" height="${size}"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="none" stroke="${fill}" stroke-width="1.9"
      stroke-linecap="round" stroke-linejoin="round"
      d="M7.1 3.4 5.6 4.9c-.9.9-1.2 2.25-.7 3.44a20.6 20.6 0 0 0 10.76 10.76c1.19.5 2.54.2 3.44-.7l1.5-1.5a1.2 1.2 0 0 0-.05-1.8l-2.4-2.2a1.2 1.2 0 0 0-1.75 0l-1.4 1.3c-.35.31-.85.37-1.25.17a12.6 12.6 0 0 1-5.4-5.4c-.21-.41-.14-.91.16-1.26l1.3-1.4c.45-.5.45-1.25 0-1.75l-2.2-2.4a1.2 1.2 0 0 0-1.8-.05Z"/></svg>`
}

export function phoneGlyph({ size = 6, fill = '#108FFC' } = {}) {
  return `<svg class="gl" viewBox="0 0 24 24" width="${size}" height="${size}"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="${fill}"
    d="M6.6 2.6c.5-.5 1.3-.5 1.8.05l2.2 2.4c.45.5.45 1.25 0 1.75l-1.3 1.4c-.3.35-.37.85-.16 1.26a12.6 12.6 0 0 0 5.4 5.4c.4.2.9.14 1.25-.17l1.4-1.3c.5-.45 1.25-.45 1.75 0l2.4 2.2c.55.5.55 1.3.05 1.8l-1.5 1.5c-.9.9-2.25 1.2-3.44.72A20.6 20.6 0 0 1 4.4 7.55C3.9 6.36 4.2 5 5.1 4.1Z"/></svg>`
}
