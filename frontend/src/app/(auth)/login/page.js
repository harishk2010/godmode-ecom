'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiFlashlightLine, RiArrowLeftLine } from 'react-icons/ri';
import { useAuthStore } from '@/context/AuthStore';
import { useCartStore } from '@/context/CartStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const { fetchCart } = useCartStore();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) {
      await fetchCart();
      router.push('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />
      </div>

      {/* Back */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
        <RiArrowLeftLine /> Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-strong rounded-3xl border border-white/10 p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-glow">
              <RiFlashlightLine className="text-white text-3xl" />
            </div>
            <div className="text-center">
              <h1 className="font-display font-bold text-2xl text-white">Welcome back</h1>
              <p className="text-white/40 text-sm mt-1">Sign in to your GOD MODE account</p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/60">Email Address</label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-field pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/60">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <RiEyeOffLine className="text-lg" /> : <RiEyeLine className="text-lg" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-base mt-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-white/40 text-xs text-center mb-2">Demo accounts</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setForm({ email: 'admin@godmode.com', password: 'admin123' })}
                className="text-xs py-1.5 px-3 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => setForm({ email: 'user@godmode.com', password: 'user1234' })}
                className="text-xs py-1.5 px-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
              >
                User
              </button>
            </div>
          </div>

          <p className="text-center text-white/40 text-sm mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
