import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { products, startingPrice } from '@/lib/products'
import ProductDetailClient from './ProductDetailClient'
import JsonLd from '@/components/JsonLd'

const BASE_URL = 'https://www.dailypetgoods.nl'

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
    alternates: { canonical: `${BASE_URL}/products/${product.slug}` },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()

  const prices = product.variants.map((v) => v.price)
  const lowPrice = Math.min(...prices)
  const highPrice = Math.max(...prices)

  // No stock/availability field exists anywhere in the product data model -
  // every product is implicitly always purchasable in this codebase, so
  // InStock is the only value that's actually true today. Flagged
  // separately: there's no real inventory tracking to keep this honest if
  // something actually sells out.
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: product.variants.map((v) => `${BASE_URL}${v.image}`),
    offers:
      product.variants.length > 1
        ? {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            lowPrice: lowPrice.toFixed(2),
            highPrice: highPrice.toFixed(2),
            offerCount: product.variants.length,
            availability: 'https://schema.org/InStock',
            url: `${BASE_URL}/products/${product.slug}`,
          }
        : {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: startingPrice(product).toFixed(2),
            availability: 'https://schema.org/InStock',
            url: `${BASE_URL}/products/${product.slug}`,
          },
  }

  return (
    <>
      <JsonLd data={productSchema} />
      <ProductDetailClient product={product} />
    </>
  )
}
