'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLine, RiShoppingCartLine, RiArrowRightLine, RiDeleteBinLine, RiAddLine, RiSubtractLine } from 'react-icons/ri';
import { useCartStore } from '@/context/CartStore';
import { useAuthStore } from '@/context/AuthStore';

export default function CartDrawer() {
  const { cart, isOpen, setOpen, fetchCart, updateQuantity, removeFromCart, getSubtotal, getTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isOpen && isAuthenticated()) fetchCart();
  }, [isOpen]);

  const subtotal = getSubtotal();
  const total = getTotal();
  const shipping = subtotal > 500 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const discount = cart?.discount || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col glass-strong border-l border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <RiShoppingCartLine className="text-2xl text-orange-400" />
                <h2 className="font-display font-bold text-xl text-white">Your Cart</h2>
                {cart?.items?.length > 0 && (
                  <span className="badge-orange">{cart.items.length}</span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {!cart?.items?.length ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center">
                    <RiShoppingCartLine className="text-4xl text-white/20" />
                  </div>
                  <div>
                    <p className="text-white/60 font-medium">Your cart is empty</p>
                    <p className="text-white/30 text-sm mt-1">Add some products to get started</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="btn-primary"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.items.map((item) => (
                  <motion.div
                    key={item.product?._id || item._id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-3 rounded-2xl bg-white/5 border border-white/[0.06]"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      <Image
                        src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                        alt={item.product?.name || 'Product'}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium leading-tight line-clamp-2">
                        {item.product?.name}
                      </p>
                      <p className="text-orange-400 font-bold text-sm price-tag mt-1">
                        ₹{item.price?.toLocaleString('en-IN')}
                      </p>

                      {/* Qty controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
                        >
                          <RiSubtractLine className="text-sm" />
                        </button>
                        <span className="w-8 text-center text-white text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
                        >
                          <RiAddLine className="text-sm" />
                        </button>

                        <button
                          onClick={() => removeFromCart(item.product?._id)}
                          className="ml-auto p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <RiDeleteBinLine />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart?.items?.length > 0 && (
              <div className="px-6 py-5 border-t border-white/10 space-y-4">
                {/* Price breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Subtotal</span>
                    <span className="price-tag">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400' : 'price-tag'}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <span>GST (18%)</span>
                    <span className="price-tag">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Coupon ({cart.couponCode})</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold text-lg border-t border-white/10 pt-2">
                    <span>Total</span>
                    <span className="price-tag text-orange-400">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full text-center flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <RiArrowRightLine />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="btn-secondary w-full text-center block text-center py-2.5"
                >
                  View Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
