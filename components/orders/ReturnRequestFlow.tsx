'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import type { Order } from '@/lib/orders'
import { business, formatAddress } from '@/lib/business'

const REASONS = [
  'Product voldoet niet aan verwachting',
  'Verkeerd product ontvangen',
  'Product beschadigd',
  'Anders van gedacht',
  'Anders',
]

const STEPS = ['Retour aangemeld', 'Retour onderweg', 'Retour ontvangen', 'Terugbetaald'] as const

function statusStepIndex(order: Order): number {
  if (order.refunded) return 3
  if (order.returnStatus === 'ontvangen') return 2
  if (order.returnStatus === 'onderweg') return 1
  if (order.returnStatus === 'aangemeld') return 0
  return -1
}

function ReturnAddress() {
  return (
    <div className="bg-[#F3EDE3] rounded-xl p-4">
      <p className="text-sm font-semibold text-[#1A1A1A] mb-2">Retouradres</p>
      <p className="text-sm text-[#4B5563]">
        {business.tradingName}
        <br />
        {formatAddress()}
        <br />
        Nederland
      </p>
      <p className="text-xs text-[#6B7280] mt-3">
        Verzend je retour via DHL. Neem bij vragen over het verzenden eerst contact met ons op.
      </p>
    </div>
  )
}

function StatusStepper({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {STEPS.map((label, i) => (
        <div key={label} className="flex-1">
          <div className={`h-1.5 rounded-full ${i <= activeIndex ? 'bg-[#2C4A3E]' : 'bg-[#E8E2D9]'}`} />
          <p className={`text-xs mt-1.5 ${i <= activeIndex ? 'text-[#2C4A3E] font-medium' : 'text-[#9CA3AF]'}`}>{label}</p>
        </div>
      ))}
    </div>
  )
}

export default function ReturnRequestFlow({ order }: { order: Order }) {
  const [step, setStep] = useState(1)
  const [productSlug, setProductSlug] = useState(order.items[0]?.productSlug ?? '')
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState(REASONS[0])
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const existingStepIndex = statusStepIndex(order)
  if (existingStepIndex >= 0) {
    return (
      <div>
        <StatusStepper activeIndex={existingStepIndex} />
        <ReturnAddress />
      </div>
    )
  }

  if (status === 'sent') {
    return (
      <div>
        <div className="flex items-center gap-3 bg-[#2C4A3E]/10 text-[#2C4A3E] rounded-xl p-4 text-sm mb-4">
          <CheckCircle2 size={20} className="shrink-0" />
          <span>Je retour is aangemeld. We nemen &apos;m zo snel mogelijk in behandeling.</span>
        </div>
        <ReturnAddress />
      </div>
    )
  }

  const selectedItem = order.items.find((i) => i.productSlug === productSlug)

  async function handleConfirm() {
    setStatus('sending')
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(order.orderRef)}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug, quantity, reason, note }),
      })
      if (!res.ok) throw new Error('mislukt')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-[#1A1A1A]">Welk product wil je retourneren?</p>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <label
                key={i}
                className="flex items-center gap-3 border border-[#E8E2D9] rounded-xl px-4 py-3 cursor-pointer has-[:checked]:border-[#2C4A3E]"
              >
                <input
                  type="radio"
                  name="product"
                  checked={productSlug === item.productSlug}
                  onChange={() => setProductSlug(item.productSlug ?? '')}
                />
                <span className="text-sm text-[#1A1A1A]">{item.name}</span>
              </label>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!productSlug}
            className="w-full bg-[#2C4A3E] text-white font-semibold py-3 rounded-xl hover:bg-[#3D6456] transition-colors text-sm disabled:opacity-60"
          >
            Volgende
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Hoeveel?</label>
            <input
              type="number"
              min={1}
              max={selectedItem?.quantity ?? 1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Wat is de reden van retour?</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E]"
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 border border-[#E8E2D9] text-[#1A1A1A] font-medium py-3 rounded-xl text-sm hover:bg-[#FAFAF7] transition-colors"
            >
              Terug
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 bg-[#2C4A3E] text-white font-semibold py-3 rounded-xl hover:bg-[#3D6456] transition-colors text-sm"
            >
              Volgende
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Eventuele toelichting (optioneel)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] resize-none focus:outline-none focus:border-[#2C4A3E]"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 border border-[#E8E2D9] text-[#1A1A1A] font-medium py-3 rounded-xl text-sm hover:bg-[#FAFAF7] transition-colors"
            >
              Terug
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 bg-[#2C4A3E] text-white font-semibold py-3 rounded-xl hover:bg-[#3D6456] transition-colors text-sm"
            >
              Volgende
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="bg-[#FAFAF7] rounded-xl p-4 text-sm text-[#4B5563] space-y-1">
            <p>
              <strong className="text-[#1A1A1A]">Product:</strong> {selectedItem?.name}
            </p>
            <p>
              <strong className="text-[#1A1A1A]">Aantal:</strong> {quantity}
            </p>
            <p>
              <strong className="text-[#1A1A1A]">Reden:</strong> {reason}
            </p>
            {note && (
              <p>
                <strong className="text-[#1A1A1A]">Toelichting:</strong> {note}
              </p>
            )}
          </div>
          {status === 'error' && <p className="text-sm text-[#C8745A]">Er ging iets mis. Probeer het opnieuw.</p>}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="flex-1 border border-[#E8E2D9] text-[#1A1A1A] font-medium py-3 rounded-xl text-sm hover:bg-[#FAFAF7] transition-colors"
            >
              Terug
            </button>
            <button
              onClick={handleConfirm}
              disabled={status === 'sending'}
              className="flex-1 bg-[#2C4A3E] text-white font-semibold py-3 rounded-xl hover:bg-[#3D6456] transition-colors text-sm disabled:opacity-60"
            >
              {status === 'sending' ? 'Bezig…' : 'Retour bevestigen'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
