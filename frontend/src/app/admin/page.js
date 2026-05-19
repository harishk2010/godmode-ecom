'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  RiShoppingBagLine,
  RiUser3Line,
  RiStoreLine,
  RiMoneyDollarCircleLine,
  RiFlashlightLine,
  RiArrowRightLine,
  RiFileListLine,
  RiPriceTag3Line,
  RiLogoutBoxLine,
} from 'react-icons/ri';
import { adminAPI } from '@/lib/api';
import { useAuthStore } from '@/context/AuthStore';
import { Skeleton, Badge } from '@/components/ui';

const STATUS_COLORS = {
  pending: 'yellow', confirmed: 'blue', processing: 'purple',
  shipped: 'orange', delivered: 'green', cancelled: 'red'
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) { router.push('/'); return; }
    adminAPI.getDashboard()
      .then(({ data }) => setData(data.data))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); router.push('/'); };

  const stats = data?.stats;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 glass border-r border-white/[0.06] flex flex-col">
        <div className="p-6 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <RiFlashlightLine className="text-white text-xl" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">GOD<span className="text-gradient">MODE</span></p>
              <p className="text-white/30 text-xs">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: '/admin',          icon: RiStoreLine,      label: 'Dashboard' },
            { href: '/admin/products', icon: RiShoppingBagLine, label: 'Products' },
            { href: '/admin/orders',   icon: RiFileListLine,   label: 'Orders' },
            { href: '/admin/users',    icon: RiUser3Line,      label: 'Users' },
            { href: '/admin/coupons',  icon: RiPriceTag3Line,        label: 'Coupons' },
          ].map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
              <Icon className="text-lg" />{label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{user?.name?.[0]}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-white/30 text-xs">Admin</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm">
            <RiLogoutBoxLine /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white">Dashboard</h1>
          <p className="text-white/40 mt-1">Welcome back, {user?.name?.split(' ')[0]}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue',  value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: RiMoneyDollarCircleLine, color: 'from-orange-500 to-orange-600' },
            { label: 'Total Orders',   value: stats?.totalOrders   || 0, icon: RiShoppingBagLine, color: 'from-blue-500 to-blue-600' },
            { label: 'Total Products', value: stats?.totalProducts || 0, icon: RiStoreLine,        color: 'from-purple-500 to-purple-600' },
            { label: 'Total Users',    value: stats?.totalUsers    || 0, icon: RiUser3Line,        color: 'from-green-500 to-green-600' },
          ].map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl border border-white/[0.06] p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="text-white text-xl" />
              </div>
              {loading ? (
                <Skeleton className="h-8 w-24 mb-1" />
              ) : (
                <p className="font-display font-bold text-2xl text-white">{stat.value}</p>
              )}
              <p className="text-white/40 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { href: '/admin/products', label: 'Manage Products', icon: RiShoppingBagLine, desc: 'Add, edit, delete products' },
            { href: '/admin/orders',   label: 'View Orders',     icon: RiFileListLine,    desc: 'Update order statuses' },
            { href: '/admin/coupons',  label: 'Manage Coupons',  icon: RiPriceTag3Line,         desc: 'Create discount codes' },
          ].map(({ href, label, icon: Icon, desc }) => (
            <Link key={href} href={href}
              className="glass rounded-2xl border border-white/[0.06] p-5 hover:border-orange-500/30 transition-all group">
              <Icon className="text-2xl text-orange-400 mb-3" />
              <p className="text-white font-semibold text-sm">{label}</p>
              <p className="text-white/40 text-xs mt-1">{desc}</p>
              <RiArrowRightLine className="text-white/20 group-hover:text-orange-400 transition-colors mt-3" />
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="glass rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Recent Orders</h3>
            <Link href="/admin/orders" className="text-orange-400 text-sm hover:text-orange-300 transition-colors">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full admin-table">
                <thead>
                  <tr>
                    <th>Order</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recentOrders?.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <Link href="/admin/orders" className="text-orange-400 hover:text-orange-300">
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td>{order.user?.name || 'Unknown'}</td>
                      <td className="price-tag">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                      <td><Badge variant={STATUS_COLORS[order.status]}>{order.status}</Badge></td>
                      <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}