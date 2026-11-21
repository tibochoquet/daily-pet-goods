import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { sale, saleTierLabel } from '@/config/sale'

/**
 * De twee treden van de actie, direct onder de hero.
 *
 * Twee acties naast elkaar zijn in één blik te overzien; dezelfde twee
 * in een alinea moet je lezen. Dit is ook de plek waar de vraag uit de
 * hero ("Hoe werkt de 20%?") wordt beantwoord - vandaar het anker.
 *
 * Rustige witte kaarten in de normale huisstijl: neutrale rand, een
 * kort groen streepje boven de kop, groene link. Geen rood - het rood
 * van deze actie zit op de prijzen, de klok en de ronde
 * percentage-badges, en een kaart is geen van drieën.
 *
 * Alleen de tweede kaart is een link. De eerste belooft niets om naartoe
 * te gaan - 10% staat al op elk product.
 */
function Streepje() {
  return <span className="mb-3 block h-[2px] w-7 bg-[#2C4A3E]" aria-hidden />
}

export default function SaleTiers() {
  return (
    <section id="acties" className="scroll-mt-24 bg-[#FAFAF7] pt-12 pb-10 sm:pt-16 sm:pb-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          <div className="rounded-2xl border border-[#E8E2D9] bg-white p-5 sm:p-6">
            <Streepje />
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A] sm:text-2xl">
              {sale.discountPercent}% korting op alles
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              Op elk product in de winkel. De actieprijs staat er al bij, je hoeft geen
              kortingscode in te vullen.
            </p>
          </div>

          <Link
            href="/shop"
            className="group flex flex-col rounded-2xl border border-[#E8E2D9] bg-white p-5 transition-colors hover:border-[#2C4A3E] sm:p-6"
          >
            <Streepje />
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A] sm:text-2xl">
              {sale.tierDiscountPercent}% korting vanaf {saleTierLabel()}
            </h2>
            {/* Kort gehouden op twee regels, net als de kaart ernaast.
                Stond hier een regel meer, dan kreeg de linkerkaart een
                lege strook onderin - de twee houden immers dezelfde
                hoogte. */}
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              Vanaf {saleTierLabel()} in je winkelwagen wordt het {sale.tierDiscountPercent}% op je
              hele bestelling, in plaats van de {sale.discountPercent}%.
            </p>
            <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#2C4A3E]">
              Naar de producten
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
