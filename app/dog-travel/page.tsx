import type { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products'
import { brandImages } from '@/lib/images'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Dog Travel Accessories — Car Covers, Harnesses & More',
  description:
    'Everything you need for travelling with your dog. Waterproof car seat covers, padded harnesses, travel water bottles, and collapsible bowls for adventures on the go.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/dog-travel' },
  openGraph: {
    title: 'Dog Travel Accessories — Daily Pet Goods',
    description: 'Waterproof car covers, harnesses, water bottles and more for dog adventures.',
    images: [{ url: brandImages.travelHero }],
  },
}

export default function DogTravelPage() {
  const products = getProductsByCategory('dog-travel')
  return (
    <CategoryPage
      title="Dog Travel Accessories"
      description="Adventures are better with your dog. From a waterproof car cover that protects your seats to a one-handed water bottle for long hikes — everything you need on the go."
      image={brandImages.travelHero}
      imageAlt="Woman walking a golden retriever on a harness with travel accessories and car visible in background"
      products={products}
      category="dog-travel"
      breadcrumbLabel="Dog Travel"
    />
  )
}
