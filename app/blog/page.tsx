import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ArrowRight } from 'lucide-react'
import { blogPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog — Pet Care Tips & Guides',
  description:
    'Expert guides and practical advice for dog and cat owners. Dog bowl comparisons, bed reviews, travel tips, and more — from the Daily Pet Goods team.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/blog' },
}

export default function BlogPage() {
  const [featured, ...rest] = blogPosts

  return (
    <>
      <section className="bg-[#F3EDE3] py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#C8745A] uppercase tracking-wider mb-4">Blog</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
            Pet care tips & guides
          </h1>
          <p className="text-lg text-[#6B7280] max-w-xl">
            Practical advice to help you choose the right products and care for your pets every day.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Featured post */}
          <Link href={`/blog/${featured.slug}`} className="group block mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden border border-[#E8E2D9] hover:shadow-lg hover:border-[#D4CEBF] transition-all duration-300">
              <div className="relative aspect-[4/3] lg:aspect-auto bg-[#F3EDE3]">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold bg-[#2C4A3E]/10 text-[#2C4A3E] px-3 py-1 rounded-full">
                    {featured.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <Clock size={12} />
                    {featured.readTime} min read
                  </div>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A] leading-tight mb-4 group-hover:text-[#2C4A3E] transition-colors">
                  {featured.title}
                </h2>
                <p className="text-[#6B7280] leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="inline-flex items-center gap-2 text-[#2C4A3E] font-medium text-sm group-hover:gap-3 transition-all">
                  Read article
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </Link>

          {/* Rest of posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E8E2D9] hover:shadow-md hover:border-[#D4CEBF] transition-all duration-300"
              >
                <div className="relative aspect-[16/9] bg-[#F3EDE3] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold bg-[#2C4A3E]/10 text-[#2C4A3E] px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                      <Clock size={11} />
                      {post.readTime} min
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-[#1A1A1A] leading-snug mb-2 group-hover:text-[#2C4A3E] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
