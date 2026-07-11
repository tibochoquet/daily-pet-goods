import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import { brandImages } from '@/lib/images'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Onderweg met je hond — Autodekens, tuigjes & meer',
  description:
    'Alles wat je nodig hebt om te reizen met je hond. Waterdichte achterbankbeschermers, gevoerde tuigjes, reisdrinkflessen en opvouwbare bakken voor onderweg.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-travel' },
  openGraph: {
    title: 'Onderweg met je hond — Daily Pet Goods',
    description: 'Waterdichte achterbankbeschermers, tuigjes, drinkflessen en meer voor avontuurtjes met je hond.',
    images: [{ url: brandImages.travelHero }],
  },
}

export default function DogTravelPage() {
  const products = getProductsByCategory('dog-travel')
  return (
    <CategoryPage
      title="Onderweg met je hond"
      description="Avontuurtjes zijn leuker met je hond. Van een waterdichte achterbankbeschermer tot een drinkfles die je met één hand bedient tijdens lange wandelingen — alles wat je onderweg nodig hebt."
      image={brandImages.travelHero}
      imageAlt="Vrouw wandelt met een golden retriever aan een tuigje, met reisaccessoires en auto op de achtergrond"
      products={products}
      category="dog-travel"
      breadcrumbLabel="Onderweg met je hond"
    />
  )
}
