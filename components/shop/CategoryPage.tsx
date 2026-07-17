import type { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import EditorialHero, { type HeroTag } from './EditorialHero'
import NewsletterSignup from '@/components/home/NewsletterSignup'

interface HeroContent {
  eyebrow: string
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
  image: string
  imageAlt: string
  tags?: HeroTag[]
}

interface CategoryPageProps {
  hero: HeroContent
  breadcrumbLabel: string
  products: Product[]
}

export default function CategoryPage({
  hero,
  breadcrumbLabel,
  products,
}: CategoryPageProps) {
  return (
    <>
      <EditorialHero {...hero} breadcrumbLabel={breadcrumbLabel} />

      {/* Products grid */}
      <section id="collectie" className="py-16 md:py-20 bg-[#FAFAF7] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A]">
              De collectie
            </h2>
            <span className="text-sm text-[#9CA3AF]">{products.length} producten</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <NewsletterSignup />
    </>
  )
}
