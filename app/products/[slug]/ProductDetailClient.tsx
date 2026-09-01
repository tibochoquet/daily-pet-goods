'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ShoppingCart, Check, Play, Truck, RotateCcw, MessageCircle, ChevronLeft as Prev, ChevronRight as Next } from 'lucide-react'
import type { Product } from '@/lib/types'
import { useCart } from '@/components/cart/CartProvider'

type MediaItem = { type: 'video'; src: string } | { type: 'image'; src: string }

export default function ProductDetailClient({ product }: { product: Product }) {
  const [variantIndex, setVariantIndex] = useState(0)
  const variant = product.variants[variantIndex]
  const hasVariants = product.variants.length > 1
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const inStock = variant.inStock ?? true

  function handleAdd() {
    if (!inStock) return
    addItem({
      id: variant.id,
      name: product.name,
      variantLabel: variant.label,
      price: variant.price,
      image: variant.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const images = variant.images && variant.images.length > 0 ? variant.images : [variant.image]
  const media: MediaItem[] = [
    ...(variant.video ? [{ type: 'video', src: variant.video } as const] : []),
    ...images.map((src) => ({ type: 'image', src } as const)),
  ]
  const [activeIndex, setActiveIndex] = useState(0)
  const active = media[Math.min(activeIndex, media.length - 1)]

  function selectVariant(i: number) {
    setVariantIndex(i)
    setActiveIndex(0)
    setAdded(false)
  }

  function prev() {
    setActiveIndex((i) => (i === 0 ? media.length - 1 : i - 1))
  }
  function next() {
    setActiveIndex((i) => (i === media.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">

      {/* Breadcrumb */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#2C4A3E] transition-colors mb-10"
      >
        <ChevronLeft size={14} />
        Terug naar producten
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* Gallery */}
        <div className="space-y-3">
          {/* Main media */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F3EDE3]">
            {active.type === 'video' ? (
              <video
                key={active.src}
                src={active.src}
                poster={variant.image}
                className="absolute inset-0 w-full h-full object-cover"
                controls
                loop
                muted
                playsInline
                autoPlay
              />
            ) : (
              <Image
                src={active.src}
                alt={`${product.name} - ${variant.label}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
            {media.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                  aria-label="Vorige"
                >
                  <Prev size={16} className="text-[#1A1A1A]" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                  aria-label="Volgende"
                >
                  <Next size={16} className="text-[#1A1A1A]" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {media.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {media.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeIndex
                      ? 'border-[#2C4A3E]'
                      : 'border-[#E8E2D9] hover:border-[#C8745A]'
                  }`}
                >
                  {item.type === 'video' ? (
                    <>
                      <Image src={variant.image} alt={`Video van ${product.name} - ${variant.label}`} fill className="object-cover" sizes="64px" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play size={18} className="text-white fill-white" />
                      </span>
                    </>
                  ) : (
                    <Image
                      src={item.src}
                      alt={`${product.name} - ${variant.label} - foto ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#C8745A] mb-3">
            Daily Pet Goods
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] leading-tight mb-4">
            {product.name}
          </h1>
          <p className="text-[#6B7280] leading-relaxed mb-8">{product.shortDescription}</p>

          <div className="mb-8">
            <span className="text-3xl font-semibold text-[#1A1A1A]">
              €{variant.price.toFixed(2)}
            </span>
            <span className="text-sm text-[#9CA3AF] ml-2">incl. verzending</span>
          </div>

          {/* Variant selector */}
          {hasVariants && (
            <div className="mb-8">
              <p className="text-sm font-medium text-[#1A1A1A] mb-3">
                Kies een optie
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => selectVariant(i)}
                    className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${
                      i === variantIndex
                        ? 'border-[#2C4A3E] bg-[#2C4A3E] text-white'
                        : 'border-[#E8E2D9] text-[#1A1A1A] hover:border-[#2C4A3E]'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            disabled={!inStock}
            className={`flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 mb-10 ${
              !inStock
                ? 'bg-[#E8E2D9] text-[#9CA3AF] cursor-not-allowed'
                : added
                  ? 'bg-[#2C4A3E] text-white'
                  : 'bg-[#C8745A] text-white hover:bg-[#A85E45]'
            }`}
          >
            {!inStock ? (
              'Tijdelijk uitverkocht'
            ) : added ? (
              <>
                <Check size={16} />
                Toegevoegd aan winkelwagen
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                In winkelwagen
              </>
            )}
          </button>

          {/* Trust signals - delivery, returns, payment, human contact.
              Belongs here, on the product page, not only at checkout: a
              first-time visitor deciding whether to trust an unfamiliar
              shop over a marketplace needs this before adding to cart. */}
          <div className="mb-10 space-y-3 border-t border-b border-[#E8E2D9] py-6">
            <div className="flex items-start gap-2.5 text-sm text-[#4B5563]">
              <Truck size={16} className="mt-0.5 shrink-0 text-[#2C4A3E]" />
              <span>Gratis verzending via DHL binnen NL &amp; BE, verzonden binnen 1-2 werkdagen.</span>
            </div>
            <div className="flex items-start gap-2.5 text-sm text-[#4B5563]">
              <RotateCcw size={16} className="mt-0.5 shrink-0 text-[#2C4A3E]" />
              <span>
                14 dagen bedenktijd.{' '}
                <Link href="/retourneren" className="text-[#2C4A3E] hover:underline">
                  Bekijk ons retourbeleid
                </Link>
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-sm text-[#4B5563]">
              <MessageCircle size={16} className="mt-0.5 shrink-0 text-[#2C4A3E]" />
              <span>
                Vraag over dit product?{' '}
                <Link href="/contact" className="text-[#2C4A3E] hover:underline">
                  Neem contact op
                </Link>
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] pt-1">
              Betalen via iDEAL, creditcard, Bancontact, Klarna en meer.
            </p>
          </div>

          {/* Description */}
          <div className="mb-8 pt-8 border-t border-[#E8E2D9]">
            <p className="text-[#4B5563] leading-relaxed text-sm">{product.description}</p>
          </div>

          {/* Bullets */}
          {product.features && product.features.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-[#1A1A1A] text-sm mb-3">Voordelen</h3>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#4B5563]">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-[#2C4A3E]/10 flex items-center justify-center flex-shrink-0">
                      <Check size={9} className="text-[#2C4A3E]" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specs */}
          {variant.specs && Object.keys(variant.specs).length > 0 && (
            <div>
              <h3 className="font-semibold text-[#1A1A1A] text-sm mb-3">Specificaties</h3>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(variant.specs).map(([key, val]) => (
                    <tr key={key} className="border-t border-[#F3EDE3]">
                      <td className="py-2.5 pr-4 text-[#6B7280] font-medium w-1/2">{key}</td>
                      <td className="py-2.5 text-[#1A1A1A]">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
