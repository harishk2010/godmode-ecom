'use client';
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { useAuthStore } from '@/context/AuthStore';
import { useCartStore } from '@/context/CartStore';

export default function ShopLayout({ children }) {
  const { isAuthenticated, fetchMe, token } = useAuthStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    if (token) {
      fetchMe();
      if (isAuthenticated()) fetchCart();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
