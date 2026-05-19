'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  RiArrowRightLine, RiFlashlightLine, RiShieldCheckLine,
  RiTruckLine, RiCustomerService2Line, RiStarFill,
  RiArrowRightUpLine
} from 'react-icons/ri';
import ShopLayout from '@/components/layout/ShopLayout';
import ProductCard from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/ui';
import { productAPI } from '@/lib/api';

const categories = [
  { name: 'Electronics', emoji: '⚡', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/20' },
  { name: 'Fashion', emoji: '👗', color: 'from-pink-500/20 to-purple-500/20', border: 'border-pink-500/20' },
  { name: 'Home & Living', emoji: '🏠', color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/20' },
  { name: 'Sports', emoji: '🏃', color: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/20' },
  { name: 'Books', emoji: '📚', color: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-500/20' },
  { name: 'Beauty', emoji: '✨', color: 'from-rose-500/20 to-pink-500/20', border: 'border-rose-500/20' },
];

const features = [
  { icon: RiTruckLine, title: 'Free Shipping', desc: 'On orders above ₹500', color: 'text-blue-400' },
  { icon: RiShieldCheckLine, title: 'Secure Payment', desc: '100% protected checkout', color: 'text-green-400' },
  { icon: RiCustomerService2Line, title: '24/7 Support', desc: 'Dedicated customer care', color: 'text-purple-400' },
  { icon: RiStarFill, title: 'Best Quality', desc: 'Curated premium products', color: 'text-orange-400' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.getFeatured()
      .then(({ data }) => setFeatured(data.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <ShopLayout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M0%200h40v40H0z%22/%3E%3Cpath%20d%3D%22M0%200h1v40H0zM39%200h1v40h-1zM0%200h40v1H0zM0%2039h40v1H0z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-orange-500/30 text-sm">
                  <RiFlashlightLine className="text-orange-400" />
                  <span className="text-white/70">New arrivals every week</span>
                </div>

                <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-[0.95] tracking-tight">
                  Shop in
                  <br />
                  <span className="text-gradient">God Mode.</span>
                </h1>

                <p className="text-white/50 text-lg leading-relaxed max-w-lg">
                  Discover curated products across electronics, fashion, home essentials and more.
                  Premium quality, unbeatable prices.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/products" className="btn-primary text-base py-4 px-8 flex items-center gap-2">
                    Shop Now
                    <RiArrowRightLine />
                  </Link>
                  <Link href="/products?featured=true" className="btn-secondary text-base py-4 px-8">
                    View Featured
                  </Link>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="grid grid-cols-3 gap-6 pt-4"
              >
                {[
                  { value: '10K+', label: 'Products' },
                  { value: '50K+', label: 'Customers' },
                  { value: '4.9★', label: 'Rating' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="font-display font-bold text-2xl text-gradient">{stat.value}</div>
                    <div className="text-white/40 text-sm">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right – floating product cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative h-[500px]">
                {featured.slice(0, 3).map((product, i) => {
                  const positions = [
                    'top-0 right-8 w-56',
                    'top-1/3 left-0 w-52',
                    'bottom-0 right-0 w-48',
                  ];
                  const delays = [0, 0.5, 1];
                  return (
                    <motion.div
                      key={product._id}
                      className={`absolute ${positions[i]} glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl`}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, delay: delays[i], repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={product.images?.[0]?.url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-white text-xs font-semibold line-clamp-1">{product.name}</p>
                        <p className="text-orange-400 text-xs font-bold price-tag mt-1">
                          ₹{Math.round(product.price - product.price * product.discount / 100).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl glass border border-white/[0.06] hover:border-white/10 transition-all"
              >
                <div className={`text-3xl ${feature.color}`}><feature.icon /></div>
                <div>
                  <div className="text-white font-semibold text-sm">{feature.title}</div>
                  <div className="text-white/40 text-xs mt-0.5">{feature.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-orange-400 text-sm font-medium uppercase tracking-widest mb-2">Browse</p>
              <h2 className="section-title">Shop by Category</h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-2 text-white/50 hover:text-orange-400 transition-colors text-sm font-medium">
              View All <RiArrowRightUpLine />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className={`group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${cat.color} border ${cat.border} hover:scale-105 transition-all duration-300 cursor-pointer`}
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.emoji}</span>
                  <span className="text-white/80 text-sm font-medium text-center leading-tight">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-orange-400 text-sm font-medium uppercase tracking-widest mb-2">Handpicked</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-2 text-white/50 hover:text-orange-400 transition-colors text-sm font-medium">
              Shop All <RiArrowRightLine />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/products" className="btn-secondary text-base py-4 px-10">
              Explore All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border-gradient p-12 text-center">
            <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 badge-orange text-sm">
                <RiFlashlightLine /> Limited Time Offer
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
                Use code <span className="text-gradient">GODMODE</span>
              </h2>
              <p className="text-white/50 text-lg max-w-md mx-auto">
                Get 15% off on your first order. No minimum order value required.
              </p>
              <Link href="/products" className="btn-primary text-lg py-4 px-10 inline-flex">
                Shop Now & Save
              </Link>
            </div>
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}
