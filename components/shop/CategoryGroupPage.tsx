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
  sections: GroupSection[]
}

export default function CategoryGroupPage({ sections }: CategoryGroupPageProps) {
  const quickNav = sections.map((section) => ({ label: section.navLabel, href: `#${section.id}` }))

  return (
    <>
      {sections.map((section, index) => (
        <CategoryPage
          key={section.id}
          hero={section.hero}
          breadcrumbLabel={section.breadcrumbLabel}
          products={section.products}
          sectionId={section.id}
          showNewsletter={false}
          quickNav={index === 0 ? quickNav : undefined}
        />
      ))}

      <NewsletterSignup />
    </>
  )
}
