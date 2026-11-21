import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { brandImages } from '@/lib/images'
import { sale, saleEndShort, saleTierLabel } from '@/config/sale'

/**
 * De hero tijdens de actie: tekst links op crème, foto rechts.
 *
 * Bewust een eigen component en geen variant binnen components/home/Hero.tsx.
 * Die hero heeft drie compositie-varianten voor telefoon, tablet en
 * desktop omdat één foto niet op alle drie de verhoudingen werkt; de
 * actietekst er ook nog doorheen weven betekende dat elke wijziging op
 * drie plekken moest kloppen. Zo blijft de gewone hero precies zoals hij
 * was, en is dit één compositie die op elke breedte hetzelfde doet.
 *
 * Licht en luchtig in plaats van een donkere laag over een foto. Het
 * eerste wat je op een actiepagina ziet moet nog steeds een winkel zijn
 * die mooie dingen verkoopt. Daarom: één rood vlak (de knop), één rode
 * regel (het streepje bij de datum) en één rode badge over de rand van
 * de foto. De kop zelf is zwart in Playfair en niet rood op rood.
 *
 * De countdown staat hier niet. Die hoort in de balk bovenaan, en twee
 * klokken op hetzelfde scherm maken van een winkel een aftelpagina.
 */
export default function SaleHero() {
  return (
    <section className="bg-[#FAFAF7]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 pt-12 pb-16 sm:px-8 sm:pt-16 sm:pb-20 lg:grid-cols-2 lg:gap-16 lg:pt-20 lg:pb-24">
        {/* Tekst */}
        <div className="max-w-xl">
          <p className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-bf-red">
            <span className="h-px w-7 shrink-0 bg-bf-red" aria-hidden />
            {sale.campaign} &middot; t/m {saleEndShort()}
          </p>

          {/* Kort genoeg om op elke breedte binnen twee regels te
              blijven. De lange alinea die hier eerst stond is één regel
              geworden: de twee percentages zijn de hele boodschap. */}
          <h1 className="font-serif text-[2.75rem] font-bold leading-[1.04] tracking-tight text-[#1A1A1A] sm:text-6xl lg:text-[4.25rem]">
            {sale.campaign}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-[#4B5563] sm:text-xl">
            {sale.discountPercent}% korting op alles.{' '}
            <span className="font-semibold text-[#1A1A1A]">
              {sale.tierDiscountPercent}% vanaf {saleTierLabel()}.
            </span>
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-bf-red px-7 py-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-bf-red-dark"
            >
              Shop {sale.campaign}
              <ArrowRight size={15} />
            </Link>
            {/* De secundaire actie is een vraag en geen tweede knop: de
                20% is nieuw, dus het antwoord staat direct hieronder. */}
            <Link
              href="#acties"
              className="text-sm font-medium text-[#4B5563] underline-offset-4 transition-colors hover:text-bf-red hover:underline"
            >
              Hoe werkt de {sale.tierDiscountPercent}%?
            </Link>
          </div>
        </div>

        {/* Foto */}
        <div className="relative">
          {/* Staand op een telefoon - daar is deze foto voor gemaakt - en
              liggender op een desktop, want 4/5 maakt de hero daar hoger
              dan het scherm en dan valt de badge precies op de vouw. De
              uitsnede zakt mee naar beneden (object-position 72%): hond
              en kat zitten in de onderste helft van het beeld en zouden
              bij een gewone middenuitsnede half wegvallen. */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#F3EDE3] lg:aspect-[7/6]">
            <Image
              src={brandImages.heroMobile}
              alt="Cavalier King Charles spaniël en Britse korthaar kat samen op een hondenmand"
              fill
              className="object-cover lg:object-[center_72%]"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={85}
            />
          </div>
          {/* De enige badge op de pagina, en hij hangt onder de onderrand
              in plaats van over een hoek: zo valt hij nooit over de ogen
              van de hond en klemt hij op 320px niet tegen de zijkant. De
              ring in de achtergrondkleur zet hem los van de foto. */}
          <div className="absolute -bottom-5 left-6 flex h-[5.25rem] w-[5.25rem] flex-col items-center justify-center rounded-full bg-bf-red text-center text-white shadow-md ring-4 ring-[#FAFAF7]">
            <span className="font-serif text-xl font-bold leading-none">
              {sale.discountPercent}%
            </span>
            <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em]">
              op alles
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
