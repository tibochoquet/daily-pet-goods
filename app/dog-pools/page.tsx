import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Foldable Dog Pools — Summer Splash Pools in 80, 120 & 160 cm',
  description:
    'Foldable dog pools in three sizes: 80 cm for small dogs, 120 cm for medium dogs, and 160 cm for large breeds. No inflation needed — unfold, fill, and enjoy.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-pools' },
}

export default function DogPoolsPage() {
  const products = getProductsByCategory('dog-outdoor')
  return (
    <CategoryPage
      title="Dog Pools"
      description="Keep your dog cool all summer with our foldable splash pools. No pump, no fuss — just unfold, fill, and watch them splash. Available in three sizes for every breed."
      products={products}
      category="dog-outdoor"
      breadcrumbLabel="Dog Pools"
    />
  )
}
