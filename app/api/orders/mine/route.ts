import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { findOrdersByEmail } from '@/lib/orders'
import { verifyAccountSessionToken, ACCOUNT_SESSION_COOKIE } from '@/lib/session'

export async function GET() {
  const cookieStore = await cookies()
  const email = verifyAccountSessionToken(cookieStore.get(ACCOUNT_SESSION_COOKIE)?.value)

  if (!email) {
    return NextResponse.json({ ok: false, error: 'Niet ingelogd' }, { status: 401 })
  }

  try {
    const orders = await findOrdersByEmail(email)
    return NextResponse.json({ ok: true, orders })
  } catch (err) {
    console.error('Bestellingen ophalen mislukt:', err)
    return NextResponse.json({ ok: false, error: 'Kon bestellingen niet ophalen' }, { status: 500 })
  }
}
