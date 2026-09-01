import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { business } from '@/lib/business'

interface NewsletterBody {
  email: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * There's no mailing-list tool wired up yet, so a signup is just a
 * notification email to the shop owner (same pattern as /api/contact) -
 * add the address to a real newsletter tool by hand until one is wired
 * up here directly.
 */
export async function POST(req: NextRequest) {
  try {
    const body: NewsletterBody = await req.json()
    const email = body.email?.trim()

    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ ok: false, error: 'Ongeldig e-mailadres' }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: `${business.brandName} <contact@dailypetgoods.nl>`,
      to: business.email,
      replyTo: email,
      subject: 'Nieuwe nieuwsbrief-aanmelding',
      html: `<p style="font-family:sans-serif;font-size:14px;color:#1A1A1A;">Nieuwe aanmelding voor de nieuwsbrief: <a href="mailto:${email}" style="color:#2C4A3E;">${email}</a></p>`,
    })
    if (error) {
      console.error('Nieuwsbrief-aanmelding versturen mislukt: Resend gaf een fout terug:', error.message)
      return NextResponse.json({ ok: false }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Nieuwsbrief-aanmelding verwerken mislukt:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
