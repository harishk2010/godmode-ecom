'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '@/lib/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        if (typeof window !== 'undefined') {
          if (token) localStorage.setItem('godmode_token', token);
          else localStorage.removeItem('godmode_token');
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.login({ email, password });
          set({ user: data.data.user, token: data.data.token, isLoading: false });
          if (typeof window !== 'undefined') {
            localStorage.setItem('godmode_token', data.data.token);
          }
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.register({ name, email, password });
          set({ user: data.data.user, token: data.data.token, isLoading: false });
          if (typeof window !== 'undefined') {
            localStorage.setItem('godmode_token', data.data.token);
          }
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
      },

      logout: () => {
        set({ user: null, token: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('godmode_token');
        }
      },

      fetchMe: async () => {
        try {
          const { data } = await authAPI.getMe();
          set({ user: data.data.user });
        } catch {
          get().logout();
        }
      },

      updateProfile: async (profileData) => {
        try {
          const { data } = await authAPI.updateProfile(profileData);
          set({ user: data.data.user });
          return { success: true };
        } catch (error) {
          return { success: false, message: error.response?.data?.message || 'Update failed' };
        }
      },

      isAuthenticated: () => !!get().token,
      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'godmode-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
