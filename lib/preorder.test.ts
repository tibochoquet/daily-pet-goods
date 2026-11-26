import test from 'node:test'
import assert from 'node:assert/strict'
import { isPreorder, preorderDate, preorderLabel, preorderZin } from './preorder'
import { products } from './products'

/**
 * Tests voor de pre-order: wel te bestellen, nog niet te verzenden.
 *
 * Wat hier echt fout kan gaan, is dat de site een verzenddatum belooft
 * die niet klopt - te vroeg, een dag ernaast door de tijdzone, of een
 * datum die blijft staan terwijl hij allang verstreken is.
 */

const VIER_DECEMBER = '2026-12-04T00:00:00+01:00'

test('zonder shipsFrom is een product gewoon leverbaar', () => {
  assert.equal(isPreorder({}), false)
  assert.equal(isPreorder({ shipsFrom: undefined }), false)
  assert.equal(preorderDate(undefined), null)
})

test('voor de datum is het een pre-order, erna niet meer', () => {
  const product = { shipsFrom: VIER_DECEMBER }
  assert.equal(isPreorder(product, new Date('2026-11-26T12:00:00+01:00')), true)
  assert.equal(isPreorder(product, new Date('2026-12-10T12:00:00+01:00')), false)
})

test('het omslagpunt ligt op middernacht Nederlandse tijd', () => {
  const product = { shipsFrom: VIER_DECEMBER }
  // Een seconde voor middernacht wacht de klant nog.
  assert.equal(isPreorder(product, new Date('2026-12-03T23:59:59+01:00')), true)
  // Op het moment zelf is het een gewoon product, zonder dat er iets
  // omgezet hoeft te worden.
  assert.equal(isPreorder(product, new Date('2026-12-04T00:00:00+01:00')), false)
  // En dat geldt ook voor een bezoeker in een andere tijdzone: hetzelfde
  // moment, andere notatie.
  assert.equal(isPreorder(product, new Date('2026-12-03T23:00:00Z')), false)
})

test('de datum leest voor als 4 december, ongeacht de tijdzone van de lezer', () => {
  assert.equal(preorderLabel(VIER_DECEMBER), '4 december')
  assert.equal(preorderZin(VIER_DECEMBER), 'Wordt verzonden vanaf 4 december.')
})

test('een datum die niet deugt loopt stuk in plaats van iets te beloven', () => {
  // Hier zit de valkuil: hier maakt new Date() 4 december 2001 van, een
  // datum in het verleden, en dan ziet een pre-order eruit als gewoon op
  // voorraad.
  assert.throws(() => preorderDate('4 december'), /geen geldige shipsFrom/)
  // Zonder tijdzone leest Node dit als UTC en de browser als lokale tijd.
  assert.throws(() => preorderDate('2026-12-04'), /geen geldige shipsFrom/)
  assert.throws(() => isPreorder({ shipsFrom: 'binnenkort' }), /geen geldige shipsFrom/)
})

test('elke shipsFrom in het assortiment is een geldige datum met tijdzone', () => {
  for (const product of products) {
    if (!product.shipsFrom) continue
    assert.doesNotThrow(() => preorderDate(product.shipsFrom), `${product.slug} heeft een rare datum`)
    assert.match(
      product.shipsFrom,
      /[+-]\d{2}:\d{2}$|Z$/,
      `${product.slug}: shipsFrom zonder tijdzone leest de server anders dan de browser`
    )
  }
})
