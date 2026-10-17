import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * De pdf-bijlagen bij de bestelbevestiging: de algemene voorwaarden en
 * het modelformulier voor herroeping.
 *
 * Ze worden gemaakt van de echte pagina's op de site (zie
 * `npm run pdf:legal`), zodat de bijlage nooit iets anders kan zeggen
 * dan wat er op dailypetgoods.nl staat.
 *
 * `public/` zit niet vanzelf in de serverless bundel; next.config.ts
 * trekt deze twee bestanden er met `outputFileTracingIncludes` bij voor
 * de webhook-route.
 */

export interface MailBijlage {
  filename: string
  content: Buffer
}

const BESTANDEN = [
  { filename: 'algemene-voorwaarden.pdf', pad: 'algemene-voorwaarden.pdf' },
  { filename: 'modelformulier-herroeping.pdf', pad: 'modelformulier-herroeping.pdf' },
]

// Eenmaal inlezen per warme instance; het zijn statische bestanden.
let cache: MailBijlage[] | null = null

/**
 * Geeft de bijlagen terug, of een lege lijst als ze niet te lezen zijn.
 *
 * Bewust geen throw: een bestelbevestiging die aankomt zonder bijlage
 * is beter dan geen bevestiging. De aanroeper zet dan wel
 * `attachmentsIncluded: false`, want anders belooft de mailtekst iets
 * wat er niet bij zit.
 */
export async function loadLegalAttachments(): Promise<MailBijlage[]> {
  if (cache) return cache
  try {
    const dir = join(process.cwd(), 'public', 'legal')
    const geladen = await Promise.all(
      BESTANDEN.map(async ({ filename, pad }) => ({
        filename,
        content: await readFile(join(dir, pad)),
      }))
    )
    cache = geladen
    return geladen
  } catch (err) {
    console.error('Bijlagen voor de bestelbevestiging niet gevonden:', err)
    return []
  }
}
