import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { brandImages } from '@/lib/images'

const categories = [
  {
    title: 'Honden',
    description: 'Voerbakken, manden, reisbenodigdheden & zwembaden',
    href: '/honden',
    image: brandImages.hondenTile,
    imagePosition: 'object-center',
    alt: 'Golden retriever slaapt in een pluche donutmand, met een houten voerstation op de achtergrond',
  },
  {
    title: 'Katten',
    description: 'Voerstations & zelfkoelende matten',
    href: '/katten',
    image: brandImages.kattenTile,
    imagePosition: 'object-center',
    alt: 'Grijze kat naast een houten voerstation met roestvrijstalen bakken',
  },
]

export default function FeaturedCategories() {
  return (
    <section className="py-16 md:py-24 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold text-[#C8745A] uppercase tracking-wider mb-2">Categorieën</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A]">
              Shop per categorie
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[#2C4A3E] font-medium text-sm hover:gap-3 transition-all"
          >
            Bekijk alle producten
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Two large, equal tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative flex flex-col justify-between p-8 rounded-3xl overflow-hidden aspect-[4/5]"
            >
              <Image
                src={cat.image}
                alt={cat.alt}
                fill
                className={`object-cover ${cat.imagePosition} group-hover:scale-105 transition-transform duration-500`}
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
              <div className="relative flex items-start justify-end">
                <span className="w-10 h-10 rounded-full border border-white/25 text-white flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <ArrowRight size={16} />
                </span>
              </div>
              <div className="relative">
                <h3 className="font-serif font-bold text-3xl sm:text-4xl text-white mb-2">
                  {cat.title}
                </h3>
                <p className="text-sm text-white/75">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
