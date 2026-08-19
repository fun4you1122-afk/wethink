'use client'

import { useEffect, useState } from 'react'

/**
 * Personalises an invitation from the link itself.
 *
 *   /embassy/opening?to=Ahmed%20Al%20Mansoori
 *
 * The Embassy sends one link per guest and the invitation greets them by name.
 * Read from window rather than useSearchParams so the page stays statically
 * rendered, and trimmed hard because it is visitor-supplied text.
 */
export function useGuestName(): string | null {
  const [guest, setGuest] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = new URLSearchParams(window.location.search).get('to')
      if (!raw) return
      const clean = raw
        .replace(/[<>{}\\/]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 42)
      if (clean) setGuest(clean)
    } catch {
      /* malformed query string, stay generic */
    }
  }, [])

  return guest
}
