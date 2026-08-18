import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.wethink.ae',
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://www.wethink.ae/services',
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.wethink.ae/work',
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.wethink.ae/about',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.wethink.ae/blog',
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://www.wethink.ae/card',
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: 'https://www.wethink.ae/embassy',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://www.wethink.ae/embassy/programme',
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]
}
