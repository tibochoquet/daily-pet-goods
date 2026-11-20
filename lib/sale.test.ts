import test from 'node:test'
import assert from 'node:assert/strict'
import { isSaleActive, sale, saleEnabled, saleEnd, saleStart } from '@/config/sale'
import { pricingFor, saleDiscountCents, salePriceCents, toCents } from './sale'
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
