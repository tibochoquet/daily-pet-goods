import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Koelmatten voor katten — Zelfkoelende matten',
  description:
    'Zelfkoelende matten voor katten — geen water, stroom of vriezer nodig. Gewoon neerleggen en jouw kat geniet de hele zomer van een koele plek.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/cat-cooling' },
}

export default function CatCoolingPage() {
  const products = getProductsByCategory('cat-outdoor')
  return (
    <CategoryPage
      title="Koelmatten voor katten"
      description="Houd jouw kat aangenaam koel op warme dagen met onze zelfkoelende matten. Geen water, stroom of vriezer nodig — de mat activeert automatisch zodra jouw kat erop gaat liggen."
      products={products}
      category="cat-outdoor"
      breadcrumbLabel="Koelmatten katten"
    />
  )
}
