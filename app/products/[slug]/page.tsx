import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { colorSiblings, products } from '@/lib/products'
import ProductDetailClient from './ProductDetailClient'
import JsonLd from '@/components/JsonLd'
import ProductReviews from '@/components/shop/ProductReviews'
import RelatedProducts from '@/components/shop/RelatedProducts'
import { business, SITE_URL } from '@/lib/business'
import { isSaleActive, sale } from '@/config/sale'
import { isPreorder, preorderIso, preorderLabel } from '@/lib/preorder'
import { pricingFor } from '@/lib/sale'
import { isDbConfigured } from '@/lib/db'
import { findPublishedReviewsForProduct, type ProductReviews as Reviews } from '@/lib/db/reviews'

/**
 * Reviews komen uit de database, dus de pagina kan niet puur statisch
 * blijven. Met ISR blijft hij snel en staat een zojuist goedgekeurde
 * review binnen vijf minuten op de site.
 */
export const revalidate = 300

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) return {}

  // De eerste foto van de eerste variant is overal de hoofdfoto, dus ook
  // de afbeelding die in WhatsApp, Slack of op social te zien is als
  // iemand de link deelt. Zonder dit valt de pagina terug op de
  // algemene site-afbeelding uit app/layout.tsx.
  const cover = product.variants[0]
  const title = product.seoTitle ?? product.name
  const description = product.shortDescription
  const canonical = `/products/${product.slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      images: [{ url: cover.image, width: 1200, height: 1200, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [cover.image],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()

  // Varianten zonder prijs doen hier niet mee: die staan straks wel op de
  // site, maar zijn nog niet te bestellen.
  const prices = product.variants.map((v) => v.price).filter((p): p is number => p !== null)
  const lowPrice = prices.length > 0 ? Math.min(...prices) : null
  const highPrice = prices.length > 0 ? Math.max(...prices) : null

  /**
   * Tijdens de actie gaat de actieprijs in de structured data, niet de
   * normale. Google vergelijkt wat hier staat met wat de bezoeker op de
   * pagina ziet, en bij verschil negeert hij de hele vermelding - dus
   * dezelfde bron als de zichtbare prijs, en `priceValidUntil` erbij
   * zodat duidelijk is dat het om een tijdelijke prijs gaat.
   *
   * Eén klok voor pagina en structured data: `saleActive` gaat ook naar
   * ProductDetailClient, zodat die twee nooit uiteen kunnen lopen.
   */
  const saleActive = isSaleActive()
  const offerPrijs = (euro: number) => pricingFor(euro, saleActive)?.current ?? euro
  const priceValidUntil = saleActive ? sale.endsAt.slice(0, 10) : null

  /**
   * Pre-order of niet, bepaald met de serverklok - net als de actie.
   *
   * De browser rekent dit niet zelf uit: dan zou een bezoeker met een
   * verkeerd gezette klok een andere belofte lezen dan er in de HTML
   * staat, en bij hydratie is dat een verschil dat React opmerkt. De
   * datum gaat daarom al als tekst naar beneden.
   */
  const preorder = isPreorder(product)
  const preorderDatum = preorder && product.shipsFrom ? preorderLabel(product.shipsFrom) : null

  /**
   * De kleuren van ditzelfde artikel, als rijtje voor bovenaan de
   * pagina. Alleen wat de kiezer nodig heeft, zodat niet de hele
   * productdata van de andere kleur mee de browser in gaat.
   */
  const kleuren = colorSiblings(product).map((p) => ({
    slug: p.slug,
    label: p.color?.label ?? p.name,
    swatch: p.color?.swatch ?? '#E8E2D9',
  }))
  // Zonder database geen reviews, maar de pagina blijft gewoon werken.
  let reviews: Reviews = { items: [], aantal: 0, gemiddelde: 0 }
  if (isDbConfigured()) {
    try {
      reviews = await findPublishedReviewsForProduct(product.slug)
    } catch (err) {
      console.error(`Productpagina ${product.slug}: reviews ophalen mislukt:`, err)
    }
  }

  // Eén variant op voorraad is genoeg om de groep als leverbaar te
  // vermelden; welke maat op is, staat op de pagina zelf.
  const anyInStock = product.variants.some((v) => v.inStock ?? true)
  /**
   * `PreOrder` is in schema.org precies wat hier aan de hand is: wel te
   * bestellen, nog niet te verzenden. Met `availabilityStarts` erbij,
   * want zonder die datum weet Google alleen dat het niet op voorraad is
   * en niet vanaf wanneer wel.
   */
  const availability = preorder
    ? 'https://schema.org/PreOrder'
    : anyInStock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock'
  const availabilityStarts =
    preorder && product.shipsFrom ? { availabilityStarts: preorderIso(product.shipsFrom) } : {}

  /**
   * Zonder prijs geen `offers`.
   *
   * Een Offer moet een prijs hebben, en een verzonnen of op nul gezette
   * prijs die niet overeenkomt met wat de bezoeker op de pagina ziet, is
   * voor Google reden om de hele vermelding te negeren. Weglaten kost
   * hooguit de rich result; een verkeerde prijs kost het vertrouwen.
   */
  const offers =
    lowPrice === null || highPrice === null
      ? undefined
      : product.variants.length > 1
        ? {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            lowPrice: offerPrijs(lowPrice).toFixed(2),
            highPrice: offerPrijs(highPrice).toFixed(2),
            offerCount: product.variants.length,
            availability,
            ...availabilityStarts,
            url: `${SITE_URL}/products/${product.slug}`,
            ...(priceValidUntil ? { priceValidUntil } : {}),
          }
        : {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: offerPrijs(lowPrice).toFixed(2),
            availability,
            ...availabilityStarts,
            url: `${SITE_URL}/products/${product.slug}`,
            ...(priceValidUntil ? { priceValidUntil } : {}),
          }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    brand: { '@type': 'Brand', name: business.brandName },
    // Eén product, één GTIN. Bij een product met meerdere maten hoort de
    // EAN bij de variant en niet bij de groep, dus dan laten we hem weg.
    ...(product.variants.length === 1 && product.variants[0].ean
      ? { gtin13: product.variants[0].ean }
      : {}),
    image: product.variants.map((v) => `${SITE_URL}${v.image}`),
    ...(offers ? { offers } : {}),
    // Alleen opnemen als er echt gepubliceerde reviews zijn. Een lege
    // aggregateRating of een waarde die afwijkt van wat de bezoeker op
    // de pagina ziet, is voor Google een reden om de hele vermelding te
    // negeren. Daarom komen beide uit dezelfde berekening.
    ...(reviews.aantal > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: reviews.gemiddelde,
            reviewCount: reviews.aantal,
            bestRating: 5,
            worstRating: 1,
          },
          review: reviews.items.map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.name },
            datePublished: r.createdAt.toISOString().slice(0, 10),
            reviewBody: r.text,
            reviewRating: {
              '@type': 'Rating',
              ratingValue: r.rating,
              bestRating: 5,
              worstRating: 1,
            },
          })),
        }
      : {}),
  }

  return (
    <>
      <JsonLd data={productSchema} />
      <ProductDetailClient
        product={product}
        saleActive={saleActive}
        preorderDatum={preorderDatum}
        kleuren={kleuren}
      />
      <ProductReviews {...reviews} />
      <RelatedProducts product={product} />
    </>
  )
}
