import type { Metadata } from 'next'
import credits from '@/public/context/credits.json'

export const metadata: Metadata = {
  title: 'Photo Credits | WeThink',
  description:
    'Photographers and licences for the photography used on wethink.ae, and a note on which images are ours.',
  alternates: { canonical: '/credits' },
  robots: { index: false, follow: true },
}

type Credit = {
  file: string
  title: string
  author: string
  licence: string
  licenceUrl: string
  source: string
}

export default function CreditsPage() {
  const list = credits as Credit[]

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32 text-white">
      <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight">Photo Credits</h1>
      <p className="mt-5 leading-relaxed text-white/65">
        Screenshots of our own work, our logo, and portraits of our team are ours. The photographs
        of Abu Dhabi that set the scene were taken by the photographers below and are used under
        their licences. They are there for place, not to represent our offices, our staff, or our
        clients.
      </p>

      <ul className="mt-10 list-none space-y-6">
        {list.map((c) => (
          <li key={c.file} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-sm font-semibold">{c.title || c.file}</div>
            <div className="mt-1 text-sm text-white/60">
              Photograph by {c.author}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
              <a
                href={c.licenceUrl || 'https://creativecommons.org/'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-300 no-underline hover:underline"
              >
                {c.licence}
              </a>
              <a
                href={c.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/45 no-underline hover:text-white/80"
              >
                Source
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
