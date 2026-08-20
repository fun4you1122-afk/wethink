import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Opening Ceremony — Marhaba Thailand | Royal Thai Embassy, Abu Dhabi · by WeThink',
  description:
    'An invitation to the Opening Ceremony of Marhaba Thailand — Friday 11 September 2026, 5:00 PM, Reem Mall, Abu Dhabi. Confirm your attendance.',
  alternates: { canonical: '/embassy/opening' },
  // A personal VIP invitation sent by email, so it stays out of search results.
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Opening Ceremony — Marhaba Thailand',
    siteName: 'WeThink',
    description: 'Friday 11 September 2026 · 5:00 PM · Reem Mall, Abu Dhabi',
    url: '/embassy/opening',
    type: 'website',
  },
}

export default function OpeningLayout({ children }: { children: React.ReactNode }) {
  return children
}
