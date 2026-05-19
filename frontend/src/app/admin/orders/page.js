'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RiArrowLeftLine } from 'react-icons/ri';
import { adminAPI } from '@/lib/api';
import { useAuthStore } from '@/context/AuthStore';
import { Badge, Modal, Button, Skeleton } from '@/components/ui';
import toast from 'react-hot-toast';

const STATUS_COLORS = { pending: 'yellow', confirmed: 'blue', processing: 'purple', shipped: 'orange', delivered: 'green', cancelled: 'red' };
const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => { if (!isAdmin()) router.push('/'); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getOrders({ page, limit: 20, ...(statusFilter && { status: statusFilter }) });
      setOrders(data.data);
      setPagination(data.pagination);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    setUpdating(true);
    try {
      await adminAPI.updateOrderStatus(selectedOrder._id, { status: newStatus });
      toast.success('Order status updated');
      setSelectedOrder(null);
      fetchOrders();
    } catch { toast.error('Failed to update'); } finally { setUpdating(false); }
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-colors">
          <RiArrowLeftLine className="text-xl" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Orders</h1>
          <p className="text-white/40 text-sm">{pagination.total || 0} total orders</p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => { setStatusFilter(''); setPage(1); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!statusFilter ? 'bg-orange-500 text-white' : 'glass border border-white/10 text-white/60 hover:text-white'}`}>
          All
        </button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${statusFilter === s ? 'bg-orange-500 text-white' : 'glass border border-white/10 text-white/60 hover:text-white'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead><tr className="border-b border-white/[0.06]">
              <th>Order #</th><th>Customer</th><th>Items</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th>
            </tr></thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={8}><Skeleton className="h-14 w-full my-1" /></td></tr>
              )) : orders.map((order) => (
                <tr key={order._id}>
                  <td><span className="text-orange-400 font-mono text-xs">#{order.orderNumber}</span></td>
                  <td>
                    <p className="text-white text-sm">{order.user?.name || 'Unknown'}</p>
                    <p className="text-white/30 text-xs">{order.user?.email}</p>
                  </td>
                  <td><span className="text-white/60">{order.items.length} items</span></td>
                  <td className="price-tag font-semibold">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                  <td><span className="text-white/60 capitalize text-xs">{order.paymentMethod}</span></td>
                  <td><Badge variant={STATUS_COLORS[order.status]}>{order.status}</Badge></td>
                  <td><span className="text-white/40 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span></td>
                  <td>
                    <button onClick={() => { setSelectedOrder(order); setNewStatus(order.status); }}
                      className="text-orange-400 text-xs hover:text-orange-300 transition-colors">Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
            <p className="text-white/40 text-sm">Page {page} of {pagination.totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-30">Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.totalPages} className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-30">Next</button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Update Order #${selectedOrder?.orderNumber}`} size="sm">
        {selectedOrder && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">New Status</label>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                className="input-field [&>option]:bg-[#1e1e2a]">
                {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setSelectedOrder(null)} variant="secondary" className="flex-1">Cancel</Button>
              <Button onClick={handleUpdateStatus} loading={updating} variant="primary" className="flex-1">Update</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
