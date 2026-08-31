export interface ProductVariant {
  id: string
  label: string
  price: number
  bolUrl: string
  image: string
  images?: string[]
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

export interface Product {
  slug: string
  name: string
  category: ProductCategory
  description: string
  shortDescription: string
  features: string[]
  badge?: 'bestseller' | 'new' | 'sale'
  variants: ProductVariant[]
}

export type ProductCategory =
  | 'dog-feeding'
  | 'cat-feeding'
  | 'dog-beds'
  | 'dog-travel'
  | 'dog-outdoor'
  | 'cat-outdoor'

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
