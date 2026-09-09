import type { Metadata } from 'next'
import { products } from '@/lib/products'
import ReviewSubmitForm from '@/components/ReviewSubmitForm'

export const metadata: Metadata = {
  title: 'Laat een review achter',
  description: 'Deel je ervaring en een foto van je huisdier met het product.',
  alternates: { canonical: '/review' },
  robots: { index: false, follow: true },
}

interface Props {
  searchParams: Promise<{ product?: string }>
}

export default async function ReviewPage({ searchParams }: Props) {
  const { product } = await searchParams
  const productNames = products.map((p) => p.name)

  return (
    <div className="bg-[#E7E1D6] min-h-screen py-14 md:py-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-[#F5F1EA] rounded-lg p-8 sm:p-10">
          <p className="text-xs font-semibold tracking-[3px] text-[#2E4A3C] uppercase mb-3 text-center">
            Daily Pet Goods
          </p>
          <h1 className="font-serif text-3xl font-normal text-[#2E4A3C] mb-4 text-center">Laat je huisdier zien</h1>
          <p className="text-sm text-[#4A5A50] leading-relaxed mb-8 text-center">
            Een review met foto maakt elke maand kans op onze favoriete inzending.
          </p>
          <ReviewSubmitForm products={productNames} initialProduct={product} />
        </div>
      </div>
    </div>
  )
}
