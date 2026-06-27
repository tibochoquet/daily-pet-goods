'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Tag, X, ChevronLeft } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'

export default function CheckoutPage() {
  const router = useRouter()
  const {
    items,
    subtotal,
    total,
    discountAmount,
    discountActive,
    promoCode,
    applyPromo,
    removePromo,
    clearCart,
  } = useCart()

  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    notes: '',
  })

  function handleField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handlePromo(e: FormEvent) {
    e.preventDefault()
    const ok = applyPromo(promoInput.trim())
    if (ok) {
      setPromoError('')
      setPromoInput('')
    } else {
      setPromoError('Invalid promo code.')
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (items.length === 0) return
    setSubmitting(true)

    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items,
          subtotal,
          discountAmount,
          total,
          promoCode: promoCode ?? undefined,
        }),
      })
    } catch {
      // Fire-and-forget; confirmation still shown
    }

    clearCart()
    router.push('/checkout/bevestiging')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-[#6B7280] mb-6">Your cart is empty.</p>
        <Link href="/shop" className="text-[#2C4A3E] font-medium hover:underline">
          Back to shop
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <Link
        href="/winkelwagen"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#2C4A3E] transition-colors mb-8"
      >
        <ChevronLeft size={14} />
        Back to cart
      </Link>

      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: customer details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact */}
            <section className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
              <h2 className="font-semibold text-[#1A1A1A] mb-4">Contact details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1">First name *</label>
                  <input
                    name="firstName"
                    required
                    value={form.firstName}
                    onChange={handleField}
                    className="w-full border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1">Last name *</label>
                  <input
                    name="lastName"
                    required
                    value={form.lastName}
                    onChange={handleField}
                    className="w-full border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1">Email *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleField}
                    className="w-full border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleField}
                    className="w-full border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
              <h2 className="font-semibold text-[#1A1A1A] mb-4">Shipping address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[#6B7280] mb-1">Street *</label>
                    <input
                      name="street"
                      required
                      value={form.street}
                      onChange={handleField}
                      className="w-full border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B7280] mb-1">Nr. *</label>
                    <input
                      name="houseNumber"
                      required
                      value={form.houseNumber}
                      onChange={handleField}
                      className="w-full border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1">Postal code *</label>
                  <input
                    name="postalCode"
                    required
                    value={form.postalCode}
                    onChange={handleField}
                    className="w-full border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1">City *</label>
                  <input
                    name="city"
                    required
                    value={form.city}
                    onChange={handleField}
                    className="w-full border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#6B7280] mb-1">Order notes (optional)</label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={form.notes}
                    onChange={handleField}
                    className="w-full border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] transition-colors resize-none"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sticky top-24 space-y-5">
              <h2 className="font-serif font-semibold text-[#1A1A1A] text-lg">
                Order summary
              </h2>

              {/* Items */}
              <div className="space-y-3 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-[#4B5563]">
                    <span className="truncate mr-2">
                      {item.name}
                      <span className="text-[#9CA3AF] ml-1">×{item.quantity}</span>
                    </span>
                    <span className="flex-shrink-0">€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Promo */}
              {discountActive ? (
                <div className="flex items-center justify-between bg-[#F0F7F4] rounded-xl px-3 py-2.5 text-sm">
                  <div className="flex items-center gap-2 text-[#2C4A3E] font-medium">
                    <Tag size={13} />
                    {promoCode} − €{discountAmount.toFixed(2)}
                  </div>
                  <button
                    type="button"
                    onClick={removePromo}
                    className="text-[#6B7280] hover:text-[#C8745A] transition-colors"
                    aria-label="Remove promo code"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePromo} className="flex gap-2">
                  <input
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); setPromoError('') }}
                    placeholder="Promo code"
                    className="flex-1 min-w-0 border border-[#E8E2D9] rounded-xl px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-[#F3EDE3] text-[#2C4A3E] text-sm font-medium px-3 py-2 rounded-xl hover:bg-[#E8E2D9] transition-colors flex-shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-xs text-[#C8745A] -mt-2">{promoError}</p>
              )}

              {/* Totals */}
              <div className="space-y-2 text-sm border-t border-[#E8E2D9] pt-4">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                {discountActive && (
                  <div className="flex justify-between text-[#2C4A3E]">
                    <span>Discount</span>
                    <span>−€{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6B7280]">
                  <span>Shipping</span>
                  <span className="text-[#2C4A3E] font-medium">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-[#1A1A1A] text-base pt-1">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#C8745A] text-white font-semibold py-3.5 rounded-full hover:bg-[#A85E45] transition-colors disabled:opacity-60"
              >
                {submitting ? 'Placing order…' : 'Place order'}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
