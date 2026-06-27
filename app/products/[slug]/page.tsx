import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { products } from '@/lib/products'
import ProductDetailClient from './ProductDetailClient'

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
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()
  return <ProductDetailClient product={product} />
}
