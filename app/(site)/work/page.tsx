import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Projects from '@/components/Projects'
import CaseStudies from '@/components/CaseStudies'
import VideoSection from '@/components/VideoSection'

const TransformationSplit = dynamic(() => import('@/components/TransformationSplit'))

export const metadata: Metadata = {
  title: 'Our Work | WeThink',
  description:
    'Projects, case studies, and transformations WeThink has delivered for government, finance, education, and enterprise clients across the UAE and Gulf.',
  alternates: { canonical: '/work' },
  openGraph: {
    title: 'Our Work | WeThink',
    description: 'Projects and case studies delivered across the UAE and Gulf.',
    url: '/work',
  },
}

export default function WorkPage() {
  return (
    <div className="pt-24">
      <Projects />
      <CaseStudies />
      <TransformationSplit />
      <VideoSection />
    </div>
  )
}
