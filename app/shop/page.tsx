import type { Metadata } from 'next'
import { products } from '@/lib/products'
import ProductCard from '@/components/shop/ProductCard'
import NewsletterSignup from '@/components/home/NewsletterSignup'

export const metadata: Metadata = {
  title: 'Shop All Pet Products',
  description:
    'Browse our full collection of premium pet products for dogs and cats — elevated feeders, mango wood bowls, dog beds, travel gear, and summer pools.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/shop' },
}

const categoryLabels: Record<string, string> = {
  'dog-feeding': 'Dog Bowls',
  'cat-feeding': 'Cat Bowls',
  'dog-beds': 'Dog Beds',
  'dog-travel': 'Dog Travel',
  'dog-outdoor': 'Dog Pools',
}

export default function ShopPage() {
  return (
    <>
      <section className="bg-[#F3EDE3] py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-[#6B7280] mb-3">
            <a href="/" className="hover:text-[#2C4A3E] transition-colors">Home</a>
            {' / '}
            <span className="text-[#1A1A1A] font-medium">Shop</span>
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
            All Products
          </h1>
          <p className="text-lg text-[#6B7280] max-w-xl">
            Every product in the Daily Pet Goods collection — carefully selected for quality, design, and your pet&apos;s everyday needs.
          </p>
          <p className="mt-4 text-sm text-[#6B7280]">
            <span className="font-semibold text-[#1A1A1A]">{products.length} products</span> available via Bol.com
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
                    <ProductCard
                      key={product.id}
                      product={product}
                      categorySlug={categoryId}
                    />
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
