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
        alt="Premium huisdieraccessoires uitgestald: hondenmand, reistas, tuigje, bakken, halsband en riem op een houten ondergrond"
        fill
        className="object-cover object-center"
        sizes="100vw"
        quality={88}
      />

      {/* Dark overlay. Centre-to-bottom fade, keeps product details visible on top.
          Bottom stop is fully opaque black (not black/75) so the photo's warm
          wood tones don't show through right where this section meets the
          solid dark green CustomerReviews section below it - a partial-opacity
          bottom left a visible brown seam at that boundary. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      {/* Content. Anchored to bottom-left */}
      <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-3">
            De volledige collectie
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
            Zorgvuldig gekozen.{' '}
            <span className="text-[#D4956B]">Gebouwd om lang mee te gaan.</span>
          </h2>
          <p className="text-white/65 text-base leading-relaxed mb-7 max-w-md">
            Van mangohouten voerbakken tot waterdichte achterbankbeschermers: elk product in onze collectie is getest op kwaliteit, design en de dagelijkse behoeften van jouw huisdier.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 bg-white text-[#2C4A3E] font-semibold px-7 py-3.5 rounded-full hover:bg-[#F3EDE3] transition-colors text-sm shadow-lg"
          >
            Bekijk alle producten
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
