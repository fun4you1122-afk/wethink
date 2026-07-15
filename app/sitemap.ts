import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.wethink.ae',
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://www.wethink.ae/card',
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}
