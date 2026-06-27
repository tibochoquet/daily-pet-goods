import { Tag } from 'lucide-react'

export default function AnnouncementBar() {
  return (
    <div className="bg-[#2C4A3E] text-white text-sm text-center py-2.5 px-4">
      <span className="inline-flex items-center gap-2">
        <Tag size={13} className="flex-shrink-0" />
        <span>
          <strong>10% off</strong> your entire order — use code{' '}
          <span className="font-mono font-bold tracking-wide bg-white/15 px-1.5 py-0.5 rounded">
            DAILY10
          </span>{' '}
          at checkout
        </span>
      </span>
    </div>
  )
}
