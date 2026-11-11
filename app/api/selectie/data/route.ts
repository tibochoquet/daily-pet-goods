import { NextRequest, NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db'
import { BESCHERMDE_HEADERS } from '@/lib/selectie/sessie'
import { isCollectie, leesAlles, schrijf, stempel, verwijder } from '@/lib/selectie/docs'

/**
 * De gedeelde opslag van de productselectietool.
 *
 * GET  -> alles, plus een stempel waarmee de app ziet of er iets veranderd is
 * POST -> { actie: 'write', path, patch } of { actie: 'remove', path }
 *
 * Afgeschermd door proxy.ts; hier wordt alleen nog gecontroleerd of de
 * invoer deugt. Een onbekende collectie wordt geweigerd in plaats van
 * stilletjes aangemaakt.
 */
export const dynamic = 'force-dynamic'

const antwoord = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: BESCHERMDE_HEADERS })

function splitsPad(pad: unknown): { collection: string; docId: string } | null {
  if (typeof pad !== 'string') return null
  const delen = pad.split('/')
  if (delen.length !== 2) return null
  const [collection, docId] = delen
  if (!collection || !docId || docId.length > 200) return null
  return { collection, docId }
}

export async function GET() {
  if (!isDbConfigured()) {
    return antwoord({ ok: false, error: 'De gedeelde opslag is niet ingesteld (DATABASE_URL ontbreekt).' }, 503)
  }
  try {
    const [data, s] = await Promise.all([leesAlles(), stempel()])
    return antwoord({ ok: true, stempel: s, ...data })
  } catch (err) {
    console.error('Productselectie: ophalen mislukt:', err)
    return antwoord({ ok: false, error: 'De gedeelde opslag is nu niet bereikbaar.' }, 502)
  }
}

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return antwoord({ ok: false, error: 'De gedeelde opslag is niet ingesteld (DATABASE_URL ontbreekt).' }, 503)
  }

  let body: { actie?: unknown; path?: unknown; patch?: unknown }
  try {
    body = await req.json()
  } catch {
    return antwoord({ ok: false, error: 'Ongeldig verzoek' }, 400)
  }

  const doel = splitsPad(body.path)
  if (!doel || !isCollectie(doel.collection)) {
    return antwoord({ ok: false, error: 'Onbekend pad' }, 400)
  }

  try {
    if (body.actie === 'remove') {
      await verwijder(doel.collection, doel.docId)
      return antwoord({ ok: true, stempel: await stempel() })
    }

    if (body.actie === 'write') {
      const patch = body.patch
      if (typeof patch !== 'object' || patch === null || Array.isArray(patch)) {
        return antwoord({ ok: false, error: 'Patch moet een object zijn' }, 400)
      }
      const doc = await schrijf(doel.collection, doel.docId, patch as Record<string, unknown>)
      return antwoord({ ok: true, doc, stempel: await stempel() })
    }

    return antwoord({ ok: false, error: 'Onbekende actie' }, 400)
  } catch (err) {
    console.error('Productselectie: schrijven mislukt:', err)
    return antwoord({ ok: false, error: 'Opslaan lukte niet. Probeer het zo opnieuw.' }, 502)
  }
}
