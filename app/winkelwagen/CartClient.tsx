'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, X } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { btwAmount, formatPrice } from '@/lib/business'
import { sale } from '@/config/sale'
import { saleDiscountCents, toCents } from '@/lib/sale'
import SaleBadge from '@/components/sale/SaleBadge'

interface AppliedDiscount {
  code: string
  label: string
  percentOff: number
  eligibleSubtotal: number
  amountOff: number
}

/**
 * `saleActive` komt van de server (zie page.tsx). De browser bepaalt dit
 * niet zelf: dan zou een verkeerd gezette klok korting kunnen tonen die
 * de checkout daarna weigert.
 */
export default function CartClient({ saleActive }: { saleActive: boolean }) {
  const { items, subtotal, removeItem, setQuantity, discountCode, setDiscountCode } = useCart()
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState('')

  const [codeInput, setCodeInput] = useState('')
  const [discount, setDiscount] = useState<AppliedDiscount | null>(null)
  const [discountError, setDiscountError] = useState('')
  const [applying, setApplying] = useState(false)

  const cartLines = items.map((i) => ({ id: i.id, quantity: i.quantity }))
  const cartKey = JSON.stringify(cartLines)

  /**
   * Re-validates the stored code against the current cart on every cart
   * change. This is what makes the discount lapse by itself when the last
   * jacket is removed - the amount is never carried over from a previous
   * cart state, it's always what the server says about the cart as it is
   * right now.
   */
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const lines = JSON.parse(cartKey) as { id: string; quantity: number }[]
      // Tijdens de actie geldt de actiekorting en wordt een code niet
      // toegepast. Niet eens navragen: de server zou een nette weigering
      // terugsturen, maar die zou hier als foutmelding verschijnen voor
      // een code die de klant dagen eerder heeft ingevuld.
      if (saleActive || !discountCode || lines.length === 0) {
        if (!cancelled) setDiscount(null)
        return
      }
      try {
        const res = await fetch('/api/discount/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: discountCode, items: lines }),
        })
        const data = await res.json()
        if (cancelled) return
        if (res.ok && data.ok) {
          setDiscount(data.discount)
          setDiscountError('')
        } else {
          setDiscount(null)
          setDiscountError(data.error || '')
        }
      } catch {
        if (!cancelled) setDiscount(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [discountCode, cartKey, saleActive])

  const applyCode = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!codeInput.trim()) return
      setApplying(true)
      setDiscountError('')
      try {
        const res = await fetch('/api/discount/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: codeInput,
            items: cartLines,
            // Present only when a code is already applied, so the server
            // can refuse the second one with the right message.
            activeCode: discountCode ?? undefined,
          }),
        })
        const data = await res.json()
        if (res.ok && data.ok) {
          setDiscountCode(data.discount.code)
          setDiscount(data.discount)
          setCodeInput('')
          setDiscountError('')
        } else {
          setDiscountError(data.error || 'Deze kortingscode bestaat niet.')
        }
      } catch {
        setDiscountError('Er ging iets mis. Probeer het opnieuw.')
      } finally {
        setApplying(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [codeInput, cartKey, discountCode, setDiscountCode]
  )

  function clearCode() {
    setDiscountCode(null)
    setDiscount(null)
    setDiscountError('')
  }

  // Only ever trust a confirmed amount that still belongs to the code
  // currently in the cart, so a cleared code can't briefly keep
  // discounting during the render before the effect catches up.
  const activeDiscount =
    !saleActive && discountCode && discount?.code === discountCode ? discount : null

  /**
   * De actiekorting over deze winkelwagen.
   *
   * Hier per stuk afgerond en dan vermenigvuldigd, precies zoals
   * lib/saleCart.ts het op de server doet. Dezelfde formule aan beide
   * kanten is wat garandeert dat het bedrag in dit overzicht gelijk is
   * aan wat Stripe straks int; over het subtotaal afronden scheelt bij
   * sommige prijzen een cent.
   */
  const saleAmountOff = saleActive
    ? items.reduce((som, i) => som + saleDiscountCents(toCents(i.price)) * i.quantity, 0) / 100
    : 0

  const total = Math.max(0, subtotal - saleAmountOff - (activeDiscount?.amountOff ?? 0))

  /** Regeltotaal in centen, zodat drie keer 35,99 niet 107,97000000001 wordt. */
  function regelTotaalCenten(prijs: number, aantal: number): number {
    const basis = toCents(prijs)
    return (saleActive ? basis - saleDiscountCents(basis) : basis) * aantal
  }

  async function handleCheckout() {
    setCheckingOut(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartLines,
          discountCode: activeDiscount ? discountCode : undefined,
          // Wat deze pagina aan de klant heeft getoond. De server
          // vergelijkt het met zijn eigen klok en weigert de sessie als
          // het niet meer klopt - zie app/api/checkout/route.ts. Zo kan
          // een tabblad dat sinds voor de einddatum openstaat geen
          // actieprijs meer afrekenen, en krijgt de klant een duidelijke
          // melding in plaats van een ander bedrag bij Stripe.
          saleShown: saleActive,
        }),
      })
      const data = await res.json().catch(() => ({}))
      // 409 is de statuscode die deze route gebruikt voor iets waar de
      // klant zelf wat aan kan doen: uitverkocht, nog niet te bestellen,
      // of een actie die net is afgelopen. Die melding hoort hij te
      // lezen in plaats van de algemene "er ging iets mis".
      if (res.status === 409 && typeof data.error === 'string') {
        setError(data.error)
        setCheckingOut(false)
        return
      }
      if (!res.ok || !data.url) throw new Error('Checkout mislukt')
      window.location.href = data.url
    } catch {
      setError('Er ging iets mis bij het starten van de betaling. Probeer het opnieuw.')
      setCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-[#C8B89A] mb-6" />
        <h1 className="font-serif text-2xl font-semibold text-[#1A1A1A] mb-3">
          Je winkelwagen is leeg
        </h1>
        <p className="text-[#6B7280] mb-8">
          Voeg producten toe om te beginnen.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#2C4A3E] text-white font-medium px-6 py-3 rounded-full hover:bg-[#3D6456] transition-colors"
        >
          <ShoppingBag size={16} />
          Nu shoppen
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-8">
        Winkelwagen
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white border border-[#E8E2D9] rounded-2xl p-4"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F3EDE3] flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#1A1A1A] text-sm leading-snug line-clamp-2 mb-0.5">
                  {item.name}
                </h3>
                <p className="text-xs text-[#9CA3AF] mb-3">{item.variantLabel}</p>

                {/* flex-wrap: met twee prijzen naast elkaar passen de
                    aantalknoppen en het bedrag op een 320px-telefoon niet
                    meer op één regel, en dan werd de stepper platgedrukt.
                    Nu zakt het bedrag naar een eigen regel, rechts
                    uitgelijnd via ml-auto. */}
                <div className="flex flex-wrap items-center justify-between gap-y-2">
                  {/* Quantity */}
                  <div className="flex shrink-0 items-center border border-[#E8E2D9] rounded-full overflow-hidden">
                    <button
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F3EDE3] transition-colors"
                      aria-label="Aantal verlagen"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-[#1A1A1A]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F3EDE3] transition-colors"
                      aria-label="Aantal verhogen"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <div className="ml-auto flex shrink-0 items-center gap-3">
                    <span className="text-sm text-[#1A1A1A]">
                      {/* whitespace-nowrap per bedrag: formatPrice zet een
                          gewone spatie tussen het euroteken en het getal,
                          en met twee prijzen naast elkaar brak de regel
                          precies daar - "€ 79,98 €" met "71,98" eronder.
                          Afbreken mag wel tússen de twee prijzen. */}
                      {saleActive && (
                        <s className="whitespace-nowrap text-[#9CA3AF] decoration-[#9CA3AF] mr-1.5">
                          {formatPrice(item.price * item.quantity)}
                        </s>
                      )}
                      <span className="whitespace-nowrap font-semibold">
                        {formatPrice(regelTotaalCenten(item.price, item.quantity) / 100)}
                      </span>
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#C8745A] hover:text-[#A85E45] transition-colors"
                      aria-label="Verwijderen"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sticky top-24">
            <h2 className="font-serif font-semibold text-[#1A1A1A] text-lg mb-5">
              Overzicht
            </h2>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-[#6B7280]">
                <span>Subtotaal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {saleActive && saleAmountOff > 0 && (
                <div className="flex items-center justify-between gap-2 text-[#2C4A3E]">
                  <span className="flex items-center gap-1.5">
                    {sale.campaign}-korting
                    <SaleBadge />
                  </span>
                  <span className="whitespace-nowrap font-medium">
                    &minus; {formatPrice(saleAmountOff)}
                  </span>
                </div>
              )}
              {activeDiscount && (
                <div className="flex justify-between text-[#2C4A3E]">
                  <span className="flex items-center gap-1.5">
                    Korting ({activeDiscount.code})
                    <button
                      type="button"
                      onClick={clearCode}
                      className="text-[#9CA3AF] hover:text-[#C8745A] transition-colors"
                      aria-label="Kortingscode verwijderen"
                    >
                      <X size={13} />
                    </button>
                  </span>
                  <span className="font-medium">&minus; {formatPrice(activeDiscount.amountOff)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B7280]">
                <span>Verzending (NL &amp; BE)</span>
                <span className="text-[#2C4A3E] font-medium">Gratis</span>
              </div>
              <div className="border-t border-[#E8E2D9] pt-3 flex justify-between font-semibold text-[#1A1A1A] text-base">
                <span>Totaal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-[#9CA3AF]">Inclusief {formatPrice(btwAmount(total))} btw (21%)</p>
            </div>

            {/* Discount code */}
            <div className="mb-5 pb-5 border-b border-[#E8E2D9]">
              {saleActive ? (
                /* Geen invoerveld tijdens de actie: de korting staat er
                   al op en een code is niet te combineren. Een veld dat
                   elke code weigert, is onvriendelijker dan geen veld. */
                <p className="text-xs text-[#2C4A3E]">
                  <span className="font-semibold">{sale.campaign}-korting toegepast</span>:{' '}
                  {sale.discountPercent}% op alles.
                  {saleAmountOff > 0 && <> Je bespaart {formatPrice(saleAmountOff)}.</>} Een
                  kortingscode kun je er niet bij gebruiken.
                </p>
              ) : activeDiscount ? (
                <p className="text-xs text-[#2C4A3E]">
                  Kortingscode <span className="font-semibold">{activeDiscount.code}</span> toegepast: {activeDiscount.label}.
                </p>
              ) : (
                <form onSubmit={applyCode} className="flex gap-2">
                  <input
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Kortingscode"
                    aria-label="Kortingscode"
                    className="flex-1 min-w-0 bg-white border border-[#E8E2D9] rounded-full px-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2C4A3E] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={applying || !codeInput.trim()}
                    className="shrink-0 border border-[#2C4A3E] text-[#2C4A3E] text-sm font-medium px-4 py-2.5 rounded-full hover:bg-[#2C4A3E] hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#2C4A3E]"
                  >
                    {applying ? '…' : 'Toepassen'}
                  </button>
                </form>
              )}
              {discountError && <p className="text-xs text-[#C8745A] mt-2">{discountError}</p>}
            </div>

            <p className="text-xs text-[#6B7280] mb-4">
              Betalen via iDEAL, creditcard, Bancontact, Klarna en meer.
            </p>

            {error && <p className="text-xs text-[#C8745A] mb-3">{error}</p>}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkingOut}
              className="block w-full text-center bg-[#C8745A] text-white font-semibold py-3.5 rounded-full hover:bg-[#A85E45] transition-colors disabled:opacity-60"
            >
              {checkingOut ? 'Bezig...' : 'Doorgaan naar betalen'}
            </button>

            <p className="text-xs text-[#6B7280] text-center mt-3">
              Je hebt 14 dagen bedenktijd.{' '}
              <Link href="/retourneren" className="text-[#2C4A3E] hover:underline">
                Bekijk ons retourbeleid
              </Link>
            </p>

            <Link
              href="/shop"
              className="block w-full text-center text-sm text-[#6B7280] hover:text-[#2C4A3E] transition-colors mt-4"
            >
              Verder shoppen
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
