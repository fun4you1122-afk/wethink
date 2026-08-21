import Hero from '@/components/Hero'
import Welcome from '@/components/Welcome'
import FeaturedCase from '@/components/FeaturedCase'
import CityBand from '@/components/CityBand'
import BigOnPurpose from '@/components/BigOnPurpose'
import OrbitalServices from '@/components/OrbitalServices'
import Stats from '@/components/Stats'
import ClientLogos from '@/components/ClientLogos'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <FeaturedCase />
      <BigOnPurpose />
      <OrbitalServices />
      <CityBand />
      <Stats />
      <ClientLogos />
      <Testimonials />
      <Contact />
    </>
  )
}
