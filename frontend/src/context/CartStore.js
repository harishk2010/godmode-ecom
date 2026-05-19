'use client';
import { create } from 'zustand';
import { cartAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export const useCartStore = create((set, get) => ({
  cart: null,
  isLoading: false,
  isOpen: false,

  setOpen: (open) => set({ isOpen: open }),

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await cartAPI.get();
      set({ cart: data.data.cart, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const { data } = await cartAPI.add({ productId, quantity });
      set({ cart: data.data.cart });
      toast.success('Added to cart!', { icon: '🛒' });
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add to cart';
      toast.error(msg);
      return { success: false, message: msg };
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const { data } = await cartAPI.update({ productId, quantity });
      set({ cart: data.data.cart });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  },

  removeFromCart: async (productId) => {
    try {
      const { data } = await cartAPI.remove(productId);
      set({ cart: data.data.cart });
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  },

  clearCart: async () => {
    try {
      const { data } = await cartAPI.clear();
      set({ cart: data.data.cart });
    } catch {}
  },

  applyCoupon: async (code) => {
    try {
      const { data } = await cartAPI.applyCoupon(code);
      set({ cart: data.data.cart });
      toast.success(`Coupon applied! Saved ₹${data.data.discount}`);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid coupon';
      toast.error(msg);
      return { success: false, message: msg };
    }
  },

  removeCoupon: async () => {
    try {
      const { data } = await cartAPI.removeCoupon();
      set({ cart: data.data.cart });
      toast.success('Coupon removed');
    } catch {}
  },

  getCartCount: () => {
    const { cart } = get();
    return cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  },

  getSubtotal: () => {
    const { cart } = get();
    return cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().cart?.discount || 0;
    const shipping = subtotal > 500 ? 0 : 49;
    const tax = Math.round(subtotal * 0.18);
    return subtotal + shipping + tax - discount;
  },
}));
