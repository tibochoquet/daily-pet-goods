import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { BESCHERMDE_HEADERS } from '@/lib/selectie/sessie'

/**
 * Productfoto bij "Product toevoegen".
 *
 * Dezelfde grenzen als de app aan de clientkant hanteert, nog een keer
 * hier: wat de browser controleert is een hulp voor de gebruiker, geen
 * beveiliging. De bestandsnaam uit de upload gaat niet mee in het pad -
 * `addRandomSuffix` bepaalt de naam, zodat een rare naam niets kan
 * uithalen.
 */
export const dynamic = 'force-dynamic'

const MAX_BYTES = 5 * 1024 * 1024
const TOEGESTAAN = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(req: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('Productselectie: BLOB_READ_WRITE_TOKEN ontbreekt.')
    return NextResponse.json(
      { ok: false, error: 'Foto-opslag is niet ingesteld.' },
      { status: 503, headers: BESCHERMDE_HEADERS }
    )
  }

  let bestand: File | null = null
  try {
    const form = await req.formData()
    const f = form.get('file')
    bestand = f instanceof File ? f : null
  } catch {
    bestand = null
  }

  if (!bestand) {
    return NextResponse.json({ ok: false, error: 'Geen bestand ontvangen.' }, { status: 400, headers: BESCHERMDE_HEADERS })
  }
  if (!TOEGESTAAN.includes(bestand.type)) {
    return NextResponse.json(
      { ok: false, error: 'Alleen JPG, PNG, WEBP of GIF.' },
      { status: 415, headers: BESCHERMDE_HEADERS }
    )
  }
  if (bestand.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: 'De foto is groter dan 5 MB.' },
      { status: 413, headers: BESCHERMDE_HEADERS }
    )
  }

  try {
    const blob = await put(`selectie/${Date.now()}`, bestand, {
      access: 'public',
      addRandomSuffix: true,
      contentType: bestand.type,
    })
    return NextResponse.json({ ok: true, url: blob.url }, { headers: BESCHERMDE_HEADERS })
  } catch (err) {
    console.error('Productselectie: foto uploaden mislukt:', err)
    return NextResponse.json(
      { ok: false, error: 'Foto uploaden lukte niet.' },
      { status: 502, headers: BESCHERMDE_HEADERS }
    )
  }
}
