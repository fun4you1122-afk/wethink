import { OG_SIZE, OG_TYPE, ogImage } from '@/lib/embassy/og'

export const alt = 'Opening Ceremony — Marhaba Thailand'
export const size = OG_SIZE
export const contentType = OG_TYPE

export default function Image() {
  return ogImage({
    eyebrow: 'Marhaba Thailand',
    title: 'Opening Ceremony',
    meta: 'Friday 11 September 2026 · 17:00 hrs · Main Atrium, Reem Mall',
  })
}
