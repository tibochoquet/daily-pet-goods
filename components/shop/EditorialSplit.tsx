import Image from 'next/image'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'

interface EditorialSplitProps {
  eyebrow: string
  title: string
  description: string
  imagePosition?: 'left' | 'right'
  /** Path from /public. Omit while photography is still in production, an elegant placeholder is shown instead. */
  image?: string
  imageAlt?: string
}

export default function EditorialSplit({
  eyebrow,
  title,
  description,
  imagePosition = 'right',
  image,
  imageAlt,
}: EditorialSplitProps) {
  return (
    <section className="py-16 md:py-24 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className={imagePosition === 'left' ? 'lg:order-2' : ''}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8745A] mb-5">
              {eyebrow}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight mb-5">
              {title}
            </h2>
            <p className="text-[#6B7280] leading-relaxed text-lg">
              {description}
            </p>
          </div>

          <div className={imagePosition === 'left' ? 'lg:order-1' : ''}>
            {image ? (
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src={image}
                  alt={imageAlt ?? title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={85}
                />
              </div>
            ) : (
              <ImagePlaceholder className="aspect-[4/5]" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
