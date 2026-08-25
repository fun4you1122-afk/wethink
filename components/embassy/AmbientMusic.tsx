'use client'

import { useEffect, useRef, useState } from 'react'
import { Music, Pause } from 'lucide-react'

/**
 * A quiet piphat loop the guest can turn on.
 *
 * Deliberately off until asked. Browsers block audio that starts by itself, so
 * a page that tries either fails silently or, worse, succeeds for the one
 * person opening it on a train. A labelled control is the only version that
 * behaves the same for everyone.
 *
 * The file is fetched only once someone presses play, so nobody pays for it in
 * page weight who never wanted it. The credit line is not decoration either:
 * the recording is CC BY-SA and attribution is a condition of using it.
 */

type Props = {
  src: string
  title: string
  author: string
  licence: string
  licenceUrl: string
  sourceUrl: string
}

export default function AmbientMusic({
  src,
  title,
  author,
  licence,
  licenceUrl,
  sourceUrl,
}: Props) {
  const ref = useRef<HTMLAudioElement>(null)
  const [on, setOn] = useState(false)

  const toggle = () => {
    const el = ref.current
    if (!el) return
    if (on) {
      el.pause()
      setOn(false)
      return
    }
    el.volume = 0.35
    el.play().then(
      () => setOn(true),
      () => setOn(false), // refused, and the page carries on without it
    )
  }

  // stop when the guest leaves the tab rather than playing to an empty room
  useEffect(() => {
    const onHide = () => {
      if (document.hidden && ref.current && !ref.current.paused) {
        ref.current.pause()
        setOn(false)
      }
    }
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [])

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        className="inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-[12.5px] font-medium uppercase tracking-[0.08em] transition-colors"
        style={{
          borderColor: 'rgba(3,122,138,0.30)',
          color: '#015866',
          background: on ? 'rgba(1,193,213,0.12)' : 'rgba(255,255,255,0.6)',
        }}
      >
        {on ? <Pause className="h-3.5 w-3.5" /> : <Music className="h-3.5 w-3.5" />}
        {on ? 'Pause the music' : 'Play Thai music'}
      </button>

      {/* Credit is a condition of the licence, so it is always on the page
          rather than appearing only once someone presses play. */}
      <p className="text-center text-[10.5px] leading-relaxed" style={{ color: '#6b8f97' }}>
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline" style={{ color: 'inherit' }}>
            {title}
          </a>{' '}
          by {author} ·{' '}
          <a href={licenceUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline" style={{ color: 'inherit' }}>
            {licence}
          </a>
        </p>

      {/* src is set from the start but preload is none, so nothing downloads
          until play is pressed. Setting it on click instead raced React: the
          element still had no source when play() was called, and it rejected. */}
      <audio ref={ref} src={src} loop preload="none" />
    </div>
  )
}
