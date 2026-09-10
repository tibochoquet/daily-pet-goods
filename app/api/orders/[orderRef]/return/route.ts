import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Resend } from 'resend'
import { business } from '@/lib/business'
import { resolveAuthorizedOrder, updateReturnRequest } from '@/lib/orders'
import { verifyOrderAccessToken, verifyAccountSessionToken, orderAccessCookieName, ACCOUNT_SESSION_COOKIE } from '@/lib/session'

interface ReturnBody {
  productSlug: string
  quantity: number
  reason: string
  note?: string
}

const MAX_REASON_LENGTH = 200
const MAX_NOTE_LENGTH = 1000

export async function POST(req: NextRequest, { params }: { params: Promise<{ orderRef: string }> }) {
  const { orderRef } = await params

  try {
    const cookieStore = await cookies()
    const orderAccessEmail = verifyOrderAccessToken(cookieStore.get(orderAccessCookieName(orderRef))?.value, orderRef)
    const accountEmail = verifyAccountSessionToken(cookieStore.get(ACCOUNT_SESSION_COOKIE)?.value)
    const order = await resolveAuthorizedOrder(orderRef, { orderAccessEmail, accountEmail })

    if (!order) {
      return NextResponse.json({ ok: false, error: 'Geen toegang tot deze bestelling' }, { status: 401 })
    }

    const body: ReturnBody = await req.json()
    const item = order.items.find((i) => i.productSlug === body.productSlug)
    const quantity = Number(body.quantity)
    const reason = body.reason?.trim()

    if (!item) {
      return NextResponse.json({ ok: false, error: 'Dit product zat niet in deze bestelling' }, { status: 400 })
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > item.quantity) {
      return NextResponse.json({ ok: false, error: 'Ongeldig aantal' }, { status: 400 })
    }
    if (!reason || reason.length > MAX_REASON_LENGTH) {
      return NextResponse.json({ ok: false, error: 'Vul een reden in' }, { status: 400 })
    }
    const note = body.note?.trim().slice(0, MAX_NOTE_LENGTH)

    await updateReturnRequest(order.sessionId, { productSlug: body.productSlug, quantity, reason, note })

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: `${business.brandName} <orders@dailypetgoods.nl>`,
      to: business.email,
      replyTo: order.email,
      subject: `Retour aangemeld voor bestelling ${order.orderRef}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A1A1A;">
          <h2 style="color:#2C4A3E;margin-bottom:4px;">Retour aangemeld</h2>
          <p style="color:#6B7280;margin-top:0;font-size:14px;">Bestelling ${order.orderRef}</p>
          <p style="font-size:14px;color:#4B5563;">
            <strong>Klant:</strong> <a href="mailto:${order.email}" style="color:#2C4A3E;">${order.email}</a><br/>
            <strong>Product:</strong> ${item.name}<br/>
            <strong>Aantal:</strong> ${quantity}<br/>
            <strong>Reden:</strong> ${reason}
            ${note ? `<br/><strong>Toelichting:</strong> ${note}` : ''}
          </p>
          ${
            order.discountAmount > 0
              ? `<p style="font-size:13px;color:#4B5563;background:#F3EDE3;padding:12px;border-radius:8px;">
                   <strong>Let op bij terugbetalen:</strong> op deze bestelling is
                   ${order.discountCode ? `kortingscode ${order.discountCode} ` : 'een korting '}
                   toegepast (&minus; €${order.discountAmount.toFixed(2)} over de hele bestelling).
                   De klant heeft in totaal €${order.total.toFixed(2)} betaald, niet
                   €${(order.total + order.discountAmount).toFixed(2)}. Betaal naar rato
                   van de werkelijk betaalde prijs terug, niet de oorspronkelijke prijs van het product.
                 </p>`
              : ''
          }
        </div>
      `,
    })
    if (error) {
      // The status was already written to the order - don't fail the
      // request over a notification email, same reasoning as the
      // webhook's best-effort email sends.
      console.error('Retour-notificatie versturen mislukt: Resend gaf een fout terug:', error.message)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Retour aanmelden mislukt:', err)
    return NextResponse.json({ ok: false, error: 'Kon retour niet aanmelden' }, { status: 500 })
  }
}
