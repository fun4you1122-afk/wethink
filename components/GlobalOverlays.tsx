'use client'

import { usePathname } from 'next/navigation'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollProgress from '@/components/ScrollProgress'
import AiChat from '@/components/AiChat'

// The card and every Marhaba Thailand page carry their own chrome, and the
// deck is a print stage: a floating chat bubble would be printed into the PDF.

const HIDDEN_PREFIXES = ['/card', '/embassy', '/deck']

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
