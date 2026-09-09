import type { Metadata } from 'next'
import '../globals.css'

/**
 * The print stage for the company profile deck.
 *
 * No navbar, no footer, no floating chrome: this route exists so Chromium
 * can be pointed at it and asked for a PDF at exactly 16:9. It is kept out
 * of search results, since the PDF is the artefact people are meant to get.
 */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function DeckLayout({ children }: { children: React.ReactNode }) {
  return <div className="deck-root">{children}</div>
}
