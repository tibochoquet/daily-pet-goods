import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import { brandImages } from '@/lib/images'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Hondenmanden, donut manden, lounge beds & Sambo manden',
  description:
    'Premium hondenmanden voor elke slaapstijl. Extra zachte pluche donut manden, de structurele Sambo mand in vier kleuren, en een ruim loungebed voor grote rassen.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-beds' },
}

export default function DogBedsPage() {
  const products = getProductsByCategory('dog-beds')
  return (
    <CategoryPage
      hero={{
        eyebrow: 'Rust & comfort',
        title: 'Een plek om helemaal tot rust te komen',
        description:
          'Van zachte pluche donut manden tot de structurele Sambo mand en een ruim loungebed. Elke mand is ontworpen voor een goede nachtrust en een mooi plekje in huis.',
        ctaLabel: 'Bekijk de collectie',
        ctaHref: '/dog-beds#collectie',
        image: brandImages.dogBedsCover,
        imageAlt: 'Honden rustend in pluche donut- en loungemanden in een woonkamer',
        tags: [
          { label: 'Hondenmand Donut', price: 49.99, href: '/products/hondenmand-donut', top: '70%', left: '37%' },
          { label: 'Hondenmand Lounge', price: 49.99, href: '/products/hondenmand-lounge', top: '75%', left: '77%' },
        ],
      }}
      breadcrumbLabel="Hondenmanden"
      products={products}
    />
  )
}
