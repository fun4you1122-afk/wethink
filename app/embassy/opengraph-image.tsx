import { OG_SIZE, OG_TYPE, ogImage } from '@/lib/embassy/og'

export const alt = 'Marhaba Thailand — an invitation from the Royal Thai Embassy, Abu Dhabi'
export const size = OG_SIZE
export const contentType = OG_TYPE

export default function Image() {
  return ogImage({
    eyebrow: 'An Invitation',
    title: 'Marhaba Thailand',
    meta: '11 – 12 September 2026 · Reem Mall, Abu Dhabi',
  })
}
