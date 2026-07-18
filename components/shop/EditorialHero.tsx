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
  /** Optional pill links, used to jump between sub-categories on grouped pages. */
  quickNav?: QuickNavLink[]
}

function Breadcrumb({ breadcrumbLabel, className }: { breadcrumbLabel: string; className: string }) {
  return (
    <p className={className}>
      <Link href="/" className="hover:text-white/90 transition-colors">Home</Link>
      {' / '}
      <Link href="/shop" className="hover:text-white/90 transition-colors">Shop</Link>
      {' / '}
      <span className="text-white/85">{breadcrumbLabel}</span>
    </p>
  )
}

function Eyebrow({ eyebrow, className }: { eyebrow: string; className: string }) {
  return (
    <div className={className}>
      <Sparkles size={12} className="text-[#D4956B]" />
      {eyebrow}
    </div>
  )
}

function Cta({ ctaLabel, ctaHref }: { ctaLabel?: string; ctaHref?: string }) {
  if (!ctaLabel || !ctaHref) return null
  return (
    <Link
      href={ctaHref}
      className="inline-flex items-center gap-2 bg-white text-[#2C4A3E] font-semibold px-6 py-3 rounded-full hover:bg-[#F3EDE3] transition-colors text-sm shadow-lg"
    >
      {ctaLabel}
      <ArrowRight size={16} />
    </Link>
  )
}

function QuickNav({ quickNav, className, pillClassName }: { quickNav?: QuickNavLink[]; className: string; pillClassName: string }) {
  if (!quickNav || quickNav.length === 0) return null
  return (
    <div className={className}>
      {quickNav.map((item) => (
        <a key={item.href} href={item.href} className={pillClassName}>
          {item.label}
        </a>
      ))}
    </div>
  )
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
    <section className="w-full">
      {/* Mobile & tablet (< lg): photo card on top, content in a solid block below. Fully independent from the desktop layout. */}
      <div className="lg:hidden">
        <div className="relative w-full aspect-[4/5] sm:aspect-[16/9]">
          <Image src={image} alt={imageAlt} fill className="object-cover" priority sizes="100vw" quality={90} />
        </div>
        <div className="bg-[#1F3329] px-5 sm:px-8 py-8 sm:py-10">
          <Breadcrumb breadcrumbLabel={breadcrumbLabel} className="text-xs text-white/55 mb-4" />
          <Eyebrow eyebrow={eyebrow} className="inline-flex items-center gap-2 border border-white/25 text-white/80 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-4" />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-[1.1] tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-6">
            {description}
          </p>
          <Cta ctaLabel={ctaLabel} ctaHref={ctaHref} />
          <QuickNav
            quickNav={quickNav}
            className="flex flex-wrap gap-2 mt-6"
            pillClassName="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white"
          />
        </div>
      </div>

      {/* Desktop (lg+): full-bleed photo with text and hotspot tags overlaid */}
      <div className="hidden lg:block relative w-full aspect-video overflow-hidden bg-[#1F3329]">
        <Image src={image} alt={imageAlt} fill className="object-cover" priority sizes="100vw" quality={90} />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/25 to-transparent" />

        <div className="absolute inset-0 z-10 flex flex-col justify-center px-14">
          <div className="max-w-xl">
            <Breadcrumb breadcrumbLabel={breadcrumbLabel} className="text-sm text-white/55 mb-6" />
            <Eyebrow eyebrow={eyebrow} className="inline-flex items-center gap-2 border border-white/25 text-white/80 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-5" />
            <h1 className="font-serif text-5xl xl:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-5">
              {title}
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-7 max-w-md">
              {description}
            </p>
            <Cta ctaLabel={ctaLabel} ctaHref={ctaHref} />
          </div>
        </div>

        <QuickNav
          quickNav={quickNav}
          className="flex absolute top-0 right-0 z-10 px-14 pt-8 flex-wrap justify-end gap-2 max-w-[260px]"
          pillClassName="px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-[#1A1A1A] hover:bg-white transition-colors shadow-md"
        />

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
