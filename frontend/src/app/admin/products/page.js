'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiSearchLine, RiArrowLeftLine, RiFlashlightLine } from 'react-icons/ri';
import { adminAPI } from '@/lib/api';
import { useAuthStore } from '@/context/AuthStore';
import { Badge, Modal, Button, Input, Skeleton } from '@/components/ui';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books', 'Beauty', 'Toys', 'Food', 'Automotive', 'Other'];

const emptyProduct = {
  name: '', description: '', shortDescription: '', price: '', comparePrice: '',
  discount: '0', category: 'Electronics', brand: '', stock: '', sku: '',
  isFeatured: false, isActive: true, tags: '',
  images: [{ url: '', alt: '' }],
};

export default function AdminProductsPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!isAdmin()) router.push('/'); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getProducts({ page, limit: 15, search });
      setProducts(data.data);
      setPagination(data.pagination);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  const openCreate = () => { setEditProduct(null); setForm(emptyProduct); setShowModal(true); };
  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      ...product,
      tags: product.tags?.join(', ') || '',
      images: product.images?.length ? product.images : [{ url: '', alt: '' }],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        comparePrice: Number(form.comparePrice) || 0,
        discount: Number(form.discount) || 0,
        stock: Number(form.stock),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
        images: form.images.filter(img => img.url),
      };

      if (editProduct) {
        await adminAPI.updateProduct(editProduct._id, payload);
        toast.success('Product updated!');
      } else {
        await adminAPI.createProduct(payload);
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-colors">
          <RiArrowLeftLine className="text-xl" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display font-bold text-3xl text-white">Products</h1>
          <p className="text-white/40 text-sm">{pagination.total || 0} total products</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <RiAddLine /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        <input type="text" placeholder="Search products..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field pl-10" />
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Featured</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={7}><Skeleton className="h-14 w-full my-1" /></td></tr>
                ))
              ) : products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                        <img src={product.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm line-clamp-1 max-w-[200px]">{product.name}</p>
                        <p className="text-white/30 text-xs">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td><Badge variant="orange">{product.category}</Badge></td>
                  <td className="price-tag">₹{product.price.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={product.stock === 0 ? 'text-red-400' : product.stock < 10 ? 'text-yellow-400' : 'text-green-400'}>
                      {product.stock}
                    </span>
                  </td>
                  <td><Badge variant={product.isActive ? 'green' : 'red'}>{product.isActive ? 'Active' : 'Inactive'}</Badge></td>
                  <td>{product.isFeatured ? <span className="text-orange-400 text-sm">★ Yes</span> : <span className="text-white/20 text-sm">No</span>}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(product)} className="p-2 rounded-lg text-blue-400/60 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                        <RiEditLine />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="p-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* Product Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editProduct ? 'Edit Product' : 'Add Product'} size="2xl">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Product Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product name" />
            <Input label="Brand" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Brand name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Description *</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Product description..." className="input-field resize-none" />
          </div>

          <Input label="Short Description" value={form.shortDescription}
            onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} placeholder="Brief tagline" />

          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="Price (₹) *" type="number" value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" />
            <Input label="Compare Price" type="number" value={form.comparePrice}
              onChange={e => setForm(f => ({ ...f, comparePrice: e.target.value }))} placeholder="0" />
            <Input label="Discount (%)" type="number" min="0" max="100" value={form.discount}
              onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} placeholder="0" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Category *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="input-field [&>option]:bg-[#1e1e2a]">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Input label="Stock *" type="number" value={form.stock}
              onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" />
          </div>

          <Input label="Tags (comma separated)" value={form.tags}
            onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="electronics, wireless, audio" />

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Image URLs</label>
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="url" value={img.url} placeholder="https://..." onChange={e => {
                  const imgs = [...form.images]; imgs[i] = { ...imgs[i], url: e.target.value };
                  setForm(f => ({ ...f, images: imgs }));
                }} className="input-field flex-1 text-sm" />
                {i === form.images.length - 1 && (
                  <button onClick={() => setForm(f => ({ ...f, images: [...f.images, { url: '', alt: '' }] }))}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                    <RiAddLine />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured}
                onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                className="w-4 h-4 accent-orange-500" />
              <span className="text-sm text-white/60">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive}
                onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                className="w-4 h-4 accent-orange-500" />
              <span className="text-sm text-white/60">Active</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
          <Button onClick={() => setShowModal(false)} variant="secondary" className="flex-1">Cancel</Button>
          <Button onClick={handleSave} loading={saving} variant="primary" className="flex-1">
            {editProduct ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
