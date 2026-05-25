import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import OrbitalServices from '@/components/OrbitalServices'
import Services from '@/components/Services'
import About from '@/components/About'
import Stats from '@/components/Stats'
import TechMarquee from '@/components/TechMarquee'
import BeforeAfter from '@/components/BeforeAfter'
import IdeaToImpact from '@/components/IdeaToImpact'
import OurStory from '@/components/OurStory'
import Projects from '@/components/Projects'
import ScrollMorphGallery from '@/components/ScrollMorphGallery'
import Testimonials from '@/components/Testimonials'
import CinematicScene from '@/components/CinematicScene'
import VideoSection from '@/components/VideoSection'
import AnalyticsDemo from '@/components/AnalyticsDemo'
import Blog from '@/components/Blog'
import PricingSection from '@/components/ui/pricing-section'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <OrbitalServices />
      <Stats />
      <TechMarquee />
      <Services />
      <BeforeAfter />
      <IdeaToImpact />
      <OurStory />
      <About />
      <CinematicScene />
      <Projects />
      <ScrollMorphGallery />
      <Testimonials />
      <VideoSection />
      <AnalyticsDemo />
      <Blog />
      <PricingSection />
      <Contact />
      <Footer />
    </main>
  )
}
