'use client'

import { usePathname } from 'next/navigation'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollProgress from '@/components/ScrollProgress'
import AiChat from '@/components/AiChat'
import GameTab from '@/components/GameTab'

const HIDDEN_ON = ['/card']

export default function GlobalOverlays() {
  const pathname = usePathname()
  if (HIDDEN_ON.includes(pathname)) return null
  return (
    <>
      <ScrollProgress />
      <WhatsAppButton />
      <AiChat />
      <GameTab />
    </>
  )
}
