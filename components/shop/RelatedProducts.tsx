import { getRelatedProducts } from '@/lib/products'
import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/lib/types'

/**
 * De rij vergelijkbare producten onderaan een productpagina.
 *
 * Staat los van de actie: wie een jas bekijkt, wil de andere jassen zien
 * of er nu korting is of niet. Dit blijft dus ook na de actie staan. De
 * kaarten zijn dezelfde als op /shop, dus de actieprijs en de ronde
 * percentage-badge komen vanzelf mee zolang de actie loopt en verdwijnen
 * vanzelf als hij voorbij is.
 *
 * Vier producten: op de desktop precies één rij, op een telefoon vier
 * kaarten onder elkaar zoals overal op de site. Twee kolommen op een
 * telefoon zouden smaller uitvallen dan de prijsregel breed is, en dan
 * schuift de hele pagina opzij.
 */
export default function RelatedProducts({ product }: { product: Product }) {
  const related = getRelatedProducts(product, 4)
  if (related.length === 0) return null

  return (
    <section className="border-t border-[#E8E2D9] bg-[#F3EDE3] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 font-serif text-2xl font-bold text-[#1A1A1A] md:mb-10 md:text-3xl">
          Anderen keken ook naar
        </h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
