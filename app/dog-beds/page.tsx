import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Dog Beds — Plush Donut Beds, Lounge Beds & Sambo Beds',
  description:
    'Premium dog beds for every sleeping style. Ultra-soft plush donut beds in 80 and 90 cm, structured Sambo beds in 4 colours, and spacious lounge beds for large breeds.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-beds' },
}

export default function DogBedsPage() {
  const products = getProductsByCategory('dog-beds')
  return (
    <CategoryPage
      title="Dog Beds"
      description="A great night's sleep starts with the right bed. Whether your dog loves to curl up in a cosy donut or stretch out on a spacious lounge bed, we have the perfect spot for them."
      products={products}
      category="dog-beds"
      breadcrumbLabel="Dog Beds"
    />
  )
}
