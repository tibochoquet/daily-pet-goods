import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react'
import { brandImages } from '@/lib/images'

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden">

      {/* Full-bleed image */}
      <Image
        src={brandImages.heroMain}
        alt="Golden retriever rustend op een premium grijs loungebed, grijze kat ernaast in een lichte moderne woonkamer"
        fill
        className="object-cover object-[78%_center] sm:object-center"
        priority
        sizes="100vw"
        quality={90}
      />

      {/* Gradient: darkens left (text area / sofa / window), fades to transparent on right (pets) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
      {/* Subtle bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />

      {/* Content. Left side, over the darker area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-lg">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 border border-white/25 text-white/80 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-8">
            <Sparkles size={12} className="text-[#C8745A]" />
            Zorgvuldig geselecteerd voor jouw huisdier
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-bold text-white leading-[1.05] tracking-tight mb-6">
            Dagelijkse essentials{' '}
            <em className="not-italic text-[#D4956B]">waar ze dol op zijn.</em>
          </h1>

          {/* Body */}
          <p className="text-lg text-white/70 leading-relaxed mb-10">
            Premium, zorgvuldig geselecteerde producten voor honden en katten. Mooi in huis, praktisch elke dag.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-[#2C4A3E] font-semibold px-7 py-4 rounded-full hover:bg-[#F3EDE3] transition-colors text-sm shadow-lg"
            >
              Bekijk alle producten
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/dog-bowls"
              className="inline-flex items-center gap-2 border border-white/35 text-white font-medium px-7 py-4 rounded-full hover:bg-white/10 transition-colors text-sm"
            >
              Hondenbakken
            </Link>
          </div>

          {/* Trust bar */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-white/55 text-sm">
              <Truck size={13} className="text-white/40" />
              Snel geleverd via Bol.com
            </div>
            <div className="flex items-center gap-2 text-white/55 text-sm">
              <ShieldCheck size={13} className="text-white/40" />
              Kwaliteit gegarandeerd
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
