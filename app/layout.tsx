import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/JsonLd'
import GoogleTag from '@/components/GoogleTag'
import { CartProvider } from '@/components/cart/CartProvider'
import { SizeMemoryProvider } from '@/components/shop/SizeMemory'
import { Analytics } from '@vercel/analytics/next'
import { business, SITE_URL } from '@/lib/business'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

/**
 * Elke pagina onder deze layout verlopen na vijf minuten.
 *
 * Nodig voor de tijdelijke actie. De balk hierboven en de prijzen op de
 * kaarten worden op de server bepaald, en zonder deze regel waren de
 * homepage, /shop, /honden, /katten en alle tekstpagina's volledig
 * statisch: die veranderen dan pas bij een nieuwe deploy, dus de actie
 * zou er niet beginnen en - erger - niet stoppen.
 *
 * Vijf minuten is dezelfde waarde die de productpagina's al hadden. De
 * prijs van zo'n hervalidatie is laag: het zijn statische renders van
 * lokale data, alleen de productpagina haalt reviews uit de database.
 *
 * Het echte slot op de actieprijs zit niet hier maar in
 * app/api/checkout/route.ts, dat bij elke bestelling opnieuw naar de
 * serverklok kijkt.
 */
export const revalidate = 300

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Daily Pet Goods: Premium huisdierproducten voor honden & katten',
    template: '%s | Daily Pet Goods',
  },
  description:
    'Zorgvuldig geselecteerde premium producten voor honden en katten. Verhoogde voerbakken, mangohouten bakken, knusse hondenmanden, reisbenodigdheden en zwembaden.',
  keywords: [
    'hondenbakken',
    'verhoogde voerbak hond',
    'mangohouten hondenbak',
    'hondenmanden',
    'kattenvoerbak',
    'reisbenodigdheden hond',
    'opvouwbaar hondenzwembad',
    'premium huisdierproducten',
    'huisdieraccessoires Nederland',
  ],
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    siteName: 'Daily Pet Goods',
    title: 'Daily Pet Goods: Premium huisdierproducten voor honden & katten',
    description:
      'Zorgvuldig geselecteerde premium producten voor honden en katten.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Pet Goods: Premium huisdierproducten voor honden & katten',
    description: 'Zorgvuldig geselecteerde premium producten voor honden en katten.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: business.brandName,
    legalName: business.tradingName,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      postalCode: business.address.postalCode,
      addressLocality: business.address.city,
      addressCountry: 'NL',
    },
    vatID: business.btwNumber,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'KVK',
      value: business.kvkNumber,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: business.email,
      contactType: 'customer service',
    },
    sameAs: ['https://www.instagram.com/dailypetgoods'],
  }

  return (
    <html lang="nl" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-[#FAFAF7]">
        {process.env.NODE_ENV === 'production' && <GoogleTag />}
        <JsonLd data={organizationSchema} />
        <CartProvider>
          <AnnouncementBar />
          <Navigation />
          {/* Boven de route, zodat de gekozen maat blijft staan bij
              het wisselen van kleur - zie SizeMemory. */}
          <SizeMemoryProvider>
            <main>{children}</main>
          </SizeMemoryProvider>
          <Footer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
