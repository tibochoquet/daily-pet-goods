import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Onderweg met je hond, autodekens, tuigjes & meer',
  description:
    'Alles wat je nodig hebt om te reizen met je hond. Een waterdichte achterbankbeschermer inclusief drinkfles en opvouwbare bak voor onderweg.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-travel' },
}

/*
  ------------------------------------------------
  IMAGE BRIEF, hero (dog-travel)
  ------------------------------------------------
  Wide editorial lifestyle photograph.
  Open car trunk on a gravel driveway, golden hour sunlight.
  A vizsla or dachshund sitting on a stylish waterproof charcoal
  achterbankbeschermer laid across the folded-down back seat.
  Warm blurred greenery visible through the car windows.
  A folded wool travel blanket and a stainless steel travel bottle
  placed neatly beside the dog.
  Adventure-but-elegant mood, warm tones, soft natural light.
  Luxury commercial lifestyle photography.
  Aspect ratio 4:5, portrait orientation.
  ------------------------------------------------
*/

/*
  ------------------------------------------------
  IMAGE BRIEF, lifestyle section (dog-travel, everyday adventures)
  ------------------------------------------------
  Close editorial detail photograph.
  Top-down view of a car back seat fitted with a black achterbank-
  beschermer, a collapsible travel bowl and a stainless steel water
  bottle arranged neatly on top.
  Soft diffused daylight, slightly cool tone to suggest a road trip morning.
  Minimal, considered styling, no visible brand logos.
  Luxury commercial product photography.
  Aspect ratio 4:5, portrait orientation.
  ------------------------------------------------
*/

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
        imageAlt: 'Hond op een waterdichte achterbankbeschermer in de kofferbak',
      }}
      lifestyleSection={{
        eyebrow: 'Altijd voorbereid',
        title: 'Klaar voor elk uitje',
        description:
          'Inclusief een drinkfles en opvouwbare voer- en drinkbak, zodat je nooit zonder zit tijdens een wandeling, roadtrip of weekendje weg.',
        imagePosition: 'left',
        imageAlt: 'Reisbenodigdheden voor honden netjes uitgestald op de achterbank',
      }}
      breadcrumbLabel="Onderweg met je hond"
      products={products}
    />
  )
}
