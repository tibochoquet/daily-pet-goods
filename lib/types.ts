export interface ProductVariant {
  id: string
  label: string
  price: number
  bolUrl: string
  image: string
  images?: string[]
  video?: string
  specs?: Record<string, string>
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
