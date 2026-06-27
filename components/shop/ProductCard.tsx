'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'
import { useCart } from '@/components/cart/CartProvider'

interface ProductCardProps {
  product: Product
  categorySlug: string
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#E8E2D9] hover:shadow-lg hover:border-[#D4CEBF] transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#F3EDE3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge variant={product.badge} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif font-semibold text-[#1A1A1A] text-base leading-snug mb-1 group-hover:text-[#2C4A3E] transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-[#6B7280] leading-relaxed mb-3 line-clamp-2">
          {product.shortDescription}
        </p>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#F3EDE3]">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-semibold text-[#2C4A3E]">
                €{(product.price * 0.9).toFixed(2)}
              </span>
              <span className="text-sm text-[#9CA3AF] line-through">
                €{product.price.toFixed(2)}
              </span>
            </div>
            <span className="text-[10px] text-[#C8745A] font-medium tracking-wide uppercase">
              met code DAILY10
            </span>
          </div>
          <button
            onClick={handleAdd}
            className={`inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-colors ${
              added
                ? 'bg-[#2C4A3E] text-white'
                : 'bg-[#C8745A] text-white hover:bg-[#A85E45]'
            }`}
          >
            {added ? <Check size={13} /> : <ShoppingCart size={13} />}
            {added ? 'Toegevoegd' : 'In winkelwagen'}
          </button>
        </div>
      </div>
    </Link>
  )
}
