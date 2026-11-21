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
 * Rustige witte kaarten met een dunne rode rand en een kort rood
 * streepje boven de kop: hetzelfde streepje als bij de datum in de hero
 * en bij de kop van de dealsectie. Dat maakt het rood een accent dat
 * terugkomt in plaats van drie losse rode vlakken.
 *
 * Alleen de tweede kaart is een link. De eerste belooft niets om naartoe
 * te gaan - 10% staat al op elk product.
 */
function Streepje() {
  return <span className="mb-4 block h-[2px] w-7 bg-bf-red" aria-hidden />
}

export default function SaleTiers() {
  return (
    <section id="acties" className="scroll-mt-24 bg-[#FAFAF7] pb-16 sm:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          <div className="rounded-2xl border border-bf-red/25 bg-white p-6 sm:p-7">
            <Streepje />
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A] sm:text-2xl">
              {sale.discountPercent}% korting op alles
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[#6B7280]">
              Op elk product in de winkel. De actieprijs staat er al bij, je hoeft geen
              kortingscode in te vullen.
            </p>
          </div>

          <Link
            href="/shop"
            className="group flex flex-col rounded-2xl border border-bf-red/25 bg-white p-6 transition-colors hover:border-bf-red sm:p-7"
          >
            <Streepje />
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A] sm:text-2xl">
              {sale.tierDiscountPercent}% korting vanaf {saleTierLabel()}
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[#6B7280]">
              Zit er {saleTierLabel()} of meer in je winkelwagen, dan wordt het{' '}
              {sale.tierDiscountPercent}% op je hele bestelling. In plaats van de{' '}
              {sale.discountPercent}%, niet erbovenop.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-bf-red">
              Naar de producten
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
