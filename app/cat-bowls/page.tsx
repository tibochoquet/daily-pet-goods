import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Kattenbakken, mangohout & metalen voerstations',
  description:
    'Prachtige voerstations voor katten: handgemaakte dubbele mangohouten voerbakken en minimalistische metalen kattenbakken. Ontworpen voor comfort en een mooi interieur.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/cat-bowls' },
}

/*
  ------------------------------------------------
  IMAGE BRIEF, hero (cat-bowls)
  ------------------------------------------------
  Wide editorial lifestyle photograph.
  Bright Scandinavian living corner with a low wooden sideboard.
  A grey British Shorthair cat sitting beside a mangohout double
  feeding station with visible stainless steel bowl inserts.
  Soft midday light from a sheer-curtained window.
  Neutral palette: warm white walls, oak wood, muted sage green textile
  draped over a nearby chair.
  Minimal styling, no clutter.
  Luxury commercial product photography, shallow depth of field.
  Aspect ratio 4:5, portrait orientation.
  ------------------------------------------------
*/

/*
  ------------------------------------------------
  IMAGE BRIEF, lifestyle section (cat-bowls, designed for everyday life)
  ------------------------------------------------
  Editorial interior photograph, slightly elevated angle.
  A styled kitchen counter corner featuring a mangohout cat feeder
  with two RVS bowls, one holding water, one holding kibble.
  Small potted herb plant beside it.
  Warm cream tile backsplash, brass tap visible at edge of frame.
  Soft natural window light, late afternoon warmth.
  Feels like a genuine, lived-in home rather than a studio set.
  Luxury commercial photography.
  Aspect ratio 4:5, portrait orientation.
  ------------------------------------------------
*/

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
        imageAlt: 'Kat naast een mangohouten voerstation in een lichte woonkamer',
      }}
      lifestyleSection={{
        eyebrow: 'Elke dag',
        title: 'Gemaakt om te gebruiken, niet om weg te stoppen',
        description:
          'Een voerbak hoeft niet in de weg te staan. Onze stukken zijn ontworpen om mee te bewegen met jouw interieur, van het aanrecht tot de vloer, zodat etenstijd nooit een onderbreking van de sfeer in huis is.',
        imagePosition: 'left',
        imageAlt: 'Kattenvoerbak op een aanrecht in een warm ingerichte keuken',
      }}
      breadcrumbLabel="Kattenbakken"
      products={products}
    />
  )
}
