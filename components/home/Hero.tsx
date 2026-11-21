import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react'
import { brandImages } from '@/lib/images'

/**
 * De hero heeft drie varianten naast elkaar - telefoon met foto, tablet
 * zonder foto, desktop met foto - omdat één foto niet op alle drie de
 * verhoudingen werkt.
 *
 * Dit is de gewone hero. Tijdens de actie komt components/sale/SaleHero.tsx
 * hiervoor in de plaats (zie app/page.tsx): een lichte compositie met de
 * tekst links en de foto rechts. Die staat apart zodat deze hero precies
 * blijft zoals hij buiten de actie hoort te zijn - de actie is een laag
 * erbovenop en geen verbouwing eronder.
 *
 * De losse onderdelen hieronder worden door alle drie de blokken
 * gebruikt, met de opmaakklassen als parameter. Drie keer dezelfde tekst
 * uitschrijven zou betekenen dat een wijziging op één plek wordt
 * vergeten, en dan staat er op een tablet iets anders dan op een
 * telefoon.
 */

function Eyebrow() {
  return (
    <div className="inline-flex items-center gap-2 border border-white/25 text-white/80 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-6 sm:mb-8">
      <Sparkles size={12} className="text-[#C8745A]" />
      Zorgvuldig geselecteerd voor jouw huisdier
    </div>
  )
}

function Heading({ className }: { className: string }) {
  return (
    <h1 className={className}>
      Dagelijkse essentials{' '}
      <em className="not-italic text-[#D4956B]">waar ze dol op zijn.</em>
    </h1>
  )
}

function Subline({ className }: { className: string }) {
  return (
    <p className={className}>
      Premium, zorgvuldig geselecteerde producten voor honden en katten. Mooi in huis, praktisch elke dag.
    </p>
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
      {/* Phone only (< sm): full-bleed photo hero, separate from the tablet
          block below - a photo this tall works on a phone's narrow-and-tall
          viewport but would crop badly across a wider tablet width. */}
      <div className="sm:hidden relative overflow-hidden min-h-[640px]">
        <Image
          src={brandImages.heroMobile}
          alt="Cavalier King Charles spaniël en Britse korthaar kat samen op een hondenmand"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="relative z-10 px-5 py-16">
          <Eyebrow />
          <Heading className="font-serif text-3xl font-bold text-white leading-[1.1] tracking-tight mb-4" />
          <Subline className="text-base text-white/70 leading-relaxed mb-8" />
          <Ctas />
          <TrustBar />
        </div>
      </div>

      {/* Tablet only (sm to lg): text-only block, no photo. The phone photo
          hero above is scoped to phone width only. */}
      <div className="hidden sm:block lg:hidden px-5 sm:px-8 py-16 sm:py-20 bg-[#1F3329]">
        <Eyebrow />
        <Heading className="font-serif text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-tight mb-4" />
        <Subline className="text-base text-white/70 leading-relaxed mb-8" />
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
            <Heading className="font-serif text-6xl xl:text-[4.25rem] font-bold text-white leading-[1.05] tracking-tight mb-6" />
            <Subline className="text-lg text-white/70 leading-relaxed mb-10" />
            <Ctas />
            <TrustBar />
          </div>
        </div>
      </div>
    </section>
  )
}
