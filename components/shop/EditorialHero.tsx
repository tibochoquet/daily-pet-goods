import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface EditorialHeroProps {
  eyebrow: string
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
  breadcrumbLabel: string
  image: string
  imageAlt: string
  /** Tailwind object-position class, defaults to object-center. Tune per photo so the subject stays in frame on narrow (mobile) crops. */
  imagePosition?: string
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
  imagePosition = 'object-center',
}: EditorialHeroProps) {
  return (
    <section className="relative min-h-[70vh] flex items-end overflow-hidden group">
      <Image
        src={image}
        alt={imageAlt}
        fill
        className={`object-cover ${imagePosition} transition-transform duration-700 ease-out group-hover:scale-105`}
        priority
        sizes="100vw"
        quality={88}
      />
      {/* Gradient for legibility, intensifies slightly on hover so the name reads clearly */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5 transition-opacity duration-500 opacity-90 group-hover:opacity-100" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 md:pb-20">
        <p className="text-sm text-white/50 mb-6">
          <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
          {' / '}
          <Link href="/shop" className="hover:text-white/80 transition-colors">Shop</Link>
          {' / '}
          <span className="text-white/80">{breadcrumbLabel}</span>
        </p>

        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4956B] mb-4 opacity-90 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            {eyebrow}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.08] mb-5">
            {title}
          </h1>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            {description}
          </p>
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-white text-[#2C4A3E] font-semibold px-7 py-3.5 rounded-full hover:bg-[#F3EDE3] transition-colors text-sm shadow-lg"
            >
              {ctaLabel}
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
