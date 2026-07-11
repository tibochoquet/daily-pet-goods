import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Kattenbakken — Mangohout & metalen voerstations',
  description:
    'Prachtige voerstations voor katten: handgemaakte dubbele mangohouten voerbakken en minimalistische metalen kattenbakken. Ontworpen voor comfort en een mooi interieur.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/cat-bowls' },
}

export default function CatBowlsPage() {
  const products = getProductsByCategory('cat-feeding')
  return (
    <CategoryPage
      title="Kattenbakken & voerstations"
      description="Voerstations die net zo mooi als functioneel zijn. Onze mangohouten en metalen kattenbakken passen naadloos in huis en geven jouw kat een comfortabele eetplek."
      products={products}
      category="cat-feeding"
      breadcrumbLabel="Kattenbakken"
    />
  )
}
