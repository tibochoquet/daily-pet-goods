import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock, Tag } from 'lucide-react'
import { getBlogPostBySlug, blogPosts } from '@/lib/blog'
import NewsletterSignup from '@/components/home/NewsletterSignup'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://www.dailypetgoods.nl/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  }
}

const placeholderContent = `
<p>This article is coming soon. We're currently writing in-depth, research-backed content on this topic to help you make the best decisions for your pet.</p>

<p>In the meantime, browse our product range or <a href="/contact">get in touch</a> if you have a specific question we can help with.</p>
`

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) notFound()

  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="bg-[#F3EDE3] py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#2C4A3E] transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to blog
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-semibold bg-[#2C4A3E]/10 text-[#2C4A3E] px-3 py-1 rounded-full">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <Clock size={12} />
              {post.readTime} min read
            </div>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight mb-5">
            {post.title}
          </h1>

          <p className="text-lg text-[#6B7280] leading-relaxed">{post.excerpt}</p>
        </div>
      </section>

      {/* Featured image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-12">
        <div className="relative aspect-[16/7] rounded-3xl overflow-hidden shadow-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>
      </div>

      {/* Content */}
      <section className="pb-16 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-slate prose-lg max-w-none
              prose-headings:font-serif prose-headings:text-[#1A1A1A]
              prose-p:text-[#4A4A4A] prose-p:leading-relaxed
              prose-a:text-[#2C4A3E] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#1A1A1A]"
            dangerouslySetInnerHTML={{ __html: post.content || placeholderContent }}
          />

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap mt-10 pt-10 border-t border-[#E8E2D9]">
            <Tag size={14} className="text-[#6B7280]" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-[#F3EDE3] text-[#6B7280] px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white border-t border-[#E8E2D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-8">Related articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group bg-[#FAFAF7] rounded-2xl overflow-hidden border border-[#E8E2D9] hover:shadow-md hover:border-[#D4CEBF] transition-all"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif font-bold text-[#1A1A1A] leading-snug group-hover:text-[#2C4A3E] transition-colors">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <NewsletterSignup />
    </>
  )
}
