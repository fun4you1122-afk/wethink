import Hero from '@/components/Hero'
import Welcome from '@/components/Welcome'
import CityBand from '@/components/CityBand'
import ScrollPath from '@/components/ScrollPath'
import BigOnPurpose from '@/components/BigOnPurpose'
import OrbitalServices from '@/components/OrbitalServices'
import Stats from '@/components/Stats'
import ClientLogos from '@/components/ClientLogos'
import Engagements from '@/components/Engagements'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <BigOnPurpose />
      <OrbitalServices />
      <ScrollPath className="mx-auto -mt-16 mb-2 h-[240px] max-w-[180px] sm:h-[320px]" />
      <CityBand />
      <Stats />
      <ClientLogos />
      <Engagements />
      <Contact />
    </>
  )
}
