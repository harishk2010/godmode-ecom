'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RiShoppingBagLine, RiArrowRightLine, RiTimeLine, RiCheckLine, RiTruckLine, RiCloseLine } from 'react-icons/ri';
import ShopLayout from '@/components/layout/ShopLayout';
import { useAuthStore } from '@/context/AuthStore';
import { Badge, EmptyState, Skeleton } from '@/components/ui';
import { orderAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    variant: 'yellow',  icon: RiTimeLine },
  confirmed:  { label: 'Confirmed',  variant: 'blue',    icon: RiCheckLine },
  processing: { label: 'Processing', variant: 'purple',  icon: RiTimeLine },
  shipped:    { label: 'Shipped',    variant: 'orange',  icon: RiTruckLine },
  delivered:  { label: 'Delivered',  variant: 'green',   icon: RiCheckLine },
  cancelled:  { label: 'Cancelled',  variant: 'red',     icon: RiCloseLine },
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    orderAPI.getMyOrders({ page, limit: 10 })
      .then(({ data }) => { setOrders(data.data); setPagination(data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <ShopLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display font-bold text-3xl text-white mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full" />)}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState icon={RiShoppingBagLine} title="No orders yet"
            description="Your order history will appear here."
            action={<Link href="/products" className="btn-primary">Start Shopping</Link>} />
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = status.icon;
              return (
                <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/orders/${order._id}`} className="block glass rounded-2xl border border-white/[0.06] hover:border-white/10 transition-all p-5 group">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-white font-semibold">#{order.orderNumber}</p>
                        <p className="text-white/40 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={status.variant} className="flex items-center gap-1.5">
                          <StatusIcon className="text-xs" /> {status.label}
                        </Badge>
                        <span className="price-tag font-bold text-orange-400">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                        <RiArrowRightLine className="text-white/30 group-hover:text-white/60 transition-colors" />
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="flex gap-2 overflow-hidden">
                      {order.items.slice(0, 4).map((item, j) => (
                        <div key={j} className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-white/40 text-xs flex-shrink-0">
                          +{order.items.length - 4}
                        </div>
                      )}
                      <div className="ml-2 flex flex-col justify-center">
                        <p className="text-white/60 text-sm">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                        <p className="text-white/30 text-xs capitalize">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </ShopLayout>
  );
}
