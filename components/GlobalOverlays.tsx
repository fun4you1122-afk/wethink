'use client'

import { usePathname } from 'next/navigation'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollProgress from '@/components/ScrollProgress'
import AiChat from '@/components/AiChat'

// The card and every Marhaba Thailand page carry their own chrome.
//
// The mini-game used to sit here too. Three floating things at once read as a
// showcase rather than a consultancy, and a "Let's Play" button on the
// services page is the wrong note for the people we sell to.
const HIDDEN_PREFIXES = ['/card', '/embassy']

export default function GlobalOverlays() {
  const pathname = usePathname()
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null
  return (
    <>
      <ScrollProgress />
      <WhatsAppButton />
      <AiChat />
    </>
  )
}
