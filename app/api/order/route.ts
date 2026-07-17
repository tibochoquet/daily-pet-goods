import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

interface OrderItem {
  id: string
  name: string
  variantLabel: string
  price: number
  quantity: number
}

interface OrderBody {
  customer: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    street: string
    houseNumber: string
    postalCode: string
    city: string
    notes?: string
  }
  items: OrderItem[]
  subtotal: number
  total: number
}

export async function POST(req: NextRequest) {
  try {
    const body: OrderBody = await req.json()
    const { customer, items, subtotal, total } = body

    if (!customer?.email || !items?.length) {
      return NextResponse.json({ ok: false, error: 'Ontbrekende velden' }, { status: 400 })
    }

    const orderRef = `DPG-${Date.now().toString(36).toUpperCase()}`

    const itemRows = items
      .map(
        (i) =>
          `<tr>
            <td style="padding:8px 0;border-bottom:1px solid #E8E2D9;font-size:13px;color:#4B5563;">${i.name}<br/><span style="color:#9CA3AF;">${i.variantLabel}</span></td>
            <td style="padding:8px 0;border-bottom:1px solid #E8E2D9;font-size:13px;color:#4B5563;text-align:center;">×${i.quantity}</td>
            <td style="padding:8px 0;border-bottom:1px solid #E8E2D9;font-size:13px;color:#1A1A1A;text-align:right;">€${(i.price * i.quantity).toFixed(2)}</td>
          </tr>`
      )
      .join('')

    const html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A1A1A;">
        <h2 style="color:#2C4A3E;margin-bottom:4px;">Nieuwe bestelling, ${orderRef}</h2>
        <p style="color:#6B7280;margin-top:0;font-size:14px;">Daily Pet Goods</p>

        <h3 style="font-size:14px;color:#1A1A1A;margin-bottom:8px;">Klant</h3>
        <p style="font-size:14px;color:#4B5563;margin:0;">
          ${customer.firstName} ${customer.lastName}<br/>
          <a href="mailto:${customer.email}" style="color:#2C4A3E;">${customer.email}</a>
          ${customer.phone ? `<br/>${customer.phone}` : ''}
        </p>

        <h3 style="font-size:14px;color:#1A1A1A;margin-top:20px;margin-bottom:8px;">Verzendadres</h3>
        <p style="font-size:14px;color:#4B5563;margin:0;">
          ${customer.street} ${customer.houseNumber}<br/>
          ${customer.postalCode} ${customer.city}
        </p>
        ${customer.notes ? `<p style="font-size:13px;color:#6B7280;margin-top:8px;font-style:italic;">"${customer.notes}"</p>` : ''}

        <h3 style="font-size:14px;color:#1A1A1A;margin-top:20px;margin-bottom:8px;">Producten</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tbody>${itemRows}</tbody>
        </table>

        <table style="width:100%;margin-top:12px;">
          <tr>
            <td style="font-size:13px;color:#6B7280;">Subtotaal</td>
            <td style="font-size:13px;color:#6B7280;text-align:right;">€${subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#6B7280;">Verzending</td>
            <td style="font-size:13px;color:#6B7280;text-align:right;">Gratis</td>
          </tr>
          <tr>
            <td style="font-size:15px;font-weight:600;padding-top:8px;">Totaal</td>
            <td style="font-size:15px;font-weight:600;text-align:right;padding-top:8px;">€${total.toFixed(2)}</td>
          </tr>
        </table>

        <p style="font-size:13px;color:#C8745A;margin-top:20px;">
          Nog geen betaling ontvangen. Stuur de klant een Tikkie of betaalverzoek voor €${total.toFixed(2)}.
        </p>
      </div>
    `

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Daily Pet Goods <orders@dailypetgoods.nl>',
      to: 'lifegoods.daily@gmail.com',
      replyTo: customer.email,
      subject: `Nieuwe bestelling ${orderRef}, €${total.toFixed(2)}`,
      html,
    })

    return NextResponse.json({ ok: true, ref: orderRef })
  } catch (err) {
    console.error('Order e-mail versturen mislukt:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
