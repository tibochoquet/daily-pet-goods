import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Zwembaden & koelmatten voor honden',
  description:
    'Opvouwbare hondenzwembaden in drie maten (80, 120 en 160 cm) en zelfkoelende koelmatten in S, M en L. Geen pomp nodig — uitvouwen, vullen en genieten.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-pools' },
}

export default function DogPoolsPage() {
  const products = getProductsByCategory('dog-outdoor')
  return (
    <CategoryPage
      title="Zwembaden & koelmatten"
      description="Houd jouw hond de hele zomer koel met onze opvouwbare zwembaden en zelfkoelende koelmatten. Geen pomp, geen gedoe — gewoon uitvouwen, vullen of neerleggen en genieten. Verkrijgbaar in meerdere maten voor elk ras."
      products={products}
      category="dog-outdoor"
      breadcrumbLabel="Zwembaden & koelmatten"
    />
  )
}
