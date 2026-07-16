import type { Metadata } from 'next'
import Blog from '@/components/Blog'

export const metadata: Metadata = {
  title: 'Blog | WeThink',
  description:
    'Insights on digital transformation, cloud, cybersecurity, and technology in the UAE from the WeThink team.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog | WeThink',
    description: 'Insights on digital transformation and technology in the UAE.',
    url: '/blog',
  },
}

export default function BlogPage() {
  return (
    <div className="pt-24">
      <Blog />
    </div>
  )
}
