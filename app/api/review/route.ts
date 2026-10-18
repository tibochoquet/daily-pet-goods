import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { Resend } from 'resend'
import { business, SITE_URL } from '@/lib/business'
import { products } from '@/lib/products'
import { isDbConfigured } from '@/lib/db'
import { findOrderByReviewToken } from '@/lib/db/orders'
import { createReview, DubbeleReviewError, findPaidOrderByRefAndEmail } from '@/lib/db/reviews'
import { clientIp, createRateLimiter } from '@/lib/rateLimit'
import { isAllowedPhotoType, MAX_NAME_LENGTH, MAX_TEXT_LENGTH, PHOTO_MAX_BYTES, PHOTO_TYPES } from '@/lib/reviews'

/**
 * Inzenden van een review.
 *
 * Alleen POST - een GET mag nooit iets opslaan, want mailprogramma's en
 * virusscanners openen links automatisch.
 *
 * Een review wordt aan een betaalde bestelling gekoppeld, op twee
 * manieren: met het token uit de reviewmail, of doordat de klant
 * bestelnummer en e-mailadres invult die bij elkaar horen. Die tweede
 * weg bestaat voor de flyers in de verpakkingen.
 *
 * Zonder koppeling slaan we niets op. Strenger dan vroeger, maar anders
 * kan iedereen reviews achterlaten voor producten die hij nooit kocht.
 */

const NIET_GEVONDEN = 'We kunnen deze bestelling niet vinden. Controleer je bestelnummer en e-mailadres.'

// Tien pogingen per kwartier: ruim voor wie zich vertypt, krap voor wie
// bestelnummers zit te raden.
const teVeelPogingen = createRateLimiter(10, 15 * 60 * 1000)

const PRODUCT_BY_NAME = new Map(products.map((p) => [p.name, p]))

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    console.error('Review: DATABASE_URL ontbreekt.')
    return NextResponse.json({ ok: false, error: 'Even niet beschikbaar. Probeer het later opnieuw.' }, { status: 503 })
  }
  if (teVeelPogingen(clientIp(req))) {
    return NextResponse.json(
      { ok: false, error: 'Te veel pogingen. Probeer het over een kwartier opnieuw.' },
      { status: 429 }
    )
  }

  try {
    const formData = await req.formData()
    const name = formData.get('name')?.toString().trim()
    const productNaam = formData.get('product')?.toString().trim()
    const rating = Number(formData.get('rating'))
    const text = formData.get('text')?.toString().trim()
    const photo = formData.get('photo')
    const photoConsent = ['on', 'true'].includes(formData.get('photoConsent')?.toString() ?? '')
    const token = formData.get('token')?.toString().trim()
    const orderRef = formData.get('orderRef')?.toString().trim()
    const email = formData.get('email')?.toString().trim()

    if (!name || name.length > MAX_NAME_LENGTH) {
      return NextResponse.json({ ok: false, error: 'Vul je naam in' }, { status: 400 })
    }
    const product = productNaam ? PRODUCT_BY_NAME.get(productNaam) : undefined
    if (!product) {
      return NextResponse.json({ ok: false, error: 'Kies een product uit de lijst' }, { status: 400 })
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ ok: false, error: 'Kies een beoordeling' }, { status: 400 })
    }
    if (!text || text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ ok: false, error: 'Vul je review in' }, { status: 400 })
    }

    // ---- koppelen aan een bestelling
    let order = token ? await findOrderByReviewToken(token) : null
    if (!order && orderRef && email) {
      order = await findPaidOrderByRefAndEmail(orderRef, email)
    }
    if (!order) {
      return NextResponse.json({ ok: false, error: NIET_GEVONDEN }, { status: 404 })
    }

    // ---- foto, optioneel; zonder foto telt de review gewoon mee
    let photoUrl: string | null = null
    if (photo instanceof File && photo.size > 0) {
      if (!isAllowedPhotoType(photo.type)) {
        return NextResponse.json(
          { ok: false, error: `Alleen ${PHOTO_TYPES.map((t) => t.split('/')[1]).join(', ')} zijn toegestaan` },
          { status: 400 }
        )
      }
      if (photo.size > PHOTO_MAX_BYTES) {
        return NextResponse.json(
          { ok: false, error: `De foto is te groot (max ${PHOTO_MAX_BYTES / 1024 / 1024} MB)` },
          { status: 400 }
        )
      }
      if (!photoConsent) {
        return NextResponse.json(
          { ok: false, error: 'Vink aan dat we je foto mogen tonen, of verstuur je review zonder foto.' },
          { status: 400 }
        )
      }
      const extensie = photo.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
      const blob = await put(`reviews/${order.orderRef}-${product.slug}-${Date.now()}.${extensie}`, photo, {
        access: 'public',
        contentType: photo.type,
      })
      photoUrl = blob.url
    }

    // ---- opslaan, altijd als pending
    let review
    try {
      review = await createReview({
        orderId: order.id,
        orderRef: order.orderRef,
        productSlug: product.slug,
        productName: product.name,
        rating,
        text,
        name,
        photoUrl,
        photoConsent: Boolean(photoUrl) && photoConsent,
        verified: true,
      })
    } catch (err) {
      if (err instanceof DubbeleReviewError) {
        return NextResponse.json(
          { ok: false, error: 'Je hebt dit product voor deze bestelling al beoordeeld. Bedankt daarvoor!' },
          { status: 409 }
        )
      }
      throw err
    }

    // ---- melding aan de winkel; een mislukte melding mag de review niet weggooien
    try {
      await meldNieuweReview({
        productNaam: product.name,
        rating,
        text,
        name,
        photoUrl,
        orderRef: order.orderRef,
        verified: true,
      })
    } catch (err) {
      console.error(`Review ${review.id} opgeslagen, maar de melding ging niet weg:`, err)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Review: inzending mislukt:', err)
    return NextResponse.json({ ok: false, error: 'Er ging iets mis. Probeer het later opnieuw.' }, { status: 500 })
  }
}

