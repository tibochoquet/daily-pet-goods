interface BadgeProps {
  variant: 'bestseller' | 'new' | 'sale' | 'betaald' | 'retour-aangemeld' | 'retour-onderweg' | 'retour-ontvangen' | 'terugbetaald'
}

const config = {
  bestseller: { label: 'Bestseller', className: 'bg-[#2C4A3E] text-white' },
  new: { label: 'Nieuw', className: 'bg-[#C8745A] text-white' },
  sale: { label: 'Aanbieding', className: 'bg-yellow-500 text-white' },
  // Order/return states - only ones we can actually know without a
  // carrier integration (see lib/orders.ts). No "verzonden"/"onderweg"
  // shipping variant on purpose - there's no tracking data to back it.
  betaald: { label: 'Betaald', className: 'bg-[#2C4A3E]/10 text-[#2C4A3E]' },
  'retour-aangemeld': { label: 'Retour aangemeld', className: 'bg-[#C8745A]/10 text-[#C8745A]' },
  'retour-onderweg': { label: 'Retour onderweg', className: 'bg-[#C8745A]/10 text-[#C8745A]' },
  'retour-ontvangen': { label: 'Retour ontvangen', className: 'bg-[#C8745A]/10 text-[#C8745A]' },
  terugbetaald: { label: 'Terugbetaald', className: 'bg-[#2C4A3E]/10 text-[#2C4A3E]' },
}

export default function Badge({ variant }: BadgeProps) {
  const { label, className } = config[variant]
  return (
    <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  )
}
