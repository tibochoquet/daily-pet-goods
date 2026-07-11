import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Product } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#E8E2D9] hover:shadow-lg hover:border-[#D4CEBF] transition-all duration-300 flex flex-col">
      <Link href={`/products/${product.slug}`} className="block">
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
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif font-semibold text-[#1A1A1A] text-base leading-snug mb-1 group-hover:text-[#2C4A3E] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-[#6B7280] leading-relaxed mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#F3EDE3]">
          <span className="text-lg font-semibold text-[#2C4A3E]">
            €{product.price.toFixed(2)}
          </span>
          <a
            href={product.bolUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-[#C8745A] text-white hover:bg-[#A85E45] transition-colors"
          >
            Bekijk op Bol.com
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </div>
  )
}
