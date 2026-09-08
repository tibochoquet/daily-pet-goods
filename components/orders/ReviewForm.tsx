'use client'

import { useState, FormEvent } from 'react'
import { Star, CheckCircle2 } from 'lucide-react'
import type { Order } from '@/lib/orders'

export default function ReviewForm({ order }: { order: Order }) {
  const reviewable = order.items.filter(
    (item) => item.productSlug && !order.reviewedProductSlugs.includes(item.productSlug)
  )

  const [productSlug, setProductSlug] = useState(reviewable[0]?.productSlug ?? '')
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  if (reviewable.length === 0) {
    return <p className="text-sm text-[#6B7280]">Je hebt al een review achtergelaten voor de producten uit deze bestelling.</p>
  }

  if (status === 'sent') {
    return (
      <div className="flex items-center gap-3 bg-[#2C4A3E]/10 text-[#2C4A3E] rounded-xl p-4 text-sm">
        <CheckCircle2 size={20} className="shrink-0" />
        <span>Bedankt voor je review!</span>
      </div>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(order.orderRef)}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug, rating, title, text, displayName }),
      })
      if (!res.ok) throw new Error('mislukt')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {reviewable.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Welk product?</label>
          <select
            value={productSlug}
            onChange={(e) => setProductSlug(e.target.value)}
            className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E]"
          >
            {reviewable.map((item) => (
              <option key={item.productSlug} value={item.productSlug ?? ''}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Beoordeling</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} sterren`}>
              <Star size={24} className={n <= rating ? 'fill-[#C8745A] text-[#C8745A]' : 'text-[#E8E2D9]'} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Titel</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Je review</label>
        <textarea
          required
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] resize-none focus:outline-none focus:border-[#2C4A3E]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Naam (optioneel)</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Hoe wil je vermeld worden?"
          className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#B0A898] focus:outline-none focus:border-[#2C4A3E]"
        />
      </div>

      {status === 'error' && <p className="text-sm text-[#C8745A]">Er ging iets mis. Probeer het opnieuw.</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-[#2C4A3E] text-white font-semibold py-3 rounded-xl hover:bg-[#3D6456] transition-colors text-sm disabled:opacity-60"
      >
        {status === 'sending' ? 'Bezig…' : 'Review versturen'}
      </button>
    </form>
  )
}
