'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  RiStarFill, RiStarLine, RiShoppingCartLine, RiHeartLine, RiHeartFill,
  RiTruckLine, RiShieldCheckLine, RiArrowLeftLine, RiShareLine,
  RiAddLine, RiSubtractLine, RiCheckLine
} from 'react-icons/ri';
import ShopLayout from '@/components/layout/ShopLayout';
import { Skeleton, Badge, Button } from '@/components/ui';
import { productAPI, wishlistAPI } from '@/lib/api';
import { useCartStore } from '@/context/CartStore';
import { useAuthStore } from '@/context/AuthStore';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, setOpen } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [tab, setTab] = useState('description');

  useEffect(() => {
    productAPI.getOne(id)
      .then(({ data }) => { setProduct(data.data.product); setLoading(false); })
      .catch(() => { toast.error('Product not found'); router.push('/products'); });
  }, [id]);

  const discountedPrice = product?.discount > 0
    ? product.price - (product.price * product.discount / 100)
    : product?.price;

  const handleAddToCart = async () => {
    if (!isAuthenticated()) { toast.error('Please login to add to cart'); return; }
    setAdding(true);
    await addToCart(product._id, quantity);
    setAdding(false);
    setOpen(true);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated()) { toast.error('Please login'); return; }
    try {
      if (wishlisted) { await wishlistAPI.remove(product._id); setWishlisted(false); toast.success('Removed from wishlist'); }
      else { await wishlistAPI.add(product._id); setWishlisted(true); toast.success('Added to wishlist ❤️'); }
    } catch { toast.error('Something went wrong'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) { toast.error('Please login to review'); return; }
    setSubmittingReview(true);
    try {
      const { data } = await productAPI.addReview(product._id, reviewForm);
      setProduct(data.data.product);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmittingReview(false); }
  };

  if (loading) {
    return (
      <ShopLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-orange-400 transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product?.category}`} className="hover:text-orange-400 transition-colors">{product?.category}</Link>
          <span>/</span>
          <span className="text-white/60 line-clamp-1">{product?.name}</span>
        </div>

        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 text-sm">
          <RiArrowLeftLine /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] product-image-container"
            >
              <Image
                src={product?.images?.[selectedImage]?.url || ''}
                alt={product?.name}
                fill
                className="object-cover"
                priority
              />
              {product?.discount > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-orange-500 text-white text-sm font-bold">
                  -{product.discount}% OFF
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product?.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-orange-500 shadow-glow-sm' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Brand & Category */}
            <div className="flex items-center gap-3">
              <Badge variant="orange">{product?.category}</Badge>
              {product?.brand && <span className="text-white/40 text-sm">{product.brand}</span>}
            </div>

            {/* Name */}
            <h1 className="font-display font-bold text-2xl md:text-3xl text-white leading-snug">
              {product?.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <RiStarFill key={s} className={`text-lg ${s <= Math.round(product?.rating) ? 'text-yellow-400' : 'text-white/10'}`} />
                ))}
              </div>
              <span className="text-white/60 text-sm">{product?.rating} ({product?.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="price-tag font-bold text-4xl text-white">
                ₹{Math.round(discountedPrice).toLocaleString('en-IN')}
              </span>
              {product?.discount > 0 && (
                <>
                  <span className="price-tag text-xl text-white/30 line-through mb-1">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <Badge variant="green" className="mb-1">Save ₹{Math.round(product.price - discountedPrice).toLocaleString('en-IN')}</Badge>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product?.stock > 0 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-sm font-medium">
                    {product.stock <= 10 ? `Only ${product.stock} left!` : 'In Stock'}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-red-400 text-sm font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Short description */}
            {product?.shortDescription && (
              <p className="text-white/60 leading-relaxed">{product.shortDescription}</p>
            )}

            {/* Quantity + CTA */}
            {product?.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-white/60">Quantity:</span>
                  <div className="flex items-center glass border border-white/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <RiSubtractLine />
                    </button>
                    <span className="px-4 py-3 text-white font-semibold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <RiAddLine />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    loading={adding}
                    className="flex-1 py-4 text-base"
                    variant="primary"
                  >
                    <RiShoppingCartLine className="text-xl" />
                    Add to Cart
                  </Button>
                  <button
                    onClick={handleWishlist}
                    className={`p-4 rounded-xl glass border border-white/10 hover:border-white/20 transition-all ${wishlisted ? 'text-red-400' : 'text-white/50 hover:text-white'}`}
                  >
                    {wishlisted ? <RiHeartFill className="text-xl" /> : <RiHeartLine className="text-xl" />}
                  </button>
                  <button className="p-4 rounded-xl glass border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all">
                    <RiShareLine className="text-xl" />
                  </button>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: RiTruckLine, text: 'Free delivery over ₹500', color: 'text-blue-400' },
                { icon: RiShieldCheckLine, text: 'Secure payment', color: 'text-green-400' },
                { icon: RiCheckLine, text: 'Easy 30-day returns', color: 'text-purple-400' },
                { icon: RiCheckLine, text: 'Genuine product', color: 'text-orange-400' },
              ].map(({ icon: Icon, text, color }, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-white/50">
                  <Icon className={`${color} flex-shrink-0`} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-1 border-b border-white/10 mb-8">
            {['description', 'reviews'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-3 text-sm font-medium capitalize transition-all relative ${
                  tab === t ? 'text-orange-400' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {t} {t === 'reviews' && `(${product?.numReviews || 0})`}
                {tab === t && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </button>
            ))}
          </div>

          {tab === 'description' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="prose max-w-none">
              <p className="text-white/60 leading-relaxed text-base">{product?.description}</p>
              {product?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="default">#{tag}</Badge>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'reviews' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Review Form */}
              {isAuthenticated() && (
                <div className="glass rounded-2xl border border-white/[0.06] p-6">
                  <h3 className="font-semibold text-white mb-4">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Your Rating</label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                            className={`text-2xl transition-transform hover:scale-110 ${s <= reviewForm.rating ? 'text-yellow-400' : 'text-white/20'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      required
                      className="input-field resize-none"
                    />
                    <Button type="submit" loading={submittingReview} variant="primary">
                      Submit Review
                    </Button>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              {product?.reviews?.length === 0 ? (
                <p className="text-white/40 text-center py-8">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {product?.reviews?.map((review) => (
                    <div key={review._id} className="glass rounded-2xl border border-white/[0.06] p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{review.name?.[0]}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{review.name}</p>
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map((s) => (
                                <span key={s} className={`text-xs ${s <= review.rating ? 'text-yellow-400' : 'text-white/10'}`}>★</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-white/30 text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </ShopLayout>
  );
}
