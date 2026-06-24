import Image from 'next/image'
import { brandImages, type BrandImageKey } from '@/lib/images'

interface BrandImageProps {
  imageKey: BrandImageKey
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
  width?: number
  height?: number
  objectFit?: 'cover' | 'contain' | 'fill'
}

export default function BrandImage({
  imageKey,
  alt,
  className = '',
  priority = false,
  sizes,
  fill,
  width,
  height,
  objectFit = 'cover',
}: BrandImageProps) {
  const src = brandImages[imageKey]

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={`${objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : 'object-fill'} ${className}`}
        priority={priority}
        sizes={sizes ?? '100vw'}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 800}
      className={`${objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : 'object-fill'} ${className}`}
      priority={priority}
      sizes={sizes}
    />
  )
}
