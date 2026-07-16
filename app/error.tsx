'use client'

import { useEffect } from 'react'

const isStaleChunkError = (error: Error) =>
  /ChunkLoadError|Loading chunk|dynamically imported module|import\(\) failed/i.test(
    `${error.name} ${error.message}`
  )

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // A new deploy invalidated this session's JS chunks — one reload fixes it.
    if (isStaleChunkError(error) && !sessionStorage.getItem('chunk-reloaded')) {
      sessionStorage.setItem('chunk-reloaded', '1')
      window.location.reload()
    }
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        background: '#F6FAF9',
        color: '#10232E',
        textAlign: 'center',
        padding: '2rem',
        fontFamily: 'inherit',
      }}
    >
      <img src="/logo.png" alt="WeThink" width={72} height={72} />
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Something went wrong</h2>
      <p style={{ color: '#52677A', maxWidth: '32rem' }}>
        Sorry — this page hit a snag. Reloading usually fixes it. If it keeps happening,
        reach us at info@wethink.ae.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Reload page
        </button>
        <button onClick={reset} className="btn-outline">
          Try again
        </button>
      </div>
    </div>
  )
}
