'use client'

import { useState, FormEvent } from 'react'
import { Star, CheckCircle2 } from 'lucide-react'

interface ReviewSubmitFormProps {
  products: string[]
  initialProduct?: string
}

export default function ReviewSubmitForm({ products, initialProduct }: ReviewSubmitFormProps) {
  const [name, setName] = useState('')
  const [product, setProduct] = useState(
    initialProduct && products.includes(initialProduct) ? initialProduct : (products[0] ?? '')
  )
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  if (status === 'sent') {
    return (
      <div className="flex items-center gap-3 bg-[#2E4A3C]/10 text-[#2E4A3C] rounded-md p-4 text-sm">
        <CheckCircle2 size={20} className="shrink-0" />
        <span>Bedankt voor je review!</span>
      </div>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const formData = new FormData()
      formData.set('name', name)
      formData.set('product', product)
      formData.set('rating', String(rating))
      formData.set('text', text)
      if (photo) formData.set('photo', photo)

      const res = await fetch('/api/review', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error || 'Er ging iets mis. Probeer het opnieuw.')
        setStatus('error')
        return
      }
      setStatus('sent')
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw.')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[#2E4A3C] mb-1.5">Naam</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white border border-[#DCD5C7] rounded-md px-4 py-3 text-sm text-[#2E4A3C] focus:outline-none focus:border-[#2E4A3C] transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2E4A3C] mb-1.5">Product</label>
        <select
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="w-full bg-white border border-[#DCD5C7] rounded-md px-4 py-3 text-sm text-[#2E4A3C] focus:outline-none focus:border-[#2E4A3C] transition-colors"
        >
          {products.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2E4A3C] mb-1.5">Beoordeling</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} sterren`}>
              <Star size={26} className={n <= rating ? 'fill-[#C0764C] text-[#C0764C]' : 'text-[#DCD5C7]'} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2E4A3C] mb-1.5">Je review</label>
        <textarea
          required
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-white border border-[#DCD5C7] rounded-md px-4 py-3 text-sm text-[#2E4A3C] resize-none focus:outline-none focus:border-[#2E4A3C] transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2E4A3C] mb-1.5">Foto (optioneel)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-[#4A5A50] file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:bg-[#2E4A3C] file:text-white file:text-sm file:font-medium file:cursor-pointer"
        />
      </div>

      {status === 'error' && <p className="text-sm text-[#C0764C]">{error}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-[#C0764C] text-white font-semibold py-3.5 rounded-md hover:opacity-90 transition-opacity text-sm disabled:opacity-60"
      >
        {status === 'sending' ? 'Bezig…' : 'Review versturen'}
      </button>
    </form>
  )
}
