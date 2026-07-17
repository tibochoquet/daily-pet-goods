import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import { brandImages } from '@/lib/images'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Hondenbakken, verhoogde voerbakken & mangohouten bakken',
  description:
    'Premium hondenbakken en voerbakken: verhoogde voerstandaards, handgemaakte mangohouten bakken en minimalistische dubbele metalen voerbakken. Voor kleine tot grote rassen.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-bowls' },
}

export default function DogBowlsPage() {
  const products = getProductsByCategory('dog-feeding')
  return (
    <CategoryPage
      hero={{
        eyebrow: 'Voeding & comfort',
        title: 'Eten wordt een ritueel',
        description:
          'Verhoogde voerbakken en handgemaakte mangohouten bakken, ontworpen voor een natuurlijke eethouding en een net zo mooi plekje in huis als aan tafel.',
        ctaLabel: 'Bekijk de collectie',
        ctaHref: '/dog-bowls#collectie',
        image: brandImages.dogBowlsCover,
        imageAlt: 'Hond naast houten voerbakken met roestvrijstalen inzet',
        tags: [
          { label: 'Verhoogde Hondenbak', price: 34.99, href: '/products/verhoogde-hondenbak', top: '58%', left: '34%' },
          { label: 'Voerbak Mangohout', price: 24.99, href: '/products/voerbak-mangohout', top: '78%', left: '50%' },
        ],
      }}
      breadcrumbLabel="Hondenbakken"
      products={products}
    />
  )
}
