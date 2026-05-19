'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  RiFilterLine, RiGridLine, RiListCheck2, RiSearchLine,
  RiCloseLine, RiArrowUpDownLine
} from 'react-icons/ri';
import ShopLayout from '@/components/layout/ShopLayout';
import ProductCard from '@/components/products/ProductCard';
import { ProductCardSkeleton, Pagination, EmptyState } from '@/components/ui';
import { productAPI } from '@/lib/api';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books', 'Beauty', 'Toys', 'Food', 'Automotive', 'Other'];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      params.sort = filters.sort;
      params.page = filters.page;
      params.limit = 12;

      const { data } = await productAPI.getAll(params);
      setProducts(data.data);
      setPagination(data.pagination);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 });
    router.push('/products');
  };

  const activeFilterCount = [filters.category, filters.minPrice, filters.maxPrice].filter(Boolean).length;

  return (
    <ShopLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">
            {filters.category ? filters.category : filters.search ? `Results for "${filters.search}"` : 'All Products'}
          </h1>
          {pagination.total > 0 && (
            <p className="text-white/40 text-sm">{pagination.total} products found</p>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
            <div className="glass rounded-2xl border border-white/[0.06] p-5 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
                    Clear all ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Category */}
              <div>
                <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!filters.category ? 'bg-orange-500/20 text-orange-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateFilter('category', cat)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${filters.category === cat ? 'bg-orange-500/20 text-orange-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Price Range</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="input-field text-sm py-2"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="input-field text-sm py-2"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="input-field pl-10 py-2.5 text-sm"
                />
                {filters.search && (
                  <button
                    onClick={() => updateFilter('search', '')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                  >
                    <RiCloseLine />
                  </button>
                )}
              </div>

              {/* Sort */}
              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="input-field py-2.5 text-sm w-auto min-w-[160px] cursor-pointer [&>option]:bg-[#1e1e2a]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden btn-secondary py-2.5 flex items-center gap-2 text-sm"
              >
                <RiFilterLine />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="lg:hidden glass rounded-2xl border border-white/[0.06] p-5 mb-6 overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-white/50 mb-2">Category</h4>
                    <select
                      value={filters.category}
                      onChange={(e) => updateFilter('category', e.target.value)}
                      className="input-field text-sm py-2 [&>option]:bg-[#1e1e2a]"
                    >
                      <option value="">All</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white/50 mb-2">Price Range</h4>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="input-field text-sm py-2 w-1/2" />
                      <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="input-field text-sm py-2 w-1/2" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Active filter chips */}
            {(filters.category || filters.search) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.category && (
                  <span className="badge-orange flex items-center gap-1.5">
                    {filters.category}
                    <button onClick={() => updateFilter('category', '')}><RiCloseLine /></button>
                  </span>
                )}
                {filters.search && (
                  <span className="badge-blue flex items-center gap-1.5">
                    "{filters.search}"
                    <button onClick={() => updateFilter('search', '')}><RiCloseLine /></button>
                  </span>
                )}
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(9).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon={RiSearchLine}
                title="No products found"
                description="Try adjusting your search or filters to find what you're looking for."
                action={
                  <button onClick={clearFilters} className="btn-primary">
                    Clear Filters
                  </button>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product, i) => (
                    <ProductCard key={product._id} product={product} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={(page) => updateFilter('page', page)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
