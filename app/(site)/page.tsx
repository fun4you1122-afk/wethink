import Hero from '@/components/Hero'
import Welcome from '@/components/Welcome'
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
      <BigOnPurpose />
      <OrbitalServices />
      <Stats />
      <ClientLogos />
      <Testimonials />
      <Contact />
    </>
  )
}
