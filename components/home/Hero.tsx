import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, Sparkles, ShieldCheck, Truck, Tag } from 'lucide-react'
import { brandImages } from '@/lib/images'
import { isSaleActive, sale, saleEndLabel, saleEndShort } from '@/config/sale'
import SaleCountdown from '@/components/sale/SaleCountdown'

/**
 * De hero heeft drie varianten naast elkaar - telefoon met foto, tablet
 * zonder foto, desktop met foto - omdat één foto niet op alle drie de
 * verhoudingen werkt.
 *
 * De actietekst zit daarom in losse onderdelen die alle drie de blokken
 * gebruiken, met de opmaakklassen als parameter. Drie keer dezelfde
 * tekst uitschrijven zou betekenen dat een wijziging op één plek wordt
 * vergeten, en dan staat er op een tablet iets anders dan op een
 * telefoon.
 */

function Eyebrow({ saleActive }: { saleActive: boolean }) {
  if (saleActive) {
    return (
      <div className="inline-flex items-center gap-2 bg-sale text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full mb-6 sm:mb-8 shadow-[0_8px_26px_rgba(224,31,45,0.45)]">
        <Tag size={12} />
        {sale.campaign} &middot; t/m {saleEndShort()}
      </div>
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
    return (
      <h1 className={className}>
        {/* Het rode vlak zit om de korting zelf en niet om de hele regel:
            dat is het stuk dat van een meter afstand gelezen moet worden.
            `box-decoration-clone` zorgt dat het vlak op een smalle
            telefoon netjes om elke regel heen loopt in plaats van om het
            geheel, wat een scheve hap uit de tweede regel geeft. */}
        <span className="box-decoration-clone bg-sale px-2.5 text-white">
          {sale.discountPercent}% korting
        </span>{' '}
        op alles in de winkel.
      </h1>
    )
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
    return (
      <p className={className}>
        Van verhoogde voerbakken tot winterjassen: tot en met {saleEndLabel()} gaat er{' '}
        {sale.discountPercent}% van elke prijs af. Automatisch, je hebt er geen code voor nodig.
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
 * Dezelfde knoptekst met en zonder actie. "Bekijk alle producten met
 * korting" liep op een 320px-telefoon over twee regels, en de korting
 * staat op dat moment al in de pil, de kop én de subregel - een vierde
 * keer in de knop is ruis.
 */
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

/**
 * De aftelklok in de hero.
 *
 * Staat los van de balk bovenaan, want die scrollt weg en dit is het
 * eerste wat iemand ziet. Glas over de foto in plaats van rood: het rood
 * zit al in de pil erboven en in de kop, en drie rode vlakken boven
 * elkaar wordt een poster in plaats van een winkel.
 */
function SaleClock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/25 backdrop-blur-sm px-4 py-2 text-sm text-white ${className}`}
    >
      <Clock size={14} aria-hidden />
      <span className="text-white/75">Nog</span>
      <SaleCountdown className="font-bold" />
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
        {/* Tijdens de actie een extra donkere laag over de foto: de
            actietekst is langer dan de gewone en moet ook boven de
            lichte delen van de foto leesbaar blijven. */}
        {saleActive && <div className="absolute inset-0 bg-black/45" />}
        <div className="relative z-10 px-5 py-16">
          <Eyebrow saleActive={saleActive} />
          <Heading
            saleActive={saleActive}
            className="font-serif text-3xl font-bold text-white leading-[1.1] tracking-tight mb-4"
          />
          <Subline saleActive={saleActive} className="text-base text-white/70 leading-relaxed mb-8" />
          {saleActive && <SaleClock className="mb-7" />}
          <Ctas />
          <TrustBar />
        </div>
      </div>

      {/* Tablet only (sm to lg): text-only block, no photo. Unchanged from
          before - the new phone photo hero above is scoped to phone width
          only. */}
      <div className={`hidden sm:block lg:hidden px-5 sm:px-8 py-16 sm:py-20 ${saleActive ? 'bg-gradient-to-br from-[#1A1A1A] via-[#3B0710] to-[#7A0A14]' : 'bg-[#1F3329]'}`}>
        <Eyebrow saleActive={saleActive} />
        <Heading
          saleActive={saleActive}
          className="font-serif text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-tight mb-4"
        />
        <Subline saleActive={saleActive} className="text-base text-white/70 leading-relaxed mb-8" />
        {saleActive && <SaleClock className="mb-7" />}
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
        {saleActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent" />
        )}

        {/* Content. Left side, over the darker area */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 py-32">
          <div className="max-w-lg">
            <Eyebrow saleActive={saleActive} />
            <Heading
              saleActive={saleActive}
              className="font-serif text-6xl xl:text-[4.25rem] font-bold text-white leading-[1.05] tracking-tight mb-6"
            />
            <Subline saleActive={saleActive} className="text-lg text-white/70 leading-relaxed mb-10" />
            {saleActive && <SaleClock className="mb-9" />}
            <Ctas />
            <TrustBar />
          </div>
        </div>
      </div>
    </section>
  )
}
