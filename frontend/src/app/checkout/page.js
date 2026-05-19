'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RiShieldCheckLine, RiMapPinLine, RiBankCardLine, RiMotorbikeLine, RiCheckLine } from 'react-icons/ri';
import ShopLayout from '@/components/layout/ShopLayout';
import { useCartStore } from '@/context/CartStore';
import { useAuthStore } from '@/context/AuthStore';
import { orderAPI } from '@/lib/api';
import { Button, Input } from '@/components/ui';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: RiMotorbikeLine, desc: 'Pay when you receive' },
  { id: 'razorpay', label: 'Razorpay', icon: RiBankCardLine, desc: 'Cards, UPI, Netbanking' },
  { id: 'card', label: 'Credit/Debit Card', icon: RiBankCardLine, desc: 'Visa, Mastercard, Rupay' },
];

const STEPS = ['Address', 'Payment', 'Review'];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getSubtotal, fetchCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: 'India',
  });

  useEffect(() => {
    if (!isAuthenticated()) router.push('/login');
    else fetchCart();
  }, []);

  const subtotal = getSubtotal();
  const shipping = subtotal > 500 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const discount = cart?.discount || 0;
  const total = subtotal + shipping + tax - discount;

  const handleAddressNext = (e) => {
    e.preventDefault();
    const required = ['name', 'phone', 'street', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!address[field]) { toast.error(`${field} is required`); return; }
    }
    setStep(1);
  };

  const handlePaymentNext = () => setStep(2);

  const mockRazorpay = () => {
    return new Promise((resolve) => {
      toast('Processing payment...', { icon: '⚡' });
      setTimeout(() => {
        resolve({ razorpay_payment_id: 'pay_' + Date.now(), status: 'success', updateTime: new Date().toISOString() });
      }, 2000);
    });
  };

  const handlePlaceOrder = async () => {
    if (!cart?.items?.length) { toast.error('Cart is empty'); return; }
    setPlacing(true);
    try {
      let paymentResult = null;

      if (paymentMethod === 'razorpay') {
        paymentResult = await mockRazorpay();
      }

      const { data } = await orderAPI.create({
        shippingAddress: address,
        paymentMethod,
        ...(paymentResult && { paymentResult }),
      });

      toast.success('Order placed successfully! 🎉');
      router.push(`/orders/${data.data.order._id}?success=true`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <ShopLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display font-bold text-3xl text-white mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                i === step ? 'bg-orange-500 text-white' : i < step ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'
              }`}>
                {i < step ? <RiCheckLine /> : <span className="text-sm font-semibold">{i + 1}</span>}
                <span className="text-sm font-medium hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px max-w-[60px] ${i < step ? 'bg-green-500/40' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Form */}
          <div className="lg:col-span-2">
            {/* Step 0 – Address */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl border border-white/[0.06] p-6">
                <h2 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
                  <RiMapPinLine className="text-orange-400" /> Shipping Address
                </h2>
                <form onSubmit={handleAddressNext} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Full Name" placeholder="John Doe" value={address.name}
                      onChange={(e) => setAddress(a => ({ ...a, name: e.target.value }))} required />
                    <Input label="Phone Number" placeholder="+91 9876543210" value={address.phone}
                      onChange={(e) => setAddress(a => ({ ...a, phone: e.target.value }))} required />
                  </div>
                  <Input label="Street Address" placeholder="123, MG Road, Apartment 4B" value={address.street}
                    onChange={(e) => setAddress(a => ({ ...a, street: e.target.value }))} required />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input label="City" placeholder="Mumbai" value={address.city}
                      onChange={(e) => setAddress(a => ({ ...a, city: e.target.value }))} required />
                    <Input label="State" placeholder="Maharashtra" value={address.state}
                      onChange={(e) => setAddress(a => ({ ...a, state: e.target.value }))} required />
                    <Input label="PIN Code" placeholder="400001" value={address.zipCode}
                      onChange={(e) => setAddress(a => ({ ...a, zipCode: e.target.value }))} required />
                  </div>
                  <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
                    Continue to Payment
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Step 1 – Payment */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl border border-white/[0.06] p-6">
                <h2 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
                  <RiBankCardLine className="text-orange-400" /> Payment Method
                </h2>
                <div className="space-y-3 mb-6">
                  {PAYMENT_METHODS.map((pm) => (
                    <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === pm.id ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                      }`}>
                      <pm.icon className={`text-2xl ${paymentMethod === pm.id ? 'text-orange-400' : 'text-white/50'}`} />
                      <div className="text-left">
                        <p className={`font-medium text-sm ${paymentMethod === pm.id ? 'text-white' : 'text-white/70'}`}>{pm.label}</p>
                        <p className="text-white/30 text-xs">{pm.desc}</p>
                      </div>
                      {paymentMethod === pm.id && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                          <RiCheckLine className="text-white text-xs" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'razorpay' && (
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4">
                    <p className="text-blue-400 text-sm flex items-center gap-2">
                      <RiShieldCheckLine /> This is a mock Razorpay integration for demo purposes.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={() => setStep(0)} variant="secondary" className="flex-1">Back</Button>
                  <Button onClick={handlePaymentNext} variant="primary" className="flex-1">Review Order</Button>
                </div>
              </motion.div>
            )}

            {/* Step 2 – Review */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-4">
                {/* Address Review */}
                <div className="glass rounded-2xl border border-white/[0.06] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white flex items-center gap-2"><RiMapPinLine className="text-orange-400" /> Delivery Address</h3>
                    <button onClick={() => setStep(0)} className="text-orange-400 text-xs hover:text-orange-300">Edit</button>
                  </div>
                  <div className="text-white/60 text-sm space-y-0.5">
                    <p className="text-white font-medium">{address.name}</p>
                    <p>{address.phone}</p>
                    <p>{address.street}, {address.city}</p>
                    <p>{address.state} - {address.zipCode}</p>
                  </div>
                </div>

                {/* Payment Review */}
                <div className="glass rounded-2xl border border-white/[0.06] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white flex items-center gap-2"><RiBankCardLine className="text-orange-400" /> Payment</h3>
                    <button onClick={() => setStep(1)} className="text-orange-400 text-xs hover:text-orange-300">Edit</button>
                  </div>
                  <p className="text-white/60 text-sm capitalize">{PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}</p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => setStep(1)} variant="secondary" className="flex-1">Back</Button>
                  <Button onClick={handlePlaceOrder} loading={placing} variant="primary" className="flex-1" size="lg">
                    Place Order (₹{total.toLocaleString('en-IN')})
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="glass rounded-2xl border border-white/[0.06] p-5 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                {cart?.items?.map((item) => (
                  <div key={item.product?._id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                      <img src={item.product?.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium line-clamp-1">{item.product?.name}</p>
                      <p className="text-white/40 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="price-tag text-white text-xs font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-white/60"><span>Subtotal</span><span className="price-tag">₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-sm text-white/60"><span>Shipping</span><span className={shipping === 0 ? 'text-green-400' : 'price-tag'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="flex justify-between text-sm text-white/60"><span>GST (18%)</span><span className="price-tag">₹{tax.toLocaleString('en-IN')}</span></div>
                {discount > 0 && <div className="flex justify-between text-sm text-green-400"><span>Discount</span><span>-₹{discount.toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between font-bold text-white border-t border-white/10 pt-2"><span>Total</span><span className="price-tag text-orange-400">₹{total.toLocaleString('en-IN')}</span></div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
                <RiShieldCheckLine className="text-green-400" /> Secured with 256-bit encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
