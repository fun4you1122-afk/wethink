'use client'

import DigitalCard, { type CardPerson } from '@/components/DigitalCard'

const RASHA: CardPerson = {
  name: 'Rasha Aljalam',
  role: 'CEO & Founder',
  company: 'WeThink',
  tagline: 'Digital Smart Solutions',
  email: 'info@wethink.ae',
  phone: '+971503125078',
  phoneDisplay: '+971 50 312 5078',
  website: 'https://www.wethink.ae',
  websiteDisplay: 'www.wethink.ae',
  instagram: 'https://instagram.com/wethink.ae',
  linkedinHref: 'https://ae.linkedin.com/in/rasha-aljalam-74a6b4188',
  whatsapp: 'https://wa.me/971503125078',
  location: 'Makers District, Abu Dhabi, UAE',
  cardUrl: 'https://www.wethink.ae/card',
  cardUrlDisplay: 'wethink.ae/card',
  vcardFile: 'Rasha-Aljalam-WeThink.vcf',
}

export default function CardPage() {
  return <DigitalCard INFO={RASHA} />
}
