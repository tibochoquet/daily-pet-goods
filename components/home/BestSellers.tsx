import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getBestSellers } from '@/lib/products'
import ProductCard from '@/components/shop/ProductCard'

export default function BestSellers() {
  const products = getBestSellers()

  return (
    <section className="py-16 md:py-24 bg-[#F3EDE3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold text-[#C8745A] uppercase tracking-wider mb-2">Most loved</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A]">
              Our bestsellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[#2C4A3E] font-medium text-sm hover:gap-3 transition-all"
          >
            View all products
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categorySlug={product.category}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
