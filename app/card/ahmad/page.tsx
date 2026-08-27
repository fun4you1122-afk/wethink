'use client'

import DigitalCard, { type CardPerson, type CardTheme } from '@/components/DigitalCard'

/**
 * The supplied palette, translated to what the card actually paints.
 *
 * It arrived as Tailwind v4 tokens with an `@theme inline` block, and this
 * project is on v3, so rather than adding shadcn variables the whole site
 * would inherit, the values are read straight into the card's own theme. That
 * also keeps it off Rasha's card, which stays violet.
 *
 * Gold on near-black measures 9.90:1, and the dark label on a gold button the
 * same, so the palette holds up without adjustment. The banner keeps the
 * theme's own chart ramp rather than the old teal-to-magenta nodes.
 */
const GOLD: CardTheme = {
  bg: '#09090b',
  surface: '#101013',
  banner: '#09090b',
  bannerNodes: ['#e3af35', '#c2820a', '#e38935', '#7a4e05', '#f0cd7a'],
  primary: '#e3af35',
  primaryDeep: '#c2820a',
  // primary-foreground from the palette: dark text on gold, not white
  primaryFg: '#09090b',
  primaryRgb: '227,175,53',
  accentSoft: '#f0cd7a',
  mutedFg: '#a1a1aa',
}

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
  theme: GOLD,
  brief: {
    video: {
      src: '/video/wethink-grow.mp4',
      poster: '/video/wethink-grow-poster.jpg',
      label: 'WeThink — Ready to grow?',
    },
    services: [
      'Digital Transformation & AI',
      'Data Analytics & Decision Intelligence',
      'Business Systems & Digital Platforms',
      'Strategy, Transformation & Optimization',
      'Brand, Events & Media',
    ],
    action: {
      label: 'Start a conversation',
      href: 'https://wa.me/971501882882?text=' +
        encodeURIComponent('Hi Ahmad, I just scanned your card.'),
    },
  },
}

export default function AhmadCardPage() {
  return <DigitalCard INFO={AHMAD} />
}
