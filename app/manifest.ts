import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WeThink | Digital Smart Solutions',
    short_name: 'WeThink',
    description:
      'IT consulting, digital transformation, cloud, cybersecurity, and custom software in Abu Dhabi, UAE.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050310',
    theme_color: '#7C3AED',
    icons: [{ src: '/icon.png', sizes: '512x512', type: 'image/png' }],
  }
}
