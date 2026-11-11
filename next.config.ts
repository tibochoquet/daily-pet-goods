import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * public/ zit niet vanzelf in de serverless bundel. De webhook leest
   * deze twee pdf's om ze als bijlage bij de bestelbevestiging te doen,
   * dus die moeten expliciet mee.
   */
  outputFileTracingIncludes: {
    '/api/webhooks/stripe': ['./public/legal/**/*'],
    // De productselectietool wordt op de server gelezen in plaats van
    // vanuit public/ geserveerd, zodat hij achter het wachtwoord blijft.
    // Zonder deze regel zit het bestand niet in de bundel.
    '/selectie': ['./selectie-app/**/*'],
  },
  async redirects() {
    return [
      { source: '/dog-bowls', destination: '/honden#hondenbakken', permanent: true },
      { source: '/dog-beds', destination: '/honden#hondenmanden', permanent: true },
      { source: '/dog-travel', destination: '/honden#onderweg', permanent: true },
      { source: '/dog-pools', destination: '/honden#zwembaden', permanent: true },
      { source: '/cat-bowls', destination: '/katten#kattenbakken', permanent: true },
      { source: '/cat-cooling', destination: '/katten#koelmatten', permanent: true },
      { source: '/terms', destination: '/algemene-voorwaarden', permanent: true },

      // Alle oudere haarverwijderaars zijn uit het assortiment, ook de
      // losse van 19,95 die hier eerst het doel van was. Wat overblijft is
      // de driedelige set. Deze pagina's stonden in de sitemap en zijn dus
      // geïndexeerd, dus wijzen we ze door naar het product dat er nog wel
      // is in plaats van bezoekers op een 404 te laten lopen.
      ...['hondenharen-verwijderaar', 'kattenharen-verwijderaar', 'hondenharen-verwijderaar-rhino',
          'kattenharen-verwijderaar-rhino', 'dierenharen-verwijderaar-rhino',
          'dierenharen-verwijderaar'].map((slug) => ({
        source: `/products/${slug}`,
        destination: '/products/dierenharen-verwijderaar-set',
        permanent: true,
      })),
    ]
  },
  images: {
    /**
     * De beeldoptimalisatie van Vercel staat uit.
     *
     * Op 6 november 2026 raakte het quotum op en gaf /_next/image overal
     * 402 (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED) - niet alleen bij de
     * nieuwe producten maar bij elke afbeelding die nog niet in de cache
     * zat. De halve winkel stond daardoor zonder foto's.
     *
     * Zonder optimalisatie serveert next/image het bronbestand zoals het
     * is. Dat kan hier, omdat de productfoto's al als 1200x1200 JPG van
     * 100 tot 300 KB in de repo staan. Wat we inleveren is WebP/AVIF en
     * het verkleinen per schermbreedte: een telefoon haalt nu hetzelfde
     * bestand op als een desktop.
     *
     * Wil je het terug, dan heb je een plan met meer transformaties
     * nodig, of minder bronafbeeldingen. Zet deze regel dan weer uit en
     * controleer /_next/image voordat je het live laat staan.
     */
    unoptimized: true,
    qualities: [75, 80, 85, 88, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
