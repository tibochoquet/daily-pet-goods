import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Zwembaden & koelmatten voor honden',
  description:
    'Opvouwbare hondenzwembaden in drie maten (80, 120 en 160 cm) en een zelfkoelende koelmat van 30x40 cm. Geen pomp nodig, gewoon uitvouwen, vullen en genieten.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-pools' },
}

/*
  ------------------------------------------------
  IMAGE BRIEF, hero (dog-pools)
  ------------------------------------------------
  Wide editorial lifestyle photograph.
  Sunlit backyard garden, minimalist modern patio with light stone tiles.
  A dachshund mid-splash in a round, pale blue foldable dog pool.
  Warm bright summer daylight, slight golden tone.
  Soft green hedge and a single potted olive tree in the background.
  Feels joyful and premium at once, editorial summer campaign mood.
  Luxury commercial lifestyle photography, slightly elevated angle.
  Aspect ratio 4:5, portrait orientation.
  ------------------------------------------------
*/

/*
  ------------------------------------------------
  IMAGE BRIEF, lifestyle section (dog-pools, no pump needed)
  ------------------------------------------------
  Wide editorial lifestyle photograph.
  Modern Scandinavian living room, warm morning sunlight.
  A beautiful long-haired dachshund relaxing beside a folded blue
  cooling mat on light oak flooring.
  Minimal furniture, beige sofa, large windows with sheer curtains.
  Quiet, calm indoor counterpart to the outdoor pool hero image.
  Luxury commercial photography.
  Aspect ratio 4:5, portrait orientation.
  ------------------------------------------------
*/

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
        imageAlt: 'Hond speelt in een opvouwbaar zwembad in een zonnige tuin',
      }}
      lifestyleSection={{
        eyebrow: 'Moeiteloos verkoelend',
        title: 'Geen pomp, geen gedoe',
        description:
          'Uitvouwen, vullen of neerleggen, en klaar. Onze zwembaden en koelmat zijn ontworpen voor gemak, zodat er niets tussen jouw hond en een verkoelend moment in staat.',
        imagePosition: 'right',
        imageAlt: 'Hond ontspant naast een opgevouwen koelmat in een lichte woonkamer',
      }}
      breadcrumbLabel="Zwembaden & koelmatten"
      products={products}
    />
  )
}
