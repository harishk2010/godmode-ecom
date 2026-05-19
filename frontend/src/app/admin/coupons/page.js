'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RiArrowLeftLine, RiAddLine, RiDeleteBinLine, RiPriceTag3Line } from 'react-icons/ri';
import { adminAPI } from '@/lib/api';
import { useAuthStore } from '@/context/AuthStore';
import { Badge, Modal, Button, Input } from '@/components/ui';
import toast from 'react-hot-toast';

const emptyCoupon = { code: '', type: 'percentage', value: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', isActive: true };

export default function AdminCouponsPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyCoupon);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin()) { router.push('/'); return; }
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try { const { data } = await adminAPI.getCoupons(); setCoupons(data.data.coupons); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await adminAPI.createCoupon({ ...form, value: Number(form.value), minOrderAmount: Number(form.minOrderAmount) || 0, maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null, usageLimit: form.usageLimit ? Number(form.usageLimit) : null });
      toast.success('Coupon created!');
      setShowModal(false);
      setForm(emptyCoupon);
      fetchCoupons();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try { await adminAPI.deleteCoupon(id); toast.success('Coupon deleted'); fetchCoupons(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <RiArrowLeftLine className="text-xl" />
          </Link>
          <h1 className="font-display font-bold text-3xl text-white">Coupons</h1>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <RiAddLine /> New Coupon
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="glass rounded-2xl border border-white/[0.06] p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <RiPriceTag3Line className="text-orange-400 text-xl" />
                <span className="font-mono font-bold text-white">{coupon.code}</span>
              </div>
              <button onClick={() => handleDelete(coupon._id)} className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <RiDeleteBinLine />
              </button>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Discount</span>
                <span className="text-white font-medium">
                  {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                </span>
              </div>
              {coupon.minOrderAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/40">Min Order</span>
                  <span className="text-white/70 price-tag">₹{coupon.minOrderAmount}</span>
                </div>
              )}
              {coupon.maxDiscount && (
                <div className="flex justify-between">
                  <span className="text-white/40">Max Discount</span>
                  <span className="text-white/70 price-tag">₹{coupon.maxDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-white/40">Used</span>
                <span className="text-white/70">{coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}</span>
              </div>
            </div>
            <div className="mt-3">
              <Badge variant={coupon.isActive ? 'green' : 'red'}>{coupon.isActive ? 'Active' : 'Inactive'}</Badge>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Coupon" size="md">
        <div className="space-y-4">
          <Input label="Code *" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SUMMER20" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-field [&>option]:bg-[#1e1e2a]">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (₹)</option>
              </select>
            </div>
            <Input label={`Value (${form.type === 'percentage' ? '%' : '₹'}) *`} type="number" value={form.value}
              onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder="10" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Order (₹)" type="number" value={form.minOrderAmount}
              onChange={e => setForm(f => ({ ...f, minOrderAmount: e.target.value }))} placeholder="0" />
            {form.type === 'percentage' && (
              <Input label="Max Discount (₹)" type="number" value={form.maxDiscount}
                onChange={e => setForm(f => ({ ...f, maxDiscount: e.target.value }))} placeholder="Optional" />
            )}
          </div>
          <Input label="Usage Limit" type="number" value={form.usageLimit}
            onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))} placeholder="Unlimited" />
          <div className="flex gap-3 pt-2">
            <Button onClick={() => setShowModal(false)} variant="secondary" className="flex-1">Cancel</Button>
            <Button onClick={handleCreate} loading={saving} variant="primary" className="flex-1">Create Coupon</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
