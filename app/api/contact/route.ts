import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

interface ContactBody {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactBody = await req.json()
    const { firstName, lastName, email, subject, message } = body

    if (!firstName || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Ontbrekende velden' }, { status: 400 })
    }

    const html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A1A1A;">
        <h2 style="color:#2C4A3E;margin-bottom:4px;">Nieuw contactformulier bericht</h2>
        <p style="color:#6B7280;margin-top:0;font-size:14px;">Daily Pet Goods</p>

        <p style="font-size:14px;color:#4B5563;">
          <strong>Van:</strong> ${firstName} ${lastName}<br/>
          <strong>E-mail:</strong> <a href="mailto:${email}" style="color:#2C4A3E;">${email}</a><br/>
          ${subject ? `<strong>Onderwerp:</strong> ${subject}<br/>` : ''}
        </p>

        <h3 style="font-size:14px;color:#1A1A1A;margin-top:20px;margin-bottom:8px;">Bericht</h3>
        <p style="font-size:14px;color:#4B5563;white-space:pre-wrap;">${message}</p>
      </div>
    `

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Daily Pet Goods <contact@dailypetgoods.nl>',
      to: 'lifegoods.daily@gmail.com',
      replyTo: email,
      subject: `Contactformulier: ${subject || 'Nieuw bericht'}`,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact e-mail versturen mislukt:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
