'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RiHeartLine, RiHeartFill, RiShoppingCartLine, RiStarFill, RiEyeLine } from 'react-icons/ri';
import { useCartStore } from '@/context/CartStore';
import { useAuthStore } from '@/context/AuthStore';
import { wishlistAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, setOpen } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const discountedPrice = product.discount > 0
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      toast.error('Please login to add to cart');
      return;
    }
    setAdding(true);
    await addToCart(product._id);
    setAdding(false);
    setOpen(true);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      toast.error('Please login to use wishlist');
      return;
    }
    try {
      if (wishlisted) {
        await wishlistAPI.remove(product._id);
        setWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistAPI.add(product._id);
        setWishlisted(true);
        toast.success('Added to wishlist ❤️');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/products/${product._id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-orange-500/30 transition-all duration-300 hover-lift card-glow">

          {/* Image */}
          <div className="product-image-container relative aspect-square overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02]">
            <Image
              src={product.images?.[0]?.url || `https://via.placeholder.com/400x400/1a1a2e/ffffff?text=${encodeURIComponent(product.name)}`}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Quick actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <button
                onClick={handleWishlist}
                className="w-9 h-9 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-orange-500 transition-all duration-200"
              >
                {wishlisted ? <RiHeartFill className="text-orange-400" /> : <RiHeartLine />}
              </button>
              <Link
                href={`/products/${product._id}`}
                onClick={(e) => e.stopPropagation()}
                className="w-9 h-9 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              >
                <RiEyeLine />
              </Link>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.discount > 0 && (
                <span className="px-2 py-1 rounded-lg bg-orange-500 text-white text-xs font-bold">
                  -{product.discount}%
                </span>
              )}
              {product.stock === 0 && (
                <span className="px-2 py-1 rounded-lg bg-red-500/80 text-white text-xs font-bold">
                  Out of Stock
                </span>
              )}
              {product.isFeatured && (
                <span className="px-2 py-1 rounded-lg bg-purple-500/80 text-white text-xs font-bold">
                  Featured
                </span>
              )}
            </div>

            {/* Add to Cart (bottom overlay) */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {adding ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <RiShoppingCartLine />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            {/* Category & Brand */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-orange-400/80 font-medium uppercase tracking-wider">{product.category}</span>
              {product.brand && (
                <span className="text-xs text-white/30">{product.brand}</span>
              )}
            </div>

            {/* Name */}
            <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-orange-100 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <RiStarFill
                    key={star}
                    className={`text-xs ${star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-white/10'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-white/40">({product.numReviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 pt-1">
              <span className="price-tag text-lg font-bold text-white">
                ₹{Math.round(discountedPrice).toLocaleString('en-IN')}
              </span>
              {product.discount > 0 && (
                <span className="price-tag text-sm text-white/30 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
