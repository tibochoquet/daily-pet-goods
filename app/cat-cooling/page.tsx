import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Cat Cooling Mats — Self-Cooling Mats for Cats',
  description:
    'Self-cooling mats for cats — no water, electricity or freezer needed. Simply place and let your cat enjoy a cool spot all summer long.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/cat-cooling' },
}

export default function CatCoolingPage() {
  const products = getProductsByCategory('cat-outdoor')
  return (
    <CategoryPage
      title="Cat Cooling Mats"
      description="Keep your cat comfortably cool on warm days with our self-cooling mats. No water, electricity or freezer needed — the mat activates automatically when your cat lies down."
      products={products}
      category="cat-outdoor"
      breadcrumbLabel="Cat Cooling"
    />
  )
}
