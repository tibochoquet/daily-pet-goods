import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import { brandImages } from '@/lib/images'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Hondenbakken: Verhoogde voerbakken & mangohouten bakken',
  description:
    'Premium hondenbakken en voerbakken: verhoogde voerstandaards in S/M/L, handgemaakte mangohouten bakken en minimalistische dubbele metalen voerbakken. Voor kleine tot grote rassen.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-bowls' },
  openGraph: {
    title: 'Hondenbakken | Daily Pet Goods',
    description: 'Premium verhoogde voerbakken en handgemaakte mangohouten bakken voor honden van elk formaat.',
    images: [{ url: brandImages.feedingHero }],
  },
}

export default function DogBowlsPage() {
  const products = getProductsByCategory('dog-feeding')
  return (
    <CategoryPage
      title="Hondenbakken & voerbakken"
      description="Van verhoogde voerstandaards tot handgemaakte mangohouten bakken, premium voeroplossingen voor honden van elk formaat. Mooi in huis, praktisch elke dag."
      image={brandImages.feedingHero}
      imageAlt="Golden retriever eet uit een premium verhoogde voerbak van hout en roestvrij staal, grijze kat eet ernaast"
      products={products}
      category="dog-feeding"
      breadcrumbLabel="Hondenbakken"
    />
  )
}
