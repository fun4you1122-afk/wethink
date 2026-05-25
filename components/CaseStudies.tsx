'use client'

import { Gallery4 } from '@/components/ui/gallery4'

const caseStudies = [
  {
    id: '01',
    title: 'Albina Alareeq Digital Hub',
    description:
      'End-to-end digital transformation for a major Abu Dhabi construction firm — a brand-aligned corporate website plus a connected project-management portal unifying tender pipeline, site progress, HSE compliance, and manpower tracking across 12 active job sites. Result: 60% faster project reporting cycles and 35% reduction in administrative overhead.',
    href: '#contact',
    image: 'https://i.ibb.co/QzN1cV6/file-0000000087f471f4a9d98070fbbeddff.png',
  },
  {
    id: '02',
    title: 'Nabe Eldiyafa Brand & Digital Ecosystem',
    description:
      'Full digital launch for a heritage Damascene restaurant in Abu Dhabi — brand identity refresh, a bilingual reservations website, and a 12-month social media programme with original photography and video in Arabic and English. Result: 4× growth in social following, 3.2M+ monthly impressions, and 28% increase in dine-in reservations.',
    href: '#contact',
    image: 'https://i.ibb.co/zTgNfs8P/file-00000000fe4872468754315330f516f9.png',
  },
  {
    id: '04',
    title: 'KidiVerse — Kids-Safe Streaming Platform',
    description:
      'A kids-first video streaming platform for a family media operator in Amman, Jordan — curated Arabic and English content, six layers of parental controls, screen-time governance, and child-friendly UX engineered to meet international child-safety standards. Result: 100% age-gated catalogue and 200K+ minutes streamed each month across MENA.',
    href: '#contact',
    image: 'https://i.ibb.co/p61pBBwp/file-0000000052d871f4a2b4ce263fc0d495.png',
  },
]

export default function CaseStudies() {
  return (
    <Gallery4
      title="Case Studies"
      description="Transformations we've delivered."
      items={caseStudies}
    />
  )
}
