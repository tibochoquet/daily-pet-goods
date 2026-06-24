import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import { brandImages } from '@/lib/images'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Dog Bowls — Elevated Feeders & Mango Wood Bowls',
  description:
    'Premium dog bowls and feeders: elevated bamboo feeders in S/M/L, handcrafted mango wood bowls, and minimalist double metal feeders. For small to large breeds.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-bowls' },
  openGraph: {
    title: 'Dog Bowls — Daily Pet Goods',
    description: 'Premium elevated feeders and handcrafted mango wood bowls for dogs of every size.',
    images: [{ url: brandImages.feedingHero }],
  },
}

export default function DogBowlsPage() {
  const products = getProductsByCategory('dog-feeding')
  return (
    <CategoryPage
      title="Dog Bowls & Feeders"
      description="From bamboo elevated feeders to handcrafted mango wood bowls — premium feeding solutions designed for dogs of every size. Beautiful in your home, practical every day."
      image={brandImages.feedingHero}
      imageAlt="Golden retriever eating from a premium elevated wood and stainless steel feeder, grey cat eating beside him"
      products={products}
      category="dog-feeding"
      breadcrumbLabel="Dog Bowls"
    />
  )
}
