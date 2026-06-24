import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daily Pet Goods — Premium Pet Products for Dogs & Cats',
  description:
    'Carefully selected premium products for dogs and cats. Elevated feeders, mango wood bowls, cosy beds, travel gear, and summer pools. Coming soon.',
}

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#FAFAF7]">
      <div className="max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8745A] mb-5">
          Premium pet products
        </p>

        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-[#1A1A1A] leading-tight mb-5">
          Daily Pet{' '}
          <span className="text-[#2C4A3E]">Goods</span>
        </h1>

        <p className="text-[#6B7280] text-base leading-relaxed mb-10">
          Thoughtfully selected products for dogs and cats.
          Beautiful in your home, practical every day.
        </p>

        <div className="inline-block border border-[#E8E2D9] rounded-full px-6 py-2.5 text-sm font-medium text-[#3D4A3E]">
          Binnenkort beschikbaar
        </div>
      </div>
    </main>
  )
}
