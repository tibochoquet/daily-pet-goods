import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import { brandImages } from '@/lib/images'
import CategoryGroupPage from '@/components/shop/CategoryGroupPage'

export const metadata: Metadata = {
  title: 'Honden, alle producten voor jouw hond',
  description:
    'Alles voor jouw hond op één plek: verhoogde voerbakken, hondenmanden, reisbenodigdheden en zomerse zwembaden & koelmatten.',
  alternates: { canonical: '/honden' },
}

export default function HondenPage() {
  return (
    <CategoryGroupPage
      sections={[
        {
          id: 'hondenbakken',
          navLabel: 'Hondenbakken',
          breadcrumbLabel: 'Hondenbakken',
          hero: {
            eyebrow: 'Voeding & comfort',
            title: 'Eten wordt een ritueel',
            description:
              'Verhoogde voerbakken en handgemaakte mangohouten bakken, ontworpen voor een natuurlijke eethouding en een net zo mooi plekje in huis als aan tafel.',
            ctaLabel: 'Bekijk de collectie',
            ctaHref: '/honden#hondenbakken',
            image: brandImages.dogBowlsCover,
            imageAlt: 'Hond naast houten voerbakken met roestvrijstalen inzet',
            tags: [
              { label: 'Verhoogde Hondenbak', price: 34.99, href: '/products/verhoogde-hondenbak', top: '58%', left: '34%' },
              { label: 'Voerbak Mangohout', price: 24.99, href: '/products/voerbak-mangohout', top: '78%', left: '50%' },
            ],
          },
          products: getProductsByCategory('dog-feeding'),
        },
        {
          id: 'hondenmanden',
          navLabel: 'Hondenmanden',
          breadcrumbLabel: 'Hondenmanden',
          hero: {
            eyebrow: 'Rust & comfort',
            title: 'Een plek om helemaal tot rust te komen',
            description:
              'Van zachte pluche donut manden tot de structurele Sambo mand en een ruim loungebed. Elke mand is ontworpen voor een goede nachtrust en een mooi plekje in huis.',
            ctaLabel: 'Bekijk de collectie',
            ctaHref: '/honden#hondenmanden',
            image: brandImages.dogBedsCover,
            imageAlt: 'Honden rustend in pluche donut- en loungemanden in een woonkamer',
            tags: [
              { label: 'Hondenmand Donut', price: 49.99, href: '/products/hondenmand-donut', top: '70%', left: '37%' },
              { label: 'Hondenmand Lounge', price: 49.99, href: '/products/hondenmand-lounge', top: '75%', left: '77%' },
            ],
          },
          products: getProductsByCategory('dog-beds'),
        },
        {
          id: 'onderweg',
          navLabel: 'Onderweg met je hond',
          breadcrumbLabel: 'Onderweg met je hond',
          hero: {
            eyebrow: 'Op avontuur',
            title: 'Overal thuis, ook onderweg',
            description:
              'Een waterdichte achterbankbeschermer die je auto beschermt en jouw hond een vertrouwde, comfortabele plek geeft, van de dagelijkse rit tot de lange vakantiereis.',
            ctaLabel: 'Bekijk de collectie',
            ctaHref: '/honden#onderweg',
            image: brandImages.dogTravelCover,
            imageAlt: 'Hond op een waterdichte achterbankbeschermer in de auto',
            tags: [
              { label: 'Achterbankbeschermer Auto', price: 34.99, href: '/products/achterbankbeschermer-auto', top: '65%', left: '50%' },
            ],
          },
          products: getProductsByCategory('dog-travel'),
        },
        {
          id: 'zwembaden',
          navLabel: 'Zwembaden & koelmatten',
          breadcrumbLabel: 'Zwembaden & koelmatten',
          hero: {
            eyebrow: 'Zomer essentials',
            title: 'De zomer begint hier',
            description:
              'Premium verkoelende essentials, ontworpen om jouw hond comfortabel te houden tijdens warme zomerdagen. Opvouwbare zwembaden zonder pomp, en een zelfkoelende mat voor binnen en buiten.',
            ctaLabel: 'Shop de collectie',
            ctaHref: '/honden#zwembaden',
            image: brandImages.dogPoolsCover,
            imageAlt: 'Hond naast een opvouwbaar zwembad en koelmat in de tuin',
            tags: [
              { label: 'Opvouwbaar Hondenzwembad', price: 37.99, href: '/products/opvouwbaar-hondenzwembad', top: '75%', left: '32%' },
              { label: 'Zelfkoelende Koelmat', price: 29.95, href: '/products/koelmat-hond', top: '85%', left: '84%' },
            ],
          },
          products: getProductsByCategory('dog-outdoor'),
        },
      ]}
    />
  )
}
