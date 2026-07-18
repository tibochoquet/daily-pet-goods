import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export interface HeroTag {
  label: string
  price: number
  href: string
  /** Position as a percentage of the image, e.g. "35%" */
  top: string
  left: string
}

export interface QuickNavLink {
  label: string
  href: string
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
  /** Optional pill links overlaid top-right, used to jump between sub-categories on grouped pages. */
  quickNav?: QuickNavLink[]
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
  quickNav,
}: EditorialHeroProps) {
  return (
    <section className="relative w-full min-h-[500px] sm:min-h-[460px] lg:min-h-0 lg:aspect-video overflow-hidden bg-[#1F3329]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
        sizes="100vw"
        quality={90}
      />
      {/* Gradient: darkens the top-left text area, fades out toward the rest of the photo */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/25 to-transparent" />

      {/* Top-left: breadcrumb + headline, sized and spaced like the homepage hero */}
      <div className="relative z-10 flex min-h-[500px] sm:min-h-[460px] lg:min-h-0 lg:absolute lg:inset-0 flex-col justify-center px-5 sm:px-8 lg:px-14 py-10">
        <div className="max-w-xl">
          <p className="text-xs sm:text-sm text-white/55 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-white/90 transition-colors">Home</Link>
            {' / '}
            <Link href="/shop" className="hover:text-white/90 transition-colors">Shop</Link>
            {' / '}
            <span className="text-white/85">{breadcrumbLabel}</span>
          </p>

          <div className="inline-flex items-center gap-2 border border-white/25 text-white/80 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-5">
            <Sparkles size={12} className="text-[#D4956B]" />
            {eyebrow}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-4 sm:mb-5">
            {title}
          </h1>

          <p className="hidden sm:block text-base lg:text-lg text-white/70 leading-relaxed mb-7 max-w-md">
            {description}
          </p>

          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-white text-[#2C4A3E] font-semibold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full hover:bg-[#F3EDE3] transition-colors text-sm shadow-lg"
            >
              {ctaLabel}
              <ArrowRight size={16} />
            </Link>
          )}

          {/* Quick nav, mobile: in-flow below the CTA so it never overlaps the headline */}
          {quickNav && quickNav.length > 0 && (
            <div className="flex sm:hidden flex-wrap gap-2 mt-6">
              {quickNav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-[#1A1A1A] shadow-md"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick nav, sm and up: overlaid top-right on the photo */}
      {quickNav && quickNav.length > 0 && (
        <div className="hidden sm:flex absolute top-0 right-0 z-10 px-8 lg:px-14 pt-8 flex-wrap justify-end gap-2 max-w-[260px]">
          {quickNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-[#1A1A1A] hover:bg-white transition-colors shadow-md"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* Product tags: sm and up only, positions are tuned against the wider photo crop */}
      <div className="hidden sm:contents">
        {tags?.map((tag) => (
          <Link
            key={tag.label}
            href={tag.href}
            className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ top: tag.top, left: tag.left }}
          >
            <span className="relative flex items-center justify-center w-3 h-3 rounded-full bg-white shadow-md transition-transform duration-200 group-hover:scale-125">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
            </span>
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 backdrop-blur-sm px-3.5 py-1.5 text-xs font-medium text-[#1A1A1A] shadow-md transition-all duration-200 group-hover:bg-white group-hover:shadow-xl group-hover:scale-105">
              {tag.label} <span className="text-[#9CA3AF] group-hover:text-[#6B7280]">· vanaf €{tag.price.toFixed(2)}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
