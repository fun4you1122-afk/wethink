'use client'

import { useEffect } from 'react'

const isStaleChunkError = (error: Error) =>
  /ChunkLoadError|Loading chunk|dynamically imported module|import\(\) failed/i.test(
    `${error.name} ${error.message}`
  )

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    if (isStaleChunkError(error) && !sessionStorage.getItem('chunk-reloaded')) {
      sessionStorage.setItem('chunk-reloaded', '1')
      window.location.reload()
    }
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
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
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <img src="/logo.png" alt="WeThink" width={72} height={72} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Something went wrong</h2>
        <p style={{ color: '#52677A', maxWidth: '32rem' }}>
          Sorry — the site hit a snag. Reloading usually fixes it. If it keeps happening,
          reach us at info@wethink.ae.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.85rem 2rem',
            background: 'linear-gradient(135deg, #14B8A6 0%, #7C3AED 100%)',
            color: '#fff',
            fontWeight: 700,
            borderRadius: 50,
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Reload page
        </button>
      </body>
    </html>
  )
}
