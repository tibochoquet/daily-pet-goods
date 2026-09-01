import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import FeaturedCategories from '@/components/home/FeaturedCategories'
import BestSellers from '@/components/home/BestSellers'
import EditorialBanner from '@/components/home/EditorialBanner'
import CustomerReviews from '@/components/home/CustomerReviews'
import FAQ from '@/components/home/FAQ'
import NewsletterSignup from '@/components/home/NewsletterSignup'

export const metadata: Metadata = {
  title: 'Daily Pet Goods: Premium huisdierproducten voor honden & katten',
  description:
    'Zorgvuldig geselecteerde premium producten voor honden en katten. Verhoogde voerbakken, mangohouten bakken, knusse manden, reisbenodigdheden en zwembaden.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <BestSellers />
      <EditorialBanner />
      <CustomerReviews />
      <FAQ />
      <NewsletterSignup />
    </>
  )
}
