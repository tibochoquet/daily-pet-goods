import test from 'node:test'
import assert from 'node:assert/strict'
import { getRelatedProducts, products } from './products'

/**
 * Tests voor de rij "Anderen keken ook naar" onder een productpagina.
 *
 * Draaien met `npm test`. Drie dingen die hier echt fout kunnen gaan:
 * het product naar zichzelf laten verwijzen, een halflege rij bij een
 * categorie met één product, en een volgorde die per build verschilt -
 * de productpagina's worden immers bij de build gegenereerd.
 */

test('een product staat nooit in zijn eigen rij', () => {
  for (const product of products) {
    const rij = getRelatedProducts(product)
    assert.ok(
      rij.every((p) => p.slug !== product.slug),
      `${product.slug} verwijst naar zichzelf`
    )
  }
})

test('elke productpagina krijgt een volle rij', () => {
  for (const product of products) {
    assert.equal(
      getRelatedProducts(product).length,
      4,
      `${product.slug} heeft te weinig verwante producten`
    )
  }
})

test('geen dubbele producten in de rij', () => {
  for (const product of products) {
    const slugs = getRelatedProducts(product).map((p) => p.slug)
    assert.equal(new Set(slugs).size, slugs.length, `${product.slug} heeft een dubbele`)
  }
})

test('dezelfde categorie komt eerst', () => {
  // Een jas naast andere jassen: zolang er genoeg soortgenoten zijn,
  // vult die groep de hele rij.
  const jas = products.find((p) => p.category === 'dog-clothing')
  assert.ok(jas)
  const soortgenoten = products.filter(
    (p) => p.category === 'dog-clothing' && p.slug !== jas.slug
  ).length
  const rij = getRelatedProducts(jas)
  const uitZelfdeCategorie = rij.filter((p) => p.category === 'dog-clothing').length
  assert.equal(uitZelfdeCategorie, Math.min(soortgenoten, rij.length))
})

test('een categorie met één product valt terug op hetzelfde dier', () => {
  // cat-outdoor heeft maar één product. De rij mag dan niet leeg zijn,
  // en hij hoort bij de kat te blijven zolang daar genoeg van is.
  const enige = products.find((p) => p.category === 'cat-outdoor')
  assert.ok(enige)
  const rij = getRelatedProducts(enige)
  assert.equal(rij.length, 4)
  assert.ok(
    rij.every((p) => p.category.startsWith('cat-') || p.category.startsWith('pet-')),
    'er staat een hondenproduct onder een kattenproduct terwijl er katten genoeg zijn'
  )
})

test('de volgorde ligt vast', () => {
  const product = products[0]
  const een = getRelatedProducts(product).map((p) => p.slug)
  const twee = getRelatedProducts(product).map((p) => p.slug)
  assert.deepEqual(een, twee)
})
