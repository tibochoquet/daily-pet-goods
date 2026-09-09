import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { business } from '@/lib/business'
import { products } from '@/lib/products'

const MAX_NAME_LENGTH = 80
const MAX_TEXT_LENGTH = 2000
const MAX_PHOTO_BYTES = 8 * 1024 * 1024

const PRODUCT_NAMES = new Set(products.map((p) => p.name))

/**
 * Public review + photo submission (no order verification - anyone can
 * submit, unlike the order-linked review flow under /mijn-bestelling).
 * No database: every submission is just an email to the owner, photo
 * attached directly, same pattern as /api/contact.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const name = formData.get('name')?.toString().trim()
    const product = formData.get('product')?.toString().trim()
    const rating = Number(formData.get('rating'))
    const text = formData.get('text')?.toString().trim()
    const photo = formData.get('photo')

    if (!name || name.length > MAX_NAME_LENGTH) {
      return NextResponse.json({ ok: false, error: 'Vul je naam in' }, { status: 400 })
    }
    if (!product || !PRODUCT_NAMES.has(product)) {
      return NextResponse.json({ ok: false, error: 'Kies een product uit de lijst' }, { status: 400 })
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ ok: false, error: 'Kies een beoordeling' }, { status: 400 })
    }
    if (!text || text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ ok: false, error: 'Vul je review in' }, { status: 400 })
    }

    const attachments: { filename: string; content: Buffer; contentType?: string }[] = []
    if (photo instanceof File && photo.size > 0) {
      if (!photo.type.startsWith('image/')) {
        return NextResponse.json({ ok: false, error: 'Alleen afbeeldingen zijn toegestaan als foto' }, { status: 400 })
      }
      if (photo.size > MAX_PHOTO_BYTES) {
        return NextResponse.json({ ok: false, error: 'De foto is te groot (max 8MB)' }, { status: 400 })
      }
      const buffer = Buffer.from(await photo.arrayBuffer())
      attachments.push({ filename: photo.name || 'foto.jpg', content: buffer, contentType: photo.type })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: `${business.brandName} <contact@dailypetgoods.nl>`,
      to: business.email,
      subject: `Nieuwe review: ${product} (${rating}/5)${attachments.length ? ' [+foto]' : ''}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A1A1A;">
          <h2 style="color:#2E4A3C;margin-bottom:4px;">Nieuwe review</h2>
          <p style="font-size:14px;color:#4B5563;">
            <strong>Van:</strong> ${name}<br/>
            <strong>Product:</strong> ${product}<br/>
            <strong>Beoordeling:</strong> ${rating}/5
          </p>
          <p style="font-size:14px;color:#4B5563;white-space:pre-wrap;">${text}</p>
          ${attachments.length ? '<p style="font-size:12px;color:#9CA3AF;">Foto als bijlage meegestuurd - maakt automatisch kans op de maandelijkse favoriet.</p>' : ''}
        </div>
      `,
      attachments: attachments.length ? attachments : undefined,
    })
    if (error) {
      console.error('Review versturen mislukt: Resend gaf een fout terug:', error.message)
      return NextResponse.json({ ok: false }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Review verwerken mislukt:', err)
    return NextResponse.json({ ok: false, error: 'Er ging iets mis. Probeer het opnieuw.' }, { status: 500 })
  }
}
