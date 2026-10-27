import { NextResponse } from 'next/server'
import { BESCHERMDE_HEADERS, cookieOpties } from '@/lib/selectie/sessie'

/** Uitloggen: de cookie meteen laten vervallen. */
export async function POST() {
  const res = NextResponse.json({ ok: true }, { headers: BESCHERMDE_HEADERS })
  res.cookies.set({ ...cookieOpties(), value: '', maxAge: 0 })
  return res
}