async function meldNieuweReview(r: {
  productNaam: string
  rating: number
  text: string
  name: string
  photoUrl: string | null
  orderRef: string | null
  verified: boolean
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: `${business.brandName} <orders@dailypetgoods.nl>`,
    to: business.email,
    subject: `Nieuwe review: ${r.productNaam} (${r.rating}/5)${r.photoUrl ? ' [+foto]' : ''}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A1A1A;">
        <h2 style="color:#2C4A3E;margin-bottom:4px;">Nieuwe review, wacht op beoordeling</h2>
        <p style="font-size:14px;color:#4B5563;margin-top:0;">
          <strong>Product:</strong> ${r.productNaam}<br/>
          <strong>Beoordeling:</strong> ${r.rating}/5<br/>
          <strong>Van:</strong> ${r.name}<br/>
          <strong>Bestelling:</strong> ${r.orderRef ?? 'onbekend'}<br/>
          <strong>Geverifieerde koper:</strong> ${r.verified ? 'ja' : 'nee'}
        </p>
        <p style="font-size:14px;color:#4B5563;white-space:pre-wrap;border-left:3px solid #E8E2D9;padding-left:12px;">${r.text}</p>
        ${
          r.photoUrl
            ? `<p style="font-size:14px;"><a href="${r.photoUrl}" style="color:#2C4A3E;">Bekijk de foto</a></p>`
            : '<p style="font-size:13px;color:#9CA3AF;">Geen foto meegestuurd.</p>'
        }
        <p style="font-size:14px;margin-top:20px;">
          <a href="${SITE_URL}/admin/reviews" style="background:#2C4A3E;color:#fff;padding:10px 20px;border-radius:999px;text-decoration:none;font-size:14px;">Beoordelen in het beheer</a>
        </p>
      </div>
    `,
  })
  if (error) throw new Error(`Resend gaf een fout terug: ${error.message}`)
}
