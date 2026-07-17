import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import { startingPrice } from '@/lib/products'
import Badge from '@/components/ui/Badge'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const cover = product.variants[0]
  const price = startingPrice(product)
  const multipleVariants = product.variants.length > 1

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-[#F3EDE3] overflow-hidden rounded-2xl mb-4">
        <Image
          src={cover.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.badge && (
          <div className="absolute top-4 left-4">
            <Badge variant={product.badge} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-0.5">
        <h3 className="font-serif text-[#1A1A1A] text-lg leading-snug mb-1 group-hover:text-[#2C4A3E] transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-[#6B7280] leading-relaxed mb-2.5 line-clamp-1">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#1A1A1A]">
            <span className="text-[#9CA3AF]">Vanaf </span>
            <span className="font-medium">€{price.toFixed(2)}</span>
          </span>
          {multipleVariants && (
            <span className="text-xs text-[#9CA3AF] tracking-wide">
              {product.variants.length} varianten
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
