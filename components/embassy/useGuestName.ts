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

/**
 * The invited name, read straight from the URL.
 *
 * Browser only. Anything deciding inside an effect should use this rather than
 * the hook below, whose first render is necessarily null and would otherwise
 * race that decision.
 */
export function readGuestName(): string {
  try {
    const raw = new URLSearchParams(window.location.search).get('to')
    if (!raw) return ''
    return raw
      .replace(/[<>{}\\/]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 42)
  } catch {
    return '' // malformed query string, stay generic
  }
}

export function useGuestName(): string | null {
  const [guest, setGuest] = useState<string | null>(null)

  useEffect(() => {
    const clean = readGuestName()
    if (clean) setGuest(clean)
  }, [])

  return guest
}
