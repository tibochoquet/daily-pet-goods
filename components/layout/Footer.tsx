import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'

const shopLinks = [
  { href: '/dog-bowls', label: 'Dog Bowls' },
  { href: '/cat-bowls', label: 'Cat Bowls' },
  { href: '/dog-beds', label: 'Dog Beds' },
  { href: '/dog-travel', label: 'Dog Travel' },
  { href: '/dog-pools', label: 'Dog Pools' },
]

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="bg-[#1F3329] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main footer */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-serif font-semibold text-white">Daily Pet Goods</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Everyday essentials for the pets you love. Premium, thoughtfully selected products delivered to your door via Bol.com.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                {/* Instagram icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                {/* Facebook icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a
                href="mailto:hello@dailypetgoods.nl"
                aria-label="Email"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" className="text-sm text-white/70 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">Company</h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <Mail size={14} className="mt-0.5 shrink-0 text-white/40" />
                <a href="mailto:hello@dailypetgoods.nl" className="hover:text-white transition-colors">
                  hello@dailypetgoods.nl
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <MapPin size={14} className="mt-0.5 shrink-0 text-white/40" />
                <span>Netherlands</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-white/50 mb-1">Buy via</p>
              <p className="text-sm font-medium text-white">Bol.com</p>
              <p className="text-xs text-white/50 mt-1">Fast delivery · Secure payments</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Daily Pet Goods. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
