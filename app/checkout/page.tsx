'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (items.length === 0) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items,
          subtotal,
          total: subtotal,
        }),
      })
      if (!res.ok) throw new Error('Bestelling versturen mislukt')
      clearCart()
      router.push('/checkout/bevestiging')
    } catch {
      setError('Er ging iets mis bij het plaatsen van je bestelling. Probeer het opnieuw of mail ons op lifegoods.daily@gmail.com.')
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-[#6B7280] mb-6">Je winkelwagen is leeg.</p>
        <Link href="/shop" className="text-[#2C4A3E] font-medium hover:underline">
          Terug naar shop
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
        Terug naar winkelwagen
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
              <h2 className="font-semibold text-[#1A1A1A] mb-4">Contactgegevens</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1">Voornaam *</label>
                  <input
                    name="firstName"
                    required
                    value={form.firstName}
                    onChange={handleField}
                    className="w-full border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1">Achternaam *</label>
                  <input
                    name="lastName"
                    required
                    value={form.lastName}
                    onChange={handleField}
                    className="w-full border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1">E-mail *</label>
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
                  <label className="block text-xs font-medium text-[#6B7280] mb-1">Telefoon</label>
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
              <h2 className="font-semibold text-[#1A1A1A] mb-4">Verzendadres</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[#6B7280] mb-1">Straat *</label>
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
                  <label className="block text-xs font-medium text-[#6B7280] mb-1">Postcode *</label>
                  <input
                    name="postalCode"
                    required
                    value={form.postalCode}
                    onChange={handleField}
                    className="w-full border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1">Plaats *</label>
                  <input
                    name="city"
                    required
                    value={form.city}
                    onChange={handleField}
                    className="w-full border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#6B7280] mb-1">Opmerking (optioneel)</label>
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

            <p className="text-xs text-[#9CA3AF] leading-relaxed px-1">
              Na het plaatsen van je bestelling ontvang je binnen 24 uur een betaalverzoek (Tikkie of bankoverschrijving) van ons. Zodra de betaling binnen is, versturen we je bestelling.
            </p>
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sticky top-24 space-y-5">
              <h2 className="font-serif font-semibold text-[#1A1A1A] text-lg">
                Overzicht
              </h2>

              <div className="space-y-3 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-[#4B5563]">
                    <span className="truncate mr-2">
                      {item.name}
                      <span className="text-[#9CA3AF]"> · {item.variantLabel} ×{item.quantity}</span>
                    </span>
                    <span className="flex-shrink-0">€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t border-[#E8E2D9] pt-4">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Subtotaal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Verzending</span>
                  <span className="text-[#2C4A3E] font-medium">Gratis</span>
                </div>
                <div className="flex justify-between font-semibold text-[#1A1A1A] text-base pt-1">
                  <span>Totaal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
              </div>

              {error && <p className="text-xs text-[#C8745A]">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#C8745A] text-white font-semibold py-3.5 rounded-full hover:bg-[#A85E45] transition-colors disabled:opacity-60"
              >
                {submitting ? 'Bezig met plaatsen…' : 'Bestelling plaatsen'}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
