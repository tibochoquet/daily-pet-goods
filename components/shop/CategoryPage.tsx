import Image from 'next/image'
import type { Product, ProductCategory } from '@/lib/types'
import ProductCard from './ProductCard'
import NewsletterSignup from '@/components/home/NewsletterSignup'

interface CategoryPageProps {
  title: string
  description: string
  /** Path from /public — omit to show a color background instead */
  image?: string
  imageAlt?: string
  products: Product[]
  category: ProductCategory
  breadcrumbLabel: string
}

export default function CategoryPage({
  title,
  description,
  image,
  imageAlt,
  products,
  category,
  breadcrumbLabel,
}: CategoryPageProps) {
  return (
    <>
      {/* Hero */}
      {image ? (
        /* Photo hero */
        <section className="relative bg-[#1F3329] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={image}
              alt={imageAlt ?? title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1F3329]/85 via-[#1F3329]/50 to-[#1F3329]/10" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <p className="text-sm text-white/50 mb-4">
              <a href="/" className="hover:text-white/80 transition-colors">Home</a>
              {' / '}
              <a href="/shop" className="hover:text-white/80 transition-colors">Shop</a>
              {' / '}
              <span className="text-white/80">{breadcrumbLabel}</span>
            </p>
            <div className="max-w-xl">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
                {title}
              </h1>
              <p className="text-lg text-white/70 leading-relaxed mb-4">{description}</p>
              <p className="text-sm text-white/50">
                <span className="font-semibold text-white/70">{products.length} products</span> — available via Bol.com
              </p>
            </div>
          </div>
        </section>
      ) : (
        /* Color hero */
        <section className="bg-[#F3EDE3] py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-[#6B7280] mb-4">
              <a href="/" className="hover:text-[#2C4A3E] transition-colors">Home</a>
              {' / '}
              <a href="/shop" className="hover:text-[#2C4A3E] transition-colors">Shop</a>
              {' / '}
              <span className="text-[#1A1A1A] font-medium">{breadcrumbLabel}</span>
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4 leading-tight">
              {title}
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed max-w-xl">{description}</p>
            <p className="mt-4 text-sm text-[#6B7280]">
              <span className="font-semibold text-[#1A1A1A]">{products.length} products</span> — available via Bol.com
            </p>
          </div>
        </section>
      )}

      {/* Products grid */}
      <section className="py-16 md:py-20 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categorySlug={category}
              />
            ))}
          </div>
        </div>
      </section>

      <NewsletterSignup />
    </>
  )
}
