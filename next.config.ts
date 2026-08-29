import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/dog-bowls', destination: '/honden#hondenbakken', permanent: true },
      { source: '/dog-beds', destination: '/honden#hondenmanden', permanent: true },
      { source: '/dog-travel', destination: '/honden#onderweg', permanent: true },
      { source: '/dog-pools', destination: '/honden#zwembaden', permanent: true },
      { source: '/cat-bowls', destination: '/katten#kattenbakken', permanent: true },
      { source: '/cat-cooling', destination: '/katten#koelmatten', permanent: true },
      { source: '/terms', destination: '/algemene-voorwaarden', permanent: true },
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
