import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import { brandImages } from '@/lib/images'
import CategoryGroupPage from '@/components/shop/CategoryGroupPage'

export const metadata: Metadata = {
  title: 'Katten, alle producten voor jouw kat',
  description:
    'Alles voor jouw kat op één plek: mangohouten en metalen voerstations en zelfkoelende matten voor warme dagen.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/katten' },
}

export default function KattenPage() {
  return (
    <CategoryGroupPage
      title="Katten"
      intro="Stijlvolle eetplekken en verkoelend comfort: alles voor jouw kat, zorgvuldig samengebracht op één plek."
      sections={[
        {
          id: 'kattenbakken',
          navLabel: 'Kattenbakken',
          breadcrumbLabel: 'Kattenbakken',
          hero: {
            eyebrow: 'Voor jouw kat',
            title: 'Kleine details, groot verschil',
            description:
              'Voerstations die net zo mooi als functioneel zijn. Onze mangohouten en metalen kattenbakken passen naadloos in huis en geven jouw kat een comfortabele, whisker-vriendelijke eetplek.',
            ctaLabel: 'Bekijk de collectie',
            ctaHref: '/katten#kattenbakken',
            image: brandImages.catBowlsCover,
            imageAlt: 'Kat naast een mangohouten voerstation in een lichte woonkamer',
            tags: [
              { label: 'Dubbele Kattenvoerbak Metaal', price: 34.99, href: '/products/dubbele-kattenvoerbak-metaal', top: '76%', left: '45%' },
            ],
          },
          products: getProductsByCategory('cat-feeding'),
        },
        {
          id: 'koelmatten',
          navLabel: 'Koelmatten',
          breadcrumbLabel: 'Koelmatten katten',
          hero: {
            eyebrow: 'Zomerse verkoeling',
            title: 'Cool blijven, moeiteloos',
            description:
              'Houd jouw kat aangenaam koel op warme dagen met onze zelfkoelende mat. Geen water, stroom of vriezer nodig. De mat activeert automatisch zodra jouw kat erop gaat liggen.',
            ctaLabel: 'Bekijk de mat',
            ctaHref: '/katten#koelmatten',
            image: brandImages.catCoolingCover,
            imageAlt: 'Kat ligt ontspannen op een zelfkoelende mat',
            tags: [
              { label: 'Koelmat voor Katten', price: 29.99, href: '/products/koelmat-kat', top: '78%', left: '55%' },
            ],
          },
          products: getProductsByCategory('cat-outdoor'),
        },
      ]}
    />
  )
}
