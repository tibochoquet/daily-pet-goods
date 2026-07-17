import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/JsonLd'

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

export const metadata: Metadata = {
  metadataBase: new URL('https://www.dailypetgoods.nl'),
  title: {
    default: 'Daily Pet Goods: Premium huisdierproducten voor honden & katten',
    template: '%s | Daily Pet Goods',
  },
  description:
    'Zorgvuldig geselecteerde premium producten voor honden en katten. Verhoogde voerbakken, mangohouten bakken, knusse hondenmanden, reisbenodigdheden en zwembaden. Verkrijgbaar via Bol.com.',
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
      'Zorgvuldig geselecteerde premium producten voor honden en katten. Verkrijgbaar via Bol.com.',
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
    name: 'Daily Pet Goods',
    url: 'https://www.dailypetgoods.nl',
    logo: 'https://www.dailypetgoods.nl/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'lifegoods.daily@gmail.com',
      contactType: 'customer service',
    },
    sameAs: [],
  }

  return (
    <html lang="nl" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-[#FAFAF7]">
        <JsonLd data={organizationSchema} />
        <AnnouncementBar />
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
