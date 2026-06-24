import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
