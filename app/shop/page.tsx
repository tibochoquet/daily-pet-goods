import type { Metadata } from 'next'
import { products } from '@/lib/products'
import { brandImages } from '@/lib/images'
import ProductCard from '@/components/shop/ProductCard'
import EditorialHero from '@/components/shop/EditorialHero'
import NewsletterSignup from '@/components/home/NewsletterSignup'

export const metadata: Metadata = {
  title: 'Alle producten',
  description:
    'Bekijk onze volledige collectie premium huisdierproducten voor honden en katten. Verhoogde voerbakken, mangohouten bakken, hondenmanden, reisbenodigdheden en zwembaden.',
  alternates: { canonical: '/shop' },
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
      <EditorialHero
        eyebrow="Complete collectie"
        title="Alles voor jouw huisdier"
        description="Elk product uit de Daily Pet Goods-collectie, zorgvuldig geselecteerd op kwaliteit, design en de dagelijkse behoeften van jouw hond of kat."
        ctaLabel="Bekijk de collectie"
        ctaHref="/shop#collectie"
        breadcrumbLabel="Alle producten"
        image={brandImages.lifestyleGeneral}
        imageAlt="Hond en kat ontspannen tussen voerbakken en een hondenmand in een lichte woonkamer"
        tags={[
          { label: 'Verhoogde Hondenbak', price: 34.99, href: '/products/verhoogde-hondenbak', top: '61%', left: '25%' },
          { label: 'Voerbak Mangohout', price: 24.99, href: '/products/voerbak-mangohout', top: '78%', left: '19%' },
          { label: 'Hondenmand Lounge', price: 49.99, href: '/products/hondenmand-lounge', top: '68%', left: '63%' },
        ]}
      />

      <section id="collectie" className="py-16 md:py-20 bg-[#FAFAF7] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-[#6B7280] mb-10">
            <span className="font-semibold text-[#1A1A1A]">{products.length} producten</span> met gratis verzending
          </p>
          {Object.entries(categoryLabels).map(([categoryId, label]) => {
            const categoryProducts = products.filter((p) => p.category === categoryId)
            if (!categoryProducts.length) return null
            return (
              <div key={categoryId} className="mb-14 last:mb-0">
                <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-6">{label}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.slug} product={product} />
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
