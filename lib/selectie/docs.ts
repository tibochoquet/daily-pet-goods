import 'server-only'
import { and, eq, sql } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { selectieDocs } from '@/lib/db/schema'

/** De drie collecties die de tool kent. Alles daarbuiten weigeren we. */
export const COLLECTIES = ['decisions', 'custom', 'settings'] as const
export type Collectie = (typeof COLLECTIES)[number]

export function isCollectie(v: unknown): v is Collectie {
  return typeof v === 'string' && (COLLECTIES as readonly string[]).includes(v)
}

export type Doc = Record<string, unknown>

function isGewoonObject(v: unknown): v is Doc {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/**
 * Voegt een patch samen met wat er al staat.
 *
 * Deze functie beschrijft de afspraak en wordt gebruikt om hem te
 * testen; het echte samenvoegen gebeurt in SQL (zie `schrijf`), omdat
 * het daar atomair kan.
 *
 * Geneste objecten mergen, al het andere vervangt - dus ook arrays. Dat
 * is dezelfde afspraak als de app altijd al had, en hij is hier
 * belangrijker dan daar: twee mensen die tegelijk aan hetzelfde product
 * werken, raken elkaars velden zo niet kwijt. Wie het laatst schrijft
 * wint per veld, niet per document.
 *
 * `null` als waarde betekent "dit veld weg", anders zou een veld nooit
 * meer leeg te maken zijn zonder het hele document te herschrijven.
 */
export function merge(bestaand: Doc, patch: Doc): Doc {
  const uit: Doc = { ...bestaand }
  for (const [k, v] of Object.entries(patch)) {
    if (v === null) {
      delete uit[k]
    } else if (isGewoonObject(v) && isGewoonObject(uit[k])) {
      uit[k] = merge(uit[k] as Doc, v)
    } else {
      uit[k] = v
    }
  }
  return uit
}

/** Alle documenten, in de vorm die de app verwacht. */
export async function leesAlles(): Promise<{
  settings: Doc
  decisions: Record<string, Doc>
  custom: Record<string, Doc>
}> {
  const db = getDb()
  const rijen = await db.select().from(selectieDocs)
  const uit = { settings: {} as Doc, decisions: {} as Record<string, Doc>, custom: {} as Record<string, Doc> }
  for (const r of rijen) {
    const data = (r.data ?? {}) as Doc
    if (r.collection === 'settings') uit.settings = data
    else if (r.collection === 'decisions') uit.decisions[r.docId] = data
    else if (r.collection === 'custom') uit.custom[r.docId] = data
  }
  return uit
}

/**
 * Schrijft een patch weg en geeft het samengevoegde document terug.
 *
 * Eén INSERT ... ON CONFLICT DO UPDATE, en dus atomair per rij: twee
 * gelijktijdige schrijvers worden door Postgres achter elkaar gezet en
 * de tweede voegt samen met wat de eerste net schreef. Lezen-en-dan-
 * schrijven vanuit Node zou hier een gat laten, en de driver van dit
 * project (neon-http) kent geen transacties om dat mee te dichten.
 *
 * Het samenvoegen doet `jsonb_diepe_merge` (migratie 0004).
 * `jsonb_strip_nulls` voert de afspraak uit dat een veld op `null` zetten
 * betekent: dit veld weg. Zo kan een notitie verwijderd worden zonder het
 * hele document opnieuw te schrijven.
 */
export async function schrijf(collection: Collectie, docId: string, patch: Doc): Promise<Doc> {
  const db = getDb()
  const rijen = await db.execute(sql`
    INSERT INTO selectie_docs (collection, doc_id, data, updated_at)
    VALUES (${collection}, ${docId}, jsonb_strip_nulls(${JSON.stringify(patch)}::jsonb), now())
    ON CONFLICT (collection, doc_id) DO UPDATE
      SET data = jsonb_strip_nulls(jsonb_diepe_merge(selectie_docs.data, ${JSON.stringify(patch)}::jsonb)),
          updated_at = now()
    RETURNING data
  `)
  const rij = (rijen as unknown as { rows?: Array<{ data: Doc }> }).rows ?? (rijen as unknown as Array<{ data: Doc }>)
  return (Array.isArray(rij) ? rij[0]?.data : undefined) ?? {}
}

/** Verwijdert een document. Bestond het niet, dan is dat geen fout. */
export async function verwijder(collection: Collectie, docId: string): Promise<void> {
  const db = getDb()
  await db
    .delete(selectieDocs)
    .where(and(eq(selectieDocs.collection, collection), eq(selectieDocs.docId, docId)))
}

/**
 * Een goedkope vingerafdruk van de hele inhoud.
 *
 * De app haalt elke tien seconden op; met deze waarde kan hij zien of er
 * iets veranderd is zonder alles opnieuw te tekenen. Dat is wat voorkomt
 * dat een veld waarin je staat te typen onder je handen wordt vervangen.
 */
export async function stempel(): Promise<string> {
  const db = getDb()
  const [rij] = await db
    .select({
      aantal: sql<number>`count(*)::int`,
      laatste: sql<string | null>`max(${selectieDocs.updatedAt})::text`,
    })
    .from(selectieDocs)
  return `${rij?.aantal ?? 0}:${rij?.laatste ?? ''}`
}
