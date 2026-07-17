import type { Metadata } from 'next'
import Link from 'next/link'
import { products } from '@/lib/products'
import ProductCard from '@/components/shop/ProductCard'
import NewsletterSignup from '@/components/home/NewsletterSignup'

export const metadata: Metadata = {
  title: 'Alle producten',
  description:
    'Bekijk onze volledige collectie premium huisdierproducten voor honden en katten. Verhoogde voerbakken, mangohouten bakken, hondenmanden, reisbenodigdheden en zwembaden.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/shop' },
}

const categoryLabels: Record<string, string> = {
  'dog-feeding': 'Hondenbakken',
  'cat-feeding': 'Kattenbakken',
  'dog-beds': 'Hondenmanden',
  'dog-travel': 'Onderweg met je hond',
  'dog-outdoor': 'Zwembaden & koelmatten hond',
  'cat-outdoor': 'Koelmatten voor katten',
}

export default function ShopPage() {
  return (
    <>
      <section className="bg-[#F3EDE3] py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-[#6B7280] mb-3">
            <Link href="/" className="hover:text-[#2C4A3E] transition-colors">Home</Link>
            {' / '}
            <span className="text-[#1A1A1A] font-medium">Shop</span>
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
            Alle producten
          </h1>
          <p className="text-lg text-[#6B7280] max-w-xl">
            Elk product uit de Daily Pet Goods-collectie, zorgvuldig geselecteerd op kwaliteit, design en de dagelijkse behoeften van jouw huisdier.
          </p>
          <p className="mt-4 text-sm text-[#6B7280]">
            <span className="font-semibold text-[#1A1A1A]">{products.length} producten</span> verkrijgbaar via Bol.com
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {Object.entries(categoryLabels).map(([categoryId, label]) => {
            const categoryProducts = products.filter((p) => p.category === categoryId)
            if (!categoryProducts.length) return null
            return (
              <div key={categoryId} className="mb-14 last:mb-0">
                <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-6">{label}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <NewsletterSignup />
    </>
  )
}
