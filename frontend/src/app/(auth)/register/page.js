'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RiMailLine, RiLockLine, RiUser3Line, RiEyeLine, RiEyeOffLine, RiFlashlightLine, RiArrowLeftLine, RiCheckLine } from 'react-icons/ri';
import { useAuthStore } from '@/context/AuthStore';
import { useCartStore } from '@/context/CartStore';

const passwordStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const { fetchCart } = useCartStore();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const strength = passwordStrength(form.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }

    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      await fetchCart();
      router.push('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden py-12">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />
      </div>

      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
        <RiArrowLeftLine /> Back to Home
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="glass-strong rounded-3xl border border-white/10 p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-glow">
              <RiFlashlightLine className="text-white text-3xl" />
            </div>
            <div className="text-center">
              <h1 className="font-display font-bold text-2xl text-white">Create Account</h1>
              <p className="text-white/40 text-sm mt-1">Join GOD MODE for free</p>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/60">Full Name</label>
              <div className="relative">
                <RiUser3Line className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
                <input type="text" required placeholder="John Doe" value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field pl-11" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/60">Email Address</label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
                <input type="email" required placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-field pl-11" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/60">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
                <input type={showPassword ? 'text' : 'password'} required placeholder="Min. 6 characters" value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pl-11 pr-11" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <RiEyeOffLine className="text-lg" /> : <RiEyeLine className="text-lg" />}
                </button>
              </div>
              {form.password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${strengthColors[strength].replace('bg-', 'text-')}`}>
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/60">Confirm Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
                <input type="password" required placeholder="Repeat password" value={form.confirmPassword}
                  onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  className="input-field pl-11 pr-11" />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <RiCheckLine className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-400 text-lg" />
                )}
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 text-base mt-2">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
