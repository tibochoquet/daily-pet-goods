import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import { brandImages } from '@/lib/images'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Onderweg met je hond, autodekens, tuigjes & meer',
  description:
    'Alles wat je nodig hebt om te reizen met je hond. Een waterdichte achterbankbeschermer inclusief drinkfles en opvouwbare bak voor onderweg.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-travel' },
}

export default function DogTravelPage() {
  const products = getProductsByCategory('dog-travel')
  return (
    <CategoryPage
      hero={{
        eyebrow: 'Op avontuur',
        title: 'Overal thuis, ook onderweg',
        description:
          'Een waterdichte achterbankbeschermer die je auto beschermt en jouw hond een vertrouwde, comfortabele plek geeft, van de dagelijkse rit tot de lange vakantiereis.',
        ctaLabel: 'Bekijk de collectie',
        ctaHref: '/dog-travel#collectie',
        image: brandImages.dogTravelCover,
        imageAlt: 'Hond op een waterdichte achterbankbeschermer in de auto',
        tags: [
          { label: 'Achterbankbeschermer Auto', price: 34.99, href: '/products/achterbankbeschermer-auto', top: '65%', left: '50%' },
        ],
      }}
      breadcrumbLabel="Onderweg met je hond"
      products={products}
    />
  )
}
