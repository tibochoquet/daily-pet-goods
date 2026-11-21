import test from 'node:test'
import assert from 'node:assert/strict'
import { isSaleActive, sale, saleEnabled, saleEnd, saleStart } from '@/config/sale'
import {
  discountCentsAt,
  pricingFor,
  saleCartTotals,
  saleDiscountCents,
  saleDiscountLabel,
  salePriceCents,
  toCents,
} from './sale'
import { calculateSaleDiscount } from './saleCart'
import { products } from './products'

/**
 * Tests voor de prijslogica van de actie.
 *
 * Draaien met `npm test`. Geen testframework in dit project, dus
 * node:test via tsx - genoeg voor de twee dingen die hier echt fout
 * kunnen gaan: een cent verkeerd afronden, en korting geven buiten de
 * periode.
 */

/** Een moment middenin de actie, en twee er net buiten. */
const tijdens = new Date(saleStart.getTime() + 24 * 60 * 60 * 1000)
const ervoor = new Date(saleStart.getTime() - 1000)
const erna = new Date(saleEnd.getTime() + 1000)

test('afronden gebeurt op hele centen, een halve cent naar boven', () => {
  // 10% van 3999 cent is 399,9 -> 400, dus 39,99 wordt 35,99.
  assert.equal(saleDiscountCents(3999), 400)
  assert.equal(salePriceCents(3999), 3599)

  // 10% van 1995 cent is precies 199,5. Dat moet 200 worden en niet 199,
  // anders krijgt de klant een cent minder korting dan het label belooft.
  assert.equal(saleDiscountCents(1995), 200)
  assert.equal(salePriceCents(1995), 1795)

  // 44,99 -> 449,9 -> 450 -> 40,49.
  assert.equal(salePriceCents(4499), 4049)

  // Een prijs die niet te korten valt, levert geen negatieve korting op.
  assert.equal(saleDiscountCents(0), 0)
  assert.equal(saleDiscountCents(-100), 0)
})

test('toCents heeft geen last van kommagetallen', () => {
  assert.equal(toCents(39.99), 3999)
  assert.equal(toCents(0.1), 10)
  assert.equal(toCents(19.95), 1995)
})

test('pricingFor: uit betekent niets doorgestreept', () => {
  const uit = pricingFor(39.99, false)
  assert.ok(uit)
  assert.equal(uit.active, false)
  assert.equal(uit.current, 39.99)
  assert.equal(uit.base, 39.99)
  assert.equal(uit.saved, 0)
})

test('pricingFor: aan betekent actieprijs plus het bespaarde bedrag', () => {
  const aan = pricingFor(39.99, true)
  assert.ok(aan)
  assert.equal(aan.active, true)
  assert.equal(aan.base, 39.99)
  assert.equal(aan.current, 35.99)
  assert.equal(aan.saved, 4)
  assert.equal(aan.percent, sale.discountPercent)
})

test('pricingFor: een variant zonder prijs blijft zonder prijs', () => {
  assert.equal(pricingFor(null, true), null)
  assert.equal(pricingFor(null, false), null)
})

test('de actie loopt op 21 november', () => {
  // De dag waarop hij live moest staan. Bewust niet `isSaleActive()` met
  // de echte klok: die test zou in december omvallen zonder dat er iets
  // stuk is.
  assert.equal(isSaleActive(new Date('2026-11-21T12:00:00+01:00')), true)
  assert.equal(isSaleActive(new Date('2026-11-21T00:00:00+01:00')), true, 'vanaf middernacht')
})

test('de actie loopt alleen tussen start en eind', () => {
  assert.equal(isSaleActive(ervoor), false)
  assert.equal(isSaleActive(saleStart), true, 'de eerste seconde telt mee')
  assert.equal(isSaleActive(tijdens), true)
  assert.equal(isSaleActive(saleEnd), true, 'de laatste seconde telt mee')
  assert.equal(isSaleActive(erna), false)
})

