import { Camera } from 'lucide-react'

interface ImagePlaceholderProps {
  className?: string
  label?: string
}

/**
 * Elegant stand-in for a lifestyle photo that has not been generated yet.
 * Always paired with an IMAGE BRIEF comment directly above its usage,
 * describing exactly what should be generated (see Nano Banana briefs
 * throughout the category pages). Swap this component for a real
 * next/image once the photo exists.
 */
export default function ImagePlaceholder({ className = '', label = 'Fotografie in productie' }: ImagePlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F3EDE3] via-[#EAE1CE] to-[#DDCEAF] flex items-center justify-center ${className}`}
    >
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #2C4A3E 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }} />
      <div className="relative text-center px-6">
        <Camera className="mx-auto mb-3 text-[#B0A183]" size={26} strokeWidth={1.5} />
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#A8987A]">{label}</p>
      </div>
    </div>
  )
}
