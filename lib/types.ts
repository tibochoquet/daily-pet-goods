export interface ProductVariant {
  id: string
  label: string
  /**
   * Verkoopprijs in euro's, of `null` zolang die nog niet vaststaat.
   *
   * `null` is geen randgeval dat ergens stilletjes 0 mag worden: een
   * variant zonder prijs is niet te bestellen, toont "Prijs volgt" in
   * plaats van een bedrag, en krijgt geen `offers` in de structured
   * data. Een verzonnen prijs in JSON-LD die afwijkt van wat de klant
   * afrekent, is voor Google een reden de hele vermelding te negeren.
   */
  price: number | null
  /** Ontbreekt bij producten die (nog) geen bol-listing hebben. */
  bolUrl?: string
  /**
   * EAN van de verpakking, zoals die ook op de bol-listing staat. Gaat
   * als `gtin13` mee in de structured data; hij staat bewust niet in de
   * zichtbare specificatietabel, want daar heeft een koper niets aan.
   */
  ean?: string
  image: string
  images?: string[]
  /**
   * Alt-tekst per foto, in dezelfde volgorde als `images`. Ontbreekt een
   * regel, dan valt de pagina terug op een beschrijving uit productnaam
   * en variant.
   */
  imageAlts?: string[]
  video?: string
  specs?: Record<string, string>
  /**
   * Real stock flag - drives both the Product JSON-LD `availability` value
   * and whether the variant can be added to the cart. Defaults to true via
   * `?? true` wherever it's read, since there's no inventory system behind
   * this yet and every existing variant is actually sellable; set to
   * `false` on a specific variant the moment it actually sells out.
   */
  inStock?: boolean
}

/**
 * Een kopje met tekst op de productpagina. Bedoeld voor producten met
 * veel uit te leggen - "Geschikt voor", "Batterij vervangen" - zodat de
 * beschrijving geen muur tekst wordt. Een sectie heeft een body, een
 * lijst, of allebei.
 */
export interface ProductSection {
  title: string
  body?: string
  items?: string[]
  /** Genummerde lijst in plaats van bolletjes, voor stappenplannen. */
  ordered?: boolean
}

export interface Product {
  slug: string
  name: string
  category: ProductCategory
  description: string
  shortDescription: string
  features: string[]
  badge?: 'bestseller' | 'new' | 'sale'
  /** Extra uitleg onder de voordelen, in losse kopjes. */
  sections?: ProductSection[]
  /** Wat er in de doos zit. */
  included?: string[]
  /** Eén regel over wat er juist niet bij zit. */
  notIncluded?: string
  /** Waarschuwing die de bezoeker op de pagina moet kunnen lezen. */
  safetyNote?: string
  /**
   * Titel voor de <title>-tag als de productnaam zelf te kort of te vaag
   * is om op te zoeken. Zonder deze valt de pagina terug op `name`.
   * Houd hem onder ~40 tekens: het sjabloon plakt er " | Daily Pet
   * Goods" achter.
   */
  seoTitle?: string
  variants: ProductVariant[]
}

export type ProductCategory =
  | 'dog-feeding'
  | 'cat-feeding'
  | 'dog-beds'
  | 'dog-travel'
  | 'dog-outdoor'
  | 'cat-outdoor'
  | 'dog-clothing'
  | 'cat-clothing'
  | 'cat-play'
  | 'dog-care'
  | 'cat-care'
  /** Verlichting en uitrusting voor het uitlaten zelf, niet voor de auto. */
  | 'dog-walking'
  /** Serves dogs and cats both, so it shows on /honden as well as /katten. */
  | 'pet-care'
  /** Draagtassen en vervoer; net als pet-care voor hond en kat samen. */
  | 'pet-travel'

export interface Category {
  id: ProductCategory
  name: string
  slug: string
  description: string
  image: string
  productCount?: number
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  image: string
  publishedAt: string
  readTime: number
  tags: string[]
}
