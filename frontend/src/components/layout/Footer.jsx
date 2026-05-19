import Link from 'next/link';
import { RiFlashlightLine, RiGithubLine, RiTwitterXLine, RiInstagramLine } from 'react-icons/ri';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <RiFlashlightLine className="text-white text-xl" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                GOD<span className="text-gradient">MODE</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Experience next-level shopping. Curated products, unmatched quality, delivered to your door.
            </p>
            <div className="flex gap-3">
              {[RiGithubLine, RiTwitterXLine, RiInstagramLine].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all duration-200">
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-white">Shop</h4>
            <ul className="space-y-2.5">
              {['All Products', 'Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books'].map((item) => (
                <li key={item}>
                  <Link href={`/products${item !== 'All Products' ? `?category=${encodeURIComponent(item)}` : ''}`}
                    className="text-sm text-white/40 hover:text-orange-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-white">Account</h4>
            <ul className="space-y-2.5">
              {[['My Profile', '/profile'], ['My Orders', '/orders'], ['Wishlist', '/wishlist'], ['Cart', '/cart']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/40 hover:text-orange-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-white">Info</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Privacy Policy', 'Terms of Service', 'Contact Us', 'FAQ'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/40 hover:text-orange-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">© 2024 GOD MODE. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-white/20 text-xs">Built with</span>
            <span className="text-gradient text-xs font-semibold">Next.js + Node.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
