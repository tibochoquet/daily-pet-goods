import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { brandImages } from '@/lib/images'

export default function EditorialBanner() {
  return (
    <section className="relative overflow-hidden h-[520px] md:h-[600px]">
      {/* Full-bleed accessories flat-lay */}
      <Image
        src={brandImages.accessories}
        alt="Premium pet accessories flat-lay: dog bed, travel bag, harness, bowls, collar and leash arranged on a wooden surface"
        fill
        className="object-cover object-center"
        sizes="100vw"
        quality={88}
      />

      {/* Dark overlay — centre-to-bottom fade, keeps product details visible on top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Content — anchored to bottom-left */}
      <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-3">
            The full collection
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
            Thoughtfully chosen.{' '}
            <span className="text-[#D4956B]">Built to last.</span>
          </h2>
          <p className="text-white/65 text-base leading-relaxed mb-7 max-w-md">
            From mango wood feeders to waterproof car covers — every product in our collection is tested for quality, design, and your pet&apos;s everyday needs.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 bg-white text-[#2C4A3E] font-semibold px-7 py-3.5 rounded-full hover:bg-[#F3EDE3] transition-colors text-sm shadow-lg"
          >
            Browse all products
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
