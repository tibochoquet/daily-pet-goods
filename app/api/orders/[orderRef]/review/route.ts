import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Resend } from 'resend'
import { business } from '@/lib/business'
import { resolveAuthorizedOrder, markProductReviewed } from '@/lib/orders'
import { verifyOrderAccessToken, verifyAccountSessionToken, orderAccessCookieName, ACCOUNT_SESSION_COOKIE } from '@/lib/session'

interface ReviewBody {
  productSlug: string
  rating: number
  title: string
  text: string
  displayName?: string
}

const MAX_TITLE_LENGTH = 100
const MAX_TEXT_LENGTH = 2000

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

    const body: ReviewBody = await req.json()
    const item = order.items.find((i) => i.productSlug === body.productSlug)
    const rating = Number(body.rating)
    const title = body.title?.trim()
    const text = body.text?.trim()

    if (!item) {
      // Eligibility is derived from this order's real, purchased line
      // items - no separate purchase-verification system needed.
      return NextResponse.json({ ok: false, error: 'Dit product zat niet in deze bestelling' }, { status: 400 })
    }
    if (order.reviewedProductSlugs.includes(body.productSlug)) {
      return NextResponse.json({ ok: false, error: 'Je hebt dit product al beoordeeld' }, { status: 409 })
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ ok: false, error: 'Ongeldige beoordeling' }, { status: 400 })
    }
    if (!title || title.length > MAX_TITLE_LENGTH || !text || text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ ok: false, error: 'Vul een titel en review in' }, { status: 400 })
    }
    const displayName = body.displayName?.trim().slice(0, 60)

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: `${business.brandName} <orders@dailypetgoods.nl>`,
      to: business.email,
      replyTo: order.email,
      subject: `Nieuwe review: ${item.name} (${rating}/5)`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A1A1A;">
          <h2 style="color:#2C4A3E;margin-bottom:4px;">Nieuwe review</h2>
          <p style="color:#6B7280;margin-top:0;font-size:14px;">Bestelling ${order.orderRef} - ${item.name}</p>
          <p style="font-size:14px;color:#4B5563;">
            <strong>Beoordeling:</strong> ${rating}/5<br/>
            <strong>Van:</strong> ${displayName || 'Anoniem'} (<a href="mailto:${order.email}" style="color:#2C4A3E;">${order.email}</a>)
          </p>
          <h3 style="font-size:14px;color:#1A1A1A;margin-top:16px;margin-bottom:4px;">${title}</h3>
          <p style="font-size:14px;color:#4B5563;white-space:pre-wrap;">${text}</p>
          <p style="font-size:12px;color:#9CA3AF;margin-top:20px;">
            Deze review is nog nergens gepubliceerd - plaats 'm zelf waar je wilt.
          </p>
        </div>
      `,
    })
    if (error) {
      console.error('Review-notificatie versturen mislukt: Resend gaf een fout terug:', error.message)
      return NextResponse.json({ ok: false }, { status: 502 })
    }

    await markProductReviewed(order.sessionId, order.reviewedProductSlugs, body.productSlug)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Review versturen mislukt:', err)
    return NextResponse.json({ ok: false, error: 'Kon review niet versturen' }, { status: 500 })
  }
}
