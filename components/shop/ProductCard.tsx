import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import type { Product } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'

interface ProductCardProps {
  product: Product
  categorySlug: string
}

export default function ProductCard({ product, categorySlug }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#E8E2D9] hover:shadow-lg hover:border-[#D4CEBF] transition-all duration-300">
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
      <div className="p-4">
        <h3 className="font-serif font-semibold text-[#1A1A1A] text-base leading-snug mb-1 group-hover:text-[#2C4A3E] transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-[#6B7280] leading-relaxed mb-3 line-clamp-2">
          {product.shortDescription}
        </p>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F3EDE3]">
          <span className="text-lg font-semibold text-[#1A1A1A]">
            €{product.price.toFixed(2)}
          </span>
          <a
            href={product.bolUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#C8745A] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#A85E45] transition-colors"
          >
            Buy on Bol
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  )
}
