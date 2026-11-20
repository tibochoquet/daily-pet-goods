/**
 * De tijdelijke actie, op één plek.
 *
 * Alles wat met de actie te maken heeft - of hij aanstaat, hoeveel
 * korting, hoe hij heet, wanneer hij loopt - staat hier en nergens
 * anders. Geen losse 10% of losse datum verspreid door de code: een
 * percentage dat op twee plekken staat, loopt vroeg of laat uit elkaar,
 * en dan toont de site iets anders dan er wordt afgerekend.
 *
 * De prijsberekening zelf staat in lib/sale.ts. Dit bestand bevat alleen
 * data en de vraag "loopt de actie nu?", zodat het ook door een client
 * component geïmporteerd kan worden zonder productdata mee te slepen.
 */

/**
 * Aan of uit, los van de datums.
 *
 * Te overrulen met NEXT_PUBLIC_SALE_ENABLED. Bewust een NEXT_PUBLIC-
 * variabele, hoewel die bij de build wordt ingebakken en je dus opnieuw
 * moet deployen om hem te wijzigen. Een variabele die alleen de server
 * leest zou sneller omschakelen, maar dan kan de browser de actieprijs
 * tonen terwijl de server de volle prijs rekent - en dat is precies het
 * verschil dat niet mag bestaan. Eén waarde voor beide kanten.
 *
 * Na `endsAt` gaat de actie sowieso uit, zonder dat hier iets hoeft te
 * gebeuren. Deze schakelaar is voor eerder stoppen of alsnog niet
 * beginnen.
 */
let onbekendeWaardeGemeld = false

function vlagUitOmgeving(): boolean | null {
  const ruw = process.env.NEXT_PUBLIC_SALE_ENABLED
  if (ruw === undefined) return null
  const v = ruw.trim().toLowerCase()
  if (v === '1' || v === 'true' || v === 'aan' || v === 'on' || v === 'ja') return true
  if (v === '0' || v === 'false' || v === 'uit' || v === 'off' || v === 'nee' || v === '') return false
  // Een typfout in de variabele mag de actie niet stilletjes aanzetten.
  // Eén keer melden: dit wordt bij elke aanroep gelezen.
  if (!onbekendeWaardeGemeld) {
    onbekendeWaardeGemeld = true
    console.warn(
      `config/sale.ts: NEXT_PUBLIC_SALE_ENABLED heeft een onbekende waarde ("${ruw}"). ` +
        'Gebruik 1 of 0. De waarde uit dit bestand blijft gelden.'
    )
  }
  return null
}

/**
 * Of de actie mag lopen: de omgevingsvariabele, en anders de waarde uit
 * dit bestand.
 *
 * Wordt bij elke aanroep gelezen en niet één keer bij het laden van de
 * module. In de browser maakt dat geen verschil - de bundler vervangt
 * `process.env.NEXT_PUBLIC_SALE_ENABLED` overal door de waarde van de
 * build - maar het maakt de uit-stand wel testbaar zonder de module
 * opnieuw te hoeven laden.
 */
export function saleEnabled(): boolean {
  return vlagUitOmgeving() ?? sale.enabled
}

export const sale = {
  /** Naam van de campagne, zoals hij in balk, hero en mails verschijnt. */
  campaign: 'Black Friday',
  /** Hele procenten. Wordt in centen gerekend, zie lib/sale.ts. */
  discountPercent: 10,
  /**
   * Of de actie mag lopen. Dit is de waarde uit dit bestand;
   * NEXT_PUBLIC_SALE_ENABLED heeft er voorrang op. Lees hem nooit
   * rechtstreeks maar via `saleEnabled()`, anders mis je de
   * omgevingsvariabele.
   */
  enabled: true,
  /**
   * Begin en eind met expliciete tijdzone-offset in de string.
   *
   * "2026-11-20T00:00" zonder offset leest Node als UTC en de browser
   * als lokale tijd, en dan begint de actie voor de bezoeker een uur
   * eerder dan voor de server. Beide data vallen in wintertijd, dus de
   * offset is +01:00 en verandert niet tijdens de actie.
   *
   * Het begin ligt een week voor Black Friday zelf: de actie loopt vanaf
   * 20 november en niet pas vanaf de 27e. Een begindatum in het verleden
   * is hier geen probleem - `isSaleActive` kijkt alleen of nu tussen
   * begin en eind valt, dus de actie staat meteen aan.
   *
   * Het eind staat op 23:59:59 en niet op 23:59:00, zodat de laatste
   * minuut van Cyber Monday meetelt in plaats van er net buiten te
   * vallen.
   */
  startsAt: '2026-11-20T00:00:00+01:00',
  endsAt: '2026-11-30T23:59:59+01:00',
} as const

export const saleStart = new Date(sale.startsAt)
export const saleEnd = new Date(sale.endsAt)

// Een onleesbare datum of een eind vóór het begin zou betekenen dat de
// actie nooit loopt, of erger: dat `isSaleActive` iets onzinnigs
// teruggeeft terwijl de banner wel staat. Dan is stuklopen bij de build
// beter dan een winkel die de verkeerde prijs rekent.
if (Number.isNaN(saleStart.getTime()) || Number.isNaN(saleEnd.getTime())) {
  throw new Error('config/sale.ts: startsAt of endsAt is geen geldige datum.')
}
if (saleEnd.getTime() <= saleStart.getTime()) {
  throw new Error('config/sale.ts: endsAt ligt op of voor startsAt.')
}
if (!Number.isInteger(sale.discountPercent) || sale.discountPercent <= 0 || sale.discountPercent >= 100) {
  throw new Error('config/sale.ts: discountPercent moet een heel getal tussen 1 en 99 zijn.')
}

/**
 * Loopt de actie op dit moment?
 *
 * `now` is een parameter en niet `new Date()` binnenin, zodat dit te
 * testen is en zodat de aanroeper kan kiezen welke klok geldt. Voor geld
 * is dat altijd de serverklok: zie app/api/checkout/route.ts.
 */
export function isSaleActive(now: Date = new Date()): boolean {
  if (!saleEnabled()) return false
  const t = now.getTime()
  return t >= saleStart.getTime() && t <= saleEnd.getTime()
}

/** Het eind als ISO-string, voor `priceValidUntil` in structured data. */
export function saleEndIso(): string {
  return saleEnd.toISOString()
}

/**
 * Het eind zoals je het voorleest: "maandag 30 november".
 *
 * Met een vaste tijdzone, zodat server en browser dezelfde tekst
 * opleveren. Zonder `timeZone` zou een bezoeker in een andere zone een
 * andere dag kunnen zien dan er in de HTML staat, en dat is bij
 * hydratie een verschil dat React opmerkt.
 */
export function saleEndLabel(): string {
  return new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(saleEnd)
}

/**
 * Hetzelfde zonder dagnaam: "30 november".
 *
 * Voor plekken waar de regel kort moet blijven, zoals de pil boven de
 * hero. Met dagnaam liep die op een 320px-telefoon over twee regels.
 */
export function saleEndShort(): string {
  return new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    day: 'numeric',
    month: 'long',
  }).format(saleEnd)
}
