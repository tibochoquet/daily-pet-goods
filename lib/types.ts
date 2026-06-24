export interface Product {
  id: string
  name: string
  slug: string
  category: ProductCategory
  subcategory?: string
  price: number
  originalPrice?: number
  description: string
  shortDescription: string
  features: string[]
  specs?: Record<string, string>
  image: string
  images?: string[]
  bolUrl: string
  badge?: 'bestseller' | 'new' | 'sale'
  rating: number
  reviewCount: number
  inStock: boolean
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  label: string
  value: string
  image?: string
  price?: number
  bolUrl?: string
}

export type ProductCategory =
  | 'dog-feeding'
  | 'cat-feeding'
  | 'dog-beds'
  | 'dog-travel'
  | 'dog-outdoor'

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

export interface Review {
  id: string
  author: string
  location: string
  rating: number
  text: string
  product: string
  date: string
  avatar?: string
}
