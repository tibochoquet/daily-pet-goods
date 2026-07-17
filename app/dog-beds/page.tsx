import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Hondenmanden, donut manden, lounge beds & Sambo manden',
  description:
    'Premium hondenmanden voor elke slaapstijl. Extra zachte pluche donut manden, de structurele Sambo mand in vier kleuren, en een ruim loungebed voor grote rassen.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-beds' },
}

/*
  ------------------------------------------------
  IMAGE BRIEF, hero (dog-beds)
  ------------------------------------------------
  Wide editorial lifestyle photograph.
  Calm Scandinavian bedroom corner, late afternoon light.
  A long-haired dachshund curled up asleep in a plush grey donut bed
  placed on a light wool rug.
  Soft warm sunlight casting long, gentle shadows across oak flooring.
  A folded knit throw beside the bed, one small potted plant in frame.
  Muted, warm colour palette: cream, taupe, soft grey.
  Feels quiet and intimate, editorial interiors magazine style.
  Luxury commercial photography, shallow depth of field.
  Aspect ratio 4:5, portrait orientation.
  ------------------------------------------------
*/

/*
  ------------------------------------------------
  IMAGE BRIEF, lifestyle section (dog-beds, loved by dogs)
  ------------------------------------------------
  Close, intimate editorial photograph.
  A golden retriever resting its head over the raised rim of a
  Sambo-style structured dog bed in sage green velvet fabric.
  Eyes half closed, completely relaxed expression.
  Soft window light from behind, gentle rim light on the fur.
  Blurred warm living room background, beige sofa visible out of focus.
  Emotional, tender mood, evokes comfort and trust.
  Luxury commercial pet photography.
  Aspect ratio 4:5, portrait orientation.
  ------------------------------------------------
*/

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
        imageAlt: 'Hond slaapt in een zachte donut mand in een rustige slaapkamer',
      }}
      lifestyleSection={{
        eyebrow: 'Geliefd door honden',
        title: 'Gemaakt om helemaal in weg te zakken',
        description:
          'Onze manden zijn getest op comfort, niet alleen op uiterlijk. Zachte vulling, opstaande randen voor geborgenheid, en stoffen die zowel honden als hun eigenaren mooi vinden.',
        imagePosition: 'right',
        imageAlt: 'Hond rust ontspannen in een structurele hondenmand',
      }}
      breadcrumbLabel="Hondenmanden"
      products={products}
    />
  )
}
