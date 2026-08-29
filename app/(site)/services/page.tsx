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
    'Digital transformation and AI, data analytics and decision intelligence, business systems and digital platforms, strategy and optimisation, and brand, events and media — the five lines of work WeThink delivers across the UAE.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services | WeThink',
    description: 'The five lines of work WeThink delivers — from AI and analytics to platforms, strategy and media.',
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
