import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import FeaturedCategories from '@/components/home/FeaturedCategories'
import BestSellers from '@/components/home/BestSellers'
import SaleDeals from '@/components/sale/SaleDeals'
import EditorialBanner from '@/components/home/EditorialBanner'
import CustomerReviews from '@/components/home/CustomerReviews'
import FAQ from '@/components/home/FAQ'
import NewsletterSignup from '@/components/home/NewsletterSignup'
import { isSaleActive, sale, saleEndLabel, saleTierLabel } from '@/config/sale'
import { business } from '@/lib/business'

/**
 * Titel en beschrijving volgen de actie.
 *
 * Een functie en geen vast `metadata`-object, want dit moet per render
 * opnieuw bepaald worden - met de hervalidatie uit app/layout.tsx staat
 * de gewone titel er dus binnen vijf minuten na het einde weer.
 *
 * `absolute` voor de actietitel, zodat het sjabloon uit de root layout
 * er niet nog een tweede "| Daily Pet Goods" achter plakt. De tak
 * zonder actie geeft precies het object terug dat hier eerst stond: als
 * de actie uit staat, moet de pagina niet te onderscheiden zijn van
 * ervoor.
 */
export async function generateMetadata(): Promise<Metadata> {
  if (isSaleActive()) {
    return {
      title: {
        absolute: `${sale.campaign}: ${sale.discountPercent}% korting op alles | ${business.brandName}`,
      },
      description:
        `${sale.campaign} bij ${business.brandName}: tot en met ${saleEndLabel()} ${sale.discountPercent}% korting op alle ` +
        `producten voor honden en katten, en ${sale.tierDiscountPercent}% vanaf ${saleTierLabel()} in je winkelwagen. ` +
        'Gratis verzending, geen kortingscode nodig.',
      alternates: { canonical: '/' },
    }
  }

  return {
    title: 'Daily Pet Goods: Premium huisdierproducten voor honden & katten',
    description:
      'Zorgvuldig geselecteerde premium producten voor honden en katten. Verhoogde voerbakken, mangohouten bakken, knusse manden, reisbenodigdheden en zwembaden.',
    alternates: { canonical: '/' },
  }
}

/**
 * Tijdens de actie wisselt er precies één sectie.
 *
 * De hero blijft dezelfde component en wisselt intern van tekst: de twee
 * treden en de vier beloftes zitten dáárin, niet als losse secties
 * eronder. Die stonden hier eerst wel, en dat las als een hero met twee
 * vreemde stroken eronder in plaats van als één actie.
 *
 * Het bestsellerraster krijgt de dealkop - geen extra raster met
 * dezelfde producten erin.
 *
 * Alles aan één `isSaleActive()`, dus na `endsAt` staat de homepage er
 * weer precies zoals hiervoor - binnen vijf minuten, door de
 * `revalidate` in app/layout.tsx.
 */
export default function HomePage() {
  const saleActive = isSaleActive()

  return (
    <>
      <Hero />
      <FeaturedCategories />
      {saleActive ? <SaleDeals /> : <BestSellers />}
      <EditorialBanner />
      <CustomerReviews />
      <FAQ />
      <NewsletterSignup />
    </>
  )
}
