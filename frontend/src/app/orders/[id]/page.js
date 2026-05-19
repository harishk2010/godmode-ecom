'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RiCheckLine, RiTruckLine, RiTimeLine, RiCloseLine, RiArrowLeftLine } from 'react-icons/ri';
import ShopLayout from '@/components/layout/ShopLayout';
import { orderAPI } from '@/lib/api';
import { Badge, Skeleton, Button } from '@/components/ui';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/context/AuthStore';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const STATUS_CONFIG = {
  pending:    { label: 'Pending',    variant: 'yellow' },
  confirmed:  { label: 'Confirmed',  variant: 'blue' },
  processing: { label: 'Processing', variant: 'purple' },
  shipped:    { label: 'Shipped',    variant: 'orange' },
  delivered:  { label: 'Delivered',  variant: 'green' },
  cancelled:  { label: 'Cancelled',  variant: 'red' },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const { isAuthenticated } = useAuthStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    orderAPI.getOne(id)
      .then(({ data }) => setOrder(data.data.order))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const { data } = await orderAPI.cancel(id);
      setOrder(data.data.order);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    } finally { setCancelling(false); }
  };

  if (loading) return (
    <ShopLayout><div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Skeleton className="h-10 w-48" /><Skeleton className="h-64 w-full" />
    </div></ShopLayout>
  );
  if (!order) return null;

  const statusIndex = STATUS_STEPS.indexOf(order.status);
  const cfg = STATUS_CONFIG[order.status];

  return (
    <ShopLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Success Banner */}
        {isSuccess && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/30 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="font-display font-bold text-xl text-white">Order Placed Successfully!</h2>
            <p className="text-white/60 text-sm mt-1">Thank you for shopping with GOD MODE. Your order is being processed.</p>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm mb-2">
              <RiArrowLeftLine /> Back
            </button>
            <h1 className="font-display font-bold text-2xl text-white">Order #{order.orderNumber}</h1>
            <p className="text-white/40 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <Badge variant={cfg?.variant}>{cfg?.label}</Badge>
        </div>

        {/* Status Tracker */}
        {order.status !== 'cancelled' && (
          <div className="glass rounded-2xl border border-white/[0.06] p-6 mb-6">
            <h3 className="font-semibold text-white mb-6">Order Status</h3>
            <div className="flex items-center">
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`flex flex-col items-center gap-2 ${i <= statusIndex ? 'text-white' : 'text-white/20'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${i < statusIndex ? 'bg-green-500' : i === statusIndex ? 'bg-orange-500 shadow-glow-sm' : 'bg-white/10'}`}>
                      {i < statusIndex ? <RiCheckLine className="text-white text-sm" /> :
                        i === statusIndex ? <div className="w-3 h-3 rounded-full bg-white animate-pulse" /> :
                        <div className="w-2 h-2 rounded-full bg-white/20" />}
                    </div>
                    <span className="text-xs capitalize hidden sm:block">{s}</span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 ${i < statusIndex ? 'bg-green-500/50' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 space-y-4">
            <div className="glass rounded-2xl border border-white/[0.06] p-5">
              <h3 className="font-semibold text-white mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-4 py-3 border-b border-white/[0.06] last:border-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm line-clamp-2">{item.name}</p>
                      <p className="text-white/40 text-xs mt-1">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <p className="price-tag text-white font-semibold text-sm flex-shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="glass rounded-2xl border border-white/[0.06] p-5">
              <h3 className="font-semibold text-white mb-3">Shipping Address</h3>
              <div className="text-white/60 text-sm space-y-0.5">
                <p className="text-white font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                <p>{order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="glass rounded-2xl border border-white/[0.06] p-5">
              <h3 className="font-semibold text-white mb-4">Price Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/60"><span>Items Price</span><span className="price-tag">₹{order.itemsPrice.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-white/60"><span>Shipping</span><span className={order.shippingPrice === 0 ? 'text-green-400' : 'price-tag'}>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
                <div className="flex justify-between text-white/60"><span>Tax</span><span className="price-tag">₹{order.taxPrice.toLocaleString('en-IN')}</span></div>
                {order.discountPrice > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-₹{order.discountPrice.toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between text-white font-bold border-t border-white/10 pt-2"><span>Total</span><span className="price-tag text-orange-400">₹{order.totalPrice.toLocaleString('en-IN')}</span></div>
              </div>
            </div>

            <div className="glass rounded-2xl border border-white/[0.06] p-5">
              <h3 className="font-semibold text-white mb-3">Payment</h3>
              <p className="text-white/60 text-sm capitalize">{order.paymentMethod}</p>
              <p className={`text-sm font-medium mt-1 ${order.isPaid ? 'text-green-400' : 'text-yellow-400'}`}>
                {order.isPaid ? '✓ Paid' : '⏳ Payment Pending'}
              </p>
            </div>

            {['pending', 'confirmed'].includes(order.status) && (
              <Button onClick={handleCancel} loading={cancelling} variant="danger" className="w-full">
                Cancel Order
              </Button>
            )}

            <Link href="/products" className="btn-secondary w-full text-center block py-2.5 text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
