import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Hondenmanden — Donut manden, lounge beds & Sambo manden',
  description:
    'Premium hondenmanden voor elke slaapstijl. Extra zachte pluche donut manden in 80 en 90 cm, structurele Sambo manden in 4 kleuren, en ruime loungebeds voor grote rassen.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-beds' },
}

export default function DogBedsPage() {
  const products = getProductsByCategory('dog-beds')
  return (
    <CategoryPage
      title="Hondenmanden"
      description="Een goede nachtrust begint met de juiste mand. Of jouw hond nu graag opkrult in een knusse donut mand of languit ligt op een ruim loungebed — wij hebben de perfecte plek."
      products={products}
      category="dog-beds"
      breadcrumbLabel="Hondenmanden"
    />
  )
}
