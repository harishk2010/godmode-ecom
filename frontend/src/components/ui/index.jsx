'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLine } from 'react-icons/ri';
import { clsx } from 'clsx';

// Button
export function Button({ children, variant = 'primary', size = 'md', className, loading, disabled, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white rounded-xl shadow-glow-sm hover:shadow-glow',
    secondary: 'glass border border-white/10 text-white hover:bg-white/10 rounded-xl',
    ghost: 'text-white/70 hover:text-white hover:bg-white/5 rounded-lg',
    danger: 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl',
    success: 'bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 rounded-xl',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
    xl: 'px-8 py-4 text-lg',
  };
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />}
      {children}
    </button>
  );
}

// Input
export function Input({ label, error, className, leftIcon, rightElement, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-white/70">{label}</label>}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-lg">
            {leftIcon}
          </div>
        )}
        <input
          className={clsx(
            'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/25 outline-none transition-all duration-200',
            error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-orange-500 focus:bg-white/10',
            leftIcon && 'pl-11',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// Select
export function Select({ label, error, className, children, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-white/70">{label}</label>}
      <select
        className={clsx(
          'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none',
          'focus:border-orange-500 transition-all duration-200 cursor-pointer',
          '[&>option]:bg-[#1e1e2a]',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// Textarea
export function Textarea({ label, error, className, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-white/70">{label}</label>}
      <textarea
        className={clsx(
          'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/25 outline-none resize-none transition-all duration-200',
          error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-orange-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// Skeleton
export function Skeleton({ className }) {
  return <div className={clsx('shimmer-bg rounded-xl', className)} />;
}

// Product card skeleton
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  );
}

// Modal
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl' };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={clsx('relative w-full glass-strong rounded-2xl border border-white/10 shadow-2xl', sizes[size])}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-display font-semibold text-white text-lg">{title}</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                <RiCloseLine className="text-xl" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Badge
export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-white/10 text-white/70',
    orange: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    green: 'bg-green-500/20 text-green-400 border border-green-500/30',
    red: 'bg-red-500/20 text-red-400 border border-red-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  };
  return (
    <span className={clsx('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  );
}

// Pagination
export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (i < 3) return i + 1;
    if (i === 3) return '...';
    return totalPages - (6 - i);
  });

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg glass border border-white/10 text-white/60 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
      >
        ← Prev
      </button>
      {pages.map((page, i) => (
        <button
          key={i}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={clsx(
            'w-9 h-9 rounded-lg text-sm font-medium transition-all',
            page === currentPage
              ? 'bg-orange-500 text-white shadow-glow-sm'
              : page === '...'
              ? 'text-white/30 cursor-default'
              : 'glass border border-white/10 text-white/60 hover:text-white hover:border-white/20'
          )}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg glass border border-white/10 text-white/60 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
      >
        Next →
      </button>
    </div>
  );
}

// Empty state
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
      <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center">
        {Icon && <Icon className="text-4xl text-white/20" />}
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        {description && <p className="text-white/40 text-sm mt-1 max-w-xs">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// Star rating display
export function StarRating({ rating, size = 'sm' }) {
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };
  return (
    <div className={clsx('flex', sizes[size])}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'text-yellow-400' : 'text-white/10'}>★</span>
      ))}
    </div>
  );
}
