import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export interface HeroTag {
  label: string
  price: number
  href: string
  /** Position as a percentage of the image, e.g. "35%" */
  top: string
  left: string
}

interface EditorialHeroProps {
  eyebrow: string
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
  breadcrumbLabel: string
  image: string
  imageAlt: string
  tags?: HeroTag[]
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
  tags,
}: EditorialHeroProps) {
  return (
    <section className="relative w-full aspect-video overflow-hidden bg-[#1F3329]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
        sizes="100vw"
        quality={90}
      />
      {/* Gradient for legibility of the top-left headline */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/15 to-transparent" />

      {/* Top-left: breadcrumb + headline */}
      <div className="absolute top-0 left-0 z-10 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 max-w-lg">
        <p className="text-sm text-white/60 mb-4 sm:mb-6">
          <Link href="/" className="hover:text-white/90 transition-colors">Home</Link>
          {' / '}
          <Link href="/shop" className="hover:text-white/90 transition-colors">Shop</Link>
          {' / '}
          <span className="text-white/90">{breadcrumbLabel}</span>
        </p>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4956B] mb-3">
          {eyebrow}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.08] mb-3">
          {title}
        </h1>
        <p className="hidden sm:block text-base text-white/70 leading-relaxed mb-6 max-w-md">
          {description}
        </p>
        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 bg-white text-[#2C4A3E] font-semibold px-6 py-3 rounded-full hover:bg-[#F3EDE3] transition-colors text-sm shadow-lg"
          >
            {ctaLabel}
            <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* Product tags */}
      {tags?.map((tag) => (
        <Link
          key={tag.label}
          href={tag.href}
          className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ top: tag.top, left: tag.left }}
        >
          <span className="relative flex items-center justify-center w-3 h-3 rounded-full bg-white shadow-md">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
          </span>
          <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 backdrop-blur-sm px-3.5 py-1.5 text-xs font-medium text-[#1A1A1A] shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            {tag.label} <span className="text-[#9CA3AF]">· vanaf €{tag.price.toFixed(2)}</span>
          </span>
        </Link>
      ))}
    </section>
  )
}