test('start en eind staan op de bedoelde Nederlandse tijd', () => {
  // Niet de ISO-string herhalen maar de uitkomst in Amsterdamse tijd
  // controleren: dat is waar de belofte aan de klant over gaat.
  const nl = (d: Date) =>
    new Intl.DateTimeFormat('nl-NL', {
      timeZone: 'Europe/Amsterdam',
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(d)
  // Het begin is middernacht Nederlandse tijd. De datum zelf staat hier
  // niet vast, want die mag schuiven - de actie is een keer naar voren
  // gehaald. Dat hij om 00:00:00 begint en niet om 01:00, is wel de
  // belofte en precies wat de offset in de string moet opleveren.
  assert.match(nl(saleStart), /^\d{2}-\d{2}-\d{4}, 00:00:00$/)
  // Het eind is de laatste seconde van Cyber Monday.
  assert.equal(nl(saleEnd), '30-11-2026, 23:59:59')
})

test('de omgevingsvariabele zet de actie uit, ook middenin de periode', () => {
  const oud = process.env.NEXT_PUBLIC_SALE_ENABLED
  try {
    process.env.NEXT_PUBLIC_SALE_ENABLED = '0'
    assert.equal(saleEnabled(), false)
    assert.equal(isSaleActive(tijdens), false)

    process.env.NEXT_PUBLIC_SALE_ENABLED = '1'
    assert.equal(saleEnabled(), true)
    assert.equal(isSaleActive(tijdens), true)

    // Onbekende waarde: de waarde uit het bestand blijft gelden, de
    // actie gaat er niet stilletjes van uit of aan.
    process.env.NEXT_PUBLIC_SALE_ENABLED = 'misschien'
    assert.equal(saleEnabled(), sale.enabled)
  } finally {
    if (oud === undefined) delete process.env.NEXT_PUBLIC_SALE_ENABLED
    else process.env.NEXT_PUBLIC_SALE_ENABLED = oud
  }
})

test('winkelwagenkorting rondt per stuk af, niet over het subtotaal', () => {
  // Twee keer een prijs die op een halve cent uitkomt. Per stuk is dat
  // 2 x 2,00 = 4,00; over het subtotaal van 39,90 zou het 3,99 zijn.
  // De klant heeft twee keer "je bespaart 2,00" gezien, dus 4,00.
  const perStuk = saleDiscountCents(1995) * 2
  assert.equal(perStuk, 400)
  assert.notEqual(perStuk, Math.round((1995 * 2 * sale.discountPercent) / 100))
})

test('winkelwagenkorting rekent met de echte productprijzen', () => {
  // Een bestaande variant met een prijs, uit de echte productdata.
  const variant = products.flatMap((p) => p.variants).find((v) => v.price !== null)
  assert.ok(variant && variant.price !== null, 'er hoort minstens één variant met prijs te zijn')

  const korting = calculateSaleDiscount([{ id: variant.id, quantity: 2 }], tijdens)
  assert.ok(korting)
  assert.equal(korting.subtotal, (toCents(variant.price) * 2) / 100)
  assert.equal(korting.amountOff, (saleDiscountCents(toCents(variant.price)) * 2) / 100)
  assert.equal(korting.percentOff, sale.discountPercent)
})

test('na de einddatum geeft de server geen korting meer', () => {
  const variant = products.flatMap((p) => p.variants).find((v) => v.price !== null)
  assert.ok(variant)
  const regels = [{ id: variant.id, quantity: 1 }]

  assert.ok(calculateSaleDiscount(regels, tijdens), 'tijdens de actie wel')
  assert.equal(calculateSaleDiscount(regels, erna), null, 'erna niet')
  assert.equal(calculateSaleDiscount(regels, ervoor), null, 'ervoor ook niet')
})

test('onbekende of onzinnige regels leveren geen korting op', () => {
  assert.equal(calculateSaleDiscount([], tijdens), null)
  assert.equal(calculateSaleDiscount([{ id: 'bestaat-niet', quantity: 1 }], tijdens), null)

  const variant = products.flatMap((p) => p.variants).find((v) => v.price !== null)
  assert.ok(variant)
  // Een aantal van 0 of een gebroken aantal telt niet mee.
  assert.equal(calculateSaleDiscount([{ id: variant.id, quantity: 0 }], tijdens), null)
  assert.equal(calculateSaleDiscount([{ id: variant.id, quantity: 1.5 }], tijdens), null)
})

/* ---------- De tweede trede: 20% vanaf de drempel ---------- */

test('onder de drempel geldt het basispercentage, erop en erboven de tweede trede', () => {
  // De drie bedragen uit de opdracht: 99,99 / 100 / 120.
  const onder = saleCartTotals([{ price: 99.99, quantity: 1 }], true)
  assert.equal(onder.active, true)
  assert.equal(onder.tierReached, false)
  assert.equal(onder.percent, sale.discountPercent)
  assert.equal(onder.subtotal, 99.99)
  // 10% van 9999 cent is 999,9 -> 1000.
  assert.equal(onder.amountOff, 10)
  assert.equal(onder.total, 89.99)
  assert.equal(onder.remainingForTier, 0.01)

  const precies = saleCartTotals([{ price: 100, quantity: 1 }], true)
  assert.equal(precies.tierReached, true, 'de drempel zelf telt mee')
  assert.equal(precies.percent, sale.tierDiscountPercent)
  assert.equal(precies.amountOff, 20)
  assert.equal(precies.total, 80)
  assert.equal(precies.remainingForTier, 0)

  const erboven = saleCartTotals([{ price: 120, quantity: 1 }], true)
  assert.equal(erboven.tierReached, true)
  assert.equal(erboven.percent, sale.tierDiscountPercent)
  assert.equal(erboven.amountOff, 24)
  assert.equal(erboven.total, 96)
})

test('de treden stapelen niet en gelden over de hele bestelling', () => {
  const t = saleCartTotals([{ price: 120, quantity: 1 }], true)
  // 20% over 120 euro.
  assert.equal(t.amountOff, 24)
  // Niet 10% + 20% samen (36), en niet 10% over de eerste 100 plus 20%
  // over de laatste 20 (14).
  assert.notEqual(t.amountOff, 36)
  assert.notEqual(t.amountOff, 14)
})

test('de drempel wordt getoetst aan het subtotaal vóór korting', () => {
  // 105 euro zakt met 10% naar 94,50 en zou de drempel daarna niet meer
  // halen - en met 20% weer wel. Zou de toets ná korting gebeuren, dan
  // heeft deze winkelwagen geen stabiele uitkomst.
  const t = saleCartTotals([{ price: 105, quantity: 1 }], true)
  assert.equal(t.tierReached, true)
  assert.equal(t.amountOff, 21)
  assert.equal(t.total, 84)
})

test('losse regels tellen samen op voor de drempel', () => {
  // 2 x 39,99 + 24,99 = 104,97, dus over de drempel.
  const t = saleCartTotals(
    [
      { price: 39.99, quantity: 2 },
      { price: 24.99, quantity: 1 },
    ],
    true
  )
  assert.equal(t.subtotal, 104.97)
  assert.equal(t.tierReached, true)
  // Per stuk: 20% van 3999 = 799,8 -> 800 (twee keer), 20% van 2499 =
  // 499,8 -> 500. Samen 2100 cent.
  assert.equal(t.amountOff, 21)
  assert.equal(t.total, 83.97)
})

test('afronden gebeurt per stuk, ook op de tweede trede', () => {
  // Zes keer 19,99 is 119,94. Per stuk: 20% van 1999 cent is 399,8 ->
  // 400, zes keer is 2400.
  const t = saleCartTotals([{ price: 19.99, quantity: 6 }], true)
  assert.equal(t.subtotal, 119.94)
  assert.equal(t.amountOff, 24)
  // Over het subtotaal afgerond was het 23,99 geweest: een cent minder
  // dan zes keer het bedrag dat op de productpagina stond.
  assert.equal(Math.round((11994 * sale.tierDiscountPercent) / 100), 2399)
})

test('discountCentsAt gaat niet over de rooie bij onzin', () => {
  assert.equal(discountCentsAt(3999, sale.tierDiscountPercent), 800)
  assert.equal(discountCentsAt(0, 20), 0)
  assert.equal(discountCentsAt(-100, 20), 0)
  assert.equal(discountCentsAt(3999, 0), 0)
  assert.equal(discountCentsAt(3999, -10), 0)
})

test('zonder actie geen korting, hoe vol de winkelwagen ook is', () => {
  const t = saleCartTotals([{ price: 120, quantity: 1 }], false)
  assert.equal(t.active, false)
  assert.equal(t.tierReached, false)
  assert.equal(t.amountOff, 0)
  assert.equal(t.total, 120)
  assert.equal(t.subtotal, 120)
  // Niets aan te moedigen als er geen actie loopt.
  assert.equal(t.remainingForTier, 0)
})

test('een lege winkelwagen levert nul korting op', () => {
  const t = saleCartTotals([], true)
  assert.equal(t.subtotal, 0)
  assert.equal(t.amountOff, 0)
  assert.equal(t.total, 0)
  assert.equal(t.tierReached, false)
  assert.equal(t.remainingForTier, sale.tierThreshold)
})

test('onzinnige regels tellen niet mee voor de drempel', () => {
  // Een gebroken aantal of een prijs van niets mag de drempel niet
  // halen, want de checkout rekent zulke regels ook niet mee.
  const t = saleCartTotals(
    [
      { price: 120, quantity: 1.5 },
      { price: 0, quantity: 5 },
      { price: 39.99, quantity: 1 },
    ],
    true
  )
  assert.equal(t.subtotal, 39.99)
  assert.equal(t.tierReached, false)
  assert.equal(t.amountOff, 4)
})

test('het kortingslabel noemt het percentage dat echt is toegepast', () => {
  assert.equal(
    saleDiscountLabel(sale.discountPercent),
    `${sale.campaign}-korting (${sale.discountPercent}%)`
  )
  assert.match(saleDiscountLabel(sale.tierDiscountPercent), /\(20%\)$/)
})

test('de server rekent precies hetzelfde als de winkelwagen', () => {
  // De winkelwagen rekent met prijzen uit de browser, de checkout met
  // prijzen uit lib/products.ts. Wijken die twee ook maar een cent af,
  // dan int Stripe iets anders dan er op het scherm stond. Dit is de
  // test die dat vastzet - voor beide treden.
  const metPrijs = products
    .flatMap((p) => p.variants)
    .filter((v): v is (typeof v) & { price: number } => v.price !== null)
  assert.ok(metPrijs.length >= 2)

  const opPrijs = [...metPrijs].sort((a, b) => a.price - b.price)
  const goedkoopste = opPrijs[0]
  const duurste = opPrijs[opPrijs.length - 1]

  const winkelwagens = [
    [{ id: goedkoopste.id, quantity: 1 }],
    [{ id: duurste.id, quantity: 3 }],
    [
      { id: duurste.id, quantity: 2 },
      { id: goedkoopste.id, quantity: 1 },
    ],
  ]

  for (const regels of winkelwagens) {
    const server = calculateSaleDiscount(regels, tijdens)
    const prijzen = regels.map((r) => ({
      price: metPrijs.find((v) => v.id === r.id)!.price,
      quantity: r.quantity,
    }))
    const winkelwagen = saleCartTotals(prijzen, true)

    assert.ok(server, 'tijdens de actie hoort er korting te zijn')
    assert.equal(server.subtotal, winkelwagen.subtotal)
    assert.equal(server.percentOff, winkelwagen.percent)
    assert.equal(server.amountOff, winkelwagen.amountOff)
    assert.equal(server.label, saleDiscountLabel(winkelwagen.percent))
  }

  // En minstens één van die winkelwagens hoort de hoge trede te halen,
  // anders test het bovenstaande alleen de 10%.
  const driemaalDuurste = saleCartTotals([{ price: duurste.price, quantity: 3 }], true)
  assert.equal(driemaalDuurste.tierReached, true, 'drie keer het duurste product haalt de drempel')
  assert.equal(driemaalDuurste.percent, sale.tierDiscountPercent)
})

test('na de einddatum ook geen 20%, hoe vol de winkelwagen ook is', () => {
  const variant = products.flatMap((p) => p.variants).find((v) => v.price !== null)
  assert.ok(variant)
  // Twintig stuks is ruim boven de drempel.
  const regels = [{ id: variant.id, quantity: 20 }]
  const tijdensActie = calculateSaleDiscount(regels, tijdens)
  assert.ok(tijdensActie)
  assert.equal(tijdensActie.percentOff, sale.tierDiscountPercent)
  assert.equal(calculateSaleDiscount(regels, erna), null, 'erna niets')
  assert.equal(calculateSaleDiscount(regels, ervoor), null, 'ervoor ook niets')
})
