import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
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
    default: 'Daily Pet Goods — Premium Pet Products for Dogs & Cats',
    template: '%s | Daily Pet Goods',
  },
  description:
    'Premium, thoughtfully selected products for dogs and cats. Elevated feeders, mango wood bowls, cosy dog beds, travel gear, and summer pools — delivered via Bol.com.',
  keywords: [
    'dog bowls',
    'elevated dog feeder',
    'mango wood dog bowl',
    'dog beds',
    'cat feeder',
    'dog travel accessories',
    'foldable dog pool',
    'premium pet products',
    'pet accessories Netherlands',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_NL',
    siteName: 'Daily Pet Goods',
    title: 'Daily Pet Goods — Premium Pet Products for Dogs & Cats',
    description:
      'Premium, thoughtfully selected products for dogs and cats. Delivered via Bol.com.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Pet Goods — Premium Pet Products for Dogs & Cats',
    description: 'Premium, thoughtfully selected products for dogs and cats.',
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
      email: 'hello@dailypetgoods.nl',
      contactType: 'customer service',
    },
    sameAs: [],
  }

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-[#FAFAF7]">
        <JsonLd data={organizationSchema} />
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
