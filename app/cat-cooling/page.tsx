import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Koelmatten voor katten, zelfkoelende matten',
  description:
    'Zelfkoelende matten voor katten, geen water, stroom of vriezer nodig. Gewoon neerleggen en jouw kat geniet de hele zomer van een koele plek.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/cat-cooling' },
}

/*
  ------------------------------------------------
  IMAGE BRIEF, hero (cat-cooling)
  ------------------------------------------------
  Wide editorial lifestyle photograph.
  Bright, airy Scandinavian living room, warm summer afternoon light.
  A grey tabby cat lying stretched out on a blue self-cooling mat,
  placed on light oak flooring near a large window.
  Sheer white curtains softly diffusing sunlight.
  A small potted plant and a woven basket softly out of focus nearby.
  Calm, sun-warmed, quiet mood.
  Luxury commercial lifestyle photography, eye-level angle.
  Aspect ratio 4:5, portrait orientation.
  ------------------------------------------------
*/

/*
  ------------------------------------------------
  IMAGE BRIEF, lifestyle section (cat-cooling, effortless comfort)
  ------------------------------------------------
  Close editorial detail photograph.
  Top-down view of a folded self-cooling cat mat in soft blue,
  resting on a windowsill in dappled afternoon sunlight.
  A cat's paw just entering the frame from the left, mid-step onto the mat.
  Warm, minimal styling, soft shadows.
  Luxury commercial product photography.
  Aspect ratio 4:5, portrait orientation.
  ------------------------------------------------
*/

export default function CatCoolingPage() {
  const products = getProductsByCategory('cat-outdoor')
  return (
    <CategoryPage
      hero={{
        eyebrow: 'Zomerse verkoeling',
        title: 'Cool blijven, moeiteloos',
        description:
          'Houd jouw kat aangenaam koel op warme dagen met onze zelfkoelende mat. Geen water, stroom of vriezer nodig. De mat activeert automatisch zodra jouw kat erop gaat liggen.',
        ctaLabel: 'Bekijk de mat',
        ctaHref: '/cat-cooling#collectie',
        imageAlt: 'Kat ligt ontspannen op een zelfkoelende mat bij het raam',
      }}
      lifestyleSection={{
        eyebrow: 'Zonder moeite',
        title: 'Verkoeling zonder gedoe',
        description:
          'Geen elektriciteit, geen water bijvullen, geen vriezer. Gewoon neerleggen waar jouw kat het liefst ligt, en de mat doet de rest zodra ze erop plaatsneemt.',
        imagePosition: 'left',
        imageAlt: 'Zelfkoelende mat voor katten uitgevouwen bij een raam',
      }}
      breadcrumbLabel="Koelmatten katten"
      products={products}
    />
  )
}
