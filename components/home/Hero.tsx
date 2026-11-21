import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react'
import { brandImages } from '@/lib/images'
import { isSaleActive, sale, saleEndShort, saleTierLabel } from '@/config/sale'

/**
 * De hero heeft drie varianten naast elkaar - telefoon met foto, tablet
 * zonder foto, desktop met foto - omdat één foto niet op alle drie de
 * verhoudingen werkt.
 *
 * Tijdens de actie verandert alleen de tekst. De compositie blijft
 * precies zoals hij buiten de actie is: dezelfde foto's, dezelfde
 * hoogtes, dezelfde gradients, dezelfde witte knop. Een actie is iets
 * wat je erover legt, geen andere homepage - een eerdere versie zette
 * hier een lichte crème compositie neer en dat was de winkel niet meer.
 *
 * Geen extra donkere laag over de foto tijdens de actie. De actietekst
 * is korter dan de gewone, dus wat voor de gewone tekst leesbaar genoeg
 * was, is dat hier ook.
 *
 * Het enige rood is de ronde badge met het percentage. Prijzen, de
 * balk met de klok en dit soort badges zijn de plekken waar het rood
 * hoort; een rode knop zou de huisstijlknop vervangen en dat is precies
 * wat het niet moet doen.
 *
 * De losse onderdelen hieronder worden door alle drie de blokken
 * gebruikt, met de opmaakklassen als parameter. Drie keer dezelfde tekst
 * uitschrijven zou betekenen dat een wijziging op één plek wordt
 * vergeten, en dan staat er op een tablet iets anders dan op een
 * telefoon.
 */

function Eyebrow({ saleActive }: { saleActive: boolean }) {
  if (saleActive) {
    // Dun en wit in plaats van de omrande pil: de kop eronder is kort,
    // dus een zware pil erboven zou het zwaartepunt verkeerd leggen.
    return (
      <p className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white sm:mb-8">
        <span className="h-px w-7 shrink-0 bg-white/50" aria-hidden />
        {sale.campaign} &middot; t/m {saleEndShort()}
      </p>
    )
  }
  return (
    <div className="inline-flex items-center gap-2 border border-white/25 text-white/80 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-6 sm:mb-8">
      <Sparkles size={12} className="text-[#C8745A]" />
      Zorgvuldig geselecteerd voor jouw huisdier
    </div>
  )
}

function Heading({ saleActive, className }: { saleActive: boolean; className: string }) {
  if (saleActive) {
    return <h1 className={className}>{sale.campaign}</h1>
  }
  return (
    <h1 className={className}>
      Dagelijkse essentials{' '}
      <em className="not-italic text-[#D4956B]">waar ze dol op zijn.</em>
    </h1>
  )
}

function Subline({ saleActive, className }: { saleActive: boolean; className: string }) {
  if (saleActive) {
    // Steviger wit dan de gewone subregel hieronder. Die is sfeer en mag
    // wegvallen tegen de foto; deze regel is de aanbieding zelf en staat
    // op een telefoon boven de lichte helft van het beeld. De kleur zit
    // op de spans en niet in `className`, zodat de gewone hero zijn
    // eigen white/70 houdt.
    return (
      <p className={className}>
        <span className="text-white/90">{sale.discountPercent}% korting op alles.</span>{' '}
        <span className="font-semibold text-white">
          {sale.tierDiscountPercent}% vanaf {saleTierLabel()}.
        </span>
      </p>
    )
  }
  return (
    <p className={className}>
      Premium, zorgvuldig geselecteerde producten voor honden en katten. Mooi in huis, praktisch elke dag.
    </p>
  )
}

/**
 * Dezelfde witte knop met en zonder actie. Dat is de huisstijlknop op
 * een foto; hem tijdens de actie rood maken zou betekenen dat het rood
 * de plek van de huisstijl inneemt in plaats van ernaast te staan.
 */
function Ctas({ saleActive }: { saleActive: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10 sm:mb-12">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 bg-white text-[#2C4A3E] font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-full hover:bg-[#F3EDE3] transition-colors text-sm shadow-lg"
      >
        {saleActive ? `Shop ${sale.campaign}` : 'Bekijk alle producten'}
        <ArrowRight size={15} />
      </Link>
      {saleActive && (
        /* De 20% is nieuw, dus de vraag erbij - en het antwoord staat
           direct onder de hero, bij de twee actiekaarten. */
        <Link
          href="#acties"
          className="text-sm font-medium text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Hoe werkt de {sale.tierDiscountPercent}%?
        </Link>
      )}
    </div>
  )
}

/**
 * De ronde badge aan de rand van de compositie.
 *
 * Alleen op de twee blokken mét foto. Het tabletblok is een vlak groen
 * paneel en geen compositie; een badge die daar in een hoek zweeft,
 * leest als een sticker die is blijven plakken.
 */
function RondeBadge({ className = '' }: { className?: string }) {
  return (
    <div
      className={`z-20 flex h-[5.25rem] w-[5.25rem] flex-col items-center justify-center rounded-full bg-bf-red text-center text-white shadow-lg ${className}`}
    >
      <span className="font-serif text-xl font-bold leading-none">{sale.discountPercent}%</span>
      <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em]">op alles</span>
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
  const saleActive = isSaleActive()

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
          <Eyebrow saleActive={saleActive} />
          <Heading
            saleActive={saleActive}
            className="font-serif text-3xl font-bold text-white leading-[1.1] tracking-tight mb-4"
          />
          <Subline saleActive={saleActive} className="text-base text-white/70 leading-relaxed mb-8" />
          <Ctas saleActive={saleActive} />
          <TrustBar />
        </div>
        {saleActive && <RondeBadge className="absolute bottom-8 right-5" />}
      </div>

      {/* Tablet only (sm to lg): text-only block, no photo. Unchanged from
          before - the phone photo hero above is scoped to phone width only. */}
      <div className="hidden sm:block lg:hidden bg-[#1F3329] px-5 sm:px-8 py-16 sm:py-20">
        <Eyebrow saleActive={saleActive} />
        <Heading
          saleActive={saleActive}
          className="font-serif text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-tight mb-4"
        />
        <Subline saleActive={saleActive} className="text-base text-white/70 leading-relaxed mb-8" />
        <Ctas saleActive={saleActive} />
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
            <Eyebrow saleActive={saleActive} />
            <Heading
              saleActive={saleActive}
              className="font-serif text-6xl xl:text-[4.25rem] font-bold text-white leading-[1.05] tracking-tight mb-6"
            />
            <Subline saleActive={saleActive} className="text-lg text-white/70 leading-relaxed mb-10" />
            <Ctas saleActive={saleActive} />
            <TrustBar />
          </div>
        </div>
        {saleActive && <RondeBadge className="absolute bottom-12 right-10" />}
      </div>
    </section>
  )
}
