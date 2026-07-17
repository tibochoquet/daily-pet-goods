import { Truck } from 'lucide-react'

export default function AnnouncementBar() {
  return (
    <div className="bg-[#2C4A3E] text-white text-sm text-center py-2.5 px-4">
      <span className="inline-flex items-center gap-2">
        <Truck size={13} className="flex-shrink-0" />
        <span>
          Gratis verzending op elke bestelling
        </span>
      </span>
    </div>
  )
}
