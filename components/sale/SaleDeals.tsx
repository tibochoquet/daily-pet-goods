import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getBestSellers } from '@/lib/products'
import ProductCard from '@/components/shop/ProductCard'
import { sale } from '@/config/sale'

/**
 * De productsectie op de homepage tijdens de actie.
 *
 * Komt in de plaats van components/home/BestSellers.tsx en niet erbij:
 * twee productrasters boven elkaar met dezelfde producten erin is geen
 * extra sectie maar dubbele inhoud. Zelfde producten, zelfde raster,
 * zelfde kaarten - alleen de kop staat in het teken van de actie.
 *
 * De bovenregel staat in dezelfde terracotta als op de rest van de
 * homepage ("Meest geliefd", "Categorieën"). Het rood van de actie zit
 * alleen in wat de kaarten zelf al doen: de ronde percentage-badge en
 * de actieprijs. Geen rood vlak en geen rode lijn tussen de rijen.
 */
export default function SaleDeals() {
  const products = getBestSellers()

  return (
    <section className="bg-[#F3EDE3] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#C8745A]">
              {sale.discountPercent}% korting op alles
            </p>
            <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] md:text-4xl">
              {sale.campaign} deals
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2C4A3E] transition-all hover:gap-3"
          >
            Bekijk alle producten
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Drie kolommen, niet vier: de lijst in getBestSellers() is
            kort en bewust - een vierde kolom laat een gat vallen. */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
