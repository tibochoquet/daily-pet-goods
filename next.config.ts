import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * public/ zit niet vanzelf in de serverless bundel. De webhook leest
   * deze twee pdf's om ze als bijlage bij de bestelbevestiging te doen,
   * dus die moeten expliciet mee.
   */
  outputFileTracingIncludes: {
    '/api/webhooks/stripe': ['./public/legal/**/*'],
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

      // De aparte honden- en kattenverwijderaars (en de Rhino-versies)
      // zijn uit het assortiment; er is nog één model voor allebei. Deze
      // pagina's stonden in de sitemap en zijn dus geïndexeerd, dus
      // wijzen we ze door naar het product dat er nog wel is in plaats
      // van bezoekers op een 404 te laten lopen.
      ...['hondenharen-verwijderaar', 'kattenharen-verwijderaar', 'hondenharen-verwijderaar-rhino',
          'kattenharen-verwijderaar-rhino', 'dierenharen-verwijderaar-rhino'].map((slug) => ({
        source: `/products/${slug}`,
        destination: '/products/dierenharen-verwijderaar',
        permanent: true,
      })),
    ]
  },
  images: {
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
