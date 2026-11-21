'use client'

import Image from 'next/image'
import { Check, Plus } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { formatPrice } from '@/lib/business'
import { sale, saleTierLabel } from '@/config/sale'
import { pricingFor, saleCartTotals } from '@/lib/sale'

/**
 * De voortgangsbalk naar de tweede trede, bovenaan de winkelwagen.
 *
 * Werkt live mee met toevoegen en verwijderen omdat alles uit `useCart`
 * komt - er wordt hier niets opgeslagen en niets opgehaald.
 *
 * Rekent met `saleCartTotals` uit lib/sale.ts, dezelfde functie die de
 * checkout aan de serverkant gebruikt. Zou dit component zelf
 * "subtotaal >= 100" doen, dan zijn er twee plekken die de drempel
 * kennen, en de dag dat die twee niet meer gelijk zijn, belooft deze
 * balk 20% die Stripe niet geeft.
 *
 * `saleActive` komt van de server. De browser bepaalt dat niet zelf:
 * dan zou een verkeerd gezette klok korting kunnen tonen die de checkout
 * daarna weigert.
 */

/** Eén suggestie. Komt van de server, zie app/winkelwagen/page.tsx. */
export interface TierSuggestie {
  /** Variant-id, precies zoals de winkelwagen het bewaart. */
  id: string
  name: string
  variantLabel: string
  /** De normale prijs, in euro's. */
  price: number
  image: string
}

const MAX_SUGGESTIES = 3

export default function CartTierProgress({
  saleActive,
  suggestions,
}: {
  saleActive: boolean
  suggestions: TierSuggestie[]
}) {
  const { items, addItem } = useCart()

  const totals = saleCartTotals(
    items.map((i) => ({ price: i.price, quantity: i.quantity })),
    saleActive
  )

  if (!totals.active) return null

  const percentage = totals.tierReached
    ? 100
    : Math.min(100, Math.round((totals.subtotal / sale.tierThreshold) * 100))

  /**
   * De suggesties: wat er nog niet in de winkelwagen zit, op prijs
   * gesorteerd rond het ontbrekende bedrag. Bij een gelijke afstand
   * wint het product dat de drempel wél haalt - dat is tenslotte het
   * doel van de rij.
   */
  const inWinkelwagen = new Set(items.map((i) => i.id))
  const tips = totals.tierReached
    ? []
    : suggestions
        .filter((s) => !inWinkelwagen.has(s.id))
        .sort((a, b) => {
          const da = Math.abs(a.price - totals.remainingForTier)
          const db = Math.abs(b.price - totals.remainingForTier)
          if (da !== db) return da - db
          const haalt = (p: number) => (p >= totals.remainingForTier ? 0 : 1)
          if (haalt(a.price) !== haalt(b.price)) return haalt(a.price) - haalt(b.price)
          return a.price - b.price
        })
        .slice(0, MAX_SUGGESTIES)

  return (
    <div
      className={`mb-8 rounded-2xl border p-5 sm:p-6 ${
        totals.tierReached ? 'border-bf-red/30 bg-bf-red-tint' : 'border-bf-red/25 bg-white'
      }`}
    >
      {totals.tierReached ? (
        <p className="flex items-start gap-2.5 text-sm font-semibold leading-snug text-bf-red">
          <Check size={16} className="mt-0.5 shrink-0" />
          Je krijgt {sale.tierDiscountPercent}% {sale.campaign}-korting op je hele bestelling.
        </p>
      ) : (
        <p className="text-sm leading-snug text-[#1A1A1A]">
          Nog{' '}
          <span className="font-bold text-bf-red">{formatPrice(totals.remainingForTier)}</span>{' '}
          besteden voor {sale.tierDiscountPercent}% korting op je hele bestelling.
        </p>
      )}

      {/* Dun, en de enige plek in dit blok met een gevuld rood vlak. */}
      <div
        className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-bf-red/15"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Voortgang naar ${sale.tierDiscountPercent}% korting vanaf ${saleTierLabel()}`}
      >
        <div
          className="h-full rounded-full bg-bf-red transition-[width] duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {tips.length > 0 && (
        <div className="mt-5 border-t border-[#E8E2D9] pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
            Voeg toe voor extra korting
          </p>
          <ul className="space-y-2">
            {tips.map((tip) => {
              const prijs = pricingFor(tip.price, true)!
              return (
                <li key={tip.id} className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#F3EDE3]">
                    <Image
                      src={tip.image}
                      alt={tip.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[#1A1A1A]">{tip.name}</p>
                    <p className="text-xs">
                      <span className="whitespace-nowrap font-semibold text-bf-red">
                        {formatPrice(prijs.current)}
                      </span>{' '}
                      <s className="whitespace-nowrap text-[#9CA3AF] decoration-[#9CA3AF]">
                        {formatPrice(prijs.base)}
                      </s>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        id: tip.id,
                        name: tip.name,
                        variantLabel: tip.variantLabel,
                        price: tip.price,
                        image: tip.image,
                      })
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bf-red text-white transition-colors hover:bg-bf-red-dark"
                    aria-label={`${tip.name} toevoegen aan winkelwagen`}
                  >
                    <Plus size={16} />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
