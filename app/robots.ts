import type { MetadataRoute } from 'next'
import { SITE_URL, isTestEnvironment } from '@/lib/business'

export default function robots(): MetadataRoute.Robots {
  // A test deployment serves the same shop on another host. Letting it be
  // crawled would put a second, identical catalogue in the index that
  // competes with the real one, so it asks crawlers to stay out entirely
  // and publishes no sitemap.
  if (isTestEnvironment()) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
