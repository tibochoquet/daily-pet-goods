import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Cat Bowls — Mango Wood & Metal Feeding Stations',
  description:
    'Beautiful feeding stations for cats: handcrafted mango wood double feeders and minimalist metal cat feeders. Designed for comfort and your home aesthetic.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/cat-bowls' },
}

export default function CatBowlsPage() {
  const products = getProductsByCategory('cat-feeding')
  return (
    <CategoryPage
      title="Cat Bowls & Feeders"
      description="Feeding stations as beautiful as they are functional. Our mango wood and metal cat feeders fit seamlessly into your home while giving your cat a comfortable place to eat."
      products={products}
      category="cat-feeding"
      breadcrumbLabel="Cat Bowls"
    />
  )
}
