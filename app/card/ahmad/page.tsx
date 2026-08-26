'use client'

import DigitalCard, { type CardPerson } from '@/components/DigitalCard'

const AHMAD: CardPerson = {
  name: 'Ahmad Saeed',
  role: 'Founder',
  company: 'WeThink',
  tagline: 'Digital Smart Solutions',
  email: 'info@wethink.ae',
  phone: '+971501882882',
  phoneDisplay: '+971 50 188 2882',
  website: 'https://www.wethink.ae',
  websiteDisplay: 'www.wethink.ae',
  instagram: 'https://instagram.com/wethink.ae',
  linkedinHref: 'https://www.linkedin.com/in/ahmadsmaf',
  whatsapp: 'https://wa.me/971501882882',
  location: 'Makers District, Abu Dhabi, UAE',
  cardUrl: 'https://www.wethink.ae/card/ahmad',
  cardUrlDisplay: 'wethink.ae/card/ahmad',
  vcardFile: 'Ahmad-Saeed-WeThink.vcf',
  photo: '/ahmad-saeed.jpg',
}

export default function AhmadCardPage() {
  return <DigitalCard INFO={AHMAD} />
}
