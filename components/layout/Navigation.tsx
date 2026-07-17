'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react'

const shopLinks = [
  { href: '/shop', label: 'Alle producten' },
  { href: '/dog-bowls', label: 'Hondenbakken' },
  { href: '/cat-bowls', label: 'Kattenbakken' },
  { href: '/dog-beds', label: 'Hondenmanden' },
  { href: '/dog-travel', label: 'Onderweg met je hond' },
  { href: '/dog-pools', label: 'Zwembaden & koelmatten hond' },
  { href: '/cat-cooling', label: 'Koelmatten voor katten' },
]

const navLinks = [
  { href: '/about', label: 'Over ons' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#FAFAF7]/95 backdrop-blur-sm border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/assets/logo/icon-twotone-transparent.png"
              alt=""
              width={36}
              height={36}
              className="h-8 w-8 md:h-9 md:w-9 object-contain"
              priority
            />
            <span className="text-xl md:text-2xl font-serif font-semibold text-[#2C4A3E] tracking-tight">
              Daily Pet Goods
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Shop dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-[#1A1A1A] hover:text-[#2C4A3E] transition-colors">
                Shop
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {shopOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                  <div className="bg-white border border-[#E8E2D9] rounded-xl shadow-lg py-2 w-56">
                    {shopLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F3EDE3] hover:text-[#2C4A3E] transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#1A1A1A] hover:text-[#2C4A3E] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="hidden md:inline-flex items-center gap-2 bg-[#2C4A3E] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#3D6456] transition-colors"
            >
              <ShoppingBag size={14} />
              Nu shoppen
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-[#1A1A1A] hover:text-[#2C4A3E]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu openen/sluiten"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E8E2D9] bg-white">
          <div className="px-4 py-4 space-y-1">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-3 py-2">
              Shop
            </p>
            {shopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-sm font-medium text-[#1A1A1A] hover:bg-[#F3EDE3] hover:text-[#2C4A3E] rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#E8E2D9] my-2" />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-sm font-medium text-[#1A1A1A] hover:bg-[#F3EDE3] hover:text-[#2C4A3E] rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/shop"
                className="block w-full text-center bg-[#2C4A3E] text-white text-sm font-medium px-4 py-3 rounded-xl hover:bg-[#3D6456] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Bekijk alle producten
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
