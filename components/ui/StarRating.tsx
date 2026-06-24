import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  reviewCount?: number
  size?: number
}

export default function StarRating({ rating, reviewCount, size = 14 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < Math.floor(rating) ? 'fill-[#C8745A] text-[#C8745A]' : 'fill-[#E8E2D9] text-[#E8E2D9]'}
          />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-[#6B7280]">
          {rating.toFixed(1)} ({reviewCount})
        </span>
      )}
    </div>
  )
}
