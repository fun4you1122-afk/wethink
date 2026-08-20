/* ────────────────────────────────────────────────────────────
   The Opening Ceremony ticket.

   Shared by the invitation page and the two wallet routes, so the
   name on the pass, the name in the QR code and the name on the
   page can never drift apart.

   There is no database behind this. A guest's reference is derived
   from their name, which means the same guest always gets the same
   reference without us storing anything about them.
   ──────────────────────────────────────────────────────────── */

export const CEREMONY_EVENT = {
  host: 'The Royal Thai Embassy, Abu Dhabi',
  title: 'Opening Ceremony',
  festival: 'Marhaba Thailand',
  subtitle: 'Creating Your Own Thai Experience',
  day: 'Friday 11 September 2026',
  time: '17:00 – 18:00 hrs',
  venue: 'Main Atrium, Ground Floor (near Zara)',
  venueFull: 'Reem Mall, Abu Dhabi',
  start: '2026-09-11T17:00:00+04:00',
  end: '2026-09-11T18:00:00+04:00',
  lat: 24.4995,
  lon: 54.4055,
} as const

export const SITE = 'https://www.wethink.ae'
export const INVITE_PATH = '/embassy/opening'

/** Crockford-style alphabet: no I, L, O or U, so nothing reads as a digit. */
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

/**
 * A stable six-character reference for a guest.
 *
 * FNV-1a over the normalised name. Deliberately plain JavaScript so the
 * page and the pass routes compute it identically, and deliberately not
 * a secret: it identifies a seat, it does not protect one.
 */
export function guestReference(name: string): string {
  const key = name.trim().toLowerCase().replace(/\s+/g, ' ')
  // two FNV-1a passes with different offsets; three characters from each,
  // which is more spread than one 32-bit hash would give across six
  const fnv = (offset: number) => {
    let h = offset
    for (let i = 0; i < key.length; i++) {
      h ^= key.charCodeAt(i)
      h = Math.imul(h, 0x01000193) >>> 0
    }
    return h
  }
  const chunk = (h: number) => {
    let out = ''
    // fold the high bits down before taking fifteen, which is exactly
    // three base-32 characters, so the whole hash contributes
    let n = (h ^ (h >>> 15) ^ (h >>> 30)) & 0x7fff
    for (let i = 0; i < 3; i++) {
      out = ALPHABET[n % 32] + out
      n = Math.floor(n / 32)
    }
    return out
  }
  return chunk(fnv(0x811c9dc5)) + chunk(fnv(0x27d4eb2f))
}

/** Tidy a name arriving from a query string before it reaches a pass. */
export function cleanName(raw: string | null | undefined): string {
  if (!raw) return ''
  return raw
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60)
}

/** The guest's own copy of the invitation, which is what the QR opens. */
export function inviteUrl(name: string): string {
  const base = `${SITE}${INVITE_PATH}`
  return name ? `${base}?to=${encodeURIComponent(name)}` : base
}

/** What a scanner reads off the pass. */
export function ticketPayload(name: string): string {
  return inviteUrl(name)
}
