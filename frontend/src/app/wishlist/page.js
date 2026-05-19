'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RiHeartLine } from 'react-icons/ri';
import Link from 'next/link';
import ShopLayout from '@/components/layout/ShopLayout';
import ProductCard from '@/components/products/ProductCard';
import { useAuthStore } from '@/context/AuthStore';
import { EmptyState, Skeleton } from '@/components/ui';
import { wishlistAPI } from '@/lib/api';

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    wishlistAPI.get()
      .then(({ data }) => setWishlist(data.data.wishlist))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <ShopLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white">My Wishlist</h1>
          {wishlist.length > 0 && <p className="text-white/40 mt-1">{wishlist.length} saved items</p>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-2xl" />)}
          </div>
        ) : wishlist.length === 0 ? (
          <EmptyState
            icon={RiHeartLine}
            title="Your wishlist is empty"
            description="Save products you love by clicking the heart icon."
            action={<Link href="/products" className="btn-primary">Browse Products</Link>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </ShopLayout>
  );
}
