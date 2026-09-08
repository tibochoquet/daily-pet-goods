import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { business, SITE_URL } from '@/lib/business'
import { isValidEmail } from '@/lib/validation'
import { createMagicLinkToken } from '@/lib/session'

interface RequestLinkBody {
  email: string
}

const attempts = new Map<string, number>()
const MAX_TRACKED_IPS = 500
const MAX_ATTEMPTS_PER_WINDOW = 5
const WINDOW_MS = 15 * 60 * 1000

/**
 * Best-effort, in-memory only (resets on cold start, not shared across
 * instances) - same accepted limitation as the idempotency map in
 * app/api/webhooks/stripe/route.ts. Good enough to blunt casual abuse of
 * an email-sending endpoint, not a real rate limiter.
 */
function tooManyAttempts(ip: string): boolean {
  const count = attempts.get(ip) ?? 0
  if (count >= MAX_ATTEMPTS_PER_WINDOW) return true
  attempts.set(ip, count + 1)
  if (attempts.size > MAX_TRACKED_IPS) {
    const oldest = attempts.keys().next().value
    if (oldest) attempts.delete(oldest)
  }
  setTimeout(() => attempts.delete(ip), WINDOW_MS).unref?.()
  return false
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (tooManyAttempts(ip)) {
      return NextResponse.json({ ok: false, error: 'Te veel pogingen. Probeer het later opnieuw.' }, { status: 429 })
    }

    const body: RequestLinkBody = await req.json()
    const email = body.email?.trim()

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Ongeldig e-mailadres' }, { status: 400 })
    }

    const token = createMagicLinkToken(email)
    const link = `${SITE_URL}/mijn-bestelling/verifieer?token=${encodeURIComponent(token)}`

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: `${business.brandName} <orders@dailypetgoods.nl>`,
      to: email,
      subject: `Inloglink voor je bestellingen bij ${business.brandName}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A1A1A;">
          <h2 style="color:#2C4A3E;margin-bottom:4px;">Bekijk je bestellingen</h2>
          <p style="font-size:14px;color:#4B5563;">
            Klik op onderstaande knop om je bestellingen bij ${business.brandName} te bekijken.
            Deze link is 15 minuten geldig en eenmalig te gebruiken.
          </p>
          <p style="margin:24px 0;">
            <a href="${link}" style="background:#2C4A3E;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600;">
              Bekijk mijn bestellingen
            </a>
          </p>
          <p style="font-size:13px;color:#9CA3AF;">
            Niet zelf aangevraagd? Dan kun je deze e-mail negeren.
          </p>
        </div>
      `,
    })
    if (error) {
      console.error('Inloglink versturen mislukt: Resend gaf een fout terug:', error.message)
      return NextResponse.json({ ok: false }, { status: 502 })
    }

    // Always the same response regardless of whether this email has ever
    // ordered - an endpoint that answers differently would let anyone
    // check which addresses have placed orders here.
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Inloglink aanvragen mislukt:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
