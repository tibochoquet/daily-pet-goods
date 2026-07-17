import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'

interface EditorialHeroProps {
  eyebrow: string
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
  breadcrumbLabel: string
  /** Path from /public. Omit while photography is still in production, an elegant placeholder is shown instead. */
  image?: string
  imageAlt?: string
}

export default function EditorialHero({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  breadcrumbLabel,
  image,
  imageAlt,
}: EditorialHeroProps) {
  return (
    <section className="bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-10 md:pb-24">
        <p className="text-sm text-[#6B7280] mb-10">
          <Link href="/" className="hover:text-[#2C4A3E] transition-colors">Home</Link>
          {' / '}
          <Link href="/shop" className="hover:text-[#2C4A3E] transition-colors">Shop</Link>
          {' / '}
          <span className="text-[#1A1A1A] font-medium">{breadcrumbLabel}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8745A] mb-5">
              {eyebrow}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-[#1A1A1A] leading-[1.08] mb-6">
              {title}
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed mb-9">
              {description}
            </p>
            {ctaLabel && ctaHref && (
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 bg-[#2C4A3E] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#3D6456] transition-colors text-sm"
              >
                {ctaLabel}
                <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {/* Image */}
          {image ? (
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <Image
                src={image}
                alt={imageAlt ?? title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={88}
              />
            </div>
          ) : (
            <ImagePlaceholder className="aspect-[4/5]" />
          )}
        </div>
      </div>
    </section>
  )
}
