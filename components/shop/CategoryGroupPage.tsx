import Link from 'next/link'
import type { Product } from '@/lib/types'
import CategoryPage from './CategoryPage'
import NewsletterSignup from '@/components/home/NewsletterSignup'
import type { HeroTag } from './EditorialHero'

interface GroupSection {
  id: string
  navLabel: string
  breadcrumbLabel: string
  hero: {
    eyebrow: string
    title: string
    description: string
    ctaLabel?: string
    ctaHref?: string
    image: string
    imageAlt: string
    tags?: HeroTag[]
  }
  products: Product[]
}

interface CategoryGroupPageProps {
  title: string
  intro: string
  sections: GroupSection[]
}

export default function CategoryGroupPage({ title, intro, sections }: CategoryGroupPageProps) {
  return (
    <>
      <section className="bg-[#F3EDE3] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-[#6B7280] mb-3">
            <Link href="/" className="hover:text-[#2C4A3E] transition-colors">Home</Link>
            {' / '}
            <Link href="/shop" className="hover:text-[#2C4A3E] transition-colors">Shop</Link>
            {' / '}
            <span className="text-[#1A1A1A] font-medium">{title}</span>
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">{title}</h1>
          <p className="text-lg text-[#6B7280] max-w-xl mb-8">{intro}</p>

          {/* Quick nav to jump straight to a specific sub-category */}
          <div className="flex flex-wrap gap-2.5">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="px-4 py-2 rounded-full bg-white border border-[#E8E2D9] text-sm font-medium text-[#1A1A1A] hover:border-[#2C4A3E] hover:text-[#2C4A3E] transition-colors"
              >
                {section.navLabel}
              </a>
            ))}
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <CategoryPage
          key={section.id}
          hero={section.hero}
          breadcrumbLabel={section.breadcrumbLabel}
          products={section.products}
          sectionId={section.id}
          showNewsletter={false}
        />
      ))}

      <NewsletterSignup />
    </>
  )
}
