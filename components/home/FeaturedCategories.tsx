import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { brandImages } from '@/lib/images'

const categories = [
  {
    title: 'Hondenbakken',
    description: 'Verhoogde voerbakken, mangohout & metaal',
    href: '/dog-bowls',
    image: brandImages.dogBowlsCover,
    imagePosition: 'object-[55%_70%]',
    alt: 'Hond naast houten voerbakken met roestvrijstalen inzet',
  },
  {
    title: 'Kattenbakken',
    description: 'Mangohout & minimalistisch metaal',
    href: '/cat-bowls',
    image: brandImages.catBowlsCover,
    imagePosition: 'object-[62%_55%]',
    alt: 'Kat naast een houten voerstation met roestvrijstalen bakken',
  },
  {
    title: 'Hondenmanden',
    description: 'Pluche donuts, lounge & Sambo manden',
    href: '/dog-beds',
    image: brandImages.dogBedsCover,
    imagePosition: 'object-center',
    alt: 'Honden rustend in pluche donut- en loungemanden in een woonkamer',
  },
  {
    title: 'Onderweg met je hond',
    description: 'Achterbankbeschermers, tuigjes & flessen',
    href: '/dog-travel',
    image: brandImages.dogTravelCover,
    imagePosition: 'object-center',
    alt: 'Hond op een waterdichte achterbankbeschermer in de auto',
  },
  {
    title: 'Zwembaden & koelmatten',
    description: 'Opvouwbare zomerzwembaden voor honden',
    href: '/dog-pools',
    image: brandImages.dogPoolsCover,
    imagePosition: 'object-[50%_75%]',
    alt: 'Hond naast een opvouwbaar zwembad en koelmat in de tuin',
  },
  {
    title: 'Koelmatten katten',
    description: 'Zelfkoelend, zonder water of stroom',
    href: '/cat-cooling',
    image: brandImages.catCoolingCover,
    imagePosition: 'object-[50%_65%]',
    alt: 'Hond en kat ontspannen tussen voerbakken en een hondenmand in huis',
  },
]

export default function FeaturedCategories() {
  const [featured, ...rest] = categories

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

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[220px]">

          {/* Featured large tile */}
          <Link
            href={featured.href}
            className="group relative flex flex-col justify-between p-7 rounded-3xl overflow-hidden lg:col-span-2 lg:row-span-2"
          >
            <Image
              src={featured.image}
              alt={featured.alt}
              fill
              className={`object-cover ${featured.imagePosition} group-hover:scale-105 transition-transform duration-500`}
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/35" />
            <div className="relative flex items-start justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/75">
                Uitgelicht
              </span>
              <span className="w-9 h-9 rounded-full border border-white/25 text-white flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <ArrowRight size={14} />
              </span>
            </div>
            <div className="relative">
              <h3 className="font-serif font-bold text-3xl sm:text-4xl text-white mb-2">
                {featured.title}
              </h3>
              <p className="text-sm text-white/75">{featured.description}</p>
            </div>
          </Link>

          {/* Smaller tiles */}
          {rest.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative flex flex-col justify-between p-6 rounded-3xl overflow-hidden"
            >
              <Image
                src={cat.image}
                alt={cat.alt}
                fill
                className={`object-cover ${cat.imagePosition} group-hover:scale-105 transition-transform duration-500`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" />
              <div className="relative flex items-start justify-between">
                <div />
                <span className="w-8 h-8 rounded-full border border-white/25 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={13} />
                </span>
              </div>
              <div className="relative">
                <h3 className="font-serif font-bold text-xl text-white mb-1">
                  {cat.title}
                </h3>
                <p className="text-xs text-white/75">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
