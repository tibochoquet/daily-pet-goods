'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ArrowUpRight, Check, Play, ChevronLeft as Prev, ChevronRight as Next } from 'lucide-react'
import type { Product } from '@/lib/types'

type MediaItem = { type: 'video'; src: string } | { type: 'image'; src: string }

export default function ProductDetailClient({ product }: { product: Product }) {
  const images = product.images && product.images.length > 0 ? product.images : [product.image]
  const media: MediaItem[] = [
    ...(product.video ? [{ type: 'video', src: product.video } as const] : []),
    ...images.map((src) => ({ type: 'image', src } as const)),
  ]
  const [activeIndex, setActiveIndex] = useState(0)
  const active = media[activeIndex]

  function prev() {
    setActiveIndex((i) => (i === 0 ? media.length - 1 : i - 1))
  }
  function next() {
    setActiveIndex((i) => (i === media.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">

      {/* Breadcrumb */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#2C4A3E] transition-colors mb-8"
      >
        <ChevronLeft size={14} />
        Terug naar producten
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        {/* Gallery */}
        <div className="space-y-3">
          {/* Main media */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F3EDE3]">
            {active.type === 'video' ? (
              <video
                key={active.src}
                src={active.src}
                poster={product.image}
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
                alt={product.name}
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
                  aria-label={item.type === 'video' ? 'Video' : `Foto ${i + 1}`}
                >
                  {item.type === 'video' ? (
                    <>
                      <Image src={product.image} alt="" fill className="object-cover" sizes="64px" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play size={18} className="text-white fill-white" />
                      </span>
                    </>
                  ) : (
                    <Image src={item.src} alt="" fill className="object-cover" sizes="64px" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] leading-snug mb-4">
            {product.name}
          </h1>

          <div className="mb-6">
            <span className="text-3xl font-bold text-[#2C4A3E]">
              €{product.price.toFixed(2)}
            </span>
            <p className="text-xs text-[#6B7280] font-medium mt-1 tracking-wide uppercase">
              Prijs en levering via Bol.com
            </p>
          </div>

          {/* Buy on Bol.com */}
          <a
            href={product.bolUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 mb-8 bg-[#C8745A] text-white hover:bg-[#A85E45]"
          >
            Bekijk op Bol.com
            <ArrowUpRight size={16} />
          </a>

          {/* Description */}
          <div className="mb-6">
            <p className="text-[#4B5563] leading-relaxed text-sm">{product.description}</p>
          </div>

          {/* Bullets */}
          {product.features && product.features.length > 0 && (
            <div className="mb-6">
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
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div>
              <h3 className="font-semibold text-[#1A1A1A] text-sm mb-3">Specificaties</h3>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specs).map(([key, val]) => (
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
