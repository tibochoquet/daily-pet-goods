interface BadgeProps {
  variant: 'bestseller' | 'new' | 'sale'
}

const config = {
  bestseller: { label: 'Bestseller', className: 'bg-[#2C4A3E] text-white' },
  new: { label: 'New', className: 'bg-[#C8745A] text-white' },
  sale: { label: 'Sale', className: 'bg-yellow-500 text-white' },
}

export default function Badge({ variant }: BadgeProps) {
  const { label, className } = config[variant]
  return (
    <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  )
}
