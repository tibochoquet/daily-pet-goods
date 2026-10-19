'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'

interface Review {
  id: number
  orderRef: string | null
  productName: string
  rating: number
  text: string
  name: string
  photoUrl: string | null
  photoConsent: boolean
  verified: boolean
  status: string
  createdAt: string
}

export default function ReviewRegel({ review }: { review: Review }) {
  const router = useRouter()
  const [bezig, setBezig] = useState(false)
  const [fout, setFout] = useState('')

  async function zet(status: 'published' | 'rejected') {
    setBezig(true)
    setFout('')
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: review.id, status }),
      })
      if (!res.ok) {
        setFout('Dat lukte niet.')
        setBezig(false)
        return
      }
      router.refresh()
    } catch {
      setFout('Verbinding mislukt.')
      setBezig(false)
    }
  }

  return (
    <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1A1A1A]">{review.productName}</span>
          <span className="flex">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={14}
                className={n <= review.rating ? 'fill-[#C8745A] text-[#C8745A]' : 'text-[#DCD5C7]'}
              />
            ))}
          </span>
        </div>
        <span className="text-xs text-[#9CA3AF]">
          {new Date(review.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
        <span className="text-[#4B5563]">{review.name}</span>
        {review.verified && (
          <span className="bg-[#2C4A3E]/10 text-[#2C4A3E] px-2 py-0.5 rounded-full font-medium">
            Geverifieerde koper
          </span>
        )}
        {review.orderRef && <span className="text-[#9CA3AF]">{review.orderRef}</span>}
      </div>

      <p className="text-sm text-[#4B5563] leading-relaxed whitespace-pre-wrap mb-4">{review.text}</p>

      {review.photoUrl && (
        <div className="mb-4">
          {/* Geen next/image: de foto staat op Vercel Blob en is per
              inzending anders, dus optimaliseren levert hier niets op. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.photoUrl}
            alt={`Foto bij de review van ${review.name}`}
            className="max-h-64 rounded-xl border border-[#E8E2D9]"
          />
          {!review.photoConsent && (
            <p className="text-xs text-[#C8745A] mt-1.5">
              Let op: er is geen toestemming vastgelegd om deze foto te tonen.
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#E8E2D9]">
        {review.status !== 'published' && (
          <button
            disabled={bezig}
            onClick={() => zet('published')}
            className="bg-[#2C4A3E] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#3D6456] disabled:opacity-50"
          >
            Publiceren
          </button>
        )}
        {review.status !== 'rejected' && (
          <button
            disabled={bezig}
            onClick={() => zet('rejected')}
            className="text-sm text-[#6B7280] px-4 py-2 hover:text-[#C8745A] disabled:opacity-50"
          >
            Afwijzen
          </button>
        )}
        {fout && <span className="text-sm text-[#C8745A]">{fout}</span>}
      </div>
    </div>
  )
}
