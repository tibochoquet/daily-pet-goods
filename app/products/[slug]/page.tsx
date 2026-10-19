import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { products, startingPrice } from '@/lib/products'
import ProductDetailClient from './ProductDetailClient'
import JsonLd from '@/components/JsonLd'
import ProductReviews from '@/components/shop/ProductReviews'
import { SITE_URL } from '@/lib/business'
import { isDbConfigured } from '@/lib/db'
import { findPublishedReviewsForProduct, type ProductReviews as Reviews } from '@/lib/db/reviews'

/**
 * Reviews komen uit de database, dus de pagina kan niet puur statisch
 * blijven. Met ISR blijft hij snel en staat een zojuist goedgekeurde
 * review binnen vijf minuten op de site.
 */
export const revalidate = 300

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()

  const prices = product.variants.map((v) => v.price)
  const lowPrice = Math.min(...prices)
  const highPrice = Math.max(...prices)
  // No variant carries inStock: false today (no real inventory system
  // behind this yet), so this reads as available - but it's a real flag
  // now, not a hardcoded string. Any variant in the group being in stock
  // is enough to advertise the product as available.
  // Zonder database geen reviews, maar de pagina blijft gewoon werken.
  let reviews: Reviews = { items: [], aantal: 0, gemiddelde: 0 }
  if (isDbConfigured()) {
    try {
      reviews = await findPublishedReviewsForProduct(product.slug)
    } catch (err) {
      console.error(`Productpagina ${product.slug}: reviews ophalen mislukt:`, err)
    }
  }

  const anyInStock = product.variants.some((v) => v.inStock ?? true)
  const availability = anyInStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: product.variants.map((v) => `${SITE_URL}${v.image}`),
    offers:
      product.variants.length > 1
        ? {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            lowPrice: lowPrice.toFixed(2),
            highPrice: highPrice.toFixed(2),
            offerCount: product.variants.length,
            availability,
            url: `${SITE_URL}/products/${product.slug}`,
          }
        : {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: startingPrice(product).toFixed(2),
            availability,
            url: `${SITE_URL}/products/${product.slug}`,
          },
    // Alleen opnemen als er echt gepubliceerde reviews zijn. Een lege
    // aggregateRating of een waarde die afwijkt van wat de bezoeker op
    // de pagina ziet, is voor Google een reden om de hele vermelding te
    // negeren. Daarom komen beide uit dezelfde berekening.
    ...(reviews.aantal > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: reviews.gemiddelde,
            reviewCount: reviews.aantal,
            bestRating: 5,
            worstRating: 1,
          },
          review: reviews.items.map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.name },
            datePublished: r.createdAt.toISOString().slice(0, 10),
            reviewBody: r.text,
            reviewRating: {
              '@type': 'Rating',
              ratingValue: r.rating,
              bestRating: 5,
              worstRating: 1,
            },
          })),
        }
      : {}),
  }

  return (
    <>
      <JsonLd data={productSchema} />
      <ProductDetailClient product={product} />
      <ProductReviews {...reviews} />
    </>
  )
}
