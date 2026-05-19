'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiShoppingCartLine, RiSearchLine, RiMenuLine, RiCloseLine,
  RiUser3Line, RiHeartLine, RiSettings3Line, RiLogoutBoxLine,
  RiShieldLine, RiFlashlightLine
} from 'react-icons/ri';
import { useAuthStore } from '@/context/AuthStore';
import { useCartStore } from '@/context/CartStore';

const navLinks = [
  { href: '/products', label: 'Shop' },
  { href: '/products?category=Electronics', label: 'Electronics' },
  { href: '/products?category=Fashion', label: 'Fashion' },
  { href: '/products?category=Home+%26+Living', label: 'Home' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { getCartCount, setOpen: setCartOpen } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    router.push('/');
  };

  const cartCount = getCartCount();
  const auth = isAuthenticated();

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-strong shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
                  <RiFlashlightLine className="text-white text-xl" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-orange-500/20 blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                GOD<span className="text-gradient">MODE</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'text-orange-400 bg-orange-500/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <RiSearchLine className="text-xl" />
              </button>

              {/* Cart */}
              {auth && (
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative p-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <RiShoppingCartLine className="text-xl" />
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </button>
              )}

              {/* Wishlist */}
              {auth && (
                <Link
                  href="/wishlist"
                  className="p-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <RiHeartLine className="text-xl" />
                </Link>
              )}

              {/* Profile / Auth */}
              {auth ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl glass border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <span className="text-sm text-white/80 font-medium hidden sm:block">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 glass-strong rounded-2xl shadow-2xl overflow-hidden border border-white/10"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-semibold text-white">{user?.name}</p>
                          <p className="text-xs text-white/40 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                            <RiUser3Line /> Profile
                          </Link>
                          <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                            <RiSettings3Line /> Orders
                          </Link>
                          {user?.role === 'admin' && (
                            <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-orange-400 hover:text-orange-300 hover:bg-orange-500/5 transition-colors">
                              <RiShieldLine /> Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                          >
                            <RiLogoutBoxLine /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="btn-ghost text-sm">Login</Link>
                  <Link href="/register" className="btn-primary text-sm py-2 px-4">Sign up</Link>
                </div>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                {mobileOpen ? <RiCloseLine className="text-xl" /> : <RiMenuLine className="text-xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden glass-strong border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="relative w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch}>
                <div className="glass-strong rounded-2xl border border-white/20 flex items-center gap-4 px-6 py-4">
                  <RiSearchLine className="text-2xl text-orange-400 flex-shrink-0" />
                  <input
                    ref={searchRef}
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands, categories..."
                    className="flex-1 bg-transparent text-white text-lg placeholder-white/30 outline-none"
                  />
                  {searchQuery && (
                    <button type="submit" className="btn-primary py-2 px-4 text-sm">Search</button>
                  )}
                </div>
              </form>
              <p className="text-center text-white/30 text-sm mt-3">Press Enter to search · Esc to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
