import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import { brandImages } from '@/lib/images'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Kattenbakken, mangohout & metalen voerstations',
  description:
    'Prachtige voerstations voor katten: handgemaakte dubbele mangohouten voerbakken en minimalistische metalen kattenbakken. Ontworpen voor comfort en een mooi interieur.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/cat-bowls' },
}

export default function CatBowlsPage() {
  const products = getProductsByCategory('cat-feeding')
  return (
    <CategoryPage
      hero={{
        eyebrow: 'Voor jouw kat',
        title: 'Kleine details, groot verschil',
        description:
          'Voerstations die net zo mooi als functioneel zijn. Onze mangohouten en metalen kattenbakken passen naadloos in huis en geven jouw kat een comfortabele, whisker-vriendelijke eetplek.',
        ctaLabel: 'Bekijk de collectie',
        ctaHref: '/cat-bowls#collectie',
        image: brandImages.catBowlsCover,
        imagePosition: 'object-[62%_55%]',
        imageAlt: 'Kat naast een mangohouten voerstation in een lichte woonkamer',
      }}
      breadcrumbLabel="Kattenbakken"
      products={products}
    />
  )
}
