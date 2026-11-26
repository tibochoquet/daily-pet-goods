import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
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

/**
 * En drie dingen die bij het toevoegen van een product fout kunnen gaan
 * zonder dat je het op een testpagina ziet.
 */

test('elke slug en elk variant-id is uniek', () => {
  const slugs = products.map((p) => p.slug)
  assert.equal(new Set(slugs).size, slugs.length, 'twee producten delen een slug')

  // Een dubbel variant-id is erger dan een dubbele slug: de winkelwagen
  // en /api/checkout zoeken een variant op id op, dus dan belandt de
  // verkeerde maat - of het verkeerde product - in de bestelling.
  const ids = products.flatMap((p) => p.variants.map((v) => v.id))
  assert.equal(new Set(ids).size, ids.length, 'twee varianten delen een id')
})

test('elke foto in dit bestand staat ook echt in public', () => {
  const ontbreekt: string[] = []
  for (const product of products) {
    for (const variant of product.variants) {
      const paden = [variant.image, ...(variant.images ?? [])]
      for (const pad of paden) {
        if (!existsSync(join(import.meta.dirname, '..', 'public', pad))) {
          ontbreekt.push(`${product.slug} / ${variant.id}: ${pad}`)
        }
      }
    }
  }
  assert.deepEqual(ontbreekt, [], 'deze paden staan wel in products.ts maar niet op schijf')
})

test('bij elke foto hoort een alt-tekst, of helemaal geen', () => {
  for (const product of products) {
    for (const variant of product.variants) {
      if (!variant.imageAlts) continue
      const aantal = (variant.images ?? [variant.image]).length
      assert.equal(
        variant.imageAlts.length,
        aantal,
        `${product.slug} / ${variant.id}: ${variant.imageAlts.length} alt-teksten bij ${aantal} foto's`
      )
    }
  }
})
