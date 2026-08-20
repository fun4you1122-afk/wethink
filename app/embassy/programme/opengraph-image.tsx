import { OG_SIZE, OG_TYPE, ogImage } from '@/lib/embassy/og'

export const alt = 'Daily Programme — Marhaba Thailand'
export const size = OG_SIZE
export const contentType = OG_TYPE

export default function Image() {
  return ogImage({
    eyebrow: 'Marhaba Thailand',
    title: 'Daily Programme',
    meta: 'Three stages · 10:00 AM – 10:00 PM · Reem Mall, Abu Dhabi',
  })
}
