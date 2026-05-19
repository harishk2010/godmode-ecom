'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { RiDeleteBinLine, RiAddLine, RiSubtractLine, RiArrowRightLine, RiShoppingCartLine, RiPriceTag3Line } from 'react-icons/ri';
import ShopLayout from '@/components/layout/ShopLayout';
import { useCartStore } from '@/context/CartStore';
import { useAuthStore } from '@/context/AuthStore';
import { EmptyState, Button } from '@/components/ui';

export default function CartPage() {
  const { cart, fetchCart, updateQuantity, removeFromCart, clearCart, applyCoupon, removeCoupon, getSubtotal, getTotal, isLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => { if (isAuthenticated()) fetchCart(); }, []);

  const subtotal = getSubtotal();
  const total = getTotal();
  const shipping = subtotal > 500 ? 0 : subtotal === 0 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const discount = cart?.discount || 0;

  const handleCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput.trim());
    setCouponLoading(false);
    setCouponInput('');
  };

  if (!isAuthenticated()) {
    return (
      <ShopLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <EmptyState icon={RiShoppingCartLine} title="Please login to view your cart"
            action={<Link href="/login" className="btn-primary">Login</Link>} />
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white">Shopping Cart</h1>
          {cart?.items?.length > 0 && (
            <p className="text-white/40 mt-1">{cart.items.reduce((s, i) => s + i.quantity, 0)} items in your cart</p>
          )}
        </div>

        {!cart?.items?.length ? (
          <EmptyState icon={RiShoppingCartLine} title="Your cart is empty"
            description="Looks like you haven't added any products yet."
            action={<Link href="/products" className="btn-primary">Start Shopping</Link>} />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart.items.map((item) => (
                  <motion.div key={item.product?._id} layout exit={{ opacity: 0, x: -20 }}
                    className="glass rounded-2xl border border-white/[0.06] p-5 flex gap-5">
                    <Link href={`/products/${item.product?._id}`} className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5">
                        <Image src={item.product?.images?.[0]?.url || ''} alt={item.product?.name} width={96} height={96} className="w-full h-full object-cover" />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex justify-between gap-4">
                        <Link href={`/products/${item.product?._id}`}>
                          <h3 className="text-white font-medium text-sm leading-snug hover:text-orange-400 transition-colors line-clamp-2">
                            {item.product?.name}
                          </h3>
                        </Link>
                        <button onClick={() => removeFromCart(item.product?._id)}
                          className="flex-shrink-0 p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <RiDeleteBinLine />
                        </button>
                      </div>
                      <p className="text-white/40 text-xs">{item.product?.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center glass border border-white/10 rounded-xl overflow-hidden">
                          <button onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}
                            className="px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                            <RiSubtractLine className="text-sm" />
                          </button>
                          <span className="px-3 py-2 text-white text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}
                            className="px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                            <RiAddLine className="text-sm" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="price-tag font-bold text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                          <p className="price-tag text-xs text-white/40">₹{item.price.toLocaleString('en-IN')} each</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button onClick={clearCart} className="btn-ghost text-red-400 hover:text-red-300 text-sm w-full text-center py-3">
                Clear Cart
              </button>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              {/* Coupon */}
              <div className="glass rounded-2xl border border-white/[0.06] p-5">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <RiPriceTag3Line className="text-orange-400" /> Coupon Code
                </h3>
                {cart?.couponCode ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                    <span className="text-green-400 font-medium text-sm">{cart.couponCode} applied!</span>
                    <button onClick={removeCoupon} className="text-white/40 hover:text-white text-xs transition-colors">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" placeholder="Enter coupon code" value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleCoupon()}
                      className="input-field flex-1 text-sm py-2.5" />
                    <Button onClick={handleCoupon} loading={couponLoading} variant="primary" size="sm">Apply</Button>
                  </div>
                )}
                <p className="text-white/30 text-xs mt-2">Try: WELCOME10, SAVE20, FLAT500, GODMODE</p>
              </div>

              {/* Order Summary */}
              <div className="glass rounded-2xl border border-white/[0.06] p-5">
                <h3 className="font-semibold text-white mb-5">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Subtotal ({cart.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="price-tag">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400 font-medium' : 'price-tag'}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <span>GST (18%)</span>
                    <span className="price-tag">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Coupon Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg">
                    <span className="text-white">Total</span>
                    <span className="price-tag text-orange-400">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {subtotal < 500 && (
                  <p className="text-blue-400/80 text-xs mt-3 text-center">
                    Add ₹{(500 - subtotal).toLocaleString('en-IN')} more for free shipping!
                  </p>
                )}

                <Link href="/checkout" className="btn-primary w-full mt-5 flex items-center justify-center gap-2 py-3.5 text-base">
                  Proceed to Checkout <RiArrowRightLine />
                </Link>
                <Link href="/products" className="btn-secondary w-full mt-3 text-center block py-3 text-sm">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </ShopLayout>
  );
}
