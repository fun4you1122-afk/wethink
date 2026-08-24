'use client'

import { usePathname } from 'next/navigation'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollProgress from '@/components/ScrollProgress'
import AiChat from '@/components/AiChat'
import GameTab from '@/components/GameTab'

// The card and every Marhaba Thailand page carry their own chrome.

const HIDDEN_PREFIXES = ['/card', '/embassy']

export default function GlobalOverlays() {
  const pathname = usePathname()
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null
  return (
    <>
      <ScrollProgress />
      <WhatsAppButton />
      <AiChat />
      <GameTab />
    </>
  )
}
