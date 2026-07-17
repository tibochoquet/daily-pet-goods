import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Hondenbakken, verhoogde voerbakken & mangohouten bakken',
  description:
    'Premium hondenbakken en voerbakken: verhoogde voerstandaards, handgemaakte mangohouten bakken en minimalistische dubbele metalen voerbakken. Voor kleine tot grote rassen.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-bowls' },
}

/*
  ------------------------------------------------
  IMAGE BRIEF, hero (dog-bowls)
  ------------------------------------------------
  Wide editorial lifestyle photograph.
  Modern Scandinavian kitchen with warm oak cabinetry.
  Soft morning sunlight streaming in from a large window on the left.
  A golden retriever standing at a verhoogde wooden feeder with
  stainless steel bowl inserts, mid-eat, calm and content.
  A grey British Shorthair cat sits nearby watching.
  Minimal styling: one ceramic vase, a folded linen tea towel on the counter.
  Light oak flooring, warm beige and cream tones throughout.
  Luxury commercial product photography, shallow depth of field.
  Aspect ratio 4:5, portrait orientation.
  ------------------------------------------------
*/

/*
  ------------------------------------------------
  IMAGE BRIEF, lifestyle section (dog-bowls, materials)
  ------------------------------------------------
  Close-up macro editorial photograph.
  A mangohout dog bowl standard with its stainless steel insert
  partially lifted out, showing the wood grain and brushed metal texture.
  Placed on a warm oak countertop.
  Soft directional side lighting, warm afternoon tone.
  Shallow depth of field, background softly blurred.
  A single dry dog treat resting beside the bowl for scale and warmth.
  Luxury commercial product photography.
  Aspect ratio 4:5, portrait orientation.
  ------------------------------------------------
*/

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
        imageAlt: 'Golden retriever eet uit een verhoogde houten voerbak, kat kijkt toe',
      }}
      lifestyleSection={{
        eyebrow: 'Materialen',
        title: 'Mangohout & roestvrij staal',
        description:
          'Elke bak combineert duurzaam mangohout met een uitneembare inzet van voedselveilig roestvrij staal. Warm om te zien, praktisch in gebruik, en gebouwd om jarenlang mee te gaan.',
        imagePosition: 'right',
        imageAlt: 'Close-up van mangohouten voerbak met roestvrijstalen inzet',
      }}
      breadcrumbLabel="Hondenbakken"
      products={products}
    />
  )
}
