import type { MetadataRoute } from 'next'
import { products } from '@/lib/products'
import { blogPosts } from '@/lib/blog'

const BASE_URL = 'https://www.dailypetgoods.nl'

/**
 * Only real, indexable content routes go here. Legal pages are deliberately
 * noindex (see their metadata), so they're deliberately left out too -
 * listing a noindex page in the sitemap sends search engines a
 * contradictory signal. Transactional pages (/checkout, /winkelwagen)
 * aren't content and don't belong in a sitemap either.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/honden`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/katten`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'yearly', priority: 0.4 },
  ]

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticRoutes, ...productRoutes, ...blogRoutes]
}
