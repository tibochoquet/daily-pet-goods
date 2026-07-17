import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import { brandImages } from '@/lib/images'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Koelmatten voor katten, zelfkoelende matten',
  description:
    'Zelfkoelende matten voor katten, geen water, stroom of vriezer nodig. Gewoon neerleggen en jouw kat geniet de hele zomer van een koele plek.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/cat-cooling' },
}

export default function CatCoolingPage() {
  const products = getProductsByCategory('cat-outdoor')
  return (
    <CategoryPage
      hero={{
        eyebrow: 'Zomerse verkoeling',
        title: 'Cool blijven, moeiteloos',
        description:
          'Houd jouw kat aangenaam koel op warme dagen met onze zelfkoelende mat. Geen water, stroom of vriezer nodig. De mat activeert automatisch zodra jouw kat erop gaat liggen.',
        ctaLabel: 'Bekijk de mat',
        ctaHref: '/cat-cooling#collectie',
        image: brandImages.catCoolingCover,
        imagePosition: 'object-[58%_60%]',
        imageAlt: 'Kat ligt ontspannen op een zelfkoelende mat',
      }}
      breadcrumbLabel="Koelmatten katten"
      products={products}
    />
  )
}
