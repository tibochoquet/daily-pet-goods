import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import { brandImages } from '@/lib/images'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Zwembaden & koelmatten voor honden',
  description:
    'Opvouwbare hondenzwembaden in drie maten (80, 120 en 160 cm) en een zelfkoelende koelmat van 30x40 cm. Geen pomp nodig, gewoon uitvouwen, vullen en genieten.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-pools' },
}

export default function DogPoolsPage() {
  const products = getProductsByCategory('dog-outdoor')
  return (
    <CategoryPage
      hero={{
        eyebrow: 'Zomer essentials',
        title: 'De zomer begint hier',
        description:
          'Premium verkoelende essentials, ontworpen om jouw hond comfortabel te houden tijdens warme zomerdagen. Opvouwbare zwembaden zonder pomp, en een zelfkoelende mat voor binnen en buiten.',
        ctaLabel: 'Shop de collectie',
        ctaHref: '/dog-pools#collectie',
        image: brandImages.dogPoolsCover,
        imageAlt: 'Hond naast een opvouwbaar zwembad en koelmat in de tuin',
        tags: [
          { label: 'Opvouwbaar Hondenzwembad', price: 37.99, href: '/products/opvouwbaar-hondenzwembad', top: '75%', left: '32%' },
          { label: 'Zelfkoelende Koelmat', price: 29.95, href: '/products/koelmat-hond', top: '85%', left: '84%' },
        ],
      }}
      breadcrumbLabel="Zwembaden & koelmatten"
      products={products}
    />
  )
}
