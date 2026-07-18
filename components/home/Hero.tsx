import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react'
import { brandImages } from '@/lib/images'

function Eyebrow() {
  return (
    <div className="inline-flex items-center gap-2 border border-white/25 text-white/80 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-6 sm:mb-8">
      <Sparkles size={12} className="text-[#C8745A]" />
      Zorgvuldig geselecteerd voor jouw huisdier
    </div>
  )
}

function Ctas() {
  return (
    <div className="flex flex-wrap gap-3 mb-10 sm:mb-12">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 bg-white text-[#2C4A3E] font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-full hover:bg-[#F3EDE3] transition-colors text-sm shadow-lg"
      >
        Bekijk alle producten
        <ArrowRight size={15} />
      </Link>
      <Link
        href="/honden#hondenbakken"
        className="inline-flex items-center gap-2 border border-white/35 text-white font-medium px-6 sm:px-7 py-3.5 sm:py-4 rounded-full hover:bg-white/10 transition-colors text-sm"
      >
        Hondenbakken
      </Link>
    </div>
  )
}

function TrustBar() {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex items-center gap-2 text-white/55 text-sm">
        <Truck size={13} className="text-white/40" />
        Gratis verzending
      </div>
      <div className="flex items-center gap-2 text-white/55 text-sm">
        <ShieldCheck size={13} className="text-white/40" />
        Kwaliteit gegarandeerd
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="w-full">
      {/* Mobile & tablet (< lg): text-only block, no photo. Fully independent from the desktop layout. */}
      <div className="lg:hidden bg-[#1F3329] px-5 sm:px-8 py-16 sm:py-20">
        <Eyebrow />
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-tight mb-4">
          Dagelijkse essentials{' '}
          <em className="not-italic text-[#D4956B]">waar ze dol op zijn.</em>
        </h1>
        <p className="text-base text-white/70 leading-relaxed mb-8">
          Premium, zorgvuldig geselecteerde producten voor honden en katten. Mooi in huis, praktisch elke dag.
        </p>
        <Ctas />
        <TrustBar />
      </div>

      {/* Desktop (lg+): full-bleed photo hero */}
      <div className="hidden lg:flex relative min-h-[88vh] items-center overflow-hidden">
        <Image
          src={brandImages.heroMain}
          alt="Golden retriever rustend op een premium grijs loungebed, grijze kat ernaast in een lichte moderne woonkamer"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />

        {/* Gradient: darkens left (text area / sofa / window), fades to transparent on right (pets) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
        {/* Subtle bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Content. Left side, over the darker area */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 py-32">
          <div className="max-w-lg">
            <Eyebrow />
            <h1 className="font-serif text-6xl xl:text-[4.25rem] font-bold text-white leading-[1.05] tracking-tight mb-6">
              Dagelijkse essentials{' '}
              <em className="not-italic text-[#D4956B]">waar ze dol op zijn.</em>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-10">
              Premium, zorgvuldig geselecteerde producten voor honden en katten. Mooi in huis, praktisch elke dag.
            </p>
            <Ctas />
            <TrustBar />
          </div>
        </div>
      </div>
    </section>
  )
}
