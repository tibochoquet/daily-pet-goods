import type { Product } from './types'

/**
 * Pre-order: wel te bestellen, nog niet te verzenden.
 *
 * Een product met `shipsFrom` is gewoon te koop - de klant rekent nu af -
 * maar het gaat pas op die datum de deur uit. Alles wat daarvan afhangt
 * leest deze ene vraag: de knop op de productpagina, de melding in de
 * winkelwagen, de regel op de betaalpagina van Stripe en de
 * bestelbevestiging. Eén bron, zodat die vier nooit iets anders beloven
 * dan elkaar.
 *
 * Is de datum verstreken, dan geeft `isPreorder` false en gedraagt het
 * product zich vanaf dat moment als elk ander product. Er hoeft dus niets
 * te worden omgezet op de dag zelf; `shipsFrom` mag blijven staan.
 *
 * Dit zegt niets over voorraad. Een pre-order die alsnog niet geleverd
 * kan worden, zet je uit met `inStock: false` op de variant - dat is de
 * schakelaar die de knop en de checkout echt dichtzet.
 */

/**
 * De vorm die `shipsFrom` moet hebben: een datum met tijd én een
 * expliciete tijdzone, zoals `2026-12-04T00:00:00+01:00`.
 *
 * Die eis is geen vormkwestie. "2026-12-04" leest Node als UTC en de
 * browser als lokale tijd - een uur verschil, en in de verkeerde week
 * een hele dag. En `new Date()` slikt veel meer dan je denkt: van
 * "4 december" maakt hij 4 december 2001, een datum in het verleden,
 * waarmee een pre-order er stilletjes uitziet als gewoon op voorraad.
 * Daarom eerst de vorm en dan pas de klok.
 */
const ISO_MET_TIJDZONE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)$/

/**
 * De datum als `Date`, of null als het product geen pre-order is.
 *
 * Een datum die niet klopt is geen reden om stilletjes "gewoon
 * leverbaar" te antwoorden: dan belooft de site morgen te verzenden wat
 * er niet ligt. Dus stuklopen, en wel meteen bij de build - de
 * productpagina's worden daar gegenereerd, en lib/preorder.test.ts loopt
 * bovendien elke `shipsFrom` in het assortiment na.
 */
export function preorderDate(shipsFrom: string | undefined): Date | null {
  if (!shipsFrom) return null
  const datum = new Date(shipsFrom)
  if (!ISO_MET_TIJDZONE.test(shipsFrom) || Number.isNaN(datum.getTime())) {
    throw new Error(
      `lib/preorder.ts: "${shipsFrom}" is geen geldige shipsFrom. ` +
        'Gebruik een datum met tijd en tijdzone, zoals 2026-12-04T00:00:00+01:00.'
    )
  }
  return datum
}

/**
 * Moet deze bestelling wachten tot de verzenddatum?
 *
 * `now` is een parameter en geen `new Date()` binnenin, net als bij
 * `isSaleActive`: zo is dit te testen, en kan de aanroeper kiezen welke
 * klok geldt. Voor alles wat met geld of met een belofte te maken heeft
 * is dat de serverklok, nooit die van de browser.
 */
export function isPreorder(
  product: Pick<Product, 'shipsFrom'>,
  now: Date = new Date()
): boolean {
  const datum = preorderDate(product.shipsFrom)
  return datum !== null && now.getTime() < datum.getTime()
}

/**
 * De verzenddatum zoals je hem voorleest: "4 december".
 *
 * Met een vaste tijdzone, zodat server en browser dezelfde tekst
 * opleveren - zonder `timeZone` kan een bezoeker in een andere zone een
 * andere dag zien dan er in de HTML staat, en dat is bij hydratie een
 * verschil dat React opmerkt.
 */
export function preorderLabel(shipsFrom: string): string {
  const datum = preorderDate(shipsFrom)
  if (!datum) return ''
  return new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    day: 'numeric',
    month: 'long',
  }).format(datum)
}

/** Dezelfde datum als ISO-string, voor `availabilityStarts` in de structured data. */
export function preorderIso(shipsFrom: string): string {
  return preorderDate(shipsFrom)?.toISOString() ?? ''
}

/**
 * Eén zin voor overal waar de klant leest wanneer zijn pakket weggaat.
 *
 * Bewust "verzonden vanaf" en niet "geleverd op": wij weten wanneer het
 * pakket de deur uit gaat, niet wanneer de vervoerder aanbelt.
 */
export function preorderZin(shipsFrom: string): string {
  return `Wordt verzonden vanaf ${preorderLabel(shipsFrom)}.`
}
