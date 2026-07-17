import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin } from 'lucide-react'

const shopLinks = [
  { href: '/dog-bowls', label: 'Hondenbakken' },
  { href: '/cat-bowls', label: 'Kattenbakken' },
  { href: '/dog-beds', label: 'Hondenmanden' },
  { href: '/dog-travel', label: 'Onderweg met je hond' },
  { href: '/dog-pools', label: 'Zwembaden & koelmatten hond' },
  { href: '/cat-cooling', label: 'Koelmatten voor katten' },
]

const companyLinks = [
  { href: '/about', label: 'Over ons' },
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
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <Image
                src="/assets/logo/icon-cream-transparent.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-serif font-semibold text-white">Daily Pet Goods</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Dagelijkse essentials voor de huisdieren waar je van houdt. Premium, zorgvuldig geselecteerde producten, rechtstreeks bij jou thuisbezorgd.
            </p>
            <div className="flex gap-3">
              <a
                href="mailto:lifegoods.daily@gmail.com"
                aria-label="E-mail"
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
                  Alle producten
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">Daily Pet Goods</h3>
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
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">Neem contact op</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <Mail size={14} className="mt-0.5 shrink-0 text-white/40" />
                <a href="mailto:lifegoods.daily@gmail.com" className="hover:text-white transition-colors">
                  lifegoods.daily@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <MapPin size={14} className="mt-0.5 shrink-0 text-white/40" />
                <span>Nederland</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-white/50 mb-1">Bestellen</p>
              <p className="text-sm font-medium text-white">Rechtstreeks via onze website</p>
              <p className="text-xs text-white/50 mt-1">Gratis verzending</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Daily Pet Goods. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Privacybeleid
            </Link>
            <Link href="/terms" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Voorwaarden
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
