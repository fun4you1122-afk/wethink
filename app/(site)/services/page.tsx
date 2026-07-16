import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Services from '@/components/Services'
import BeforeAfter from '@/components/BeforeAfter'
import IdeaToImpact from '@/components/IdeaToImpact'
import TechMarquee from '@/components/TechMarquee'

const AnalyticsDemo = dynamic(() => import('@/components/AnalyticsDemo'))
const PricingSection = dynamic(() => import('@/components/ui/pricing-section'))

export const metadata: Metadata = {
  title: 'Services | WeThink',
  description:
    'Digital transformation, cloud, cybersecurity, custom software, data analytics, and strategic IT consulting — explore everything WeThink delivers across the UAE.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services | WeThink',
    description: 'Everything WeThink delivers — from cloud strategy to cybersecurity.',
    url: '/services',
  },
}

export default function ServicesPage() {
  return (
    <div className="pt-24">
      <Services />
      <BeforeAfter />
      <IdeaToImpact />
      <TechMarquee />
      <AnalyticsDemo />
      <PricingSection />
    </div>
  )
}
