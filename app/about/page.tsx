import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, Leaf, Shield, Star } from 'lucide-react'
import { brandImages } from '@/lib/images'

export const metadata: Metadata = {
  title: 'About Us — The Story Behind Daily Pet Goods',
  description:
    'Daily Pet Goods was built by a pet owner who wanted better products — without the overwhelm of generic marketplaces. Learn our story and why we do what we do.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/about' },
}

const values = [
  {
    icon: Heart,
    title: 'Pet-first thinking',
    description: 'Every product starts with a simple question: will a pet love using this?',
  },
  {
    icon: Leaf,
    title: 'Sustainable materials',
    description: 'We favour natural materials — mango wood, stainless steel, food-grade silicone.',
  },
  {
    icon: Shield,
    title: 'Quality you can trust',
    description: 'We test every product before it joins our collection. No shortcuts.',
  },
  {
    icon: Star,
    title: 'Honest curation',
    description: 'We only stock products we would buy for our own pets. No filler.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero — full-bleed lifestyle image */}
      <section className="relative min-h-[75vh] flex items-end overflow-hidden">
        <Image
          src={brandImages.lifestyleHero}
          alt="Golden retriever resting on a premium cream lounge bed, grey cat on armchair — warm modern home interior"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={90}
        />
        {/* Gradient bottom-up so text stays readable, top of image stays clean */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 md:pb-20">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-[#D4956B] uppercase tracking-wider mb-4">
              Our story
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Built by a pet owner,{' '}
              <em className="not-italic text-[#D4956B]">for pet owners.</em>
            </h1>
            <p className="text-lg text-white/65 leading-relaxed">
              We started with a frustration. We ended up building the brand we wished existed.
            </p>
          </div>
        </div>
      </section>

      {/* Story text */}
      <section className="py-16 md:py-24 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xl text-[#2C4A3E] font-serif font-medium leading-relaxed mb-6">
            Finding beautiful, quality products for our dog meant either paying luxury prices or wading through pages of cheap, throwaway items on generic marketplaces.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-5">
            We wanted the middle ground — products that were well-made, looked great at home, and didn't cost a fortune. So we went looking for them, tested them, and built a small curated collection around the things that actually worked.
          </p>
          <p className="text-[#6B7280] leading-relaxed">
            Today, every product in our range has been through that same process. If it isn't good enough for our own pets, it doesn't make the cut.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-[#F3EDE3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#C8745A] uppercase tracking-wider mb-3">
              What we stand for
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A]">
              Our values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <div
                  key={value.title}
                  className="bg-white rounded-2xl p-6 border border-[#E8E2D9] hover:shadow-md transition-shadow"
                >
                  <div className="w-11 h-11 bg-[#2C4A3E]/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#2C4A3E]" />
                  </div>
                  <h3 className="font-serif font-semibold text-[#1A1A1A] text-lg mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Bol.com */}
      <section className="py-16 md:py-24 bg-[#2C4A3E]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
            Why we sell on Bol.com
          </h2>
          <p className="text-white/65 leading-relaxed mb-4">
            We chose Bol.com because it&apos;s the platform our customers already trust for fast, reliable delivery. You don&apos;t need a new account, you know how returns work, and you can track your order every step of the way.
          </p>
          <p className="text-white/65 leading-relaxed mb-10">
            It lets us focus on what we do best — curating great products — rather than running fulfilment and payment infrastructure from scratch.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-[#2C4A3E] font-semibold px-7 py-4 rounded-full hover:bg-[#F3EDE3] transition-colors text-sm"
          >
            Browse our products
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[#FAFAF7]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">
            Have a question?
          </h2>
          <p className="text-[#6B7280] mb-6">
            We love hearing from pet owners. Get in touch and we&apos;ll get back to you quickly.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#2C4A3E] text-white font-semibold px-6 py-3.5 rounded-full hover:bg-[#3D6456] transition-colors text-sm"
          >
            Contact us
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
