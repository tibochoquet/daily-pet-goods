import { NextRequest, NextResponse } from 'next/server'
import { calculateDiscount, type CartLine } from '@/lib/discounts'

/**
 * Validates a discount code against the real cart and returns the amount
 * FOR DISPLAY ONLY. Nothing here authorises anything: the checkout route
 * recomputes the discount from scratch before creating the Stripe
 * session, so a tampered response from this endpoint cannot change what
 * someone is actually charged.
 *
 * The cart page also calls this again whenever the cart changes, which is
 * what makes an applied code lapse once the last eligible product is
 * removed.
 */

const MAX_ITEMS = 50

export async function POST(req: NextRequest) {
  let body: { code?: unknown; items?: unknown; activeCode?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Ongeldige JSON' }, { status: 400 })
  }

  const code = typeof body.code === 'string' ? body.code : ''
  if (!code.trim()) {
    return NextResponse.json({ ok: false, error: 'Vul een kortingscode in.' }, { status: 400 })
  }

  // Not combinable. Checked here so applying a second code gives the
  // specific message rather than silently replacing the first one.
  // `activeCode` is only sent when the customer is adding a new code on
  // top of one they already applied - re-validating the same code as the
  // cart changes deliberately does not send it.
  if (typeof body.activeCode === 'string' && body.activeCode.trim()) {
    return NextResponse.json(
      { ok: false, error: 'Je hebt al een kortingscode toegepast.' },
      { status: 409 }
    )
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ ok: false, error: 'Je winkelwagen is leeg.' }, { status: 400 })
  }
  if (body.items.length > MAX_ITEMS) {
    return NextResponse.json({ ok: false, error: 'Te veel producten in de winkelwagen.' }, { status: 400 })
  }

  const items: CartLine[] = []
  for (const raw of body.items) {
    if (typeof raw?.id !== 'string' || typeof raw?.quantity !== 'number') {
      return NextResponse.json({ ok: false, error: 'Ongeldig item in winkelwagen' }, { status: 400 })
    }
    items.push({ id: raw.id, quantity: raw.quantity })
  }

  const result = calculateDiscount(code, items)
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 422 })
  }

  return NextResponse.json({ ok: true, discount: result.discount })
}
